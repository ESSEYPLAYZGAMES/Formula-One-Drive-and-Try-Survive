// Every cutscene by its name (ui/CineScenes.js: the set pieces; ui/CineScenes2.js: the drama's) and the one way to
// play one: playScene(name, ctx, o) -> Promise<{ choice, picks, qte, skipped }>.
import { playCine, cineLive } from './Cine.js';
import { SET_PIECES } from './CineScenes.js';
import { DRAMA } from './CineScenes2.js';

export const SCENES = { ...SET_PIECES, ...DRAMA };
export { cineLive };
export function playScene(name, ctx = {}, o = {}) {
  const make = SCENES[name]; if (!make) return Promise.resolve({ skipped: true, failed: true });
  let def = null; try { def = make(ctx); } catch (e) { console.error('[cine]', name, e); return Promise.resolve({ skipped: true, failed: true }); }
  return playCine(def, { ...o, ctx, lite: o.lite ?? !!globalThis.__cineLite, seed: o.seed ?? `${ctx.season || ''}|${ctx.round || ''}` });   // (__cineLite: a test's - no shadows, no lens blur)
}
