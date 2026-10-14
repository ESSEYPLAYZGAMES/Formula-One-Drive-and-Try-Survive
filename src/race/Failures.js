// Mechanical failures and punctures, for the AI and the player alike (the menu can switch random failures off;
// punctures from worn-out tyres and from contact stay - they are the driver's doing).
//
//  * engine: a blow-up - a plume of white smoke, a third of the time a fire; no drive, the car coasts to a stop;
//  * gearbox / hydraulics: the drive is gone, a little smoke;
//  * brakes: a third of the braking left (the AI finds out at the next braking zone, then pulls over; the player
//    can nurse it home);
//  * power unit: the ERS is gone and some power with it, for the rest of the race;
//  * puncture: one tyre down - most of its grip gone, squashed on the car; it comes apart with the distance driven
//    on it (flat, the tread peeling off, down to the rim: ~25 s at racing pace, longer nursed slowly). A tyre worn
//    past the cliff punctures (the more worn, the sooner), and so can a wheel struck by another car.
// A failure is rarer than one a race on average (about 0.4 % per car per lap), more likely with a damaged or
// overheating engine. A car with no drive pulls off the road (AIDriver.pullOver) and retires once stopped.
const RATE = 0.004;   // failures per car per lap (no damage, normal temperature)
const TYPES = [['engine', 30], ['gearbox', 14], ['hydraulics', 14], ['brakes', 10], ['puncture', 16], ['pu', 16]];
const NAMES = { engine: 'Engine', gearbox: 'Gearbox', hydraulics: 'Hydraulics', brakes: 'Brakes', pu: 'Power unit', puncture: 'Puncture' };
const WHEEL = ['front left', 'front right', 'rear left', 'rear right'];

export class Failures {
  constructor(director, enabled = true) { this.d = director; this.enabled = enabled && director.mode === 'race'; this.log = []; }

  update(dt) {
    const d = this.d; if (!d.world.racing) return;
    const lapT = Math.max(60, d.track.length / 60);
    for (const c of d.cars) {
      if (c.retired || c.finished || c.inPit || c.air || c.wreck || c.held) continue;
      // a car with no drive: retired once it has stopped
      if (c.engineDead) { if (c.speed < 0.6) { c._deadT = (c._deadT || 0) + dt; if (c._deadT > 1.5) this.retire(c); } continue; }
      if (c.pitLane) continue;
      // a worn-out tyre lets go: from ~88 % wear, almost surely within seconds of the end of it
      const t = c.tyres;
      if (c.punct == null && t.wear > 0.88 && c.speed > 20) {
        const k = Math.min(1, (t.wear - 0.88) / 0.12);
        if (Math.random() < 0.25 * k * k * dt) this.puncture(c, Math.random() < 0.6 ? 2 + (Math.random() < 0.5 ? 0 : 1) : Math.floor(Math.random() * 2), 'worn');
      }
      if (c.punct != null && !c.punctShred) {
        c.punctP = Math.min(1, (c.punctP || 0) + dt * (0.15 + c.speed / 45) / 25);   // (0 -> 1: flat, delaminating, gone)
        if (c.punctP >= 1) { c.punctShred = true; if (c.isPlayer) d.hud?.msg('TYRE SHREDDED · ON THE RIM', 'bad', 2.5); }
      }
      // random failures
      if (!this.enabled || c.failed || c.speed < 20) continue;
      const risk = (1 + 2.5 * c.dmg.eng + 4 * Math.max(0, c.engTemp - 0.85)) * (c.relMul || 1);   // (relMul: the team's reliability, career/Career.js)
      if (Math.random() < RATE / lapT * risk * dt) this.fail(c, this.pick());
    }
  }
  pick() { let x = Math.random() * TYPES.reduce((a, t) => a + t[1], 0); for (const [k, w] of TYPES) { x -= w; if (x <= 0) return k; } return 'engine'; }

  fail(c, type) {
    const d = this.d; if (type === 'puncture') { this.puncture(c, Math.floor(Math.random() * 4), 'failure'); return; }
    c.failed = type; this.log.push([+d.time.toFixed(1), c.short, type]);
    if (type === 'engine' || type === 'gearbox' || type === 'hydraulics') {
      c.engineDead = true;
      if (type === 'engine') { c.emit('smoke', c.x, c.z, 1); if (Math.random() < 0.35) c.emit('fire', c.x, c.z, 0.8); }
      else c.emit('smoke', c.x, c.z, 0.35);
    } else if (type === 'brakes') c.brakeFail = true;
    else if (type === 'pu') { c.puLoss = true; c.ersEnergy = 0; }
    const msg = { engine: 'ENGINE FAILURE', gearbox: 'GEARBOX FAILURE', hydraulics: 'HYDRAULICS FAILURE', brakes: 'BRAKE FAILURE', pu: 'POWER UNIT ISSUE · NO ERS' }[type];
    if (c.isPlayer) {
      d.hud?.msg(msg, 'bad', 4);
      d.engineer?.say({ engine: 'Engine, engine! Pull over safely, we have to stop. Sorry.', gearbox: "We've lost the gearbox, pull over where it's safe.", hydraulics: 'Hydraulics failure, pull over safely.', brakes: 'Brake failure! Careful, you have a third of your brakes. Bring it home if you can.', pu: "We've lost the ERS. Keep going, we'll manage it." }[type], 3);
    } else this.near(c, `${c.name.split(' ').pop()} has a problem${c.engineDead ? ', he is stopping' : ''}. Looks like ${NAMES[type].toLowerCase()}.`);
  }
  /** wheel k (FL FR RL RR) punctured: why 'worn' | 'contact' | 'failure' */
  puncture(c, k, why) {
    const d = this.d; if (c.punct != null || c.retired) return;
    c.punct = k; c.punctT = d.time; c.punctP = 0; c.punctShred = false; c.emit('puncture' + k, c.x, c.z, 1);
    this.log.push([+d.time.toFixed(1), c.short, 'puncture ' + why]);
    if (c.isPlayer) { d.hud?.msg(`PUNCTURE · ${WHEEL[k].toUpperCase()}\nBOX THIS LAP`, 'bad', 4); d.engineer?.say(`Puncture, ${WHEEL[k]}! ${why === 'worn' ? "The tyre's worn through. " : ''}Box, box, careful on the way in.`, 3); }
    else {
      // the AI nurses it to the pits for new tyres (with a lap or less to go it limps to the flag)
      if (d.world.lapsTotal - c.lap >= 1) { c.pitRequested = true; if (c.ai) c.ai.pitPlan = { compound: c.tyres.compound === 'SOFT' ? 'MEDIUM' : c.tyres.compound === 'INTER' || c.tyres.compound === 'WET' ? c.tyres.compound : 'HARD', repair: 'none' }; }
      this.near(c, `${c.name.split(' ').pop()} has a puncture${why === 'worn' ? ', he took those tyres too far' : ''}.`);
    }
  }
  retire(c) {
    const d = this.d; c.retired = true; c.retireReason = NAMES[c.failed] || 'Mechanical'; c.throttle = 0; c.brake = 1;
    if (c.isPlayer) d.hud?.msg(`RETIRED · ${c.retireReason.toUpperCase()}`, 'bad', 4);
  }
  near(c, text) {
    const d = this.d, p = d.player; if (!p || !d.engineer) return;
    const pos = d.positions; if (Math.abs(pos.indexOf(c) - pos.indexOf(p)) <= 4 || pos.indexOf(c) === 0) d.engineer.say(text, 2);
  }
}
