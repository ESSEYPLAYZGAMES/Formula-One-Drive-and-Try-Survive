// Every mode run for a moment, every page error collected: the menus' ambient scene, a race with its pre-race show, a
// flashback, the crash camera, photo mode, an evening out, a night after a race. For a change that touches all of them
// (tools/regress.mjs checks the race's pictures; this, that nothing throws anywhere else).
//   node tools/smoke.mjs [track]
import { openGame } from './ai_lib.mjs';

const track = process.argv[2] || 'lasvegas', errs = [];
const g = await openGame(track), page = g.page;
page.on('pageerror', (e) => errs.push(`${cur}: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errs.push(`${cur}: console.error ${m.text().slice(0, 200)}`); });
let cur = 'menu';
const step = async (name, fn, secs = 8) => { cur = name; try { await page.evaluate(fn); } catch (e) { errs.push(`${name}: ${e.message.split('\n')[0]}`); } await page.waitForTimeout(secs * 1000); console.log(`${name}: ok (${errs.filter((e) => e.startsWith(name)).length} errors)`); };
try {
  await page.setViewportSize({ width: 480, height: 270 });
  await step('menu', () => { const F = window.__F1; F.settings.track = F.W.def.id; });
  await step('race with the pre-race show', () => { const F = window.__F1; Object.assign(F.settings, { grid: 'pick', slot: 12, len: 3, intro: 'on' }); F.restart(); }, 20);
  await step('race running', () => { const F = window.__F1, d = F.S.director; if (window.__F1.PRE?.on) window.__F1.PRE.skip?.(); for (let k = 0; k < 40 && !(d.world.racing && d.time - d.world.raceStart > 6); k++) F.stepSim(0.5); d.handOver(); }, 12);
  await step('cameras', () => { const F = window.__F1; for (let i = 0; i < 4; i++) F.camCtl.toggle(); }, 8);
  await step('crash camera frame', () => { const F = window.__F1; F.crashFrame(); }, 4);
  await step('photo mode', () => { const F = window.__F1; F.PHOTO.on = true; }, 6);
  await step('photo mode off', () => { const F = window.__F1; F.PHOTO.on = false; }, 4);
  await step('flashback', () => { const F = window.__F1, d = F.S.director; const fb = d.flashback; if (fb?.buf?.length) { const s = fb.at(d.time - 3); fb.restore(s); fb.cut(s.t); } }, 6);
  await step('evening out', () => { window.__F1.hangout('rooftop', []); }, 25);
  await step('night after a race', () => { window.__F1.party('vegasclub', { fast: true }); }, 25);
} finally { await g.close(); }
console.log(`${errs.length} errors`); for (const e of [...new Set(errs)].slice(0, 30)) console.log('  ' + e);
