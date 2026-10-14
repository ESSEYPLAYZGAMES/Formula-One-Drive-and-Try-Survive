// The career hub's life between the races. DRIVER: your morale on a gauge, the four traits behind it and what moved
// them, what each of them does in the car this weekend, the superlicence and its penalty points (when each one comes off,
// a ban when there is one), and your record. THE WEEK: five slots and a tank of energy, the activities as cards, a media
// day with one outlet, a date (who, where, then go) and the evenings your friends said yes to - played out in 3D or
// summed up. PR & MEDIA: followers, image, heat and sponsor appeal; the story waiting for an answer, with what your PR
// manager would say; your posts, the endorsements and the manager; every outlet's opinion of you; the headlines and the
// paddock news. LIFE: the women you are seeing - in the open or kept quiet, how much each of them suspects, the
// confrontation when one of them finds out - and everyone you have met. The PADDOCK: the drivers you get on with, their
// tastes as the game knows them, a planner for an evening out (where, who, then the invitations) and the answers to
// theirs. Every page is built to sit inside the hub's panel without scrolling: long lists are paged, a choice that needs
// more opens a step or a side sheet, and every button routes through socialClick. A grave week is quiet here as it is
// everywhere: no flirting, no invitations but a coffee, nothing that makes a story. The engines do the work (Morale,
// Licence, PR, Celebs, Agenda, Social); this file draws them and passes the clicks on.
import { MOOD_STATS, MOOD_NAMES, moodOf, moraleLabel, moraleLine, formOf } from '../career/Morale.js';
import { LICENCE_MAX, OFFENCE_POINTS, activePoints, activeEntries, isBanned, banText, pointsLabel } from '../career/Licence.js';
import { OUTLETS, OUTLET_BY_ID, MANAGERS, DEAL_SPLIT, outletName, fameText, imageLabel, heatLabel, relLabel, appealLabel, personaOf, socialPosts, postSocial, resolveCrisis, crisisAdvice, acceptDeal, declineDeal, hireManager, fireManager } from '../career/PR.js';
import { CELEBS, CELEB, bondLabel, oftenText, seeing, seeingAtRace, riskOf, askOutWhy, askOut, message, invite, uninvite, makeOfficial, officialWhy, breakUp, setSecret, resolveConfront, trustCeleb, canDate, photoRisk, canStyle, styledColor } from '../career/Celebs.js';
import { STYLE_CSS, styleHTML, styleClick } from './HubStyle.js';
import { ACTIVITIES, weekOf, activitiesFor, activityState, mediaOutlets, dateTargets, dateChoices, hangoutsReady, doActivity, energyLabel, energyBand, investInTeam, donate } from '../career/Agenda.js';
import { VENUE_BY_ID, FRIEND_STAGES, friendStage, stageName, tastesOf, tasteText, contactsOf, unreadCount, inviteOut, respondInvite, venuesFor, autoHangout, hangoutResult, friendFavours } from '../career/Social.js';
// (the night after a race - career/Party.js: its hangover on the week, its offers and contacts in the alerts)
import * as Party from '../career/Party.js';

export const SOCIAL_CSS = `
#career .hs { position: relative; display: flex; flex-direction: column; gap: var(--gap, 10px); min-height: 0; height: 100%; font-size: 13px; line-height: 1.35; color: #151a22; }
#career .hs > * { flex: none; min-width: 0; }
#career .hs button, #career .hs-slot button, #career .hs-warn button, #career .hs-rx button { transition: transform 80ms cubic-bezier(.2,.8,.2,1), background-color 140ms, border-color 140ms, color 140ms, opacity 140ms; }
#career .hs button:hover:not(:disabled), #career .hs-slot button:hover:not(:disabled), #career .hs-warn button:hover:not(:disabled) { box-shadow: none; transform: none; }
#career .hs button:not(.go):hover:not(:disabled), #career .hs-slot button:not(.go):hover:not(:disabled), #career .hs-warn button:not(.go):hover:not(:disabled) { border-color: #b9c1cc; }
#career .hs-slot { display: inline-flex; align-items: center; gap: 8px; flex: none; min-width: 0; }
#career .hs-drillbar:empty { display: none; }
#career .hs button:active:not(:disabled), #career .hs-slot button:active:not(:disabled) { transform: scale(.97); }
#career .hs button.hs-hit { position: relative; }
#career .hs button.hs-hit::after { content: ''; position: absolute; inset: 0; border-radius: inherit; box-shadow: 0 10px 24px rgba(25,35,60,.13); opacity: 0; transition: opacity 140ms; pointer-events: none; }
#career .hs button.hs-hit:hover:not(:disabled) { transform: translateY(-2px); }
#career .hs button.hs-hit:hover:not(:disabled)::after { opacity: 1; }
#career .hs-card { background: #fff; border: 1px solid rgba(21,26,34,.07); border-radius: 14px; padding: 12px 14px; box-shadow: 0 2px 10px rgba(25,35,60,.05); min-width: 0; }
#career .hs-strip { display: flex; align-items: center; gap: 12px; height: 46px; padding: 0 14px; background: #fff; border: 1px solid rgba(21,26,34,.07); border-radius: 14px; box-shadow: 0 2px 10px rgba(25,35,60,.05); overflow: hidden; white-space: nowrap; }
#career .hs-eye { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 0 1 auto; }
#career .hs-eye small { font-size: 9.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #8a93a0; overflow: hidden; text-overflow: ellipsis; }
#career .hs-eye b { font-size: 14px; font-weight: 800; letter-spacing: .02em; overflow: hidden; text-overflow: ellipsis; }
#career .hs-grow { flex: 1 1 auto; min-width: 0; }
#career .hs-strip-r { display: flex; align-items: center; justify-content: flex-end; gap: 10px; flex: 1 1 auto; min-width: 0; overflow: hidden; }
#career .hs-chip { display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 10px; border-radius: 999px; background: #f2f4f7; color: #3a4350; font-size: 11.5px; font-weight: 600; white-space: nowrap; flex: none; }
#career .hs-chip b { color: #151a22; font-weight: 800; }
#career .hs-chip.a { background: #fff4e0; color: #8a5a00; } #career .hs-chip.r { background: #fff0ee; color: #c2412f; } #career .hs-chip.g { background: #e9f8ef; color: #1f7a4a; } #career .hs-chip.b { background: #eaf2ff; color: #2a5ca8; }
#career .hs-pill { display: inline-flex; align-items: center; height: 24px; padding: 0 10px; border-radius: 999px; font-size: 10.5px; font-weight: 800; letter-spacing: .12em; flex: none; }
#career .hs-pill.p { background: #e3f6ec; color: #1a7a48; } #career .hs-pill.n { background: #eef1f5; color: #3a4350; } #career .hs-pill.m { background: #fff0e6; color: #b04a0c; }
#career .hs-lbl { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #6b7480; margin: 0 0 8px; }
#career .hs-lblrow { display: flex; align-items: center; justify-content: space-between; margin: 12px 0 4px; } #career .hs-lblrow .hs-lbl { margin: 0; }
#career .hs-sub { font-size: 11.5px; color: #6b7480; line-height: 1.4; margin: 0; }
#career .hs-none { margin: 6px 0; font-size: 12.5px; color: #8a93a0; }
#career .hs-u { color: #1f8a52; } #career .hs-d { color: #c2412f; }
#career .hs-c1 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#career .hs-c2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#career .hs-meter { position: relative; display: block; height: 6px; border-radius: 3px; background: #e9ecf1; overflow: hidden; flex: 1 1 auto; min-width: 40px; }
#career .hs-meter > i { position: absolute; inset: 0; border-radius: 3px; background: var(--c, #3d7bd9); transform-origin: left center; transform: scaleX(var(--v, 0)); }
#career .hs-rap { position: relative; display: block; height: 6px; border-radius: 3px; background: #e9ecf1; flex: 1 1 auto; min-width: 50px; }
#career .hs-rap::after { content: ''; position: absolute; left: 50%; top: -3px; bottom: -3px; width: 1px; background: #b9c1cc; }
#career .hs-rap > i { position: absolute; top: 0; bottom: 0; border-radius: 3px; }
#career .hs-ava { flex: none; width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; background: var(--a); color: var(--af); font-size: 13px; font-weight: 800; letter-spacing: .02em; box-shadow: inset 0 0 0 1px rgba(21,26,34,.10), 0 0 0 2px #fff; }
#career .hs-ava.lg { width: 52px; height: 52px; font-size: 17px; } #career .hs-ava.sm { width: 28px; height: 28px; font-size: 10px; }
#career .hs-ava.q { background: #eef1f5; color: #9aa3ae; font-size: 16px; }
#career .hs-face { flex: none; width: 38px; height: 38px; border-radius: 50%; overflow: hidden; display: grid; place-items: center; box-shadow: 0 0 0 2px #fff, 0 0 0 3px var(--c, #d6dbe3); }
#career .hs-face > * { position: static !important; width: 100% !important; height: 100% !important; margin: 0 !important; border-radius: 50%; object-fit: cover; box-shadow: none !important; }
#career .hs-seg { display: inline-flex; gap: 2px; padding: 3px; border-radius: 11px; background: rgba(21,26,34,.06); flex: none; }
#career .hs-seg button { border: 0; background: transparent; padding: 7px 11px; border-radius: 8px; font-size: 11px; letter-spacing: .06em; color: #5d6675; }
#career .hs-seg button.hs-on { background: #fff; color: #151a22; box-shadow: 0 1px 3px rgba(25,35,60,.15); }
#career .hs .hs-seg button:hover:not(:disabled) { border-color: transparent; color: #151a22; }
#career .hs-subnav { align-self: flex-start; }
#career .hs-pager { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: #6b7480; font-weight: 700; flex: none; }
#career .hs-pager button { width: 28px; height: 28px; padding: 0; border-radius: 8px; font-size: 14px; display: inline-grid; place-items: center; }
#career button.hs-link { border: 0; background: none; padding: 4px 6px; font-size: 11px; letter-spacing: .04em; color: #2a5ca8; }
#career button.hs-btn { padding: 7px 10px; font-size: 10.5px; border-radius: 9px; letter-spacing: .07em; white-space: nowrap; }
#career button.hs-armed { color: #d6202e !important; border-color: #d6202e !important; background: #fff5f4 !important; }
#career .hs-msg { padding: 9px 12px; border-radius: 12px; background: #f4f7fb; border: 1px solid #dfe6f0; font-size: 12.5px; color: #3a4350; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#career .hs-empty { text-align: center; padding: 26px 22px; }
#career .hs-empty b { display: block; font-size: 15px; } #career .hs-empty p { margin: 6px auto 12px; max-width: 460px; color: #5d6675; font-size: 13px; line-height: 1.5; }
#career .hs-empty .hs-acts2 { justify-content: center; }
#career .hs-acts2 { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
#career .hs-tile2 { display: grid; align-content: center; gap: 2px; padding: 10px 12px; border-radius: 12px; background: #fff; border: 1px solid rgba(21,26,34,.07); box-shadow: 0 2px 10px rgba(25,35,60,.05); min-width: 0; height: 74px; }
#career .hs-tile2 > small { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-tile2 > b { font-size: 21px; font-weight: 800; line-height: 1.1; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-tile2 > span { font-size: 11.5px; color: #5d6675; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-tiles6 { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; } #career .hs-tiles5 { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
#career .hs-stage { display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 999px; font-size: 9.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; font-style: normal; color: color-mix(in srgb, var(--c, #8a93a0) 78%, #000); background: color-mix(in srgb, var(--c, #8a93a0) 14%, #fff); white-space: nowrap; flex: none; }
#career .hs-ico { flex: none; width: 28px; height: 28px; border-radius: 9px; display: grid; place-items: center; font-size: 14px; font-style: normal; color: color-mix(in srgb, var(--c) 82%, #000); background: color-mix(in srgb, var(--c) 15%, #fff); }
#career .hs-glyph { flex: none; width: 40px; height: 40px; border-radius: 11px; display: grid; place-items: center; color: #fff; font-size: 18px; font-style: normal; background: linear-gradient(135deg, var(--g1), var(--g2)); text-shadow: 0 1px 2px rgba(0,0,0,.3); }
#career .hs-glyph.sm { width: 30px; height: 30px; font-size: 14px; border-radius: 9px; }
#career .hs-3d { font-style: normal; font-size: 9px; font-weight: 800; letter-spacing: .12em; padding: 3px 6px; border-radius: 999px; background: #151a22; color: #fff; flex: none; }
#career .hs-tg { display: flex; gap: 4px; flex-wrap: nowrap; overflow: hidden; }
#career .hs-tg i, #career em.hs-tgi { font-style: normal; font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; padding: 3px 6px; border-radius: 999px; background: #f2f4f7; color: #5d6675; white-space: nowrap; }
#career .hs-tg i.a, #career em.hs-tgi.a { background: #fff1d6; color: #9a6400; } #career .hs-tg i.r, #career em.hs-tgi.r { background: #fff0ee; color: #c2412f; } #career .hs-tg i.g, #career em.hs-tgi.g { background: #e5f6ec; color: #1f7a4a; } #career .hs-tg i.b { background: #eaf2ff; color: #2a5ca8; }
#career .hs-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
#career .hs-fact { background: #f6f7f9; border-radius: 10px; padding: 7px 9px; min-width: 0; }
#career .hs-fact small { display: block; font-size: 9.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #8a93a0; }
#career .hs-fact b { display: block; font-size: 15px; font-weight: 800; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-fact span { display: block; font-size: 10.5px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-fact.bad { background: #fff3f1; } #career .hs-fact.bad b { color: #c2412f; }
#career .hs-wl { margin-top: 8px; font-size: 12px; color: #8a5a00; background: #fff6e5; border-radius: 9px; padding: 7px 10px; } #career .hs-wl.r { color: #b0281c; background: #fff0ee; }
#career .hs-res { padding: 10px 12px; border-radius: 12px; font-size: 13px; line-height: 1.4; } #career .hs-res.ok { background: #effaf3; border: 1px solid #bfe8cf; color: #1d5e3c; } #career .hs-res.no { background: #fff4f2; border: 1px solid #ffc9c1; color: #8f2a20; }
#career .hs-note { font-size: 12px; color: #5d6675; line-height: 1.45; padding: 0 2px; margin: 0; }
#career .hs-drillbar { display: flex; align-items: center; gap: 12px; height: 30px; }
#career .hs-crumb { display: flex; align-items: center; gap: 6px; font-size: 12.5px; white-space: nowrap; }
#career .hs-crumb i { color: #b9c1cc; font-style: normal; } #career .hs-crumb b { font-weight: 800; }
#career .hs-steps { display: inline-flex; gap: 4px; flex: none; }
#career .hs-steps button { padding: 5px 10px; border-radius: 999px; font-size: 10px; letter-spacing: .1em; border: 1px solid #e3e7ed; background: #fff; color: #6b7480; }
#career .hs-steps button.hs-on { background: #151a22; color: #fff; border-color: #151a22; } #career .hs-steps button.done { color: #1f7a4a; border-color: #bfe6cf; }
#career .hs-foot { display: flex; align-items: center; gap: 8px; margin-top: auto; }
#career .hs-formg { display: grid; grid-template-columns: 290px minmax(0, 1fr); gap: var(--gap, 10px); align-items: start; }
#career .hs-gcard { display: flex; flex-direction: column; }
#career .hs-gauge { position: relative; width: 220px; height: 124px; margin: 0 auto; }
#career .hs-gauge svg { display: block; width: 220px; height: 124px; overflow: visible; }
#career .hs-gauge path { fill: none; stroke-width: 14; stroke-linecap: round; }
#career .hs-gauge .tr { stroke: #edf0f4; }
#career .hs-gauge .vl { stroke: var(--c); stroke-dasharray: 100 100; animation: hsGauge 260ms cubic-bezier(.2,.8,.2,1) both; }
#career .hs-gauge line { stroke: #fff; stroke-width: 2.5; }
#career .hs-gauge b { position: absolute; left: 0; right: 0; bottom: 24px; text-align: center; font-size: 40px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
#career .hs-gauge small { position: absolute; left: 0; right: 0; bottom: 4px; text-align: center; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: var(--c); }
@keyframes hsGauge { from { stroke-dashoffset: 100; } }
#career .hs-line { margin: 8px 0 12px; font-size: 12.5px; line-height: 1.45; color: #3a4350; font-style: italic; }
#career .hs-line q { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
#career .hs-line small { display: block; font-style: normal; font-size: 9.5px; color: #8a93a0; margin-top: 4px; letter-spacing: .12em; text-transform: uppercase; font-weight: 700; }
#career .hs-fx { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
#career .hs-fxc { padding: 7px 9px; border-radius: 10px; background: #f6f7f9; min-width: 0; }
#career .hs-fxc small { display: block; font-size: 9.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #8a93a0; }
#career .hs-fxc b { display: block; font-size: 12px; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-fxc.hs-gu b { color: #1f8a52; } #career .hs-fxc.hs-gd b { color: #c2412f; }
#career .hs-stat { display: grid; grid-template-columns: 88px minmax(50px, 1fr) 30px 34px minmax(0, 168px); align-items: center; gap: 10px; height: 38px; border-bottom: 1px solid #f0f2f5; }
#career .hs-stat .n { font-size: 12.5px; } #career .hs-stat .v { font-size: 15px; font-weight: 800; text-align: right; font-variant-numeric: tabular-nums; }
#career .hs-stat em { font-style: normal; font-size: 11px; font-weight: 800; color: #9aa3ae; text-align: right; }
#career .hs-stat small { font-size: 11.5px; color: #5d6675; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-why { display: grid; grid-template-columns: 36px minmax(0, 1fr) auto; gap: 8px; align-items: center; height: 28px; font-size: 12.5px; border-bottom: 1px dashed #edf0f4; }
#career .hs-why i { font-style: normal; font-weight: 800; font-size: 11.5px; text-align: center; border-radius: 6px; padding: 3px 0; }
#career .hs-why i.hs-u { background: #e9f8ef; } #career .hs-why i.hs-d { background: #fff0ee; }
#career .hs-why span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } #career .hs-why small { color: #8a93a0; font-size: 11px; white-space: nowrap; }
#career .hs-licg { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: var(--gap, 10px); align-items: start; }
#career .hs-col { display: flex; flex-direction: column; gap: var(--gap, 10px); min-width: 0; }
#career .hs-lic { display: grid; grid-template-columns: repeat(12, 1fr); gap: 4px; height: 30px; }
#career .hs-lic i { border-radius: 6px; background: #eef1f5; box-shadow: inset 0 0 0 1px rgba(21,26,34,.05); }
#career .hs-lic i.g { background: #3d7bd9; } #career .hs-lic i.a { background: #e39a1b; } #career .hs-lic i.r { background: #e5484d; }
#career .hs-lics { display: grid; grid-template-columns: repeat(12, 1fr); gap: 4px; margin-top: 4px; font-size: 9.5px; font-weight: 700; color: #9aa3ae; }
#career .hs-lics span:nth-child(6), #career .hs-lics span:nth-child(9), #career .hs-lics span:nth-child(12) { color: #5d6675; text-align: right; }
#career .hs-licn { display: flex; align-items: baseline; gap: 10px; margin-top: 8px; } #career .hs-licn b { font-size: 24px; font-weight: 800; flex: none; } #career .hs-licn span { color: #4a5361; font-size: 12.5px; }
#career .hs-ban { background: linear-gradient(135deg, #fff6e5, #fff 70%); border-color: #f2d49a; display: flex; gap: 12px; align-items: center; }
#career .hs-ban > i { flex: none; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: #e39a1b; color: #fff; font-style: normal; font-weight: 900; }
#career .hs-ban b { display: block; font-size: 14px; } #career .hs-ban span { font-size: 12px; color: #6b5a3a; }
#career .hs-tr { display: grid; grid-template-columns: 58px minmax(0, 1fr) 46px 132px; gap: 10px; align-items: center; height: 36px; border-bottom: 1px solid #f0f2f5; font-size: 12.5px; }
#career .hs-tr.hd { height: 24px; font-size: 9.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #8a93a0; }
#career .hs-tr b { font-weight: 800; } #career .hs-tr small { font-size: 11px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-otab > div { display: flex; justify-content: space-between; gap: 8px; font-size: 11.5px; padding: 4px 0; border-bottom: 1px dashed #edf0f4; color: #3a4350; }
#career .hs-otab b { flex: none; font-weight: 800; color: #151a22; }
#career .hs-chartbox { width: 100%; margin: 0 auto; } #career .hs-chartbox .chart { margin-top: 0; }
#career .hs-mini svg { display: block; width: 100%; height: auto; }
#career .hs-lg { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-top: 6px; font-size: 11.5px; color: #4a5361; }
#career .hs-lg span { display: inline-flex; align-items: center; gap: 6px; } #career .hs-lg i { width: 10px; height: 10px; border-radius: 3px; }
#career .hs-nochart { display: grid; place-items: center; min-height: 140px; color: #8a93a0; font-size: 12.5px; text-align: center; }
#career .hs-pips { display: inline-flex; gap: 4px; flex: none; }
#career .hs-pips i { width: 12px; height: 12px; border-radius: 4px; background: var(--tc, #e10600); }
#career .hs-pips i.used { background: #fff; box-shadow: inset 0 0 0 1.5px #c9cfd8; }
#career .hs-en { display: flex; align-items: center; gap: 8px; flex: 0 1 210px; min-width: 110px; }
#career .hs-en small { font-size: 9.5px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #8a93a0; } #career .hs-en b { font-size: 13px; font-weight: 800; }
#career .hs-slots { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; height: 58px; }
#career .hs-slot2 { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 12px; background: #fff; border: 1px solid rgba(21,26,34,.07); min-width: 0; }
#career .hs-slot2 .hs-slt { min-width: 0; } #career .hs-slot2 b { display: block; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-slot2 small { display: block; font-size: 10.5px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-slot2.free { border: 1.5px dashed #cdd3dc; background: rgba(255,255,255,.55); justify-content: center; color: #9aa3ae; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
#career .hs-acts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: 112px; gap: 8px; } #career .hs-acts.hurt { grid-auto-rows: 132px; }
#career button.hs-act { display: flex; flex-direction: column; align-items: stretch; gap: 4px; text-align: left; padding: 10px 11px; border-radius: 13px; letter-spacing: 0; font-weight: 600; background: #fff; border: 1px solid rgba(21,26,34,.08); min-width: 0; overflow: hidden; }
#career .hs-act-h { display: flex; align-items: center; gap: 8px; min-width: 0; } #career .hs-act-h b { flex: 1; min-width: 0; font-size: 13px; color: #151a22; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-act-h em { font-style: normal; font-size: 10px; font-weight: 800; color: #6b7480; background: #f2f4f7; border-radius: 999px; padding: 2px 6px; }
#career .hs-act-e { font-size: 9.5px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: color-mix(in srgb, var(--c) 70%, #000); }
#career .hs-act-d { font-size: 11px; line-height: 1.35; color: #4a5361; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#career .hs-act-s { margin-top: auto; font-size: 10.5px; font-weight: 700; color: #2a5ca8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-act-s.why { color: #c2412f; } #career .hs-act-s.half { color: #9a6400; }
#career button.hs-act.no { background: #fafbfc; }
#career .hs-dhead { display: flex; align-items: center; gap: 12px; padding: 10px 14px; } #career .hs-dhead > div { flex: 1; min-width: 0; }
#career .hs-dhead b { font-size: 14px; } #career .hs-dhead small { display: block; color: #5d6675; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-outs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 98px; gap: 8px; }
#career button.hs-out, #career .hs-po { position: relative; display: flex; flex-direction: column; gap: 5px; text-align: left; padding: 10px 12px 10px 15px; border-radius: 12px; background: #fff; border: 1px solid rgba(21,26,34,.08); letter-spacing: 0; font-weight: 600; overflow: hidden; min-width: 0; }
#career button.hs-out::before, #career .hs-po::before, #career .hs-deal::before, #career .hs-fc::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--c); }
#career .hs-out-h { display: flex; align-items: baseline; gap: 8px; } #career .hs-out-h b { font-size: 13px; color: #151a22; } #career .hs-out-h small { font-size: 10.5px; color: #8a93a0; text-transform: uppercase; letter-spacing: .1em; }
#career .hs-out-r { display: flex; align-items: center; gap: 8px; } #career .hs-out-r em { font-style: normal; font-size: 11px; font-weight: 700; color: #3a4350; white-space: nowrap; flex: none; }
#career .hs-out-p { font-size: 11px; color: #6b7480; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-out-s { margin-top: auto; font-size: 10.5px; font-weight: 700; color: #2a5ca8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-dws { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 92px; gap: 8px; }
#career button.hs-dw { display: flex; align-items: center; gap: 12px; text-align: left; padding: 10px 12px; border-radius: 14px; background: #fff; letter-spacing: 0; font-weight: 600; min-width: 0; }
#career button.hs-dw > span:last-child { min-width: 0; display: flex; flex-direction: column; gap: 3px; align-items: flex-start; } #career button.hs-dw b { font-size: 13.5px; color: #151a22; } #career button.hs-dw small { font-size: 11px; color: #6b7480; }
#career .hs-opts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 120px; gap: 8px; }
#career button.hs-opt, #career button.hs-ven { display: flex; flex-direction: column; gap: 6px; text-align: left; padding: 10px 12px; border-radius: 14px; background: #fff; letter-spacing: 0; font-weight: 600; overflow: hidden; min-width: 0; }
#career .hs-opt-h, #career .hs-ven-h { display: flex; align-items: center; gap: 10px; min-width: 0; } #career .hs-opt-h b, #career .hs-ven-h b { flex: 1; min-width: 0; font-size: 13px; color: #151a22; }
#career .hs-opt-d { font-size: 11px; color: #4a5361; font-weight: 500; line-height: 1.35; }
#career .hs-opt-m { margin-top: auto; font-size: 10.5px; font-weight: 700; color: #3a4350; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs .hs-sel { border-color: #151a22; box-shadow: 0 0 0 2px rgba(21,26,34,.14); }
#career .hs-confirm { display: grid; grid-template-columns: minmax(0, 1fr) 250px; gap: var(--gap, 10px); align-items: start; }
#career .hs-cf-h { display: flex; align-items: center; gap: 12px; } #career .hs-cf-h small { display: block; font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #8a93a0; } #career .hs-cf-h b { display: block; font-size: 16px; font-weight: 800; }
#career .hs-cf p { margin: 10px 0; font-size: 12.5px; color: #3a4350; }
#career .hs-cfa { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; align-items: center; }
#career .hs-her p { margin: 6px 0 0; font-size: 12px; color: #4a5361; line-height: 1.45; } #career .hs-her b { font-size: 13px; }
#career .hs-her .hs-c4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
#career .hs-hgs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
#career .hs-hg { display: flex; flex-direction: column; gap: 8px; }
#career .hs-hg-h { display: flex; align-items: center; gap: 10px; } #career .hs-hg-h > div { min-width: 0; flex: 1; } #career .hs-hg-h b { display: block; font-size: 13.5px; } #career .hs-hg-h small { display: block; font-size: 11.5px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-pulse { display: grid; grid-template-columns: minmax(0, 1fr) 250px; gap: var(--gap, 10px); align-items: start; }
#career .hs-crisis { border-color: #ffc9c1; background: linear-gradient(160deg, #fff6f4, #fff 55%); }
#career .hs-crisis.pos { border-color: #bfe8cf; background: linear-gradient(160deg, #f0fbf4, #fff 55%); }
#career .hs-crisis-h { display: flex; align-items: center; gap: 12px; } #career .hs-crisis-h > div { flex: 1; min-width: 0; }
#career .hs-crisis-i { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: #e5484d; color: #fff; font-weight: 900; flex: none; font-style: normal; }
#career .hs-crisis.pos .hs-crisis-i { background: #1fae64; }
#career .hs-crisis-h small { display: block; font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #8a93a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-crisis-h b { display: block; font-size: 16px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-crisis p { margin: 9px 0 0; font-size: 13px; color: #3a4350; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
#career .hs-crisis p.hs-also { font-size: 11.5px; color: #8a5a00; -webkit-line-clamp: 1; }
#career .hs-adv { margin-top: 10px; padding: 8px 11px; border-radius: 10px; background: #f3f6fb; font-size: 12px; color: #2f3a48; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#career .hs-copts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; margin-top: 10px; }
#career button.hs-copt { display: flex; flex-direction: column; gap: 4px; text-align: left; padding: 9px 11px; border-radius: 11px; letter-spacing: 0; background: #fff; min-width: 0; }
#career button.hs-copt b { font-size: 12.5px; color: #151a22; } #career button.hs-copt small { font-size: 11px; color: #5d6675; font-weight: 500; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#career button.hs-copt.rec { border-color: #3d7bd9; box-shadow: 0 0 0 2px rgba(61,123,217,.18); } #career button.hs-copt.rec b::after { content: ' · advised'; color: #2a5ca8; font-size: 10px; letter-spacing: .06em; }
#career .hs-pr { display: grid; grid-template-columns: 84px minmax(0, 1fr) 34px; gap: 8px; align-items: center; font-size: 11.5px; height: 22px; } #career .hs-pr b { text-align: right; font-size: 11px; }
#career .hs-persona h4 { margin: 0 0 3px; font-size: 14px; font-weight: 800; } #career .hs-persona p { margin: 0 0 8px; font-size: 11.5px; color: #4a5361; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
#career .hs-mg { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #e3e7ed; display: flex; align-items: center; gap: 8px; } #career .hs-mg > div { flex: 1; min-width: 0; } #career .hs-mg b { display: block; font-size: 12.5px; } #career .hs-mg small { display: block; font-size: 11px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-postg { display: grid; grid-template-columns: minmax(0, 1fr) 250px; gap: var(--gap, 10px); align-items: start; }
#career .hs-posts { display: grid; grid-template-columns: 1fr 1fr; grid-auto-rows: 82px; gap: 7px; }
#career button.hs-post { display: flex; flex-direction: column; gap: 4px; text-align: left; padding: 9px 11px; border-radius: 12px; background: #fff; letter-spacing: 0; font-weight: 600; overflow: hidden; min-width: 0; }
#career button.hs-post b { font-size: 12.5px; color: #151a22; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career button.hs-post small { font-size: 11px; color: #5d6675; font-weight: 500; line-height: 1.35; }
#career button.hs-post .hs-tg { margin-top: auto; }
#career .hs-rp { padding: 7px 0; border-bottom: 1px solid #f0f2f5; } #career .hs-rp p { margin: 0; font-size: 12px; color: #2f3a48; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; } #career .hs-rp small { color: #8a93a0; font-size: 10.5px; }
#career .hs-deals { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
#career .hs-deal { position: relative; height: 92px; display: flex; flex-direction: column; gap: 2px; overflow: hidden; padding: 9px 11px 9px 14px; }
#career .hs-deal b { font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .hs-deal small { font-size: 10.5px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .hs-deal em { font-style: normal; font-size: 15px; font-weight: 800; }
#career .hs-deal.free { border: 1.5px dashed #cdd3dc; background: rgba(255,255,255,.55); box-shadow: none; justify-content: center; align-items: center; color: #9aa3ae; } #career .hs-deal.free::before { display: none; }
#career .hs-offers { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
#career .hs-offer { display: flex; flex-direction: column; gap: 5px; min-height: 176px; overflow: hidden; } #career .hs-offer > * { flex: none; }
#career .hs-offer-h { display: flex; align-items: baseline; gap: 8px; } #career .hs-offer-h b { flex: 1; min-width: 0; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .hs-offer-h small { font-size: 10px; color: #8a93a0; letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; }
#career .hs-offer > em { font-style: normal; font-size: 17px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .hs-offer > em small { font-size: 11px; color: #6b7480; font-weight: 600; }
#career .hs-offer p { margin: 0; font-size: 11.5px; color: #4a5361; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#career .hs-offer ul { margin: 0; padding: 0; list-style: none; font-size: 10.5px; color: #5d6675; } #career .hs-offer li { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .hs-offer li.bad { color: #c2412f; }
#career .hs-offer .hs-acts2 { margin-top: auto; }
#career .hs-mgrc { display: flex; align-items: center; gap: 12px; height: 62px; padding: 0 14px; } #career .hs-mgrc > div { flex: 1; min-width: 0; } #career .hs-mgrc b { display: block; font-size: 13.5px; } #career .hs-mgrc small { display: block; font-size: 11.5px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-mrow { display: grid; grid-template-columns: 140px 92px 74px minmax(0, 1fr) auto; gap: 10px; align-items: center; height: 46px; border-bottom: 1px solid #f0f2f5; font-size: 12px; }
#career .hs-mrow b { font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .hs-mrow small { font-size: 11px; color: #5d6675; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-press { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: minmax(132px, auto); gap: 8px; }
#career .hs-po { box-shadow: 0 2px 10px rgba(25,35,60,.05); } #career .hs-po > * { flex: none; }
#career .hs-po .hs-acts2 { margin-top: auto; justify-content: space-between; flex-wrap: nowrap; } #career .hs-po .hs-acts2 small { font-size: 10.5px; color: #8a93a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-news2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap, 10px); align-items: start; }
#career .hs-nh { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px; height: 28px; } #career .hs-nh .hs-lbl { margin: 0; }
#career .hs-hl { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 3px 9px; align-items: start; padding: 6px 0; border-bottom: 1px solid #f0f2f5; min-height: 46px; }
#career .hs-ot { font-size: 9px; font-weight: 800; letter-spacing: .06em; color: #fff; background: var(--c); padding: 3px 6px; border-radius: 5px; white-space: nowrap; margin-top: 1px; }
#career .hs-hl p { margin: 0; font-size: 12.5px; color: #2f3a48; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#career .hs-hl p.n { color: #c2412f; } #career .hs-hl p.p { color: #1d5e3c; }
#career .hs-ptns { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--gap, 10px); }
#career .hs-ptn { position: relative; display: flex; flex-direction: column; gap: 7px; overflow: hidden; padding-top: 14px; min-height: 0; }
#career .hs-ptn::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 4px; background: var(--o); }
#career .hs-ptn-h { display: flex; align-items: center; gap: 11px; } #career .hs-ptn-h > div { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 3px; align-items: flex-start; }
#career .hs-ptn-h b { font-size: 14px; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .hs-ptn-h small { font-size: 11px; color: #6b7480; }
#career .hs-sec { display: grid; grid-template-columns: 1fr 1fr; } #career .hs-sec button { padding: 6px 4px; font-size: 10px; }
#career .hs-sec-n { font-size: 11.5px; color: #1f7a4a; background: #effaf3; border-radius: 9px; padding: 6px 9px; }
#career .hs-kv { display: grid; grid-template-columns: 62px minmax(0, 1fr) 30px; gap: 8px; align-items: center; font-size: 11.5px; height: 16px; }
#career .hs-kv small { font-size: 9.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #8a93a0; } #career .hs-kv b { text-align: right; font-size: 12px; font-variant-numeric: tabular-nums; }
#career .hs-seen { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: #5d6675; min-height: 20px; flex-wrap: nowrap; overflow: hidden; } #career .hs-seen.a > span:first-child { color: #9a6400; font-weight: 700; }
#career .hs-sus { font-size: 10px; font-weight: 800; letter-spacing: .06em; padding: 3px 7px; border-radius: 999px; background: #f2f4f7; color: #5d6675; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
#career .hs-sus.a { background: #fff1d6; color: #9a6400; } #career .hs-sus.r { background: #ffe9e6; color: #c2412f; }
#career .hs-ptn-a { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; margin-top: auto; } #career .hs-ptn-a button { padding: 7px 3px; font-size: 9.5px; letter-spacing: .05em; overflow: hidden; text-overflow: ellipsis; }
#career .hs-ptn-a .w2 { grid-column: span 2; }
#career .hs-why1 { font-size: 10.5px; color: #c2412f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: -2px 0 0; }
#career .hs-next { display: grid; grid-template-columns: 108px repeat(3, minmax(0, 1fr)); gap: 8px; height: 58px; }
#career .hs-nx { background: #fff; border: 1px solid rgba(21,26,34,.07); border-radius: 12px; padding: 6px 10px; display: flex; flex-direction: column; justify-content: center; gap: 1px; min-width: 0; }
#career .hs-nx small { font-size: 9.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #8a93a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .hs-nx b { font-size: 12px; }
#career .hs-nx.clash { border-color: #ffc9c1; background: #fff6f4; } #career .hs-nx.clash b { color: #c2412f; }
#career .hs-nx > span { display: flex; align-items: center; gap: 6px; font-size: 10.5px; color: #c2412f; white-space: nowrap; overflow: hidden; } #career .hs-nx > span button { padding: 3px 7px; font-size: 9px; }
#career .hs-nx.hs-nxl { background: transparent; border: 0; padding-left: 2px; } #career .hs-nx.hs-nxl b { font-size: 13px; }
#career .hs-conf { max-width: 520px; width: 100%; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 18px 20px; animation: hsPop 220ms cubic-bezier(.2,.8,.2,1) both; }
#career .hs-conf > small { font-size: 10.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #c2412f; } #career .hs-conf p { margin: 2px 0 6px; font-size: 14px; line-height: 1.5; color: #2f3a48; }
#career .hs-confo { display: flex; flex-direction: column; gap: 6px; width: 100%; } #career .hs-confo button { height: 40px; font-size: 11px; }
@keyframes hsPop { from { opacity: 0; transform: scale(.96); } }
#career .hs-pg { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: 124px; gap: 8px; }
#career .hs-pc { display: flex; flex-direction: column; gap: 7px; padding: 10px 11px; overflow: hidden; }
#career .hs-pc-h { display: flex; align-items: center; gap: 9px; min-width: 0; } #career .hs-pc-h > div { min-width: 0; flex: 1; } #career .hs-pc-h b { display: block; font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .hs-pc-h small { display: block; font-size: 10.5px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-pc-s { display: flex; align-items: center; gap: 7px; min-width: 0; }
#career .hs-pc-a { display: flex; gap: 5px; margin-top: auto; } #career .hs-pc-a button { padding: 6px 7px; font-size: 9.5px; letter-spacing: .05em; flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; } #career .hs-pc-a button.ph { flex: 0 0 30px; padding: 6px 0; }
#career .hs-pc.q { background: #f8f9fb; box-shadow: none; border-style: dashed; } #career .hs-pc.q b { color: #8a93a0; }
#career .hs-pc.grief { background: #f7f7f8; } #career .hs-pc.grief .hs-pc-s span { font-size: 11px; color: #6b7480; }
#career .hs-plog > div { display: grid; grid-template-columns: 40px 28px minmax(0, 1fr); gap: 9px; align-items: center; height: 38px; border-bottom: 1px solid #f0f2f5; font-size: 12.5px; }
#career .hs-plog small { font-size: 11px; color: #8a93a0; font-weight: 700; } #career .hs-plog span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } #career .hs-plog span.n { color: #8f2a20; } #career .hs-plog span.p { color: #1d5e3c; }
#career .hs-phead { display: flex; align-items: center; gap: 10px; height: 40px; }
#career .hs-fg { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 136px; gap: 8px; }
#career .hs-fc { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 9px 11px 9px 14px; overflow: hidden; }
#career .hs-fc.sel { border-color: var(--c); }
#career button.hs-fcb { display: flex; align-items: center; gap: 9px; padding: 0; border: 0; background: none; text-align: left; letter-spacing: 0; min-width: 0; font-weight: 600; }
#career .hs button.hs-fcb:hover:not(:disabled) { border-color: transparent; } #career .hs button.hs-fcb:hover:not(:disabled) .hs-fcn b { text-decoration: underline; text-decoration-color: #c9cfd8; }
#career .hs-fcn { flex: 1; min-width: 0; } #career .hs-fcn b { display: block; font-size: 13px; color: #151a22; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .hs-fcn small { display: block; font-size: 11px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-fcm { display: flex; align-items: center; gap: 8px; } #career .hs-fcm em { font-style: normal; font-size: 11px; font-weight: 800; width: 30px; text-align: right; flex: none; }
#career .hs-pip5 { display: inline-flex; gap: 3px; flex: none; } #career .hs-pip5 i { width: 13px; height: 5px; border-radius: 3px; background: #e6e9ee; } #career .hs-pip5 i.hs-on { background: var(--c); }
#career .hs-tastes { display: flex; gap: 4px; overflow: hidden; } #career .hs-tastes span { font-size: 10.5px; color: #4a5361; background: #f2f4f7; border-radius: 999px; padding: 3px 8px; white-space: nowrap; }
#career .hs-fca { display: flex; align-items: center; gap: 6px; margin-top: auto; } #career .hs-fca small { flex: 1; min-width: 0; font-size: 10.5px; color: #8a93a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .hs-fca button { padding: 6px 8px; font-size: 9.5px; }
#career .hs-drawer { position: absolute; top: 0; right: 0; bottom: 0; width: min(330px, 100%); z-index: 3; display: flex; flex-direction: column; background: #fff; border: 1px solid rgba(21,26,34,.08); border-radius: 16px; box-shadow: 0 14px 40px rgba(25,35,60,.16); animation: hsSlide 220ms cubic-bezier(.2,.8,.2,1) both; overflow: hidden; }
@keyframes hsSlide { from { opacity: 0; transform: translate3d(24px, 0, 0); } }
#career .hs-drawer-h { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid #f0f2f5; } #career .hs-drawer-h > div { flex: 1; min-width: 0; } #career .hs-drawer-h b { display: block; font-size: 14px; } #career .hs-drawer-h small { display: block; font-size: 11px; color: #6b7480; }
#career .hs-drawer-b { flex: 1; min-height: 0; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
#career .hs-drawer-f { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-top: 1px solid #f0f2f5; }
#career button.hs-x { width: 30px; height: 30px; padding: 0; border-radius: 50%; flex: none; }
#career .hs-kv2 { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; } #career .hs-kv2 .hs-lbl { margin: 0; } #career .hs-kv2 b { font-size: 12.5px; }
#career .hs-fav > div, #career .hs-dlog > div { font-size: 11.5px; color: #3a4350; padding: 4px 0; border-bottom: 1px dashed #edf0f4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .hs-fav > div { color: #1d5e3c; } #career .hs-dlog small { color: #8a93a0; font-weight: 700; margin-right: 6px; }
#career .hs-vens { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 164px; gap: 8px; }
#career .hs-ven p { margin: 0; font-size: 11.5px; color: #4a5361; font-weight: 500; line-height: 1.38; }
#career .hs-ven-c { display: flex; flex-wrap: wrap; gap: 4px; margin-top: auto; } #career .hs-ven-c span { font-size: 10px; font-weight: 700; color: #4a5361; background: #f2f4f7; border-radius: 999px; padding: 3px 7px; white-space: nowrap; }
#career .hs-ven-c span.g { background: #e5f6ec; color: #1f7a4a; } #career .hs-ven-c span.r { background: #fff0ee; color: #c2412f; } #career .hs-ven-c span.b { background: #eaf2ff; color: #2a5ca8; }
#career .hs-whos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 54px; gap: 7px; }
#career button.hs-wc { display: flex; align-items: center; gap: 9px; padding: 7px 10px; text-align: left; border-radius: 12px; letter-spacing: 0; background: #fff; min-width: 0; font-weight: 600; }
#career button.hs-wc > span { min-width: 0; flex: 1; } #career button.hs-wc b { display: block; font-size: 12.5px; color: #151a22; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career button.hs-wc small { display: block; font-size: 10.5px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career button.hs-wc i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; font-weight: 800; background: #f2f4f7; color: #6b7480; }
#career button.hs-wc.hs-sel { border-color: var(--tc, #e10600); background: color-mix(in srgb, var(--tc, #e10600) 6%, #fff); box-shadow: 0 0 0 2px color-mix(in srgb, var(--tc, #e10600) 22%, transparent); } #career button.hs-wc.hs-sel i { background: var(--tc, #e10600); color: #fff; }
#career .hs-go3 { display: grid; grid-template-columns: minmax(0, 1fr) 290px; gap: var(--gap, 10px); align-items: start; }
#career .hs-gs { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0; } #career .hs-gs > span { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; background: #f2f4f7; border-radius: 999px; padding: 3px 10px 3px 3px; }
#career .hs-inv2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap, 10px); align-items: start; }
#career .hs-ir { display: grid; grid-template-columns: 30px minmax(0, 1fr) auto; gap: 9px; align-items: center; padding: 7px 0; border-bottom: 1px solid #f0f2f5; min-height: 60px; }
#career .hs-ir b { font-size: 12.5px; } #career .hs-ir p { margin: 2px 0 0; font-size: 11.5px; color: #4a5361; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#career .hs-ir > div:last-child { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; } #career .hs-ir > div:last-child > span { display: flex; gap: 4px; }
#career .hs-st { font-size: 9.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; padding: 3px 7px; border-radius: 999px; background: #f2f4f7; color: #6b7480; white-space: nowrap; }
#career .hs-st.pending { background: #eaf2ff; color: #2a5ca8; } #career .hs-st.accepted { background: #e5f6ec; color: #1f7a4a; } #career .hs-st.done { background: #e3f4f2; color: #0e7a6e; }
#career .hs-tile .hs-tl { font-style: normal; font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; vertical-align: middle; margin-left: 6px; color: var(--c, #6b7480); }
#career .hs-tile .hs-of { font-style: normal; font-size: 13px; color: #8a93a0; font-weight: 700; }
#career .hs-warn { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 10px 12px; margin-bottom: 8px; }
#career .hs-warn.lv-info { background: #f3f6fb; border-color: #dbe4f0; } #career .hs-warn.lv-warn { background: #fff8ec; border-color: #f2d49a; }
#career .hs-warn-i { width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-weight: 900; font-size: 12px; font-style: normal; background: #e5484d; color: #fff; flex: none; }
#career .hs-warn.lv-warn .hs-warn-i { background: #e39a1b; } #career .hs-warn.lv-info .hs-warn-i { background: #3d7bd9; }
#career .hs-warn-t { flex: 1; min-width: 200px; font-size: 13px; }
#career .hs-warn-o { flex-basis: 100%; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
#career .hs-warn-o button { padding: 8px 10px; font-size: 11px; letter-spacing: .04em; text-align: left; }
#career .hs-rx { display: flex; flex-direction: column; gap: 10px; font-size: 13px; }
#career .hs-rx3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
#career .hs-rxt { background: #f6f7f9; border-radius: 11px; padding: 8px 10px; min-width: 0; } #career .hs-rxt small { display: block; font-size: 9.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #8a93a0; } #career .hs-rxt b { display: block; font-size: 17px; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-rxl > div { font-size: 12.5px; padding: 5px 0; border-bottom: 1px dashed #edf0f4; color: #2f3a48; }
#career .hs-rxl > div small { color: #8a93a0; font-weight: 700; margin-right: 6px; }
#career .hs-rxm { display: flex; align-items: center; gap: 14px; } #career .hs-rxm b { font-size: 32px; font-weight: 800; font-variant-numeric: tabular-nums; } #career .hs-rxm i { font-style: normal; color: #b9c1cc; font-size: 22px; } #career .hs-rxm span { font-size: 12.5px; color: #5d6675; }
#career .hs-calm *, #career .hs-rx.m-calm * { animation: none !important; }
#career .hs-rx.hs-calm .hs-u, #career .hs-rx.hs-calm .hs-d { color: inherit; }
@media (max-height: 700px) {
  #career .hs-acts { grid-auto-rows: 98px; } #career .hs-act-d { -webkit-line-clamp: 1; } #career .hs-vens { grid-auto-rows: 146px; } #career .hs-press { grid-auto-rows: minmax(118px, auto); } #career .hs-po .hs-out-p { display: none; } #career .hs-deal { height: 84px; }
}
@media (max-width: 900px) {
  #career .hs { height: auto; }
  #career .hs-strip { height: auto; min-height: 46px; flex-wrap: wrap; padding: 8px 12px; white-space: normal; }
  #career .hs-strip-r { flex-wrap: wrap; justify-content: flex-start; }
  #career .hs-formg, #career .hs-licg, #career .hs-pulse, #career .hs-postg, #career .hs-go3, #career .hs-confirm, #career .hs-news2, #career .hs-inv2 { grid-template-columns: 1fr; }
  #career .hs-acts, #career .hs-outs, #career .hs-opts, #career .hs-vens, #career .hs-whos, #career .hs-fg, #career .hs-press, #career .hs-ptns, #career .hs-offers, #career .hs-pg, #career .hs-deals, #career .hs-dws, #career .hs-hgs, #career .hs-copts { grid-template-columns: 1fr 1fr; }
  #career .hs-tiles6, #career .hs-tiles5 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  #career .hs-next { grid-template-columns: 1fr 1fr; height: auto; } #career .hs-slots { height: auto; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  #career .hs-stat { grid-template-columns: 80px minmax(40px, 1fr) 28px 30px; } #career .hs-stat small { display: none; }
  #career .hs-mrow { grid-template-columns: 1fr auto; height: auto; padding: 6px 0; } #career .hs-mrow > :nth-child(2), #career .hs-mrow > :nth-child(3), #career .hs-mrow > :nth-child(4) { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  #career .hs, #career .hs *, #career .hs-slot *, #career .hs-warn *, #career .hs-rx * { animation: none !important; transition: none !important; }
}
#career:is(.m-off *) .hs, #career:is(.m-off *) .hs *, #career:is(.m-off *) .hs-slot *, #career:is(.m-off *) .hs-warn *, #career:is(.m-off *) .hs-rx * { animation: none !important; transition: none !important; }
` + STYLE_CSS;

// ---- small helpers (the hub's own, copied: this file never imports the hub) ---------------------------------------------
const num = (v, f = 0) => (typeof v === 'number' && isFinite(v) ? v : f);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
/** your own money, to the hundredth of a million: '$0.15M', '$3.0M' */
const cash = (v) => `$${(Math.round(num(v) * 100) / 100).toFixed(2).replace(/(\.\d)0$/, '$1')}M`;
const costTxt = (v) => (num(v) > 0 ? cash(v) : 'Free');
const first = (s) => String(s || '').trim().split(/\s+/)[0] || '';
const last = (s) => String(s || '').trim().split(/\s+/).pop() || '';
const cap = (s) => String(s || '').replace(/^\w/, (x) => x.toUpperCase());
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
/** a whole-number change with its sign: '+6', '−3', '±0' */
const sgn = (v) => { v = Math.round(num(v)); return v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '±0'; };
/** a multiplier's change as a percentage (v = mul - 1): '+0.12%' */
const pct = (v, d = 1) => { const x = Math.round(num(v) * 100 * 10 ** d) / 10 ** d; return x > 0 ? `+${x.toFixed(d)}%` : x < 0 ? `−${(-x).toFixed(d)}%` : '±0%'; };
const likesTxt = (v) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${Math.round(v / 1e3)}K` : String(Math.round(num(v))));
const lin = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
const HEX = /^#[0-9a-f]{6}$/i;
const lum = (hex) => { if (!HEX.test(String(hex || ''))) return 0.5; const n = parseInt(hex.slice(1), 16); return 0.2126 * lin((n >> 16) / 255) + 0.7152 * lin(((n >> 8) & 255) / 255) + 0.0722 * lin((n & 255) / 255); };
/** a team colour that shows on the white panels (the hub's ink() without three.js: a near-white livery drawn in grey) */
const ink0 = (hex) => (!HEX.test(String(hex || '')) || lum(hex) > 0.62 ? '#8a93a0' : hex);
const rapI = (v) => `<i style="left:${v < 0 ? 50 + v / 2 : 50}%;width:${Math.abs(v) / 2}%;background:${v < 0 ? '#e5484d' : '#1fae64'}"></i>`;
const dTxt0 = (v) => (!v ? '' : `<span class="${v > 0 ? 'hs-u' : 'hs-d'}">${v > 0 ? '▲' : '▼'}${Math.abs(v * 100).toFixed(1)}</span>`);
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone' };
const trackName = (id) => TRACK[id] || cap(id || '');
const meOf = (c) => c?.drivers?.[c?.playerId] || null;
const alive = (d) => !!d && d.alive !== false;
/** rounds since a stamp ({ season, round }) -> n (99 for never) */
const ago = (c, at) => (at && at.season != null && at.round != null ? (c.season - at.season) * (c.rounds || 6) + (c.round - at.round) : 99);
const trackOf = (c) => (c?.calendar?.length ? c.calendar[(Math.max(1, c.round) - 1) % c.calendar.length] : null);
const rk = (c) => `${c.season}|${c.round}`;
/** a grave week (the race just run hurt someone or was abandoned, or the paddock has lost someone): the social side goes quiet */
const graveOf = (c) => { const x = c?.pr?.ctx; return (!!x?.grave && (x.season == null || ago(c, x) <= 1)) || (c?.lost || []).some((l) => l && ago(c, l) <= 1); };
/** your driver is out hurt (an injury lay-off, not a ban) */
const hurtOf = (c) => { const d = meOf(c); return !!d && d.outUntil != null && d.outUntil >= c.round; };
const mateOf = (c) => { try { return c?.teammate?.() || null; } catch (e) { return null; } };
/** an engine call that must never take the page down with it (an old save, a half-built record) -> its result, or f */
const safe = (fn, f = null) => { try { const v = fn(); return v === undefined ? f : v; } catch (e) { console.warn('HubSocial:', e); return f; } };
/**
 * The night after the last race still in this week's legs (career/Party.js c.party.last: the race's own season and round,
 * this week being the one before the next) -> its hangover { H, energy, slot ('recovery' | 'iv' | null), rough, text }
 * when it was more than a sore head (H > 0.15), else null
 */
const hangOf = (c) => { const L = c?.party?.last, h = L?.hangover; return h && typeof h === 'object' && L.season === c.season && L.round === c.round - 1 && num(h.H) > 0.15 ? h : null; };
/** a career/Party.js call by name (its functions land with it; one that throws never takes the page down) -> its result, or f */
const party = (name, f, ...a) => { const fn = Party[name]; return typeof fn === 'function' ? safe(() => fn(...a), f) : f; };
const save = (c) => { try { c.save?.(); } catch (e) { console.warn('HubSocial: save failed', e); } };
const award = (c) => { try { c.award?.({}); } catch (e) { console.warn('HubSocial: award failed', e); } };
const initials = (name) => { const w = String(name || '?').trim().split(/\s+/); return (w.length > 1 ? w[0][0] + w[w.length - 1][0] : w[0].slice(0, 2)).toUpperCase(); };
/** data-* attributes from an object ({ hsub: 'week:main' } -> ' data-hsub="week:main"'), empty values left out */
const dataAttrs = (o) => Object.entries(o || {}).filter(([, v]) => v != null && v !== '').map(([k, v]) => ` data-${k}="${esc(v)}"`).join('');

// ---- shared pieces ---------------------------------------------------------------------------------------------------
const MOR_COL = { Low: '#d6202e', Shaky: '#e8743b', Steady: '#d39b12', Good: '#1fae64', Flying: '#0e9f8f' };
const EN_COL = { low: '#e5484d', mid: '#e39a1b', high: '#1fae64' };
const GOOD_FORM = ['FLYING', 'CONFIDENT', 'FOCUSED', 'SHARP', 'COOL'];
const formTone = (l) => (GOOD_FORM.includes(l) ? 'p' : l === 'STEADY' ? 'n' : 'm');
const ACOL = { rest: '#5b7cfa', sim: '#0ea5e9', fitness: '#10b981', factory: '#64748b', sponsor: '#d97706', media: '#8b5cf6', fans: '#ec4899', charity: '#22a35a', teambond: '#f59e0b', nightout: '#6366f1', date: '#e11d48', hangout: '#0d9488' };
const CSTAGE = { stranger: '#9aa3ae', met: '#6b7480', friendly: '#3d7bd9', flirting: '#d6337f', dating: '#e11d48', partner: '#b8326b', ex: '#8a93a0' };
const FCOL = { acquaintance: '#9aa3ae', friendly: '#3d7bd9', friend: '#1fae64', mate: '#0e9f8f', best: '#d39b12' };
const FNEXT = { acquaintance: [15, 'Friendly'], friendly: [35, 'Friend'], friend: [60, 'Mate'], mate: [85, 'Best mate'] };
// (each venue and text-only date as a small tile: a glyph over a gradient in its colours - no WebGL render)
const VGLYPH = { poolclub: ['≈', '#0b3d4a', '#19c3d6'], rooftop: ['✦', '#3b1f5c', '#e0457b'], pub: ['♜', '#4a2f1c', '#c98a3e'], simlounge: ['▶', '#0d1b2a', '#1aa3ff'], apartment: ['⌂', '#2f3a44', '#8fa6bb'], restaurant: ['✧', '#3a1f1f', '#d9a35f'], karting: ['⚑', '#1b1d22', '#e10600'], coffee: ['☕', '#3b2a20', '#c8a27c'] };
const DGLYPH = { dinner: ['✧', '#3a1f1f', '#d9a35f'], gallery: ['▣', '#2b2f3a', '#9aa7c7'], concert: ['♫', '#2a1846', '#a855f7'], karting: ['⚑', '#1b1d22', '#e10600'], beach: ['≈', '#0f4c5c', '#5cc8d6'], cooking: ['⌂', '#2f3a44', '#8fa6bb'], gala: ['✶', '#3a2c12', '#e8c25a'], rooftop: ['✦', '#3b1f5c', '#e0457b'], visit: ['☾', '#2b3442', '#8aa0bf'] };
const glyph = (g, cls = '') => `<i class="hs-glyph${cls ? ` ${cls}` : ''}" style="--g1:${g[1]};--g2:${g[2]}">${g[0]}</i>`;
const meter = (v, col, cls = '') => `<span class="hs-meter${cls ? ` ${cls}` : ''}" style="--v:${clamp(num(v), 0, 1).toFixed(3)};--c:${col}"><i></i></span>`;
const rap = (v) => `<span class="hs-rap">${rapI(clamp(Math.round(num(v)), -100, 100))}</span>`;
/** a portrait without WebGL: initials in her outfit's colour, or the team's */
const ava = (name, col, cls = '') => { const c0 = HEX.test(String(col || '')) ? col : '#8a93a0', fg = lum(c0) > 0.45 ? '#151a22' : '#fff'; return `<span class="hs-ava${cls ? ` ${cls}` : ''}" style="--a:${c0};--af:${fg}">${esc(initials(name))}</span>`; };
const celebAva = (id, cls = '', c = null) => { const C = CELEB[id]; return C ? ava(C.name, (c && safe(() => styledColor(c, id), null)) || C.look?.outfit, cls) : `<span class="hs-ava q${cls ? ` ${cls}` : ''}">?</span>`; };
const stageChip = (txt, col) => `<em class="hs-stage" style="--c:${col}">${esc(txt)}</em>`;
const pips5 = (st, col) => { const n = Math.max(0, FRIEND_STAGES.indexOf(st)) + 1; return `<span class="hs-pip5" style="--c:${col}">${FRIEND_STAGES.map((_, i) => `<i class="${i < n ? 'hs-on' : ''}"></i>`).join('')}</span>`; };
const tile = (label, val, sub, attrs = '') => `<div class="hs-tile2"${attrs}><small>${label}</small><b>${val}</b><span>${sub}</span></div>`;
const fact = (label, val, sub = '', bad = false) => `<div class="hs-fact${bad ? ' bad' : ''}"><small>${label}</small><b>${val}</b>${sub ? `<span>${sub}</span>` : ''}</div>`;
const strip = (eye, title, right = '') => `<div class="hs-strip"><div class="hs-eye"><small>${eye}</small><b>${title}</b></div>${right}</div>`;
/** a rapport level in words: Career.rapportLabel's table, copied (the market and the paddock must say the same thing) */
const rapLabel = (v) => (v <= -60 ? 'Bitter rival' : v <= -25 ? 'Hostile' : v < -8 ? 'Cold' : v < 10 ? 'Neutral' : v < 35 ? 'Friendly' : v < 65 ? 'Respected' : 'Close ally');
/** a contact's name: 'd:<driver>', 'c:<celebrity>', 'x:boss' ... */
const nameOfCid = (c, cid) => { const k = String(cid || '').slice(0, 2), id = String(cid || '').slice(2); return k === 'd:' ? c.drivers?.[id]?.name || 'A driver' : k === 'c:' ? CELEB[id]?.name || 'Someone' : id === 'boss' ? 'Team principal' : id === 'eng' ? 'Race engineer' : c.pr?.manager?.name || 'PR manager'; };
const avaCid = (c, cid, K) => {
  const k = String(cid).slice(0, 2), id = String(cid).slice(2);
  if (k === 'c:') return celebAva(id, 'sm');
  const d = c.drivers?.[id], t = d && c.teams?.[d.team];
  return k === 'd:' && d ? ava(d.name, K.ink(t?.color || '#8a93a0'), 'sm') : `<span class="hs-ava sm" style="--a:#151a22;--af:#fff">${id === 'pr' ? 'PR' : '✆'}</span>`;
};
const faceOf = (K, d, t) => {
  const col = K.ink(t?.color || '#8a93a0');
  if (!K.face) return ava(d.name, col);
  const f = safe(() => K.face(d, t?.color, t?.color2), '');
  return f ? `<span class="hs-face" style="--c:${col}">${f}</span>` : ava(d.name, col);
};
/** the bond as plain JSON, without making one for a stranger (bondOf would store it) */
const peek = (c, id) => c?.celebs?.bonds?.[id] || null;
const involvedB = (b) => !!b && !b.grieving && (b.stage === 'dating' || b.stage === 'partner' || (!!b.accepted && b.stage !== 'ex'));

// ---- the page frame: the hub's sub-tabs (or this file's own when the hub has none), the strip, a pager -----------------
const SUBS = {
  you: [['', 'Form'], ['licence', 'Licence'], ['record', 'Record']], week: [['', 'The week']],
  pr: [['', 'Pulse'], ['posts', 'Social'], ['deals', 'Deals'], ['press', 'Press'], ['news', 'News']],
  life: [['', 'Partners'], ['style', 'Style'], ['people', 'People']], social: [['', 'Paddock'], ['hangout', 'Hang out'], ['invites', 'Invites']],
};
const subOf = (tab, S, H) => { const s = String(H?.sub ?? S?.sub ?? ''); return (SUBS[tab] || []).some(([k]) => k === s) ? s : ''; };
const subNav = (tab, sub) => (SUBS[tab].length < 2 ? '' : `<div class="hs-seg hs-subnav">${SUBS[tab].map(([k, n]) => `<button data-hsub="${tab}:${k || 'main'}" class="${k === sub ? 'hs-on' : ''}">${n}</button>`).join('')}</div>`);
/**
 * What the hub hands over (H = { chartHTML, esc, money, ink, rapI, dTxt, face, fit, per, compact, calm, sub }), with
 * stand-ins for what an older hub does not pass: own sub-tabs when the hub draws none (H.sub missing), a fixed page size
 * when it cannot measure (H.per), a local chart without H.chartHTML, initials without H.face
 */
const kit = (c, H) => {
  H = H || {};
  return { ink: typeof H.ink === 'function' ? H.ink : ink0, face: typeof H.face === 'function' ? H.face : null, chart: typeof H.chartHTML === 'function' ? H.chartHTML : null,
    dTxt: typeof H.dTxt === 'function' ? H.dTxt : dTxt0, h: num(H.fit?.h, 0), w: num(H.fit?.w, 0), compact: !!H.compact, calm: H.calm != null ? !!H.calm : graveOf(c), own: H.sub == null,
    per: (rowH, chrome, cols, min, dflt) => { try { if (typeof H.per === 'function' && H.fit) return Math.max(cols, Math.round(num(H.per(rowH, chrome, cols, min), dflt))); } catch (e) { console.warn('HubSocial: H.per', e); } return dflt; } };
};
const page = (tab, sub, cls, K, inner, S = {}) => `<div class="hs hs-p-${cls}${K.calm ? ' hs-calm' : ''}" data-hs="${tab}">${K.own ? subNav(tab, sub) : ''}${inner}${S.msg ? `<div class="hs-msg">${esc(S.msg)}</div>` : ''}</div>`;
// (the main list of each page: its page is S.page, and its buttons also carry the hub's data-page, so the hub's ←/→
// keys find them - the click itself still comes here through data-hpg; a second list on a page keeps S.pgs[key])
const MAIN_PG = new Set(['ent', 'off', 'feed', 'ptn', 'plog', 'ppl', 'fr', 'who', 'inc']);
/** a list's page (S.page for a page's main list, else S.pgs[key]) -> { p, pages, per, from } */
const pageOf = (S, key, n, per) => { const pages = Math.max(1, Math.ceil(n / Math.max(1, per))), p = clamp(Math.round(num(MAIN_PG.has(key) ? S?.page : S?.pgs?.[key], 0)), 0, pages - 1); return { p, pages, per, from: p * per }; };
const pgBtn = (key, n, off, t, g) => `<button data-hpg="${key}:${n}"${MAIN_PG.has(key) ? ` data-page="${n}"` : ''}${off ? ' disabled' : ''} title="${t}">${g}</button>`;
const pager = (key, pg) => (pg.pages <= 1 ? '' : `<span class="hs-pager">${pgBtn(key, pg.p - 1, pg.p <= 0, 'Previous page', '‹')}${pg.p + 1} / ${pg.pages}${pgBtn(key, pg.p + 1, pg.p >= pg.pages - 1, 'Next page', '›')}</span>`);
const headSlot = (html) => (html ? `<span class="hs-slot" data-slot="head">${html}</span>` : '');
const guardPage = (fn, what) => {
  try { return fn(); } catch (e) {
    console.warn(`HubSocial: ${what} failed`, e);
    return '<div class="hs"><div class="hs-card hs-empty"><b>This page could not be drawn.</b><p>Something in the save did not add up here. The career itself is safe: the other pages work as before.</p></div></div>';
  }
};
const noDriver = () => '<div class="hs-card hs-empty"><b>You have no driver of your own just now.</b><p>Choose who you are on the briefing first: one of your drivers, or someone signed from the market.</p></div>';
/** a small line chart without the hub (H.chartHTML absent): an inline SVG, values on hover through each point's title */
function mini(series, xs, o = {}) {
  const W = Math.max(320, Math.round(o.w || 720)), Hh = Math.max(120, Math.round(o.h || 200)), P = { l: 38, r: 14, t: 12, b: 22 };
  const all = series.flatMap((s) => s.pts).filter((v) => v != null && isFinite(v));
  if (all.length < 2 || xs.length < 2) return `<div class="hs-nochart">${esc(o.empty || 'Not enough rounds yet: the lines start after your first race.')}</div>`;
  let lo = o.lo ?? Math.min(...all), hi = o.hi ?? Math.max(...all); if (hi - lo < 1e-6) { hi += 1; lo -= 1; }
  const X = (i) => P.l + (i / (xs.length - 1)) * (W - P.l - P.r), Y = (v) => P.t + (1 - (v - lo) / (hi - lo)) * (Hh - P.t - P.b), fmt = o.fmt || ((v) => String(Math.round(v)));
  const grid = [0, 0.5, 1].map((f) => lo + (hi - lo) * f).map((v) => `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="#eef0f4"/><text x="${P.l - 6}" y="${(Y(v) + 4).toFixed(1)}" fill="#8a93a0" font-size="10" text-anchor="end">${esc(fmt(v))}</text>`).join('');
  const zero = lo < 0 && hi > 0 ? `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(0).toFixed(1)}" y2="${Y(0).toFixed(1)}" stroke="#c9cfd8" stroke-dasharray="3 3"/>` : '';
  const step = Math.max(1, Math.ceil(xs.length / 12)), xl = xs.map((x, i) => (i % step && i !== xs.length - 1 ? '' : `<text x="${X(i).toFixed(1)}" y="${Hh - 6}" fill="#8a93a0" font-size="10" text-anchor="middle">${esc(x)}</text>`)).join('');
  const lines = series.map((s) => {
    const p = s.pts.map((v, i) => (v == null || !isFinite(v) ? null : [X(i), Y(v), v, i])).filter(Boolean); if (!p.length) return '';
    return `<path d="${p.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join('')}" fill="none" stroke="${esc(s.color)}" stroke-width="${s.bold ? 3 : 1.8}" stroke-linejoin="round" stroke-linecap="round"/>${p.map((q) => `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${s.bold ? 3.6 : 2.6}" fill="${esc(s.color)}" stroke="#fff" stroke-width="1.4"><title>${esc(`${s.name} · ${xs[q[3]]}: ${fmt(q[2])}`)}</title></circle>`).join('')}`;
  }).join('');
  return `<div class="hs-mini"><svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${esc(series.map((s) => s.name).join(', '))}">${grid}${zero}${xl}${lines}</svg><div class="hs-lg">${series.map((s) => `<span><i style="background:${esc(s.color)}"></i>${esc(s.name)}</span>`).join('')}</div></div>`;
}
/** a chart: the hub's (hover, legend, wired by the hub; kept short enough to fit by its width) or the local one */
const chartBox = (K, id, series, xs, o, maxH, w0) => {
  if (K.chart) return `<div class="hs-chartbox" style="max-width:${Math.round(Math.max(240, maxH - 52) * 620 / 300)}px">${safe(() => K.chart(id, series, xs, o), '')}</div>`;
  return mini(series, xs, { ...o, w: w0 || K.w || 720, h: Math.max(140, maxH - 34) });
};

// ---- DRIVER: form, licence, record -----------------------------------------------------------------------------------
const EFF = {
  confidence: (F) => ({ t: `Grip ${pct(F.grip - 1, 2)} · brakes ${pct(F.pBrake - 1, 1)}`, g: F.grip - 1 }),
  focus: (F) => ({ t: `Tyre wear ${pct(F.wear - 1, 1)}`, g: 1 - F.wear }),
  racecraft: (F) => ({ t: `Dirty-air loss ${pct(F.follow - 1, 0)}`, g: 1 - F.follow }),
  composure: (F) => ({ t: `Pit-box window ${pct(F.pitWin - 1, 0)}`, g: F.pitWin - 1 }),
};
const gcls = (g) => (g > 1e-4 ? 'hs-gu' : g < -1e-4 ? 'hs-gd' : '');
// (the four in-car chips: what each trait does to your car this weekend, and whether that helps)
const CHIP = [['confidence', 'Grip · brakes', (F) => `${pct(F.grip - 1, 2)} · ${pct(F.pBrake - 1, 1)}`, (F) => F.grip - 1], ['focus', 'Tyre wear', (F) => pct(F.wear - 1, 1), (F) => 1 - F.wear],
  ['racecraft', 'Dirty-air loss', (F) => pct(F.follow - 1, 0), (F) => 1 - F.follow], ['composure', 'Pit-box window', (F) => pct(F.pitWin - 1, 0), (F) => F.pitWin - 1]];
const FAVN = { dinner: 'Dinner', gallery: 'A gallery opening', concert: 'A concert', karting: 'Karting', beach: 'A beach day', cooking: 'Cooking at home', gala: 'A charity gala', rooftop: 'A rooftop at night' };
/** the morale gauge: a half-ring cut at the label bands (20, 40, 60, 80), the number in the middle */
const gauge = (v, col, lab, key) => {
  const tick = (t) => { const a = Math.PI * (1 - t / 100), x = (r) => (110 + r * Math.cos(a)).toFixed(1), y = (r) => (112 - r * Math.sin(a)).toFixed(1); return `<line x1="${x(88)}" y1="${y(88)}" x2="${x(104)}" y2="${y(104)}"/>`; };
  return `<div class="hs-gauge" style="--c:${col}"><svg viewBox="0 0 220 124" aria-hidden="true"><path class="tr" d="M14 112 A96 96 0 0 1 206 112" pathLength="100"/><path class="vl" d="M14 112 A96 96 0 0 1 206 112" pathLength="100" style="stroke-dashoffset:${100 - clamp(v, 0, 100)}"/>${[20, 40, 60, 80].map(tick).join('')}</svg><b data-n="${key}" data-v="${v}">${v}</b><small>${esc(lab)}</small></div>`;
};
function formPage(c, S, K, me) {
  const m = moodOf(me), F = formOf(m), lab = moraleLabel(m.morale), col = MOR_COL[lab] || '#3d7bd9', w = weekOf(c), en = clamp(Math.round(num(w.energy, 80)), 0, 100), pts = activePoints(c, me);
  const mate = mateOf(c), mm = mate && alive(mate) ? moodOf(mate) : null, banned = isBanned(c, me);
  const head = strip('Driver · form', esc(me.name), `<span class="hs-pill ${formTone(F.label)}" title="How you go into the weekend">${esc(F.label)}</span><span class="hs-chip">Energy <b>${en}</b> ${esc(energyLabel(en))}</span><span class="hs-chip${pts >= 9 ? ' r' : pts >= 6 ? ' a' : ''}">Licence <b>${pts}/${LICENCE_MAX}</b></span>${banned ? '<span class="hs-chip r">Suspended for the next race</span>' : ''}<span class="hs-grow"></span>${mm ? `<span class="hs-chip" title="Your team-mate's morale">${esc(last(mate.name))} <b>${mm.morale}</b> ${esc(moraleLabel(mm.morale))}</span>` : ''}`);
  const chips = CHIP.map(([k, n, t, g]) => `<div class="hs-fxc ${gcls(g(F))}" title="From your ${esc(MOOD_NAMES[k].toLowerCase())}"><small>${n}</small><b>${esc(t(F))}</b></div>`).join('');
  const left = `<div class="hs-card hs-gcard"><span class="hs-lbl">Morale</span>${gauge(m.morale, col, lab, 'ymor')}<p class="hs-line"><q>${esc(moraleLine(m))}</q><small>Your race engineer</small></p><span class="hs-lbl">In the car this weekend</span><div class="hs-fx">${chips}</div></div>`;
  const rows = MOOD_STATS.map((k) => { const v = m[k], off = Math.round(num(me.moodOff?.[k])), e = EFF[k](F); return `<div class="hs-stat"><b class="n">${MOOD_NAMES[k]}</b>${meter(v / 100, MOR_COL[moraleLabel(v)] || col)}<b class="v">${v}</b><em class="${off > 0 ? 'hs-u' : off < 0 ? 'hs-d' : ''}" title="Against your morale: it fades over the next rounds">${off ? sgn(off) : '·'}</em><small class="${e.g > 1e-4 ? 'hs-u' : e.g < -1e-4 ? 'hs-d' : ''}">${esc(e.t)}</small></div>`; }).join('');
  const W = (Array.isArray(me.moodWhy) ? me.moodWhy : []).filter((x) => x && x.why), n = S.allWhy ? (K.compact ? 10 : 13) : K.compact ? 3 : 5;
  const why = W.slice(0, n).map((x) => `<div class="hs-why"><i class="${x.d > 0 ? 'hs-u' : 'hs-d'}">${sgn(x.d)}</i><span title="${esc(x.why)}">${esc(x.why)}</span><small>${x.k && MOOD_NAMES[x.k] ? MOOD_NAMES[x.k] : 'Morale'}${x.round ? ` · R${x.round}` : ''}</small></div>`).join('') || '<p class="hs-none">Nothing has moved your morale yet this season.</p>';
  const more = W.length > n || S.allWhy ? `<button class="hs-link" data-hmore="you">${S.allWhy ? '‹ The four traits' : `All ${Math.min(W.length, 13)} ›`}</button>` : '';
  const right = `<div class="hs-card">${S.allWhy ? '' : `<span class="hs-lbl">The four behind it</span>${rows}`}<div class="hs-lblrow"><span class="hs-lbl">What moved it</span>${more}</div>${why}</div>`;
  return `${head}<div class="hs-formg">${left}${right}</div>`;
}
const LIC_TXT = { Clean: 'A clean licence.', Light: 'A few points on the licence: each comes off a season after the offence.', 'Under watch': 'Halfway to a ban: the stewards will not need much more.',
  'On the edge': 'One more offence could bring a one-race ban.', Ban: 'Twelve points: a one-race ban.' };
function licencePage(c, S, K, me) {
  const pts = activePoints(c, me), E = activeEntries(c, me).slice().reverse(), bt = banText(c, me), lab = pointsLabel(pts), per = K.per(36, bt ? 300 : 232, 1, 3, bt ? 5 : 6), pg = pageOf(S, 'ent', E.length, per);
  const cells = Array.from({ length: LICENCE_MAX }, (_, i) => `<i class="${i < pts ? (pts >= 9 ? 'r' : pts >= 6 ? 'a' : 'g') : ''}"></i>`).join('');
  const scale = Array.from({ length: LICENCE_MAX }, (_, i) => `<span>${i === 5 || i === 8 || i === 11 ? i + 1 : ''}</span>`).join('');
  const oldest = activeEntries(c, me)[0], nxt = oldest ? `${plural(oldest.pts, 'point')} come${oldest.pts === 1 ? 's' : ''} off before R${oldest.expires.round}${oldest.expires.season !== c.season ? ` of ${oldest.expires.season}` : ''} (${plural(oldest.left, 'round')}).` : '';
  const head = strip('Driver · licence', `${pts} of ${LICENCE_MAX} penalty points`, `<span class="hs-chip${pts >= 9 ? ' r' : pts >= 6 ? ' a' : pts ? ' b' : ' g'}">${esc(lab)}</span><span class="hs-grow"></span>${headSlot(pager('ent', pg))}`);
  const ban = bt ? `<div class="hs-card hs-ban"><i>⊘</i><div><b>${esc(bt)}</b><span>Twelve points within twelve months bring a one-race ban: a stand-in takes the seat, and the twelve points come off once it is served.</span></div></div>` : '';
  const meterCard = `<div class="hs-card"><div class="hs-lic" title="${pts} of ${LICENCE_MAX}">${cells}</div><div class="hs-lics">${scale}</div><div class="hs-licn"><b>${pts} / ${LICENCE_MAX}</b><span>${esc(LIC_TXT[lab] || '')}${nxt ? ` ${esc(nxt)}` : ''}</span></div></div>`;
  const rows = E.slice(pg.from, pg.from + per).map((e) => `<div class="hs-tr"><b>R${e.round}${e.season !== c.season ? ` <small>${e.season}</small>` : ''}</b><span class="hs-c1" title="${esc(cap(e.why))}">${esc(cap(e.why))}${e.at ? ` <small>· ${esc(e.at)}</small>` : ''}</span><b>${e.pts} pt${e.pts === 1 ? '' : 's'}</b><small>off before R${e.expires.round}${e.expires.season !== c.season ? ` ${e.expires.season}` : ''} · ${plural(e.left, 'round')}</small></div>`).join('');
  const list = `<div class="hs-card"><span class="hs-lbl">On the licence</span><div class="hs-tr hd"><span>Round</span><span>Offence</span><span>Points</span><span>Expires</span></div>${rows || '<p class="hs-none">Nothing on the licence. Keep it that way.</p>'}</div>`;
  const tab = `<div class="hs-card hs-otab"><span class="hs-lbl">Points per offence</span>${Object.entries(OFFENCE_POINTS).map(([k, v]) => `<div><span class="hs-c1">${esc(cap(k))}</span><b>${k === 'causing a collision' ? '2 · 3 for 10 s' : v}</b></div>`).join('')}<p class="hs-sub" style="margin-top:8px">The game's own table: in reality the stewards decide each case. Twelve months here is one season of rounds.</p></div>`;
  return `${head}<div class="hs-licg"><div class="hs-col">${ban}${meterCard}${list}</div>${tab}</div>`;
}
function recordPage(c, S, K, me) {
  const titles = (c.seasons || []).filter((s) => s.youPos === 1).length, kind = S.ych === 'pts' ? 'pts' : 'mor', hist = Array.isArray(c.history) ? c.history : [], pid = c.playerId, mate = mateOf(c);
  const tiles = `<div class="hs-tiles6">${tile('Starts', me.starts || 0, `${me.careerPts ?? me.points ?? 0} career points`)}${tile('Wins', me.wins || 0, `${me.podiums || 0} podiums`)}${tile('Podiums', me.podiums || 0, me.starts ? `${Math.round(((me.podiums || 0) / me.starts) * 100)}% of starts` : 'none yet')}
    ${tile('Poles · FL', `${me.poles || 0} · ${me.fl || 0}`, 'pole positions · fastest laps')}${tile('Rating', (num(me.rating) * 100).toFixed(1), me.lastDelta ? `${K.dTxt(me.lastDelta)} last race` : 'grows with results')}${tile('Titles', titles, `${plural((c.seasons || []).length, 'season')} done`)}</div>`;
  const xs = hist.map((h) => (h.round ? `R${h.round}` : 'Start')), team = c.teams?.[me.team], col = K.ink(team?.color || '#e10600');
  const val = (h, id) => { const o = kind === 'mor' ? h?.morale : h?.pts; return o && o[id] != null && isFinite(o[id]) ? +o[id] : null; };
  const series = [{ key: pid, name: me.name, short: last(me.name).slice(0, 3).toUpperCase(), color: col, bold: true, pts: hist.map((h) => val(h, pid)) }];
  if (mate && alive(mate)) series.push({ key: mate.id, name: mate.name, short: last(mate.name).slice(0, 3).toUpperCase(), color: '#9aa3ae', bold: false, pts: hist.map((h) => val(h, mate.id)) });
  const seg = `<span class="hs-seg">${[['mor', 'Morale'], ['pts', 'Points']].map(([k, n]) => `<button data-hch="you:${k}" class="${k === kind ? 'hs-on' : ''}">${n}</button>`).join('')}</span>`;
  const has = series[0].pts.filter((v) => v != null).length >= 2, maxH = (K.h || 600) - 46 - 74 - 70 - (K.own ? 46 : 0);
  const body = has ? chartBox(K, `hs-you-${kind}`, series, xs, { int: true, fmt: (v) => String(Math.round(v)) }, clamp(maxH, 200, 380), K.w || 740)
    : `<div class="hs-nochart">${kind === 'mor' ? 'Your morale is charted round by round from here on: the line starts after the next race.' : 'The points chart starts after your first race.'}</div>`;
  return `${strip('Driver · record', esc(me.name), `<span class="hs-chip">${esc(me.team || 'No team')}</span><span class="hs-grow"></span>${headSlot(seg)}`)}${tiles}<div class="hs-card">${body}</div>`;
}
/** DRIVER (S.sub: '' form, 'licence', 'record') -> html */
export function youHTML(c, S = {}, H = {}) {
  return guardPage(() => {
    const K = kit(c, H), sub = subOf('you', S, H), me = meOf(c);
    if (!me || !alive(me)) return page('you', sub, 'you', K, noDriver(), S);
    return page('you', sub, sub === 'licence' ? 'lic' : sub === 'record' ? 'rec' : 'form', K, sub === 'licence' ? licencePage(c, S, K, me) : sub === 'record' ? recordPage(c, S, K, me) : formPage(c, S, K, me), S);
  }, 'DRIVER');
}

// ---- THE WEEK ----------------------------------------------------------------------------------------------------------
// (the activities that open a step of their own when clicked without an argument; what the week can hold while you recover)
const DRILL = { media: 1, date: 1, hangout: 1 };
const HURT_OK = ['rest', 'sim', 'factory', 'date'];
const HARD = /slots|driver|recover|tired|account/i;
function weekStrip(c, w) {
  const left = Math.max(0, w.slots - w.used.length), en = clamp(Math.round(num(w.energy, 80)), 0, 100), hurt = hurtOf(c), tr = c.round > c.rounds ? 'the new season' : trackName(trackOf(c)) || 'the race';
  const due = !w.sponsorDone && !hurt && c.round <= c.rounds;
  const sp = due ? '<span class="hs-chip a" title="One sponsor day a week is in your contract: skip it and sponsor appeal drops by 6.">Sponsor day due · −6 appeal if skipped</span>' : hurt ? '<span class="hs-chip b">Recovering: the sponsors wait</span>' : w.sponsorDone ? '<span class="hs-chip g">Sponsor day done</span>' : '';
  // (the night after the race, still felt: what it took off the week, in the chip's tooltip)
  const hg = hangOf(c), hgT = hg ? [hg.text || (num(hg.energy) ? `Energy ${sgn(-Math.abs(num(hg.energy)))} this week.` : ''), hg.slot === 'iv' ? 'Slot 1: an IV-hydration clinic.' : hg.slot === 'recovery' ? 'Slot 1: recovery, locked.' : '', hg.rough ? 'A rough morning for the first sponsor or media day.' : ''].filter(Boolean).join(' ') : '';
  const hc = hg ? `<span class="hs-chip ${num(hg.H) >= 0.6 ? 'r' : 'a'}" title="${esc(hgT)}">Hangover${hg.slot === 'iv' ? ' · IV clinic' : hg.slot === 'recovery' ? ' · slot 1 recovery' : ''}</span>` : '';
  return `<div class="hs-strip" data-region="energy"><div class="hs-eye"><small>The week · before ${esc(tr)}</small><b>${left ? `${plural(left, 'slot')} left` : 'The week is full'}</b></div>
    <div class="hs-strip-r"><span class="hs-pips" title="${left} of ${w.slots} slots free">${Array.from({ length: w.slots }, (_, i) => `<i class="${i < w.used.length ? 'used' : ''}"></i>`).join('')}</span><span class="hs-en" title="${esc(energyLabel(en))}: energy below 30 on race day costs focus"><small>Energy</small>${meter(en / 100, EN_COL[energyBand(en)])}<b>${en}</b></span>${hc}${sp}<span class="hs-chip" title="Your own money: dates, evenings out, the team, charity">Own <b>${cash(c.wallet)}</b></span></div></div>`;
}
const slotCard = (c, u, hurt) => {
  if (!u) return '<div class="hs-slot2 free">Free</div>';
  const A = ACTIVITIES.find((a) => a.key === u.key) || { icon: '•', name: cap(u.key) }, a = String(u.arg || '');
  const sub = u.key === 'media' ? outletName(a) : u.key === 'date' ? `With ${first(CELEB[a.split('|')[0]]?.name) || 'her'}` : u.key === 'hangout' ? VENUE_BY_ID[a.split('|')[0]]?.name || 'An evening out' : u.text;
  return `<div class="hs-slot2" title="${esc(u.text || '')}" style="--c:${ACOL[u.key] || '#6b7480'}"><i class="hs-ico">${A.icon}</i><span class="hs-slt"><b>${esc(u.key === 'rest' && hurt ? 'Recovery' : A.name)}</b><small>${esc(sub || '')}</small></span></div>`;
};
const actCard = (a, calm) => {
  const drill = !!DRILL[a.key], soft = drill && !HARD.test(a.why || ''), dis = !a.ok && !soft;
  const st = !a.ok && !soft ? a.why : drill ? (a.key === 'media' ? 'Choose the outlet ›' : a.key === 'date' ? (a.ok ? (calm ? 'A quiet evening ›' : 'Who, then where ›') : 'Nobody to take out yet ›') : a.ok ? 'Choose the evening ›' : 'Make plans first ›') : a.mul === 0 ? 'Nothing more in it this week' : a.mul < 1 ? 'Half the effect: done once already' : 'Ready';
  const en = drill && a.key !== 'media' ? 'Energy by venue' : a.energy > 0 ? `Energy −${a.energy}` : a.energy < 0 ? `Energy +${-a.energy}` : 'No energy';
  return `<button class="hs-act hs-hit${!a.ok ? ' no' : ''}" data-act="${a.key}" style="--c:${ACOL[a.key] || '#6b7480'}"${dis ? ' disabled' : ''} title="${esc(a.desc)}"><span class="hs-act-h"><i class="hs-ico">${a.icon}</i><b>${esc(a.name)}</b>${a.done ? `<em>×${a.done}</em>` : ''}</span><small class="hs-act-e">${esc(en)}</small><span class="hs-act-d">${esc(a.desc)}</span><span class="hs-act-s${!a.ok && !soft ? ' why' : a.mul < 1 && !drill ? ' half' : ''}">${esc(st || '')}</span></button>`;
};
function weekMain(c, S, K, w) {
  const hurt = hurtOf(c), A = activitiesFor(c).filter((a) => !hurt || HURT_OK.includes(a.key));
  const slots = `<div class="hs-slots" data-region="slots">${Array.from({ length: w.slots }, (_, i) => slotCard(c, w.used[i], hurt)).join('')}</div>`;
  const cards = `<div class="hs-acts${hurt ? ' hurt' : ''}" data-region="cards">${A.map((a) => actCard(a, K.calm)).join('')}</div>`;
  const note = hurt ? '<p class="hs-note">While you recover the week is rest, light simulator work, the factory and a quiet visit. The sponsors wait; the doctors decide.</p>'
    : K.calm ? '<p class="hs-note">A quiet week in the paddock. Nothing you do here becomes a story.</p>' : '';
  return `${weekStrip(c, w)}${slots}${cards}${note}`;
}
const drillBar = (title, extra = '') => `<div class="hs-drillbar">${headSlot(`<span class="hs-crumb"><button class="hs-link" data-wback="1">‹ The week</button><i>›</i><b>${esc(title)}</b></span>${extra}`)}</div>`;
const stepper = (tab, st, defs) => `<span class="hs-steps">${defs.map(([n, ok], i) => `<button data-hst="${tab}:${i + 1}" class="${i + 1 === st ? 'hs-on' : i + 1 < st ? 'done' : ''}"${ok ? '' : ' disabled'}>${i + 1} ${esc(n.toUpperCase())}</button>`).join('')}</span>`;
function mediaDrill(c, S, K, w) {
  const A = activityState(c, 'media'), L = mediaOutlets(c);
  const cards = L.map((o) => {
    const O = OUTLET_BY_ID[o.id] || {}, st = activityState(c, 'media', o.id), dis = o.used || !st.ok, gain = o.rel > 60 ? 'They like you already: about +6' : 'Their opinion +12 · image +2';
    return `<button class="hs-out hs-hit" data-act="media" data-arg="${esc(o.id)}" style="--c:${esc(O.color || '#6b7480')}"${dis ? ' disabled' : ''} title="${esc(O.blurb || '')}"><span class="hs-out-h"><b>${esc(o.name)}</b><small>${esc(O.kind || o.kind || '')}</small></span><span class="hs-out-r">${rap(o.rel)}<em>${esc(relLabel(o.rel))} ${sgn(o.rel)}</em></span><span class="hs-out-p">${esc(O.reporter || '')}${O.fickle ? ' · fair-weather' : ''}</span><span class="hs-out-s">${esc(o.used ? 'Had their day this week' : !st.ok ? st.why : gain)}</span></button>`;
  }).join('');
  const d = ACTIVITIES.find((a) => a.key === 'media');
  return `${drillBar('Media day')}${weekStrip(c, w)}<div class="hs-card hs-dhead" style="--c:${ACOL.media}"><i class="hs-ico">✎</i><div><b>An afternoon with one outlet</b><small>${esc(d?.desc || '')}</small></div><span class="hs-chip">Energy −${A.energy || 15}</span>${A.done ? `<span class="hs-chip a">Done ×${A.done}: ${A.mul ? 'half the effect' : 'no effect'}</span>` : ''}</div><div class="hs-outs">${cards}</div>`;
}
// (a 3D evening is booked one of two ways: played out, or summed up at once - Social.autoHangout - with no scene to load)
const PLAYT = 'It takes a slot: then the evening is played out in 3D', SKIPT = 'It takes a slot: no 3D - you just hear how the evening went';
function dateDrill(c, S, K, w) {
  const T = dateTargets(c), id = T.some((t) => t.id === S.celeb) ? S.celeb : T.length === 1 && num(+S.step, 1) > 1 ? T[0].id : null;
  const O = id ? dateChoices(c, id) : [], o = O.find((x) => x.key === S.dk) || null;
  let st = clamp(Math.round(num(+S.step, 1)) || 1, 1, 3); if (!id) st = 1; if (st === 3 && !o) st = 2;
  const bar = drillBar(K.calm ? 'A quiet evening' : 'A date', stepper('week', st, [['Who', true], ['Where', !!id], ['Go', !!o]]));
  const left = Math.max(0, w.slots - w.used.length);
  if (st === 1) {
    if (!T.length) return `${bar}${weekStrip(c, w)}<div class="hs-card hs-empty"><b>Nobody to take out yet.</b><p>Meet people on the grid walk; when there is a spark, ask her out - from the People page, or your phone. A yes is arranged here.</p><div class="hs-acts2"><button class="hs-btn" data-hsub="life:people">PEOPLE ›</button><button class="hs-btn" data-phone="1">OPEN THE PHONE</button></div></div>`;
    const cards = T.map((t) => { const C = CELEB[t.id]; return `<button class="hs-dw hs-hit${t.id === S.celeb ? ' hs-sel' : ''}" data-cdate="${esc(t.id)}">${celebAva(t.id, 'lg')}<span><b>${esc(C?.name || t.name)}</b><small>${esc(C?.job || '')}${t.secret ? ' · kept quiet' : ''}</small>${stageChip(t.accepted ? 'Said yes' : bondLabel(c, t.id), CSTAGE[t.accepted ? 'flirting' : t.stage] || '#6b7480')}</span></button>`; }).join('');
    return `${bar}${weekStrip(c, w)}<div class="hs-dws">${cards}</div>`;
  }
  const C = CELEB[id], f = first(C.name);
  if (st === 2) {
    const cards = O.map((x) => {
      const g = x.venue ? VGLYPH[x.key] || VGLYPH.restaurant : DGLYPH[x.key] || ['❦', '#5b2a3a', '#e0457b'], why = !x.afford ? 'Not enough in your own account' : x.energy > num(w.energy, 80) ? 'Too tired' : '';
      const tag = x.fav ? '<em class="hs-tgi g">Her favourite</em>' : x.meh ? '<em class="hs-tgi a">Not her thing</em>' : x.warn ? `<em class="hs-tgi r hs-c1" title="${esc(x.warn)}">${esc(x.warn)}</em>` : '';
      return `<button class="hs-opt hs-hit${x.key === S.dk ? ' hs-sel' : ''}" data-wdk="${esc(id)}|${esc(x.key)}"${why ? ` disabled title="${esc(why)}"` : ''}><span class="hs-opt-h">${glyph(g)}<b class="hs-c1">${esc(x.name)}</b>${x.venue ? '<i class="hs-3d" title="Played out in 3D">3D</i>' : ''}</span><span class="hs-opt-d hs-c2">${esc(x.desc || '')}</span><span class="hs-opt-m">${costTxt(x.cost)} · energy ${x.energy}${x.risk ? ` · long lens ${Math.round(x.risk * 100)}%` : ''}</span>${tag}</button>`;
    }).join('');
    return `${bar}${weekStrip(c, w)}<div class="hs-opts">${cards || `<div class="hs-card hs-empty"><b>Nothing on with ${esc(f)} this week.</b></div>`}</div>`;
  }
  const b = peek(c, id) || {}, g = o.venue ? VGLYPH[o.key] || VGLYPH.restaurant : DGLYPH[o.key] || ['❦', '#5b2a3a', '#e0457b'], tired = o.energy > num(w.energy, 80), arg = `${id}|${o.key}`;
  const go = !left || tired || !o.afford ? `<span class="hs-sub hs-d">${!left ? 'No slots left this week.' : tired ? 'Too tired for this one: rest first.' : 'Not enough in your own account.'}</span>`
    : o.venue ? `<button class="hs-btn go" data-act="date" data-arg="${esc(arg)}" title="${PLAYT}">BOOK THE EVENING →</button><button class="hs-btn" data-act="date" data-arg="${esc(arg)}" data-hskip="1" title="${SKIPT}">BOOK · SUM IT UP</button>`
      : `<button class="hs-btn go" data-act="date" data-arg="${esc(arg)}">GO →</button>`;
  const T0 = C.traits || {}, favN = C.fav ? FAVN[C.fav] || cap(C.fav) : '-';
  return `${bar}${weekStrip(c, w)}<div class="hs-confirm"><div class="hs-card hs-cf"><div class="hs-cf-h">${glyph(g)}<div><small>${esc(bondLabel(c, id))}${b.secret ? ' · kept quiet' : ''}</small><b>${esc(o.name)} with ${esc(f)}</b></div></div><p class="hs-c2">${esc(o.desc || '')}</p>
      <div class="hs-facts">${fact('Cost', costTxt(o.cost), `${cash(c.wallet)} of your own`, !o.afford)}${fact('Energy', o.energy, `${w.energy} left this week`, tired)}${fact('Photographers', o.risk ? `${Math.round(o.risk * 100)}%` : 'None', o.risk ? 'chance of a long lens' : 'nobody will see', o.risk >= 0.3)}${fact('Slot', left ? `${left} left` : 'None left', 'it takes one', !left)}</div>
      ${o.warn ? `<div class="hs-wl">${esc(o.warn)}</div>` : ''}<div class="hs-cfa">${go}<span class="hs-grow"></span><button class="hs-btn" data-hst="week:2">‹ CHANGE</button></div></div>
    <div class="hs-card hs-her"><div class="hs-cf-h">${celebAva(id, 'lg')}<div><b>${esc(C.name)}</b><small>${esc(C.job)} · ${C.age}</small></div></div><p class="hs-c4">${esc(C.vibe || '')}. ${esc(C.bio || '')}</p><p><b>Warms to</b> ${esc((T0.likes || []).join(', ') || '-')} · <b>put off by</b> ${esc((T0.dislikes || []).join(', ') || '-')}</p><p><b>Her favourite evening</b> ${esc(favN)}${o.fav ? ' - and this is it' : ''}</p></div></div>`;
}
/**
 * An evening that said yes, to book: a date when it is just her and the two of you are dating (or she said yes to
 * one), else an evening out (Agenda's hangout, which takes anyone who accepted). BOOK THE EVENING plays it in 3D, BOOK ·
 * SUM IT UP books it and tells you how it went; a place with no scene is summed up at once -> the buttons
 */
const bookBtns = (c, h, ret = '') => {
  const solo = h.cids.length === 1 && String(h.cids[0]).startsWith('c:'), id = solo ? String(h.cids[0]).slice(2) : null, date = solo && !!safe(() => canDate(c, id), false);
  const act = date ? 'date' : 'hangout', arg = date ? `${id}|${h.venue}` : h.arg, sc = VENUE_BY_ID[h.venue]?.scene !== false;
  const st = safe(() => activityState(c, act, arg), null), why = h.why || (st && !st.ok ? st.why : '');
  const at = `data-act="${act}" data-arg="${esc(arg)}"${ret ? ` data-hret="${ret}"` : ''}`, tip = (t) => (why ? ` disabled title="${esc(why)}"` : ` title="${t}"`);
  return `<button class="hs-btn go" ${at}${sc ? '' : ' data-hskip="1"'}${tip(sc ? PLAYT : 'It takes a slot')}>BOOK THE EVENING →</button>${sc ? `<button class="hs-btn" ${at} data-hskip="1"${tip(SKIPT)}>BOOK · SUM IT UP</button>` : ''}`;
};
const eveCard = (c, h, K, ret = '') => {
  const V = VENUE_BY_ID[h.venue] || {}, g = VGLYPH[h.venue] || VGLYPH.simlounge;
  return `<div class="hs-card hs-hg"><div class="hs-hg-h">${glyph(g)}<div><b>${esc(V.name || h.name)}</b><small>With ${esc(h.names.join(', '))}</small></div><span class="hs-chip">${costTxt(h.cost)} · energy ${h.energy}</span></div>${h.why ? `<div class="hs-wl r">${esc(h.why)}</div>` : ''}<div class="hs-acts2">${bookBtns(c, h, ret)}</div></div>`;
};
function hangDrill(c, S, K, w) {
  const R = hangoutsReady(c);
  const body = R.length ? `<div class="hs-hgs">${R.slice(0, 4).map((h) => eveCard(c, h, K)).join('')}</div>`
    : `<div class="hs-card hs-empty"><b>No evening arranged yet.</b><p>${K.calm ? 'A quiet coffee with a friend is all this week holds, and only if you ask.' : 'Ask friends out - one, or up to three together - from the planner or your phone. When they say yes, the evening is booked here.'}</p><div class="hs-acts2"><button class="hs-btn go" data-hsub="social:hangout">MAKE PLANS ›</button><button class="hs-btn" data-phone="1">OPEN THE PHONE</button></div></div>`;
  return `${drillBar('An evening out')}${weekStrip(c, w)}${body}${R.length ? '<p class="hs-note">Booking takes a slot, its energy and the bill. Then play the evening in 3D, or skip it and hear how it went.</p>' : ''}`;
}
/** THE WEEK (drills: S.pick 'media' | 'date' (S.step 1..3, S.celeb, S.dk) | 'hangout') -> html */
export function weekHTML(c, S = {}, H = {}) {
  return guardPage(() => {
    const K = kit(c, H), me = meOf(c);
    if (!me || !alive(me)) return page('week', '', 'week', K, noDriver(), S);
    const w = weekOf(c), pk = DRILL[S.pick] ? S.pick : null;
    return page('week', '', 'week', K, pk === 'media' ? mediaDrill(c, S, K, w) : pk === 'date' ? dateDrill(c, S, K, w) : pk === 'hangout' ? hangDrill(c, S, K, w) : weekMain(c, S, K, w), S);
  }, 'THE WEEK');
}

// ---- PR & MEDIA ----------------------------------------------------------------------------------------------------------
const outletChip = (id) => { const O = OUTLET_BY_ID[id]; return `<span class="hs-ot" style="--c:${esc(O?.color || '#6b7480')}">${esc(O?.name || outletName(id) || 'Press')}</span>`; };
/** the story waiting for an answer: what it is, how long it waits, what your manager (or common sense) says, the answers */
const crisisCard = (c, X, ret = '') => {
  const adv = safe(() => crisisAdvice(c), null), pos = !!X.positive, t = num(X.ticks);
  const due = t >= 1 ? 'Last race to answer' : 'Two races to answer';
  return `<div class="hs-card hs-crisis${pos ? ' pos' : ''}"><div class="hs-crisis-h"><i class="hs-crisis-i">${pos ? '★' : '!'}</i><div><small>${pos ? 'A moment to use' : 'A story waiting for an answer'} · ${esc(outletName(X.outlet))}</small><b title="${esc(X.title)}">${esc(X.title)}</b></div><span class="hs-chip ${t >= 1 ? 'r' : 'a'}" title="Left unanswered, the story runs without you">${due}</span></div>
    <p>${esc(X.text || '')}</p>${X.also?.length ? `<p class="hs-also">Folded in: ${esc(X.also.join(' · '))}</p>` : ''}${adv?.text ? `<div class="hs-adv"><b>${esc(adv.from ? `${first(adv.from)} says` : 'Common sense says')}:</b> ${esc(adv.text)}</div>` : ''}
    <div class="hs-copts">${(X.options || []).map((o) => `<button class="hs-copt${adv && adv.key === o.key ? ' rec' : ''}" data-crisis="${esc(o.key)}"${ret ? ` data-hret="${ret}"` : ''} title="${esc(o.hint || '')}"><b>${esc(o.label)}</b><small>${esc(o.hint || '')}</small></button>`).join('')}</div></div>`;
};
const crisisOf = (c) => { const X = c?.pr?.crisis; return X && Array.isArray(X.options) && X.options.length ? X : null; };
const PERSONA_N = { humble: 'Humble', confident: 'Confident', showman: 'Showman', controversial: 'Lightning rod' };
function pulsePage(c, S, K) {
  const P = c.pr || {}, D = P.deals || [], inc = D.reduce((a, d) => a + num(d.value), 0), H0 = (P.hist || []).filter((h) => h && h.season != null), prv = H0.length > 1 ? H0[H0.length - 2] : null, X = crisisOf(c);
  const fd = prv ? num(P.fame) - num(prv.fame) : 0, img = Math.round(num(P.image, 10)), heat = Math.round(num(P.heat)), app = Math.round(num(P.appeal, 50)), pe = safe(() => personaOf(c), null);
  const tiles = `<div class="hs-tiles5">${tile('Followers', fameText(P.fame), fd ? `${fd > 0 ? '+' : '−'}${fameText(Math.abs(fd))} last round` : 'on Chequered')}${tile('Public image', `<span data-n="pimg" data-v="${img}">${img}</span>`, esc(imageLabel(img)))}${tile('Heat', `<span data-n="pheat" data-v="${heat}">${heat}</span>`, esc(heatLabel(heat)))}
    ${tile('Sponsor appeal', `<span data-n="papp" data-v="${app}">${app}</span>`, esc(appealLabel(app)))}${tile('Endorsements', `${cash(inc)}`, D.length ? `a round · ${plural(D.length, 'deal')}` : 'no deals yet')}</div>`;
  const kind = S.pch === 'fame' ? 'fame' : 'mood', hs = H0.slice(-14), xs = hs.map((h) => `${h.season !== c.season ? `${String(h.season).slice(2)}·` : ''}R${h.round}`);
  const series = kind === 'fame' ? [{ key: 'fame', name: 'Followers', short: 'FOL', color: '#00a396', bold: true, pts: hs.map((h) => num(h.fame, null)) }]
    : [{ key: 'image', name: 'Image', short: 'IMG', color: '#3d7bd9', bold: true, pts: hs.map((h) => num(h.image, null)) }, { key: 'heat', name: 'Heat', short: 'HEAT', color: '#e5484d', bold: false, pts: hs.map((h) => num(h.heat, null)) }, { key: 'appeal', name: 'Sponsor appeal', short: 'APP', color: '#d39b12', bold: false, pts: hs.map((h) => (h.appeal != null ? num(h.appeal, null) : null)) }];
  const seg = X ? '' : `<span class="hs-seg">${[['mood', 'Image · heat'], ['fame', 'Followers']].map(([k, n]) => `<button data-hch="pr:${k}" class="${k === kind ? 'hs-on' : ''}">${n}</button>`).join('')}</span>`;
  const maxH = (K.h || 600) - 46 - 74 - 30 - (K.own ? 46 : 0);
  const chart = `<div class="hs-card">${chartBox(K, `hs-pr-${kind}`, series, xs, kind === 'fame' ? { fmt: (v) => fameText(v) } : { int: true, fmt: (v) => String(Math.round(v)) }, clamp(maxH, 200, 330), 500)}</div>`;
  const M = P.manager, shares = pe?.shares || {};
  const side = `<div class="hs-card hs-persona"><span class="hs-lbl">How the public sees you</span><h4>${esc(pe?.name || 'Still finding a voice')}</h4><p>${esc(pe?.blurb || '')}</p>${Object.keys(PERSONA_N).map((k) => `<div class="hs-pr"><span>${PERSONA_N[k]}</span>${meter(num(shares[k]), k === 'controversial' ? '#e5484d' : k === 'showman' ? '#d39b12' : k === 'confident' ? '#3d7bd9' : '#1fae64')}<b>${Math.round(num(shares[k]) * 100)}%</b></div>`).join('')}
    <div class="hs-mg"><div><b>${esc(M ? M.name : 'No PR manager')}</b><small>${M ? `${esc(cap(M.style || ''))} · skill ${Math.round(num(M.skill) * 100)}% · ${cash(M.fee)} a round` : 'They soften the bad stories and sharpen the good'}</small></div><button class="hs-btn" data-hsub="pr:deals">${M ? 'DEALS ›' : 'HIRE ›'}</button></div></div>`;
  const main = X ? crisisCard(c, X) : `<div class="hs-pulse">${chart}${side}</div>`;
  return `${strip('Media · pulse', esc(pe?.name || 'Your public life'), `<span class="hs-chip${heat >= 45 ? ' r' : heat >= 20 ? ' a' : ''}">Heat <b>${esc(heatLabel(heat))}</b></span>${X && !X.positive ? '<span class="hs-chip r">A story wants an answer</span>' : ''}<span class="hs-grow"></span>${headSlot(seg)}`)}${tiles}${main}${X && !K.compact ? `<p class="hs-note">${esc(pe?.name || '')}${pe?.name ? ': ' : ''}${esc(pe?.blurb || '')}</p>` : ''}`;
}
function postsPage(c, S, K) {
  const P = c.pr || {}, L = safe(() => socialPosts(c), []) || [], used = P.lim && P.lim.key === rk(c) ? num(P.lim.posts) : 0, left = Math.max(0, 2 - used), quiet = L.some((x) => x.quiet);
  const cards = L.map((x) => {
    const tags = [x.quiet ? '<i class="b">No likes counted</i>' : '', !x.quiet && x.risk >= 0.3 ? `<i class="r">Risky · ${Math.round(x.risk * 100)}%</i>` : !x.quiet && x.risk >= 0.1 ? `<i class="a">Some risk</i>` : '', x.recent >= 2 ? '<i class="r">Third time: fans call it PR</i>' : x.recent === 1 ? '<i class="a">Half effect: posted lately</i>' : ''].filter(Boolean).join('');
    return `<button class="hs-post hs-hit" data-post="${esc(x.key)}"${x.ok ? '' : ` disabled title="${esc(x.why || '')}"`}><b>${esc(x.label)}</b><small class="hs-c2">${esc(x.desc || '')}</small>${tags ? `<span class="hs-tg">${tags}</span>` : ''}</button>`;
  }).join('');
  const R = (P.posts || []).slice(0, K.compact ? 3 : 5).map((p) => `<div class="hs-rp"><p>${esc(p.text)}</p><small>R${p.round}${p.season !== c.season ? ` ${p.season}` : ''} · ${p.quiet ? 'a quiet post' : `♥ ${likesTxt(num(p.likes))} · ${likesTxt(num(p.comments))} comments`}</small></div>`).join('');
  return `${strip('Media · social', `${fameText(P.fame)} followers on Chequered`, `<span class="hs-chip${left ? ' b' : ''}">${left ? `${plural(left, 'post')} left this round` : 'Two posts this round: done'}</span>${quiet ? '<span class="hs-chip">A quiet week</span>' : ''}`)}
    <div class="hs-postg"><div class="hs-posts">${cards || '<p class="hs-none">Nothing to post this week.</p>'}</div><div class="hs-card"><span class="hs-lbl">Your last posts</span>${R || '<p class="hs-none">Nothing posted yet.</p>'}</div></div>${quiet ? '<p class="hs-note">This week: a thank-you to the team and a quiet tribute. Nothing is counted, and nothing becomes a story.</p>' : ''}`;
}
const roundsLeft = (c, u) => (u && u.season != null ? Math.max(0, (u.season - c.season) * (c.rounds || 6) + (u.round - c.round) + 1) : 0);
function dealsPage(c, S, K) {
  const P = c.pr || {}, D = P.deals || [], O = P.offers || [], inc = D.reduce((a, d) => a + num(d.value), 0), M = P.manager, img = num(P.image, 10);
  const deals = `<div class="hs-deals">${Array.from({ length: 4 }, (_, i) => { const d = D[i]; if (!d) return '<div class="hs-card hs-deal free">A free slot</div>'; const near = img - num(d.minImage) < 8;
    return `<div class="hs-card hs-deal" style="--c:#d39b12" title="${esc((d.clauses || []).join(' '))}"><b>${esc(d.brand)}</b><small>${esc(cap(d.kind || ''))}</small><em>${cash(d.value)}<small> a round</small></em><small>${plural(roundsLeft(c, d.until), 'round')} left${d.bonus ? ` · ${cash(d.bonus)} a win` : ''}</small><small class="${near ? 'hs-d' : ''}">Image clause ${num(d.minImage)}${num(d.strikes) ? ` · ${plural(num(d.strikes), 'warning')}` : ''}</small></div>`; }).join('')}</div>`;
  let body;
  if (S.mgrs) {
    body = `<div class="hs-card"><div class="hs-lblrow" style="margin-top:0"><span class="hs-lbl">PR managers</span><button class="hs-link" data-hmgr="1">‹ The offers</button></div>${MANAGERS.map((m, i) => { const mine = M && M.name === m.name;
      return `<div class="hs-mrow"><b>${esc(m.name)}</b><span>${meter(m.skill, '#3d7bd9')}</span><small>${cash(m.fee)} a round</small><small title="${esc(m.blurb)}">${esc(cap(m.style))}: ${esc(m.blurb)}</small>${mine ? '<button class="hs-btn" data-mgrfire="1">LET GO</button>' : `<button class="hs-btn" data-mgr="${i}"${num(c.wallet) < m.fee ? ' disabled title="Not enough in your own account for the first round"' : ''}>HIRE</button>`}</div>`; }).join('')}</div>`;
  } else {
    const pg = pageOf(S, 'off', O.length, 3);
    const cards = O.slice(pg.from, pg.from + 3).map((o) => { const lowImg = img < num(o.minImage), full = D.length >= 4, same = D.find((d) => d.kind === o.kind), why = full ? 'Four deals is as many as you can fit' : same ? `Exclusive: you have a ${o.kind} deal with ${same.brand}` : lowImg ? `Your image is below their clause (${o.minImage})` : '';
      return `<div class="hs-card hs-offer"><div class="hs-offer-h"><b>${esc(o.brand)}</b><small>${esc(o.kind || '')}</small></div><em>${cash(o.value)}<small> a round · ${plural(num(o.rounds, 4), 'round')}${o.expires?.round != null ? ` · on offer until R${o.expires.round}` : ''}</small></em><p title="${esc(o.text || '')}">${esc(o.text || '')}</p><ul>${(o.clauses || []).slice(0, 2).map((x) => `<li title="${esc(x)}">${esc(x)}</li>`).join('')}${why ? `<li class="bad">${esc(why)}</li>` : ''}</ul><div class="hs-acts2"><button class="hs-btn go" data-dacc="${esc(o.id)}"${why ? ` disabled title="${esc(why)}"` : ''}>ACCEPT</button><button class="hs-btn" data-ddec="${esc(o.id)}">DECLINE</button></div></div>`; }).join('');
    body = `<div class="hs-lblrow" style="margin:0"><span class="hs-lbl">Offers on the table</span>${pager('off', pg)}</div>${cards ? `<div class="hs-offers">${cards}</div>` : '<div class="hs-card hs-empty"><b>No offers just now.</b><p>Brands come calling as your following grows and your image holds up. A PR manager who hustles turns up the odd extra one.</p></div>'}`;
  }
  const mg = `<div class="hs-card hs-mgrc"><span class="hs-ico" style="--c:#3d7bd9">✉</span><div><b>${esc(M ? `${M.name} handles your PR` : 'No PR manager')}</b><small>${M ? `Skill ${Math.round(num(M.skill) * 100)}% · ${cash(M.fee)} a round, from your endorsements first` : 'A manager softens image losses, words your answers and finds better deals.'}</small></div><button class="hs-btn" data-hmgr="1">${M ? 'CHANGE ›' : 'HIRE ›'}</button></div>`;
  return `${strip('Media · deals', `${cash(inc)} a round from ${plural(D.length, 'deal')}`, `<span class="hs-chip">${Math.round(num(DEAL_SPLIT.wallet, 0.7) * 100)}% to you · ${Math.round(num(DEAL_SPLIT.team, 0.3) * 100)}% to the team</span><span class="hs-chip">Appeal <b>${Math.round(num(P.appeal, 50))}</b> ${esc(appealLabel(P.appeal))}</span>`)}${deals}${body}${S.mgrs ? '' : mg}`;
}
const LIKE_N = { results: 'results', humility: 'humility', drama: 'drama', romance: 'romance', charity: 'charity', candour: 'candour' };
function pressPage(c, S, K) {
  const P = c.pr || {}, MD = P.media || {}, w = weekOf(c);
  const cards = OUTLETS.map((o) => {
    const v = Math.round(num(MD[o.id])), likes = Object.entries(o.likes || {}).filter(([, x]) => x >= 0.5).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => LIKE_N[k] || k);
    const st = o.id === 'feed' ? null : activityState(c, 'media', o.id), used = (w.media || []).includes(o.id);
    const btn = o.id === 'feed' ? '<small>The fans: they answer to your posts</small>' : `<small>${used ? 'Had their day this week' : esc(st?.ok ? `A media day: energy −${st.energy}` : st?.why || '')}</small><button class="hs-btn" data-act="media" data-arg="${esc(o.id)}" data-hret="pr"${!st?.ok || used ? ' disabled' : ''}>MEDIA DAY</button>`;
    return `<div class="hs-po" style="--c:${esc(o.color || '#6b7480')}" title="${esc(o.blurb || '')}"><span class="hs-out-h"><b>${esc(o.name)}</b><small>${esc(o.kind)}</small></span><span class="hs-out-p">${esc(o.id === 'feed' ? 'The platform where the fans have their say' : o.reporter || '')}${o.fickle ? ' · fair-weather' : ''}</span><span class="hs-out-r">${rap(v)}<em>${esc(relLabel(v))} ${sgn(v)}</em></span><span class="hs-tg">${likes.map((x) => `<i>Likes ${esc(x)}</i>`).join('')}</span><div class="hs-acts2">${btn}</div></div>`;
  }).join('');
  const best = OUTLETS.map((o) => [o, num(MD[o.id])]).sort((a, b) => b[1] - a[1])[0];
  return `${strip('Media · press', 'Where you stand with the press', best && best[1] > 0 ? `<span class="hs-chip g">Closest: <b>${esc(best[0].name)}</b></span>` : '')}<div class="hs-press">${cards}</div>`;
}
function newsPage(c, S, K) {
  const F = (c.pr?.feed || []).filter((h) => h && h.text), N = (c.news || []).filter((n) => n && n.text), per = K.per(52, 112, 1, 4, 9), pf = pageOf(S, 'feed', F.length, per), pn = pageOf(S, 'news', N.length, per);
  const hl = F.slice(pf.from, pf.from + per).map((h) => `<div class="hs-hl">${outletChip(h.outlet)}<p class="${h.tone < 0 ? 'n' : h.tone > 0 ? 'p' : ''}" title="${esc(h.text)}">${esc(h.text)} <small class="hs-sub">R${h.round}</small></p></div>`).join('');
  const nw = N.slice(pn.from, pn.from + per).map((n) => `<div class="hs-hl"><span class="hs-ot" style="--c:#8a93a0">R${n.round ?? '-'}</span><p title="${esc(n.text)}">${esc(n.text)}</p></div>`).join('');
  return `${strip('Media · news', 'The headlines and the paddock', `<span class="hs-chip">${plural(F.length, 'headline')}</span><span class="hs-chip">${plural(N.length, 'news line')}</span>`)}
    <div class="hs-news2"><div class="hs-card"><div class="hs-nh"><span class="hs-lbl">About you</span>${pager('feed', pf)}</div>${hl || '<p class="hs-none">No headlines yet: the press is waiting for your first race.</p>'}</div><div class="hs-card"><div class="hs-nh"><span class="hs-lbl">Paddock news</span>${pager('news', pn)}</div>${nw || '<p class="hs-none">Quiet so far.</p>'}</div></div>`;
}
/** PR & MEDIA (S.sub: '' pulse, 'posts', 'deals', 'press', 'news'; S.more: the old 'show everything' -> news) -> html */
export function prHTML(c, S = {}, H = {}) {
  return guardPage(() => {
    const K = kit(c, H), sub = S.more && !S.sub ? 'news' : subOf('pr', S, H);
    const body = sub === 'posts' ? postsPage(c, S, K) : sub === 'deals' ? dealsPage(c, S, K) : sub === 'press' ? pressPage(c, S, K) : sub === 'news' ? newsPage(c, S, K) : pulsePage(c, S, K);
    return page('pr', sub, `pr-${sub || 'pulse'}`, K, body, S);
  }, 'PR & MEDIA');
}

// ---- LIFE: partners and people -------------------------------------------------------------------------------------------
/** the women you are seeing (or who said yes to a date), your public partner first -> [ids] */
const romIds = (c) => {
  const B = c?.celebs?.bonds || {}, P = c?.celebs?.partner, w = (id) => (id === P ? 0 : B[id].stage === 'partner' ? 1 : B[id].stage === 'dating' ? 2 : 3);
  return Object.keys(B).filter((id) => CELEB[id] && involvedB(B[id])).sort((a, b) => w(a) - w(b) || num(B[b].aff) - num(B[a].aff));
};
const susOf = (v) => (v >= 75 ? ['High', 'r'] : v >= 50 ? ['Medium', 'a'] : v >= 25 ? ['Low', ''] : ['None', '']);
function ptnCard(c, id, S, K, X) {
  const C = CELEB[id], b = c.celebs.bonds[id], f = first(C.name), st = b.stage, together = st === 'dating' || st === 'partner';
  const idle = b.last ? ago(c, b.last) : 99, since = together && b.since && b.since.round != null ? ` · since R${b.since.round}${b.since.season !== c.season ? ` ${b.since.season}` : ''}` : '';
  const seen = `${!b.last ? 'Not seen yet' : idle <= 0 ? 'Seen this week' : idle === 1 ? 'Seen last round' : `Not seen for ${idle} rounds`}${since}`;
  const invHere = !!b.invited && b.invited.season === c.season && b.invited.round === c.round, other = X.invited.find((k) => k !== id);
  const invWhy = invHere ? `${f} is coming to the next race` : other ? `${first(CELEB[other].name)} is invited to this one` : X.hurt ? 'You are not racing this weekend' : X.banned ? 'You are suspended for this round' : c.round > c.rounds ? 'The season is over' : '';
  const offWhy = together ? safe(() => officialWhy(c, id), 'Not now') : `Arrange the first date with ${f} first`, armed = S.armed === `cbrk:${id}`;
  const sus = clamp(Math.round(num(b.suspicion)), 0, 100), [sl] = susOf(sus), showSus = together && (X.many || b.secret || sus > 0);
  const susT = `How sure ${f} is that there is someone else: ${sl.toLowerCase()}${b.susOf?.length ? ` (${b.susOf.map((k) => first(CELEB[k]?.name)).filter(Boolean).join(', ')})` : ''}${b.knows?.length ? `. She knows about ${b.knows.map((k) => first(CELEB[k]?.name)).filter(Boolean).join(', ')}` : ''}`;
  const sec = together ? `<div class="hs-seg hs-sec"><button data-csec="${esc(id)}|0" class="${b.secret ? '' : 'hs-on'}" title="Not hiding it: if anyone asks, you will not deny it">IN THE OPEN</button><button data-csec="${esc(id)}|1" class="${b.secret ? 'hs-on' : ''}"${b.public ? ' disabled title="The world already knows: there is no hiding it now"' : ''}>🔒 KEPT QUIET</button></div>`
    : `<div class="hs-sec-n">${esc(f)} said yes to a date: arrange it in THE WEEK.</div>`;
  const acts = K.calm
    ? `<button class="hs-btn" data-phone="c:${esc(id)}">TEXT</button><button class="hs-btn w2" data-cdate="${esc(id)}"${canDate(c, id) ? '' : ' disabled'}>A QUIET EVENING</button>`
    : `<button class="hs-btn" data-phone="c:${esc(id)}">TEXT</button><button class="hs-btn" data-cdate="${esc(id)}"${canDate(c, id) ? '' : ' disabled'}>DATE</button><button class="hs-btn" data-cinv="${esc(id)}"${invWhy ? ` disabled title="${esc(invWhy)}"` : ''}>${invHere ? 'INVITED ✓' : 'INVITE'}</button>
      <button class="hs-btn w2" data-coff="${esc(id)}"${offWhy ? ` disabled title="${esc(offWhy)}"` : ` title="${esc(st === 'dating' && b.secret ? 'Kept quiet: partners between the two of you' : 'The world will know')}"`}>${st === 'partner' && b.public ? 'OFFICIAL ✓' : st === 'partner' ? 'GO PUBLIC' : 'MAKE IT OFFICIAL'}</button><button class="hs-btn${armed ? ' hs-armed k-armed' : ''}" data-cbrk="${esc(id)}">${armed ? 'SURE? END IT' : 'END IT'}</button>`;
  const why1 = !K.calm && other && !invHere ? `<p class="hs-why1">${esc(first(CELEB[other].name))} is already invited to the next race.</p>` : '';
  const look = !K.calm && together && !safe(() => canStyle(c, id), 'x') ? `<button class="hs-btn hs-look" data-styopen="${esc(id)}" title="Her look: plan her hair, make-up and what she wears (LIFE › Style)">✦ LOOK</button>` : '';
  return `<div class="hs-card hs-ptn" style="--o:${esc(safe(() => styledColor(c, id), null) || C.look?.outfit || '#b8326b')}"><div class="hs-ptn-h">${celebAva(id, 'lg', c)}<div><b title="${esc(C.bio || '')}">${esc(C.name)}</b><small>${esc(C.job)} · ${C.age}</small>${stageChip(bondLabel(c, id), CSTAGE[st] || '#6b7480')}</div>${look}</div>${sec}
    <div class="hs-kv"><small>Affection</small>${rap(b.aff)}<b>${Math.round(num(b.aff))}</b></div><div class="hs-kv"><small>Trust</small>${meter(num(b.trust) / 100, '#3d7bd9')}<b>${Math.round(num(b.trust))}</b></div>
    ${showSus ? `<div class="hs-kv" title="${esc(susT)}"><small>Suspects</small>${meter(sus / 100, sus >= 75 ? '#e5484d' : sus >= 50 ? '#e39a1b' : '#9aa3ae')}<b class="${sus >= 75 ? 'hs-d' : ''}">${sus}</b></div>` : ''}
    <div class="hs-seen${idle >= 2 && b.last ? ' a' : ''}"><span>${esc(seen)}</span>${showSus && sus >= 25 ? `<span class="hs-sus ${sus >= 75 ? 'r' : sus >= 50 ? 'a' : ''}" title="${esc(susT)}">${esc(sl)}${b.susOf?.length ? ` · ${esc(b.susOf.map((k) => first(CELEB[k]?.name)).filter(Boolean).join(', '))}` : ''}</span>` : ''}</div>${why1}<div class="hs-ptn-a">${acts}</div></div>`;
}
function nextRow(c, K) {
  const B = c.celebs?.bonds || {}, P = c.celebs?.partner && CELEB[c.celebs.partner] ? c.celebs.partner : null, here = safe(() => seeingAtRace(c), []) || [], cells = [];
  const inv = Object.keys(B).filter((k) => CELEB[k] && B[k].invited && B[k].invited.season === c.season && B[k].invited.round === c.round);
  for (let r = c.round; r < c.round + 3 && r <= c.rounds; r++) {
    const ids = [...new Set(r === c.round ? [...here, ...inv] : P ? [P] : [])], rel = ids.filter((k) => involvedB(B[k])), clash = rel.length >= 2;
    const who = ids.map((k) => `${first(CELEB[k].name)}${k === P ? ' ♥' : inv.includes(k) ? ' (invited)' : ''}`).join(', ');
    const un = clash ? inv.find((k) => k !== P) : null;
    cells.push(`<div class="hs-nx${clash ? ' clash' : ''}"><small>R${r} · ${esc(trackName(c.calendar?.[r - 1]))}</small><b class="hs-c1" title="${esc(who)}">${esc(who || 'Nobody you are seeing')}</b>${clash ? `<span>Two of them on one grid${un ? `<button class="hs-btn" data-cuninv="${esc(un)}">UNINVITE ${esc(first(CELEB[un].name).toUpperCase())}</button>` : ''}</span>` : ''}</div>`);
  }
  if (!cells.length) return '';
  return `<div class="hs-next"><div class="hs-nx hs-nxl"><small>On the grid</small><b>The next races</b></div>${cells.join('')}</div>`;
}
const confCard = (c, cf) => {
  const C = CELEB[cf.id], O = (cf.otherIds || []).map((k) => first(CELEB[k]?.name)).filter(Boolean);
  return `<div class="hs-card hs-conf">${celebAva(cf.id, 'lg')}<small>${esc(first(C.name))} wants to talk</small><p>${esc(cf.text || `Who is ${O.join(' and ') || 'she'}?`)}</p><div class="hs-confo">${(cf.options || []).map((o) => `<button data-conf="${esc(o.key)}">${esc(o.label)}</button>`).join('')}</div><p class="hs-sub">${cf.kind === 'ultimatum' ? 'She wants an answer before long. Keep her waiting, and the papers may hear about it.' : 'She decides whether to stay. Leave it unanswered, and the silence is an answer of its own.'}</p></div>`;
};
function partnersPage(c, S, K) {
  const cs = c.celebs || {}, ids = romIds(c), cf = cs.confront && CELEB[cs.confront.id] ? cs.confront : null, R = safe(() => riskOf(c), { v: 0, label: 'None' }), w = weekOf(c), me = meOf(c), wal = num(c.wallet);
  const X = { many: ids.filter((k) => ['dating', 'partner'].includes(cs.bonds[k].stage)).length > 1, invited: Object.keys(cs.bonds || {}).filter((k) => CELEB[k] && cs.bonds[k].invited && cs.bonds[k].invited.season === c.season && cs.bonds[k].invited.round === c.round), hurt: hurtOf(c), banned: !!me && isBanned(c, me) };
  const invWhy = num(w.invested) >= 3 ? 'You have put $3M in this round already' : wal < 1 ? 'Needs $1M of your own' : '', donWhy = w.donated ? 'You have given this round already' : wal < 0.5 ? 'Needs $0.5M of your own' : '';
  const head = strip('Life · partners', `Own money ${cash(wal)}`, `<button class="hs-btn" data-winv="1"${invWhy ? ` disabled title="${esc(invWhy)}"` : ' title="$1M of your own money into the team\'s budget ($3M a round at most)"'}>INVEST $1M</button><button class="hs-btn" data-wdon="1"${donWhy ? ` disabled title="${esc(donWhy)}"` : ' title="$0.5M to a good cause, once a round"'}>DONATE $0.5M</button><span class="hs-grow"></span><span class="hs-chip">Seeing <b>${seeing(c).length}</b></span>${R.v ? `<span class="hs-chip${R.label === 'High' ? ' r' : R.label === 'Medium' ? ' a' : ''}" title="How likely you are to be found out">Risk of being found out: <b>${esc(R.label)}</b></span>` : ''}<button class="hs-btn" data-hlog="1">${S.log ? '‹ PARTNERS' : 'LOG ›'}</button>`);
  if (S.log) {
    const L = (cs.log || []).filter((x) => x && x.text), per = K.per(38, 120, 1, 4, 10), pg = pageOf(S, 'plog', L.length, per);
    return `${head}<div class="hs-card hs-plog"><div class="hs-lblrow" style="margin-top:0"><span class="hs-lbl">Your personal log</span>${pager('plog', pg)}</div>${L.slice(pg.from, pg.from + per).map((x) => `<div><small>R${x.round}</small>${CELEB[x.id] ? celebAva(x.id, 'sm') : '<span></span>'}<span class="${x.tone < 0 ? 'n' : x.tone > 0 ? 'p' : ''}" title="${esc(x.text)}">${esc(x.text)}</span></div>`).join('') || '<p class="hs-none">Nothing yet.</p>'}</div>`;
  }
  if (cf) return `${head}${confCard(c, cf)}`;
  if (!ids.length) return `${head}<div class="hs-card hs-empty"><b>Nobody yet.</b><p>${K.calm ? 'A quiet week. There will be time for this later.' : 'Meet people on the grid walk; talk well, and there may be a spark. Ask her out and the date is arranged in THE WEEK. Everyone you have met is on the People page.'}</p><div class="hs-acts2"><button class="hs-btn" data-hsub="life:people">PEOPLE ›</button></div></div>${nextRow(c, K)}`;
  const pg = pageOf(S, 'ptn', ids.length, 3);
  return `${head}<div class="hs-ptns">${ids.slice(pg.from, pg.from + 3).map((id) => ptnCard(c, id, S, K, X)).join('')}</div>${pg.pages > 1 ? `<div class="hs-acts2" style="justify-content:flex-end">${pager('ptn', pg)}</div>` : ''}${nextRow(c, K)}`;
}
function personCard(c, C, K, inv) {
  const b = peek(c, C.id), st = b?.stage || 'met', g = !!b?.grieving, msgd = b?.msgRound === rk(c), lab = safe(() => bondLabel(c, C.id), 'Just met');
  let prim = '';
  if (!g && !K.calm) {
    if (b?.accepted || st === 'dating' || st === 'partner') prim = `<button class="hs-btn" data-cdate="${esc(C.id)}"${canDate(c, C.id) ? '' : ' disabled'}>DATE</button>`;
    else if (st === 'flirting') { const why = safe(() => askOutWhy(c, C.id), 'Not now'); prim = `<button class="hs-btn go" data-cask="${esc(C.id)}"${why ? ` disabled title="${esc(why)}"` : ''}>ASK OUT</button>`; }
    else if (st === 'friendly') {
      const me = meOf(c), here = inv.includes(C.id), other = inv.find((k) => k !== C.id);
      const why = here ? `${first(C.name)} is coming to the next race` : other ? `${first(CELEB[other].name)} is invited to this one` : hurtOf(c) ? 'You are not racing this weekend' : me && isBanned(c, me) ? 'You are suspended for this round' : c.round > c.rounds ? 'The season is over' : '';
      prim = `<button class="hs-btn" data-cinv="${esc(C.id)}"${why ? ` disabled title="${esc(why)}"` : ' title="Invite her to the next race as your guest"'}>${here ? 'INVITED ✓' : 'INVITE'}</button>`;
    }
  }
  const line = g ? '<span>Has asked for privacy</span>' : `${stageChip(lab, CSTAGE[st] || '#6b7480')}${rap(b?.aff || 0)}`;
  return `<div class="hs-card hs-pc${g ? ' grief' : ''}" title="${esc(`${C.vibe || ''}. ${C.bio || ''}`)}"><div class="hs-pc-h">${celebAva(C.id, '', c)}<div><b>${esc(C.name)}</b><small>${esc(C.job)} · ${esc(oftenText(C))}</small></div></div><div class="hs-pc-s">${line}</div>
    <div class="hs-pc-a">${prim}${K.calm && !g ? '<button class="hs-btn" data-phone="c:' + esc(C.id) + '" title="A quiet week: only kind words on the phone">TEXT</button>'
    : `<button class="hs-btn" data-cmsg="${esc(C.id)}"${msgd ? ' disabled title="One message a week"' : ''}>${msgd ? 'MESSAGED' : g ? 'A KIND WORD' : 'MESSAGE'}</button><button class="hs-btn ph" data-phone="c:${esc(C.id)}" title="Open the chat on your phone">✆</button>`}</div></div>`;
}
function peoplePage(c, S, K) {
  const cs = c.celebs || {}, B = cs.bonds || {}, M = new Set(cs.met || []), met = CELEBS.filter((C) => (B[C.id] && B[C.id].stage !== 'stranger') || M.has(C.id));
  const order = ['partner', 'dating', 'flirting', 'friendly', 'met', 'ex'], rank = (C) => (B[C.id]?.grieving ? 9 : Math.max(0, order.indexOf(B[C.id]?.stage || 'met')));
  const L = [...met.sort((a, b) => rank(a) - rank(b) || num(B[b.id]?.aff) - num(B[a.id]?.aff)), ...CELEBS.filter((C) => !met.includes(C))], per = K.per(132, 58, 4, 2, 12), pg = pageOf(S, 'ppl', L.length, per);
  const inv = Object.keys(B).filter((k) => CELEB[k] && B[k].invited && B[k].invited.season === c.season && B[k].invited.round === c.round);
  const cards = L.slice(pg.from, pg.from + per).map((C) => (met.includes(C) ? personCard(c, C, K, inv) :`<div class="hs-card hs-pc q"><div class="hs-pc-h"><span class="hs-ava q">?</span><div><b>Not met yet</b><small>${esc(C.job)}</small></div></div><div class="hs-pc-s"><span class="hs-sub">${esc(oftenText(C))}</span></div><div class="hs-pc-a"><span class="hs-sub">A guest on the grid some weekends</span></div></div>`)).join('');
  return `${strip('Life · people', `${met.length} of ${CELEBS.length} met`, `<span class="hs-chip">Seeing <b>${seeing(c).length}</b></span><span class="hs-grow"></span>${headSlot(pager('ppl', pg))}`)}<div class="hs-pg">${cards}</div>`;
}
/** LIFE (S.sub: '' partners, 'style' (her looks: ui/HubStyle.js), 'people'; S.log: the personal log) -> html */
export function lifeHTML(c, S = {}, H = {}) {
  return guardPage(() => {
    const K = kit(c, H), sub = subOf('life', S, H), me = meOf(c);
    if (!me || !alive(me)) return page('life', sub, 'life', K, noDriver(), S);
    if (sub === 'style') return page('life', sub, 'style', K, styleHTML(c, S, { ...H, calm: K.calm }), S);
    return page('life', sub, sub === 'people' ? 'people' : 'ptns', K, sub === 'people' ? peoplePage(c, S, K) : partnersPage(c, S, K), S);
  }, 'LIFE');
}

// ---- the PADDOCK: friends, an evening out, invitations ----------------------------------------------------------------------
const FLT = [['friends', 'Friends'], ['mate', 'Team-mate'], ['grid', 'Grid'], ['rivals', 'Rivals']], SRT = [['friendship', 'Friendship'], ['rapport', 'Rapport'], ['team', 'Team']];
/** a friendship to show without storing one (Social.friendOf would keep it): the level a first meeting would start from */
const looseFriend = (c, d, mate) => { const lv = clamp(Math.round(4 + Math.max(0, num(c.rapport?.[d.id])) * 0.25 + (mate && d.id === mate.id ? 8 : 0)), 0, 30); return { level: lv, stage: friendStage(lv), last: null, hangouts: 0, texts: 0, met: false, tastes: tastesOf(d.id), loose: true }; };
function frCard(c, d, f, K, CT, mate, sel) {
  const t = c.teams?.[d.team], col = K.ink(t?.color || '#8a93a0'), st = f.stage || friendStage(f.level), r = Math.round(num(c.rapport?.[d.id]));
  const seen = f.last ? `Seen R${f.last.round}${f.hangouts ? ` · ${plural(f.hangouts, 'evening')} out` : ''}` : f.met ? 'Met on the grid' : 'Not met yet';
  return `<div class="hs-card hs-fc${sel ? ' sel' : ''}" style="--c:${col}"><button class="hs-fcb" data-hfr="${esc(d.id)}" title="${esc(`${d.name}: the details`)}">${faceOf(K, d, t)}<span class="hs-fcn"><b>${esc(d.name)}</b><small>${esc(d.team || d.from || '')}${mate && d.id === mate.id ? ' · team-mate' : ''}</small></span>${stageChip(stageName(st), FCOL[st])}</button>
    <div class="hs-fcm">${pips5(st, FCOL[st])}${rap(r)}<em class="${r > 0 ? 'hs-u' : r < 0 ? 'hs-d' : ''}" title="Rapport: ${esc(rapLabel(r))}">${sgn(r)}</em></div><div class="hs-tastes">${(Array.isArray(f.tastes) && f.tastes.length ? f.tastes : tastesOf(d.id)).map((x) => `<span>${esc(tasteText(x))}</span>`).join('')}</div>
    <div class="hs-fca"><small>${esc(seen)}</small>${CT.has(`d:${d.id}`) ? `<button class="hs-btn" data-phone="d:${esc(d.id)}">TEXT</button>` : ''}<button class="hs-btn" data-hhang="${esc(d.id)}">${K.calm ? 'COFFEE' : 'HANG OUT'}</button></div></div>`;
}
function frDrawer(c, d, f, K, CT) {
  const t = c.teams?.[d.team], col = K.ink(t?.color || '#8a93a0'), st = f.stage || friendStage(f.level), nx = FNEXT[st], r = Math.round(num(c.rapport?.[d.id]));
  const fav = (safe(() => friendFavours(c), []) || []).filter((x) => x.did === d.id).slice(0, 2), log = (c.social?.log || []).filter((x) => x && String(x.text || '').includes(d.name)).slice(0, 3);
  return `<div class="hs-drawer" style="--c:${col}"><div class="hs-drawer-h">${faceOf(K, d, t)}<div><b>${esc(d.name)}</b><small>${esc(d.team || d.from || '')}${d.number ? ` · #${d.number}` : ''}</small></div><button class="hs-x" data-hfr="none" title="Close">✕</button></div>
    <div class="hs-drawer-b"><div class="hs-kv2"><span class="hs-lbl">Friendship</span><b>${esc(stageName(st))} · ${Math.round(num(f.level))}</b></div>${meter(num(f.level) / 100, FCOL[st])}<p class="hs-sub">${nx ? `${Math.max(1, nx[0] - Math.round(num(f.level)))} more to ${nx[1]}` : 'As close as it gets in the paddock'}${f.loose ? ' · not met properly yet' : ''}</p>
      <div class="hs-kv2"><span class="hs-lbl">Rapport</span><b>${esc(rapLabel(r))} ${sgn(r)}</b></div>${rap(r)}
      <div class="hs-tastes">${(Array.isArray(f.tastes) && f.tastes.length ? f.tastes : tastesOf(d.id)).map((x) => `<span>${esc(tasteText(x))}</span>`).join('')}</div><p class="hs-sub">Tastes are the game's guess at a good evening, not facts about the driver.</p>
      <div class="hs-facts">${fact('Evenings out', num(f.hangouts))}${fact('Texts', num(f.texts))}${fact('Met', f.metAt ? `R${f.metAt.round}` : f.met ? 'Yes' : 'Not yet')}${fact('Last seen', f.last ? `R${f.last.round}` : '-')}</div>
      ${fav.length ? `<div class="hs-fav">${fav.map((x) => `<div title="${esc(x.text)}">${esc(x.text)}</div>`).join('')}</div>` : ''}${log.length ? `<div class="hs-dlog">${log.map((x) => `<div title="${esc(x.text)}"><small>R${x.round}</small>${esc(x.text)}</div>`).join('')}</div>` : ''}</div>
    <div class="hs-drawer-f">${CT.has(`d:${d.id}`) ? `<button class="hs-btn" data-phone="d:${esc(d.id)}">TEXT</button>` : '<span class="hs-sub">Talk on the grid to swap numbers</span>'}<span class="hs-grow"></span><button class="hs-btn go" data-hhang="${esc(d.id)}">${K.calm ? 'A QUIET COFFEE' : 'HANG OUT'} →</button></div></div>`;
}
function paddockPage(c, S, K) {
  const pid = c.playerId, mate = mateOf(c), FR = c.social?.friends || {}, has = (k, L) => L.some(([x]) => x === k), rp = (id) => num(c.rapport?.[id]);
  const fl = has(S.hfl, FLT) ? S.hfl : has(S.filter, FLT) ? S.filter : 'friends', so = has(S.hso, SRT) ? S.hso : has(S.sort, SRT) ? S.sort : 'friendship';
  const recOf = (d) => FR[d.id] || looseFriend(c, d, mate), lvl = (d) => num(recOf(d).level);
  const L = Object.values(c.drivers || {}).filter((d) => alive(d) && d.id !== pid).filter((d) => (fl === 'mate' ? !!mate && d.id === mate.id : fl === 'grid' ? !!d.team : fl === 'rivals' ? rp(d.id) < -8 : (!!mate && d.id === mate.id) || (!!FR[d.id] && (FR[d.id].met || num(FR[d.id].level) >= 15))))
    .sort(so === 'rapport' ? (a, b) => rp(b.id) - rp(a.id) : so === 'team' ? (a, b) => String(a.team || '~').localeCompare(String(b.team || '~')) || lvl(b) - lvl(a) : (a, b) => lvl(b) - lvl(a) || rp(b.id) - rp(a.id));
  const per = K.per(144, 58, 3, 2, 9), pg = pageOf(S, 'fr', L.length, per), CT = new Set((safe(() => contactsOf(c), []) || []).map((x) => x.cid)), sel = S.fr && c.drivers?.[S.fr] && alive(c.drivers[S.fr]) ? c.drivers[S.fr] : null;
  const segs = `<span class="hs-seg">${FLT.map(([k, n]) => `<button data-hflt="${k}" class="${k === fl ? 'hs-on' : ''}">${n}</button>`).join('')}</span><span class="hs-seg">${SRT.map(([k, n]) => `<button data-hsrt="${k}" class="${k === so ? 'hs-on' : ''}">${n}</button>`).join('')}</span>`;
  const empty = { friends: 'No friends in the paddock yet. Talk to the drivers on the grid walk: a good talk is the start of it.', mate: 'No team-mate just now.', grid: 'Nobody on the grid.', rivals: 'Nobody you have fallen out with. Long may it last.' }[fl];
  const cards = L.slice(pg.from, pg.from + per).map((d) => frCard(c, d, recOf(d), K, CT, mate, sel && sel.id === d.id)).join('');
  return `<div class="hs-phead">${segs}<span class="hs-grow"></span>${headSlot(pager('fr', pg))}</div>${cards ? `<div class="hs-fg">${cards}</div>` : `<div class="hs-card hs-empty"><b>${esc(empty)}</b>${fl !== 'grid' ? '<div class="hs-acts2"><button class="hs-btn" data-hflt="grid">THE WHOLE GRID ›</button></div>' : ''}</div>`}${sel ? frDrawer(c, sel, recOf(sel), K, CT) : ''}`;
}
const venueTag = (v) => (v.where ? `${trackName(v.where)} week only` : '');
const privTxt = (p) => (p >= 0.85 ? 'Very private' : p >= 0.6 ? 'Fairly private' : p >= 0.4 ? 'Some eyes' : 'Very public');
/** who could come to this evening as well (her stage, the venue, three at most) -> a reason they cannot, or '' */
const guestWhy = (c, x, hg, hv, K) => {
  if (hg.includes(x.cid)) return '';
  if (hg.length >= 3) return 'Three at most';
  if (x.kind === 'celeb') { const b = peek(c, x.cid.slice(2)); if (K.calm) return 'Not this week'; if (!b || b.grieving) return 'Not now'; if (b.stage === 'ex') return 'Not ready for that'; if (b.stage === 'met' || b.stage === 'stranger') return 'Get to know her better first'; }
  if (!hv) return '';
  return (safe(() => venuesFor(c, [...hg, x.cid]), []) || []).find((y) => y.venue.id === hv)?.why || '';
};
const subCid = (c, x) => {
  if (x.kind === 'celeb') return safe(() => bondLabel(c, x.cid.slice(2)), x.sub || '');
  const f = c.social?.friends?.[x.cid.slice(2)];
  return `${stageName(f?.stage || x.stage || 'acquaintance')} · ${x.sub || ''}`;
};
function planPage(c, S, K) {
  // (two of the women you are seeing asked to the same evening: each will notice the other)
  const roomWarn = (L) => { const rel = L.filter((x) => x.startsWith('c:') && involvedB(peek(c, x.slice(2)))); return rel.length >= 2 ? `<div class="hs-wl r">Risky: ${esc(rel.map((x) => first(CELEB[x.slice(2)]?.name)).join(' and '))} in the same room. They will each notice the other.</div>` : ''; };
  const hv = VENUE_BY_ID[S.hv] ? S.hv : null, hg = (Array.isArray(S.hg) ? S.hg : []).filter((x) => /^[dc]:/.test(String(x)) && (x.startsWith('c:') ? !!CELEB[x.slice(2)] : alive(c.drivers?.[x.slice(2)])));
  let st = clamp(Math.round(num(+S.step, 1)) || 1, 1, 3); if (!hv) st = 1; if (st === 3 && !hg.length) st = 2;
  const steps = stepper('social', st, [['Where', true], ['Who', !!hv], ['Go', !!hv && hg.length > 0]]), V = hv ? VENUE_BY_ID[hv] : null, w = weekOf(c);
  const titles = ['Where to?', 'Who is coming?', 'Send the invitations'], left = Math.max(0, w.slots - w.used.length);
  const head = strip(`Life · ${K.calm ? 'a quiet coffee' : 'an evening out'}`, esc(titles[st - 1]), `${V ? `<span class="hs-chip">${esc(V.name)}</span>` : ''}${hg.length ? `<span class="hs-chip">${plural(hg.length, 'guest')}</span>` : ''}<span class="hs-grow"></span>${headSlot(steps)}`);
  const foot = `<div class="hs-foot">${st > 1 ? `<button class="hs-btn" data-hst="social:${st - 1}">‹ BACK</button>` : ''}<span class="hs-grow"></span>${st < 3 ? `<button class="hs-btn go" data-hst="social:${st + 1}"${(st === 1 && !hv) || (st === 2 && !hg.length) ? ' disabled' : ''}>NEXT ›</button>` : ''}</div>`;
  let body = '';
  if (st === 1) {
    const L = (safe(() => venuesFor(c, hg), []) || []).filter((x) => !/week only/.test(x.why || '') && (!K.calm || x.venue.quiet));
    body = `<div class="hs-vens">${L.map(({ venue: v, why, fit }) => { const g = VGLYPH[v.id] || VGLYPH.simlounge, p = num(v.privacy, 0.5);
      return `<button class="hs-ven hs-hit${v.id === hv ? ' hs-sel' : ''}" data-hv="${esc(v.id)}"${why ? ` disabled title="${esc(why)}"` : ''}><span class="hs-ven-h">${glyph(g)}<b class="hs-c1">${esc(v.name)}</b>${v.scene !== false ? '<i class="hs-3d" title="Played out in 3D">3D</i>' : ''}</span><p class="hs-c2" title="${esc(v.blurb || '')}">${esc(v.blurb || '')}</p>
        <span class="hs-ven-c"><span class="${p >= 0.6 ? 'g' : p < 0.4 ? 'r' : ''}" title="How unlikely a long lens is">${privTxt(p)}</span><span>${costTxt(v.cost)}</span><span>Energy ${num(v.energy)}</span>${(v.games || []).length ? `<span>${esc(v.games.map(cap).join(' · '))}</span>` : ''}${venueTag(v) ? `<span class="b">${esc(venueTag(v))}</span>` : ''}${fit ? `<span class="g">${esc(fit)}</span>` : ''}${why ? `<span class="r">${esc(why)}</span>` : ''}</span></button>`; }).join('')}</div>`;
    if (!L.length) body = '<div class="hs-card hs-empty"><b>Nowhere to go this week.</b></div>';
  } else if (st === 2) {
    const all = (safe(() => contactsOf(c), []) || []).filter((x) => x.kind === 'driver' || (x.kind === 'celeb' && !K.calm && !peek(c, x.cid.slice(2))?.grieving && peek(c, x.cid.slice(2))?.stage !== 'ex'));
    const L = [...hg.map((cid) => all.find((x) => x.cid === cid) || { cid, kind: cid.startsWith('c:') ? 'celeb' : 'driver', name: nameOfCid(c, cid), sub: '' }), ...all.filter((x) => !hg.includes(x.cid))];
    const per = K.per(61, 160, 3, 3, 12), pg = pageOf(S, 'who', L.length, per);
    body = `<div class="hs-lblrow" style="margin:0"><span class="hs-lbl">Up to three: drivers, or people you know</span>${pager('who', pg)}</div><div class="hs-whos">${L.slice(pg.from, pg.from + per).map((x) => { const on = hg.includes(x.cid), why = guestWhy(c, x, hg, hv, K);
      return `<button class="hs-wc${on ? ' hs-sel' : ''}" data-hg="${esc(x.cid)}"${why ? ` disabled title="${esc(why)}"` : ''}>${avaCid(c, x.cid, K)}<span><b>${esc(x.name)}</b><small>${esc(why || subCid(c, x))}</small></span><i>${on ? '✓' : '+'}</i></button>`; }).join('') || '<p class="hs-none">Nobody in your phone yet: talk to people on the grid walk.</p>'}</div>${roomWarn(hg)}`;
  } else {
    const why = (safe(() => venuesFor(c, hg), []) || []).find((y) => y.venue.id === hv)?.why || '', cel = hg.filter((x) => x.startsWith('c:')), R = safe(() => riskOf(c), { label: 'None' });
    const lens = cel.length ? Math.max(0, ...cel.map((x) => num(safe(() => photoRisk(c, x.slice(2), num(V.privacy, 0.5)), 0)))) : null;
    const res = S.hres ? `<div class="hs-res ${S.hres.ok ? 'ok' : 'no'}">${esc(S.hres.text || '')}</div>` : '';
    const ready = S.hres?.inv ? hangoutsReady(c).filter((h) => h.invite === S.hres.inv) : [];
    const sent = !!S.hres && !!S.hres.inv;
    const sendBtn = sent ? '' : `<button class="hs-btn go" data-hsend="1"${why || !hg.length ? ` disabled title="${esc(why || 'Pick someone first')}"` : ''}>SEND ${hg.length > 1 ? 'THE INVITATIONS' : 'THE INVITATION'} →</button>`;
    body = `<div class="hs-go3"><div class="hs-card"><div class="hs-cf-h">${glyph(VGLYPH[hv] || VGLYPH.simlounge)}<div><small>${esc(privTxt(num(V.privacy, 0.5)))}${venueTag(V) ? ` · ${esc(venueTag(V))}` : ''}</small><b>${esc(V.name)}</b></div></div><p class="hs-sub hs-c2" style="margin:8px 0 0">${esc(V.blurb || '')}</p>
        <div class="hs-gs">${hg.map((x) => `<span>${avaCid(c, x, K)}${esc(nameOfCid(c, x))}</span>`).join('')}</div>${roomWarn(hg)}${why ? `<div class="hs-wl r">${esc(why)}.</div>` : ''}${res}
        <div class="hs-cfa">${sendBtn}${ready.map((h) => bookBtns(c, h, 'social')).join('')}${sent ? '<button class="hs-btn" data-hst="social:1">PLAN ANOTHER</button>' : ''}</div></div>
      <div class="hs-card"><span class="hs-lbl">The evening</span><div class="hs-facts">${fact('This week', left ? `${left} slots` : 'Full', 'it takes one when booked', !left)}${fact('Energy', num(V.energy), `${w.energy} left`, num(V.energy) > num(w.energy))}${fact('Cost', costTxt(V.cost), `${cash(c.wallet)} of your own`, num(c.wallet) < num(V.cost))}${fact('Long lens', lens != null ? `${Math.round(lens * 100)}%` : privTxt(num(V.privacy, 0.5)), lens != null ? 'chance of a photograph' : 'only drivers: a caption at most', lens >= 0.3)}</div>
        ${cel.length && seeing(c).length > 1 ? `<div class="hs-wl">Risk of being found out: ${esc(R.label)}.</div>` : ''}<p class="hs-sub" style="margin-top:8px">${K.calm ? 'A quiet coffee: no cameras, no story.' : 'A yes can be booked here or later in THE WEEK. Then play the evening in 3D, or skip it and hear how it went.'}</p></div></div>`;
  }
  return `${head}${body}${foot}`;
}
const STATUS = { pending: 'Waiting', accepted: 'Accepted', declined: 'Declined', expired: 'Lapsed', lapsed: 'Lapsed', done: 'Booked' };
function invitesPage(c, S, K) {
  const I = (Array.isArray(c.social?.invites) ? c.social.invites : []).filter((v) => v && v.id != null).slice().reverse(), inc = I.filter((v) => v.to === 'me'), out = I.filter((v) => v.from === 'me');
  const per = K.per(68, 112, 1, 3, 6), pi = pageOf(S, 'inc', inc.length, per), po = pageOf(S, 'out', out.length, per), ready = hangoutsReady(c).filter((h) => !h.why).length;
  const live = (v) => v.status === 'pending' && ago(c, v) <= 0;
  const stTxt = (v) => { const s = v.status === 'pending' && !live(v) ? 'expired' : v.status; return `<span class="hs-st ${esc(s)}">${esc(STATUS[s] || cap(s))}</span>`; };
  const rowIn = (v) => { const V = VENUE_BY_ID[v.venue];
    return `<div class="hs-ir">${avaCid(c, v.from, K)}<div><b>${esc(nameOfCid(c, v.from))}</b> <small class="hs-sub">· ${esc(V?.name || 'an evening out')} · R${v.round}</small><p title="${esc(v.msg || '')}">${esc(v.msg || '')}</p></div><div>${stTxt(v)}${live(v) ? `<span><button class="hs-btn go" data-hans="${esc(v.id)}|1">ACCEPT</button><button class="hs-btn" data-hans="${esc(v.id)}|0">DECLINE</button></span>` : ''}</div></div>`; };
  const rowOut = (v) => { const V = VENUE_BY_ID[v.venue], asked = (v.asked || v.guests || [v.to]).filter(Boolean), no = new Set(v.declined || []);
    return `<div class="hs-ir">${glyph(VGLYPH[v.venue] || VGLYPH.simlounge, 'sm')}<div><b>${esc(V?.name || 'An evening out')}</b> <small class="hs-sub">· R${v.round}</small><p>${asked.map((x) => `${esc(first(nameOfCid(c, x)))} ${no.has(x) || v.status === 'declined' ? '✕' : v.status === 'pending' ? '…' : '✓'}`).join(' · ')}</p></div><div>${stTxt(v)}</div></div>`; };
  return `${strip('Life · invitations', `${inc.filter(live).length ? plural(inc.filter(live).length, 'invitation') + ' waiting' : 'Nothing waiting for an answer'}`, `<span class="hs-grow"></span>${ready ? `<span class="hs-chip g">${plural(ready, 'evening')} to book</span><button class="hs-btn go" data-act="hangout">BOOK IN THE WEEK ›</button>` : '<button class="hs-btn" data-hsub="social:hangout">MAKE PLANS ›</button>'}`)}
    <div class="hs-inv2"><div class="hs-card"><div class="hs-nh"><span class="hs-lbl">To you</span>${pager('inc', pi)}</div>${inc.slice(pi.from, pi.from + per).map(rowIn).join('') || '<p class="hs-none">Nobody has asked you out yet. Friends do after a race, now and then.</p>'}</div>
      <div class="hs-card"><div class="hs-nh"><span class="hs-lbl">From you</span>${pager('out', po)}</div>${out.slice(po.from, po.from + per).map(rowOut).join('') || '<p class="hs-none">You have not asked anyone yet.</p>'}</div></div>`;
}
/** the PADDOCK (S.sub: '' paddock (S.hfl, S.hso, S.fr), 'hangout' (S.step 1..3, S.hv, S.hg, S.hres), 'invites') -> html */
export function socialHTML(c, S = {}, H = {}) {
  return guardPage(() => {
    const K = kit(c, H), sub = subOf('social', S, H), me = meOf(c);
    if (!me || !alive(me)) return page('social', sub, 'social', K, noDriver(), S);
    return page('social', sub, sub === 'hangout' ? 'plan' : sub === 'invites' ? 'inv' : 'paddock', K, sub === 'hangout' ? planPage(c, S, K) : sub === 'invites' ? invitesPage(c, S, K) : paddockPage(c, S, K), S);
  }, 'PADDOCK');
}

// ---- the overview, the side card, the race report ---------------------------------------------------------------------------
/**
 * The briefing's own tiles beside the hub's four: Morale, then Public image - or Licence points instead once there are
 * six or more (or a ban waits), so the row stays at six (count-up keys mor, img, lic) -> html
 */
export function overviewTiles(c, H = {}) {
  return safe(() => {
    const me = meOf(c); if (!me || !alive(me)) return '';
    const m = moodOf(me), F = formOf(m), lab = moraleLabel(m.morale), P = c.pr || {}, img = Math.round(num(P.image, 10)), pts = activePoints(c, me), bt = banText(c, me), E = activeEntries(c, me);
    const mor = `<div class="tile hs-tile"><small>Morale</small><b><span data-n="mor" data-v="${m.morale}">${m.morale}</span><em class="hs-tl" style="--c:${MOR_COL[lab]}">${esc(lab)}</em></b><span>Form: ${esc(F.label.toLowerCase())}</span></div>`;
    if (pts >= 6 || bt) return `${mor}<div class="tile hs-tile"><small>Licence points</small><b><span data-n="lic" data-v="${pts}">${pts}</span><i class="hs-of">/${LICENCE_MAX}</i></b><span title="${esc(bt || '')}">${esc(bt || (E[0] ? `${pointsLabel(pts)} · next off before R${E[0].expires.round}` : pointsLabel(pts)))}</span></div>`;
    return `${mor}<div class="tile hs-tile"><small>Public image</small><b><span data-n="img" data-v="${img}">${img}</span><em class="hs-tl">${esc(imageLabel(img))}</em></b><span>${fameText(P.fame)} followers · ${esc(heatLabel(P.heat).toLowerCase())}</span></div>`;
  }, '');
}
/**
 * The briefing's alert rows, most urgent first -> [{ level: 'crisis'|'warn'|'info', icon, text, key, act: { label, tab, sub,
 * data (the button's data-* attributes: socialClick routes them) }, drawer? (the crisis card with its answers) }]
 */
export function overviewAlerts(c, H = {}) {
  return safe(() => {
    const out = [], me = meOf(c); if (!c || !me || !alive(me)) return out;
    const X = crisisOf(c), cs = c.celebs || {}, cf = cs.confront && CELEB[cs.confront.id] ? cs.confront : null, pts = activePoints(c, me), bt = banText(c, me), hurt = hurtOf(c), on = c.round <= c.rounds, w = on ? weekOf(c) : null, calm = H?.calm != null ? !!H.calm : graveOf(c);
    const go = (label, tab, sub = '', data = null) => ({ label, tab, sub, data: data || { hsub: `${tab}:${sub || 'main'}` } });
    if (X) out.push({ level: X.positive ? 'info' : 'crisis', icon: X.positive ? '★' : '!', key: 'crisis', text: X.positive ? `A moment to use: ${X.title}.` : `The press wants an answer: ${X.title}.`, act: go('RESPOND', 'pr'), drawer: crisisCard(c, X, 'overview') });
    if (bt) out.push({ level: 'warn', icon: '⊘', key: 'ban', text: isBanned(c, me) ? `${me.name} is suspended for this round (12 penalty points): a stand-in takes the seat.` : `${bt}: twelve penalty points within twelve months.`, act: go('LICENCE', 'you', 'licence') });
    else if (pts >= 9) out.push({ level: 'warn', icon: '!', key: 'points', text: `${pts} of ${LICENCE_MAX} penalty points: one more offence could bring a one-race ban.`, act: go('LICENCE', 'you', 'licence') });
    if (cf) out.push({ level: 'warn', icon: '♥', key: 'confront', text: cf.kind === 'ultimatum' ? `${first(CELEB[cf.id].name)} wants an answer: her, or ${(cf.otherIds || []).map((k) => first(CELEB[k]?.name)).filter(Boolean).join(' and ') || 'the others'}.` : `${first(CELEB[cf.id].name)} wants to talk: she has found out about ${(cf.otherIds || []).map((k) => first(CELEB[k]?.name)).filter(Boolean).join(' and ') || 'someone'}.`, act: go('TALK', 'life') });
    for (const id of safe(() => seeing(c), []) || []) {
      const b = cs.bonds?.[id], f = first(CELEB[id]?.name); if (!b || !f || cf?.id === id) continue;
      if (num(b.upset) >= 2) out.push({ level: 'warn', icon: '♥', key: `upset-${id}`, text: `${f} is upset: things have to change, or it is over.`, act: go('LIFE', 'life') });
      else if (num(b.upset) >= 1) out.push({ level: 'info', icon: '♥', key: `upset-${id}`, text: `${f} is a little put out: some time together would help.`, act: go('LIFE', 'life') });
      else if (!calm && num(b.suspicion) >= 50) out.push({ level: 'info', icon: '?', key: `sus-${id}`, text: `${f} has been asking questions.`, act: go('LIFE', 'life') });
    }
    if (w && !hurt && num(w.energy, 80) <= 20) out.push({ level: 'warn', icon: '☾', key: 'energy', text: `Exhausted (${w.energy} energy): rest before the race, or arrive running on empty (focus −6).`, act: go('THE WEEK', 'week') });
    // (the night after the race - career/Party.js: the invitations still open (the hub's TONIGHT sheet: data-a 'tonight'),
    //  a sponsor met there with an offer on the table, and a hangover that took a slot)
    if (!calm) {
      const offers = party('partyOffers', [], c) || [], gp = c.party?.race?.gp || 'race';
      if (offers.length) out.push({ level: 'info', icon: '♫', key: 'tonight', text: offers.length > 1 ? `Tonight after the ${gp}: ${offers.length} invitations waiting.` : `Tonight after the ${gp}: ${offers[0].title || 'an invitation'}.`, act: go('TONIGHT', 'overview', '', { a: 'tonight' }) });
      for (const o of (c.pr?.offers || []).filter((x) => x && /party/i.test(String(x.why || x.via || ''))).slice(0, 1)) out.push({ level: 'info', icon: '$', key: `poffer-${o.id}`, text: `Sponsor offer from ${o.brand} (met at the party).`, act: go('DEALS', 'pr', 'deals') });
    }
    const hg = hangOf(c);
    if (w && hg && (hg.slot || num(hg.H) >= 0.6)) out.push({ level: 'warn', icon: '☾', key: 'hangover', text: `Hangover: ${hg.slot === 'iv' ? 'slot 1 is the IV clinic' : 'slot 1 recovery'}${num(hg.energy) ? `, energy ${sgn(-Math.abs(num(hg.energy)))}` : ''}.`, act: go('THE WEEK', 'week') });
    if (w && !hurt && !w.sponsorDone) out.push({ level: 'warn', icon: '$', key: 'sponsor', text: 'Contractual sponsor day not done (appeal −6 if skipped).', act: go('THE WEEK', 'week') });
    if (!calm) {
      const inv = (c.social?.invites || []).filter((v) => v && v.to === 'me' && v.status === 'pending' && ago(c, v) <= 0);
      if (inv.length) out.push({ level: 'info', icon: '✆', key: 'invites', text: inv.length > 1 ? `${plural(inv.length, 'invitation')} waiting for an answer.` : `${nameOfCid(c, inv[0].from)} has asked you out: ${(VENUE_BY_ID[inv[0].venue]?.name || 'an evening out').toLowerCase()}.`, act: go('ANSWER', 'social', 'invites') });
    }
    const R = on ? hangoutsReady(c).filter((h) => !h.why) : [];
    if (R.length) out.push({ level: 'info', icon: '☕', key: 'book', text: `${R[0].name} with ${R[0].names.map(first).join(' and ')}: said yes, waiting to be booked.`, act: go('BOOK', 'week', '', { act: 'hangout' }) });
    for (const t of (safe(() => friendFavours(c), []) || []).filter((x) => x.kind === 'tip').slice(0, 1)) out.push({ level: 'info', icon: '✎', key: `tip-${t.did}`, text: t.text, act: go('PADDOCK', 'social') });
    return out;
  }, []);
}
/** the alerts as .warn blocks (the pending crisis with its answers inline, so it can be answered from here) -> html */
export function overviewWarnings(c, H = {}) {
  return overviewAlerts(c, H).map((a) => {
    const X = a.key === 'crisis' ? crisisOf(c) : null;
    const opts = X ? `<div class="hs-warn-o">${X.options.map((o) => `<button data-crisis="${esc(o.key)}" data-hret="overview" title="${esc(o.hint || '')}">${esc(o.label)}</button>`).join('')}</div>` : '';
    return `<div class="warn hs-warn lv-${a.level}"><i class="hs-warn-i">${esc(a.icon)}</i><span class="hs-warn-t">${esc(a.text)}</span>${X ? '' : `<button class="hs-btn"${dataAttrs(a.act.data)}>${esc(a.act.label)} ›</button>`}${opts}</div>`;
  }).join('');
}
/** the side card's contents for a section (wrap it in the hub's .ch-side): DRIVER, THE WEEK, MEDIA, LIFE -> html ('' for none) */
export function socialSide(c, tab = '', H = {}) {
  return safe(() => {
    const me = meOf(c); if (!c || !me || !alive(me)) return '';
    const P = c.pr || {}, m = moodOf(me);
    if (tab === 'you') return `<h3>YOU</h3><div class="big">${esc(moraleLabel(m.morale))} · ${m.morale}</div><div class="row2"><span>Form</span><b>${esc(formOf(m).label)}</b></div><div class="row2"><span>Licence</span><b>${activePoints(c, me)}/${LICENCE_MAX}</b></div>`;
    if (tab === 'pr') return `<h3>MEDIA</h3><div class="big">${esc(imageLabel(P.image))}</div><div class="row2"><span>Image</span><b>${sgn(P.image)}</b></div><div class="row2"><span>Heat</span><b>${esc(heatLabel(P.heat))}</b></div><div class="row2"><span>Followers</span><b>${fameText(P.fame)}</b></div>`;
    if (tab === 'week') { const w = weekOf(c); return `<h3>THE WEEK</h3><div class="big">${plural(Math.max(0, w.slots - w.used.length), 'slot')} left</div><div class="row2"><span>Energy</span><b>${w.energy} · ${esc(energyLabel(w.energy))}</b></div>`; }
    if (tab === 'life' || tab === 'social') return `<h3>LIFE</h3><div class="big">${cash(c.wallet)}</div><div class="row2"><span>Unread texts</span><b>${unreadCount(c)}</b></div><div class="row2"><span>Seeing</span><b>${seeing(c).length || '-'}</b></div>`;
    return '';
  }, '');
}
/** what the race report can say beyond the result, from c.report (old reports without these fields: what the records hold) */
const repData = (c) => {
  const R = c?.report; if (!R || typeof R !== 'object') return null;
  const me = meOf(c), pid = c.playerId, rnd = R.round, M = R.morale && typeof R.morale === 'object' ? R.morale : null, at = (x) => x && x.season === c.season && x.round === rnd;
  const mv = (v) => (typeof v === 'number' ? v : v && typeof v === 'object' ? num(v.morale ?? v[pid], null) : null);
  const item = (x) => (typeof x === 'string' ? { t: x, d: 0 } : x && (x.why || x.text) ? { t: x.why || x.text, d: num(x.d) } : null);
  const why = (M && Array.isArray(M.why) ? M.why : (me?.moodWhy || []).filter(at)).map(item).filter(Boolean).slice(0, 5);
  const PRr = R.pr && typeof R.pr === 'object' ? R.pr : null, hl = (x) => (typeof x === 'string' ? { text: x, outlet: null, tone: 0 } : x && x.text ? x : null);
  const heads = (PRr && Array.isArray(PRr.headlines) ? PRr.headlines : (c.pr?.feed || []).filter(at)).map(hl).filter(Boolean).slice(0, 3);
  const pts = (Array.isArray(R.points) ? R.points : (me?.licence || []).filter(at)).filter((x) => x && num(x.pts) > 0).map((x) => ({ pts: num(x.pts), why: x.why || x.reason || 'an offence' }));
  const grave = R.grave != null ? !!R.grave : (!!c.pr?.ctx?.grave && (c.pr.ctx.round == null || c.pr.ctx.round === rnd || c.pr.ctx.round === c.round)) || (c.lost || []).some(at);
  return { round: rnd, before: M ? mv(M.before) : null, after: M ? mv(M.after) : me ? num(me.morale, null) : null, why, img: PRr && typeof PRr.image === 'number' ? PRr.image : null, fame: PRr && typeof PRr.fame === 'number' ? PRr.fame : null, heads, pts, life: (Array.isArray(R.life) ? R.life : []).filter((x) => typeof x === 'string' && x).slice(0, 5), ban: typeof R.ban === 'string' ? R.ban : null, grave };
};
const formStep = (D) => `<div class="hs-rx"><div class="hs-rxm">${D.before != null ? `<b>${D.before}</b><i>→</i>` : ''}<b>${D.after ?? '-'}</b><span>${D.after != null ? esc(moraleLabel(D.after)) : ''}${D.before != null && D.after != null ? ` · <span class="${D.after > D.before ? 'hs-u' : D.after < D.before ? 'hs-d' : ''}">${sgn(D.after - D.before)}</span> this round` : ''}</span></div>
  <div class="hs-rxl">${D.why.map((x) => `<div><small class="${x.d > 0 ? 'hs-u' : x.d < 0 ? 'hs-d' : ''}">${x.d ? sgn(x.d) : '·'}</small>${esc(x.t)}</div>`).join('') || '<div>A weekend that left your morale where it was.</div>'}</div></div>`;
const mediaStep = (D) => `<div class="hs-rx"><div class="hs-rx3"><div class="hs-rxt"><small>Image</small><b class="${num(D.img) > 0 ? 'hs-u' : num(D.img) < 0 ? 'hs-d' : ''}">${D.img != null ? sgn(D.img) : '-'}</b></div><div class="hs-rxt"><small>Followers</small><b>${D.fame != null ? `${D.fame >= 0 ? '+' : '−'}${fameText(Math.abs(D.fame))}` : '-'}</b></div><div class="hs-rxt"><small>Headlines</small><b>${D.heads.length}</b></div></div>
  <div class="hs-rxl">${D.heads.map((h) => `<div>${h.outlet ? `${outletChip(h.outlet)} ` : ''}${esc(h.text)}</div>`).join('') || '<div>The press kept it to the result.</div>'}</div></div>`;
// (the ban itself is on the report's first page, the hub's: here only the points that led to it)
const lifeStep = (D) => `<div class="hs-rx">${D.pts.length ? `<div class="hs-rxl">${D.pts.map((p) => `<div><small class="hs-d">+${p.pts}</small>${plural(p.pts, 'penalty point')}: ${esc(p.why)}</div>`).join('')}</div>` : ''}
  ${D.life.length ? `<div class="hs-rxl">${D.life.map((t) => `<div>${esc(t)}</div>`).join('')}</div>` : ''}</div>`;
const quietStep = (D) => `<div class="hs-rx m-calm hs-calm"><div class="hs-rxm"><b>${D.after ?? '-'}</b><span>Morale${D.before != null && D.after != null && D.after !== D.before ? ` · ${sgn(D.after - D.before)}` : ''}</span></div>${D.life.length ? `<div class="hs-rxl">${D.life.map((t) => `<div>${esc(t)}</div>`).join('')}</div>` : ''}<p class="hs-sub">A weekend for the people who matter. Nothing else needs saying here.</p></div>`;
/** the race report's extra steps after the result: Form, Media, Licence & life (a grave round: one quiet step) -> [{ key, title, html }] */
export function reportSteps(c, H = {}) {
  return safe(() => {
    const D = repData(c); if (!D) return [];
    if (D.grave) return [{ key: 'quiet', title: 'The paddock', html: quietStep(D) }];
    const out = [];
    if (D.before != null || D.why.length) out.push({ key: 'form', title: 'Form', html: formStep(D) });
    if (D.img != null || D.fame != null || D.heads.length) out.push({ key: 'media', title: 'Media', html: mediaStep(D) });
    if (D.pts.length || D.life.length) out.push({ key: 'life', title: 'Licence & life', html: lifeStep(D) });
    return out;
  }, []);
}
/** the same in one block for a single-page report: morale, image, penalty points, a headline or two, the week's lines -> html */
export function reportExtra(c, H = {}) {
  return safe(() => {
    const D = repData(c); if (!D) return '';
    if (D.grave) return quietStep(D);
    const mor = D.after != null ? `${D.before != null ? `${D.before} → ` : ''}${D.after}` : '-', pp = D.pts.reduce((a, p) => a + p.pts, 0);
    return `<div class="hs-rx"><div class="hs-rx3"><div class="hs-rxt"><small>Morale</small><b>${mor}</b></div><div class="hs-rxt"><small>Image</small><b class="${num(D.img) > 0 ? 'hs-u' : num(D.img) < 0 ? 'hs-d' : ''}">${D.img != null ? sgn(D.img) : '-'}</b></div><div class="hs-rxt"><small>Penalty points</small><b class="${pp ? 'hs-d' : ''}">${pp ? `+${pp}` : 'None'}</b></div></div>
      ${D.ban ? `<div class="hs-wl r">${esc(D.ban)}</div>` : ''}${D.heads.length || D.life.length ? `<div class="hs-rxl">${D.heads.slice(0, 2).map((h) => `<div>${h.outlet ? `${outletChip(h.outlet)} ` : ''}${esc(h.text)}</div>`).join('')}${D.life.slice(0, 3).map((t) => `<div>${esc(t)}</div>`).join('')}</div>` : ''}</div>`;
  }, '');
}

// ---- the clicks ----------------------------------------------------------------------------------------------------------------
// (which tab each pager belongs to)
const PG_TAB = { ent: 'you', feed: 'pr', news: 'pr', off: 'pr', ptn: 'life', ppl: 'life', plog: 'life', fr: 'social', who: 'social', inc: 'social', out: 'social' };
/** a 3D evening skipped: summed up at once (Social.autoHangout; a night after a race: Party.autoParty) and applied -> the lines it brought */
const skipped = (c, L) => safe(() => {
  if (L?.key === 'party') return (party('autoParty', null, c, L.partyId)?.lines || []).join(' ');
  const r = autoHangout(c, L.venue, L.guests || []), h = hangoutResult(c, r); return (h?.lines || []).join(' ');
}, '');
/**
 * Every button on these pages (and the overview's alerts): the week's activities and its steps (act / arg, wback, wdk,
 * hst, hskip), the crisis (crisis), posts, deals and the manager (post, dacc, ddec, mgr, mgrfire, hmgr), wallet (winv,
 * wdon), relationships (cmsg, cinv, cuninv, coff, cbrk (armed twice through S.armed), cask, cdate, csec, conf), the
 * paddock and the planner (hflt, hsrt, hfr, hhang, hv, hg, hsend, hans), paging and views (hpg, hsub, hch, hmore, hlog)
 * and the phone (phone). hret names the tab to come back to; a null tab keeps the hub on the page it is on (a crisis
 * answered from a drawer). Saves after anything that changed the career -> null (not ours) | { tab, S, region?, launch?
 * (an evening booked: the hub offers to play it or sum it up) } | { phone: true, cid, S }
 */
export function socialClick(c, ds, S = {}) {
  if (!ds || !c) return null;
  // (her looks, LIFE › Style: its own page module - most of its clicks are done there, in place)
  if (Object.keys(ds).some((k) => k.startsWith('sty'))) { try { return styleClick(c, ds, S); } catch (e) { console.warn('HubSocial: the style click failed', e); return null; } }
  try {
    const has = (k) => ds[k] != null && ds[k] !== '', base = { ...S, msg: null, armed: null }, ret = has('hret') ? ds.hret : null;
    const out = (tab, s, extra = {}) => ({ tab, S: s, ...extra });
    const done = (tab, r, s = base) => { save(c); return out(ret || tab, { ...s, msg: r?.msg || r?.text || null }); };
    const wk0 = (s) => ({ ...s, pick: null, step: null, celeb: null, dk: null });
    const plan0 = (s) => ({ ...s, sub: 'hangout', step: 1, hv: null, hg: [], hres: null });
    // the phone, and moving between pages
    if (has('phone')) return { phone: true, cid: /^[dcx]:/.test(ds.phone) ? ds.phone : null, S: base };
    if (has('hsub')) { const [t, s] = String(ds.hsub).split(':'); return out(t || 'overview', { sub: !s || s === 'main' ? '' : s }); }
    if (has('hhang')) return out('social', { sub: 'hangout', step: 1, hg: [`d:${ds.hhang}`], hv: null, hres: null });
    if (has('hpg')) {
      const [k, n] = String(ds.hpg).split(':'), p = Math.max(0, Math.round(+n || 0));
      return out(PG_TAB[k] || 'social', MAIN_PG.has(k) ? { ...base, page: p } : { ...base, pgs: { ...(S.pgs || {}), [k]: p } });
    }
    if (has('hflt')) return out('social', { ...base, sub: '', hfl: ds.hflt, filter: null, page: 0 });
    if (has('hsrt')) return out('social', { ...base, sub: '', hso: ds.hsrt, sort: null, page: 0 });
    if (has('hfr')) return out('social', { ...base, fr: ds.hfr === 'none' ? null : ds.hfr });
    if (has('hmore')) return out(ds.hmore || 'you', { ...base, allWhy: !S.allWhy });
    if (has('hch')) { const [t, k] = String(ds.hch).split(':'); return out(t, { ...base, [t === 'pr' ? 'pch' : 'ych']: k }); }
    if (has('hlog')) return out('life', { ...base, log: !S.log, page: 0 });
    if (has('hmgr')) return out('pr', { ...base, sub: 'deals', mgrs: !S.mgrs });
    if (has('hst')) { const [t, n] = String(ds.hst).split(':'); return out(t || 'week', { ...base, step: clamp(Math.round(+n) || 1, 1, 3), ...(t === 'social' && +n === 1 && S.hres?.inv ? { hres: null, hg: [], hv: null } : {}) }); }
    // THE WEEK
    if (has('wback')) return out('week', wk0(base));
    if (has('wdk')) { const [id, k] = String(ds.wdk).split('|'); return out('week', { ...base, sub: '', pick: 'date', celeb: id, dk: k, step: 3 }); }
    // (into a step of THE WEEK from anywhere: a fresh week state, nothing carried over from the page it was opened on)
    if (has('cdate')) return out('week', { sub: '', pick: 'date', celeb: ds.cdate, dk: null, step: 2 });
    if (has('act')) {
      const key = ds.act, arg = has('arg') ? ds.arg : null;
      if (arg == null && DRILL[key]) return out('week', { sub: '', pick: key, step: key === 'date' ? 1 : null });
      const r = doActivity(c, key, arg), back = ret === 'social' ? plan0 : wk0;
      if (r.ok && r.launch && has('hskip')) { const t = skipped(c, r.launch); save(c); return out(ret || 'week', { ...back(base), msg: `${r.text} ${t}`.trim() }); }
      save(c);
      if (r.ok && r.launch) return out(ret || 'week', { ...back(base), msg: r.text }, { launch: r.launch });
      if (!ret && !S.pick) return out('week', { ...base, msg: r.text }, { region: ['energy', 'slots', 'cards'] });
      return out(ret || 'week', { ...(r.ok ? back(base) : base), msg: r.text });
    }
    // the planner and the invitations
    if (has('hv')) return out('social', { ...base, sub: 'hangout', hv: ds.hv, step: 2, hres: null, page: 0 });
    if (has('hg')) {
      const L = [...(Array.isArray(S.hg) ? S.hg : [])], i = L.indexOf(ds.hg); if (i >= 0) L.splice(i, 1); else if (L.length < 3) L.push(ds.hg);
      return out('social', { ...base, sub: 'hangout', hg: L, step: 2, hres: null });
    }
    if (has('hsend')) { const r = inviteOut(c, Array.isArray(S.hg) ? S.hg : [], S.hv); save(c); return out('social', { ...base, sub: 'hangout', step: 3, hres: { ok: !!r?.ok, text: r?.text || '', inv: r?.invite?.id ?? null } }); }
    if (has('hans')) { const [id, a] = String(ds.hans).split('|'); return done('social', respondInvite(c, id, a === '1')); }
    // your own money
    if (has('winv')) return done('life', investInTeam(c));
    if (has('wdon')) return done('life', donate(c));
    // relationships
    if (has('cmsg')) return done('life', message(c, ds.cmsg));
    if (has('cinv')) return done('life', invite(c, ds.cinv));
    if (has('cuninv')) return done('life', uninvite(c, ds.cuninv));
    if (has('cask')) return done('life', askOut(c, ds.cask));
    if (has('coff')) { const r = makeOfficial(c, ds.coff); if (r?.ok) award(c); return done('life', r); }
    if (has('csec')) { const [id, on] = String(ds.csec).split('|'); return done('life', setSecret(c, id, on === '1')); }
    if (has('cbrk')) {
      const k = `cbrk:${ds.cbrk}`; if (S.armed !== k) return out(ret || 'life', { ...base, armed: k });
      return done('life', breakUp(c, ds.cbrk));
    }
    if (has('conf')) return done('life', resolveConfront(c, ds.conf));
    // the press
    if (has('crisis')) {
      // (answered where it was asked: the pulse, the briefing, the hub's drawer - no tab, and the hub stays on its page)
      const r = resolveCrisis(c, ds.crisis);
      if (r?.d?.trust && r.d.celeb) safe(() => trustCeleb(c, r.d.celeb, r.d.trust));
      return done(null, r);
    }
    if (has('post')) return done('pr', postSocial(c, ds.post));
    if (has('dacc')) { const r = acceptDeal(c, ds.dacc); if (r?.ok) award(c); return done('pr', r); }
    if (has('ddec')) return done('pr', declineDeal(c, ds.ddec));
    if (has('mgr')) { const r = hireManager(c, +ds.mgr); return done('pr', r, { ...base, mgrs: !r?.ok }); }
    if (has('mgrfire')) return done('pr', fireManager(c));
    return null;
  } catch (e) {
    console.warn('HubSocial: click failed', e);
    return null;
  }
}
