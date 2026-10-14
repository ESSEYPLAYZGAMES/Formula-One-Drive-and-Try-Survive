// Race engineer radio: real events (overtakes involving you, relevant pit stops and retirements, your damage,
// penalties and rulings around you) and five briefings a lap (Radio.js). Rate-limited to 8 messages per lap, spaced >= 6 s,
// higher-priority messages jump the queue and low-priority gap calls are dropped when the lap is busy.
export class Engineer {
  constructor(hud, audio) {
    this.hud = hud; this.audio = audio;
    this.queue = []; this.lastAt = -100; this.lapCount = 0; this.lap = -1; this.time = 0;
    this.maxPerLap = 8; this.minGap = 6;
  }
  reset() { this.queue = []; this.lastAt = -100; this.lapCount = 0; this.lap = -1; }

  /** priority: 3 critical (damage/box now), 2 important (overtakes, retirements near you, pits), 1 info (gaps);
   *  delay: not before that many seconds from now */
  say(text, priority = 2, delay = 0) {
    if (this.queue.some((q) => q.text === text)) return;
    this.queue.push({ text, priority, t: this.time + delay });
    this.queue.sort((a, b) => b.priority - a.priority || a.t - b.t);
    if (this.queue.length > 4) this.queue.length = 4;
  }

  update(dt, time, lap) {
    this.time = time;
    if (lap !== this.lap) { this.lap = lap; this.lapCount = 0; }
    if (!this.queue.length) return;
    const next = this.queue[0];
    if (next.t > time) return;   // (a message held back to follow another)
    const budgetLeft = this.lapCount < this.maxPerLap;
    const spaced = time - this.lastAt >= (next.priority >= 3 ? 3 : this.minGap);
    if (!spaced) return;
    if (!budgetLeft && next.priority < 3) { if (next.priority === 1 || time - next.t > 20) this.queue.shift(); return; }
    if (time - next.t > 25 && next.priority < 3) { this.queue.shift(); return; }   // stale
    this.queue.shift(); this.lastAt = time; this.lapCount++;
    this.hud.radio(next.text);
    this.audio?.chime?.();
  }
}
