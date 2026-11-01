// The one way a contract offer is chosen, and the one way being dropped is shown - every path through the career goes
// through here: the first offers after the academy, a renewal, a rival team's approach, a pre-contract for next season,
// a free agent's offers, a reserve role. What the player sees is whatever is registered: the contract table cutscene
// (three contracts on the table, the camera moving to each, the signature, the headlines, the shirt, the handshake) once
// it is loaded, else the caller's own plain screen (opts.fallback).
//
//   chooseOffer(offers, { career, kind, fallback }) -> Promise<index | null>   (null: none signed)
//   showDropped({ career, team, reason, fallback }) -> Promise<void>
//
// An offer is the career's offer object (career/Seat.js): team, tier, salary, years, role, replaces, bonuses, expects,
// patience, why - and whatever a kind adds (pre-contract, renewal, mid-season, reserve, negotiable). A scene shows the
// fields it knows and lists the rest plainly.

let offerScene = null, droppedScene = null;

/** the contract table cutscene: f(offers, opts) -> Promise<index | null> */
export function setOfferScene(f) { offerScene = typeof f === 'function' ? f : null; }
/** the dismissal cutscene: f(ctx) -> Promise<void> */
export function setDroppedScene(f) { droppedScene = typeof f === 'function' ? f : null; }

export async function chooseOffer(offers, opts = {}) {
  if (!Array.isArray(offers) || !offers.length) return null;
  if (offerScene) { try { return await offerScene(offers, opts); } catch (e) { console.warn('[offers] the contract scene failed - the plain screen instead', e); } }
  return opts.fallback ? opts.fallback(offers, opts) : null;
}

export async function showDropped(ctx = {}) {
  if (droppedScene) { try { await droppedScene(ctx); return; } catch (e) { console.warn('[offers] the dismissal scene failed - the plain screen instead', e); } }
  if (ctx.fallback) await ctx.fallback(ctx);
}
