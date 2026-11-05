// Where a circuit's loading time goes: the game opened on the home screen, then the circuit built (main.js switchTrack)
// under Chrome's CPU profiler. Reports the build's wall time, its stages (the functions switchTrack calls, inclusive)
// and the hottest functions by self time - and when the first three frames after it are drawn (a shader left to compile
// on first use stalls those).
//   node tools/loadprof.mjs [track]
import { openGame } from './ai_lib.mjs';

const track = process.argv[2] || 'lasvegas', first = track === 'silverstone' ? 'lasvegas' : 'silverstone';
const g = await openGame(first);   // (another circuit first: what is measured is a full build of this one, as from the menu)
const page = g.page;
try {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 });
  await cdp.send('Profiler.start');
  const t0 = Date.now();
  await page.evaluate((t) => window.__F1.switchTrack(t), track);
  await page.waitForFunction(() => window.__F1.W.track && !window.__F1.W.loading, null, { timeout: 300000 });
  const wall = Date.now() - t0;
  // (and the first three frames drawn after it: a shader not compiled while loading is compiled here, the screen frozen)
  await page.evaluate(() => new Promise((r) => { let n = 0; const f = () => (++n >= 3 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
  const wall3 = Date.now() - t0;
  const { profile } = await cdp.send('Profiler.stop');
  const N = new Map(profile.nodes.map((n) => [n.id, { ...n, self: 0 }]));
  for (let i = 0; i < profile.samples.length; i++) N.get(profile.samples[i]).self += profile.timeDeltas[i] || 0;
  const incl = (n) => { if (n._i != null) return n._i; let s = n.self; for (const c of n.children || []) s += incl(N.get(c)); return (n._i = s); };
  const name = (n) => `${n.callFrame.functionName || '(anon)'} ${(n.callFrame.url || '').split('/').slice(-2).join('/')}:${n.callFrame.lineNumber + 1}`;
  let total = 0; for (const n of N.values()) total += n.self;
  const byIncl = new Map(), bySelf = new Map(), parent = new Map();
  for (const n of N.values()) for (const c of n.children || []) parent.set(c, n.id);
  for (const n of N.values()) {
    const k = name(n); bySelf.set(k, (bySelf.get(k) || 0) + n.self);
    let p = parent.get(n.id), rec = false; while (p != null) { if (name(N.get(p)) === k) { rec = true; break; } p = parent.get(p); }
    if (!rec) byIncl.set(k, (byIncl.get(k) || 0) + incl(n));
  }
  const idle = [...N.values()].filter((n) => n.callFrame.functionName === '(idle)').reduce((s, n) => s + n.self, 0);
  const top = (m, k) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([n, v]) => `  ${(v / 1000).toFixed(0).padStart(7)} ms  ${n}`).join('\n');
  console.log(`== ${track}: built in ${(wall / 1000).toFixed(1)} s wall, its first three frames drawn at ${(wall3 / 1000).toFixed(1)} s; ${(total / 1000).toFixed(0)} ms profiled, of it idle ${(idle / 1000).toFixed(0)} ms`);
  console.log(`-- inclusive:\n${top(byIncl, 50)}`);
  console.log(`-- self:\n${top(bySelf, 30)}`);
} finally { await g.close(); }
