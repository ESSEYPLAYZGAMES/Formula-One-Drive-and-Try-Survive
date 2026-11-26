// The Reckoning (the driver career, after the mourning screen - main.js afterNews): your driver's life weighed. Out of
// the dark a balance; the deeds (career/Conscience.js judge) come down onto it one by one - the good on the left in
// gold, the harm on the right in red - and the beam tips with each. Then the verdict: Heaven - the light rising, the
// clouds, the gates opening, a slow major chord - or Hell - the floor giving way, the red glow and the embers, a low
// drone and a tritone. What weighed most, said plainly. CONTINUE (after the verdict) or Esc.
// showReckoning(J, name, done, { audio }) - J: judge(c).

const CSS = `
#reckon { position: fixed; inset: 0; z-index: 61; background: #000; color: #ece6d8; font-family: Georgia, 'Times New Roman', serif; overflow: hidden; opacity: 0; transition: opacity 1.6s ease; }
#reckon.show { opacity: 1; }
#reckon canvas.fx { position: absolute; inset: 0; width: 100%; height: 100%; }
#reckon .sky { position: absolute; inset: 0; opacity: 0; transition: opacity 3.2s ease; }
#reckon.heaven .sky.h { opacity: 1; background: radial-gradient(ellipse at 50% 10%, #fffbe9 0%, #ffe9b0 28%, #d9c08a 55%, #6b5c3e 100%); }
#reckon.hell .sky.d { opacity: 1; background: radial-gradient(ellipse at 50% 110%, #ff5a1a 0%, #a3170a 30%, #3a0603 62%, #0a0000 100%); }
#reckon .clouds { position: absolute; left: -20%; right: -20%; bottom: -8%; height: 46%; opacity: 0; transition: opacity 4s ease 1s;
  background: radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,0)) 0 60%/38% 70% no-repeat, radial-gradient(closest-side, rgba(255,250,240,.9), rgba(255,255,255,0)) 30% 80%/44% 80% no-repeat,
    radial-gradient(closest-side, rgba(255,255,255,.92), rgba(255,255,255,0)) 64% 70%/40% 75% no-repeat, radial-gradient(closest-side, rgba(255,248,235,.9), rgba(255,255,255,0)) 100% 85%/42% 80% no-repeat; animation: rkDrift 40s linear infinite alternate; }
#reckon.heaven .clouds { opacity: 1; }
#reckon .rays { position: absolute; left: 50%; top: -30%; width: 160vmax; height: 160vmax; margin-left: -80vmax; opacity: 0; transition: opacity 3s ease 1.2s;
  background: repeating-conic-gradient(from 0deg, rgba(255,246,214,.22) 0deg 4deg, rgba(255,246,214,0) 4deg 14deg); -webkit-mask: radial-gradient(circle, #000 0%, transparent 58%); mask: radial-gradient(circle, #000 0%, transparent 58%); animation: rkSpin 120s linear infinite; }
#reckon.heaven .rays { opacity: 1; }
#reckon .gates { position: absolute; left: 50%; top: 18%; width: min(420px, 70vw); height: min(300px, 40vh); transform: translateX(-50%); opacity: 0; transition: opacity 2.4s ease 1.6s; }
#reckon.heaven .gates { opacity: 1; }
#reckon .gates i { position: absolute; top: 0; bottom: 0; width: 50%; border: 3px solid rgba(201,160,62,.85); background: repeating-linear-gradient(90deg, rgba(201,160,62,.75) 0 4px, transparent 4px 26px); transition: transform 4s cubic-bezier(.4,0,.2,1) 3s; }
#reckon .gates i:first-child { left: 0; border-radius: 120px 0 0 0; transform-origin: left center; }
#reckon .gates i:last-child { right: 0; border-radius: 0 120px 0 0; transform-origin: right center; }
#reckon.heaven .gates i:first-child { transform: perspective(600px) rotateY(70deg); }
#reckon.heaven .gates i:last-child { transform: perspective(600px) rotateY(-70deg); }
#reckon .crack { position: absolute; left: 0; right: 0; bottom: 0; height: 0; background: linear-gradient(rgba(40,0,0,0), #ff4a10 55%, #ffb347); transition: height 3.5s cubic-bezier(.5,0,.3,1) .6s; filter: blur(2px); }
#reckon.hell .crack { height: 38%; }
#reckon .stage { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; text-align: center; transition: transform 3.5s cubic-bezier(.5,0,.3,1), opacity 2s ease; }
#reckon.heaven .stage { transform: translateY(-6vh); }
#reckon.hell .stage { transform: translateY(5vh); }
#reckon .over { font: 600 12px/1 system-ui, sans-serif; letter-spacing: .6em; color: #8f897c; margin-bottom: 10px; }
#reckon .who { font-size: clamp(22px, 4.6vw, 34px); margin: 0 0 18px; transition: color 2s ease; }
#reckon.heaven .who { color: #4a3a18; } #reckon.heaven .over { color: #6b5c3e; }
#reckon svg.scales { width: min(560px, 92vw); height: auto; overflow: visible; }
#reckon svg .beam { transition: transform 1s cubic-bezier(.3,1.4,.5,1); transform-origin: 280px 70px; }
#reckon svg .pan { transition: transform 1s cubic-bezier(.3,1.4,.5,1); }
#reckon .deeds { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 28px; width: min(560px, 92vw); margin-top: 10px; min-height: 120px; }
#reckon .deeds .col { display: flex; flex-direction: column; gap: 5px; }
#reckon .deed { font: 500 13px/1.3 system-ui, sans-serif; padding: 5px 9px; border-radius: 4px; opacity: 0; transform: translateY(-14px); transition: opacity .5s ease, transform .5s ease; text-align: left; }
#reckon .deed.in { opacity: 1; transform: none; }
#reckon .deed.g { background: rgba(214,172,72,.16); border-left: 3px solid #d6ac48; color: #f3e3b8; }
#reckon .deed.b { background: rgba(200,40,30,.16); border-left: 3px solid #c8281e; color: #f2c2bb; }
#reckon .deed small { opacity: .7; margin-left: 6px; }
#reckon .verdict { font-size: clamp(40px, 10vw, 84px); letter-spacing: .18em; margin: 14px 0 6px; opacity: 0; transition: opacity 2.4s ease 1.8s; }
#reckon.heaven .verdict { color: #fffaf0; -webkit-text-stroke: 1px rgba(138,106,32,.7); text-shadow: 0 0 30px rgba(255,236,170,.9), 0 2px 6px rgba(90,66,16,.45); opacity: 1; }
#reckon.hell .verdict { color: #ff6a2a; text-shadow: 0 0 26px rgba(255,60,0,.8); opacity: 1; }
#reckon .lesson { max-width: 560px; font-size: 16px; line-height: 1.55; opacity: 0; transition: opacity 2s ease 3.4s; }
#reckon.heaven .lesson { color: #3a2e14; } #reckon.hell .lesson { color: #f0d2c4; }
#reckon.done .lesson { opacity: 1; }
#reckon button { margin-top: 22px; background: none; border: 1px solid currentColor; color: inherit; font: 600 11px/1 system-ui, sans-serif; letter-spacing: .3em; padding: 10px 18px; cursor: pointer; opacity: 0; transition: opacity 1.2s ease 4.6s; }
#reckon.done button { opacity: .8; } #reckon.heaven button { color: #3a2e14; } #reckon.hell button { color: #f0d2c4; }
#reckon.heaven.done .deeds, #reckon.hell.done .deeds, #reckon.done svg.scales { opacity: .0; transition: opacity 1.5s ease; height: 0; min-height: 0; margin: 0; }
@keyframes rkSpin { to { transform: rotate(360deg); } }
@keyframes rkDrift { from { transform: translateX(-4%); } to { transform: translateX(4%); } }
@media (max-height: 560px) { #reckon .deeds { min-height: 0; } #reckon .deed { font-size: 11px; padding: 3px 7px; } }
`;
let injected = false;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

/** the chord or the drone (o.audio: the game's audio, its context when it is running) */
function score(audio, heaven) {
  const ctx = audio?.ready ? audio.ctx : null; if (!ctx) return () => {};
  const out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination);
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = heaven ? 2400 : 520; lp.connect(out);
  const f = heaven ? [220, 277.18, 329.63, 440, 554.37] : [55, 77.78, 110, 155.56];   // (A major, open; A and E-flat: the devil's interval)
  const osc = f.map((hz, i) => { const o = ctx.createOscillator(); o.type = heaven ? 'sine' : 'sawtooth'; o.frequency.value = hz; o.detune.value = (i % 2 ? 4 : -4); o.connect(lp); o.start(); return o; });
  const t = ctx.currentTime; out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(heaven ? 0.05 : 0.07, t + 4);
  return () => { const n = ctx.currentTime; out.gain.cancelScheduledValues(n); out.gain.setValueAtTime(out.gain.value, n); out.gain.linearRampToValueAtTime(0, n + 2.5); setTimeout(() => { for (const o of osc) try { o.stop(); } catch (e) { /* stopped */ } out.disconnect(); }, 2800); };
}

/** motes of light rising slowly (heaven), embers rushing up (hell) - on a canvas behind the stage */
function particles(cv, kind) {
  const g = cv.getContext('2d'); if (!g) return () => {};
  let w = 0, h = 0, raf = 0, last = performance.now(); const P = [];
  const fit = () => { w = cv.width = cv.clientWidth; h = cv.height = cv.clientHeight; };
  fit(); window.addEventListener('resize', fit);
  const spawn = () => P.push(kind === 'hell' ? { x: Math.random() * w, y: h + 10, vx: (Math.random() - 0.5) * 40, vy: -(80 + Math.random() * 160), r: 1 + Math.random() * 2.4, life: 2 + Math.random() * 3, t: 0 }
    : { x: Math.random() * w, y: h * (0.5 + Math.random() * 0.6), vx: (Math.random() - 0.5) * 8, vy: -(10 + Math.random() * 22), r: 1 + Math.random() * 2, life: 5 + Math.random() * 5, t: 0 });
  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; g.clearRect(0, 0, w, h);
    for (let i = 0; i < (kind === 'hell' ? 6 : 2); i++) if (P.length < 260) spawn();
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i]; p.t += dt; p.x += p.vx * dt + (kind === 'hell' ? Math.sin(p.t * 6 + p.r) * 20 * dt : 0); p.y += p.vy * dt; const a = Math.max(0, 1 - p.t / p.life);
      if (a <= 0 || p.y < -20) { P.splice(i, 1); continue; }
      g.fillStyle = kind === 'hell' ? `rgba(255,${120 + (p.r * 40) | 0},40,${a})` : `rgba(255,248,220,${a * 0.8})`; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill();
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', fit); };
}

export function showReckoning(J, name, done, o = {}) {
  if (!injected) { const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); injected = true; }
  const el = document.createElement('div'); el.id = 'reckon';
  el.innerHTML = `<div class="sky h"></div><div class="sky d"></div><div class="rays"></div><div class="clouds"></div><div class="gates"><i></i><i></i></div><div class="crack"></div><canvas class="fx"></canvas>
    <div class="stage"><div class="over">THE RECKONING</div><h2 class="who">${esc(name)}</h2>
      <svg class="scales" viewBox="0 0 560 230" aria-hidden="true">
        <line x1="280" y1="70" x2="280" y2="215" stroke="#8f897c" stroke-width="5"/><path d="M230 222 L330 222 L300 205 L260 205 Z" fill="#8f897c"/><circle cx="280" cy="64" r="8" fill="#b9b2a2"/>
        <g class="beam"><line x1="70" y1="70" x2="490" y2="70" stroke="#b9b2a2" stroke-width="5" stroke-linecap="round"/>
          <g class="pan l"><line x1="70" y1="70" x2="30" y2="150" stroke="#8f897c"/><line x1="70" y1="70" x2="110" y2="150" stroke="#8f897c"/><path d="M22 150 Q70 182 118 150 Z" fill="#d6ac48"/></g>
          <g class="pan r"><line x1="490" y1="70" x2="450" y2="150" stroke="#8f897c"/><line x1="490" y1="70" x2="530" y2="150" stroke="#8f897c"/><path d="M442 150 Q490 182 538 150 Z" fill="#c8281e"/></g></g>
      </svg>
      <div class="deeds"><div class="col g"></div><div class="col b"></div></div>
      <div class="verdict"></div><div class="lesson">${esc(J.lesson)}</div><button>CONTINUE</button></div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show')); setTimeout(() => el.classList.add('show'), 60);
  const beam = el.querySelector('.beam'), panL = el.querySelector('.pan.l'), panR = el.querySelector('.pan.r'), colG = el.querySelector('.col.g'), colB = el.querySelector('.col.b');
  // (the beam tips by the running total, never more than 14 degrees; the pans hang level as it does)
  const tip = (s) => { const a = Math.max(-14, Math.min(14, -s * 1.6)); beam.style.transform = `rotate(${a}deg)`; panL.style.transform = `rotate(${-a}deg)`; panL.style.transformOrigin = '70px 70px'; panR.style.transform = `rotate(${-a}deg)`; panR.style.transformOrigin = '490px 70px'; };
  // (the deeds in turns, the heaviest of each side first - at most five a side; the rest are in the totals)
  const G = J.good.slice(0, 5), B = J.bad.slice(0, 5), order = []; for (let i = 0; i < Math.max(G.length, B.length); i++) { if (G[i]) order.push(G[i]); if (B[i]) order.push(B[i]); }
  const timers = []; let run = 0, stopSound = () => {}, stopFx = () => {}, closed = false;
  const step = 1.15;
  order.forEach((e, i) => timers.push(setTimeout(() => {
    const d = document.createElement('div'); d.className = `deed ${e.w > 0 ? 'g' : 'b'}`; d.innerHTML = `${esc(e.label)}${e.n > 1 ? `<small>×${e.n}</small>` : ''}`;
    (e.w > 0 ? colG : colB).appendChild(d); requestAnimationFrame(() => d.classList.add('in'));
    run += e.w; tip(run); try { o.audio?.beep?.(e.w > 0 ? 660 : 98, 0.25, 0.05); } catch (err) { /* no sound */ }
  }, 2600 + i * step * 1000)));
  const tV = 2600 + order.length * step * 1000 + 1400;
  timers.push(setTimeout(() => { tip(J.sum); }, tV - 700));
  timers.push(setTimeout(() => {
    el.querySelector('.verdict').textContent = J.heaven ? 'HEAVEN' : 'HELL'; el.classList.add(J.heaven ? 'heaven' : 'hell');
    stopSound = score(o.audio, J.heaven); stopFx = particles(el.querySelector('canvas.fx'), J.heaven ? 'heaven' : 'hell');
    timers.push(setTimeout(() => el.classList.add('done'), 2600));
  }, tV));
  const close = () => {
    if (closed || !el.classList.contains('done')) return; closed = true; for (const t of timers) clearTimeout(t);
    window.removeEventListener('keydown', kd, true); stopSound(); el.classList.remove('show');
    setTimeout(() => { stopFx(); el.remove(); done?.(); }, 1700);
  };
  const kd = (e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); close(); } };
  window.addEventListener('keydown', kd, true);
  el.querySelector('button').addEventListener('click', close);
  return { el, close };
}
