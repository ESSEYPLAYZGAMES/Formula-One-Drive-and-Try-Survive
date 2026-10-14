// Keyboard + gamepad input with smoothing for digital steering.
export class Input {
  constructor() {
    this.keys = new Set();
    this.pressedSet = new Set();
    this.steer = 0; this.throttle = 0; this.brake = 0; this.handbrake = 0; this.ers = 0; this.look = 0; this.lookBack = false;
    this.enabled = true;
    window.addEventListener('keydown', (e) => {
      if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      if (!this.keys.has(e.code)) this.pressedSet.add(e.code);
      this.keys.add(e.code);
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());
  }
  /** edge-triggered key press (consumed) */
  pressed(code) { if (this.pressedSet.has(code)) { this.pressedSet.delete(code); return true; } return false; }
  endFrame() { this.pressedSet.clear(); }
  down(code) { return this.keys.has(code); }

  update(dt, speed) {
    const k = this.keys;
    let sT = 0, thT = 0, brT = 0;
    if (k.has('KeyA') || k.has('ArrowLeft')) sT += 1;
    if (k.has('KeyD') || k.has('ArrowRight')) sT -= 1;
    if (k.has('KeyW') || k.has('ArrowUp')) thT = 1;
    if (k.has('KeyS') || k.has('ArrowDown')) brT = 1;
    this.handbrake = k.has('Space') ? 1 : 0;
    this.ers = (k.has('ShiftLeft') || k.has('ShiftRight') || k.has('KeyX')) ? 1 : 0;   // ERS deploy: held
    let drs = k.has('KeyF');                                                                // DRS: a press opens / closes it
    let analog = false;
    // head: Q / E look left / right, C looks back (right stick and R3 on a pad)
    this.look = (k.has('KeyE') ? 1 : 0) - (k.has('KeyQ') ? 1 : 0); this.lookBack = k.has('KeyC');
    const gps = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of gps) {
      if (!gp) continue; analog = true;
      const rx = gp.axes[2] || 0; if (Math.abs(rx) > 0.15) this.look = rx;
      if (gp.buttons[11]?.pressed) this.lookBack = true;
      const ax = gp.axes[0] || 0; sT = Math.abs(ax) > 0.06 ? -ax : 0;
      thT = Math.max(thT, gp.buttons[7]?.value || 0); brT = Math.max(brT, gp.buttons[6]?.value || 0);
      if (gp.buttons[1]?.pressed) this.handbrake = 1; if (gp.buttons[0]?.pressed) this.ers = 1;
      if (gp.buttons[3]?.pressed) this.keys.add('KeyP'); else this.keys.delete('KeyP');
      if (gp.buttons[5]?.pressed) drs = true;
      const a = !!gp.buttons[0]?.pressed; this.padATap = a && !this._padA; this._padA = a;
      break;
    }
    this.drsTap = drs && !this._drs; this._drs = drs;
    this.retireHold = k.has('KeyR') ? (this.retireHold || 0) + dt : 0;
    if (!this.enabled) { sT = 0; thT = 0; brT = 0; this.handbrake = 0; this.drsTap = false; }
    // steering: digital -> rate-limited, speed-sensitive; analog -> light smoothing
    if (analog) this.steer += (sT - this.steer) * Math.min(1, dt * 18);
    else {
      const rate = sT !== 0 ? (2.2 + 4 / (1 + speed / 20)) : 6;
      if (sT === 0) { const d = Math.sign(this.steer) * rate * dt; this.steer = Math.abs(d) >= Math.abs(this.steer) ? 0 : this.steer - d; }
      else this.steer = Math.max(-1, Math.min(1, this.steer + Math.sign(sT - this.steer) * rate * dt));
    }
    this.throttle += (thT - this.throttle) * Math.min(1, dt * (thT > this.throttle ? 7 : 14));
    this.brake += (brT - this.brake) * Math.min(1, dt * (brT > this.brake ? 9 : 14));
  }
}
