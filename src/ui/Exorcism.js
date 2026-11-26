// The exorcism (ui/Afterlife.js: your spirit at a portal, and in it a doll of the driver you would become - their suit,
// their number - hanging on its strings, and something in it that is not them). Nothing to play: it is watched, and it
// is meant to be hard to watch. You go in; it is still; its head snaps up at you (the first scare - as loud as the game
// goes). Then it fights you: the doll rattling on its strings, every joint jerking, its jaw dropping, screeching, the
// thing in it resisting - a choir chanting, a machine's crushed static, the spirits' words said by robotic voices
// layered over each other (in Hell your own deeds among them, career/Echoes.js spite), blood off it, rats pouring out
// of it each time one of them is torn loose. At the top the face splits and the thing inside comes at you (the second
// scare). Then -
//   it gives: everything fizzles away (every voice's pitch falling to nothing); the strings go; the doll crumples to the
//   ground, a twitch left in it; in the quiet a faint heart, a breath, and the watchers walking into it and out again as
//   they please. The body is yours.
//   or it does not (Hell, the first time): the doll comes off its strings straight at you - the last scare - and you are
//   thrown back into the dark, the laughter going on after.
// No words on the screen: blood thrown across it, the flashes. SPACE skips it, whenever.
// runExorcism({ host, heaven, sum, name, color, audio, snd, spite: [words], win (bool: does it give), onSpirit(k),
//   onLevel(v, phase, u), onScare(kind: 'snap' | 'reveal' | 'lunge'), onDone(ok) })

const CSS = `
#exo { position: absolute; inset: 0; z-index: 5; pointer-events: none; overflow: hidden; }
#exo .ex-veil { position: absolute; inset: 0; background: radial-gradient(circle at 50% 45%, transparent 25%, rgba(0,0,0,.6) 75%); transition: background .4s; }
#exo.top .ex-veil { animation: exStrobe .11s steps(2) infinite; }
@keyframes exStrobe { 50% { background: radial-gradient(circle at 50% 50%, rgba(255,255,255,.3), rgba(120,0,20,.75) 70%); } }
#exo.quiet .ex-veil { background: radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,.85) 75%); transition: background 2.5s; }
#exo .ex-flash { position: absolute; inset: 0; opacity: 0; background: #fff; }
#exo .ex-flash.on { animation: exFlash .55s steps(5) both; }
@keyframes exFlash { 0% { opacity: 1; background: #fff; } 20% { opacity: 1; background: #a00; } 40% { opacity: .1; } 60% { opacity: .9; background: #fff; } 100% { opacity: 0; } }
#exo .ex-black { position: absolute; inset: 0; background: #000; opacity: 0; transition: opacity .08s; }
#exo .ex-black.on { opacity: 1; }
#exo .ex-blood { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
#exo .ex-blood i { position: absolute; transform: translate(-50%, -50%) scale(.2); animation: exSplat .1s ease-out forwards, exFade 6s ease-in 2.5s forwards; }
#exo .ex-blood i canvas { width: 100%; height: 100%; display: block; }
#exo .ex-blood i::after { content: ''; position: absolute; left: 46%; top: 55%; width: 9%; height: 0; border-radius: 0 0 40% 40%; background: linear-gradient(180deg, rgba(110,0,0,.9), rgba(70,0,0,.85)); animation: exDrip 4s ease-in .2s forwards; }
@keyframes exSplat { to { transform: translate(-50%, -50%) scale(1); } }
@keyframes exDrip { to { height: 260%; } }
@keyframes exFade { to { opacity: 0; } }
`;
let injected = false;
const WHISPER = ['...still here', '...we can wait', '...mine', '...again', '...you let us in', '...we never left', '...soon', '...shhh'];
const NOOP_SND = new Proxy({}, { get: () => () => 0 });

export function runExorcism(o) {
  if (!injected) { const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); injected = true; }
  const heaven = !!o.heaven, snd = o.snd || NOOP_SND, win = o.win !== false;
  const SPITE = (o.spite && o.spite.length ? o.spite : ['GET OUT', 'NOT YOURS', 'DISGUSTING', 'SHAME']);
  // (the shape of it: how long it fights, how many are torn out of it)
  const SP = heaven ? 3 : 6, FIGHT = heaven ? 6.5 : 10;
  const el = document.createElement('div'); el.id = 'exo';
  el.innerHTML = '<div class="ex-veil"></div><div class="ex-blood"></div><div class="ex-flash"></div><div class="ex-black"></div>';
  o.host.appendChild(el);
  const bloodEl = el.querySelector('.ex-blood'), flashEl = el.querySelector('.ex-flash'), blackEl = el.querySelector('.ex-black');
  /** blood thrown on the screen: n splashes */
  const splash = (n, big = 1) => { for (let k = 0; k < n; k++) { const sz = Math.round((60 + Math.random() * 200) * big), b = splat(sz); b.style.cssText = `left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 90).toFixed(1)}%;width:${sz}px;height:${sz}px`; bloodEl.appendChild(b); setTimeout(() => b.remove(), 8500); } };
  /** one splatter, drawn: a wet blot of overlapping drops, a spray of droplets thrown out of it, streaks where it hit */
  function splat(sz) {
    const cv = document.createElement('canvas'); cv.width = cv.height = sz; cv.className = 'sp'; const g = cv.getContext('2d'), c = sz / 2, R = sz * 0.2;
    const col = () => `rgba(${100 + (Math.random() * 60) | 0},0,${(Math.random() * 12) | 0},${(0.85 + Math.random() * 0.15).toFixed(2)})`;
    g.fillStyle = col(); for (let k = 0; k < 9; k++) { const a = Math.random() * 6.28, r = Math.random() * R * 0.6; g.beginPath(); g.arc(c + Math.cos(a) * r, c + Math.sin(a) * r, R * (0.35 + Math.random() * 0.5), 0, 6.28); g.fill(); }
    for (let k = 0; k < 7; k++) { const a = Math.random() * 6.28, L = R * (1.2 + Math.random() * 1.2); g.strokeStyle = col(); g.lineWidth = R * (0.08 + Math.random() * 0.14); g.lineCap = 'round'; g.beginPath(); g.moveTo(c, c); g.lineTo(c + Math.cos(a) * L, c + Math.sin(a) * L); g.stroke(); }
    for (let k = 0; k < 40; k++) { const a = Math.random() * 6.28, r = R * (0.9 + Math.random() * 1.5); g.fillStyle = col(); g.beginPath(); g.arc(c + Math.cos(a) * r, c + Math.sin(a) * r, Math.max(1, R * Math.random() * 0.12), 0, 6.28); g.fill(); }
    g.globalCompositeOperation = 'source-atop'; const hl = g.createRadialGradient(c - R * 0.3, c - R * 0.3, 1, c, c, R * 1.4); hl.addColorStop(0, 'rgba(255,120,120,.35)'); hl.addColorStop(0.3, 'rgba(0,0,0,0)'); hl.addColorStop(1, 'rgba(0,0,0,.35)'); g.fillStyle = hl; g.fillRect(0, 0, sz, sz);
    const w = document.createElement('i'); w.appendChild(cv); return w;
  }
  const flash = () => { flashEl.classList.remove('on'); void flashEl.offsetWidth; flashEl.classList.add('on'); };
  /** a jumpscare: the stinger, the screen torn white and red, blood, the scene told */
  const scare = (kind, big = 1) => { snd.stinger(big); flash(); splash(kind === 'snap' ? 3 : 8, 1.2); o.onScare?.(kind); };
  let raf = 0, last = performance.now(), clock = 0, phase = 'still', ph0 = 0, out = 0, nextSpite = 0.8, nextScreech = 0.5, nextRattle = 0, nextWh = 0, beats = 0, ended = false, nextFlash = 2.5, nextSpin = 3, lastDone = false;
  const end1 = (ok) => { if (ended) return; ended = true; phase = 'done'; cleanup(); el.remove(); o.onDone?.(ok); };
  const go = (p) => { phase = p; ph0 = clock; };
  /** a word of the spirits', said somewhere across the dark (heard, never written) */
  function spite(v) { const w = SPITE[(Math.random() * SPITE.length) | 0]; snd.voice(w, { f0: 60 + Math.random() * 150, rate: 0.75 + Math.random() * 0.8, gain: 0.2 + v * 0.4, ring: 25 + Math.random() * 80, dist: 0.5 + Math.random() * 0.5, pan: Math.random() * 2 - 1, say: Math.random() < 0.25 }); }
  /** one of them torn out of it: a scream, blood, the rats */
  function tear() { o.onSpirit?.(out); out++; snd.voice('AAAAAH', { f0: 220, rate: 0.6, gain: 0.5, ring: 90, dist: 1, pan: Math.random() * 2 - 1 }); snd.splat(0.6); splash(2, 0.8); }
  // SPACE: skipped, whenever - the outcome is what it would have been
  const kd = (e) => { e.stopPropagation(); if (e.code === 'Space' && !e.repeat) { e.preventDefault(); end1(win); } };
  window.addEventListener('keydown', kd, true);
  const tick = (now) => {
    const dt = Math.max(0, Math.min(window.__f1FastClock ? 0.3 : 1 / 30, (now - last) / 1000)); last = now; clock += dt; snd.tick(dt);
    const u = clock - ph0;
    if (phase === 'still') {
      // (it hangs there, its head down; the hum and nothing else)
      if (!heaven) snd.drone(0.5); o.onLevel?.(0, 'still', u);
      if (u > 1.6) { go('snap'); scare('snap', 0.9); }
    } else if (phase === 'snap') {
      o.onLevel?.(0.3, 'snap', u); if (u > 0.9) go('fight');
    } else if (phase === 'fight') {
      // (it fights: building as it goes - the choir, the machine, the words, the screeching, the rattling)
      const v = Math.min(1, 0.25 + 0.75 * (u / FIGHT)) * (heaven ? 0.85 : 1);
      snd.chant(0.25 + v * 0.75); snd.machine(Math.pow(v, 1.3)); if (!heaven) snd.drone(0.6 + v * 0.4);
      nextSpite -= dt; if (nextSpite <= 0) { spite(v); if (v > 0.6) spite(v); nextSpite = Math.max(0.1, 1.4 - v * 1.3) * (0.6 + Math.random() * 0.8); }
      nextScreech -= dt; if (nextScreech <= 0) { snd.screech(0.35 + v * 0.45); nextScreech = 0.6 + Math.random() * (2.2 - v * 1.6); }
      nextRattle -= dt; if (nextRattle <= 0) { snd.rattle(0.2 + v * 0.35, 0.25 + Math.random() * 0.4); nextRattle = 0.15 + Math.random() * 0.5; }
      if (out < SP && u > ((out + 1) / (SP + 0.6)) * FIGHT) tear();
      // (the face inside, flashed for a frame; the head turned right round)
      nextFlash -= dt; if (nextFlash <= 0) { o.onScare?.('flash'); snd.clang(0.4); nextFlash = 1.6 + Math.random() * 2.4; }
      nextSpin -= dt; if (nextSpin <= 0 && v > 0.45) { o.onScare?.('spin'); snd.screech(0.7); nextSpin = 2.5 + Math.random() * 2.5; }
      o.onLevel?.(v, 'fight', u);
      if (u > FIGHT) { go('top'); el.classList.add('top'); splash(6, 1.3); }
    } else if (phase === 'top') {
      // (the top: everything at once, the doll thrashing - then the face splits and the thing in it comes at you)
      snd.chant(1); snd.machine(1); if (Math.random() < dt * 10) spite(1); if (Math.random() < dt * 5) snd.screech(0.8); if (Math.random() < dt * 6) snd.rattle(0.5, 0.3);
      o.onLevel?.(1.2, 'top', u);
      if (u > 1.4) { go('reveal'); scare('reveal', 1); }
    } else if (phase === 'reveal') {
      o.onLevel?.(1.2, 'reveal', u);
      if (u > 1.1) {
        el.classList.remove('top');
        if (win) { go('fizzle'); el.classList.add('quiet'); snd.fizzle(2.6); }
        else { go('lunge'); scare('lunge', 1.1); for (let k = 0; k < 4; k++) snd.voice('ha ha ha ha ha', { f0: 55 + k * 18, rate: 0.7 + k * 0.15, gain: 0.45, ring: 30 + k * 11, dist: 1, pan: k / 1.5 - 1, delay: 0.5 + k * 0.18 }); setTimeout(() => snd.fizzle(1.6), 1400); }
      }
    } else if (phase === 'lunge') {
      // (it does not give: off its strings and straight at you; black; thrown back)
      o.onLevel?.(1, 'lunge', u); if (u > 0.35) blackEl.classList.add('on'); if (u > 2.4) { end1(false); return; }
    } else if (phase === 'fizzle') {
      o.onLevel?.(Math.max(0, 1 - u / 2.4), 'fizzle', u); if (u > 2.9) go('frail');
    } else if (phase === 'frail') {
      // (the quiet: a heart, weak, picking up; breath; and them, coming and going)
      const gap = Math.max(0.85, 1.9 - u * 0.12);
      if (u > beats * gap + 0.4) { beats++; snd.heart(Math.min(0.55, 0.12 + beats * 0.05)); if (beats % 2 === 0) snd.breath(0.06 + Math.min(0.1, beats * 0.01), 1.2); }
      nextWh -= dt; if (nextWh <= 0) { nextWh = heaven ? 2.6 + Math.random() * 2 : 0.8 + Math.random() * 1.2; snd.voice(WHISPER[(Math.random() * WHISPER.length) | 0], { f0: 70 + Math.random() * 40, rate: 0.6, gain: 0.09, ring: 30, dist: 0.4, pan: Math.random() * 1.2 - 0.6 }); o.onLevel?.(0, 'spirit', u); }
      o.onLevel?.(0, 'frail', u);
      // (and just when it is quiet: its head up at you, one last time)
      if (!lastDone && u > (heaven ? 3.4 : 4.2)) { lastDone = true; scare('last', heaven ? 0.8 : 1.1); }
      if (u > (heaven ? 5.2 : 6.2)) { end1(true); return; }
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  function cleanup() { cancelAnimationFrame(raf); window.removeEventListener('keydown', kd, true); }
}
