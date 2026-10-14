// The TECH TREE screen of the career hub: your team's development laid out a branch at a time. Nine branch chips
// along the top, each with a ring for how much of the branch is on the car; under them the factory's queue - every
// slot it has, what is being built in each, how far along it is and the round it reaches the car - and what the branch
// has given the car so far against what it could. Then the branch's upgrades as cards, a pip for every level: solid
// when it is on the car (bright when it beat its promise, hatched in amber when it fell short), striped while it is
// being built, outlined for the next one. The chosen upgrade on a card that never scrolls: a stepper along its levels
// and the level picked in full - its effect, price, time and what it needs first, how it correlated on your car (a poor
// one can be re-tuned) and how many rivals have it; behind the card's tabs what the upgrade really is and what helps it,
// and how many rival teams sit at each level (all three at once when the card is tall enough); the button always in
// view. At the foot the factory itself: the development slots, what the facilities save, and the wind-tunnel time the
// FIA's sliding scale allows you from where you sit in the constructors' championship.
import { BRANCHES, UPGRADES, UP, CAR_BRANCHES, MAX_SLOTS, RETUNE_BELOW, levelOf, nextLevel, missingReq, upgradeState, levelCost, levelRounds, retuneCost, retuneState, retuneWhere, develop, retune, techEffects, atrInfo, facilityFx, expectedQ, devSlots, upgradeName, fxText, levelWorth, branchProgress, partsCount, migrateTeam } from '../career/TechTree.js';

export const TECH_CSS = `
#career .ch-panel:has(> .in > .tt) { width: min(max(640px, min(780px, calc(100vw - 600px))), calc(100vw - 286px)); }
#career .tt { --c: #36a3ff; }
#career .tt > * { animation: ttUp var(--m-base, 220ms) var(--ease-out, cubic-bezier(.2,.8,.2,1)) both; }
${Array.from({ length: 8 }, (_, i) => `#career .tt > *:nth-child(${i + 1}) { animation-delay: calc(${i} * var(--m-stagger, 24ms)); }`).join('\n')}
@keyframes ttUp { from { opacity: 0; transform: translateY(10px); } }
#career .tt-head { display: flex; gap: 14px; align-items: flex-start; }
#career .tt-head .tt-hl { flex: 1; min-width: 0; } #career .tt-head .lead { margin-bottom: 12px; }
#career .tt-kpis { display: flex; gap: 6px; flex: none; }
#career .tt-kpi { background: #fff; border: 1px solid rgba(21,26,34,.07); border-radius: 12px; padding: 8px 10px; min-width: 74px; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#career .tt-kpi small { display: block; font: 700 9.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; color: #6b7480; text-transform: uppercase; }
#career .tt-kpi b { display: block; font: 800 16px/1.15 'Segoe UI', Arial, sans-serif; margin-top: 5px; color: #151a22; white-space: nowrap; }
#career .tt-kpi b i { font-style: normal; font-size: 11px; color: #8a93a0; font-weight: 700; }
#career .tt-msg { display: flex; gap: 9px; align-items: center; border-radius: 12px; padding: 10px 12px; font-size: 13px; line-height: 1.4; margin: 0 0 12px; }
#career .tt-msg b { flex: none; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; color: #fff; }
#career .tt-msg.ok { background: #effaf3; border: 1px solid #bfe8cf; color: #1d5e3c; } #career .tt-msg.ok b { background: #1fae64; }
#career .tt-msg.no { background: #fff4f2; border: 1px solid #ffc9c1; color: #8f2a20; } #career .tt-msg.no b { background: #e5484d; }
#career .tt-brs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
#career button.tt-br { position: relative; display: flex; align-items: center; gap: 9px; min-width: 0; text-align: left; padding: 8px 9px; border-radius: 13px; letter-spacing: 0; background: #fff; border: 1px solid rgba(21,26,34,.08); box-shadow: 0 2px 8px rgba(25,35,60,.04); }
#career button.tt-br.fac { background: linear-gradient(135deg, #f1f3f7, #fff 60%); }
#career button.tt-br.on { border-color: var(--c); box-shadow: 0 0 0 2px color-mix(in srgb, var(--c) 30%, transparent), 0 8px 20px rgba(25,35,60,.10); }
#career .tt-mono { flex: none; width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center; font: 900 10px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .03em; color: color-mix(in srgb, var(--c) 62%, #000); background: color-mix(in srgb, var(--c) 17%, #fff); }
#career button.tt-br.on .tt-mono, #career .tt-mono.big { background: var(--c); color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.35); }
#career .tt-brn { flex: 1; min-width: 0; }
#career .tt-brn b { display: block; font-size: 12.5px; color: #151a22; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; }
#career .tt-brn small { display: block; font-size: 10.5px; color: #6b7480; font-weight: 600; margin-top: 3px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .tt-brn small em { font-style: normal; color: color-mix(in srgb, var(--c) 60%, #000); font-weight: 800; }
#career .tt-ring { flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: conic-gradient(var(--c) calc(var(--p) * 1%), #e8ebf0 0); }
#career .tt-ring::before { content: ''; grid-area: 1 / 1; width: 22px; height: 22px; border-radius: 50%; background: #fff; }
#career .tt-ring i { grid-area: 1 / 1; position: relative; font: 800 8.5px/1 'Segoe UI', Arial, sans-serif; font-style: normal; color: #3a4350; }
#career .tt-q { margin-top: 12px; background: linear-gradient(180deg, #fff, #f7f8fa); border: 1px solid rgba(21,26,34,.07); border-radius: 16px; padding: 10px 12px 12px; }
#career .tt-qh { display: flex; align-items: baseline; gap: 10px; margin-bottom: 9px; flex-wrap: wrap; }
#career .tt-qh .lbl { margin: 0; }
#career .tt-slots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; }
#career .tt-slot { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; min-height: 76px; text-align: left; padding: 9px 10px 9px 13px; border-radius: 12px; letter-spacing: 0; overflow: hidden; }
#career button.tt-slot { background: #fff; border: 1px solid rgba(21,26,34,.08); box-shadow: 0 2px 8px rgba(25,35,60,.05); }
#career button.tt-slot::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--c); }
#career .tt-slot b { font-size: 12px; color: #151a22; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; }
#career .tt-slot small { font-size: 10.5px; color: #5d6675; font-weight: 600; line-height: 1.25; }
#career .tt-slot em { font-style: normal; font-size: 10.5px; font-weight: 700; color: #3a4350; margin-top: auto; line-height: 1.25; }
#career .tt-slot.free { border: 1.5px dashed #c9cfd8; background: rgba(255,255,255,.5); justify-content: center; }
#career .tt-slot.free b { color: #5d6675; }
#career .tt-slot.lock { border: 1.5px dashed #e3e7ed; background: repeating-linear-gradient(135deg, #f6f7f9 0 6px, #fff 6px 12px); justify-content: center; }
#career .tt-slot.lock b, #career .tt-slot.lock small { color: #9aa3ae; }
#career .tt-prog { display: block; height: 5px; border-radius: 3px; background: #eceff3; overflow: hidden; margin-top: 2px; }
#career .tt-prog i { display: block; height: 100%; border-radius: 3px; background: repeating-linear-gradient(90deg, var(--c) 0 6px, color-mix(in srgb, var(--c) 65%, #fff) 6px 9px); }
#career .tt-sec { margin-top: 12px; }
#career .tt-bh { display: grid; grid-template-columns: auto 1fr; gap: 6px 12px; align-items: center; background: linear-gradient(135deg, color-mix(in srgb, var(--c) 11%, #fff), #fff 70%); border: 1px solid rgba(21,26,34,.07); border-radius: 16px; padding: 12px 14px; }
#career .tt-mono.big { width: 42px; height: 42px; border-radius: 12px; font-size: 12px; }
#career .tt-bh h3 { margin: 0; font: 800 15px/1.2 'Segoe UI', Arial, sans-serif; color: #151a22; letter-spacing: .03em; }
#career .tt-bh p { margin: 3px 0 0; font-size: 12.5px; line-height: 1.45; color: #4a5361; }
#career .tt-mt { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px 14px; margin-top: 6px; }
#career .tt-mt div { display: grid; grid-template-columns: 1fr auto; gap: 3px 8px; align-items: baseline; font-size: 11.5px; color: #5d6675; }
#career .tt-mt b { color: #151a22; font-size: 12px; white-space: nowrap; } #career .tt-mt b small { color: #8a93a0; font-weight: 600; font-size: 10.5px; }
#career .tt-bar { grid-column: 1 / -1; display: block; height: 5px; border-radius: 3px; background: #e7eaef; overflow: hidden; }
#career .tt-bar i { display: block; height: 100%; border-radius: 3px; background: var(--c); }
#career .tt-ups { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
#career button.tt-up { position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 6px; min-width: 0; min-height: 104px; text-align: left; padding: 10px 11px 10px 14px; border-radius: 13px; letter-spacing: 0; font-weight: 600; background: #fff; border: 1px solid rgba(21,26,34,.08); box-shadow: 0 2px 8px rgba(25,35,60,.04); overflow: hidden; }
#career button.tt-up::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--c); opacity: .28; }
#career button.tt-up.s-max::before, #career button.tt-up.s-dev::before, #career button.tt-up.s-open::before { opacity: 1; }
#career button.tt-up.s-max { background: linear-gradient(160deg, color-mix(in srgb, var(--c) 10%, #fff), #fff 65%); }
#career button.tt-up.s-locked { background: #f8f9fb; } #career button.tt-up.s-locked .h b { color: #5d6675; }
#career button.tt-up.sel { border-color: var(--c); box-shadow: 0 0 0 2px color-mix(in srgb, var(--c) 30%, transparent), 0 10px 24px rgba(25,35,60,.12); }
#career .tt-up .h { display: flex; align-items: baseline; gap: 6px; }
#career .tt-up .h b { flex: 1; min-width: 0; font-size: 13px; line-height: 1.2; color: #151a22; }
#career .tt-up .h em { flex: none; font: 800 11px/1 'Segoe UI', Arial, sans-serif; font-style: normal; color: color-mix(in srgb, var(--c) 60%, #000); }
#career .tt-pp { display: flex; gap: 3px; }
#career .tt-pp i { flex: 1; height: 6px; border-radius: 3px; background: #e6e9ee; }
#career .tt-pp i.on { background: var(--c); }
#career .tt-pp i.on.qh { box-shadow: 0 0 0 1px #fff, 0 0 5px color-mix(in srgb, var(--c) 75%, transparent); }
#career .tt-pp i.on.qm { background: color-mix(in srgb, var(--c) 72%, #fff); }
#career .tt-pp i.on.ql { background: repeating-linear-gradient(135deg, var(--c) 0 3px, #f4c37a 3px 6px); }
#career .tt-pp i.dv { background: repeating-linear-gradient(90deg, var(--c) 0 3px, transparent 3px 6px); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 50%, transparent); }
#career .tt-pp i.nx { background: #fff; box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 55%, #c9cfd8); }
#career .tt-up .ln { font: 700 10.5px/1.3 'Segoe UI', Arial, sans-serif; letter-spacing: .05em; text-transform: uppercase; color: #5d6675; }
#career .tt-up.s-poor .ln { color: #c2412f; } #career .tt-up.s-dev .ln, #career .tt-up.s-max .ln { color: color-mix(in srgb, var(--c) 58%, #000); }
#career .tt-up .fx { font-size: 11.5px; line-height: 1.35; color: #3a4350; font-weight: 600; }
#career .tt-up .tg { display: flex; gap: 4px; flex-wrap: wrap; margin-top: auto; }
#career .tt-up .tg i { font: 800 9px/1 'Segoe UI', Arial, sans-serif; font-style: normal; letter-spacing: .1em; text-transform: uppercase; padding: 3px 6px; border-radius: 999px; }
#career .tt-up .tg i.v { background: #e5f6ec; color: #1f7a4a; } #career .tt-up .tg i.r { background: #fff1d6; color: #9a6400; }
#career .tt-det { position: relative; display: grid; grid-template-rows: auto minmax(0, 1fr) auto; gap: 10px; margin-top: 12px; background: #fff; border: 1px solid rgba(21,26,34,.07); border-radius: 18px; padding: 16px 16px 14px; box-shadow: 0 6px 22px rgba(25,35,60,.07); overflow: hidden; }
#career .tt-det::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 4px; background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 25%, #fff)); }
#career .tt-dh { display: flex; align-items: center; gap: 11px; min-width: 0; }
#career .tt-dh > div { flex: 1; min-width: 0; }
#career .tt-dh .tt-mono { flex: none; width: 40px; height: 40px; border-radius: 11px; font-size: 11px; background: var(--c); color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.35); }
#career .tt-dh h3 { margin: 0; font: 800 17px/1.15 'Segoe UI', Arial, sans-serif; color: #151a22; letter-spacing: .02em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#career .tt-dm { display: flex; align-items: center; gap: 8px; margin-top: 4px; min-width: 0; }
#career .tt-dm > span:first-child { min-width: 0; color: #6b7480; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .tt-st { margin-left: auto; flex: none; padding: 5px 9px; border-radius: 999px; font: 800 9.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; background: #eef1f5; color: #3a4350; white-space: nowrap; }
#career .tt-st.open { background: #e5f6ec; color: #1f7a4a; } #career .tt-st.poor { background: #fff0ec; color: #c2412f; }
#career .tt-st.max, #career .tt-st.dev { background: color-mix(in srgb, var(--c) 18%, #fff); color: color-mix(in srgb, var(--c) 55%, #000); }
#career .tt-dw { display: flex; flex-direction: column; gap: 10px; min-width: 0; min-height: 0; }
#career .tt-dt.k-seg { display: grid; flex: none; }
#career .tt-dt.k-seg > button { min-height: 28px; padding: 0 6px; font-size: 11.5px; }
#career .tt-dw:has(> .tt-db[data-p="ab"]) > .tt-dt { --k: 1; } #career .tt-dw:has(> .tt-db[data-p="gr"]) > .tt-dt { --k: 2; }
#career .tt-dw:has(> .tt-db[data-p="lv"]) > .tt-dt > [data-tdp="lv"], #career .tt-dw:has(> .tt-db[data-p="ab"]) > .tt-dt > [data-tdp="ab"], #career .tt-dw:has(> .tt-db[data-p="gr"]) > .tt-dt > [data-tdp="gr"] { color: var(--k-seg-on-fg, #151a22); }
#career .tt-db { flex: 1 1 auto; min-width: 0; min-height: 0; overflow: hidden auto; scrollbar-width: thin; }
#career .tt-pg { display: none; flex-direction: column; gap: 8px; min-width: 0; }
#career .tt-db[data-p="lv"] > .pg-lv, #career .tt-db[data-p="ab"] > .pg-ab, #career .tt-db[data-p="gr"] > .pg-gr { display: flex; }
#career .tt-pg > .tt-ph { display: none; margin: 0; }
#career .tt-dsc { margin: 0; color: #3a4350; font-size: 12.5px; line-height: 1.5; }
#career .tt-sup { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
#career .tt-db > .pg-ab > .tt-sup { margin: 0; }
#career .tt-sup span { font-size: 11.5px; font-weight: 600; color: #3a4350; background: #f2f4f7; border-radius: 999px; padding: 4px 9px; }
#career .tt-sup span.atr { background: #eaf2ff; color: #2a5ca8; } #career .tt-sup span.lo { background: #fff4e0; color: #8a5a00; }
#career .tt-steps { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 5px; }
#career button.tt-sp { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 0; padding: 7px 3px; border-radius: 10px; letter-spacing: 0; background: #fbfcfd; border: 1px solid #e6e9ee; box-shadow: none; }
#career .tt-sp i { display: block; width: 100%; max-width: 36px; height: 5px; border-radius: 3px; background: #e6e9ee; }
#career .tt-sp b { font: 800 12px/1 'Segoe UI', Arial, sans-serif; color: #3a4350; }
#career .tt-sp small { max-width: 100%; font: 700 10px/1.1 'Segoe UI', Arial, sans-serif; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .tt-sp.own i { background: var(--c); } #career .tt-sp.own.qm i { background: color-mix(in srgb, var(--c) 72%, #fff); }
#career .tt-sp.own.ql i { background: repeating-linear-gradient(135deg, var(--c) 0 3px, #f4c37a 3px 6px); } #career .tt-sp.own.ql small { color: #c2412f; }
#career .tt-sp.dev i, #career .tt-sp.own.re i { background: repeating-linear-gradient(90deg, var(--c) 0 3px, transparent 3px 6px); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 50%, transparent); }
#career .tt-sp.next i { background: #fff; box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 55%, #c9cfd8); } #career .tt-sp.next b { color: color-mix(in srgb, var(--c) 60%, #000); }
#career .tt-sp.lock { border-style: dashed; } #career .tt-sp.lock b, #career .tt-sp.lock small { color: #9aa3ae; }
${Array.from({ length: 6 }, (_, i) => `#career .pg-lv:has(> .tt-lpw[data-k="${i + 1}"]) > .tt-steps > .tt-sp:nth-child(${i + 1})`).join(', ')} { background: #fff; border-color: var(--c); box-shadow: inset 0 0 0 1px var(--c), 0 4px 12px rgba(25,35,60,.10); }
#career .tt-lpw { min-width: 0; }
#career .tt-lp { display: flex; flex-direction: column; gap: 8px; padding: 10px 11px 11px; border-radius: 12px; border: 1px solid #edf0f4; background: #fbfcfd; }
#career .tt-lp.own { background: linear-gradient(160deg, color-mix(in srgb, var(--c) 8%, #fff), #fff 70%); }
#career .tt-lp.dev { background: #fff; border-style: dashed; border-color: color-mix(in srgb, var(--c) 55%, #fff); }
#career .tt-lp.next { background: #fff; border-color: color-mix(in srgb, var(--c) 45%, #fff); box-shadow: 0 4px 14px rgba(25,35,60,.06); }
#career .tt-lh { display: flex; align-items: center; gap: 9px; }
#career .tt-lh .n { flex: none; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; font: 800 10.5px/1 'Segoe UI', Arial, sans-serif; color: #6b7480; background: #fff; box-shadow: inset 0 0 0 1.5px #d6dbe3; }
#career .tt-lp.own .n { background: var(--c); color: #fff; box-shadow: none; text-shadow: 0 1px 2px rgba(0,0,0,.3); }
#career .tt-lp.dev .n { background: repeating-linear-gradient(135deg, color-mix(in srgb, var(--c) 45%, #fff) 0 4px, #fff 4px 8px); color: #151a22; box-shadow: inset 0 0 0 1.5px var(--c); }
#career .tt-lp.next .n { box-shadow: inset 0 0 0 2px var(--c); color: color-mix(in srgb, var(--c) 60%, #000); }
#career .tt-lh b { flex: 1; min-width: 0; font-size: 13px; line-height: 1.25; color: #151a22; }
#career .tt-lh em { flex: none; padding: 4px 7px; border-radius: 999px; font: 800 9px/1 'Segoe UI', Arial, sans-serif; font-style: normal; letter-spacing: .1em; text-transform: uppercase; background: #eef1f5; color: #3a4350; }
#career .tt-lp.own .tt-lh em, #career .tt-lp.dev .tt-lh em { background: color-mix(in srgb, var(--c) 16%, #fff); color: color-mix(in srgb, var(--c) 55%, #000); }
#career .tt-lp.next .tt-lh em { background: #e5f6ec; color: #1f7a4a; } #career .tt-lp.lock .tt-lh em { background: #fff0ec; color: #c2412f; }
#career .tt-lp .e { margin: 0; font-size: 12px; font-weight: 600; line-height: 1.4; color: #3a4350; } #career .tt-lp .e small { font-size: 11px; color: #8a93a0; }
#career .tt-lf { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 5px; }
#career .tt-lf > div { min-width: 0; padding: 6px 8px 7px; border-radius: 9px; background: #f3f5f8; }
#career .tt-lf small { display: block; font: 700 9px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #6b7480; }
#career .tt-lf b { display: block; margin-top: 5px; font: 800 13px/1.15 'Segoe UI', Arial, sans-serif; color: #151a22; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .tt-lf b i { font-style: normal; font-size: 10.5px; color: #8a93a0; } #career .tt-lf .tt-cq { padding: 2px 6px; font-size: 11px; }
#career .tt-rq { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
#career .tt-rq small { margin-right: 2px; font: 700 9px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #6b7480; }
#career .tt-rq span { padding: 4px 7px; border-radius: 999px; font: 800 10px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .04em; }
#career .tt-rq .ok { background: #e5f6ec; color: #1f7a4a; } #career .tt-rq .no { background: #fff0ec; color: #c2412f; }
#career .tt-rt { display: flex; align-items: center; gap: 9px; } #career .tt-rt .tt-re { flex: none; }
#career .tt-rt span, #career .tt-lp .tt-ln { margin: 0; font-size: 11px; line-height: 1.35; color: #6b7480; }
#career .tt-cq { display: inline-block; font: 800 10px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; padding: 4px 8px; border-radius: 999px; }
#career .tt-cq.qh { background: #e5f6ec; color: #1f7a4a; } #career .tt-cq.qg { background: #eef1f5; color: #3a4350; } #career .tt-cq.qm { background: #fff6e0; color: #8a5a00; } #career .tt-cq.ql { background: #ffeadb; color: #b04a0c; }
#career button.tt-re { padding: 6px 9px; font-size: 10px; letter-spacing: .08em; border-color: #f0c27a; background: #fffaf0; color: #8a5a00; }
#career .tt-grd { display: flex; flex-direction: column; gap: 10px; }
#career .tt-grd p { margin: 0; font-size: 12px; color: #4a5361; line-height: 1.45; }
#career .tt-hist { display: flex; gap: 6px; align-items: flex-end; height: 76px; }
#career .tt-hist > div { flex: 1; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 3px; }
#career .tt-hist i { width: 100%; max-width: 38px; min-height: 3px; border-radius: 5px 5px 2px 2px; background: color-mix(in srgb, var(--c) 28%, #e8ebf0); }
#career .tt-hist .me i { background: var(--c); }
#career .tt-hist b { font: 800 11px/1 'Segoe UI', Arial, sans-serif; color: #3a4350; }
#career .tt-hist small { font: 700 9px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .08em; color: #8a93a0; white-space: nowrap; }
#career .tt-hist .me small { color: color-mix(in srgb, var(--c) 60%, #000); }
#career .tt-db .tt-grd > .tt-hist { height: 72px; }
#career .tt-act { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 14px; }
#career .tt-det > .tt-act { margin: 0; }
#career .tt-why { font-size: 12.5px; color: #5d6675; line-height: 1.4; }
#career .tt-fac { margin-top: 12px; display: grid; grid-template-columns: 1.2fr 1fr; gap: 10px; }
#career .tt-atr, #career .tt-fx, #career .tt-mxw { background: #fff; border: 1px solid rgba(21,26,34,.07); border-radius: 16px; padding: 12px 14px; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#career .tt-atr .lbl, #career .tt-fx .lbl, #career .tt-mxw .lbl { margin: 0 0 8px; }
#career .tt-ab { display: flex; align-items: center; gap: 12px; }
#career .tt-ab > b { font: 800 28px/1 'Segoe UI', Arial, sans-serif; color: #151a22; }
#career .tt-ab span { font-size: 12px; color: #4a5361; line-height: 1.45; }
#career .tt-scale { position: relative; height: 40px; margin: 12px 10px 2px; }
#career .tt-scale::before { content: ''; position: absolute; left: 0; right: 0; top: 11px; height: 6px; border-radius: 3px; background: linear-gradient(90deg, #f2c4bd, #eef1f5 55%, #bfe6cf); }
#career .tt-scale i { position: absolute; top: 9px; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,.25); }
#career .tt-scale i.me { top: 6px; width: 16px; height: 16px; margin-left: -8px; z-index: 1; box-shadow: 0 0 0 2px var(--tc), 0 2px 6px rgba(0,0,0,.25); }
#career .tt-scale small { position: absolute; top: 28px; transform: translateX(-50%); font: 700 9.5px/1 'Segoe UI', Arial, sans-serif; color: #8a93a0; }
#career .tt-scale small:first-of-type { transform: translateX(-5px); } #career .tt-scale small:last-of-type { transform: translateX(calc(-100% + 5px)); }
#career .tt-note { margin: 8px 0 0; font-size: 11.5px; line-height: 1.45; color: #6b7480; }
#career .tt-ft { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
#career .tt-ft div { background: #f7f8fa; border-radius: 11px; padding: 8px 9px; }
#career .tt-ft small { display: block; font: 700 9.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .12em; color: #6b7480; text-transform: uppercase; }
#career .tt-ft b { display: block; font: 800 17px/1.15 'Segoe UI', Arial, sans-serif; color: #151a22; margin-top: 4px; } #career .tt-ft b i { font-style: normal; font-size: 11px; color: #8a93a0; }
#career .tt-ft span { display: block; font-size: 10.5px; color: #6b7480; margin-top: 1px; }
#career .tt-mxw { grid-column: 1 / -1; }
#career .tt-mx { width: 100%; border-collapse: collapse; font-size: 12px; }
#career .tt-mx th { text-align: left; font: 700 9.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .12em; color: #6b7480; text-transform: uppercase; padding: 6px 6px 7px; border-bottom: 1px solid #e3e7ed; }
#career .tt-mx td { padding: 7px 6px; border-bottom: 1px solid #f0f2f5; color: #3a4350; }
#career .tt-mx td:first-child { font-weight: 700; color: #151a22; white-space: nowrap; }
#career .tt-mx td:first-child::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 2px; background: var(--c); margin-right: 7px; }
#career .tt-mx .up { color: #1f8a52; font-weight: 700; } #career .tt-mx .dn { color: #c2412f; font-weight: 700; }
#career .tt-side { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(21,26,34,.07); }
#career .tt-side div { display: flex; align-items: center; gap: 7px; font-size: 12.5px; color: #3a4350; }
#career .tt-side div::before { content: ''; flex: none; width: 7px; height: 7px; border-radius: 2px; background: var(--c); }
#career .tt-side em { margin-left: auto; font-style: normal; font-weight: 700; color: #151a22; white-space: nowrap; }
#career .hub-tt[data-sub=""] .tt > .tt-det { overflow: hidden; gap: 9px; }
#career .hub-tt[data-sub=""] .tt-det > .tt-act { flex-direction: column; flex-wrap: nowrap; align-items: stretch; gap: 6px; padding-top: 9px; border-top: 1px dashed #e3e7ed; }
#career .hub-tt[data-sub=""] .tt-det > .tt-act > .go { padding: 10px 12px; font-size: 11.5px; }
#career .hub-tt[data-sub=""] .tt-det > .tt-act > .tt-why { font-size: 11.5px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
#career .hub-tt[data-sub=""] .tt-up .h b, #career .hub-tt[data-sub=""] .tt-up .ln, #career .hub-tt[data-sub=""] .tt-up .fx { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
@media (min-width: 900px) { #career .hub-tt[data-sub=""] .tt-det > .tt-dw { container: ttd / size; } }
@container ttd (min-height: 690px) {
  #career .tt-dw > .tt-dt { display: none; }
  #career .tt-dw > .tt-db { display: flex; flex-direction: column; gap: 14px; }
  #career .tt-db > .tt-pg { display: flex; }
  #career .tt-pg > .tt-ph { display: block; }
  #career .tt-db .tt-grd > .tt-hist { height: 56px; }
}
@media (max-width: 900px) {
  #career .ch-panel:has(> .in > .tt) { width: auto; }
  #career .tt-head { flex-direction: column; gap: 0; } #career .tt-kpis { width: 100%; margin-bottom: 10px; } #career .tt-kpi { flex: 1; min-width: 0; }
  #career .tt-brs, #career .tt-slots, #career .tt-ups { grid-template-columns: 1fr 1fr; }
  #career .tt-fac { grid-template-columns: 1fr; }
}
@media (max-width: 899px) {
  #career .hub-tt, #career .hub-tt > .tt { height: auto; }
  #career .hub-tt[data-sub=""] .tt > .tt-brs, #career .hub-tt[data-sub=""] .tt > .tt-sec, #career .hub-tt[data-sub=""] .tt > .tt-det, #career .hub-tt[data-sub=""] .tt-dw, #career .hub-tt[data-sub=""] .tt-db { min-height: auto; overflow: visible; }
  #career .hub-tt[data-sub=""] .tt > .tt-det { overflow: clip; }
}
`;

// ---- small helpers (the hub's own, copied: this file never imports the hub) ---------------------------------------------
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = (m) => `$${(Math.round(m * 10) / 10).toFixed(1)}M`;
const pct = (v) => `${Math.round(v * 100)}%`;
const races = (n) => `${n} race${n === 1 ? '' : 's'}`;
const lin = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
/** a team colour that shows on the white panels (the hub's ink() without three.js: a near-white livery drawn in grey) */
const ink0 = (hex) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '')); if (!m) return '#8a93a0'; const n = parseInt(m[1], 16); return 0.2126 * lin((n >> 16) / 255) + 0.7152 * lin(((n >> 8) & 255) / 255) + 0.0722 * lin((n & 255) / 255) > 0.62 ? '#8a93a0' : `#${m[1]}`; };
const teamOf = (c) => c?.team || c?.teams?.[c?.myTeam] || null;
/** every team's development up to date before it is drawn (an old save the career has not migrated yet) */
const ready = (c) => { for (const t of Object.values(c?.teams || {})) if (!t.levels || t.nodes) migrateTeam(t); };
/** when a part due in `left` races reaches the car: 'from round 5' (or next season) */
const when = (c, left) => { const r = c.round + left; return r > c.rounds ? 'next season' : `from round ${r}`; };
/** when a slot due in `left` races frees up: 'after round 4' */
const after = (c, left) => { const r = c.round + left - 1; return r > c.rounds ? 'next season' : `after round ${r}`; };
const qCls = (q) => (q >= 1 ? 'qh' : q >= 0.92 ? 'qg' : q >= RETUNE_BELOW ? 'qm' : 'ql');
const qOf = (t, id, k) => +t.quality?.[id]?.[k - 1] || 1;
const scaled = (fx, q) => { const o = {}; for (const k in fx) o[k] = fx[k] * q; return o; };
const needTxt = (miss) => miss.map(([r, l]) => `${UP[r]?.short || r} L${l}`).join(', ');
const gapOf = (c, team) => { const best = Math.max(...Object.values(c.teams).map((t) => techEffects(t).perf)); return (best - techEffects(team).perf) * 90; };
const gapTxt = (g) => (g < 0.005 ? 'Fastest' : `+${g.toFixed(2)} s`);

// (what a branch has given the car against what it could: one meter per effect it carries - nothing yet reads 'none')
const nz = (f) => (v) => (Math.abs(v) < 1e-9 ? 'none' : f(v));
const METER = {
  perf: ['Lap time', nz((v) => `${(v * 90).toFixed(2)} s`)], drs: ['DRS drag cut', nz((v) => `${(v * 100).toFixed(1)}%`)], ers: ['ERS power', nz((v) => `+${(v * 100).toFixed(1)}%`)],
  erc: ['Battery energy', nz((v) => `+${(v * 100).toFixed(0)}%`)], brake: ['Braking force', nz((v) => `+${(v * 100).toFixed(1)}%`)], wear: ['Tyre wear', nz((v) => `−${Math.abs(v * 100).toFixed(1)}%`)],
  rel: ['Failure risk', nz((v) => `−${(v * 150).toFixed(0)}%`)], pit: ['Stop time', nz((v) => `−${(v * 100).toFixed(1)}%`)],
};
function meters(team, br) {
  const have = {}, all = {};
  for (const u of UPGRADES) if (u.branch === br) u.levels.forEach((L, i) => { const q = i < levelOf(team, u.id) ? qOf(team, u.id, i + 1) : 0; for (const k in L.fx) if (METER[k]) { all[k] = (all[k] || 0) + L.fx[k]; have[k] = (have[k] || 0) + L.fx[k] * q; } });
  const ks = Object.keys(METER).filter((k) => all[k]); if (!ks.length) return '';
  return `<div class="tt-mt">${ks.map((k) => { const [n, f] = METER[k], p = Math.max(0, Math.min(100, (have[k] / all[k]) * 100)); return `<div><span>${n}</span><b>${f(have[k] || 0)} <small>of ${f(all[k])}</small></b><span class="tt-bar"><i style="width:${p.toFixed(1)}%"></i></span></div>`; }).join('')}</div>`;
}

// ---- the tab -----------------------------------------------------------------------------------------------------------
/**
 * The TECH TREE tab -> html. S: { branch, up (the upgrade in detail), tmsg / tok (what the last click did) }; H: the
 * hub's helpers ({ esc, money, ink, ... }: only ink is used, a local copy stands in without it)
 */
export function techHTML(c, S = {}, H = {}) {
  const team = teamOf(c); if (!team) return '<div class="tt"><h2>Tech tree</h2><p class="lead">There is no team to develop.</p></div>';
  ready(c);
  const ink = H?.ink || ink0, br = UP[S.up]?.branch || (BRANCHES[S.branch] ? S.branch : 'power'), B = BRANCHES[br], dev = Array.isArray(team.dev) ? team.dev : [];
  const state = Object.fromEntries(UPGRADES.map((u) => [u.id, upgradeState(c, team.name, u.id)])), ups = UPGRADES.filter((u) => u.branch === br);
  const sel = UP[S.up] && UP[S.up].branch === br ? UP[S.up] : ups.find((u) => state[u.id] === 'open') || ups.find((u) => state[u.id] !== 'max') || ups[0];
  const fx = techEffects(team), slots = fx.slots, all = Object.values(c.teams), others = all.filter((t) => t !== team), A = atrInfo(c, team.name), P = partsCount(team);
  // (the best value on the tree: the most lap time per $M among the next levels you could start - the top three tagged)
  const val = new Set(UPGRADES.filter((u) => u.branch !== 'facilities' && ['open', 'busy', 'poor'].includes(state[u.id])).map((u) => { const lv = nextLevel(team, u.id); return [u.id, levelWorth(team, u.id, lv, fx.relMul <= 0.4501) / levelCost(c, team.name, u.id, lv)]; })
    .filter((x) => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]));
  const soon = dev.length ? Math.min(...dev.map((x) => x.left)) : 0;

  // the header: what you have to spend, where the car is, how busy the factory is
  const head = `<div class="tt-head"><div class="tt-hl"><h2>Tech tree</h2><p class="lead">Thirty-eight upgrades in nine branches, each built a level at a time: every level costs more than the last and gives a little less, and many need work in another branch first. A part is <b>correlated</b> when it reaches the car - it can land anywhere from 70% to 110% of what the tunnel promised. Every team is developing.</p></div>
    <div class="tt-kpis"><div class="tt-kpi"><small>Budget</small><b>${money(team.budget)}</b></div><div class="tt-kpi"><small>Pace</small><b>${gapTxt(gapOf(c, team))}</b></div><div class="tt-kpi"><small>Parts</small><b>${P.have}<i> / ${P.total}</i></b></div></div></div>`;
  const msg = S.tmsg ? `<div class="tt-msg ${S.tok ? 'ok' : 'no'}"><b>${S.tok ? '✓' : '!'}</b><span>${esc(S.tmsg)}</span></div>` : '';

  // the nine branches
  const chips = `<div class="tt-brs">${Object.entries(BRANCHES).map(([k, b]) => {
    const p = branchProgress(team, k), r = p.total ? Math.round((p.have / p.total) * 100) : 0, n = dev.filter((x) => UP[x.id]?.branch === k).length;
    return `<button class="tt-br${k === br ? ' on' : ''}${k === 'facilities' ? ' fac' : ''}" data-tbr="${k}" style="--c:${b.color}"><span class="tt-mono">${b.mono}</span><span class="tt-brn"><b>${esc(b.name)}</b><small>${p.have}/${p.total} levels${n ? ` · <em>${n} building</em>` : ''}</small></span><span class="tt-ring" style="--p:${r}"><i>${r}%</i></span></button>`;
  }).join('')}</div>`;

  // the factory's queue: every slot, filled or free, and the ones more tooling would add
  const filled = dev.map((x) => {
    const u = UP[x.id]; if (!u) return '';
    const n = x.n || levelRounds(c, team.name, x.id, x.level), done = Math.max(0, Math.min(1, 1 - x.left / Math.max(1, n)));
    return `<button class="tt-slot" data-tup="${u.id}" style="--c:${BRANCHES[u.branch].color}" title="${esc(upgradeName(u.id, x.level))}"><b>${esc(u.short)}</b><small>${x.re ? `Re-tune · level ${x.level}` : `Level ${x.level} · ${esc(u.levels[x.level - 1].n)}`}</small><span class="tt-prog"><i style="width:${Math.max(8, done * 100).toFixed(0)}%"></i></span><em>${races(x.left)} to go · ${when(c, x.left)}${x.early ? ' · early' : ''}</em></button>`;
  }).join('');
  const locked = UPGRADES.filter((u) => u.branch === 'facilities').flatMap((u) => u.levels.map((L, i) => ({ u, lv: i + 1, s: L.fx.slots || 0 }))).filter((x) => x.s && levelOf(team, x.u.id) < x.lv);
  const queue = `<div class="tt-q"><div class="tt-qh"><span class="lbl">Development</span><span class="muted">${dev.length} of ${slots} slot${slots === 1 ? '' : 's'} in use${dev.length ? ` · the next part reaches the car ${when(c, soon)}` : ' · the factory is waiting for work'}</span></div>
    <div class="tt-slots">${filled}${'<div class="tt-slot free"><b>Free slot</b><small>Pick an upgrade below and develop it</small></div>'.repeat(Math.max(0, slots - dev.length))}${locked.map((x) => `<div class="tt-slot lock"><b>+1 slot</b><small>${esc(x.u.name)} · level ${x.lv}</small></div>`).join('')}</div></div>`;

  // the branch: what it has given the car, and its upgrades as cards
  const card = (u) => {
    const st = state[u.id], lv = levelOf(team, u.id), d = dev.find((x) => x.id === u.id), nx = nextLevel(team, u.id), fac = u.branch === 'facilities';
    const pips = u.levels.map((_, i) => (i < lv ? `<i class="on ${fac ? 'qg' : qCls(qOf(team, u.id, i + 1))}"></i>` : d && !d.re && d.level === i + 1 ? '<i class="dv"></i>' : i === lv ? '<i class="nx"></i>' : '<i></i>')).join('');
    const cost = nx ? levelCost(c, team.name, u.id, nx) : 0;
    const line = st === 'max' ? 'Fully developed' : st === 'dev' ? `${d.re ? 'Re-tuning' : 'Building'} L${d.level} · ${races(d.left)} to go` : st === 'locked' ? `Needs ${needTxt(missingReq(team, u.id, nx))}`
      : `L${nx} · ${money(cost)} · ${races(levelRounds(c, team.name, u.id, nx))}${st === 'busy' ? ' · slots full' : st === 'poor' ? ' · over budget' : ''}`;
    const eff = st === 'dev' ? fxText(u.levels[d.level - 1].fx) : nx ? fxText(u.levels[nx - 1].fx) : 'Every level is on the car';
    const rt = !fac && Array.from({ length: lv }, (_, i) => qOf(team, u.id, i + 1)).some((q) => q < RETUNE_BELOW);
    const tags = `${val.has(u.id) ? '<i class="v">Best value</i>' : ''}${rt ? '<i class="r">Re-tune</i>' : ''}`;
    return `<button class="tt-up s-${st}${u === sel ? ' sel' : ''}" data-tup="${u.id}" title="${esc(`${u.name}: ${line}. ${eff}`)}"><span class="h"><b>${esc(u.name)}</b><em>${lv}/${u.levels.length}</em></span><span class="tt-pp">${pips}</span><span class="ln">${esc(line)}</span><span class="fx">${esc(eff)}</span>${tags ? `<span class="tg">${tags}</span>` : ''}</button>`;
  };
  const p = branchProgress(team, br);
  const branch = `<div class="tt-sec"><div class="tt-bh"><span class="tt-mono big">${B.mono}</span><div><h3>${esc(B.name)} · ${p.have} of ${p.total} levels</h3><p>${esc(B.blurb)}</p></div>${br === 'facilities' ? '' : meters(team, br)}</div>
    <div class="tt-ups">${ups.map(card).join('')}</div></div>`;

  return `<div class="tt" style="--c:${B.color}">${head}${msg}${chips}${queue}${branch}${sel ? detail(c, team, sel, state[sel.id], A, others, soon, S) : ''}${factory(c, team, br, fx, A, all, ink)}</div>`;
}

// ---- the chosen upgrade: a card that never scrolls ---------------------------------------------------------------------
// (its pages - the levels, what it is and what helps it, where the grid stands - are tabs while the card is short and all
// three at once when it is tall enough; the page and the level shown live in S.tdp and S.tlv, so they survive a redraw)
const DPAGES = ['lv', 'ab', 'gr'], DPAGE_NAMES = ['Levels', 'About', 'The grid'];
/** the level the card shows: the one picked on its stepper (S.tlv, 'id|level'), else the one in the factory, the next, the first that correlated poorly, the last */
function shownLevel(team, u, S) {
  const [id, l] = String(S?.tlv || '').split('|'), mx = u.levels.length, k = Math.floor(+l);
  if (id === u.id && k >= 1 && k <= mx) return k;
  const d = (Array.isArray(team.dev) ? team.dev : []).find((x) => x.id === u.id), nx = nextLevel(team, u.id);
  if (d) return Math.max(1, Math.min(mx, Math.floor(+d.level) || 1));
  if (nx) return nx;
  for (let i = 1; u.branch !== 'facilities' && i <= mx; i++) if (qOf(team, u.id, i) < RETUNE_BELOW) return i;
  return mx;
}
/** the chosen upgrade on its card: its name and state; its pages (the levels - a stepper and the level picked in full -, what it is and what helps it, the grid); the button, always in view */
function detail(c, team, u, st, A, others, soon, S) {
  const B = BRANCHES[u.branch], lv = levelOf(team, u.id), mx = u.levels.length, dev = Array.isArray(team.dev) ? team.dev : [], d = dev.find((x) => x.id === u.id), nx = nextLevel(team, u.id), fac = u.branch === 'facilities';
  const ff = facilityFx(team, u.branch), at = u.atr ? A.f : 1;
  const stTxt = { max: 'Complete', dev: d?.re ? 'Re-tuning' : 'Building', locked: 'Locked', busy: 'Slots full', poor: 'Over budget', open: 'Ready' }[st] || st;
  // (what the factory does for it, and for aero the wind-tunnel time it is allowed)
  const sup = fac ? [`<span>Helps ${esc(u.helps ? u.helps.map((b) => BRANCHES[b].name).join(', ') : 'every part of the car')}</span>`, '<span>Facility levels always land at 100%</span>']
    : [`<span>${ff.from.length ? `Factory: ${esc(ff.from.map(([f, l]) => `${UP[f].short} L${l}`).join(' · '))}` : 'No facility helps this branch yet'}</span>`,
      `<span>${ff.cost < 0.995 ? `${pct(1 - ff.cost)} cheaper to develop` : 'List price'}</span>`, `<span>${pct(ff.speed * at)} chance a level arrives a race early</span>`, `<span>Expected correlation ${pct(expectedQ(team, u.branch))}</span>`];
  if (u.atr) sup.push(`<span class="atr">Wind tunnel time ${pct(A.f)} (P${A.pos}): aero costs ${A.f <= 1 ? '+' : '−'}${pct(Math.abs(1 / A.f - 1))}</span>`);
  // (the stepper: a step a level - on the car and how it correlated, in the factory, next, later, locked - the one shown picked out)
  const k = shownLevel(team, u, S), p = DPAGES.includes(S?.tdp) ? S.tdp : 'lv';
  const steps = u.levels.map((L, i) => {
    const j = i + 1, own = j <= lv, inF = !!d && d.level === j, lock = !own && missingReq(team, u.id, j).length > 0, q = own ? qOf(team, u.id, j) : 1;
    const cls = own ? `own ${fac ? 'qg' : qCls(q)}${inF ? ' re' : ''}` : inF ? 'dev' : `${j === nx ? 'next' : 'later'}${lock ? ' lock' : ''}`;
    const v = inF ? races(d.left) : own ? (fac ? 'Built' : pct(q)) : money(levelCost(c, team.name, u.id, j));
    return `<button class="tt-sp ${cls}" data-tlv="${u.id}|${j}" title="${esc(`Level ${j}: ${L.n}`)}"><i></i><b>L${j}</b><small>${esc(v)}</small></button>`;
  }).join('');
  // (the grid: how many rival teams sit at each level of it, your own level marked)
  const hist = Array.from({ length: mx + 1 }, (_, j) => others.filter((t) => levelOf(t, u.id) === j)), top = Math.max(1, ...hist.map((h) => h.length));
  const far = hist.reduce((a, h, j) => (h.length ? j : a), 0), lead = hist[far];
  const grid = `<p>${far > lv ? `Furthest along: ${esc(lead.slice(0, 3).map((t) => t.name).join(', '))}${lead.length > 3 ? ` and ${lead.length - 3} more` : ''} at level ${far} - you are ${far - lv} behind.` : far === lv && lv ? `Nobody is further along than you; ${lead.length} level with you.` : lv ? `You lead the grid here: no rival is past level ${far}.` : 'No team has started on it.'}</p>
    <div class="tt-hist">${hist.map((ts, j) => `<div class="${j === lv ? 'me' : ''}" title="${esc(ts.map((t) => t.name).join(', ') || 'No rival team')}"><b>${ts.length}</b><i style="height:${Math.round((ts.length / top) * 100)}%"></i><small>${j === lv ? 'YOU · ' : ''}L${j}</small></div>`).join('')}</div>`;
  // (the button, or why there is none - under it, always in view)
  const cost = nx ? levelCost(c, team.name, u.id, nx) : 0, rn = nx ? levelRounds(c, team.name, u.id, nx) : 0;
  const why = st === 'open' ? `${u.levels[nx - 1].n}: on the car ${when(c, rn)}${fac ? '' : `, ${pct(ff.speed * at)} chance of a race sooner`}.`
    : st === 'max' ? 'Every level is on the car.' : st === 'dev' ? `${d.re ? `Re-tuning level ${d.level}` : `Level ${d.level} is being built`}: on the car ${when(c, d.left)}.`
    : st === 'locked' ? `Level ${nx} needs ${needTxt(missingReq(team, u.id, nx))} first.` : st === 'busy' ? `Every development slot is in use - the first frees up ${after(c, soon)}.`
    : st === 'poor' ? `Not enough money: ${money(cost)} needed, ${money(team.budget)} in the budget.` : '';
  const act = `<div class="tt-act">${st === 'open' ? `<button class="go" data-tdev="${u.id}">DEVELOP LEVEL ${nx} · ${money(cost)} · ${races(rn).toUpperCase()} →</button>` : ''}<span class="tt-why" title="${esc(why)}">${esc(why)}</span></div>`;
  const tabs = `<div class="k-seg tt-dt" style="--n:${DPAGES.length}">${DPAGES.map((v, i) => `<button data-tdp="${v}">${DPAGE_NAMES[i]}</button>`).join('')}</div>`;
  return `<div class="tt-det" style="--c:${B.color}"><div class="tt-dh"><span class="tt-mono">${B.mono}</span><div><h3 title="${esc(u.name)}">${esc(u.name)}</h3><div class="tt-dm"><span>${esc(B.name)} · level ${lv} of ${mx}</span><span class="tt-st ${st}">${esc(stTxt)}</span></div></div></div>
    <div class="tt-dw">${tabs}<div class="tt-db" data-region="tdp" data-p="${p}"><section class="tt-pg pg-lv"><div class="tt-steps" style="--n:${mx}">${steps}</div><div class="tt-lpw" data-region="tlp" data-k="${k}">${levelPanel(c, team, u, k, others)}</div></section>
    <section class="tt-pg pg-ab"><span class="lbl tt-ph">${DPAGE_NAMES[1]}</span><p class="tt-dsc">${esc(u.desc)}</p><div class="tt-sup">${sup.join('')}</div></section><section class="tt-pg pg-gr"><span class="lbl tt-ph">${DPAGE_NAMES[2]}</span><div class="tt-grd">${grid}</div></section></div></div>${act}</div>`;
}

/** one level in full: what it does (on the car: what it gave against its promise), its price and build time or how long it has to go, how many rivals have it, what it needs first, and a re-tune for one that came out poorly */
function levelPanel(c, team, u, k, others) {
  const L = u.levels[k - 1], lv = levelOf(team, u.id), d = (Array.isArray(team.dev) ? team.dev : []).find((x) => x.id === u.id), nx = nextLevel(team, u.id), fac = u.branch === 'facilities';
  const own = k <= lv, inDev = !!d && !d.re && d.level === k, reDev = !!d && !!d.re && d.level === k, miss = own ? [] : missingReq(team, u.id, k), q = own ? qOf(team, u.id, k) : 1;
  const cls = own ? 'own' : inDev ? 'dev' : `${k === nx ? 'next' : 'later'}${miss.length ? ' lock' : ''}`;
  const tag = own ? (reDev ? 'Re-tuning' : 'On the car') : inDev ? 'Building' : miss.length ? 'Locked' : k === nx ? 'Next' : 'Later';
  const eff = own && !fac && Math.abs(q - 1) > 0.004 ? `${esc(fxText(scaled(L.fx, q)))} <small>of ${esc(fxText(L.fx))} promised</small>` : esc(fxText(L.fx));
  const fact = (n, v, t) => `<div title="${esc(t)}"><small>${n}</small><b>${v}</b></div>`;
  const riv = others.filter((t) => levelOf(t, u.id) >= k).length;
  const facts = (own ? fact('Correlated', fac ? '100%' : `<span class="tt-cq ${qCls(q)}">${pct(q)}</span>`, fac ? 'Facility levels always land at 100%' : 'What it gave on the car against what was promised')
    : inDev ? fact('To go', races(d.left), `On the car ${when(c, d.left)}`)
    : fact('Cost', money(levelCost(c, team.name, u.id, k)), 'What it costs to develop now') + fact('Build', races(L.rounds), 'How long the factory needs for it'))
    + fact('Rivals', `${riv}<i> / ${others.length}</i>`, riv ? `${riv} rival team${riv > 1 ? 's' : ''} at this level or beyond` : 'No rival team has it yet');
  const req = L.req.length ? `<div class="tt-rq"><small>Needs</small>${L.req.map(([r, l]) => { const ok = levelOf(team, r) >= l; return `<span class="${ok ? 'ok' : 'no'}" title="${esc(`${UP[r]?.name || r}, level ${l}`)}">${esc(UP[r]?.short || r)} L${l} ${ok ? '✓' : '✕'}</span>`; }).join('')}</div>` : '';
  // (in the factory: when it lands; on the car but poorly correlated: the re-tune, or why it can't be had just now)
  let more = '';
  if (inDev) more = `<p class="tt-ln">On the car ${esc(when(c, d.left))}.</p>`;
  else if (reDev) more = `<p class="tt-ln">Back at ${esc(retuneWhere(u.id))}: re-correlated ${esc(when(c, d.left))}, the better result kept.</p>`;
  else if (own && !fac && q < RETUNE_BELOW) {
    const rs = retuneState(c, team.name, u.id, k), why = { busy: 'Every development slot is in use.', poor: 'Not enough money for it.', dev: 'This upgrade is already in the factory.' }[rs] || `A race back at ${retuneWhere(u.id)}: a fresh roll, the better result kept.`;
    more = `<div class="tt-rt"><button class="tt-re" data-tre="${u.id}|${k}" title="${esc(why)}"${rs === 'ok' ? '' : ' disabled'}>RE-TUNE · ${money(retuneCost(c, team.name, u.id, k))}</button><span>${esc(why)}</span></div>`;
  }
  return `<div class="tt-lp ${cls}"><div class="tt-lh"><span class="n">L${k}</span><b>${esc(L.n)}</b><em>${tag}</em></div><p class="e">${eff}</p><div class="tt-lf">${facts}</div>${req}${more}</div>`;
}

/** the factory: the testing allowance on its sliding scale, what the facilities do on average, and - on the facilities branch - for every branch */
function factory(c, team, br, fx, A, all, ink) {
  const X = (f) => Math.max(0, Math.min(100, ((f - 0.7) / 0.45) * 100));
  const dots = all.map((t) => ({ t, a: atrInfo(c, t.name) })).sort((a, b) => (a.t === team) - (b.t === team))
    .map(({ t, a }) => `<i class="${t === team ? 'me' : ''}" style="left:${X(a.f).toFixed(1)}%;background:${esc(ink(t.color))}" title="${esc(`P${a.pos} ${t.name}: ${pct(a.f)}`)}"></i>`).join('');
  const earlyAero = facilityFx(team, 'aero').speed * A.f;
  const atr = `<div class="tt-atr"><span class="lbl">Aerodynamic testing</span><div class="tt-ab"><b>${pct(A.f)}</b><span>Wind tunnel time ${pct(A.f)} (P${A.pos} in the constructors)<br>aero costs ${A.f <= 1 ? '+' : '−'}${pct(Math.abs(1 / A.f - 1))} · ${pct(earlyAero)} chance an aero level arrives early</span></div>
    <div class="tt-scale">${dots}<small style="left:0%">70%</small><small style="left:${X(1).toFixed(1)}%">100%</small><small style="left:100%">115%</small></div>
    <p class="tt-note">Since 2022 the FIA's sliding scale gives the constructors' champions 70% of the baseline wind-tunnel and CFD allowance and the team in tenth 115%: the leaders develop their aero more slowly, and pay more for it. Here it follows the constructors' order as it stands.</p></div>`;
  const eq = CAR_BRANCHES.reduce((a, b) => a + expectedQ(team, b), 0) / CAR_BRANCHES.length;
  const tiles = `<div class="tt-fx"><span class="lbl">The factory</span><div class="tt-ft"><div><small>Slots</small><b>${fx.slots}<i> / ${MAX_SLOTS}</i></b><span>projects at once</span></div><div><small>Dev cost</small><b>${fx.devCost < 0.995 ? `−${pct(1 - fx.devCost)}` : 'List'}</b><span>average, before the ATR</span></div>
    <div><small>Early</small><b>${pct(fx.devSpeed)}</b><span>chance a race is saved</span></div><div><small>Correlation</small><b>${pct(eq)}</b><span>expected, on average</span></div></div></div>`;
  const mx = br !== 'facilities' ? '' : `<div class="tt-mxw"><span class="lbl">What the factory does for each branch</span><table class="tt-mx"><tr><th>Branch</th><th>Cost</th><th>Early</th><th>Correlation</th><th>Helped by</th></tr>${CAR_BRANCHES.map((b) => {
    const f = facilityFx(team, b), a = b === 'aero' ? A.f : 1, m = f.cost / a, ce = Math.round((m - 1) * 100);
    return `<tr style="--c:${BRANCHES[b].color}"><td>${esc(BRANCHES[b].name)}</td><td class="${ce < 0 ? 'up' : ce > 0 ? 'dn' : ''}">${ce ? `${ce > 0 ? '+' : '−'}${Math.abs(ce)}%` : 'List'}${b === 'aero' ? ' <span class="muted">ATR</span>' : ''}</td><td>${pct(f.speed * a)}</td><td>${pct(expectedQ(team, b))}</td><td>${f.from.length ? esc(f.from.map(([id, l]) => `${UP[id].short} L${l}`).join(', ')) : '<span class="muted">-</span>'}</td></tr>`;
  }).join('')}</table><p class="tt-note">Aerodynamics includes the testing allowance; the DRS flap is aero work too and pays it, its actuator does not. Expected correlation is the average a level lands at - any one can come out anywhere from 70% to 110%.</p></div>`;
  return `<div class="tt-fac">${atr}${tiles}${mx}</div>`;
}

// ---- the side card, the camera, the clicks -------------------------------------------------------------------------------
/** THE CAR side card's contents (wrap it in the hub's .ch-side): the pace gap, parts on the car, the factory's queue */
export function techSide(c, H = {}) {
  const team = teamOf(c); if (!team) return '<h3>THE CAR</h3>';
  ready(c);
  const P = partsCount(team), dev = Array.isArray(team.dev) ? team.dev : [], slots = devSlots(team);
  const list = dev.map((x) => { const u = UP[x.id]; return u ? `<div style="--c:${BRANCHES[u.branch].color}"><span>${esc(u.short)} L${x.level}${x.re ? ' · re-tune' : ''}</span><em>${races(x.left)}</em></div>` : ''; }).join('');
  return `<h3>THE CAR</h3><div class="big">${esc(team.name)}</div><div class="row2"><span>Pace</span><b>${gapTxt(gapOf(c, team)).toLowerCase()}</b></div><div class="row2"><span>Parts</span><b>${P.have}/${P.total}</b></div>
    <div class="row2"><span>In development</span><b>${dev.length ? `${dev.length} of ${slots} slots` : '-'}</b></div>${list ? `<div class="tt-side">${list}</div>` : ''}`;
}
/** the studio camera for the tab: the selected branch's part of the car (the facilities: the whole car) -> a VIEWS key */
export function techView(S = {}) { const b = UP[S?.up]?.branch || (BRANCHES[S?.branch] ? S.branch : 'power'); return b === 'facilities' ? 'overview' : b; }
/** why a level could not be started, in words */
const whyNot = (c, team, u, st, lv, cost) => (st === 'max' ? `${u.name} is fully developed.` : st === 'dev' ? `${u.name} is already in the factory.` : st === 'locked' ? `${upgradeName(u.id, lv)} needs ${needTxt(missingReq(team, u.id, lv))} first.`
  : st === 'busy' ? 'Every development slot is in use.' : st === 'poor' ? `Not enough money: ${money(cost)} needed, ${money(team.budget)} in the budget.` : `${u.name} can't be developed right now.`);
/**
 * The tab's buttons: data-tbr (a branch), data-tup (an upgrade in detail), data-tdev (develop its next level), data-tre
 * ('id|level': re-tune a level), and the detail card's own: data-tdp (its page: 'lv' | 'ab' | 'gr') and data-tlv
 * ('id|level': the level it shows) -> { tab: 'dev', S } to show (for the card's own, with the region of the card that
 * changes and the way it slides), or null when the click is not the tech tree's. Saves the career after anything bought.
 */
export function techClick(c, ds, S = {}) {
  if (!ds || !c) return null;
  const base = { ...S, tmsg: null, tok: null, msg: null, armed: null };
  if (ds.tbr != null) return { tab: 'dev', S: { ...base, branch: BRANCHES[ds.tbr] ? ds.tbr : 'power', up: null } };
  if (ds.tup != null) { const u = UP[ds.tup]; return { tab: 'dev', S: { ...base, branch: u ? u.branch : base.branch, up: u ? u.id : null } }; }
  // (the card's page and the level on its stepper: only that part of the card is drawn again, the rest of the tree stays put)
  if (ds.tdp != null) {
    const p = DPAGES.includes(ds.tdp) ? ds.tdp : 'lv', was = DPAGES.includes(S.tdp) ? S.tdp : 'lv';
    return { tab: 'dev', S: { ...base, tdp: p }, region: ['tdp'], dir: Math.sign(DPAGES.indexOf(p) - DPAGES.indexOf(was)) };
  }
  if (ds.tlv != null) {
    const [id, l] = String(ds.tlv).split('|'), u = UP[id], team = teamOf(c); if (!u || !team) return { tab: 'dev', S: base };
    ready(c);
    const k = Math.max(1, Math.min(u.levels.length, Math.floor(+l) || 1)), was = shownLevel(team, u, S);
    return { tab: 'dev', S: { ...base, branch: u.branch, up: u.id, tlv: `${u.id}|${k}` }, region: ['tlp'], dir: Math.sign(k - was) };
  }
  if (ds.tdev == null && ds.tre == null) return null;
  const team = teamOf(c); if (!team) return { tab: 'dev', S: base };
  ready(c);
  if (ds.tdev != null) {
    const u = UP[ds.tdev]; if (!u) return { tab: 'dev', S: base };
    const st = upgradeState(c, team.name, u.id), lv = nextLevel(team, u.id), cost = lv ? levelCost(c, team.name, u.id, lv) : 0, n = lv ? levelRounds(c, team.name, u.id, lv) : 0;
    const ok = develop(c, team.name, u.id); if (ok) c.save?.();
    const tmsg = ok ? `Work starts on ${upgradeName(u.id, lv)}: ${money(cost)}, on the car ${when(c, n)}.` : whyNot(c, team, u, st, lv, cost);
    return { tab: 'dev', S: { ...base, branch: u.branch, up: u.id, tlv: null, tmsg, tok: ok } };
  }
  const [id, l] = String(ds.tre).split('|'), u = UP[id], k = Math.floor(+l); if (!u) return { tab: 'dev', S: base };
  const rs = retuneState(c, team.name, id, k), cost = retuneCost(c, team.name, id, k), q = qOf(team, id, k);
  const ok = retune(c, team.name, id, k); if (ok) c.save?.();
  const tmsg = ok ? `${upgradeName(id, k)} goes back to ${retuneWhere(id)} (${money(cost)}): it came out at ${pct(q)} of its promise, and is re-correlated ${when(c, 1)}.`
    : { good: `${upgradeName(id, k)} correlated well enough (${pct(q)}).`, dev: `${u.name} is already in the factory.`, busy: 'Every development slot is in use.', poor: `Not enough money: ${money(cost)} needed.` }[rs] || `${upgradeName(id, k) || 'That level'} can't be re-tuned.`;
  return { tab: 'dev', S: { ...base, branch: u.branch, up: u.id, tlv: k >= 1 && k <= u.levels.length ? `${id}|${k}` : null, tmsg, tok: ok } };
}
