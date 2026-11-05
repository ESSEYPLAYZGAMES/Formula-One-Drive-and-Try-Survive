// What each part of the scene costs to draw: a race as tools/profile.mjs sets it up, the camera where the chase camera
// has it, then the time of a synced render (readPixels waits for the GPU) at 1280 x 720 - in full, without the shadow
// pass (the shadow map left as it was), and with each top-level group hidden in turn. The GPU here is a software one
// (SwiftShader): the times are its, a proxy for the work (vertices, fragments, draw calls), to compare one against
// another and before against after - not a real GPU's milliseconds.
//   node tools/gpuprof.mjs [track] [reps]
import { openGame } from './ai_lib.mjs';

const track = process.argv[2] || 'lasvegas', reps = +(process.argv[3] || 3);
const g = await openGame(track);
try {
  await g.page.setViewportSize({ width: 1280, height: 720 });
  const r = await g.page.evaluate(async (reps) => {
    const F = window.__F1; Object.assign(F.settings, { grid: 'pick', slot: 12, len: 5, intro: 'off' });
    F.restart();
    const d = F.S.director; for (let k = 0; k < 60 && !(d.world.racing && d.time - d.world.raceStart > 8); k++) F.stepSim(0.5);
    d.handOver();
    window.requestAnimationFrame = () => 0; await new Promise((res) => setTimeout(res, 300));
    let t = performance.now(); for (let i = 0; i < 20; i++) { t += 1000 / 60; F.frame(t); }
    const R = F.renderer, gl = R.getContext(), sc = F.scene, cam = F.camera, px = new Uint8Array(4);
    const timed = () => { R.render(sc, cam); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); let best = 1e9; for (let i = 0; i < reps; i++) { const t0 = performance.now(); R.render(sc, cam); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); best = Math.min(best, performance.now() - t0); } return Math.round(best); };
    const out = { full: timed() };
    R.shadowMap.autoUpdate = false; out.noShadowPass = timed(); R.shadowMap.autoUpdate = true;
    const groups = new Map(); for (const o of sc.children) { const k = o.name || o.type; groups.set(k, [...(groups.get(k) || []), o]); }
    out.hidden = {};
    for (const [k, os] of groups) { const vis = os.map((o) => o.visible); if (!vis.some(Boolean)) continue; os.forEach((o) => (o.visible = false)); out.hidden[k] = timed(); os.forEach((o, i) => (o.visible = vis[i])); }
    return out;
  }, reps);
  console.log(`== ${track}: full render ${r.full} ms; without the shadow pass ${r.noShadowPass} ms (shadow pass ~${r.full - r.noShadowPass} ms)`);
  for (const [k, v] of Object.entries(r.hidden).sort((a, b) => a[1] - b[1])) console.log(`  without ${k.padEnd(22)} ${String(v).padStart(6)} ms  (it costs ~${r.full - v} ms)`);
} finally { await g.close(); }
