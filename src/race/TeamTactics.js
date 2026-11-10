// The team principal's orders to a driver beyond the tyres, the fuel and the battery (ui/PitWall.js MODES): how the car
// is raced and how it is run. Each a row of buttons on the pit wall's RACECRAFT and CAR pages (ui/PitWall.js), each
// read by the AI through a field on the car that is absent - and so changes nothing - on every car that is not a team
// principal's:
//   ATTACK   how much is risked to pass: the driver's aggression (AIDriver: the gap left, the lunges, the room given -
//            and the mistakes, the contact and the stewards that come with it)
//   DEFEND   yield (never covers the inside) / normal / hard (covers it far more often)
//   MATE     race the team-mate, or take no risks with them (no defending against the sister car)
//   BLUE     blue flags: move over at once, or make the lapping car work for it (a few tenths kept - and a 5 s penalty
//            when it is held up for more than eight seconds)
//   LIMITS   tidy (half a car inside the white line: slower, never a warning) / normal / wide (every centimetre: a
//            little quicker - and the track-limit strikes that the stewards count)
//   SC       behind the safety car: save (less fuel, the tyres go cold: a slow restart) / normal / ready (tyres kept
//            hot for the restart: more wear and fuel)
//   BIAS     brake bias forward (stable, a little slower) / neutral / rearward (later on the brakes, harder on the rears)
//   DIFF     differential open (kind to the rear tyres, slower off the corners) / neutral / locked (traction, wear)
//   COOL     engine cooling: out of the slipstream on the straights - the engine stays cool (and keeps its power and its
//            reliability), the tow is given up and the car follows further back
export const ORDERS = {
  attack: { name: 'ATTACK', page: 'race', def: 'std', opts: {
    caut: { short: 'CAUT', label: 'Cautious', aggr: 0.6, title: 'Cautious: passes only when it is safe - few risks, few places gained' },
    std: { short: 'STD', label: 'Normal', aggr: 1, title: 'Normal racecraft' },
    aggr: { short: 'AGGR', label: 'Aggressive', aggr: 1.3, title: 'Aggressive: later on the brakes into a gap, less room given - more passes, more contact' },
    all: { short: 'ALL-IN', label: 'All-in', aggr: 1.65, title: 'All-in: every gap, every lap - places gained, and crashes and penalties' } } },
  defend: { name: 'DEFEND', page: 'race', def: 'std', opts: {
    easy: { short: 'YIELD', label: 'Yield', k: -1, title: 'Yield: never covers the inside - no time lost fighting a quicker car' },
    std: { short: 'STD', label: 'Normal', k: 0, title: 'Normal: covers the inside as the driver sees fit' },
    hard: { short: 'HARD', label: 'Hard', k: 0.35, title: 'Hard: the door shut at every corner - places kept, time and tyres lost' } } },
  mate: { name: 'MATE', page: 'race', def: 'free', opts: {
    free: { short: 'RACE', label: 'Race', title: 'Free to race the team-mate' },
    care: { short: 'NO RISK', label: 'No risks', title: 'No risks with the team-mate: no defending against the sister car' } } },
  blue: { name: 'BLUE', page: 'race', def: 'quick', opts: {
    quick: { short: 'MOVE', label: 'Move over', title: 'Blue flags: let the lapping car by at once' },
    late: { short: 'HOLD', label: 'Hold up', title: 'Blue flags: make them work for it - a little time kept, a 5 s penalty if the car is held up for 8 s' } } },
  limits: { name: 'LIMITS', page: 'race', def: 'std', opts: {
    tidy: { short: 'TIDY', label: 'Tidy', edge: -0.3, pace: 0.998, title: 'Tidy: well inside the white lines - a little slower, never a warning' },
    std: { short: 'STD', label: 'Normal', edge: 0, pace: 1, title: 'Normal use of the track' },
    wide: { short: 'WIDE', label: 'Wide', edge: 0.45, pace: 1.002, title: 'Wide: every centimetre and the kerbs - a little quicker, and the stewards count the strikes' } } },
  sc: { name: 'SC', page: 'race', def: 'std', opts: {
    save: { short: 'SAVE', label: 'Save', burn: 0.45, wear: 0.8, title: 'Behind the safety car: save fuel and tyres - they go cold, the restart is slow' },
    std: { short: 'STD', label: 'Normal', burn: 0.6, wear: 1, title: 'Behind the safety car: as the driver sees fit' },
    ready: { short: 'READY', label: 'Ready', burn: 0.72, wear: 1.15, title: 'Behind the safety car: tyres and brakes kept hot for the restart - more fuel, more wear' } } },
  launch: { name: 'LAUNCH', page: 'race', def: 'std', opts: {
    safe: { short: 'SAFE', label: 'Safe', dt: 0.03, bog: 0, title: 'The start: a safe clutch bite - three hundredths lost, never bogged down' },
    std: { short: 'STD', label: 'Normal', dt: 0, bog: 0.04, title: 'The start: as practised' },
    aggr: { short: 'AGGR', label: 'Aggressive', dt: -0.035, bog: 0.18, title: 'The start: on the edge of the clutch - quicker away, and now and then wheelspin and places lost' } } },
  lap1: { name: 'LAP 1', page: 'race', def: 'std', opts: {
    caut: { short: 'CAUT', label: 'Cautious', k: 0.6, title: 'The first lap: stay out of trouble' },
    std: { short: 'STD', label: 'Normal', k: 1, title: 'The first lap: as the driver sees fit' },
    att: { short: 'ATTACK', label: 'Attack', k: 1.45, title: 'The first lap: every gap - places won and noses lost' } } },
  bias: { name: 'BIAS', page: 'car', def: 'std', opts: {
    fwd: { short: 'FWD', label: 'Forward', pace: 0.9985, wear: 0.98, title: 'Brake bias forward: stable into the corners, a little slower, kind to the rear tyres' },
    std: { short: 'NEUT', label: 'Neutral', pace: 1, wear: 1, title: 'Brake bias neutral' },
    rear: { short: 'REAR', label: 'Rearward', pace: 1.0015, wear: 1.03, title: 'Brake bias rearward: later on the brakes, harder on the rear tyres' } } },
  diff: { name: 'DIFF', page: 'car', def: 'std', opts: {
    open: { short: 'OPEN', label: 'Open', power: 0.997, wear: 0.95, title: 'Differential open: kind to the rear tyres, slower off the corners' },
    std: { short: 'NEUT', label: 'Neutral', power: 1, wear: 1, title: 'Differential neutral' },
    lock: { short: 'LOCK', label: 'Locked', power: 1.003, wear: 1.05, title: 'Differential locked: traction off the corners, the rear tyres pay' } } },
  cool: { name: 'COOL', page: 'car', def: 'off', opts: {
    off: { short: 'OFF', label: 'Off', heat: 1, pace: 1, gap: 0, title: 'No cooling: in the slipstream as the driver likes' },
    on: { short: 'COOL', label: 'Cooling', heat: 0.35, pace: 0.997, gap: 9, title: 'Cool the car: out of the slipstream - the engine keeps its power and lasts, the tow is given up' } } },
};
export const defaultOrders = () => Object.fromEntries(Object.entries(ORDERS).map(([k, o]) => [k, o.def]));

/** a car's orders onto the car and its AI -> the factors the driving modes are multiplied by: { pace, wear, power } */
export function applyOrders(c) {
  const m = c.mgr, o = m.orders || (m.orders = defaultOrders()), g = (k) => ORDERS[k].opts[o[k]] || ORDERS[k].opts[ORDERS[k].def];
  const ai = c.ai;
  // (the first forty seconds of the race are LAP 1's; the launch: its reaction time, and its roll of the dice - made once)
  if (m.startRoll == null) m.startRoll = Math.random();
  const L = g('launch'); c.mgrStart = L.dt + (m.startRoll < L.bog ? 0.3 : 0);
  if (ai) { if (m.baseAggr == null) m.baseAggr = ai.aggression; ai.aggression = m.baseAggr * g('attack').aggr * (m.lap1 ? g('lap1').k : 1); }
  c.mgrDefend = g('defend').k; c.mgrMateEasy = o.mate === 'care' && !c.mgrFeud; c.mgrBlueLate = o.blue === 'late';   // (mgrFeud: the two of them at war - career/ManagerStory.js: no order makes them easy on each other)
  c.mgrEdge = g('limits').edge; c.mgrHeatK = g('cool').heat; c.mgrGap = g('cool').gap;
  return { pace: g('limits').pace * g('bias').pace * g('cool').pace, wear: g('bias').wear * g('diff').wear, power: g('diff').power };
}
/** behind the safety car: the fuel burnt and the tyres' wear against a racing lap */
export function scFactors(c) { const s = ORDERS.sc.opts[c.mgr?.orders?.sc || 'std'] || ORDERS.sc.opts.std; return { burn: s.burn, wear: s.wear }; }

/**
 * The orders that need watching, every frame: blue flags (move over - the lapping car let by as a team order lets a
 * team-mate by; hold up - the clock that ends in a penalty), the safety car's restart (tyres cold after SAVE, hot after
 * READY). o: { d, cars, radio(who, text), surname(car) }
 */
export function tacticsUpdate(dt, o) {
  const d = o.d; if (d.mode !== 'race' || !d.world.racing) return;
  const L = d.track.length, green = !d.sc || d.sc.phase === 'green', early = d.time - (d.world.raceStart ?? 0) < 40;
  for (const c of o.cars) {
    const m = c.mgr; if (!m || c.retired || c.finished) continue;
    if (m.lap1 !== early) { m.lap1 = early; o.reapply?.(c); }   // (LAP 1's order on, then off)
    // ---- blue flags: a car about a lap up, close behind
    let lapper = null, gap = 1e9;
    if (green && !c.inPit && !c.pitLane) for (const x of d.cars) {
      if (x === c || x.retired || x.inPit || x.pitLane || x.finished || x.isSC) continue;
      const behind = L - (d.progress(x) - d.progress(c));
      if (behind > 0 && behind < 90 && behind < gap) { lapper = x; gap = behind; }
    }
    if (lapper) {
      if (m.orders.blue === 'late') {
        if (m.blueCar !== lapper) { m.blueCar = lapper; m.blueT = 0; }
        if (gap < 45) m.blueT += dt;
        if (m.blueT > 8 && !m.bluePen) { m.bluePen = true; d.stewards?.award?.(c, 5, 'ignoring blue flags'); o.radio('Race control', `${o.surname(c)}: 5 second penalty, ignoring blue flags.`); }
      } else if (!c._yieldTo || c._yieldTo === m.blueY) { c._yieldTo = lapper; c._yieldUntil = d.time + 3; m.blueY = lapper; }
    } else {
      if (m.blueY && c._yieldTo === m.blueY) c._yieldTo = null;
      m.blueY = null; m.blueCar = null; m.blueT = 0; m.bluePen = false;
    }
    // ---- the safety car's restart
    const sc = !green;
    if (m.wasSC && !sc) {
      const k = m.orders.sc;
      if (k === 'save') { c.tyres.temp = Math.min(c.tyres.temp, 0.5); o.radio(o.surname(c), 'Tyres are cold, no grip for the restart.'); }
      else if (k === 'ready') c.tyres.temp = Math.max(c.tyres.temp, 0.8);
    }
    m.wasSC = sc;
  }
}
