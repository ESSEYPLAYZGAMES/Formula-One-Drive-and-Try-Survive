// Tyre compounds, wear/temperature model and grip mapping.
//
// Life: a soft reaches its cliff (70 % wear) at half the race distance, a medium at 75 %, a hard at 110 % - so a hard
// can run a race through, waiting for a safety car (COMPOUNDS.life: the cliff against a soft's). The same for every
// driver, you and the AI alike (the rate barely depends on style; only real sliding wears a set faster).
//
// Degradation is set in lap time: every lap of normal wear costs a soft a second, a medium 0.75 s, a hard 0.5 s
// (COMPOUNDS.deg) - in a race of up to ten laps. A longer race's tyres last longer, and lose what a ten-lap race's do at
// their cliff (5-5.6 s) over more laps, never 25 s by the end of a long stint. Past the cliff it ramps: each lap there
// costs from one to six times the normal loss as the last of the tyre goes. The seconds become grip through how a lap
// time answers grip (measured: the AI alone at Silverstone, 91.35 s - 5 % less grip +2.2 s, 10 % +5.1 s, 15 % +8.1 s:
// dt/T = 0.405 g + 1.53 g^2), on the session's reference lap (setTyreLap, RaceDirector).
//
// Temperature (0 cold .. 1 the window) chases a target set by the work the tyre has been doing over the last ~12 s
// (the load past 0.4, squared, and real sliding): up quickly - how quickly is the compound - and down slowly. A single
// temperature heated by the work and cooled toward the track could not do all of it: a soft warm in half a lap is a soft
// that a safety car never cools, or one that loses a third of its heat down every straight. Fitted over every car's
// recorded inputs at Silverstone, racing and behind the safety car: a soft is in the window 36 s off the blankets, a
// medium in 50 s, a hard in ~100 s (about a lap; a push brings it in sooner); racing it stays there, drifting 0.01-0.06
// down a long straight; two minutes behind the safety car take a soft to ~0.69 and a hard to ~0.75 - or, weaving
// (AIDriver: in the steering, on the straights), hold them at 0.86-1.0. Cold, the grip is down (to ~13 % off the
// blankets: about 3 s on a hard's out-lap, a second or so on a soft's) and the car is twitchier.
export const COMPOUNDS = {
  //       grip    cliff vs soft  s/lap    warming  cooling  after the formation lap
  SOFT:   { grip: 1.00, life: 1.0, deg: 1.0, warm: 1.0, cool: 1.0, start: 0.8, color: '#e8322e', wetGrip: 0.62 },
  MEDIUM: { grip: 0.975, life: 1.5, deg: 0.75, warm: 0.62, cool: 0.8, start: 0.7, color: '#f5d31a', wetGrip: 0.62 },
  HARD:   { grip: 0.95, life: 2.2, deg: 0.5, warm: 0.15, cool: 0.45, start: 0.6, color: '#f2f2f2', wetGrip: 0.62 },
  INTER:  { grip: 0.90, life: 1.5, deg: 0.75, warm: 0.62, cool: 0.8, start: 0.7, color: '#2fbf4f', wetGrip: 0.93, dryWear: 2.5, wetFrom: 0.3 },
  WET:    { grip: 0.85, life: 1.8, deg: 0.6, warm: 0.62, cool: 0.8, start: 0.7, color: '#2f6dff', wetGrip: 1.0, dryWear: 4.0, wetFrom: 0.6 },
};
export const SOFT_LIFE = 0.5;   // a soft's cliff, as a share of the race distance
export const CLIFF = 0.7;       // the wear where the cliff begins
export const RATE_NOM = 1.0;    // the AI's wear rate on a racing lap (TyreSet.update's rate; measured 0.98-1.08)
export const DEG_REF_LAPS = 10; // COMPOUNDS.deg holds as it stands up to this race distance
export const BLANKET = 0.35;    // a new set off the blankets

/** the reference lap the seconds are turned into grip on (RaceDirector: the session's speed profile), else a guess */
const LAP = { t: null };
export function setTyreLap(t) { LAP.t = t > 20 && t < 400 ? t : null; }
export const tyreLap = (trackLength) => LAP.t || trackLength / 62;

/** laps to a compound's cliff in a race of `raceLaps` */
export const cliffLaps = (comp, raceLaps) => Math.max(0.6, SOFT_LIFE * (COMPOUNDS[comp]?.life || 1) * raceLaps);
/** seconds a lap of normal wear costs */
export const degPerLap = (comp, raceLaps) => (COMPOUNDS[comp]?.deg ?? 0.75) * Math.min(1, DEG_REF_LAPS / Math.max(1, raceLaps));
/** lap time lost to wear (s) at wear w: linear to the cliff, then ramping */
export function lapLoss(comp, w, raceLaps) {
  const cl = cliffLaps(comp, raceLaps), dpl = degPerLap(comp, raceLaps), perW = cl / CLIFF;   // (laps per unit of wear)
  if (w <= CLIFF) return dpl * perW * Math.max(0, w);
  const x = Math.min(0.45, w - CLIFF);
  return dpl * cl + dpl * perW * (x + 8.33 * x * x);
}
/** a lap-time loss (s) as a share of grip lost, on a lap of lapT s */
export function lossToGrip(sec, lapT) {
  const x = Math.max(0, sec) / Math.max(20, lapT);
  return Math.min(0.45, (-0.405 + Math.sqrt(0.164 + 6.12 * x)) / 3.06);
}
/** grip lost to cold (share) at temperature t */
export const coldLoss = (t) => (t >= 1 ? 0 : 0.13 * Math.pow((1 - Math.max(0, t)) / (1 - BLANKET), 1.2));
/** seconds to the window from the blankets at racing pace (measured, above) */
export const WARM_T = { SOFT: 42, MEDIUM: 55, HARD: 125, INTER: 55, WET: 55 };   // (in the game, the AI alone at Silverstone)
const HEAT = { l0: 0.4, slip0: 0.12, ref: 0.667, tau: 12, gain: 1.3, up: 0.0546, down: 0.035 };   // (the fit above; ref: racing's mean work)
/**
 * What cold tyres cost against warm ones (s, on a lap of lapT) until they are in the window, from temperature t0 (the
 * blankets, a restart): the temperature climbing to the window over its warm-up time, the grip short by coldLoss
 * along the way - the strategy screen, the AI's undercut sums
 */
export function outLapLoss(comp, lapT, t0 = BLANKET) {
  const tw = (WARM_T[comp] || 50) * Math.max(0, 1 - t0) / (1 - BLANKET); if (tw <= 0) return 0;
  let g = 0; for (let i = 0; i < 8; i++) g += coldLoss(t0 + (1 - t0) * (i + 0.5) / 8) / 8;   // (the mean loss on the way up)
  const T = Math.max(20, lapT), share = Math.min(1, tw / T), first = T * (0.405 * g * share + 1.53 * (g * share) ** 2);
  return first + (tw > T ? (tw - T) / T * T * (0.405 * g + 1.53 * g * g) : 0);
}

export class TyreSet {
  /**
   * @param compound key of COMPOUNDS
   * @param raceLaps race distance - the life and the loss per lap are set by it (above)
   * @param trackLength metres
   */
  constructor(compound, raceLaps, trackLength) {
    this.compound = compound;
    this.spec = COMPOUNDS[compound];
    this.raceLaps = raceLaps || 5; this.trackLength = trackLength;
    this.wear = 0;          // 0..1 (1 = fully gone)
    this.temp = BLANKET;    // 0 cold .. 1 the window
    this.work = HEAT.ref * 0.3;   // the work it has been doing lately (a new set: a crawl down the pit lane)
    this.age = 0;           // metres
    // (lifeMeters: the distance to full wear at a rate of 1 - its cliff at 70 % of it falls where the life above says
    //  at the AI's rate of wear)
    this.lifeMeters = cliffLaps(compound, this.raceLaps) * trackLength * RATE_NOM / CLIFF;
  }

  /** Grip multiplier vs wear: the lap time it costs (lapLoss), as grip */
  wearGrip() { return 1 - lossToGrip(lapLoss(this.compound, this.wear, this.raceLaps), tyreLap(this.trackLength)); }
  tempGrip() { return 1 - coldLoss(this.temp); }

  /** effective grip multiplier for a track wetness in [0 dry .. 1 flooded] */
  grip(wetness) {
    const dry = this.spec.grip;
    const wet = this.spec.wetGrip;
    const base = dry * (1 - wetness) + wet * wetness * dry;
    return base * this.wearGrip() * this.tempGrip();
  }

  /** instability factor 0..1: a worn tyre past the cliff, and a cold one (less: it is short of grip, not unpredictable) */
  instability() { return Math.max(0, (this.wear - CLIFF) / 0.3, 0.45 * Math.max(0, (0.6 - this.temp) / 0.6)); }

  /**
   * @param dist metres travelled this step
   * @param slip normalized slip intensity 0..~2 (sliding)
   * @param load lateral+longitudinal g demand
   * @param wetness track wetness (rain tyres overheat/shred on a dry track)
   * @param dt seconds
   */
  update(dist, slip, load, wetness, dt) {
    // (a rain tyre on a track drier than it is made for overheats and wears fast: an inter below 0.3 wetness, a full wet
    //  below 0.6 - on the track it is made for it wears as a slick does in the dry)
    let dryPenalty = 1;
    if (this.spec.dryWear) dryPenalty = 1 + (this.spec.dryWear - 1) * Math.max(0, Math.min(1, (this.spec.wetFrom - wetness) / this.spec.wetFrom));
    // (the rate of wear: nearly the same for every driver - a smooth one and the AI alike come out at ~1.0 a racing lap
    //  (the AI's slip averages 0.12, a driver's ~0.09, their loads alike); a real slide, a lock-up, a spin still eats it)
    const rate = (0.9 + 0.5 * Math.min(1.5, slip) + 0.05 * Math.min(3, load)) * dryPenalty;
    this.wear = Math.min(1, this.wear + (dist / this.lifeMeters) * rate * (this.wearMul || 1));   // (wearMul: the team's tyre development)
    this.age += dist;
    // temperature: toward the target its recent work sets (above) - a wet track holds a slick well below its window and
    // cools it faster; a rain tyre less (it is made to run there)
    const rain = this.spec.wetGrip > 0.9, s = Math.min(1.5, slip), l = Math.min(3, load), H = HEAT;
    const w = Math.max(0, l - H.l0) ** 2 + Math.max(0, s - H.slip0);
    this.work += (w - this.work) * Math.min(1, dt / H.tau);
    // (a rain tyre is made to work at the lower loads of a wet track: in the wet it reaches its window on less work)
    const tgt = 0.2 + H.gain * (this.work / (rain ? H.ref * (1 - 0.5 * wetness) : H.ref)) * (rain ? 1 : 1 - 0.45 * wetness);
    const k = tgt > this.temp ? this.spec.warm * H.up : this.spec.cool * H.down * (1 + (rain ? 0.3 : 1.2) * wetness);
    this.temp = Math.max(0, Math.min(1, this.temp + (tgt - this.temp) * Math.min(1, k * dt)));
  }
}
