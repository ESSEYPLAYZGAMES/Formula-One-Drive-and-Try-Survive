// The broadcast's one way of arriving and leaving (the team principal's feed: ui/TVGraphics.js puts it on). Every
// element that comes and goes - the cards of the right-hand column (the battle, the car catching, the stop's clock,
// the safety car's and the red flag's, the info cards, STRATEGY), the caption under the picture, the commentary's
// line, the radio, race control's lines, the safety car's pill, the grid and the classification, the telemetry
// strip, the stingers, the hint - is drawn the way the stewards' cards and the replay's window already are: a line of
// light in its own colour runs across, the element opens behind it, its heading flickers on like a tube, and a soft
// glow of that colour stays round it; it leaves the way it came - closed back to the line, the line gone - and only
// then gives its place up. Nothing here knows what the elements say: it is their in / on classes, restyled.
// (Open states are clipped a little outside the box, so the glow is not cut off; #tvg.neon outranks each file's own
//  rules without caring which stylesheet was added last.)
const CSS = `
#tvg.neon { --nx-in: cubic-bezier(.2,.8,.2,1); --nx-out: cubic-bezier(.6,0,.8,.2); }
/* ---- the right-hand column's cards: opened from the right edge behind a running line; closed, they give up their height */
#tvg.neon .xr { gap: 0; }
#tvg.neon .xc { --n: #ff2d55; position: relative; right: auto; bottom: auto; margin-top: 8px; max-height: 460px; opacity: 1; transform: none; clip-path: inset(-24px -24px -24px -24px);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--n) 55%, transparent), 0 0 16px color-mix(in srgb, var(--n) 32%, transparent), 0 6px 22px rgba(0,0,0,.4);
  transition: clip-path .46s var(--nx-in) .1s, max-height .26s ease, margin-top .26s ease, opacity .08s ease .08s; }
#tvg.neon .xc:not(.in) { position: relative; right: auto; bottom: auto; clip-path: inset(-24px -24px -24px 100%); max-height: 0; margin-top: 0; opacity: 0; pointer-events: none;
  transition: clip-path .3s var(--nx-out), opacity .08s ease .3s, max-height .26s ease .34s, margin-top .26s ease .34s; }
#tvg.neon .xc::after { content: ''; position: absolute; top: 0; bottom: 0; left: 100%; width: 3px; margin-left: -2px; background: #fff; box-shadow: 0 0 10px 2px var(--n), 0 0 26px 6px color-mix(in srgb, var(--n) 65%, transparent); opacity: 0; pointer-events: none; z-index: 6; }
#tvg.neon .xc.in::after { animation: nxEdgeIn .46s var(--nx-in) .1s both; }
#tvg.neon .xc:not(.in)::after { animation: nxEdgeOut .3s var(--nx-out) both; }
#tvg.neon .xc .xh { text-shadow: 0 0 10px rgba(255,255,255,.55); box-shadow: 0 0 14px color-mix(in srgb, var(--n) 55%, transparent); }
/* (the tube catching: on the card itself - what is inside some cards is written again every frame, and would start over) */
#tvg.neon .xc.in { animation: nxCatch .75s steps(1) .2s 1; }
#tvg.neon .xr > .rpo { margin-top: 8px; }
#tvg.neon .xc.catch { --n: #2f8dff; } #tvg.neon .xc.pst { --n: #19e3ff; } #tvg.neon .xc.pst.done { --n: #2ee6a6; } #tvg.neon .xc.scc { --n: #ffd400; } #tvg.neon .xc.scc.red { --n: #ff2d55; }
#tvg.neon .xc.inf { --n: #8f9bff; } #tvg.neon .xc.inf.wx { --n: #2f8dff; } #tvg.neon .xc.stg { --n: #b98cff; }
#tvg.neon .xc.stg .ft b { box-shadow: 0 0 10px currentColor; }
#tvg.neon .xc.in .xg b { text-shadow: 0 0 14px color-mix(in srgb, var(--n) 70%, transparent); }
/* ---- the caption under the picture: drawn out from its middle, a line of light along its foot */
#tvg.neon .cap { --n: #19e3ff; transform: translate(-50%, 0); opacity: 0; overflow: visible; clip-path: inset(-20px 50% -20px 50%); box-shadow: 0 0 18px color-mix(in srgb, var(--n) 38%, transparent), 0 6px 22px rgba(0,0,0,.4);
  transition: clip-path .3s var(--nx-out), opacity .08s ease .3s; }
#tvg.neon .cap.in { opacity: 1; clip-path: inset(-20px -20px -20px -20px); transition: clip-path .5s var(--nx-in), opacity .06s; }
#tvg.neon .cap::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: var(--n); box-shadow: 0 0 10px var(--n), 0 0 22px var(--n); }
#tvg.neon .cap > :first-child { border-radius: 6px 0 0 6px; } #tvg.neon .cap > :last-child { border-radius: 0 6px 6px 0; }
#tvg.neon .cap.in .cn b { animation: nxLit .6s steps(1) .16s 1 both; }
#tvg.neon .cap .cp { box-shadow: 0 0 14px rgba(255,255,255,.5); }
/* ---- the commentary's line and the radio: unrolled from their coloured edge */
#tvg.neon .cm { --n: #ff2d55; transform: translate(-50%, 0); opacity: 0; border-left-color: var(--n); clip-path: inset(-18px 100% -18px -18px); box-shadow: -4px 0 16px -3px var(--n), 0 6px 20px rgba(0,0,0,.35);
  transition: clip-path .26s var(--nx-out), opacity .08s ease .26s, top .3s; }
#tvg.neon .cm.b { --n: #2f8dff; }
#tvg.neon .cm.in { opacity: 1; clip-path: inset(-18px -18px -18px -18px); transition: clip-path .42s var(--nx-in), opacity .06s, top .3s; }
#tvg.neon .cm.in small { animation: nxLit .5s steps(1) .12s 1 both; }
#tvg.neon .rad { transform: none; opacity: 0; clip-path: inset(-18px 100% -18px -18px); box-shadow: -4px 0 16px -3px var(--rc, #fff), inset 0 0 0 1px color-mix(in srgb, var(--rc, #fff) 30%, transparent), 0 6px 20px rgba(0,0,0,.35);
  transition: clip-path .26s var(--nx-out), opacity .08s ease .26s; }
#tvg.neon .rad.in { opacity: 1; clip-path: inset(-18px -18px -18px -18px); transition: clip-path .42s var(--nx-in), opacity .06s; }
#tvg.neon .rad small { text-shadow: 0 0 9px var(--rc, #fff); } #tvg.neon .rad.in b { animation: nxLit .5s steps(1) .14s 1 both; }
/* ---- race control's lines: each wipes in from the right behind its own colour, and folds away before it is taken off */
#tvg.neon .rc div { --n: #fff; border-left-color: var(--n); box-shadow: -4px 0 14px -3px var(--n), 0 4px 16px rgba(0,0,0,.35); animation: nxWipeL .42s var(--nx-in) both; }
#tvg.neon .rc div.warn { --n: #ffd400; } #tvg.neon .rc div.bad { --n: #ff2d55; } #tvg.neon .rc div.good { --n: #2ee6a6; } #tvg.neon .rc div.purple { --n: #b45cff; }
#tvg.neon .rc div small { color: var(--n); text-shadow: 0 0 8px var(--n); }
#tvg.neon .rc div.out { animation: nxWipeLOut .3s var(--nx-out) both; }
/* ---- the safety car's pill: by the tower (the top's middle is race control's), a tube of its colour */
#tvg.neon .banner { --n: #ffd400; display: block; left: 272px; transform: none; background: rgba(9,11,17,.92); color: var(--n); border: 1.5px solid var(--n); text-shadow: 0 0 10px var(--n); opacity: 0; clip-path: inset(46% 50% 46% 50%);
  box-shadow: 0 0 16px color-mix(in srgb, var(--n) 60%, transparent), inset 0 0 14px color-mix(in srgb, var(--n) 25%, transparent); transition: clip-path .3s var(--nx-out), opacity .08s ease .3s; }
#tvg.neon .banner.red { --n: #ff2d55; color: #fff; }
#tvg.neon .banner.on { opacity: 1; clip-path: inset(-20px -20px -20px -20px); transition: clip-path .5s var(--nx-in), opacity .06s; animation: nxLit .7s steps(1) .15s 1 both, nxPulse 1.6s ease-in-out 1s infinite; }
@media (max-width: 900px) { #tvg.neon .banner { left: 212px; } }
/* ---- the grid and the classification: let down from their heading */
#tvg.neon .gridg, #tvg.neon .cls { --n: #ff2d55; opacity: 0; clip-path: inset(-20px -20px 100% -20px); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--n) 45%, transparent), 0 0 18px color-mix(in srgb, var(--n) 30%, transparent), 0 8px 26px rgba(0,0,0,.4);
  transition: clip-path .34s var(--nx-out), opacity .08s ease .34s; }
#tvg.neon .cls { --n: #f2f4f7; transform: none; }
#tvg.neon .gridg.in, #tvg.neon .cls.in { opacity: 1; clip-path: inset(-20px -20px -20px -20px); transition: clip-path .6s var(--nx-in), opacity .06s; }
#tvg.neon.has-pip .cls.in { opacity: 0; }
#tvg.neon .gridg.in, #tvg.neon .cls.in { animation: nxCatch .75s steps(1) .2s 1; }
/* ---- the telemetry strip and the hint: opened from their middle */
#tvg.neon .tel { --n: #19e3ff; display: flex; opacity: 0; clip-path: inset(-16px 50% -16px 50%); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--n) 40%, transparent), 0 0 14px color-mix(in srgb, var(--n) 30%, transparent); transition: clip-path .28s var(--nx-out), opacity .08s ease .28s; }
#tvg.neon .tel.on { opacity: 1; clip-path: inset(-16px -16px -16px -16px); transition: clip-path .45s var(--nx-in), opacity .06s; }
#tvg.neon .sk { --n: #19e3ff; clip-path: inset(-14px 50% -14px 50%); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--n) 45%, transparent), 0 0 12px color-mix(in srgb, var(--n) 35%, transparent); transition: clip-path .26s var(--nx-out), opacity .08s ease .26s; }
#tvg.neon .sk.in { clip-path: inset(-14px -14px -14px -14px); transition: clip-path .42s var(--nx-in), opacity .06s; } #tvg.neon .sk b { box-shadow: 0 0 10px rgba(255,255,255,.6); }
/* ---- the stingers: a line across the picture that opens into the band and closes back to a line that runs off */
#tvg.neon .sting { --n: #ffd400; transform: none; clip-path: inset(50% 100% 50% 0); border-top: 2px solid #fff; border-bottom: 2px solid #fff; box-shadow: 0 0 34px var(--n), 0 0 90px color-mix(in srgb, var(--n) 55%, transparent); text-shadow: 0 0 18px rgba(255,255,255,.6); }
#tvg.neon .sting.r { --n: #ff2d55; } #tvg.neon .sting.g { --n: #2ee6a6; } #tvg.neon .sting.c { --n: #fff; }
#tvg.neon .sting.go { animation: nxSting 3.1s cubic-bezier(.3,.7,.2,1) forwards; }
/* ---- what is always there arrives too, when the feed comes up: the tower let down, the live tag and the map opened */
#tvg.neon .tower { box-shadow: inset 0 0 0 1px rgba(255,45,85,.28), 0 0 18px rgba(255,45,85,.16), 0 6px 22px rgba(0,0,0,.4); animation: nxDrop .7s var(--nx-in) both; }
#tvg.neon .th { box-shadow: 0 0 16px rgba(225,6,0,.6); }
#tvg.neon .live { box-shadow: inset 0 0 0 1px rgba(255,255,255,.16), 0 0 12px rgba(255,45,85,.25); animation: nxWipeL .5s var(--nx-in) .2s both; } #tvg.neon .live i { box-shadow: 0 0 8px #ff2d55; }
#tvg.neon .map { box-shadow: inset 0 0 0 1px rgba(25,227,255,.28), 0 0 14px rgba(25,227,255,.16); animation: nxWipeL .55s var(--nx-in) .3s both; }
/* (a place gained or lost on the tower: the number flares in its colour) */
#tvg.neon .r .p.up { text-shadow: 0 0 8px #3ddc84; animation: nxFlare .9s ease-out; } #tvg.neon .r .p.dn { text-shadow: 0 0 8px #ff8a80; animation: nxFlare .9s ease-out; }
#tvg.neon .r .g.pit { text-shadow: 0 0 8px #00d2ff; } #tvg.neon .r .g.out { text-shadow: 0 0 8px #ff5a4f; }
@keyframes nxEdgeIn { 0% { left: 100%; opacity: 1; } 80% { opacity: 1; } 100% { left: 0; opacity: 0; } }
@keyframes nxEdgeOut { 0% { left: 0; opacity: 1; } 85% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
@keyframes nxLit { 0% { opacity: 0; } 28% { opacity: 1; } 40% { opacity: .25; } 52%, 100% { opacity: 1; } }
@keyframes nxCatch { 0% { filter: brightness(2.1); } 26% { filter: none; } 40% { filter: brightness(1.7); } 52%, 100% { filter: none; } }
@keyframes nxPulse { 50% { box-shadow: 0 0 26px color-mix(in srgb, var(--n) 85%, transparent), inset 0 0 20px color-mix(in srgb, var(--n) 40%, transparent); } }
@keyframes nxWipeL { from { clip-path: inset(-16px -16px -16px 100%); opacity: 0; } 12% { opacity: 1; } to { clip-path: inset(-16px -16px -16px -16px); opacity: 1; } }
@keyframes nxWipeLOut { from { clip-path: inset(-16px -16px -16px -16px); opacity: 1; } 85% { opacity: 1; } to { clip-path: inset(-16px -16px -16px 100%); opacity: 0; } }
@keyframes nxDrop { from { clip-path: inset(-20px -20px 100% -20px); } to { clip-path: inset(-20px -20px -20px -20px); } }
@keyframes nxFlare { 0% { filter: brightness(2.4); transform: scale(1.35); } 100% { filter: none; transform: none; } }
@keyframes nxSting { 0% { clip-path: inset(49.4% 100% 49.4% 0); opacity: 1; } 9% { clip-path: inset(49.4% 0 49.4% 0); } 19% { clip-path: inset(-30px 0 -30px 0); } 24% { filter: brightness(1.8); } 30% { filter: none; } 80% { clip-path: inset(-30px 0 -30px 0); opacity: 1; } 90% { clip-path: inset(49.4% 0 49.4% 0); opacity: 1; } 100% { clip-path: inset(49.4% 0 49.4% 100%); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { #tvg.neon *, #tvg.neon *::after { animation-duration: .01s !important; transition-duration: .01s !important; } }
`;
/** root: the broadcast's layer (#tvg) */
export function neonOn(root) {
  if (!document.getElementById('tvneon-css')) { const st = document.createElement('style'); st.id = 'tvneon-css'; st.textContent = CSS; document.head.appendChild(st); }
  root.classList.add('neon');
}
