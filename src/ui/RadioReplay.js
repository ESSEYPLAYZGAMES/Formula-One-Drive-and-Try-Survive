// Team radio replays: the race's radio moments played back over the results - one at a time, the speaker's name, the
// line, a waveform - then gone. radioReplays(log, o) picks the few worth hearing again (an order refused, a car out, a
// win, a stop gone wrong) from everything said (log: [{ who, text, lap }]); stopRadioReplays() ends it.
const CSS = `
#rr { position: fixed; left: 18px; bottom: 18px; z-index: 75; width: min(430px, 82vw); background: rgba(10,12,16,.93); color: #fff; border-left: 4px solid var(--c, #e10600); border-radius: 10px; padding: 11px 14px 12px; font-family: 'Segoe UI', Roboto, Arial, sans-serif; opacity: 0; transform: translateY(10px); transition: opacity .3s, transform .35s cubic-bezier(.2,.7,.2,1); pointer-events: none; box-shadow: 0 8px 30px rgba(0,0,0,.4); }
#rr.on { opacity: 1; transform: none; }
#rr small { font: 800 10px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .26em; color: var(--c, #e10600); }
#rr .w { float: right; display: flex; gap: 2px; height: 14px; align-items: center; }
#rr .w i { width: 3px; height: 4px; background: var(--c, #e10600); border-radius: 1px; animation: rr-w .42s ease-in-out infinite alternate; }
#rr b { display: block; margin-top: 8px; font: 800 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .12em; text-transform: uppercase; }
#rr p { margin: 5px 0 0; font: 500 15px/1.35 'Segoe UI', Arial, sans-serif; }
@keyframes rr-w { to { height: 14px; } }
`;
let timer = 0, el = null;
const score = (x) => (/\bNo\b|negative|not hear|do not ask|contract/i.test(x.text) && x.who !== 'Pit wall' && x.who !== 'You' ? 9 : 0) + (/P1|wins|win it|podium/i.test(x.text) ? 8 : 0) + (/is out|damage|hit something/i.test(x.text) ? 6 : 0) + (/order|let .* through|hold position/i.test(x.text) ? 5 : 0) + (/slow stop|penalty|unsafe/i.test(x.text) ? 5 : 0) + (/retirements|first points|first win/i.test(x.text) ? 4 : 0) + (x.who !== 'Pit wall' && x.who !== 'Strategy' && x.who !== 'Race control' ? 1 : 0);
/** the lines worth replaying, in the order they were said (up to n) */
export const bestRadio = (log, n = 4) => [...(log || [])].map((x, i) => ({ ...x, i, s: score(x) })).filter((x) => x.s >= 4).sort((a, b) => b.s - a.s).slice(0, n).sort((a, b) => a.i - b.i);
export function stopRadioReplays() { clearTimeout(timer); timer = 0; if (el) { el.classList.remove('on'); const e = el; el = null; setTimeout(() => e.remove(), 400); } }
export function radioReplays(log, o = {}) {
  stopRadioReplays(); const L = bestRadio(log); if (!L.length) return;
  if (!document.getElementById('rr-css')) { const st = document.createElement('style'); st.id = 'rr-css'; st.textContent = CSS; document.head.appendChild(st); }
  el = document.createElement('div'); el.id = 'rr'; el.style.setProperty('--c', o.color || '#e10600'); document.body.appendChild(el);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let i = 0; const me = el;
  const show = () => {
    if (el !== me) return; if (i >= L.length) { stopRadioReplays(); return; }
    const x = L[i++]; me.classList.remove('on');
    setTimeout(() => { if (el !== me) return; me.innerHTML = `<span class="w">${'<i></i>'.repeat(9).replace(/<i>/g, () => `<i style="animation-delay:${(Math.random() * 0.4).toFixed(2)}s">`)}</span><small>TEAM RADIO${x.lap ? ` · LAP ${x.lap}` : ''} · ${i}/${L.length}</small><b>${esc(x.who)}</b><p>${esc(x.text)}</p>`; me.classList.add('on'); try { o.audio?.beep?.(1320, 0.06, 0.12); } catch (e) { /* no sound */ } }, i === 1 ? 600 : 320);
    timer = setTimeout(show, 1500 + Math.min(4200, String(x.text).length * 55));
  };
  show();
}
