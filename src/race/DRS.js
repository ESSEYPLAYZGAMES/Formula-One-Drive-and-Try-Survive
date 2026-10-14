// DRS, run like the real system. Each track's zones (tracks.js `drs`) have a detection point and an activation zone.
// A car that crosses a detection point within 1.0 s of any car ahead (a backmarker counts too) may open its rear-wing
// flap in the zone that follows - the player with the DRS button, the AI by itself on the throttle - and it closes on
// the brakes or at the end of the zone. DRS is enabled once the leader has done two laps, off under any yellow, VSC or
// safety car, and back one lap after the restart. Open: about 18 % less drag and a fifth less rear downforce (Car.js).
const WINDOW = 1.0;   // seconds behind a car at the detection point

export class DRS {
  constructor(director) {
    this.d = director; this.enabled = false; this.fromLap = 2; this.announced = false;
    const tr = director.track, spec = tr.def.drs || [];
    // a point from a turn: { turn, at: 'start' | 'end', off (m) } -> track s
    const at = (p) => { const z = tr.cornerZones.find((z) => (z.turns || [z.turn]).includes(p.turn)); if (!z) return null; return tr.wrapS(tr.s[p.at === 'end' ? z.b : z.a] + (p.off || 0)); };
    this.zones = spec.map((z) => ({ detect: at(z.detect), open: at(z.open), close: at(z.close), last: new Map() })).filter((z) => z.detect != null && z.open != null && z.close != null);
  }
  inZone(z, s) { const d = this.d; return d.planDs(z.open, s) >= 0 && d.planDs(s, z.close) > 0; }

  update() {
    const d = this.d, lead = d.positions.find((c) => !c.retired);
    // enabled: two laps into the race, not under any neutralisation, one lap after a restart
    if (d.sc && d.sc.phase !== 'green') { this.enabled = false; if (lead) this.fromLap = Math.max(this.fromLap, lead.lap + 1); }
    else this.enabled = !!lead && d.world.racing && lead.lap >= this.fromLap;
    if (this.enabled && !this.announced) { this.announced = true; d.hud?.msg('DRS ENABLED', 'good', 2); d.engineer?.say('DRS is enabled.', 1); }
    if (!this.enabled) this.announced = false;
    for (const c of d.cars) {
      if (c.retired || c.pitLane || c.inPit || c.air || c.wreck) { c.drs = false; c.drsAvail = null; c._drsS = null; continue; }
      const s0 = c._drsS ?? c.s; c._drsS = c.s;
      c.drsZone = null;
      this.zones.forEach((z, k) => {
        // the detection point: within a second of whoever crossed it last before this car?
        if (d.planDs(s0, z.detect) > 0 && d.planDs(c.s, z.detect) <= 0 && Math.abs(d.planDs(s0, c.s)) < 60) {
          let near = false;
          for (const [o, t] of z.last) if (o !== c && !o.retired && !o.pitLane && d.time - t <= WINDOW) { near = true; break; }
          z.last.set(c, d.time);
          c.drsAvail = this.enabled && near ? k : null;
          if (c.isPlayer && c.drsAvail === k) d.hud?.msg('DRS AVAILABLE', 'good', 1.2);
        }
        if (this.inZone(z, c.s)) c.drsZone = k;
      });
      const may = this.enabled && c.drsZone != null && c.drsAvail === c.drsZone;
      if (c.drsZone == null && c.drsAvail != null && !this.inZone(this.zones[c.drsAvail], c.s) && d.planDs(this.zones[c.drsAvail].close, c.s) > 0 && d.planDs(this.zones[c.drsAvail].close, c.s) < 400) c.drsAvail = null;   // (that zone is over)
      // closes: on the brakes, out of the zone, or DRS off
      if (c.drs && (!may || c.brake > 0.1)) c.drs = false;
      // automatic, for everyone: open once allowed in the zone and flat out on the straight (the button still works)
      if (may && !c.drs && !c._drsShut && c.throttle > 0.9 && Math.abs(c.steer) < 0.15 && c.brake < 0.05) c.drs = true;
      if (c.drsZone == null) c._drsShut = false;
    }
  }
  /** the player's DRS button */
  press(c) {
    const may = this.enabled && c.drsZone != null && c.drsAvail === c.drsZone;
    if (c.drs) { c.drs = false; c._drsShut = true; }   // (shut by hand: stays shut for this zone)
    else if (may) { c.drs = true; c._drsShut = false; }
    else this.d.hud?.msg(!this.enabled ? 'DRS DISABLED' : c.drsZone == null ? 'NOT IN A DRS ZONE' : 'DRS NOT AVAILABLE · >1.0s', 'warn', 1.2);
  }
  /** for the HUD: 'open' | 'armed' (allowed in this / the next zone) | 'off' | 'disabled' */
  state(c) { return !this.enabled ? 'disabled' : c.drs ? 'open' : c.drsAvail != null ? 'armed' : 'off'; }
}
