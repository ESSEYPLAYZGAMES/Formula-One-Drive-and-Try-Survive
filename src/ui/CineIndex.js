// Every cutscene by its name (ui/CineScenes.js: the set pieces; ui/CineScenes2.js: the drama's) and the one way to
// play one: playScene(name, ctx, o) -> Promise<{ choice, picks, qte, skipped }>. A scene known to be coming (a matter
// waiting at the HQ, the film a race earned) is made ready before it is asked for - prepareScene: its set built and its
// shaders compiled while the menus are up - and then starts at once.
import { playCine, cineLive, cinePrepare, cineTake, cineWarm } from './Cine.js';
import { SET_PIECES } from './CineScenes.js';
import { DRAMA } from './CineScenes2.js';

export const SCENES = { ...SET_PIECES, ...DRAMA };
export { cineLive, cineWarm };
const keyOf = (name, ctx) => { let s = ''; try { s = JSON.stringify(ctx); } catch (e) { s = String(Math.random()); } return `${name}|${s}`; };
const optsOf = (ctx, o) => ({ ...o, ctx, lite: o.lite ?? !!globalThis.__cineLite, seed: o.seed ?? `${ctx.season || ''}|${ctx.round || ''}` });   // (__cineLite: a test's - no shadows, no lens blur)
/** a scene made ready now, to be played later with the same name and ctx (quietly nothing if it cannot be) */
export function prepareScene(name, ctx = {}, o = {}) {
  const make = SCENES[name]; if (!make || cineLive()) return;
  let def = null; try { def = make(ctx); } catch (e) { return; }
  try { cinePrepare(keyOf(name, ctx), def, optsOf(ctx, o)); } catch (e) { /* played from scratch */ }
}
export function playScene(name, ctx = {}, o = {}) {
  const make = SCENES[name]; if (!make) return Promise.resolve({ skipped: true, failed: true });
  const st = cineTake(keyOf(name, ctx));
  if (st) return playCine(st.def, { ...optsOf(ctx, o), stage: st });
  let def = null; try { def = make(ctx); } catch (e) { console.error('[cine]', name, e); return Promise.resolve({ skipped: true, failed: true }); }
  return playCine(def, optsOf(ctx, o));
}
