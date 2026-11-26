// The exorcism (ui/Afterlife.js: your spirit at a portal, the body of the driver you would become held by spirits that
// are not theirs). A ritual drawn over the scene: a circle of runes, and the spirits cast out one by one. Two trials,
// in turn - THE SEAL: a ring of light closing on the circle; SPACE (or a click) as it crosses the golden band casts a
// spirit out; too early or too late, it fights back. THE WORDS: a word of command (VADE, EXI, LUX...) to be typed before
// the light fades; a wrong letter feeds the dark. Every failure darkens the circle (the corruption meter); full, and
// the spirits hold the body: you are thrown back. Heaven is gentler - fewer spirits, a slower ring, a wider band; Hell
// is not - and a soul that weighed light (the Reckoning's sum) is a little steadier still.
// runExorcism({ host, heaven, sum, name, color, audio, onSpirit(k), onDone(ok) })

const CSS = `
#exo { position: absolute; inset: 0; z-index: 5; display: grid; place-items: center; pointer-events: auto; font-family: Georgia, serif; color: #fff; }
#exo .ex-veil { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,.55) 70%); transition: background .3s; }
#exo.hit .ex-veil { background: radial-gradient(circle at 50% 50%, rgba(255,255,255,.25), rgba(0,0,0,.4) 70%); }
#exo.miss .ex-veil { background: radial-gradient(circle at 50% 50%, rgba(255,0,40,.28), rgba(40,0,0,.7) 70%); }
#exo.miss .ex-ring { animation: exShake .35s; }
@keyframes exShake { 20% { transform: translate(-8px, 3px); } 40% { transform: translate(7px, -4px); } 60% { transform: translate(-5px, 2px); } 80% { transform: translate(3px, -1px); } }
#exo .ex-ring { position: relative; width: 420px; height: 420px; max-width: 86vw; max-height: 86vw; }
#exo svg { width: 100%; height: 100%; overflow: visible; }
#exo .ex-head { position: absolute; top: 9%; left: 0; right: 0; text-align: center; }
#exo .ex-head h3 { margin: 0; font-size: clamp(22px, 4vw, 34px); letter-spacing: .25em; text-shadow: 0 0 18px var(--c, #fff); }
#exo .ex-head p { margin: 8px 0 0; font: 600 13px/1.4 system-ui, sans-serif; opacity: .85; }
#exo .ex-word { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); text-align: center; font-size: clamp(44px, 9vw, 80px); letter-spacing: .3em; pointer-events: none; }
#exo .ex-word span { opacity: .35; transition: opacity .15s, text-shadow .15s; } #exo .ex-word span.ok { opacity: 1; text-shadow: 0 0 18px #fff, 0 0 30px var(--c, #fff); }
#exo .ex-foot { position: absolute; bottom: 10%; left: 0; right: 0; display: flex; justify-content: center; gap: 30px; font: 700 11px/1 system-ui, sans-serif; letter-spacing: .2em; }
#exo .ex-foot i { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-left: 5px; vertical-align: -2px; background: #2a0a1a; border: 1px solid rgba(255,255,255,.5); }
#exo .ex-foot .sp i.on { background: #110008; box-shadow: 0 0 8px #ff2a6a; } #exo .ex-foot .sp i.out { background: #fff; box-shadow: 0 0 10px #fff; }
#exo .ex-foot .cr i.on { background: #ff1a3a; box-shadow: 0 0 10px #ff1a3a; }
#exo .ex-end { position: absolute; left: 0; right: 0; top: 46%; text-align: center; font-size: clamp(28px, 6vw, 54px); letter-spacing: .18em; opacity: 0; transition: opacity .6s; }
#exo .ex-end.in { opacity: 1; }
`;
let injected = false;
const WORDS = ['VADE', 'EXI', 'LUX', 'CEDE', 'PAX', 'ABI'];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

export function runExorcism(o) {
  if (!injected) { const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); injected = true; }
  const heaven = !!o.heaven, light = Math.max(-1, Math.min(1, (o.sum || 0) / 12));
  // (how hard: the place, and a little the soul)
  const SP = heaven ? 3 : 6, MAXC = heaven ? 4 : 3, T = (heaven ? 2.4 : 1.45) * (1 + light * 0.12), TOL = (heaven ? 17 : 10) * (1 + light * 0.15), WT = heaven ? 4.2 : 2.6;
  const el = document.createElement('div'); el.id = 'exo'; el.style.setProperty('--c', o.color || '#fff');
  const runes = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<text x="${200 + Math.cos(a) * 176}" y="${206 + Math.sin(a) * 176}" text-anchor="middle" font-size="16" fill="rgba(255,255,255,.55)">${'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ'[i]}</text>`; }).join('');
  el.innerHTML = `<div class="ex-veil"></div><div class="ex-head"><h3>EXORCISM</h3><p>Cast them out of ${esc(o.name)}</p></div>
    <div class="ex-ring"><svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>${runes}
      <circle class="band" cx="200" cy="200" r="60" fill="none" stroke="#ffd45a" stroke-width="${(TOL * 2).toFixed(1)}" opacity=".28"/><circle cx="200" cy="200" r="60" fill="none" stroke="#ffd45a" stroke-width="2"/>
      <path d="M200 150 V250 M170 180 H230" stroke="rgba(255,255,255,.7)" stroke-width="4" stroke-linecap="round"/>
      <circle class="closer" cx="200" cy="200" r="180" fill="none" stroke="#fff" stroke-width="4"/></svg><div class="ex-word"></div></div>
    <div class="ex-foot"><span class="sp">SPIRITS${'<i class="on"></i>'.repeat(SP)}</span><span class="cr">CORRUPTION${'<i></i>'.repeat(MAXC)}</span></div><div class="ex-end"></div>`;
  o.host.appendChild(el);
  const closer = el.querySelector('.closer'), word = el.querySelector('.ex-word'), head = el.querySelector('.ex-head p'), end = el.querySelector('.ex-end');
  const spI = [...el.querySelectorAll('.sp i')], crI = [...el.querySelectorAll('.cr i')];
  let out = 0, corr = 0, trial = null, raf = 0, last = performance.now(), over = false;
  const beep = (f, d, g) => { try { o.audio?.beep?.(f, d, g); } catch (e) { /* no sound */ } };
  const flash = (k) => { el.classList.remove('hit', 'miss'); void el.offsetWidth; el.classList.add(k); setTimeout(() => el.classList.remove(k), 380); };
  const fail = () => { corr++; crI.forEach((x, i) => x.classList.toggle('on', i < corr)); flash('miss'); beep(70, 0.35, 0.09); if (corr >= MAXC) finish(false); };
  const banish = () => { spI[out]?.classList.replace('on', 'out'); o.onSpirit?.(out); out++; flash('hit'); beep(880, 0.2, 0.06); if (out >= SP) finish(true); else next(); };
  function next() {
    if (over) return;
    // (the words every third spirit - and in Hell every other one)
    const words = heaven ? out % 3 === 2 : out % 2 === 1;
    if (words) { const w = WORDS[(out * 7 + Math.floor(Math.random() * 3)) % WORDS.length]; trial = { kind: 'w', w, i: 0, t: 0 }; closer.style.display = 'none'; word.innerHTML = w.split('').map((ch) => `<span>${ch}</span>`).join(''); head.textContent = `Speak it: type ${w} before the light fades`; }
    else { trial = { kind: 's', t: 0 }; closer.setAttribute('r', '180'); closer.setAttribute('stroke', '#fff'); closer.style.display = ''; word.innerHTML = ''; head.textContent = 'SPACE as the ring crosses the golden band'; }
  }
  function finish(ok) {
    if (over) return; over = true; trial = null; closer.style.display = 'none'; word.innerHTML = '';
    end.textContent = ok ? 'THE BODY IS YOURS' : 'THEY HOLD ON'; end.style.color = ok ? '#fff' : '#ff3a5a'; end.classList.add('in'); beep(ok ? 523 : 55, 0.8, 0.08);
    setTimeout(() => { cleanup(); el.remove(); o.onDone?.(ok); }, ok ? 1600 : 1900);
  }
  const kd = (e) => {
    if (over || !trial) return; e.preventDefault(); e.stopPropagation();
    if (trial.kind === 's' && (e.key === ' ' || e.key === 'Enter')) sealPress();
    else if (trial.kind === 'w' && /^[a-z]$/i.test(e.key)) { const want = trial.w[trial.i]; if (e.key.toUpperCase() === want) { word.children[trial.i]?.classList.add('ok'); trial.i++; beep(660 + trial.i * 80, 0.08, 0.05); if (trial.i >= trial.w.length) banish(); } else { fail('wrongkey ' + e.key); if (!over) next(); } }
  };
  const sealPress = () => { if (trial.t < 0.12) return; const r = 180 * (1 - trial.t / T);   // (a press as the ring appears: the last one's, not this one's)
    if (Math.abs(r - 60) <= TOL) banish(); else { fail('sealmiss'); if (!over) next(); } };
  const ck = () => { if (!over && trial?.kind === 's') sealPress(); };
  window.addEventListener('keydown', kd, true); el.addEventListener('pointerdown', ck);
  const tick = (now) => {
    const dt = Math.min(1 / 30, (now - last) / 1000); last = now;   // (a slow frame slows the ritual: the ring never jumps the band)
    if (trial && !over) {
      trial.t += dt;
      if (trial.kind === 's') { const r = 180 * (1 - trial.t / T); closer.setAttribute('r', Math.max(0, r).toFixed(1)); closer.setAttribute('stroke', Math.abs(r - 60) <= TOL ? '#ffd45a' : '#fff'); if (r < 60 - TOL) { fail('late'); if (!over) next(); } }
      else if (trial.t > WT) { fail('wordtime'); if (!over) next(); }
      else word.style.opacity = String(1 - (trial.t / WT) * 0.6);
    }
    raf = requestAnimationFrame(tick);
  };
  setTimeout(() => { next(); raf = requestAnimationFrame(tick); }, 900);
  function cleanup() { cancelAnimationFrame(raf); window.removeEventListener('keydown', kd, true); el.removeEventListener('pointerdown', ck); }
}
