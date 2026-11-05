// Where the frame time goes: a race (22 cars, the player's car handed to the AI so the chase camera, the HUD and
// everything else run as in play) on one circuit in a headless browser, its frames driven at a fixed 1/60 s (main.js
// frame(), the game's own loop stopped) on a small canvas - the GPU here is a software one; its work is measured apart
// (tools/gpuprof.mjs) - with Chrome's CPU profiler and its sampling allocation profiler on. Reports:
//   - the frame's phases: each call made directly by main.js frame(), by its share of the frame (inclusive time)
//   - the hottest functions by self time (file:line), and by inclusive time
//   - what allocates the most (bytes sampled, by allocation site): garbage the collector then has to clear
//   - draw calls and triangles per frame, the frame time, the build (load) time of the circuit
//   node tools/profile.mjs [track] [frames] [out.json]       (the whole profile is written to out.json if named)
//   PROFILE_MODE=menu: the home screen's ambient scene instead of a race
import fs from 'fs';
import { openGame } from './ai_lib.mjs';

const track = process.argv[2] || 'lasvegas', nFrames = +(process.argv[3] || 600), out = process.argv[4];
const t0 = Date.now();
const g = await openGame(track);
const loadS = (Date.now() - t0) / 1000;
const page = g.page;
try {
  // (a small canvas: the GPU here is a software one - its work is not what is measured, the main thread's is)
  await page.setViewportSize({ width: +(process.env.PROFILE_W || 320), height: +(process.env.PROFILE_H || 180) });
  if (process.env.PROFILE_MODE !== 'menu') {
    await page.evaluate(() => {
      const F = window.__F1; Object.assign(F.settings, { grid: 'pick', slot: 12, len: 5, intro: 'off', sc: 'on', fail: 'on' });
      F.restart();
      // (to the green light and a few seconds on without drawing, then the player's car to the AI: the race as you would
      //  see it from the chase camera)
      const d = F.S.director; for (let k = 0; k < 60 && !(d.world.racing && d.time - d.world.raceStart > 8); k++) F.stepSim(0.5);
      d.handOver();
    });
  }
  // the game's own loop stopped; its frames driven here at a fixed 1/60 s, every one of them in full
  await page.evaluate(async () => { window.requestAnimationFrame = () => 0; await new Promise((r) => setTimeout(r, 300)); window.__ft = performance.now(); });
  const run = (n) => page.evaluate((n) => { const F = window.__F1; for (let i = 0; i < n; i++) { window.__ft += 1000 / 60; F.frame(window.__ft); } return F.perf(); }, n);
  await run(120);   // (shaders compiled, caches warm)
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
  await cdp.send('HeapProfiler.enable'); await cdp.send('HeapProfiler.startSampling', { samplingInterval: 8192 });
  await cdp.send('Profiler.start');
  const samples = []; const wall0 = Date.now();
  for (let k = 0; k < nFrames; k += 60) samples.push(await run(Math.min(60, nFrames - k)));
  const wall = Date.now() - wall0;
  const { profile } = await cdp.send('Profiler.stop');
  const { profile: heap } = await cdp.send('HeapProfiler.stopSampling');
  const secs = nFrames / 60;
  if (out) fs.writeFileSync(out, JSON.stringify({ profile, heap }));

  // ---- the CPU profile: self time per node, inclusive time per node
  const N = new Map(profile.nodes.map((n) => [n.id, { ...n, self: 0, incl: 0 }]));
  const dts = profile.timeDeltas; let total = 0;
  for (let i = 0; i < profile.samples.length; i++) { const n = N.get(profile.samples[i]); const dt = dts[i] || 0; n.self += dt; total += dt; }
  const parent = new Map(); for (const n of N.values()) for (const c of n.children || []) parent.set(c, n.id);
  const incl = (n) => { if (n._i != null) return n._i; let s = n.self; for (const c of n.children || []) s += incl(N.get(c)); return (n._i = s); };
  for (const n of N.values()) n.incl = incl(n);
  const name = (n) => { const f = n.callFrame; const file = (f.url || '').split('/').slice(-2).join('/'); return `${f.functionName || '(anon)'} ${file}:${f.lineNumber + 1}`; };
  const idle = [...N.values()].filter((n) => /^\((idle|program|garbage collector)\)$/.test(n.callFrame.functionName)).reduce((m, n) => (m[n.callFrame.functionName] = (m[n.callFrame.functionName] || 0) + n.self, m), {});
  // by function (merged across call sites)
  const byFn = new Map(), byFnIncl = new Map(), byFile = new Map();
  for (const n of N.values()) {
    const k = name(n); byFn.set(k, (byFn.get(k) || 0) + n.self);
    const file = (n.callFrame.url || '(native)').split('/').slice(-2).join('/'); byFile.set(file, (byFile.get(file) || 0) + n.self);
    // (inclusive: not counted twice down a recursive chain)
    let p = parent.get(n.id), rec = false; while (p != null) { if (name(N.get(p)) === k) { rec = true; break; } p = parent.get(p); }
    if (!rec) byFnIncl.set(k, (byFnIncl.get(k) || 0) + n.incl);
  }
  // the frame's phases: the children of every frame() node
  const frames = [...N.values()].filter((n) => n.callFrame.functionName === 'frame' && /main\.js/.test(n.callFrame.url));
  const frameT = frames.reduce((s, n) => s + n.incl, 0), phases = new Map();
  for (const f of frames) { phases.set('(frame self)', (phases.get('(frame self)') || 0) + f.self); for (const c of f.children || []) { const n = N.get(c), k = name(n); phases.set(k, (phases.get(k) || 0) + n.incl); } }
  const ms = (us) => +(us / 1000).toFixed(2), pct = (us, of) => `${((100 * us) / of).toFixed(1)}%`;
  const top = (m, k, of) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([n, v]) => `  ${pct(v, of).padStart(6)}  ${String(ms(v)).padStart(8)} ms  ${n}`).join('\n');
  // ---- allocations: by site (self size)
  const allocs = new Map(); let allocT = 0;
  const walk = (n) => { const f = n.callFrame, k = `${f.functionName || '(anon)'} ${(f.url || '').split('/').slice(-2).join('/')}:${f.lineNumber + 1}`; allocs.set(k, (allocs.get(k) || 0) + n.selfSize); allocT += n.selfSize; for (const c of n.children || []) walk(c); };
  walk(heap.head);
  console.log(`== ${track}${process.env.PROFILE_MODE === 'menu' ? ' (menu)' : ''}: load ${loadS.toFixed(1)} s; ${nFrames} frames (${secs.toFixed(0)} s of game) in ${(wall / 1000).toFixed(1)} s wall; frame() ${ms(frameT / nFrames)} ms of main-thread JS a frame; draw calls ${samples.at(-1).calls}, triangles ${samples.at(-1).triangles}`);
  console.log(`profiled ${ms(total)} ms: frame() ${pct(frameT, total)}; idle ${pct(idle['(idle)'] || 0, total)}, GC ${pct(idle['(garbage collector)'] || 0, total)}, program ${pct(idle['(program)'] || 0, total)}`);
  console.log(`-- frame() phases (inclusive, share of frame()):\n${top(phases, 30, frameT)}`);
  console.log(`-- self time by file:\n${top(byFile, 25, total)}`);
  console.log(`-- self time by function:\n${top(byFn, 45, total)}`);
  console.log(`-- inclusive time by function:\n${top(byFnIncl, 45, total)}`);
  console.log(`-- allocations by site (sampled bytes, ${(allocT / 1048576).toFixed(1)} MB in ${secs} s):\n${[...allocs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([k, v]) => `  ${((100 * v) / allocT).toFixed(1).padStart(5)}%  ${(v / 1024).toFixed(0).padStart(7)} KB  ${k}`).join('\n')}`);
} finally { await g.close(); }
