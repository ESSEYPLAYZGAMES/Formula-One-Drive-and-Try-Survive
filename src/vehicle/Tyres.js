// Tyre compounds, wear/temperature model and grip mapping.
export const COMPOUNDS = {
  SOFT:   { grip: 1.00, life: 1.00, color: '#e8322e', warm: 1.6, wetGrip: 0.62 },
  MEDIUM: { grip: 0.975, life: 1.65, color: '#f5d31a', warm: 1.2, wetGrip: 0.62 },
  HARD:   { grip: 0.95, life: 2.5, color: '#f2f2f2', warm: 0.9, wetGrip: 0.62 },
  INTER:  { grip: 0.90, life: 1.5, color: '#2fbf4f', warm: 1.3, wetGrip: 0.93, dryWear: 2.5 },
  WET:    { grip: 0.85, life: 1.8, color: '#2f6dff', warm: 1.2, wetGrip: 1.0, dryWear: 4.0 },
};

export class TyreSet {
  /**
   * @param compound key of COMPOUNDS
   * @param raceLaps race distance - wear is scaled so a Soft "falls off the cliff" around 60% distance of a sprint
   * @param trackLength metres
   */
  constructor(compound, raceLaps, trackLength) {
    this.compound = compound;
    this.spec = COMPOUNDS[compound];
    this.wear = 0;          // 0..1 (1 = fully gone)
    this.temp = 0.35;       // 0 cold .. 1 optimal (blanket temperature ~ 0.35)
    this.age = 0;           // metres
    // Soft life in laps: 60 % of a long race's distance (50 laps -> 18); a short race's tyres last it, just (3 laps ->
    // 3.9, 5 -> 6.5: worn near the cliff by the flag, no stop needed - nobody stops in a sprint)
    const softLaps = Math.min(18, Math.max(2.2, raceLaps * 0.6, Math.min(raceLaps * 1.3, 7.8)));
    this.lifeMeters = softLaps * trackLength * this.spec.life;
  }

  /** Grip multiplier vs wear: progressive loss, then a cliff beyond 70% */
  wearGrip() {
    const w = this.wear;
    return w < 0.7 ? 1 - 0.07 * w : 1 - 0.049 - 0.6 * (w - 0.7);
  }
  tempGrip() { return 0.86 + 0.14 * this.temp; }

  /** effective grip multiplier for a track wetness in [0 dry .. 1 flooded] */
  grip(wetness) {
    const dry = this.spec.grip;
    const wet = this.spec.wetGrip;
    const base = dry * (1 - wetness) + wet * wetness * dry;
    return base * this.wearGrip() * this.tempGrip();
  }

  /** instability factor 0..1 used to inject twitchiness past the cliff */
  instability() { return Math.max(0, (this.wear - 0.7) / 0.3); }

  /**
   * @param dist metres travelled this step
   * @param slip normalized slip intensity 0..~2 (sliding)
   * @param load lateral+longitudinal g demand
   * @param wetness track wetness (rain tyres overheat/shred on a dry track)
   * @param dt seconds
   */
  update(dist, slip, load, wetness, dt) {
    let dryPenalty = 1;
    if (this.spec.dryWear) dryPenalty = 1 + (this.spec.dryWear - 1) * (1 - wetness);
    const rate = (0.55 + 2.2 * slip + 0.35 * load) * dryPenalty;
    this.wear = Math.min(1, this.wear + (dist / this.lifeMeters) * rate * (this.wearMul || 1));   // (wearMul: the team's tyre development)
    this.age += dist;
    // temperature: heats with slip/load and speed, cools slowly; wet track cools
    const heat = (0.06 + 0.9 * slip + 0.25 * load) * this.spec.warm * (1 - 0.5 * wetness);
    const cool = 0.08 + 0.15 * wetness;
    this.temp = Math.max(0, Math.min(1, this.temp + (heat - cool) * dt * 0.35));
  }
}
