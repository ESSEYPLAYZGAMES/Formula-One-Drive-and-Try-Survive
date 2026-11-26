// The exorcism (ui/Afterlife.js: your spirit at a portal, the body of the driver you would become held by spirits that
// are not theirs). Meant to be hard to watch. A ritual drawn over the scene - a circle of runes, the spirits cast out
// one by one, in two trials, in turn: THE SEAL - a ring of light closing on the circle; SPACE (or a click) as it
// crosses the golden band casts a spirit out; too early or too late, it fights back. THE WORDS - a word of command
// (VADE, EXI, LUX...) typed before the light fades; a wrong letter feeds the dark. Every failure darkens the circle
// (the corruption meter); full, and the spirits hold the body: you are thrown back.
// And all the while the noise (audio/AfterSound.js): a choir chanting, quickening; a machine's crushed static and
// metal; and the spirits' words (career/Echoes.js spite - in Hell, your own deeds thrown back at you) said by robotic
// voices and written over the screen, more and more of them at once, layered, as the ritual builds - the body in the
// portal shaking harder with every one cast out (o.onLevel: the scene shakes it). Then, the last one out: a moment at
// the top, and it all fizzles away - the voices' pitch falling to nothing, the words dying - and in the quiet the body
// weak, frail, a faint heart picking up, breathing; and the spirits drifting in and out of it as they please (in Hell,
// many; in Heaven, one or two). Heaven is gentler in the trials - fewer spirits, a slower ring, a wider band; Hell is
// not - and a soul that weighed light (the Reckoning's sum) is a little steadier still.
// No words on the screen (the sound carries it): the circle, the key to press (SPACE) or the word to type, the spirits
// left and the corruption as rows of marks; blood thrown across the screen with every failure and at the top. Once it is
// over - won or lost - SPACE skips what is left of it.
// runExorcism({ host, heaven, sum, name, color, audio, snd, spite: [words], onSpirit(k), onLevel(v, phase, u), onDone(ok) })

const CSS = `
#exo { position: absolute; inset: 0; z-index: 5; display: grid; place-items: center; pointer-events: auto; font-family: Georgia, serif; color: #fff; overflow: hidden; }
#exo .ex-veil { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,.55) 70%); transition: background .3s; }
#exo.hit .ex-veil { background: radial-gradient(circle at 50% 50%, rgba(255,255,255,.25), rgba(0,0,0,.4) 70%); }
#exo.miss .ex-veil { background: radial-gradient(circle at 50% 50%, rgba(255,0,40,.28), rgba(40,0,0,.7) 70%); }
#exo.miss .ex-ring { animation: exShake .35s; }
@keyframes exShake { 20% { transform: translate(-8px, 3px); } 40% { transform: translate(7px, -4px); } 60% { transform: translate(-5px, 2px); } 80% { transform: translate(3px, -1px); } }
#exo .ex-ring { position: relative; width: 420px; height: 420px; max-width: 86vw; max-height: 86vw; z-index: 2; }
#exo svg { width: 100%; height: 100%; overflow: visible; }
#exo .ex-head { position: absolute; top: 9%; left: 0; right: 0; text-align: center; z-index: 2; }
#exo .ex-head h3 { margin: 0; font-size: clamp(22px, 4vw, 34px); letter-spacing: .25em; text-shadow: 0 0 18px var(--c, #fff); }
#exo .ex-head p { margin: 8px 0 0; font: 600 13px/1.4 system-ui, sans-serif; opacity: .85; }
#exo .ex-word { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); text-align: center; font-size: clamp(44px, 9vw, 80px); letter-spacing: .3em; pointer-events: none; }
#exo .ex-word span { opacity: .35; transition: opacity .15s, text-shadow .15s; } #exo .ex-word span.ok { opacity: 1; text-shadow: 0 0 18px #fff, 0 0 30px var(--c, #fff); }
#exo .ex-foot { position: absolute; bottom: 10%; left: 0; right: 0; display: flex; justify-content: center; gap: 30px; font: 700 11px/1 system-ui, sans-serif; letter-spacing: .2em; z-index: 2; }
#exo .ex-foot i { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-left: 5px; vertical-align: -2px; background: #2a0a1a; border: 1px solid rgba(255,255,255,.5); }
#exo .ex-foot .sp i.on { background: #110008; box-shadow: 0 0 8px #ff2a6a; } #exo .ex-foot .sp i.out { background: #fff; box-shadow: 0 0 10px #fff; }
#exo .ex-foot .cr i.on { background: #ff1a3a; box-shadow: 0 0 10px #ff1a3a; }
#exo .ex-end { position: absolute; left: 0; right: 0; top: 44%; text-align: center; font-size: clamp(28px, 6vw, 54px); letter-spacing: .18em; opacity: 0; transition: opacity 1.2s; z-index: 3; }
#exo .ex-end small { display: block; margin-top: 14px; font: italic 400 clamp(14px, 1.8vw, 19px)/1.5 Georgia, serif; letter-spacing: .04em; opacity: .8; }
#exo .ex-end.in { opacity: 1; }
#exo .ex-key { position: absolute; left: 0; right: 0; bottom: 21%; text-align: center; z-index: 2; transition: opacity .2s; }
#exo .ex-key kbd { font: 700 12px/1 system-ui, sans-serif; letter-spacing: .2em; padding: 7px 14px; border: 1px solid rgba(255,255,255,.6); border-radius: 5px; color: #fff; background: rgba(0,0,0,.35); }
#exo .ex-key.off { opacity: 0; }
#exo .ex-foot { gap: 60px; }
/* (blood on the screen: splashes, running down) */
#exo .ex-blood { position: absolute; inset: 0; z-index: 4; pointer-events: none; overflow: hidden; }
#exo .ex-blood i { position: absolute; border-radius: 50%; background: radial-gradient(circle at 45% 40%, rgba(150,0,0,.95), rgba(90,0,0,.9) 45%, rgba(60,0,0,.6) 62%, rgba(60,0,0,0) 72%); transform: translate(-50%, -50%) scale(.2); animation: exSplat .12s ease-out forwards, exFade 6s ease-in 2s forwards; }
#exo .ex-blood i::after { content: ''; position: absolute; left: 46%; top: 55%; width: 9%; height: 0; border-radius: 0 0 40% 40%; background: linear-gradient(180deg, rgba(110,0,0,.9), rgba(70,0,0,.85)); animation: exDrip 4s ease-in .2s forwards; }
@keyframes exSplat { to { transform: translate(-50%, -50%) scale(1); } }
@keyframes exDrip { to { height: 260%; } }
@keyframes exFade { to { opacity: 0; } }
/* (the words of the spirits: thrown everywhere, layered, behind the circle) */
#exo .ex-cac { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
#exo .ex-cac b { position: absolute; white-space: nowrap; transform: translate(-50%, -50%) rotate(var(--r, 0deg)); font-weight: 700; letter-spacing: .06em; animation: exIn .12s steps(2) both, exJit .09s steps(2) infinite; mix-blend-mode: screen; transition: opacity .5s, filter 1.8s, transform 2.4s; }
#exo .ex-cac b.m { font-family: 'Courier New', monospace; letter-spacing: .2em; }
#exo .ex-cac b.r { color: #ff2a4a; text-shadow: 0 0 12px #ff0030, 2px 0 #00e5ff; } #exo .ex-cac b.w { color: #fff; text-shadow: -2px 0 #ff0040, 2px 0 #00e5ff; } #exo .ex-cac b.d { color: #4a0010; mix-blend-mode: normal; text-shadow: 0 0 8px #000; }
#exo .ex-cac b.out { opacity: 0 !important; }
#exo .ex-cac b.die { animation: none; opacity: 0 !important; filter: blur(10px); transform: translate(-50%, 40%) rotate(var(--r, 0deg)) scale(.8); }
#exo .ex-cac b.wh { color: rgba(255,255,255,.55); font: italic 400 15px Georgia, serif; text-shadow: 0 0 6px rgba(0,0,0,.8); mix-blend-mode: normal; animation: exIn .8s ease both; }
@keyframes exIn { from { opacity: 0; } }
@keyframes exJit { 50% { margin-left: 2px; margin-top: -1px; } }
/* (the screen itself, at the top: torn) */
#exo.top .ex-veil { animation: exStrobe .11s steps(2) infinite; }
@keyframes exStrobe { 50% { background: radial-gradient(circle at 50% 50%, rgba(255,255,255,.35), rgba(120,0,20,.75) 70%); } }
#exo.quiet .ex-veil { background: radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,.82) 75%); transition: background 2.5s; }
#exo.quiet .ex-ring, #exo.quiet .ex-head, #exo.quiet .ex-foot { opacity: 0; transition: opacity 1.4s; }
`;
let injected = false;
const WORDS = ['VADE', 'EXI', 'LUX', 'CEDE', 'PAX', 'ABI'];
const WHISPER = ['...still here', '...we can wait', '...mine', '...again', '...you let us in', '...we never left', '...soon', '...shhh'];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const NOOP_SND = new Proxy({}, { get: () => () => 0 });

export function runExorcism(o) {
  if (!injected) { const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); injected = true; }
  const heaven = !!o.heaven, light = Math.max(-1, Math.min(1, (o.sum || 0) / 12)), snd = o.snd || NOOP_SND;
  const SPITE = (o.spite && o.spite.length ? o.spite : ['GET OUT', 'NOT YOURS', 'DISGUSTING', 'SHAME']);
  // (how hard: the place, and a little the soul)
  const SP = heaven ? 3 : 6, MAXC = heaven ? 4 : 3, T = (heaven ? 2.4 : 1.45) * (1 + light * 0.12), TOL = (heaven ? 17 : 10) * (1 + light * 0.15), WT = heaven ? 4.2 : 2.6;
  const el = document.createElement('div'); el.id = 'exo'; el.style.setProperty('--c', o.color || '#fff');
  const runes = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<text x="${200 + Math.cos(a) * 176}" y="${206 + Math.sin(a) * 176}" text-anchor="middle" font-size="16" fill="rgba(255,255,255,.55)">${'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ'[i]}</text>`; }).join('');
  el.innerHTML = `<div class="ex-veil"></div><div class="ex-cac"></div><div class="ex-head"><p hidden></p></div><div class="ex-key"><kbd>SPACE</kbd></div><div class="ex-blood"></div>
    <div class="ex-ring"><svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>${runes}
      <circle class="band" cx="200" cy="200" r="60" fill="none" stroke="#ffd45a" stroke-width="${(TOL * 2).toFixed(1)}" opacity=".28"/><circle cx="200" cy="200" r="60" fill="none" stroke="#ffd45a" stroke-width="2"/>
      <circle class="closer" cx="200" cy="200" r="180" fill="none" stroke="#fff" stroke-width="4"/></svg><div class="ex-word"></div></div>
    <div class="ex-foot"><span class="sp">${'<i class="on"></i>'.repeat(SP)}</span><span class="cr">${'<i></i>'.repeat(MAXC)}</span></div><div class="ex-end"></div>`;
  o.host.appendChild(el);
  const closer = el.querySelector('.closer'), word = el.querySelector('.ex-word'), head = el.querySelector('.ex-head p'), end = el.querySelector('.ex-end'), cac = el.querySelector('.ex-cac'), ringEl = el.querySelector('.ex-ring');
  const spI = [...el.querySelectorAll('.sp i')], crI = [...el.querySelectorAll('.cr i')], keyEl = el.querySelector('.ex-key'), bloodEl = el.querySelector('.ex-blood');
  /** blood thrown on the screen: n splashes, big or small */
  const splash = (n, big = 1) => { for (let k = 0; k < n; k++) { const b = document.createElement('i'), sz = (40 + Math.random() * 160) * big; b.style.cssText = `left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 90).toFixed(1)}%;width:${sz.toFixed(0)}px;height:${(sz * (0.7 + Math.random() * 0.5)).toFixed(0)}px`; bloodEl.appendChild(b); setTimeout(() => b.remove(), 8500); } };
  let ended = false, overAt = 0;
  const end1 = (ok) => { if (ended) return; ended = true; phase = 'done'; cleanup(); el.remove(); o.onDone?.(ok); };
  let out = 0, corr = 0, trial = null, raf = 0, last = performance.now(), over = false, phase = 'ritual', ph0 = 0, clock = 0, nextSpite = 1.2, nextWh = 0, beats = 0;
  const beep = (f, d, g) => { try { o.audio?.beep?.(f, d, g); } catch (e) { /* no sound */ } };
  const flash = (k) => { el.classList.remove('hit', 'miss'); void el.offsetWidth; el.classList.add(k); setTimeout(() => el.classList.remove(k), 380); };
  const fail = () => { corr++; crI.forEach((x, i) => x.classList.toggle('on', i < corr)); flash('miss'); beep(70, 0.35, 0.09); snd.clang(0.5); snd.splat(0.5); splash(2); if (corr >= MAXC) finish(false); };
  const banish = () => { spI[out]?.classList.replace('on', 'out'); o.onSpirit?.(out); out++; flash('hit'); beep(880, 0.2, 0.06);
    // (a spirit cast out screams on its way: a voice torn upward)
    snd.voice('AAAAAH', { f0: 220, rate: 0.6, gain: 0.5, ring: 90, dist: 1, pan: Math.random() * 2 - 1 }); splash(1, 0.7);
    if (out >= SP) finish(true); else next(); };
  // (how loud and how much, now: rising with every spirit out and every failure)
  const level = () => Math.min(1, 0.22 + 0.62 * (out / SP) + 0.22 * (corr / MAXC)) * (heaven ? 0.8 : 1);
  /** a word of the spirits', thrown somewhere on the screen, and said */
  function throwSpite(v, opts = {}) {
    const w = SPITE[(Math.random() * SPITE.length) | 0], x = 6 + Math.random() * 88;   // (said - by a voice somewhere across the dark - never written)
    snd.voice(w, { f0: 60 + Math.random() * 150, rate: 0.75 + Math.random() * 0.8, gain: 0.2 + v * 0.4, ring: 25 + Math.random() * 80, dist: 0.5 + Math.random() * 0.5, pan: (x / 50) - 1, say: opts.say ?? Math.random() < 0.3 });
  }
  function next() {
    if (over) return;
    // (the words every third spirit - and in Hell every other one)
    const words = heaven ? out % 3 === 2 : out % 2 === 1;
    if (words) { const w = WORDS[(out * 7 + Math.floor(Math.random() * 3)) % WORDS.length]; trial = { kind: 'w', w, i: 0, t: 0 }; closer.style.display = 'none'; word.innerHTML = w.split('').map((ch) => `<span>${ch}</span>`).join(''); keyEl.classList.add('off'); }
    else { trial = { kind: 's', t: 0 }; closer.setAttribute('r', '180'); closer.setAttribute('stroke', '#fff'); closer.style.display = ''; word.innerHTML = ''; keyEl.classList.remove('off'); }
  }
  function finish(ok) {
    if (over) return; over = true; overAt = clock; trial = null; closer.style.display = 'none'; word.innerHTML = ''; keyEl.classList.add('off');
    if (!ok) {
      // (they hold on: they laugh, low, and it drains away)
      phase = 'fail'; ph0 = clock; for (let k = 0; k < 4; k++) snd.voice('ha ha ha ha ha', { f0: 55 + k * 18, rate: 0.7 + k * 0.15, gain: 0.45, ring: 30 + k * 11, dist: 1, pan: k / 1.5 - 1, delay: k * 0.18 });
      setTimeout(() => snd.fizzle(1.4), 900);
      splash(5, 1.3); beep(55, 0.8, 0.08);
      setTimeout(() => end1(false), 2600);
      return;
    }
    // (the last one out: the top, then the fall)
    phase = 'top'; ph0 = clock; el.classList.add('top'); for (let k = 0; k < 10; k++) throwSpite(1, { say: k === 0 }); splash(7, 1.4);
  }
  /** the end of it: everything fizzling away, then the quiet, the weak heart, the spirits coming and going */
  function toFizzle() {
    phase = 'fizzle'; ph0 = clock; el.classList.remove('top'); el.classList.add('quiet'); snd.fizzle(2.6);

  }
  function toFrail() { phase = 'frail'; ph0 = clock; nextWh = 0.6; beats = 0; }
  function toEnd() {
    phase = 'end'; ph0 = clock;

  }
  const kd = (e) => {
    if (over) { e.preventDefault(); e.stopPropagation(); if (e.code === 'Space' && !e.repeat && clock - overAt > 0.6) end1(phase !== 'fail'); return; }
    if (!trial) { e.stopPropagation(); return; } e.preventDefault(); e.stopPropagation();
    if (trial.kind === 's' && (e.key === ' ' || e.key === 'Enter')) sealPress();
    else if (trial.kind === 'w' && /^[a-z]$/i.test(e.key)) { const want = trial.w[trial.i]; if (e.key.toUpperCase() === want) { word.children[trial.i]?.classList.add('ok'); trial.i++; beep(660 + trial.i * 80, 0.08, 0.05); if (trial.i >= trial.w.length) banish(); } else { fail(); if (!over) next(); } }
  };
  const sealPress = () => { if (trial.t < 0.12) return; const r = 180 * (1 - trial.t / T);   // (a press as the ring appears: the last one's, not this one's)
    if (Math.abs(r - 60) <= TOL) banish(); else { fail(); if (!over) next(); } };
  const ck = () => { if (!over && trial?.kind === 's') sealPress(); };
  window.addEventListener('keydown', kd, true); el.addEventListener('pointerdown', ck);
  const tick = (now) => {
    const dt = Math.min(1 / 30, (now - last) / 1000); last = now; clock += dt;   // (a slow frame slows the ritual: the ring never jumps the band)
    const u = clock - ph0; snd.tick(dt);
    if (phase === 'ritual') {
      const v = level(); snd.chant(0.25 + v * 0.75); snd.machine(Math.pow(v, 1.3)); if (!heaven) snd.drone(0.6 + v * 0.4);
      nextSpite -= dt; if (nextSpite <= 0) { throwSpite(v); if (v > 0.6 && Math.random() < v - 0.4) throwSpite(v); nextSpite = Math.max(0.12, (heaven ? 1.9 : 1.5) - v * 1.45) * (0.6 + Math.random() * 0.8); }
      // (the circle trembling with it - a little: you still have to hit the band)
      const j = v * v * 3; ringEl.style.transform = `translate(${((Math.random() - 0.5) * j).toFixed(1)}px, ${((Math.random() - 0.5) * j).toFixed(1)}px)`;
      o.onLevel?.(v, 'ritual', 0);
      if (trial) {
        trial.t += dt;
        if (trial.kind === 's') { const r = 180 * (1 - trial.t / T); closer.setAttribute('r', Math.max(0, r).toFixed(1)); closer.setAttribute('stroke', Math.abs(r - 60) <= TOL ? '#ffd45a' : '#fff'); if (r < 60 - TOL) { fail(); if (!over) next(); } }
        else if (trial.t > WT) { fail(); if (!over) next(); }
        else word.style.opacity = String(1 - (trial.t / WT) * 0.6);
      }
    } else if (phase === 'top') {
      // (the top: everything at once, the screen torn, the body thrashing)
      snd.chant(1); snd.machine(1); if (Math.random() < dt * 14) throwSpite(1, { say: false }); if (Math.random() < dt * 6) snd.clang(0.6);
      ringEl.style.transform = `translate(${((Math.random() - 0.5) * 10).toFixed(1)}px, ${((Math.random() - 0.5) * 10).toFixed(1)}px)`;
      o.onLevel?.(1.25, 'top', u); if (u > 1.5) toFizzle();
    } else if (phase === 'fizzle') {
      ringEl.style.transform = ''; o.onLevel?.(Math.max(0, 1 - u / 2.4), 'fizzle', u); if (u > 2.9) toFrail();
    } else if (phase === 'frail' || phase === 'end') {
      // (the quiet: a heart, weak, picking up; breath; and the spirits, coming and going)
      const gap = Math.max(0.85, 1.9 - u * 0.12);
      if (u > beats * gap + 0.4) { beats++; snd.heart(Math.min(0.55, 0.12 + beats * 0.05)); if (beats % 2 === 0) snd.breath(0.06 + Math.min(0.1, beats * 0.01), 1.2); }
      nextWh -= dt; if (nextWh <= 0) {
        nextWh = heaven ? 2.6 + Math.random() * 2 : 0.8 + Math.random() * 1.2;
        const w = WHISPER[(Math.random() * WHISPER.length) | 0], x = 30 + Math.random() * 40;
        snd.voice(w, { f0: 70 + Math.random() * 40, rate: 0.6, gain: 0.09, ring: 30, dist: 0.4, pan: x / 50 - 1 });
        o.onLevel?.(0, 'spirit', u);   // (one goes in, or out - the scene draws it)
      }
      o.onLevel?.(0, phase, u);
      if (phase === 'frail' && u > (heaven ? 3.2 : 4.2)) toEnd();
      else if (phase === 'end' && u > 1.2) { end1(true); return; }
    } else if (phase === 'fail') o.onLevel?.(Math.max(0, 0.8 - u * 0.4), 'fail', u);
    raf = requestAnimationFrame(tick);
  };
  setTimeout(() => { next(); raf = requestAnimationFrame(tick); }, 900);
  function cleanup() { cancelAnimationFrame(raf); window.removeEventListener('keydown', kd, true); el.removeEventListener('pointerdown', ck); }
}
