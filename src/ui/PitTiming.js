// Your pit stop, on screen: from the speed-limit line the car is driven to the box for you (RaceDirector.pitTakeover)
// and this shows the pull-in to time - a needle running toward the turn-in mark (green: perfect, within 0.12 s; amber:
// a little time lost; beyond: up to a second or so) - then the verdict, and through the stop the pit light: red while
// the crew works, green the moment it is done and the car is yours again. The window is your composure's (the car's
// form.pitWin, career/Morale.js): a calm driver's green band is a little wider, a tense one's a little narrower.
const CSS = `
#pittiming { position: fixed; left: 50%; bottom: 17vh; transform: translateX(-50%); z-index: 30; pointer-events: none; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #fff; text-align: center; opacity: 0; transition: opacity .25s; }
#pittiming.in { opacity: 1; }
#pittiming.cock { bottom: 46vh; }   /* (in the cockpit: up in the window, above the wheel) */
#pittiming .t { font: 800 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .2em; margin-bottom: 7px; text-shadow: 0 1px 4px #000; }
#pittiming .t kbd { background: #fff; color: #111; border-radius: 3px; padding: 1px 6px; margin: 0 4px; font-weight: 900; letter-spacing: .05em; }
#pittiming .bar { position: relative; width: min(420px, 70vw); height: 18px; background: rgba(10,12,18,.8); border: 1px solid rgba(255,255,255,.25); border-radius: 9px; overflow: hidden; margin: 0 auto; }
#pittiming .ok { position: absolute; top: 0; bottom: 0; background: rgba(255,190,40,.45); }
#pittiming .best { position: absolute; top: 0; bottom: 0; background: rgba(60,210,110,.85); }
#pittiming .mark { position: absolute; top: -2px; bottom: -2px; width: 2px; background: #fff; }
#pittiming .needle { position: absolute; top: -3px; width: 4px; height: 24px; margin-left: -2px; background: #fff; box-shadow: 0 0 6px #fff; border-radius: 2px; }
#pittiming .res { font: 900 22px/1.1 'Segoe UI', Arial, sans-serif; letter-spacing: .08em; margin-top: 8px; min-height: 26px; text-shadow: 0 2px 8px #000; }
#pittiming .res small { display: block; font-size: 13px; font-weight: 700; letter-spacing: .14em; opacity: .85; }
#pitlight { position: fixed; right: 3vw; top: 34vh; z-index: 30; pointer-events: none; background: rgba(10,12,18,.85); border-radius: 10px; padding: 10px 12px; display: none; flex-direction: column; align-items: center; gap: 8px; font: 800 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .16em; color: #fff; }
#pitlight.in { display: flex; }
#pitlight.cock { top: 13vh; right: 50%; transform: translateX(50%); flex-direction: row; }   /* (in the cockpit: the release light up ahead) */
#pitlight i { width: 30px; height: 30px; border-radius: 50%; background: #2a0606; box-shadow: inset 0 0 6px #000; }
#pitlight i.r.on { background: #ff2a1f; box-shadow: 0 0 16px #ff2a1f; }
#pitlight i.g.on { background: #31e36c; box-shadow: 0 0 16px #31e36c; }
#pitlight i.g { background: #062a10; }
`;
const SPAN = 1.1;   // seconds either side of the mark across the bar
const BEST = 0.12, OK = 0.45;   // the green (no time lost: RaceDirector.pullIn) and amber bands' half-widths at a neutral form
/** a time either side of the mark -> its place across the bar ('50%' at the mark) */
const pct = (t) => `${(0.5 + Math.max(-SPAN, Math.min(SPAN, t)) / (2 * SPAN)) * 100}%`;
export class PitTiming {
  constructor() {
    if (!document.getElementById('pittiming-css')) { const s = document.createElement('style'); s.id = 'pittiming-css'; s.textContent = CSS; document.head.appendChild(s); }
    const el = this.el = document.createElement('div'); el.id = 'pittiming';
    el.innerHTML = `<div class="t">PULL IN <kbd>SPACE</kbd></div><div class="bar"><div class="ok" style="left:${pct(-OK)};right:calc(100% - ${pct(OK)})"></div><div class="best" style="left:${pct(-BEST)};right:calc(100% - ${pct(BEST)})"></div><div class="mark" style="left:${pct(0)}"></div><div class="needle"></div></div><div class="res"></div>`;
    document.body.appendChild(el);
    const L = this.light = document.createElement('div'); L.id = 'pitlight'; L.innerHTML = '<i class="r"></i><i class="g"></i><span>PIT</span>'; document.body.appendChild(L);
    this.shown = null; this.resT = 0; this.win = 1;
  }
  /**
   * The bands drawn for this window (w: the car's form.pitWin): the green one scales as the pull-in's own tolerance does,
   * the amber one moves out with it (at its edge the same time is lost whatever the window) - written only when it changes
   */
  _window(w) {
    if (w === this.win) return; this.win = w;
    const ok = this.el.querySelector('.ok').style, best = this.el.querySelector('.best').style, g = BEST * w, a = g + OK - BEST;
    ok.left = pct(-a); ok.right = `calc(100% - ${pct(a)})`; best.left = pct(-g); best.right = `calc(100% - ${pct(g)})`;
  }
  /** every frame: p the player's car, t the race time */
  update(p, t, dt, cockpit = false) {
    const P = p?._pull, el = this.el;
    el.classList.toggle('cock', !!cockpit); this.light.classList.toggle('cock', !!cockpit);
    if (P && !P.done) this._window(p.form?.pitWin || 1);
    if (P && !P.done) {
      const et = (p.pitU - P.at) / Math.max(4, p.speed);
      el.classList.add('in'); el.querySelector('.res').innerHTML = '';
      el.querySelector('.needle').style.left = `${Math.max(0, Math.min(1, 0.5 + et / (2 * SPAN))) * 100}%`;
      this.shown = P;
    } else if (this.shown && this.shown.done) {
      const S = this.shown; this.shown = null; this.resT = 2.2;
      const col = S.result === 'PERFECT' ? '#41e07a' : S.pen < 0.6 ? '#ffc23a' : '#ff5a4a';
      el.querySelector('.needle').style.left = `${Math.max(0, Math.min(1, 0.5 + (S.et ?? 0) / (2 * SPAN))) * 100}%`;
      el.querySelector('.res').innerHTML = `<span style="color:${col}">${S.result}</span><small>${S.pen > 0 ? `+${S.pen.toFixed(1)} s IN THE BOX` : 'NO TIME LOST'}</small>`;
    } else if (this.resT > 0) { this.resT -= dt; if (this.resT <= 0) el.classList.remove('in'); }
    else el.classList.remove('in');
    // the pit light: red through the stop, green at the release (for a moment after)
    const stop = p && p.pitLaneState === 'stop' && p.isPlayer, go = p && p._releasedAt != null && t - p._releasedAt < 1.6;
    this.light.classList.toggle('in', !!(stop || go));
    this.light.querySelector('.r').classList.toggle('on', !!stop); this.light.querySelector('.g').classList.toggle('on', !!go && !stop);
  }
  hide() { this.el.classList.remove('in'); this.light.classList.remove('in'); this.shown = null; this.resT = 0; }
  dispose() { this.el.remove(); this.light.remove(); }
}
