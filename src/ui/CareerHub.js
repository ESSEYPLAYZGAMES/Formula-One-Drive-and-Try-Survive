// The championship career's screens, bright and open over a real 3D showroom: your team's car on a turntable in a
// white studio (its own small WebGL view: the team's livery, the driver's helmet, the team's name on the wall), the
// camera moving to what each screen is about - the front wing for aerodynamics, the brakes, the cockpit for your
// drivers. Over it, one frame that stays put between races: a bar along the top (who you are, the points, the money,
// your phone, the race), a rail of seven sections down the left - the race week, the team, your driver, your life, the
// media, the season, In Memoriam - and a panel whose sub-tabs pick the page; only the page itself changes, sliding in
// the way you went (up and down between sections, sideways between sub-pages and steps), sized to the window so nothing
// has to scroll. The pages: the weekend's briefing and the calendar, the week between races, the tech tree and the
// factory, your drivers and the market, your form and licence, partners, friends in the paddock and evenings out, the
// public eye, the standings and charts, the trophy room, and In Memoriam (the studio dims, the strings play). A new
// career (who you are, then the season); the round's report when you come back from a race, a step at a time. And the
// mourning screen when your driver is killed: black and white, the helmet, the name, the starts.
import * as THREE from 'three';
import { Career, askOf, rapportLabel, RAPPORT_NAME, DISTANCES, TROPHIES } from '../career/Career.js';
import { techEffects } from '../career/TechTree.js';
import { moodOf, moraleLabel, moraleBand, formOf } from '../career/Morale.js';
import { isBanned, activePoints } from '../career/Licence.js';
import { imageLabel, heatLabel, fameText } from '../career/PR.js';
import { hangoutResult, autoHangout } from '../career/Social.js';
import { CarMesh } from '../vehicle/CarMesh.js';
import { makePerson, makeHelmet, bloodPool } from '../world/People.js';
import { showNegotiation } from './Negotiation.js';
import { mourning3D } from './Mourning3D.js';
import { TECH_CSS, techHTML, techSide, techClick, techView } from './HubTech.js';
import * as HS from './HubSocial.js';
import { showPhone, phoneBadge } from './Phone.js';
import { showHangout } from './Hangout.js';
// (her looks, LIFE › Style: the page's preview in this studio)
import { styleStage, styleLeave, styleFlush } from './HubStyle.js';
import { ensureMotion, setReduced, swap, patch, indicator, seg, countAll, later, curtain, toast, arm, drawer, popover, keys, open as mOpen, close as mClose, page as mPage } from './Motion.js';
// (your own look: the creator's step, the hub's Look tab, and the registries every scene draws you from)
import * as Avatar from '../career/Avatar.js';
import * as PPL from '../world/People.js';
import { baseLook, setDriverLook, clearDriverLooks, lookStamp } from '../world/People.js';
import { helmetDesign, helmetTexture, setHelmetDesign, clearHelmetDesigns } from '../world/HelmetDesigns.js';
import { LOOK_CSS, lookEditorHTML, lookTabsHTML, lookCamHTML, wireLookEditor } from './LookEditor.js';
// (the night after a race: career/Party.js decides the offers and settles the night; ui/PartyCards.js draws TONIGHT and
// the morning after over the hub)
import * as Party from '../career/Party.js';
import { showTonight, showMorning, partySheetUp } from './PartyCards.js';
import { affectionResult } from '../career/AffectionResult.js';
import { papsFallout } from './PapsConfront.js';

const CSS = `
#career { position: fixed; inset: 0; z-index: 40; overflow: hidden; background: #eef1f5; color: #151a22; font-family: var(--k-font, 'Segoe UI', Roboto, Arial, sans-serif); --tc: #e10600;
  --top: 56px; --pad: 12px; --rail: 88px; --gap: 10px; --row: 34px; --tile-h: 76px; --fs: 13.5px; }
@media (max-height: 800px) { #career { --top: 48px; --pad: 10px; --gap: 8px; --row: 32px; --tile-h: 72px; } }
@media (max-height: 700px) { #career { --row: 28px; --tile-h: 60px; --gap: 6px; --fs: 12.5px; } }
@media (min-width: 1600px) and (min-height: 900px) { #career { --pad: 16px; --rail: 96px; --gap: 12px; --row: 38px; --tile-h: 88px; } }
@media (min-width: 900px) and (max-width: 1199px) { #career { --rail: 64px; } }
#career .row { margin: 0; } #career .row > span:first-child { width: auto; color: inherit; font-size: inherit; letter-spacing: normal; text-transform: none; }
#career .bar { margin: 0; display: block; } #career .chip { display: block; min-width: 0; } #career .chip small { color: inherit; }
#career button.chip.on, #career button.pick.on { background: #fff; color: #151a22; } #career .seg { border: none; }
#career .ch-3d { position: absolute; inset: 0; width: 100%; height: 100%; display: block; transition: opacity var(--m-base, 220ms) ease; }
#career .ch-ui { position: absolute; inset: 0; pointer-events: none; transition: opacity var(--m-base, 220ms) ease, transform var(--m-base, 220ms) ease; }
#career .ch-ui > * { pointer-events: auto; }
#career.away .ch-ui { opacity: 0; transform: scale(.98); } #career.away .ch-3d { opacity: 0; }
#career.away .ch-ui, #career.away .ch-ui * { pointer-events: none !important; }
#career .glass { background: rgba(250,251,253,.94); border: 1px solid rgba(255,255,255,.9); box-shadow: 0 10px 30px rgba(25,35,60,.10), inset 0 1px 0 #fff; border-radius: 18px; }
html.k-glass #career .ch-top { background: rgba(250,251,253,.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
#career button { position: relative; font: 700 12px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .08em; color: #1d2430; background: #fff; border: 1px solid #d6dbe3; padding: 10px 14px; border-radius: 10px; cursor: pointer; transition: transform var(--m-press, 80ms) var(--ease-out, ease), background-color .12s, border-color .12s, color .12s; }
#career button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(25,35,60,.12); border-color: #b9c1cc; }
#career button:active:not(:disabled) { transform: scale(.97); }
#career button:disabled { opacity: .45; cursor: default; }
#career button.go { background: #e10600; border-color: #e10600; color: #fff; box-shadow: none; text-shadow: none; animation: none; }
#career button.go:hover:not(:disabled) { background: #f0150c; }
#career button.on { background: #151a22; border-color: #151a22; color: #fff; }
#career .ch-ico em, #career .ch-rail > button em, #career .k-seg > button em, #career .ht, #career .seat .st-nm b em { font-style: normal; }

#career .ch-top { position: absolute; left: var(--pad); right: var(--pad); top: var(--pad); height: var(--top); display: flex; align-items: center; gap: 10px; padding: 6px 10px 6px 8px; border-radius: 16px; }
#career .ch-badge { width: calc(var(--top) - 14px); height: calc(var(--top) - 14px); border-radius: 11px; background: var(--tc); color: #fff; display: flex; align-items: center; justify-content: center; font: 900 16px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); box-shadow: inset 0 -3px 0 rgba(0,0,0,.18); flex: none; }
#career .ch-title { flex: 1; min-width: 0; }
#career .ch-title h1 { margin: 0; font: 800 16px/1.1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .1em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .ch-title small { display: block; color: #5d6675; font-size: 12px; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .ch-pills { display: flex; gap: 6px; flex: none; }
#career .ch-pill { padding: 7px 10px; border-radius: 999px; background: rgba(21,26,34,.06); font: 600 12px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); color: #303845; white-space: nowrap; font-variant-numeric: tabular-nums; }
#career .ch-pill b, #career .ch-pill i { color: #151a22; font-style: normal; font-weight: 800; }
#career .ch-pill.w { background: color-mix(in srgb, var(--tc) 10%, #fff); }
#career .ch-ico { flex: none; width: 38px; height: 34px; padding: 0; display: grid; place-items: center; font: 400 17px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: 0; }
#career .ch-ico em { position: absolute; top: -5px; right: -5px; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 9px; background: #e5484d; color: #fff; font: 800 10px/17px var(--k-font, 'Segoe UI', Arial, sans-serif); text-align: center; letter-spacing: 0; }
#career .ch-race { display: flex; flex: none; }
#career .ch-race button { height: 34px; }
#career .ch-race .ch-go { border-radius: 10px 0 0 10px; padding: 0 14px; }
#career .ch-race .ch-caret { width: 30px; padding: 0; border-radius: 0 10px 10px 0; border-left: 1px solid rgba(255,255,255,.4); font-size: 11px; }
#career .ch-race > button:only-child { border-radius: 10px; }
#career .ch-top > button[data-a="close"] { height: 34px; padding: 0 12px; flex: none; }

#career .ch-rail, #career .ch-nav { position: absolute; left: var(--pad); top: calc(var(--top) + 2 * var(--pad)); bottom: var(--pad); width: var(--rail); display: flex; flex-direction: column; gap: 4px; padding: 8px 6px; overflow: hidden; }
#career .ch-rail > button, #career .ch-nav > button { position: relative; z-index: 1; flex: none; height: 64px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; padding: 0 2px; border: 0; background: transparent; border-radius: 12px; color: #4a5361; font: 700 10.5px/1.1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .07em; text-align: center; }
#career .ch-rail > button:hover:not(:disabled), #career .ch-nav > button:hover:not(:disabled) { background: rgba(21,26,34,.04); box-shadow: none; transform: none; }
#career .ch-rail > button i, #career .ch-nav > button i { font-style: normal; font-size: 19px; line-height: 22px; height: 22px; opacity: .85; }
#career .ch-rail > button.on { color: #151a22; background: transparent; }
#career .ch-nav:not(.ch-rail) > button.on { background: #fff; color: #151a22; box-shadow: 0 4px 14px rgba(25,35,60,.10); }
#career .ch-rail > button em { position: absolute; top: 6px; right: 7px; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 8px; background: var(--tc); color: #fff; font: 800 9.5px/16px var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: 0; }
#career .ch-rail > button[data-sec="lost"] em { background: #6b6f76; }
#career .ch-rail .ind { position: absolute; z-index: 0; left: 6px; right: 6px; top: 0; height: 64px; border-radius: 12px; background: #fff; box-shadow: 0 6px 18px rgba(25,35,60,.12); transition: transform var(--m-base, 220ms) var(--ease-io, ease); pointer-events: none; }
#career .ch-rail .ind::before { content: ''; position: absolute; left: 0; top: 14px; bottom: 14px; width: 3px; border-radius: 2px; background: var(--tc); }
#career .ch-rail .sp { flex: 1; } #career .ch-rail .dv { flex: none; height: 1px; margin: 0 10px; background: rgba(21,26,34,.08); }
@media (min-width: 900px) and (max-width: 1199px) { #career .ch-rail > button { height: 52px; font-size: 0; gap: 0; } #career .ch-rail .ind { height: 52px; } }

#career .ch-panel { position: absolute; left: calc(var(--rail) + 2 * var(--pad)); top: calc(var(--top) + 2 * var(--pad)); bottom: var(--pad); width: clamp(600px, calc(100vw - var(--rail) - 3 * var(--pad) - 440px), 940px); display: flex; flex-direction: column; overflow: hidden; padding: 12px 18px 14px; }
#career .ch-panel > .in { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
#career .ch-head { flex: none; height: 40px; display: flex; align-items: center; gap: 12px; margin-bottom: 10px; min-width: 0; }
#career .ch-sub { flex: 0 1 auto; max-width: 620px; min-width: 0; }
#career .ch-sub.single { display: none; }
#career .k-seg > button { background: none; border: 0; box-shadow: none; padding: 0 12px; min-height: 30px; border-radius: 9px; color: var(--k-dim, #6b7482); font: 600 12px/1.1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .01em; transition: color var(--m-fast, 140ms); }
#career .k-seg > button:hover:not(:disabled) { transform: none; box-shadow: none; color: #151a22; }
#career .k-seg > button.on, #career .k-seg > button.on:hover { background: none; border: 0; color: var(--k-seg-on-fg, #151a22); }
#career .ch-sub > button { min-height: 34px; padding: 0 10px; font-size: 12.5px; }
#career .k-seg > button em { display: inline-block; margin-left: 5px; min-width: 15px; height: 15px; padding: 0 4px; border-radius: 8px; background: var(--tc); color: #fff; font: 800 9.5px/15px var(--k-font, 'Segoe UI', Arial, sans-serif); vertical-align: 1px; }
#career .ch-head .slot { flex: 1; min-width: 0; display: flex; justify-content: flex-end; align-items: center; gap: 8px; }
#career .ch-head .slot > * { min-width: 0; }
#career .ch-pages { position: relative; flex: 1; min-height: 0; display: grid; grid-template-rows: minmax(0, 1fr); grid-template-columns: minmax(0, 1fr); }
#career .ch-pages > .m-page { display: flex; flex-direction: column; gap: var(--gap); height: 100%; min-height: 0; overflow: hidden; }
#career.short .ch-pages > .m-page { overflow-y: auto; overscroll-behavior: contain; }
#career .ch-pages.m-calm .m-swap { animation: m-fade var(--m-calm, 700ms) ease both; }
#career .ch-side { position: absolute; top: calc(var(--top) + 2 * var(--pad)); right: var(--pad); width: 240px; max-height: 172px; overflow: hidden; padding: 12px 14px; transition: opacity var(--m-fast, 140ms), transform var(--m-fast, 140ms); }
#career .ch-side.k-hide { opacity: 0; transform: translate3d(12px, 0, 0); pointer-events: none; }
#career .ch-side.k-narrow { display: none; }
#career .ch-side h3 { margin: 0 0 6px; font: 800 11px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .16em; color: #5d6675; }
#career .ch-side .big { font: 800 17px/1.15 var(--k-font, 'Segoe UI', Arial, sans-serif); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .ch-side .row2 { display: flex; justify-content: space-between; gap: 8px; margin-top: 6px; font-size: 12.5px; color: #3a4350; }
#career .ch-side .row2 b { text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .ch-side .tt-side div:nth-child(n+3) { display: none; }
#career .ch-modal-host { position: absolute; inset: 0; z-index: 5; pointer-events: none !important; }
#career .ch-modal-host > * { pointer-events: auto; }
#career.boot { animation: m-fade var(--m-base, 220ms) var(--ease-out, ease) both; }
#career.boot .ch-top { animation: chB-top var(--m-base, 220ms) var(--ease-out, ease) both; }
#career.boot .ch-rail, #career.boot .ch-nav { animation: chB-rail var(--m-base, 220ms) var(--ease-out, ease) 40ms both; }
#career.boot .ch-panel { animation: chB-up 240ms var(--ease-out, ease) 80ms both; }
#career.boot .ch-side:not(.k-hide) { animation: chB-side var(--m-base, 220ms) var(--ease-out, ease) 120ms both; }
@keyframes chB-top { from { opacity: 0; transform: translate3d(0, -10px, 0); } }
@keyframes chB-rail { from { opacity: 0; transform: translate3d(-12px, 0, 0); } }
@keyframes chB-up { from { opacity: 0; transform: translate3d(0, 10px, 0); } }
@keyframes chB-side { from { opacity: 0; transform: translate3d(12px, 0, 0); } }
#career .rise { color: #1f8a52; transition: color .4s; } #career .fall { color: #d6202e; transition: color .4s; }

#career h2 { margin: 0 0 4px; font: 800 18px/1.2 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .05em; }
#career .lead { color: #5d6675; font-size: 13px; line-height: 1.45; margin: 0 0 10px; }
#career .lbl { font: 700 10.5px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .16em; color: #6b7480; margin: 14px 0 8px; text-transform: uppercase; display: block; }
#career .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
#career .grow { flex: 1; }
#career .muted { color: #6b7480; font-size: 12.5px; }
#career .cal { display: flex; gap: 6px; overflow: hidden; margin-bottom: 12px; }
#career .cal div { flex: 1 1 0; min-width: 0; background: #fff; border: 1px solid #e3e7ed; border-radius: 12px; padding: 8px 9px; font-size: 11.5px; line-height: 1.3; }
#career .cal div b { display: block; font-size: 12.5px; } #career .cal div small { color: #6b7480; font-weight: 700; letter-spacing: .08em; }
#career .cal div.next { border-color: var(--tc); box-shadow: 0 0 0 2px color-mix(in srgb, var(--tc) 35%, transparent); }
#career .cal div.done { background: #f6f7f9; }
#career .tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
#career .tile { background: #fff; border: 1px solid rgba(21,26,34,.06); border-radius: 14px; padding: 12px 13px; min-width: 0; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#career .tile small { display: block; color: #6b7480; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .tile b { display: block; font: 800 22px/1.2 var(--k-font, 'Segoe UI', Arial, sans-serif); margin: 4px 0 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
#career .tile span { color: #5d6675; font-size: 12px; }
#career .tile i { font-style: normal; }
#career .two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
#career .list > div { display: flex; align-items: center; gap: 9px; padding: 7px 2px; border-bottom: 1px solid #edf0f4; font-size: 13.5px; }
#career .list > div.me { background: color-mix(in srgb, var(--tc) 10%, transparent); border-radius: 8px; padding-left: 8px; }
#career .list .n { width: 22px; color: #6b7480; font-weight: 700; font-size: 12px; }
#career .list .v { margin-left: auto; font-weight: 700; }
#career .sw { display: inline-block; width: 10px; height: 10px; border-radius: 3px; flex: none; }
#career .bar { height: 6px; border-radius: 3px; background: #e9ecf1; overflow: hidden; flex: 1; min-width: 40px; } #career .bar i { display: block; height: 100%; border-radius: 3px; }
#career .news > div { padding: 9px 0; border-bottom: 1px solid #edf0f4; font-size: 13.5px; line-height: 1.4; } #career .news small { display: inline-block; min-width: 30px; color: #6b7480; font-weight: 700; margin-right: 6px; }
#career .warn { background: #fff4f2; border: 1px solid #ffc9c1; border-radius: 14px; padding: 11px 13px; margin-bottom: 10px; font-size: 13px; line-height: 1.4; }
#career input[type=range] { width: 240px; accent-color: var(--tc); }
#career input[type=text] { background: #fff; border: 1px solid #d6dbe3; color: #151a22; padding: 9px 11px; border-radius: 10px; font: inherit; font-size: 14px; }
#career input[type=color] { width: 44px; height: 34px; border: 1px solid #d6dbe3; border-radius: 8px; background: #fff; padding: 2px; }
#career select, #career option { background: #fff; color: #151a22; }
#career .seg { display: inline-flex; background: rgba(21,26,34,.06); border-radius: 12px; padding: 3px; gap: 2px; flex-wrap: wrap; }
#career .seg button { border: none; background: transparent; padding: 8px 12px; border-radius: 9px; }
#career .seg button.on { background: #fff; color: #151a22; box-shadow: 0 2px 8px rgba(25,35,60,.12); }
#career .seg button:hover:not(:disabled) { transform: none; box-shadow: none; }
#career .detail { margin-top: 10px; background: #fff; border: 1px solid #e3e7ed; border-radius: 14px; padding: 13px 14px; }
#career .detail b { font-size: 15px; } #career .detail p { margin: 5px 0 10px; color: #3a4350; font-size: 13px; line-height: 1.45; }
#career .chart { position: relative; background: #fff; border: 1px solid rgba(21,26,34,.06); border-radius: 16px; padding: 10px 8px 6px; margin-top: 10px; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#career .chart svg { display: block; width: 100%; height: auto; }
#career .chart .tip { position: absolute; pointer-events: none; background: #151a22; color: #fff; font-size: 12px; border-radius: 9px; padding: 8px 10px; min-width: 120px; opacity: 0; transition: opacity .12s; z-index: 2; }
#career .chart .tip div { display: flex; align-items: center; gap: 6px; margin: 2px 0; } #career .chart .tip b { margin-left: auto; padding-left: 10px; }
#career .legend { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
#career .legend button { padding: 5px 8px; font-size: 11px; letter-spacing: .02em; display: inline-flex; align-items: center; gap: 6px; }
#career .legend button.off { opacity: .35; }
#career .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
#career .dcard { background: #fff; border: 1px solid rgba(21,26,34,.06); border-radius: 16px; padding: 11px 12px; position: relative; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#career .dcard::before { content: ''; position: absolute; left: 0; top: 10px; bottom: 10px; width: 4px; border-radius: 2px; background: var(--c, #bbb); }
#career .dcard b { display: block; font-size: 14px; } #career .dcard small { display: block; color: #5d6675; font-size: 12px; margin-top: 2px; }
#career .dcard .nn { position: absolute; right: 12px; top: 10px; font: 800 18px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); color: #c9cfd8; }
#career .dcard .row { margin-top: 8px; }
#career .dcard.has-face { padding-left: 66px; min-height: 64px; } #career .dcard .face { position: absolute; left: 12px; top: 11px; width: 44px; height: 44px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 2px #fff, 0 0 0 3px var(--c, #ccc); }
#career .face.k-ava { display: inline-grid; place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--c, #8a93a0) 20%, #fff); color: color-mix(in srgb, var(--c, #8a93a0) 70%, #000); font: 800 13px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .02em; }
#career .face.k-ava b { font-size: inherit; display: inline; }
#career img.face.k-in { animation: m-fade 160ms var(--ease-out, ease) both; }
#career .rap { position: relative; height: 6px; border-radius: 3px; background: #e9ecf1; flex: 1; min-width: 60px; }
#career .rap::after { content: ''; position: absolute; left: 50%; top: -3px; bottom: -3px; width: 1px; background: #b9c1cc; }
#career .rap i { position: absolute; top: 0; bottom: 0; border-radius: 3px; }
#career .pager { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
#career .k-pager > button { padding: 0; width: 28px; height: 28px; min-width: 28px; display: inline-grid; place-items: center; font-size: 14px; border: 1px solid #e3e7ed; background: #fff; }
#career .k-pager > span { padding: 0 6px; white-space: nowrap; color: #5d6675; font-variant-numeric: tabular-nums; }
#career .modal { position: absolute; inset: 0; background: rgba(238,241,245,.78); display: flex; align-items: center; justify-content: center; z-index: 5; }
#career .modal .box { width: min(560px, calc(100vw - 32px)); max-height: calc(100vh - 48px); display: flex; flex-direction: column; overflow: hidden; padding: 18px 20px 14px; }
#career .tl { display: grid; grid-template-columns: 1fr; gap: 6px; }
#career .teamrow { display: grid; grid-template-columns: 150px 1fr 1fr; gap: 8px; align-items: stretch; }
#career .teamrow .tn { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13px; }
#career .pick { text-align: left; padding: 9px 11px; letter-spacing: 0; }
#career .pick b { display: block; font-size: 13px; } #career .pick small { color: #6b7480; font-size: 11.5px; font-weight: 600; }
#career .pick.on { border-color: var(--c); box-shadow: 0 0 0 2px color-mix(in srgb, var(--c) 40%, transparent); }
#career .lostgrid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; align-content: start; }
#career .lostcard { background: #1b1d21; color: #e6e2d9; border-radius: 14px; overflow: hidden; }
#career .lostcard img { width: 100%; display: block; aspect-ratio: 1; object-fit: cover; }
#career .lostcard div { padding: 9px 11px 11px; font-family: Georgia, 'Times New Roman', serif; } #career .lostcard b { display: block; font-size: 15px; font-weight: 400; letter-spacing: .04em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #career .lostcard small { display: block; color: #a8a398; font-size: 11.5px; margin-top: 3px; font-family: 'Segoe UI', Arial, sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .brief { display: grid; grid-template-columns: 1.2fr 1fr 1.2fr; gap: 10px; margin-bottom: 4px; }
#career .brief > div { background: #fff; border: 1px solid #e3e7ed; border-radius: 14px; padding: 11px 13px; }
#career .brief small { display: block; color: #6b7480; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; font-weight: 700; }
#career .brief b { display: block; font: 800 17px/1.25 var(--k-font, 'Segoe UI', Arial, sans-serif); margin-top: 4px; } #career .brief span { color: #5d6675; font-size: 12px; }
#career .obj > div { display: flex; align-items: center; gap: 10px; padding: 9px 12px; background: #fff; border: 1px solid #e3e7ed; border-radius: 12px; margin-bottom: 6px; font-size: 13px; }
#career .obj i { font-style: normal; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: #eef1f5; color: #6b7480; font-weight: 800; font-size: 12px; flex: none; }
#career .obj .ok i { background: #1fae64; color: #fff; } #career .obj .no i { background: #e5484d; color: #fff; } #career .obj .no { color: #6b7480; }
#career .obj span { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .obj em { margin-left: auto; font-style: normal; font-weight: 800; color: #1f8a52; flex: none; }
#career .obj .no em { color: #9aa3ae; text-decoration: line-through; }
#career .review { background: linear-gradient(135deg, color-mix(in srgb, var(--tc) 14%, #fff), #fff); border: 1px solid #e3e7ed; border-radius: 16px; padding: 14px 16px; }
#career .review .verdict { display: inline-block; padding: 4px 10px; border-radius: 999px; font-weight: 800; font-size: 11.5px; letter-spacing: .12em; text-transform: uppercase; color: #fff; }
#career .trophies { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); grid-auto-rows: 104px; gap: 8px; align-content: start; }
#career .tro { background: #fff; border: 1px solid rgba(21,26,34,.06); border-radius: 14px; padding: 10px 8px; text-align: center; opacity: .55; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; min-width: 0; }
#career .tro .cup { font-size: 22px; filter: grayscale(1); opacity: .5; line-height: 1; }
#career .tro b { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 12.5px; line-height: 1.25; }
#career .tro small { display: block; color: #6b7480; font-size: 11px; line-height: 1.3; }
#career .tro.on { opacity: 1; border-color: #e8c25a; background: linear-gradient(180deg, #fff8e4, #fff); box-shadow: 0 6px 18px rgba(200,150,30,.15); }
#career .tro.on .cup { filter: none; opacity: 1; } #career .tro .when { color: #a07a14; font-weight: 700; }
#career .tag { display: inline-block; font-size: 10.5px; font-weight: 800; letter-spacing: .08em; padding: 2px 7px; border-radius: 999px; background: #fff1d6; color: #9a6400; margin-left: 4px; }
#career .up { color: #1f8a52; font-weight: 700; } #career .down { color: #d6202e; font-weight: 700; }
#career .hub-wait { margin: auto; text-align: center; max-width: 420px; }

#career .wk { display: grid; grid-template-columns: 1.15fr 1fr; grid-template-rows: 104px var(--tile-h) minmax(0, 1fr) 60px; gap: var(--gap); height: 100%; min-height: 0; }
#career .wk.so { grid-template-rows: auto var(--tile-h) minmax(0, 1fr) 60px; }
#career .wk.nd { grid-template-rows: auto minmax(0, 1fr) 60px; }
#career .wk-hero { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: center; min-width: 0; min-height: 0; }
#career .wk-hl { min-width: 0; } #career .wk-hl h2 { margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .wk-hl .lead { margin: 0; font-size: 12.5px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
#career .wk-brief { display: grid; grid-template-columns: repeat(4, 112px); gap: 8px; height: 100%; }
#career .wk-brief > div { background: #fff; border: 1px solid rgba(21,26,34,.07); border-radius: 13px; padding: 9px 10px; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 3px; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#career .wk-brief small { font: 700 9.5px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .14em; text-transform: uppercase; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .wk-brief b { font: 800 14px/1.2 var(--k-font, 'Segoe UI', Arial, sans-serif); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .wk-brief span { font-size: 11px; line-height: 1.3; color: #5d6675; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#career .wk-brief .fm b { color: color-mix(in srgb, var(--tc) 60%, #151a22); }
#career .wk-tiles { grid-column: 1 / -1; display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 8px; min-height: 0; }
#career .wk-tiles > .tile { padding: 8px 10px; display: flex; flex-direction: column; justify-content: center; min-width: 0; overflow: hidden; }
#career .wk-tiles > .tile b { font-size: 19px; margin: 3px 0 1px; }
#career .wk-tiles > .tile span { font-size: 11.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
#career .wk-obj, #career .wk-al { min-height: 0; min-width: 0; overflow: hidden; display: flex; flex-direction: column; }
#career .wk .lbl { margin: 0 0 7px; flex: none; }
#career .wk-obj .obj > div { height: 36px; padding: 0 10px; margin-bottom: 5px; font-size: 12.5px; }
#career .al { display: flex; align-items: center; gap: 9px; min-height: 40px; padding: 4px 6px 4px 9px; border-radius: 11px; background: #fff; border: 1px solid #e3e7ed; margin-bottom: 5px; font-size: 12.5px; line-height: 1.3; flex: none; }
#career .al > i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-weight: 800; font-size: 11px; background: #eef1f5; color: #3a4350; }
#career .al.crisis { border-color: #ffc9c1; background: #fff6f4; } #career .al.crisis > i { background: #e5484d; color: #fff; }
#career .al.warn { border-color: #f3dcae; background: #fffaf0; } #career .al.warn > i { background: #e39a1b; color: #fff; }
#career .al > span { flex: 1; min-width: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#career .al > button { flex: none; padding: 6px 9px; font-size: 10.5px; }
#career .al-none { color: #6b7480; font-size: 12.5px; padding: 6px 2px; }
#career .al-more { align-self: flex-start; padding: 5px 10px; font-size: 10.5px; flex: none; }
#career .wk-alw { min-height: 0; overflow: hidden; }
#career .wk-alw .warn { margin-bottom: 6px; padding: 8px 10px; font-size: 12.5px; }
#career .wk-cal { grid-column: 1 / -1; display: flex; gap: 6px; min-width: 0; min-height: 0; }
#career .wk-cal .cc, #career .cl-card { text-align: left; letter-spacing: 0; display: flex; flex-direction: column; justify-content: center; gap: 2px; background: #fff; border: 1px solid #e3e7ed; font-weight: 600; }
#career .wk-cal .cc { flex: 1 1 0; min-width: 0; padding: 6px 8px; border-radius: 11px; }
#career .wk-cal .cc small, #career .cl-card small { font: 700 10px/1.1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .08em; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .wk-cal .cc b, #career .cl-card b { font-size: 12px; color: #151a22; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
#career .wk-cal .cc span, #career .cl-card span { font-size: 11px; color: #3a4350; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; letter-spacing: 0; }
#career .wk-cal .cc.next, #career .cl-card.next { border-color: var(--tc); box-shadow: inset 0 0 0 1px var(--tc); }
#career .wk-cal .cc.done, #career .cl-card.done { background: #f6f7f9; }
#career .ht { color: #d6457a; letter-spacing: 0; } #career .ht.clash { color: #d6202e; }
#career .nd-seats { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-content: start; }
#career .nd-seats .pick { padding: 14px 16px; }
#career .so-hero { grid-column: 1 / -1; }
#career .so-board { background: #fff; border: 1px solid #e3e7ed; border-radius: 14px; padding: 12px 14px; font-size: 13px; line-height: 1.45; color: #3a4350; min-height: 0; overflow: hidden; }

#career .cl-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(124px, 1fr)); gap: 8px; flex: none; }
#career .cl-card { min-height: 92px; padding: 10px 11px; border-radius: 13px; justify-content: flex-start; }
#career .cl-card.sel { border-color: color-mix(in srgb, var(--tc) 70%, #fff); box-shadow: 0 0 0 2px color-mix(in srgb, var(--tc) 30%, transparent); }
#career .cl-card .fc { color: #5d6675; }
#career .cl-det { flex: 1; min-height: 0; overflow: hidden; background: #fff; border: 1px solid rgba(21,26,34,.06); border-radius: 16px; padding: 14px 16px; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#career .cl-det h3 { margin: 0 0 4px; font: 800 15px/1.2 var(--k-font, 'Segoe UI', Arial, sans-serif); }
#career .cl-top { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px 18px; margin-top: 10px; }
#career .cl-top > div { display: flex; align-items: center; gap: 8px; height: 26px; font-size: 12.5px; border-bottom: 1px solid #f0f2f5; }
#career .cl-top .n { width: 22px; color: #6b7480; font-weight: 700; } #career .cl-top .v { margin-left: auto; font-weight: 800; }
#career .cl-top .me { color: color-mix(in srgb, var(--tc) 65%, #151a22); font-weight: 800; }

#career .seats { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap); flex: none; }
#career .seat.dcard { padding: 14px 16px 14px 18px; display: flex; flex-direction: column; gap: 9px; min-width: 0; }
#career .seat .st-hd { display: flex; gap: 12px; align-items: center; min-width: 0; }
#career .seat .st-hd .ph { flex: none; width: 76px; height: 76px; }
#career .seat .st-hd .face { position: static; width: 76px; height: 76px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 2px #fff, 0 0 0 3px var(--c, #ccc); font-size: 20px; }
#career .seat .st-nm { flex: 1; min-width: 0; }
#career .seat .st-nm b { font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .seat .st-nm b em { font-size: 10px; letter-spacing: .1em; padding: 2px 6px; border-radius: 999px; background: var(--tc); color: #fff; vertical-align: 2px; }
#career .st-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
#career .chip-x { display: inline-block; font: 800 10px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .06em; padding: 4px 7px; border-radius: 999px; background: #eef1f5; color: #3a4350; }
#career .chip-x.red { background: #ffe9e6; color: #c2412f; } #career .chip-x.amber { background: #fff1d6; color: #9a6400; }
#career .st-rw { display: grid; grid-template-columns: 62px minmax(0, 1fr) auto; gap: 10px; align-items: center; font-size: 12.5px; color: #3a4350; }
#career .st-rw > span:first-child { font: 700 10px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .12em; text-transform: uppercase; color: #6b7480; }
#career .st-rw b { font-size: 13px; white-space: nowrap; display: inline; }
#career .st-rw .k-meter, #career .mk-row .k-meter { background: #e9ecf1; }
#career .st-rw .txt { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .st-act { display: flex; justify-content: flex-end; }
#career .st-act button { padding: 7px 11px; font-size: 11px; }
#career .reserve { flex: none; display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 1.5px dashed #c9cfd8; border-radius: 14px; font-size: 13px; color: #3a4350; }
#career .reserve button { flex: none; }
#career .seat.empty { justify-content: center; align-items: center; text-align: center; border-style: dashed; }

#career .mk-hd { flex: none; display: flex; align-items: center; gap: 10px; }
#career .mk-list { display: flex; flex-direction: column; gap: 4px; min-height: 0; }
#career .mk-row { position: relative; flex: none; display: grid; grid-template-columns: 36px minmax(0, 1.7fr) 50px 58px 62px 62px 84px auto; gap: 10px; align-items: center; height: 56px; padding: 0 10px 0 14px; background: #fff; border: 1px solid rgba(21,26,34,.07); border-radius: 12px; font-size: 12.5px; }
#career .mk-row::before { content: ''; position: absolute; left: 0; top: 10px; bottom: 10px; width: 4px; border-radius: 2px; background: var(--c, #b9c1cc); }
#career .mk-row .face { position: static; width: 36px; height: 36px; border-radius: 50%; object-fit: cover; font-size: 11px; box-shadow: none; }
#career .mk-row .nm { min-width: 0; } #career .mk-row .nm b { display: block; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .mk-row .nm small { display: block; color: #6b7480; font-size: 11.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
#career .mk-row .c { min-width: 0; } #career .mk-row .c b { display: block; font-size: 13px; white-space: nowrap; font-variant-numeric: tabular-nums; }
#career .mk-row .c small { display: block; font: 700 9px/1.2 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .1em; text-transform: uppercase; color: #8a93a0; margin-top: 2px; white-space: nowrap; }
#career .mk-row button { padding: 7px 10px; font-size: 10.5px; }
#career .mk-none { color: #6b7480; padding: 18px 4px; }

#career .sd-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 18px; align-content: start; min-height: 0; }
#career .sd-cols.one { grid-template-columns: minmax(0, 1fr); }
#career .sd { display: flex; align-items: center; gap: 8px; height: var(--row); padding: 0 4px; border-bottom: 1px solid #edf0f4; font-size: 12.5px; min-width: 0; }
#career .sd.me { background: color-mix(in srgb, var(--tc) 10%, transparent); border-radius: 8px; padding-left: 8px; }
#career .sd .n { width: 22px; flex: none; color: #6b7480; font-weight: 700; font-size: 12px; }
#career .sd .nm { flex: 0 1 170px; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .sd .nm small { color: #8a93a0; margin-left: 4px; }
#career .sd .mk { color: #6b7480; margin-left: 3px; }
#career .sd .bar { flex: 1; min-width: 30px; }
#career .sd .v { width: 40px; flex: none; text-align: right; font-weight: 800; font-variant-numeric: tabular-nums; }
#career .sd-key { flex: none; font-size: 11.5px; color: #8a93a0; }
#career .rs-row { display: grid; grid-template-columns: 40px minmax(0, 1fr) minmax(0, 1fr) 60px; gap: 10px; align-items: center; height: 40px; padding: 0 8px; border-bottom: 1px solid #edf0f4; font-size: 13px; }
#career .rs-row .n { color: #6b7480; font-weight: 800; } #career .rs-row .v { text-align: right; font-weight: 800; }
#career .rs-row span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

#career .ct-hd { flex: none; display: flex; align-items: center; gap: 10px; }
#career .ct-body { flex: 1; min-height: 0; display: flex; flex-direction: column; }
#career .ct-body .chart { margin-top: 0; }
#career .ct-body .muted { margin: 8px 2px 0; }
#career .tr-hd { flex: none; display: flex; align-items: baseline; gap: 10px; } #career .tr-hd b { font-size: 15px; }
#career .tro-line { flex: none; height: 44px; display: flex; align-items: center; padding: 0 14px; border-radius: 12px; background: #fff; border: 1px solid rgba(21,26,34,.06); font-size: 13px; color: #3a4350; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hs-tiles { flex: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
#career .hs-row { display: grid; grid-template-columns: 54px minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr); gap: 10px; align-items: center; height: 38px; padding: 0 8px; border-bottom: 1px solid #edf0f4; font-size: 13px; }
#career .hs-row span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .lm-h { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; letter-spacing: .12em; }
#career .lm-pg { flex: none; display: flex; justify-content: center; align-items: center; gap: 18px; font: 400 13px Georgia, 'Times New Roman', serif; color: #6b7480; }
#career .lm-pg button { background: none; border: 0; padding: 4px 6px; font: 400 13px Georgia, 'Times New Roman', serif; letter-spacing: .04em; color: #5d6675; }
#career .lm-pg button:hover:not(:disabled) { transform: none; box-shadow: none; color: #151a22; }
#career .rp-list { min-height: 0; }

#career .hub-tt { height: 100%; min-height: 0; }
#career .hub-tt > .tt { height: 100%; min-height: 0; display: grid; gap: var(--gap); }
#career .hub-tt .tt > * { animation: none; margin: 0; min-width: 0; }
#career .hub-tt .tt-head, #career .hub-tt .tt-msg { display: none; }
#career .hub-tt[data-sub=""] .tt { grid-template-columns: 156px minmax(0, 1fr) 292px; grid-template-rows: minmax(0, 1fr); }
#career .hub-tt[data-sub=""] .tt-q, #career .hub-tt[data-sub=""] .tt-fac { display: none; }
#career .hub-tt .tt-brs, #career .hub-tt .tt-sec, #career .hub-tt .tt-det { min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
#career .hub-tt[data-sub=""] .tt-brs { grid-column: 1; grid-row: 1; grid-template-columns: 1fr; align-content: start; gap: 4px; padding: 1px; }
#career .hub-tt[data-sub=""] button.tt-br { min-height: 42px; padding: 5px 7px; gap: 7px; border-radius: 11px; }
#career .hub-tt[data-sub=""] .tt-br .tt-mono { width: 26px; height: 26px; font-size: 9px; border-radius: 8px; }
#career .hub-tt[data-sub=""] .tt-br .tt-ring { width: 24px; height: 24px; } #career .hub-tt[data-sub=""] .tt-br .tt-ring::before { width: 17px; height: 17px; } #career .hub-tt[data-sub=""] .tt-br .tt-ring i { font-size: 7.5px; }
#career .hub-tt[data-sub=""] .tt-brn b { font-size: 12px; } #career .hub-tt[data-sub=""] .tt-brn small { font-size: 10px; }
#career .hub-tt[data-sub=""] .tt-sec { grid-column: 2; grid-row: 1; display: flex; flex-direction: column; gap: 8px; padding: 1px; }
#career .hub-tt[data-sub=""] .tt-bh { padding: 9px 11px; flex: none; }
#career .hub-tt[data-sub=""] .tt-bh p { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 12px; }
#career .hub-tt[data-sub=""] .tt-mt { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 4px 12px; }
#career .hub-tt[data-sub=""] .tt-ups { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 7px; margin: 0; }
#career .hub-tt[data-sub=""] button.tt-up { min-height: 88px; padding: 8px 9px 8px 12px; gap: 4px; }
#career .hub-tt[data-sub=""] .tt-up .fx { font-size: 11px; }
#career .hub-tt[data-sub=""] .tt-det { grid-column: 3; grid-row: 1; padding: 12px 12px 10px; }
#career .hub-tt[data-sub=""] .tt-desc { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin: 8px 0 7px; font-size: 12px; }
#career .hub-tt[data-sub=""] .tt-sup { margin-bottom: 8px; gap: 4px; } #career .hub-tt[data-sub=""] .tt-sup span { font-size: 10.5px; padding: 3px 7px; }
#career .hub-tt[data-sub=""] .tt-dh h3 { font-size: 15px; } #career .hub-tt[data-sub=""] .tt-dh .tt-mono { width: 34px; height: 34px; }
#career .hub-tt[data-sub=""] .tt-l { grid-template-columns: 28px minmax(0, 1fr); gap: 4px 9px; padding: 7px 9px; }
#career .hub-tt[data-sub=""] .tt-l .n { width: 28px; height: 28px; font-size: 10px; }
#career .hub-tt[data-sub=""] .tt-l .s { grid-column: 2; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: flex-start; text-align: left; gap: 6px; }
#career .hub-tt[data-sub=""] .tt-lv::before { left: 22px; }
#career .hub-tt[data-sub=""] .tt-riv { grid-template-columns: 1fr; gap: 8px; margin-top: 10px; padding-top: 10px; }
#career .hub-tt[data-sub=""] .tt-hist { height: 56px; }
#career .hub-tt[data-sub=""] .tt-act .go { white-space: normal; line-height: 1.3; text-align: left; }
#career .hub-tt[data-sub="factory"] .tt { grid-template-columns: minmax(0, 1fr); grid-auto-rows: max-content; align-content: start; }
#career .hub-tt[data-sub="factory"] .tt-brs, #career .hub-tt[data-sub="factory"] .tt-sec, #career .hub-tt[data-sub="factory"] .tt-det { display: none; }
#career .hub-tt[data-fv="sum"] .tt-mxw { display: none; }
#career .hub-tt[data-fv="mx"] .tt-atr, #career .hub-tt[data-fv="mx"] .tt-fx { display: none; }
#career .hub-tt[data-fv="mx"] .tt-mx td { padding: 6px; }
#career .ch-head .tt-kpis { gap: 5px; } #career .ch-head .tt-kpi { padding: 5px 8px; min-width: 0; box-shadow: none; } #career .ch-head .tt-kpi b { font-size: 13px; margin-top: 3px; }
#career .ch-info { flex: none; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; color: #6b7480; background: rgba(21,26,34,.05); cursor: help; }

#career .k-pop { font-family: var(--k-font, 'Segoe UI', Arial, sans-serif); color: #151a22; }
#career .k-pop.race { width: 270px; } #career .k-pop.gear { width: 290px; }
#career .k-pop .pop-row { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; width: 100%; min-height: 48px; padding: 8px 12px; border: 0; background: transparent; border-radius: 9px; text-align: left; letter-spacing: 0; box-shadow: none; }
#career .k-pop .pop-row:hover:not(:disabled) { background: rgba(21,26,34,.05); transform: none; box-shadow: none; }
#career .k-pop .pop-row b { font: 700 13px/1.2 var(--k-font, 'Segoe UI', Arial, sans-serif); color: #151a22; }
#career .k-pop .pop-row small { font: 500 11.5px/1.3 var(--k-font, 'Segoe UI', Arial, sans-serif); color: #6b7480; }
#career .k-pop .pop-row.danger b, #career .k-pop .pop-row.k-armed { color: #d6202e; }
#career .k-pop .pop-note { padding: 8px 12px 10px; font-size: 12px; color: #3a4350; border-bottom: 1px solid #edf0f4; margin-bottom: 4px; }
#career .k-pop .pop-sec { padding: 8px 12px 12px; border-bottom: 1px solid #edf0f4; margin-bottom: 4px; }
#career .k-pop .pop-sec .lbl { margin: 4px 0 8px; } #career .k-pop .pop-sec input[type=range] { width: 100%; }
#career .k-pop .pop-sec small { display: block; font-size: 11.5px; color: #6b7480; margin-top: 4px; }
#career .k-drawer { color: #151a22; }
#career .cr-d p { margin: 6px 0 12px; font-size: 13px; line-height: 1.45; color: #3a4350; }
#career .cr-o { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; width: 100%; text-align: left; margin-bottom: 6px; padding: 10px 12px; letter-spacing: 0; }
#career .cr-o b { font-size: 13px; } #career .cr-o small { font: 500 11.5px/1.35 var(--k-font, 'Segoe UI', Arial, sans-serif); color: #6b7480; letter-spacing: 0; }
#career .rp-head { flex: none; }
#career .rp-head small { letter-spacing: .14em; font-weight: 700; }
#career .rp-head h2 { font-size: 26px; margin: 6px 0 2px; }
#career .rp-steps { flex: 1; min-height: 0; max-height: min(360px, calc(100vh - 220px)); overflow: hidden; margin-top: 6px; }
#career .rp-steps > .m-pg { overflow: hidden; }
#career .rp-steps .lbl:first-child { margin-top: 6px; }
#career .rp-foot { flex: none; display: flex; align-items: center; gap: 8px; margin-top: 12px; }
#career .rp-foot .k-dots i { background: #d6dbe3; } #career .rp-foot .k-dots i.on { background: #151a22; }
#career .rp-foot button { padding: 9px 12px; }
#career .rp-t { font: 700 10.5px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .14em; color: #6b7480; text-transform: uppercase; }
#career .m-calm .m-pages > .m-pg, #career .m-calm .m-pages > .m-pg.past { transform: none; transition: opacity var(--m-calm, 700ms) ease, visibility 0s linear var(--m-calm, 700ms); }
#career .m-calm .m-pages > .m-pg.on { transition: opacity var(--m-calm, 700ms) ease, visibility 0s; }
#career .lm-list { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: var(--gap); }

@media (max-width: 899px) {
  #career .ch-top { left: 8px; right: 8px; top: 8px; height: 48px; gap: 6px; padding: 4px 8px; }
  #career .ch-pills, #career .ch-title small { display: none; }
  #career .ch-race .ch-go { padding: 0 10px; font-size: 11px; max-width: 46vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #career .ch-top > button[data-a="close"] { display: none; }
  #career .ch-pages > .m-page > *, #career .wk > * { flex: none; min-height: auto; }
  #career .wk-tiles { grid-auto-rows: minmax(64px, auto); }
  #career .ch-rail { left: 0; right: 0; top: auto; bottom: 0; width: auto; height: calc(58px + env(safe-area-inset-bottom)); flex-direction: row; padding: 4px 4px env(safe-area-inset-bottom); gap: 0; border-radius: 16px 16px 0 0; }
  #career .ch-rail > button { flex: 1 1 0; height: 50px; min-width: 0; gap: 2px; font-size: 9px; letter-spacing: .02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  #career .ch-rail > button i { font-size: 17px; }
  #career .ch-rail > button[data-sec="lost"] { flex: 0 0 40px; font-size: 0; }
  #career .ch-rail .sp, #career .ch-rail .dv, #career .ch-rail .ind { display: none; }
  #career .ch-rail > button.on { background: #fff; box-shadow: 0 2px 8px rgba(25,35,60,.10); }
  #career .ch-nav:not(.ch-rail) { left: 8px; right: 8px; top: 64px; bottom: auto; width: auto; height: 56px; flex-direction: row; }
  #career .ch-panel { left: 8px; right: 8px; width: auto; top: auto; bottom: calc(66px + env(safe-area-inset-bottom)); height: 64vh; padding: 10px 12px; }
  #career .ch-head { height: auto; min-height: 36px; }
  #career .ch-sub { max-width: none; overflow-x: auto; scrollbar-width: none; }
  #career .ch-side { display: none; }
  #career .ch-pages > .m-page { overflow-y: auto; }
  #career .wk { grid-template-columns: 1fr; grid-template-rows: none; height: auto; }
  #career .wk-hero { grid-template-columns: 1fr; } #career .wk-brief { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  #career .wk-tiles { grid-auto-flow: row; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  #career .tiles { grid-template-columns: 1fr 1fr; } #career .trophies { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  #career .two, #career .cards, #career .lostgrid, #career .seats, #career .sd-cols, #career .nd-seats { grid-template-columns: 1fr; }
  #career .mk-row { grid-template-columns: 36px minmax(0, 1fr) auto; height: auto; padding: 8px 10px 8px 14px; } #career .mk-row .c, #career .mk-row .rap { display: none; }
  #career .hub-tt[data-sub=""] .tt { grid-template-columns: 1fr; grid-template-rows: none; }
  #career .hub-tt[data-sub=""] .tt-brs { grid-template-columns: 1fr 1fr; grid-column: auto; grid-row: auto; }
  #career .hub-tt[data-sub=""] .tt-sec, #career .hub-tt[data-sub=""] .tt-det { grid-column: auto; grid-row: auto; }
  #career .teamrow { grid-template-columns: 1fr 1fr; } #career .teamrow .tn { grid-column: 1 / -1; }
}
@media (max-width: 699px) { #career .ch-3d { display: none; } #career .ch-panel { top: 64px; height: auto; } }
#mourning { position: fixed; inset: 0; z-index: 70; background: #000; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 2.5s ease; font-family: Georgia, 'Times New Roman', serif; color: #ddd; }
#mourning.show { opacity: 1; }
#mourning .in { text-align: center; max-width: 640px; max-height: 100vh; padding: 0 20px; }
#mourning img { width: min(420px, 70vw, 38vh); height: auto; display: block; margin: 0 auto 22px; }
#mourning canvas.hel3d { width: min(460px, 76vw, 48vh); height: min(460px, 76vw, 48vh); display: block; margin: 0 auto 18px; }
#mourning.live .candle { display: none; }
#mourning h2 { font: 400 clamp(30px, 4.6vw, 56px)/1.1 Georgia, 'Times New Roman', serif; letter-spacing: .08em; margin: 0 0 10px; color: #f2f2f2; }
#mourning .meta { font: 400 13px/1.8 'Segoe UI', Arial, sans-serif; letter-spacing: .3em; color: #8d8d8d; text-transform: uppercase; }
#mourning .starts { font: 400 15px/1.6 Georgia, serif; color: #aaa; margin-top: 18px; }
#mourning .candle { position: relative; width: 60px; height: clamp(80px, 15vh, 120px); margin: clamp(12px, 3vh, 26px) auto 0; }
#mourning .candle .wax { position: absolute; left: 50%; bottom: 0; width: 26px; height: 64px; transform: translateX(-50%); border-radius: 4px 4px 3px 3px; background: linear-gradient(90deg, #8d8a84, #d8d4cc 45%, #9a968f); }
#mourning .candle .wick { position: absolute; left: 50%; bottom: 62px; width: 2px; height: 9px; transform: translateX(-50%); background: #1a1a1a; }
#mourning .candle .flame { position: absolute; left: 50%; bottom: 68px; width: 14px; height: 32px; transform-origin: 50% 100%; border-radius: 50% 50% 45% 45% / 62% 62% 38% 38%; background: radial-gradient(ellipse at 50% 72%, #fff 0 18%, #ffe9a8 30%, #ffb347 55%, rgba(255,120,30,.0) 75%); filter: blur(.4px); animation: mFlick 1.3s ease-in-out infinite alternate; }
#mourning .candle .flame i { position: absolute; left: 50%; bottom: 3px; width: 5px; height: 9px; transform: translateX(-50%); border-radius: 50%; background: rgba(90,140,255,.55); filter: blur(1px); }
#mourning .candle .glow { position: absolute; left: 50%; bottom: 40px; width: 220px; height: 220px; transform: translate(-50%, 50%); border-radius: 50%; background: radial-gradient(circle, rgba(255,190,110,.32), rgba(255,160,80,0) 65%); pointer-events: none; }
#mourning .candle .smoke { position: absolute; left: 50%; bottom: 70px; width: 6px; height: 6px; border-radius: 50%; background: rgba(200,200,200,.0); }
#mourning .candle .smoke.on { animation: mSmoke 2.6s ease-out forwards; }
@keyframes mFlick { 0% { margin-left: -1px; } 40% { margin-left: 1px; } 100% { margin-left: 0; } }
@keyframes mSmoke { 0% { background: rgba(190,190,190,.5); box-shadow: 0 0 6px 3px rgba(190,190,190,.35); transform: translate(-50%, 0) scale(1); } 100% { background: rgba(190,190,190,0); box-shadow: 0 0 22px 14px rgba(190,190,190,0); transform: translate(-30%, -70px) scale(3); } }
#mourning .dark { position: absolute; inset: 0; background: #000; opacity: 0; pointer-events: none; }
#mourning .hold { position: relative; overflow: hidden; margin-top: clamp(14px, 3.5vh, 30px); background: none; border: 1px solid #333; color: #777; font: 600 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .35em; padding: 13px 26px; cursor: pointer; opacity: 0; transition: opacity 2s, border-color .4s, color .4s; user-select: none; touch-action: none; }
#mourning .hold.on { opacity: 1; } #mourning .hold.held { border-color: #666; color: #aaa; }
#mourning .hold .fill { position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: rgba(255,255,255,.07); }
#mourning .hold b { position: relative; font-weight: 600; }
`;
/** the hub's CSS with the tech tree's and the social pages' own (each written for #career), injected once */
const cssText = () => CSS + TECH_CSS + (typeof HS.SOCIAL_CSS === 'string' ? HS.SOCIAL_CSS : '') + LOOK_CSS;
const injectCSS = () => { if (document.getElementById('career-css')) return; const st = document.createElement('style'); st.id = 'career-css'; st.textContent = cssText(); document.head.appendChild(st); };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const TRACK_NAME = { silverstone: 'Silverstone', lasvegas: 'Las Vegas' };
const TN = (id) => TRACK_NAME[id] || id || '';
const money = (m) => `$${(Math.round(m * 10) / 10).toFixed(1)}M`;
const diffName = (d) => (d < 20 ? 'Rookie' : d < 40 ? 'Amateur' : d < 60 ? 'Semi-pro' : d < 80 ? 'Pro' : d < 95 ? 'Elite' : 'Legend');
/** a team colour that shows on the white panels (a white or near-white livery drawn in grey) */
const ink = (hex) => { const k = new THREE.Color(hex || '#999'); return 0.2126 * k.r + 0.7152 * k.g + 0.0722 * k.b > 0.62 ? '#8a93a0' : hex; };
const teamShort = (n) => { const w = n.split(/\s+/); return w.length > 1 ? w.map((x) => x[0]).join('').toUpperCase() : n.slice(0, 3).toUpperCase(); };
const last = (n) => String(n || '').split(' ').pop();
const initials = (n) => String(n || '?').split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const safe = (f, fb) => { try { const v = f(); return v ?? fb; } catch (e) { return fb; } };
const nameList = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);
/** a block HubSocial provides (it is built beside this file; until a name lands its page says so) -> its html, or null */
const hs = (name, ...a) => { const f = HS[name]; if (typeof f !== 'function') return null; try { return f(...a); } catch (e) { console.warn(`CareerHub: HubSocial.${name} failed`, e); return null; } };
/** career/Party.js by name, the same way: a call that throws (an old save, a half-built record) never takes the hub down -> its result, or null */
const pty = (name, ...a) => { const f = Party[name]; if (typeof f !== 'function') return null; try { return f(...a); } catch (e) { console.warn(`CareerHub: Party.${name} failed`, e); return null; } };
/** why a driver sits a round out: 'injury' | 'ban' | null (the career's own answer, else from the licence and the injury) */
const outWhy = (c, d) => { if (!d) return null; if (typeof c.outWhy === 'function') return safe(() => c.outWhy(d), null); return d.outUntil != null && d.outUntil >= c.round ? 'injury' : safe(() => isBanned(c, d), false) ? 'ban' : null; };
const pointsOf = (c, d) => safe(() => activePoints(c, d), 0) || 0;
const moodSafe = (d) => safe(() => moodOf(d), { morale: 60, focus: 60, racecraft: 60, confidence: 60, composure: 60 });
const moraleCol = (v) => ({ low: '#e5484d', mid: '#e39a1b', high: '#1fae64' }[safe(() => moraleBand(v), 'mid')] || '#e39a1b');
/** a round's people this career is grieving, or a race where someone was hurt: the quiet week (the social engine's own rule) */
const graveNow = (c) => {
  const ago = (a) => (a && a.season != null ? (c.season - a.season) * (c.rounds || 6) + (c.round - (a.round ?? c.round)) : 99), x = c.pr?.ctx;
  return (!!x?.grave && (x.season == null || ago(x) <= 1)) || (c.lost || []).some((l) => ago(l) <= 1);
};
const gapOf = (c, t) => { const best = Math.max(...Object.values(c.teams).map((x) => techEffects(x).perf)); return (best - techEffects(t).perf) * 90; };
const gapTxt = (g) => (g < 0.005 ? 'fastest' : `+${g.toFixed(2)} s`);

// ---- the showroom ----------------------------------------------------------------------------------------------------
/**
 * Where the camera goes for each screen (in the car's own frame: +x forward, y up): around it at angle az (0: from
 * the front, pi/2: its left side), el above the floor, dist from target t. spin: the turntable turns; else it comes
 * round to face the camera's way and the camera looks at the part.
 */
const VIEWS = {
  overview: { az: 0.75, el: 0.15, dist: 14.5, t: [0, 0.55, 0], spin: true },
  wizard: { az: 0.6, el: 0.13, dist: 14, t: [0, 0.55, 0], spin: true },
  dev: { az: 1.1, el: 0.32, dist: 15.5, t: [0, 0.5, 0], spin: true },
  power: { az: 1.9, el: 0.3, dist: 7.2, t: [-0.9, 0.75, 0] },
  aero: { az: 0.5, el: 0.3, dist: 6.8, t: [2.2, 0.25, 0] },
  drs: { az: 2.65, el: 0.34, dist: 6.6, t: [-2.5, 0.95, 0] },
  chassis: { az: 1.57, el: 0.1, dist: 12, t: [0, 0.4, 0] },
  brakes: { az: 1.15, el: 0.1, dist: 4.4, t: [1.75, 0.36, 0.8] },
  tyres: { az: 1.95, el: 0.1, dist: 4.6, t: [-1.8, 0.36, 0.8] },
  reliability: { az: -2.3, el: 0.3, dist: 9, t: [-0.9, 0.6, 0] },
  pit: { az: 0.05, el: 0.07, dist: 12, t: [0, 0.5, 0] },
  charts: { az: 2.5, el: 0.2, dist: 18, t: [0, 0.5, 0], spin: true },
  // (areas of the studio away from the turntable - world: the target is not turned with it)
  drivers: { az: 1.15, el: 0.1, dist: 6.4, t: [9, 1.15, -6], spin: true, world: true },
  rapport: { az: -0.8, el: 0.18, dist: 16, t: [0, 0.55, 0], spin: true },
  standings: { az: 0.55, el: 0.14, dist: 9.5, t: [-12, 1.75, -8], spin: true, world: true },
  news: { az: 0.15, el: 0.55, dist: 18, t: [0, 0.4, 0], spin: true },
  lost: { az: 1.57, el: 0.06, dist: 19, t: [0, 0.6, 0] },
  trophies: { az: Math.PI / 2, el: 0.06, dist: 12.5, t: [0, 1.95, -19], spin: true, world: true },
  // (the week in the drivers' corner; you alone, close; the team's name on the wall for the media; a quiet corner for your life)
  week: { az: 0.95, el: 0.12, dist: 5.2, t: [9, 1.1, -6], spin: true, world: true },
  you: { az: 1.15, el: 0.06, dist: 3.6, t: [9, 1.15, -6], world: true },
  // (your own look being made - the creator, the hub's Look tab: you alone in the drivers' corner; all of you, your face
  // close, your helmet on its plinth beside you. Each target worked out from the figure itself once it is built)
  cc: { az: 1.15, el: 0.08, dist: 4.4, t: [9.14, 0.98, -6.06], world: true },
  ccFace: { az: 1.15, el: 0.04, dist: 1.15, t: [8.82, 1.7, -5.92], world: true },
  ccHelmet: { az: 1.15, el: 0.26, dist: 1.3, t: [9.5, 1.08, -6.22], world: true },
  pr: { az: 0.35, el: 0.1, dist: 11, t: [-16, 3.4, -6.5], spin: true, world: true },
  life: { az: 0.9, el: 0.14, dist: 8, t: [14, 0.9, 9], spin: true, world: true },
};
/** race day as the forecast has it, in a few words */
const fcTxt = (f) => `${f.time === 'night' ? '☾ Night' : '☀ Day'} · ${{ dry: 'dry', damp: 'damp', wet: 'wet' }[f.weather] || 'dry'}`;
const dTxt = (v) => (!v ? '' : `<span class="${v > 0 ? 'up' : 'down'}">${v > 0 ? '▲' : '▼'}${Math.abs(v * 100).toFixed(1)}</span>`);
// (In Memoriam: the studio greys and dims a little, inside three.js - never a CSS filter over the canvas)
const GREY = new THREE.Color('#8a8a8a'), BG0 = new THREE.Color('#eef1f5'), BG1 = new THREE.Color('#d9dbdf'), UP = new THREE.Vector3(0, 1, 0);
// (the portrait light's: a white key warmed, a mid-grey backdrop)
const WHITE = new THREE.Color('#ffffff'), WARM = new THREE.Color('#ffe9d2'), BGP = new THREE.Color('#c4c8cf');
const ease3 = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
class Showroom {
  constructor(host) {
    this.canvas = document.createElement('canvas'); this.canvas.className = 'ch-3d'; host.prepend(this.canvas);
    const R = this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    R.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.02;
    R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
    const S = this.scene = new THREE.Scene(); S.background = new THREE.Color('#eef1f5'); S.fog = new THREE.Fog('#eef1f5', 34, 80);
    // reflections: a studio of soft boxes for the paint to catch
    const env = new THREE.Scene(), box = (w, h, x, y, z, I) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(I, I, I), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
    env.background = new THREE.Color(0.55, 0.57, 0.6); box(8, 8, 0, 9, 0, 3.2); box(10, 3, 9, 3, 2, 2.2); box(10, 3, -9, 3, -2, 2.2); box(6, 3, 0, 2, 9, 1.4);
    const pm = new THREE.PMREMGenerator(R); S.environment = pm.fromScene(env, 0.04).texture; S.environmentIntensity = 0.85;
    // the studio: a white floor, a curved wall behind, the turntable
    const floor = new THREE.Mesh(new THREE.CircleGeometry(40, 96), new THREE.MeshStandardMaterial({ color: '#f3f4f7', roughness: 0.55 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; S.add(floor);
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 16, 96, 1, true, Math.PI * 0.55, Math.PI * 1.3), new THREE.MeshStandardMaterial({ color: '#f0f2f6', roughness: 0.9, side: THREE.BackSide })); wall.position.y = 8; S.add(wall);
    this.stripe = new THREE.Mesh(new THREE.CylinderGeometry(23.9, 23.9, 0.3, 96, 1, true, Math.PI * 0.55, Math.PI * 1.3), new THREE.MeshBasicMaterial({ color: '#e10600', side: THREE.BackSide })); this.stripe.position.y = 3.4; S.add(this.stripe);
    this.turn = new THREE.Group(); S.add(this.turn);
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(3.9, 4.0, 0.12, 96), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.22, metalness: 0.05 })); plate.position.y = 0.06; plate.receiveShadow = true; this.turn.add(plate);
    this.ring = new THREE.Mesh(new THREE.TorusGeometry(3.96, 0.018, 8, 180), new THREE.MeshBasicMaterial({ color: '#e10600' })); this.ring.rotation.x = Math.PI / 2; this.ring.position.y = 0.1; S.add(this.ring);
    // the light: a soft sky, a key from above throwing the car's shadow, a cool fill
    this.hemi = new THREE.HemisphereLight(0xffffff, 0xd9dde3, 1.25); S.add(this.hemi);
    const key = this.key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(6, 12, 7); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 40 }); key.shadow.bias = -0.0004; key.shadow.radius = 4; S.add(key);
    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.6); fill.position.set(-8, 5, -6); S.add(fill);
    this.cam = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
    this.cur = { ...VIEWS.overview, t: [...VIEWS.overview.t] }; this.goal = VIEWS.overview; this.goalKey = 'overview'; this.from = this.cur; this.u = 1; this.dur = 1; this.daz = 0; this.pull = 0; this.spin = 0; this.spin0 = 0; this.spin1 = 0;
    this.wordmark = null; this.key0 = null; this.on = false; this.panelRight = 0; this.last = 0;
    this.teamCol = new THREE.Color('#e10600'); this.mood = 0; this.moodTo = 0; this.moodFrom = 0; this.moodU = 1; this.port = 0; this.portTo = 0; this.portFrom = 0; this.portU = 1;
    this.dirty = true; this.odd = false; this.busyUntil = 0; this.wasBusy = false; this.tw = new THREE.Vector3();
  }
  /** the car on the turntable: a team's livery, the driver's helmet; and the studio in the team's colour */
  setCar(o) {
    // (the same car with only the helmet's design changed - your own look edited: its paint swapped in place)
    const hk = o.driver ? JSON.stringify(helmetDesign(o.driver)) : '', k = [o.color, o.color2, o.driver, o.number, o.team].join('|');
    if (k === this.key0) { if (hk !== this.helKey) { this.helKey = hk; this._carHelmet(o); } return; }
    this.key0 = k; this.helKey = hk; this.dirty = true;
    if (this.car) { this.turn.remove(this.car.group); this.car.dispose(); }
    const m = this.car = new CarMesh(o.color, 'SOFT', { color2: o.color2, helmet: o.helmet, number: o.number, driver: o.driver });
    m.group.traverse((x) => { if (x.isMesh) x.castShadow = true; });
    if (m.shadow) m.shadow.visible = false; if (m.shadowFar) m.shadowFar.visible = false;
    m.group.position.y = 0.12; this.turn.add(m.group);
    const col = new THREE.Color(o.color); this.teamCol.copy(col); this._mood();
    // the team's name, huge and faint, on the wall
    if (this.wordmark) { this.scene.remove(this.wordmark); this.wordmark.material.map.dispose(); this.wordmark.material.dispose(); }
    const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 300; const x = cv.getContext('2d');
    x.font = '900 220px "Segoe UI", Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#' + col.getHexString(); x.fillText(String(o.team || '').toUpperCase(), 1024, 160);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    this.wordmark = new THREE.Mesh(new THREE.PlaneGeometry(26, 3.8), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.13, depthWrite: false, fog: false }));
    this.wordmark.position.set(-21, 6.2, -9); this.wordmark.lookAt(0, 6.2, 0); this.scene.add(this.wordmark);
  }
  /** the cockpit helmet's paint again (its driver's design changed; none: the plain colour) - the old paint freed */
  _carHelmet(o) {
    const h = this.car?.helmet; if (!h) return;
    const M = h.material, map = o.driver ? helmetTexture(o.driver, { size: 512 }) : null;
    M.map?.dispose(); M.map = map; M.color.set(map ? '#ffffff' : o.helmet || '#ffffff'); h.rotation.y = map ? Math.PI : 0; M.needsUpdate = true; this.dirty = true;
  }
  /**
   * The camera to a screen's view: a timed glide (an ease in and out over 0.55-1.1 s, longer for longer moves, pulling
   * back a little on the way across the studio); the same view again changes nothing. 'you': your own figure in the
   * drivers' corner.
   */
  view(name) {
    let G = VIEWS[name] || VIEWS.overview;
    if (name === 'you') G = this.youT ? { ...VIEWS.you, t: this.youT } : VIEWS.drivers;
    // (your look being made: the face where the figure's head is, the helmet where it stands)
    else if (name === 'ccFace' && this.avHead) G = { ...VIEWS.ccFace, t: this.avHead };
    else if (name === 'ccHelmet' && this.avHelT) G = { ...VIEWS.ccHelmet, t: this.avHelT };
    // (beside a wide panel - the hub's - the open space is narrower: the camera back a little, so all of you still fits)
    if (name === 'cc' || name === 'ccFace' || name === 'ccHelmet') { const fw = innerWidth - (this.panelRight || 0); if (innerWidth > 900 && fw > 0 && fw < 620) G = { ...G, dist: G.dist * Math.min(1.45, 620 / fw) }; }
    const k = name === 'you' || name === 'ccFace' || name === 'ccHelmet' ? `${name}|${G.t.map((v) => v.toFixed(3)).join(',')}` : name;
    // (the helmet close: your figure stepped out of the shot - at that range it would fill the frame beside the plinth)
    this.helOnly = name === 'ccHelmet'; if (this.avP && !this.avHidden) { this.avP.group.visible = !this.helOnly; this.dirty = true; }
    if (k === this.goalKey) return;
    this.goalKey = k;
    const C = this.cur; this.from = { az: C.az, el: C.el, dist: C.dist, t: [...C.t] };
    let da = G.az - C.az; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    const dT = Math.hypot(G.t[0] - C.t[0], G.t[1] - C.t[1], G.t[2] - C.t[2]);
    this.daz = da; this.dur = clamp(0.55 + 0.16 * Math.abs(da) + 0.03 * dT, 0.55, 1.1); this.pull = Math.min(5, 0.2 * dT); this.u = 0;
    // (a close look at a part: the turntable comes round to face the camera's way, on the same curve)
    let r = -this.spin % (2 * Math.PI); if (r > Math.PI) r -= 2 * Math.PI; if (r < -Math.PI) r += 2 * Math.PI;
    this.spin0 = this.spin; this.spin1 = this.spin + r;
    this.goal = G; this.dirty = true;
  }
  /** the studio's mood: 'dim' for In Memoriam (the light lower, the colours greyed, over 1.6 s), 'normal' otherwise */
  setMood(m) { const to = m === 'dim' ? 1 : 0; if (to === this.moodTo) return; this.moodTo = to; this.moodFrom = this.mood; this.moodU = 0; this.dirty = true; }
  /**
   * A portrait light while a person is being styled (LIFE › Style, your own look): the white studio's sky and exposure
   * lowered, the key a little warm, the backdrop a soft grey - fair skin and its make-up as they look in the evening, not
   * washed to paper (over half a second; off: the studio as it was)
   */
  setPortrait(on, who = 'page') {
    // (who: the page asking - your look, her style; the light stays while either still wants it)
    const W = this.portWho || (this.portWho = new Set()); if (on) W.add(who); else W.delete(who);
    const to = W.size ? 1 : 0; if (to === (this.portTo ?? 0)) return; this.portTo = to; this.portFrom = this.port ?? 0; this.portU = 0; this.dirty = true;
  }
  _mood() {
    const u = this.moodU, e = u * u * (3 - 2 * u), m = this.mood = this.moodFrom + (this.moodTo - this.moodFrom) * e;
    const v = this.portU ?? 1, ev = v * v * (3 - 2 * v), p = this.port = (this.portFrom ?? 0) + ((this.portTo ?? 0) - (this.portFrom ?? 0)) * ev;
    // (the portrait light: the white studio's own reflections - its soft boxes - lowered most of all: their flat wash is what
    // pushed fair skin up the tone curve's shoulder, to a greyed paper white; measured on Zoe's cheek, 220,204,187 -> 198,174,151)
    this.hemi.intensity = Math.max(0.3, 1.25 - 0.5 * m - 0.85 * p); this.key.intensity = 2.3 - 0.9 * m - 0.5 * p; this.renderer.toneMappingExposure = 1.02 - 0.17 * m - 0.16 * p;
    this.scene.environmentIntensity = 0.85 - 0.4 * p;
    this.key.color.copy(WHITE).lerp(WARM, p);
    this.stripe.material.color.copy(this.teamCol).lerp(GREY, m); this.ring.material.color.copy(this.stripe.material.color);
    this.scene.background.copy(BG0).lerp(BG1, m).lerp(BGP, 0.7 * p); this.scene.fog.color.copy(this.scene.background);
  }
  /** a page is changing: the shadow map holds still for ms so the transition gets the frames */
  busy(ms) { this.busyUntil = Math.max(this.busyUntil, performance.now() + ms); }
  /** the camera to a goal of the caller's own ({ az, el, dist, t, world } - LIFE › Style's views of her), by the same glide; key: the same key again changes nothing */
  viewTo(key, G) { if (this._vtk && this._vtk !== key) delete VIEWS[this._vtk]; this._vtk = key; VIEWS[key] = G; this.view(key); }

  // ---- the studio's areas: your drivers, the podium, the trophy cabinet (built when first shown, kept after) ------
  /** a person standing in the studio at (x, z), facing the way the camera looks at that area from (az) */
  _person(o, x, z, az, y = 0) {
    const P = makePerson({ pose: o.pose || 'talk', kit: 'suit', color: o.color, accent: o.color2 || '#ffffff', cap: o.cap ?? true, driver: o.name, teamName: o.team, jitter: o.jitter ?? 0.01, ...(o.detail ? { detail: o.detail } : {}) });
    P.group.position.set(x, y, z); P.group.rotation.y = -az + (o.turn || 0); P.group.traverse((m) => { if (m.isMesh) m.castShadow = false; });
    this.scene.add(P.group); (this.folk = this.folk || []).push(P); this.dirty = true; return P;
  }
  _clear(key) { const L = this[key]; if (!L) return; for (const x of L) { if (x.group) { this.scene.remove(x.group); this.folk = this.folk.filter((f) => f !== x); x.dispose(); } else { this.scene.remove(x); x.traverse?.((m) => { if (m.isMesh) { m.geometry.dispose(); m.material.map?.dispose(); m.material.dispose(); } }); } } this[key] = null; this.dirty = true; }
  _blob(x, z, r) { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.06, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.012, z); this.scene.add(m); return m; }
  /** your two drivers, side by side in the team's kit, in their corner of the studio (where you stand is kept for the DRIVER view) */
  setCrew(list) {
    const V = VIEWS.drivers, [cx, , cz] = V.t, px = -Math.sin(V.az), pz = Math.cos(V.az), sOf = (i) => (list.length > 1 ? (i ? 0.62 : -0.62) : 0);
    const mi = list.findIndex((d) => d.me); this.youT = mi >= 0 && mi < 2 ? [cx + px * sOf(mi), 1.15, cz + pz * sOf(mi)] : null;
    const k = list.map((d) => d.name + d.color + lookStamp(d.name)).join('|'); if (k === this.crewKey) return; this.crewKey = k; this._clear('crew');
    const out = [];
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.75, 0.08, 64), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 })); disc.position.set(cx, 0.04, cz); this.scene.add(disc); out.push(disc);
    list.slice(0, 2).forEach((d, i) => { const s = sOf(i); out.push(this._person({ ...d, turn: -s * 0.35 }, cx + px * s, cz + pz * s, V.az, 0.08)); });
    this.crew = out;
    // (while your own figure stands there alone - the Look tab - the pair wait out of sight)
    if ((this.avP || this.avNext) && !this.avHidden) for (const x of out) (x.group || x).visible = false;
  }
  /**
   * You alone in the drivers' corner, as the look you are making (registered by name: People.setDriverLook): o: { name,
   * color, color2 (the team's), team, cap }. Rebuilt only when something in it changed (the look's stamp is in its key)
   * - the new figure built before the old one goes, so a face the two share is never painted twice; beside you a white
   * plinth with your helmet on it, rebuilt only when its design does. The pair from the hub wait out of sight meanwhile.
   * o.draft: a lighter figure (fewer sections, a smaller face paint) while a slider is still moving - the full one follows
   * once it is let go.
   */
  setAvatar(o) {
    const V = VIEWS.drivers, [cx, , cz] = V.t, rx = Math.sin(V.az), rz = -Math.cos(V.az);   // (r: the screen's right, seen from the corner's camera)
    this._dragTurn(); this.setPortrait(true, 'look');
    for (const x of this.crew || []) (x.group || x).visible = false;
    // (kept out of sight on another step: back at once)
    if (this.avHidden) { this.avHidden = false; for (const m of [this.avDisc, this.avPlinth, this.avHel]) if (m) m.visible = true; if (this.avP) this.avP.group.visible = !this.helOnly; }
    const k = [o.name, o.color, o.color2, o.team, o.cap ? 1 : 0, o.draft ? 'd' : '', lookStamp(o.name)].join('|');
    if (k !== this.avKey) {
      this.avKey = k;
      if (!this.avDisc) { const d = this.avDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.2, 0.08, 64), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 })); d.position.set(cx + 0.15 * rx, 0.04, cz + 0.15 * rz); this.scene.add(d); }
      const t0 = performance.now(), P = this._person({ name: o.name, color: o.color, color2: o.color2, team: o.team, cap: !!o.cap, pose: 'talk', jitter: 0, detail: o.draft ? 0.55 : 0 }, cx - 0.2 * rx, cz - 0.2 * rz, V.az, 0.08);
      P.group.rotation.y = -V.az + (this.avYaw || 0); P.group.updateMatrixWorld(true);
      // (what a build took, a draft's apart: how often a moving slider may ask for another - see avGap)
      this[o.draft ? 'avMsD' : 'avMs'] = performance.now() - t0;
      // (its shaders compiled off the main thread before it is shown (three's compileAsync, the GPU's parallel compile):
      // on the laptop's GPU a figure's programs - when none like them stand in the studio - took 1.5 s of a frozen page
      // to compile at its first draw. The figure it replaces stays until then; one superseded meanwhile is let go)
      if (this.avNext) this._avDrop(this.avNext);
      this.avNext = P; P.group.visible = false;
      const swap = () => {
        if (this.avNext !== P) return; this.avNext = null;
        if (this.avP) this._avDrop(this.avP);
        this.avP = P; P.group.visible = !this.helOnly && !this.avHidden; P.group.rotation.y = -V.az + (this.avYaw || 0);
        const hp = new THREE.Vector3(); P.head.getWorldPosition(hp); this.avHead = [hp.x, hp.y + 0.02, hp.z];
        if (String(this.goalKey).startsWith('ccFace')) this.view('ccFace');   // (the face view on the new head)
        this.dirty = true;
      };
      const R = this.renderer;
      if (R.compileAsync) {
        let t = 0; const go = () => { clearTimeout(t); swap(); };
        P.comp = R.compileAsync(P.group, this.cam, this.scene).catch(() => {}).finally(() => { P.comp = null; });
        P.comp.then(go); t = setTimeout(go, 5000);   // (a compile that never reports: shown after 5 s, compiled at its draw)
      } else swap();
    }
    // (the helmet on its plinth: your design, the visor toward the camera's side)
    const hk = JSON.stringify(helmetDesign(o.name)) + o.color + o.color2;
    if (hk !== this.avHelKey) {
      this.avHelKey = hk;
      if (!this.avPlinth) { const m = this.avPlinth = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.95, 40), new THREE.MeshStandardMaterial({ color: '#fbfbfc', roughness: 0.35 })); m.position.set(cx + 0.55 * rx, 0.08 + 0.475, cz + 0.55 * rz); this.scene.add(m); }
      this._freeHelmet();
      const D = helmetDesign(o.name), h = this.avHel = makeHelmet(D?.c?.[0] || o.color2 || '#ffffff', D?.c?.[1] || o.color || '#777777', 99, { driver: o.name });
      // (its visor three-quarters to the camera: the design's front and its side - the number - both seen)
      h.position.set(cx + 0.55 * rx, 0.08 + 0.95 + 0.118, cz + 0.55 * rz); h.rotation.y = -V.az + 0.45; this.scene.add(h);
      this.avHelT = [h.position.x, h.position.y + 0.01, h.position.z];
    }
    this.dirty = true;
  }
  /**
   * how long a moving slider waits between drafts of your figure (ms): 160 at the least, else two and a half times what
   * the last draft took - a slow machine's main thread never more than about two fifths busy with them, the slider and
   * the page always answering between
   */
  avGap() { return Math.max(160, Math.min(900, 2.5 * (this.avMsD ?? this.avMs ?? 0))); }
  _freeHelmet() { const h = this.avHel; if (!h) return; this.scene.remove(h); h.traverse((m) => { if (m.isMesh) { m.geometry.dispose(); m.material.map?.dispose(); m.material.dispose(); } }); this.avHel = null; }
  /** a figure of yours let go: out of the scene, disposed - once its shaders' compile has settled (compileAsync reads each material's program while it waits) */
  _avDrop(p) { this.scene.remove(p.group); this.folk = (this.folk || []).filter((f) => f !== p); if (p.comp) p.comp.then(() => p.dispose()); else p.dispose(); }
  /**
   * your figure, its plinth and its helmet out of sight but kept (the wizard's other steps): back on the look step at
   * once, nothing built or compiled again; the pair back meanwhile. setAvatar shows them again
   */
  hideAvatar() {
    for (const x of this.crew || []) (x.group || x).visible = true;
    this.setPortrait(false, 'look'); this.avHidden = true;
    for (const m of [this.avP?.group, this.avDisc, this.avPlinth, this.avHel]) if (m) m.visible = false;
    this.dirty = true;
  }
  /** your figure gone from the corner (its plinth and helmet too); the pair back */
  clearAvatar() {
    for (const x of this.crew || []) (x.group || x).visible = true;
    this.setPortrait(false, 'look'); this.avHidden = false;
    if (this.avNext) { this._avDrop(this.avNext); this.avNext = null; }
    if (!this.avP && !this.avDisc) return;
    if (this.avP) this._avDrop(this.avP);
    this._freeHelmet();
    for (const m of [this.avDisc, this.avPlinth]) if (m) { this.scene.remove(m); m.geometry.dispose(); m.material.dispose(); }
    this.avP = this.avDisc = this.avPlinth = null; this.avKey = this.avHelKey = null; this.avHead = this.avHelT = null; this.avYaw = 0; this.dirty = true;
  }
  /** your figure turned (by da radians; null: back to facing the camera) */
  turnAvatar(da) {
    if (!this.avP) return;
    this.avYaw = da == null ? 0 : ((this.avYaw || 0) + da) % (2 * Math.PI);
    this.avP.group.rotation.y = -VIEWS.drivers.az + this.avYaw; this.dirty = true;
  }
  /** drag on the studio (wherever no panel is) to turn your figure; a double click faces it to you again */
  _dragTurn() {
    if (this.dragOn) return; this.dragOn = true;
    const c = this.canvas; let x0 = null;
    c.addEventListener('pointerdown', (e) => { if (!this.avP || e.button !== 0) return; x0 = e.clientX; try { c.setPointerCapture(e.pointerId); } catch (er) { /* (no capture: the drag ends at the edge) */ } });
    c.addEventListener('pointermove', (e) => { if (x0 == null || !this.avP) return; this.turnAvatar((e.clientX - x0) * 0.01); x0 = e.clientX; });
    const end = (e) => { x0 = null; try { c.releasePointerCapture(e.pointerId); } catch (er) { /* (not captured) */ } };
    c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
    c.addEventListener('dblclick', () => { if (this.avP) this.turnAvatar(null); });
  }
  /** the championship's top three on a podium, their numbers on the steps */
  setPodium(list) {
    const k = list.map((d) => d.name + d.color + lookStamp(d.name)).join('|'); if (k === this.podKey) return; this.podKey = k; this._clear('podium');
    const V = VIEWS.standings, [cx, , cz] = V.t, px = -Math.sin(V.az), pz = Math.cos(V.az), out = [];
    const white = new THREE.MeshStandardMaterial({ color: '#fbfbfc', roughness: 0.35 });
    [[0, 0, 1.05], [1, -1.45, 0.72], [2, 1.45, 0.5]].forEach(([i, s, h]) => {
      const d = list[i]; const bx = cx + px * s, bz = cz + pz * s;
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, h, 1.2), white); b.position.set(bx, h / 2, bz); b.rotation.y = -V.az; this.scene.add(b); out.push(b);
      const cv = document.createElement('canvas'); cv.width = 256; cv.height = 256; const x = cv.getContext('2d'); x.fillStyle = d?.color || '#888'; x.fillRect(0, 216, 256, 40); x.fillStyle = '#151a22'; x.font = '900 150px "Segoe UI", Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(i + 1), 128, 112);
      const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
      const f = new THREE.Mesh(new THREE.PlaneGeometry(Math.min(1.1, h * 1.3), Math.min(1.1, h * 1.3) * 0.98), new THREE.MeshBasicMaterial({ map: tex, transparent: true })); f.position.set(bx + Math.cos(V.az) * 0.712, h * 0.5, bz + Math.sin(V.az) * 0.712); f.rotation.y = -V.az + Math.PI / 2; this.scene.add(f); out.push(f);
      if (d) out.push(this._person({ ...d, pose: i === 0 ? 'cheer' : 'talk', turn: -s * 0.18 }, bx, bz, V.az, h));
    });
    out.push(this._blob(cx, cz, 3.2)); this.podium = out;
  }
  /**
   * In front of the trophies, never moved: a low black plinth with the helmet of every driver this career has lost -
   * in their own colours, their blood on it and a pool of it beneath, a candle, a small plaque with the name and when.
   */
  setLost(list) {
    const k = list.map((l) => l.name).join('|'); if (k === this.lostKey) return; this.lostKey = k; this.dirty = true;
    if (this.lostG) { this.scene.remove(this.lostG); this.lostG.traverse((m) => { if (m.isMesh) { m.geometry.dispose(); m.material.map?.dispose(); m.material.alphaMap?.dispose(); m.material.dispose(); } }); this.lostG = null; }
    if (!list.length) return;
    const g = new THREE.Group(), [cx, , cz] = VIEWS.trophies.t, n = list.length, H = 0.55, SP = 1.2, w = Math.max(1.9, n * SP + 0.6);
    const black = new THREE.MeshStandardMaterial({ color: '#0c0c0e', roughness: 0.35, metalness: 0.1 });
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(w, H, 1.0), black); plinth.position.y = H / 2; g.add(plinth);
    list.forEach((l, i) => {
      const x = (i - (n - 1) / 2) * SP;
      const hel = makeHelmet(l.helmet || '#ffffff', l.color || '#555555', l.number ?? '', { driver: l.name, blood: l.name });   // (in their own colours: how they raced)
      hel.position.set(x, H + 0.2, 0.02); hel.rotation.y = -0.5 + (i % 2) * 0.15; hel.scale.setScalar(1.9); g.add(hel);
      const pool = bloodPool(l.name, H + 0.004); pool.position.x = x + 0.16; pool.position.z = 0.1; pool.rotation.y = -0.4; pool.scale.setScalar(1.25); g.add(pool);
      // a candle beside it
      const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.027, 0.13, 16), new THREE.MeshStandardMaterial({ color: '#d9d4c9', roughness: 0.7 })); wax.position.set(x - 0.42, H + 0.065, 0.3); g.add(wax);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffcf7a' })); flame.scale.set(1, 2.1, 1); flame.position.set(x - 0.42, H + 0.16, 0.3); g.add(flame);
      // the plaque on the plinth's face
      const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128; const c2 = cv.getContext('2d');
      c2.fillStyle = '#0c0c0e'; c2.fillRect(0, 0, 512, 128); c2.fillStyle = '#d8d2c4'; c2.textAlign = 'center';
      c2.font = '400 46px Georgia, "Times New Roman", serif'; c2.fillText(String(l.name).toUpperCase(), 256, 58);
      c2.font = '400 24px Georgia, serif'; c2.fillStyle = '#9a958a'; c2.fillText(`#${l.number ?? ''} · ${l.team || ''} · ${l.season || ''}${l.round ? `, round ${l.round}` : ''}`, 256, 100);
      const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.215), new THREE.MeshBasicMaterial({ map: tex })); pl.position.set(x, H * 0.5, 0.502); g.add(pl);
    });
    g.position.set(cx, 0, cz + 2.4); this.scene.add(g); this.lostG = g;
  }
  /** the trophy cabinet: every trophy of the career, gold when it is yours, a glass outline until then */
  setCabinet(earned) {
    const k = earned.map((e) => (e ? 1 : 0)).join(''); if (k === this.cabKey) return; this.cabKey = k; this.dirty = true;
    if (!this.cab || this.cups.length < earned.length) {
      if (this.cab) { this.scene.remove(this.cab); this.cab.traverse((m) => { if (m.isMesh) { m.geometry.dispose(); if (m.material !== this.gold && m.material !== this.ghost) m.material.dispose(); } }); }
      const g = new THREE.Group(), [cx, , cz] = VIEWS.trophies.t, frame = new THREE.MeshStandardMaterial({ color: '#2a2c31', roughness: 0.4, metalness: 0.3 });
      const back = new THREE.Mesh(new THREE.BoxGeometry(9.4, 3.9, 0.12), new THREE.MeshStandardMaterial({ color: '#1d1f24', roughness: 0.6 })); back.position.set(0, 1.95, -0.45); g.add(back);
      for (const y of [0.0, 1.25, 2.5, 3.75]) { const sh = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.07, 0.9), frame); sh.position.set(0, y + 0.03, 0); g.add(sh); }
      for (const x of [-4.7, 4.7]) { const sd = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.85, 0.9), frame); sd.position.set(x, 1.93, 0); g.add(sd); }
      // (a light strip along each shelf: the gold catches it)
      for (const y of [1.2, 2.45, 3.7]) { const l = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.03, 0.03), new THREE.MeshBasicMaterial({ color: '#fff3d6' })); l.position.set(0, y, 0.4); g.add(l); }
      const prof = [[[0, 0], [0.16, 0], [0.16, 0.05], [0.05, 0.08], [0.04, 0.3], [0.17, 0.42], [0.2, 0.62], [0.18, 0.64]], [[0, 0], [0.14, 0], [0.14, 0.06], [0.04, 0.1], [0.035, 0.45], [0.12, 0.55], [0.13, 0.78], [0.11, 0.8]], [[0, 0], [0.18, 0], [0.18, 0.04], [0.06, 0.07], [0.05, 0.22], [0.22, 0.34], [0.24, 0.48], [0.21, 0.5]]];
      this.gold = this.gold || new THREE.MeshStandardMaterial({ color: '#d9ab3f', roughness: 0.2, metalness: 1, envMapIntensity: 1.4 });
      this.ghost = this.ghost || new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.16 });
      // (six to a shelf, three shelves; a career with more trophies than that packs them seven or eight across)
      const per = Math.max(6, Math.ceil(earned.length / 3)), step = Math.min(1.5, 9 / per);
      this.cups = earned.map((_, i) => {
        const row = Math.floor(i / per), col = i % per, pr = prof[i % 3];
        const cup = new THREE.Mesh(new THREE.LatheGeometry(pr.map(([r, y]) => new THREE.Vector2(r, y)), 32), this.ghost);
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.42), frame); base.position.y = -0.07;
        const tg = new THREE.Group(); tg.add(base, cup); tg.position.set(-((per - 1) * step) / 2 + col * step, 0.21 + (2 - row) * 1.25, 0.05); g.add(tg); return cup;
      });
      g.position.set(cx, 0, cz); this.scene.add(g); this.cab = g;
    }
    earned.forEach((e, i) => { if (this.cups[i]) this.cups[i].material = e ? this.gold : this.ghost; });
  }
  start() { if (this.on) return; this.on = true; this.dirty = true; this.last = performance.now(); const loop = (now) => { if (!this.on) return; this.frame(Math.min(0.05, (now - this.last) / 1000)); this.last = now; requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  stop() { this.on = false; }
  /**
   * One frame - drawn only when something changed: a camera glide, a set piece, the mood, a resize; a turning
   * turntable at 30 frames a second; a still view not at all (the GPU is the laptop's bottleneck).
   */
  frame(dt) {
    const c = this.canvas, w = c.clientWidth || innerWidth, h = c.clientHeight || innerHeight, R = this.renderer, pr = R.getPixelRatio();
    // (floored, as three's setSize sizes the canvas: rounded, a .5 device pixel ratio (125%) never matched - a resize every frame)
    if (c.width !== Math.floor(w * pr) || c.height !== Math.floor(h * pr)) { R.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); this.dirty = true; }
    const G = this.goal, C = this.cur, F = this.from, moving = this.u < 1;
    if (moving) {
      this.u = Math.min(1, this.u + dt / this.dur); const u = this.u, e = ease3(u);
      C.az = F.az + this.daz * e; C.el = F.el + (G.el - F.el) * e; C.dist = F.dist + (G.dist - F.dist) * e + this.pull * Math.sin(Math.PI * u);
      for (let i = 0; i < 3; i++) C.t[i] = F.t[i] + (G.t[i] - F.t[i]) * e;
      if (!G.spin) this.spin = this.spin0 + (this.spin1 - this.spin0) * e;
    }
    // the turntable: turning slowly, or brought round to face the camera's way for a close look at a part
    if (G.spin) this.spin += dt * 0.16;
    this.turn.rotation.y = this.spin;
    const mood = this.moodU < 1 || this.portU < 1; if (mood) { this.moodU = Math.min(1, this.moodU + dt / 1.6); this.portU = Math.min(1, this.portU + dt / 0.5); this._mood(); }
    this.tt = (this.tt || 0) + dt;
    if (document.hidden) return;
    if (!this.dirty && !moving && !mood) { if (!G.spin) return; this.odd = !this.odd; if (this.odd) return; }
    const tw = this.tw.set(C.t[0], C.t[1], C.t[2]); if (!G.spin && !G.world) tw.applyAxisAngle(UP, this.spin);
    // (the people in the studio: breathing, the champion's arms up and down a little)
    for (const [i, P] of (this.folk || []).entries()) P.head.rotation.z = P.bow + 0.015 * Math.sin(this.tt * 0.8 + i * 1.7);
    this.cam.position.set(tw.x + C.dist * Math.cos(C.el) * Math.cos(C.az), tw.y + C.dist * Math.sin(C.el), tw.z + C.dist * Math.cos(C.el) * Math.sin(C.az));
    this.cam.lookAt(tw);
    // the car in the open space beside the panels (to their right; above them on a narrow screen)
    if (w > 900) { const sh = Math.max(0, ((this.panelRight + w) / 2 - w / 2)); this.cam.setViewOffset(w, h, -sh, 0, w, h); }
    else this.cam.setViewOffset(w, h, 0, h * 0.32, w, h);
    // (while a page slides the shadows hold still for a moment; then they follow the turntable again)
    const busy = performance.now() < this.busyUntil; R.shadowMap.autoUpdate = !busy; if (!busy && this.wasBusy) R.shadowMap.needsUpdate = true; this.wasBusy = busy;
    R.render(this.scene, this.cam);
    this.dirty = false;
  }
}
let room = null, roomTried = false;
/** a driver's portrait (head and shoulders, team kit and cap - their own face), rendered once, a data URL */
const PORTRAITS = new Map();
let PRT = null;
function portrait(d, color, color2) {
  if (!room || !d) return '';
  const key = `${d.name}|${color}|${lookStamp(d.name)}`; if (PORTRAITS.has(key)) return PORTRAITS.get(key);
  const N = 112, sc = new THREE.Scene(); sc.background = new THREE.Color('#e9edf2');
  sc.add(new THREE.HemisphereLight(0xffffff, 0x8a8f99, 1.7)); const dl = new THREE.DirectionalLight(0xffffff, 1.9); dl.position.set(2, 2.5, 1.5); sc.add(dl);
  const P = makePerson({ pose: 'talk', kit: color ? 'suit' : 'polo', color: color || '#5b6573', accent: color2 || '#ffffff', cap: !!color, driver: d.name, jitter: 0 });
  sc.add(P.group); P.group.updateMatrixWorld(true); const hp = new THREE.Vector3(); P.head.getWorldPosition(hp);
  const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 10); cam.position.set(hp.x + 0.62, hp.y + 0.1, hp.z + 0.2); cam.lookAt(hp.x, hp.y + 0.03, hp.z);
  // (one small render target, made the first time and kept)
  const R = room.renderer, px = new Uint8Array(N * N * 4); if (!PRT) PRT = new THREE.WebGLRenderTarget(N, N, { samples: 4 });
  R.setRenderTarget(PRT); R.render(sc, cam); R.readRenderTargetPixels(PRT, 0, 0, N, N, px); R.setRenderTarget(null); P.dispose();
  const cv = document.createElement('canvas'); cv.width = cv.height = N; const x = cv.getContext('2d'), img = x.createImageData(N, N);
  for (let y = 0; y < N; y++) for (let i = 0; i < N * 4; i++) { let v = px[(N - 1 - y) * N * 4 + i]; if (i % 4 < 3) v = Math.round(255 * Math.pow(v / 255, 1 / 2.2)); img.data[y * N * 4 + i] = v; }
  x.putImageData(img, 0, 0);
  const url = cv.toDataURL('image/jpeg', 0.88); PORTRAITS.set(key, url); return url;
}
// (a face not drawn yet is the driver's initials in the team's colour; the portrait comes in a frame or two later)
const FACE_ID = new Map(), FACE_Q = new Map();
let faceN = 0;
/** a driver's face for a card: the portrait when it is ready, else the initials, queued (never rendered while a page is built) -> html */
function face(d, color, color2) {
  if (!room || !d) return '';
  const key = `${d.name}|${color}|${lookStamp(d.name)}`, url = PORTRAITS.get(key);
  if (url) return `<img class="face" src="${url}" alt="">`;
  let id = FACE_ID.get(key); if (!id) { id = `f${++faceN}`; FACE_ID.set(key, id); }
  FACE_Q.set(id, { d: { name: d.name }, color, color2 });
  return `<span class="face k-ava" data-face="${id}" style="--c:${esc(ink(color || '#8a93a0'))}"><b>${esc(initials(d.name))}</b></span>`;
}
/** a driver's portraits forgotten (their look changed: drawn again when next shown) */
function purgePortraits(name) {
  const pre = `${name}|`;
  for (const k of [...PORTRAITS.keys()]) if (k.startsWith(pre)) PORTRAITS.delete(k);
  for (const k of [...FACE_ID.keys()]) if (k.startsWith(pre)) FACE_ID.delete(k);
}
/** the queued faces drawn, at most one a frame, each swapped in where it is still on screen */
function drainFaces() {
  for (const [id, j] of FACE_Q) {
    FACE_Q.delete(id);
    later(() => {
      // (gone from the screen already: drawn next time it is needed instead)
      const ph = document.querySelectorAll(`#career [data-face="${id}"]`); if (!ph.length) return;
      const url = portrait(j.d, j.color, j.color2); if (!url) return;
      for (const x of ph) { if (!x.isConnected) continue; const im = document.createElement('img'); im.className = 'face k-in'; im.alt = ''; im.src = url; x.replaceWith(im); }
    });
  }
}
/** the faces most likely to be needed, drawn while the hub is idle: your seats, the market's first page, the drivers you know best */
function prewarm(c) {
  const run = () => {
    if (!room || HUB?.c !== c) return;
    const team = c.team, L = [], seen = new Set(), add = (d, t) => { if (!d || seen.has(d.id)) return; seen.add(d.id); L.push([d, t?.color, t?.color2]); };
    for (const d of c.seatsOf(team.name)) add(d, team);
    for (const d of Object.values(c.drivers).filter((x) => x.alive && x.team !== team.name).sort((a, b) => b.rating - a.rating).slice(0, 8)) add(d, d.team ? c.teams[d.team] : null);
    for (const [id] of Object.entries(c.rapport || {}).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 12)) { const d = c.drivers[id]; if (d?.alive) add(d, d.team ? c.teams[d.team] : null); }
    for (const [d, col, col2] of L) later(() => { if (HUB?.c === c) portrait(d, col, col2); });
  };
  setTimeout(() => (window.requestIdleCallback ? window.requestIdleCallback(run, { timeout: 2000 }) : setTimeout(run, 200)), 600);
}

function root() {
  ensureMotion(); injectCSS();
  let el = document.getElementById('career');
  if (!el) { el = document.createElement('div'); el.id = 'career'; el.innerHTML = '<div class="ch-ui"></div>'; document.body.appendChild(el); }
  el.classList.add('k-light');
  if (!roomTried) { roomTried = true; try { room = new Showroom(el); } catch (e) { room = null; } window.addEventListener('resize', () => resized(el)); window.__careerRoom = room; }   // (no WebGL: the panels over the plain studio colour; the room on window for the test console)
  return el;
}
const ui = (el) => el.querySelector('.ch-ui');
/** where the panel ends (the 3D car centres itself in the space to its right); the side card only where there is room for it */
const layout = (el) => {
  const p = el.querySelector('.ch-panel'); if (!p) return;
  const r = p.getBoundingClientRect().right;
  if (room && Math.abs(r - room.panelRight) > 0.5) { room.panelRight = r; room.dirty = true; }
  el.querySelector('.ch-side')?.classList.toggle('k-narrow', innerWidth - r < 300);
};
let resizeT = 0;
function resized(el) {
  layout(el); el.classList.toggle('short', innerHeight < 700);
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    const X = HUB; if (!X || X.el !== el || X.mode !== 'hub' || el.style.display === 'none') return;
    if (innerWidth < 700) room?.stop(); else if (!X.scene && !el.classList.contains('away')) room?.start();
    // (lists page to the space they have: a resize that changes it draws the page again, in place)
    const f = fitOf(el), o = X.fit || f;
    if (Math.abs(f.h - o.h) > 24 || Math.abs(f.w - o.w) > 24) go(X.tab, { ...X.S }, { how: 'same' });
  }, 150);
}
const fitOf = (el) => { const p = el.querySelector('.ch-pages'); return { w: p?.clientWidth || 766, h: p?.clientHeight || 580 }; };

/**
 * Open the career: a new one if there is none, else the hub.
 * o: { roster: ROSTER, tracks: [ids], currentTrack, helmet(driver) -> data URL, onRace(career), onClose(), music(on),
 * audio (the AudioEngine: the evenings out use it), onHangout(launch, done, career) (main.js stages an evening in the
 * real world and calls done(result) once; without it the evening opens over the hub on its own) }
 */
export function openCareer(o) {
  const el = root(); el.style.display = ''; el.classList.remove('dim', 'away');
  // (the first frame fades in and settles: the bar drops, the rail and the panel slide in)
  el.classList.add('boot'); setTimeout(() => el.classList.remove('boot'), 600);
  el.classList.toggle('short', innerHeight < 700);
  if (innerWidth >= 700) room?.start();
  const career = Career.load(); syncLooks(career);
  if (!career) newCareer(el, o); else hub(el, career, o);
}
/** one driver's own look registered by name (People draws them by it, HelmetDesigns paints their helmet; null: gone again) */
function registerLook(name, look) {
  if (!name) return null;
  const P = look ? Avatar.personOpts(look) : null;
  setDriverLook(name, P); setHelmetDesign(name, P?.helmet || null);
  return P;
}
/**
 * The career's own looks (each custom driver's - yours, and one lost whose memorial keeps his face) registered by name,
 * everything registered before cleared first (c null: just cleared - a new career, a career erased). Every scene that
 * builds a driver by name then draws them as the save has them: the hub, the grid, the podium, the interviews, the news,
 * the hangouts, the cockpit's helmet. main.js calls it before a weekend too.
 */
export function syncLooks(c) {
  clearDriverLooks(); clearHelmetDesigns();
  for (const d of Object.values(c?.drivers || {})) if (d && d.look && d.name) registerLook(d.name, d.look);
}
/** hide the hub (the room stops drawing; the hub itself is kept, so an evening out can bring it back where it was) */
export function closeCareer() {
  const el = document.getElementById('career'); if (el) el.style.display = 'none';
  room?.stop();
  try { styleLeave(true); } catch (e) { console.warn('CareerHub: the style preview', e); }
  if (HUB) { HUB.pop?.close(); HUB.pop = null; HUB.drawer?.close(); HUB.drawer = null; HUB.unkeys?.(); HUB.unkeys = null; HUB.sheet?.close(); HUB.sheet = null; }
}

// ---- a new career ---------------------------------------------------------------------------------------------------
// (the creator, for the one key listener that turns your figure on the look step: ← and →)
let WIZ = null, wizKeys = false;
const STEP_NAME = { who: 'WHO YOU ARE', look: 'YOUR LOOK', season: 'YOUR SEASON' };
// (the look step's camera: your face, all of you, your helmet)
const CC_VIEW = { face: 'ccFace', full: 'cc', helmet: 'ccHelmet' };
/**
 * A new career, a step at a time: who you are (one of the grid, or a driver and team of your own), your look (your own
 * driver only: the face, the hair, the skin and eyes, the suit and helmet - live on your figure in the studio's drivers'
 * corner), your season. The look goes into the save with the career (Career.create: on your driver's record).
 */
function newCareer(el, o) {
  o.music?.(false);
  HUB?.unkeys?.(); HUB?.unrep?.(); HUB = { el, o, c: null, mode: 'wizard' };
  room?.setMood('normal'); room?.clearAvatar(); syncLooks(null);
  const st = { at: 'who', driver: null, rounds: 6, laps: 5, diff: 75, custom: { name: 'E. Esselink', teamName: 'Esselink Racing', color: '#00d4ff', color2: '#ffffff' },
    look: null, lookDirty: false, lookTab: 0, cap: false, cam: null };
  WIZ = { el, st };
  const teams = []; for (const [i, r] of o.roster.entries()) { let t = teams.find((x) => x.name === r.team); if (!t) teams.push((t = { name: r.team, color: r.color, color2: r.color2, d: [] })); t.d.push({ ...r, i }); }
  const sel = () => (st.driver === 'custom' ? null : o.roster[st.driver]);
  const nm = () => String(st.custom.name || '').trim().replace(/\s+/g, ' ') || 'Custom Driver';
  // (a name already in the paddock can't be yours: everything that finds a driver by name would find two)
  const taken = () => st.driver === 'custom' && Career.nameTaken(st.custom.name);
  const steps = () => (st.driver === 'custom' ? ['who', 'look', 'season'] : ['who', 'season']);
  // (your look to start from: you as the game would have drawn you from your name - re-drawn if the name or the colours
  // change before you touch it; once you have, it is yours)
  const draft = () => Avatar.lookFrom(baseLook(nm()), { color: st.custom.color, color2: st.custom.color2, name: nm() });
  const looking = () => HUB?.el === el && HUB.mode === 'wizard' && st.at === 'look' && WIZ?.st === st;
  const reg = () => { syncLooks(null); if (st.driver === 'custom' && st.look) registerLook(nm(), st.look); };
  const showCar = () => {
    const r = sel();
    if (st.driver === 'custom') room?.setCar({ color: st.custom.color, color2: st.custom.color2, helmet: st.look?.helmet?.c?.[0] || st.custom.color2, number: 99, team: st.custom.teamName, driver: st.look ? nm() : undefined });
    else if (r) room?.setCar({ color: r.color, color2: r.color2, helmet: r.helmet, number: r.number, driver: r.name, team: r.team });
    else room?.setCar({ color: '#e10600', color2: '#ffffff', number: 1, team: 'Formula 1' });
    el.style.setProperty('--tc', st.driver === 'custom' ? st.custom.color : r ? r.color : '#e10600');
  };
  // (your figure, built again a moment after a change ends - every 160 ms while a slider moves - one at a time, as a
  // frame job off the click; the studio draws only then: still, it costs the GPU nothing)
  const camOf = () => st.cam || (st.lookTab === 3 ? 'full' : 'face');
  const pill = () => { for (const b of el.querySelectorAll('.lk-cam [data-lview]')) b.classList.toggle('on', b.dataset.lview === camOf()); };
  // (while a slider moves the figure is a lighter draft; the full one follows when it is let go)
  let pvT = 0, pvAt = 0, pvQ = false, pvDraft = false, LE = null;
  const build = () => {
    pvAt = performance.now(); if (pvQ) return; pvQ = true;
    avJob(() => { pvQ = false; if (!looking()) return; room?.setAvatar({ name: nm(), color: st.custom.color, color2: st.custom.color2, team: st.custom.teamName, cap: st.cap, draft: pvDraft }); showCar(); room?.view(CC_VIEW[camOf()]); pvAt = performance.now(); });
  };
  const preview = (kind) => {
    clearTimeout(pvT); pvDraft = kind === 'slide';
    // (a moving slider: a draft no sooner than the gap the last one earned (room.avGap) after it finished - never one
    // queued behind another)
    if (kind === 'slide') { const gap = room?.avGap?.() ?? 160, dt = performance.now() - pvAt; if (dt >= gap && !pvQ) build(); else pvT = setTimeout(build, Math.max(16, gap - dt)); }
    else pvT = setTimeout(build, kind === 'now' ? 240 : 90);   // (on arriving: once the step has slid in)
  };
  const lookChanged = (L, kind) => { st.look = L; st.lookDirty = true; reg(); preview(kind); };
  const leave = () => { LE = null; clearTimeout(pvT); if (WIZ?.st === st) WIZ = null; room?.clearAvatar(); syncLooks(null); PPL.faceCacheTrim?.(4); };
  const lookOpts = () => ({ tab: st.lookTab, team: { color: st.custom.color, color2: st.custom.color2 }, teamEdit: true, base: baseLook(nm()), name: nm() });
  const draw = (dir = 0) => {
    const S = steps(); if (!S.includes(st.at)) st.at = 'who';
    const at = st.at, i = S.indexOf(at), r = sel(), look = at === 'look', tk = taken();
    if (look) { if (!st.look) st.look = draft(); reg(); }
    showCar();
    // (off the look step: your figure out of sight but kept - back on it at once, its shaders never compiled again - and
    // the idle faces its slider edits left in the cache freed)
    if (look) room?.view(CC_VIEW[camOf()]); else { LE = null; const had = !!room?.avP; room?.hideAvatar?.(); if (had) PPL.faceCacheTrim?.(4); room?.view('wizard'); }
    const step1 = `<h2>Who are you?</h2><p class="lead">You are a driver and the owner of your team. Choose who you are: you race as them for as long as they live. Death is permanent.</p>
      <div class="tl wz1">${teams.map((t) => `<div class="teamrow"><div class="tn"><span class="sw" style="background:${esc(ink(t.color))}"></span>${esc(t.name)}</div>${t.d.map((d) => `<button class="pick${st.driver === d.i ? ' on' : ''}" data-d="${d.i}" style="--c:${esc(t.color)}"><b>${esc(d.name)} <span class="muted">#${d.number}</span></b><small>rating ${Math.round(d.rating * 100)}</small></button>`).join('')}</div>`).join('')}
        <div class="teamrow"><div class="tn"><span class="sw" style="background:${esc(st.custom.color)}"></span>Your own</div><button class="pick${st.driver === 'custom' ? ' on' : ''}" data-d="custom" style="--c:${esc(st.custom.color)};grid-column:span 2"><b>★ A new team on the grid</b><small>your name, your colours, your look · a backmarker's car and budget</small></button></div></div>
      ${st.driver === 'custom' ? `<div class="detail"><div class="row"><input type="text" data-f="name" value="${esc(st.custom.name)}" maxlength="18" placeholder="Driver"><input type="text" data-f="teamName" value="${esc(st.custom.teamName)}" maxlength="22" placeholder="Team"><input type="color" data-f="color" value="${esc(st.custom.color)}" title="Colour"><input type="color" data-f="color2" value="${esc(st.custom.color2)}" title="Accent"></div></div>` : ''}
      <div class="row" style="margin-top:16px"><span class="tk" data-tk>${tk ? 'That name is already in the paddock: choose another.' : ''}</span><span class="grow"></span><button class="go" data-a="next" ${st.driver == null || tk ? 'disabled' : ''}>NEXT · ${STEP_NAME[S[1]]} →</button></div>`;
    const stepLook = `<div class="lk-hd"><div><h2>Your look</h2><p class="lead">How the paddock, the podium and the cameras see you.</p></div><button data-lk="random" title="A face at random (your suit and helmet stay)">⟳ RANDOMISE</button></div>
      ${lookEditorHTML(st.look, lookOpts())}
      <div class="row lk-foot"><button data-a="back">← BACK</button><span class="grow lk-note" style="text-align:center">Yours to change any time: DRIVER › Look</span><button class="go" data-a="next">NEXT · YOUR SEASON →</button></div>`;
    const step2 = `<h2>Your season</h2><p class="lead">${r ? `${esc(r.name)}, ${esc(r.team)}` : st.driver === 'custom' ? `${esc(nm())}, ${esc(st.custom.teamName)}` : ''} - driver and owner. The calendar cycles through the circuits; the weather and the time of day are drawn on race day.</p>
      <span class="lbl">Season length</span><div class="seg">${[4, 6, 8, 10].map((n) => `<button data-r="${n}" class="${st.rounds === n ? 'on' : ''}">${n} rounds</button>`).join('')}</div>
      <span class="lbl">Race distance</span><div class="seg">${DISTANCES.map(([v, n]) => `<button data-l="${v}" class="${st.laps === v ? 'on' : ''}">${esc(n)}</button>`).join('')}</div>
      <span class="lbl">Difficulty · <span data-dv>${st.diff} ${diffName(st.diff)}</span></span><div class="row"><input type="range" min="0" max="100" value="${st.diff}" data-diff><span class="muted">The only setting that stays yours - change it any time in the hub.</span></div>
      <div class="row" style="margin-top:22px"><button data-a="back">← BACK</button><span class="grow"></span><button class="go" data-a="begin" ${tk ? 'disabled' : ''}>BEGIN CAREER →</button></div>`;
    const pw = el.querySelector('.ch-panel')?.getBoundingClientRect().width || 0;
    ui(el).innerHTML = `
      <div class="ch-top glass"><div class="ch-badge">F1</div><div class="ch-title"><h1>CHAMPIONSHIP CAREER</h1><small>A new career · step ${i + 1} of ${S.length}</small></div><button data-a="close">← MENU</button></div>
      <div class="ch-nav glass">${S.map((k, j) => `<button class="${k === at ? 'on' : ''}" data-step="${k}" ${j > 0 && (st.driver == null || tk) ? 'disabled' : ''}><i>${j + 1}</i>${STEP_NAME[k]}</button>`).join('')}</div>
      <div class="ch-panel glass${look ? ' cc' : ''}"><div class="in"${look ? '' : ' data-scroll-ok'}>${at === 'who' ? step1 : look ? stepLook : step2}</div></div>${look ? lookCamHTML(camOf(), st.cap) : ''}`;
    layout(el);
    // (the panel narrower for the look step, wider either side of it: it eases from the width it had, never snaps)
    const pn = el.querySelector('.ch-panel'), nw = pn?.getBoundingClientRect().width || 0;
    if (pn && pw && dir && innerWidth > 899 && Math.abs(nw - pw) > 2) {
      pn.style.transition = 'none'; pn.style.width = `${pw}px`; void pn.offsetWidth;
      pn.style.transition = 'width 220ms cubic-bezier(.2,.7,.2,1)'; pn.style.width = `${nw}px`;
      const done = () => { pn.style.width = ''; pn.style.transition = ''; };
      pn.addEventListener('transitionend', done, { once: true }); setTimeout(done, 400);
    }
    // (a step arrives from the side it lies on)
    const inn = el.querySelector('.ch-panel > .in');
    if (dir && inn) { inn.style.setProperty('--m-k', dir > 0 ? 'm-in-right' : 'm-in-left'); inn.classList.add('m-arrive'); }
    if (look) {
      LE = wireLookEditor(el.querySelector('.ch-panel .lk'), st.look, { ...lookOpts(), camEl: () => el.querySelector('.lk-cam'),
        onChange: lookChanged,
        onTab: (t) => { st.lookTab = t; st.cam = null; pill(); room?.view(CC_VIEW[camOf()]); },
        onView: (v) => { st.cam = v; room?.view(CC_VIEW[camOf()]); },
        onCap: (on) => { st.cap = on; preview('cap'); },
        onTeam: (k, v) => { st.custom[k] = v; el.style.setProperty('--tc', st.custom.color); LE?.set(st.look, { team: { color: st.custom.color, color2: st.custom.color2 } }); showCar(); preview('team'); } });
      preview('now');
    }
  };
  draw();
  el.onmouseover = null;
  el.onclick = (e) => {
    if (LE?.click(e)) return;
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const d = b.dataset, S = steps(), to = (k) => { const dir = Math.sign(S.indexOf(k) - S.indexOf(st.at)); if (!dir) return; st.at = k; draw(dir); };
    if (d.lk === 'random') { if (!LE) return; const L = Avatar.randomLook(Math.random, st.look); LE.set(L); lookChanged(L, 'random'); return; }
    if (d.d != null) { st.driver = d.d === 'custom' ? 'custom' : +d.d; draw(); }
    else if (d.step) to(d.step);
    else if (d.a === 'next') { const j = S.indexOf(st.at); if (j < S.length - 1) to(S[j + 1]); }
    else if (d.a === 'back') { const j = S.indexOf(st.at); if (j > 0) to(S[j - 1]); }
    else if (d.r) { st.rounds = +d.r; draw(); }
    else if (d.l) { st.laps = +d.l; draw(); }
    else if (d.a === 'close') { leave(); closeCareer(); o.onClose?.(); }
    else if (d.a === 'begin' && st.driver != null && !taken()) {
      const custom = st.driver === 'custom' ? { ...st.custom, name: nm(), look: st.look || draft() } : st.custom;
      const c = Career.create({ driver: st.driver, custom, rounds: st.rounds, laps: st.laps, diff: st.diff, tracks: o.tracks, firstTrack: o.currentTrack }); c.save();
      leave(); syncLooks(c); hub(el, c, o);
    }
  };
  el.oninput = (e) => {
    if (LE?.input(e)) return;
    const f = e.target.dataset.f;
    if (f) {
      st.custom[f] = e.target.value;
      if (f === 'color' || f === 'color2' || f === 'teamName') showCar();
      if ((f === 'name' || f === 'color' || f === 'color2') && !st.lookDirty) st.look = null;
      if (f === 'name') {
        const tk = taken(), nx = el.querySelector('[data-a="next"]'), note = el.querySelector('[data-tk]');
        if (nx) nx.disabled = st.driver == null || tk; if (note) note.textContent = tk ? 'That name is already in the paddock: choose another.' : '';
        for (const b of el.querySelectorAll('.ch-nav [data-step]')) if (b.dataset.step !== 'who') b.disabled = st.driver == null || tk;
      }
    }
    if (e.target.dataset.diff != null) { st.diff = +e.target.value; el.querySelector('[data-dv]').textContent = `${st.diff} ${diffName(st.diff)}`; }
  };
  el.onchange = (e) => { LE?.change(e); };
  // (← and → turn your figure on the look step - never while a field or a slider has the keys)
  if (!wizKeys) {
    wizKeys = true;
    document.addEventListener('keydown', (e) => {
      const W = WIZ; if (!W || HUB?.el !== W.el || HUB.mode !== 'wizard' || W.st.at !== 'look' || W.el.style.display === 'none') return;
      if (e.target?.closest?.('input, textarea, select') || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
      e.preventDefault(); room?.turnAvatar((e.key === 'ArrowLeft' ? -1 : 1) * Math.PI / 12);
    });
  }
}

// ---- line charts (inline SVG, hover for the values, the legend to pick lines out) ---------------------------------
/**
 * series: [{ key, name, short, color, bold, pts: [value per x | null] }], xs: labels.
 * o: { invert (smaller is better: at the top), fmt(v), int (whole-number ticks), w, h (the drawing's size: the page's
 * room for it) } -> html; wireChart() after it is in the page
 */
function chartHTML(id, series, xs, o = {}) {
  const W = Math.round(o.w || 620), H = Math.round(o.h || 300), P = { l: 50, r: 64, t: 14, b: 28 };
  const all = series.flatMap((s) => s.pts).filter((v) => v != null && isFinite(v));
  if (!all.length || xs.length < 2) return `<div class="chart" style="padding:26px;text-align:center"><span class="muted">Not enough races yet - the lines start after your first round.</span></div>`;
  let lo = Math.min(...all), hi = Math.max(...all); if (hi - lo < 1e-6) { hi += o.int ? 1 : 0.5; lo -= o.int ? 0 : 0.5; }
  if (o.int) { lo = Math.floor(lo); hi = Math.ceil(hi); }
  const pad = (hi - lo) * 0.06; if (!o.int) { lo -= pad; hi += pad; }
  const X = (i) => P.l + (i / (xs.length - 1)) * (W - P.l - P.r);
  const Y = (v) => (o.invert ? P.t + ((v - lo) / (hi - lo)) * (H - P.t - P.b) : P.t + (1 - (v - lo) / (hi - lo)) * (H - P.t - P.b));
  const ticks = o.int ? (() => { const st = Math.max(1, Math.ceil((hi - lo) / 5)); const a = []; for (let v = lo; v <= hi; v += st) a.push(v); return a; })() : [0, 0.25, 0.5, 0.75, 1].map((f) => lo + (hi - lo) * f);
  const fmt = o.fmt || ((v) => (Math.abs(v) >= 10 ? Math.round(v) : v.toFixed(1)));
  const grid = ticks.map((v) => `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="#e8ebf0"/><text x="${P.l - 8}" y="${(Y(v) + 4).toFixed(1)}" fill="#6b7480" font-size="11" text-anchor="end">${esc(fmt(v))}</text>`).join('');
  const xl = xs.map((x, i) => `<text x="${X(i).toFixed(1)}" y="${H - 8}" fill="#6b7480" font-size="11" text-anchor="middle">${esc(x)}</text>`).join('');
  const order = [...series].sort((a, b) => (a.bold ? 1 : 0) - (b.bold ? 1 : 0));   // (yours drawn last, on top)
  const lines = order.map((s) => {
    const pts = s.pts.map((v, i) => (v == null || !isFinite(v) ? null : [X(i), Y(v)])).filter(Boolean); if (!pts.length) return '';
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
    return `<g class="ln" data-k="${esc(s.key)}"><path d="${d}" fill="none" stroke="${esc(s.color)}" stroke-width="${s.bold ? 3.6 : 2}" stroke-linejoin="round" stroke-linecap="round"/>${pts.map((p) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${s.bold ? 4.4 : 3}" fill="${esc(s.color)}" stroke="#fff" stroke-width="1.5"/>`).join('')}</g>`;
  }).join('');
  // the end labels, nudged apart
  const ends = series.map((s) => { let i = s.pts.length - 1; while (i >= 0 && (s.pts[i] == null || !isFinite(s.pts[i]))) i--; return i < 0 ? null : { s, x: X(i), y: Y(s.pts[i]) }; }).filter(Boolean).sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 12) ends[i].y = ends[i - 1].y + 12;
  const labels = ends.map((e) => `<text class="ln" data-k="${esc(e.s.key)}" x="${(e.x + 8).toFixed(1)}" y="${(e.y + 4).toFixed(1)}" fill="${esc(e.s.color)}" font-size="11" font-weight="${e.s.bold ? 800 : 700}">${esc(e.s.short)}</text>`).join('');
  const legend = series.map((s) => `<button data-leg="${esc(s.key)}"><span class="sw" style="background:${esc(s.color)}"></span>${esc(s.name)}${s.bold ? ' ★' : ''}</button>`).join('');
  CHARTS.set(id, { series, xs, X, fmt, W, P, invert: !!o.invert });
  return `<div class="chart" data-chart="${id}"><svg viewBox="0 0 ${W} ${H}">${grid}${xl}${lines}${labels}<line class="guide" x1="0" x2="0" y1="${P.t}" y2="${H - P.b}" stroke="#151a22" stroke-opacity="0" stroke-dasharray="3 3"/><rect class="hit" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}" fill="transparent"/></svg><div class="tip"></div><div class="legend">${legend}</div></div>`;
}
const CHARTS = new Map();
function wireChart(root0) {
  for (const box of root0.querySelectorAll('[data-chart]')) {
    const C = CHARTS.get(box.dataset.chart); if (!C) continue;
    const svg = box.querySelector('svg'), tip = box.querySelector('.tip'), guide = svg.querySelector('.guide'), focus = new Set();
    const paint = () => { for (const g of svg.querySelectorAll('.ln')) g.style.opacity = !focus.size || focus.has(g.dataset.k) ? 1 : 0.12; for (const b of box.querySelectorAll('[data-leg]')) b.classList.toggle('off', focus.size > 0 && !focus.has(b.dataset.leg)); };
    box.querySelector('.legend').onclick = (e) => { const b = e.target.closest('[data-leg]'); if (!b) return; e.stopPropagation(); const k = b.dataset.leg; if (focus.has(k)) focus.delete(k); else focus.add(k); paint(); };
    svg.querySelector('.hit').onmousemove = (e) => {
      const r = svg.getBoundingClientRect(), sx = ((e.clientX - r.left) / r.width) * C.W;
      let i = 0, best = Infinity; C.xs.forEach((_, j) => { const d = Math.abs(C.X(j) - sx); if (d < best) { best = d; i = j; } });
      guide.setAttribute('x1', C.X(i)); guide.setAttribute('x2', C.X(i)); guide.setAttribute('stroke-opacity', 0.4);
      const rows = C.series.filter((s) => s.pts[i] != null && isFinite(s.pts[i]) && (!focus.size || focus.has(s.key))).sort((a, b) => (C.invert ? a.pts[i] - b.pts[i] : b.pts[i] - a.pts[i]));
      tip.innerHTML = `<div style="opacity:.7;font-weight:700">${esc(C.xs[i])}</div>` + rows.slice(0, 9).map((s) => `<div><span class="sw" style="background:${esc(s.color)}"></span>${esc(s.short)}<b>${esc(C.fmt(s.pts[i]))}</b></div>`).join('');
      const px = (C.X(i) / C.W) * r.width, bx = box.getBoundingClientRect();
      tip.style.left = `${Math.min(r.width - 150, px + 14) + (r.left - bx.left)}px`; tip.style.top = `${(e.clientY - bx.top) - 20}px`; tip.style.opacity = 1;
    };
    svg.querySelector('.hit').onmouseleave = () => { tip.style.opacity = 0; guide.setAttribute('stroke-opacity', 0); };
  }
}

// ---- the hub: sections, sub-tabs, memory ------------------------------------------------------------------------------
/**
 * The rail's seven sections, each with its sub-tabs [page, sub, label]. The page is the screen's key (what a click
 * hands back: { tab: 'week' }); the sub picks a page inside it ('' = its first). IN MEMORIAM has one quiet page.
 */
const SECTIONS = [
  ['race', '◉', 'RACE WEEK', [['overview', '', 'Briefing'], ['week', '', 'The week'], ['overview', 'cal', 'Calendar']]],
  ['team', '⚙', 'TEAM', [['dev', '', 'Tech tree'], ['dev', 'factory', 'Factory'], ['drivers', '', 'Your drivers'], ['drivers', 'market', 'Market']]],
  ['driver', '☺', 'DRIVER', [['you', '', 'Form'], ['you', 'licence', 'Licence'], ['you', 'record', 'Record'], ['you', 'look', 'Look']]],
  ['life', '♥', 'LIFE', [['life', '', 'Partners'], ['life', 'style', 'Style'], ['life', 'people', 'People'], ['social', '', 'Paddock'], ['social', 'hangout', 'Hang out'], ['social', 'invites', 'Invites']]],
  ['media', '✉', 'MEDIA', [['pr', '', 'Pulse'], ['pr', 'posts', 'Social'], ['pr', 'deals', 'Deals'], ['pr', 'press', 'Press'], ['pr', 'news', 'News']]],
  ['season', '≡', 'SEASON', [['standings', '', 'Drivers'], ['standings', 'teams', 'Constructors'], ['standings', 'results', 'Results'], ['charts', '', 'Charts'], ['trophies', '', 'Trophies'], ['trophies', 'seasons', 'History']]],
  ['lost', '✝', 'IN MEMORIAM', [['lost', '', 'In Memoriam']]],
];
// (the old flat tabs, still asked for by name: the news lives in MEDIA now, the rapport in LIFE's paddock)
const LEGACY = { news: ['pr', { sub: 'news' }], rapport: ['social', { sub: '', filter: 'grid', sort: 'rapport' }] };
const SECTION_OF = {}, SEC_I = {}, SUB_I = {}, LEAF = new Set();
SECTIONS.forEach(([k, , , subs], i) => { SEC_I[k] = i; subs.forEach(([t, s], j) => { SECTION_OF[`${t}/${s}`] = k; SUB_I[`${t}/${s}`] = j; LEAF.add(t); }); });
// (each section remembers the page you were on, each page its list state: coming back finds things as you left them)
const MEM = {};
const PREV = { nums: {} };
const SEEN = { trophies: 0 };
let HUB = null;
// (the tab closing or hidden - a reload, the laptop sleeping - with an edit still waiting on its timer: saved now, never lost.
// The Look tab's half-second save, LIFE › Style's)
{
  const flush = () => {
    if (HUB?.lkSave) { clearTimeout(HUB.lkSave); HUB.lkSave = 0; try { HUB.c?.save?.(); } catch (e) { console.warn('CareerHub: save failed', e); } }
    try { styleFlush(); } catch (e) { /* (nothing waiting) */ }
  };
  addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
}
/** the next race's circuit (the calendar's next round; the last one once the season is over) */
const trackAt = (c) => c.calendar[Math.min(c.round, c.rounds) - 1] || c.calendar[0];

function hub(el, c, o, tab = 'overview', S = {}) {
  HUB?.unkeys?.(); HUB?.unrep?.();
  HUB = { el, c, o, mode: 'hub', sec: null, tab: null, sub: null, S: {}, fit: null, pop: null, drawer: null, scene: false, unkeys: null, unrep: null };
  SEEN.trophies = c.trophies.length - (c.report && !c.report.seen ? (c.report.trophies || []).length : 0);
  shell(el, c, o);
  go(tab, S);
  prewarm(c);
}
/** the frame built once: the top bar, the rail, the panel with its sub-tabs, the side card; one click router for all of it */
function shell(el, c, o) {
  ui(el).innerHTML = `
    <header class="ch-top glass"><div class="ch-badge" data-bind="badge"></div>
      <div class="ch-title"><h1 data-bind="title"></h1><small data-bind="sub"></small></div>
      <div class="ch-pills"><span class="ch-pill" data-bind="pos"></span><span class="ch-pill" data-bind="budget" title="The team's budget"></span><span class="ch-pill w" data-bind="wallet" title="Your own money"></span></div>
      <button class="ch-ico" data-a="phone" title="Your phone (P)">✆<em data-bind="phone" class="hidden"></em></button><button class="ch-ico" data-a="gear" title="Settings">⚙</button>
      <div class="ch-race" data-bind="race"></div><button data-a="close">MENU</button></header>
    <nav class="ch-rail ch-nav glass"><span class="ind"></span>${SECTIONS.map(([k, ic, n], i) => `${k === 'lost' ? '<span class="sp"></span><span class="dv"></span>' : ''}<button data-sec="${k}" title="${esc(n)} (${i + 1})"><i>${ic}</i>${esc(n)}<em class="hidden"></em></button>`).join('')}</nav>
    <section class="ch-panel glass"><div class="ch-head"><div class="k-seg ch-sub"></div><div class="slot"></div></div><div class="ch-pages"></div></section>
    <aside class="ch-side glass k-hide"></aside>
    <div class="ch-modal-host"></div>`;
  HUB.subKey = null; HUB.raceKey = null; HUB.sideKey = null;
  el.onclick = click;
  el.oninput = (e) => {
    const X = HUB; if (!X || X.mode !== 'hub') return;
    if (X.lk?.input(e)) return;   // (DRIVER › Look: your own look's sliders and colours)
    if (e.target.dataset.laps != null) { X.c.laps = +e.target.value || 5; X.c.save(); return; }   // (the race distance, from the next race on)
    if (e.target.dataset.diff != null) { X.c.diff = +e.target.value; const l = el.querySelector('.pop-dv'); if (l) l.textContent = `${X.c.diff} ${diffName(X.c.diff)}`; X.c.save(); }
  };
  el.onchange = (e) => { const X = HUB; if (X && X.mode === 'hub') X.lk?.change(e); };
  // (the trophy room: pointing at a trophy reads out what it takes)
  el.onmouseover = (e) => { const t = e.target.closest?.('[data-tdesc]'); if (!t) return; const L = el.querySelector('.tro-line'); if (L && L.textContent !== t.dataset.tdesc) L.textContent = t.dataset.tdesc; };
  bindKeys(HUB);
}
/** the hub's keys: 1-7 the sections, Q/E the sub-tabs, the arrows the pages of a list, Esc back out of a step, R the race menu, P the phone */
function bindKeys(X) {
  X.unkeys?.();
  const map = {};
  SECTIONS.forEach(([k], i) => { map[String(i + 1)] = () => goSec(k); });
  Object.assign(map, {
    q: () => subStep(-1), e: () => subStep(1),
    ArrowLeft: () => pageStep(-1), ArrowRight: () => pageStep(1),
    Escape: () => backStep(),
    r: () => { const b = X.el.querySelector('.ch-caret:not(:disabled)'); if (!b) return 'pass'; openRaceMenu(b); return undefined; },
    p: () => { openPhone(); },
  });
  X.unkeys = keys(X.el, map, { when: () => HUB === X && X.mode === 'hub' && !X.scene && !X.el.classList.contains('away') && !document.getElementById('mourning') && !document.getElementById('phone') && !document.getElementById('hangout') && !document.getElementById('nego') });
}
/** your look can be changed: a driver of your own making, still with you (one of the grid looks like himself) */
const canEditLook = (c) => !!c?.me && c.me.alive && c.me.from === 'Custom';
// (a section's sub-tabs as they show: DRIVER's Look only for a driver of your own - always the last, so no index moves)
const subsOf = (sec) => (SECTIONS[SEC_I[sec]]?.[3] || []).filter(([t, s]) => !(t === 'you' && s === 'look') || canEditLook(HUB?.c));
function goSec(k) {
  const X = HUB; if (!X || k === X.sec || SEC_I[k] == null) return;
  const [t, s] = MEM[k] || subsOf(k)[0];
  closePop(); go(t, { ...(MEM[`${t}/${s}`] || {}), sub: s });
}
function subStep(d) {
  const X = HUB, L = subsOf(X.sec), i = SUB_I[`${X.tab}/${X.sub}`] ?? 0, j = clamp(i + d, 0, L.length - 1);
  if (j === i) return; const [t, s] = L[j]; go(t, { ...(MEM[`${t}/${s}`] || {}), sub: s });
}
/** the arrow keys: the page's pager (the hub's own, HubSocial's, In Memoriam's) one page back or on */
function pageStep(d) {
  const X = HUB, P = X.el.querySelector('.ch-panel'), pg = P?.querySelector('.ch-head .slot .k-pager, .ch-head .slot .hs-pager') || P?.querySelector('.ch-pages > .m-page:not(.m-leave) :is(.k-pager, .hs-pager, .lm-pg)');
  const B = pg ? [...pg.querySelectorAll('button')] : [], b = B.length ? (d < 0 ? B[0] : B[B.length - 1]) : null;
  if (!b || b.disabled) return 'pass'; b.click(); return undefined;
}
function backStep() {
  const X = HUB, S = X.S;
  if (S.step && S.step > 1) { go(X.tab, { ...S, step: S.step - 1 }); return undefined; }
  if (S.pick) { go(X.tab, { ...S, pick: null, step: null }); return undefined; }
  return 'pass';
}

// ---- the router -----------------------------------------------------------------------------------------------------
/**
 * Show a page. tab: the page's key (an old flat tab name works too); S: its state (S.sub the sub-page; S.msg, or S.tmsg
 * with S.tok, become a toast). g: { region: [keys] (only these parts of the page change), dir, how: 'same' (redraw in
 * place), fresh (a new page even for the same one) }. Only the page swaps - up or down between sections, sideways
 * between sub-pages and steps - while the bar, the rail and the side card stay and update in place.
 */
function go(tab, S0 = {}, g = {}) {
  const X = HUB; if (!X || X.mode !== 'hub') return;
  const { el, c, o } = X, pages = el.querySelector('.ch-pages'); if (!pages) return;
  let S = { ...(S0 || {}) };
  if (LEGACY[tab]) { const [t, add] = LEGACY[tab]; tab = t; S = { ...S, ...add }; }
  if (!LEAF.has(tab)) tab = 'overview';
  const sub = SECTION_OF[`${tab}/${S.sub || ''}`] && (tab !== 'you' || S.sub !== 'look' || canEditLook(c)) ? S.sub || '' : ''; S.sub = sub;
  // (what the last click did: a toast at the foot of the panel, not a block in the page - never in In Memoriam)
  if (tab !== 'lost') {
    if (S.msg) toast(pages, S.msg, { kind: S.mkind || 'info' });
    if (S.tmsg) toast(pages, S.tmsg, { kind: S.tok ? 'up' : 'down' });
  }
  delete S.msg; delete S.tmsg; delete S.tok; delete S.mkind;
  const sec = SECTION_OF[`${tab}/${sub}`], P = { sec: X.sec, tab: X.tab, sub: X.sub, S: X.S || {} };
  let how = 'swap', axis = 'y', dir = 1, stagger = true;
  if (!P.tab) how = 'first';
  else if (sec !== P.sec) dir = Math.sign(SEC_I[sec] - SEC_I[P.sec]) || 1;
  else if (tab !== P.tab || sub !== P.sub) { axis = 'x'; stagger = false; dir = Math.sign((SUB_I[`${tab}/${sub}`] ?? 0) - (SUB_I[`${P.tab}/${P.sub}`] ?? 0)) || 1; }
  else if ((S.pick || null) !== (P.S.pick || null) || (S.step ?? null) !== (P.S.step ?? null)) {
    axis = 'x'; stagger = false; dir = S.step != null && P.S.step != null && S.step !== P.S.step ? Math.sign(S.step - P.S.step) : S.pick || S.step ? 1 : -1;
  } else if (!g.fresh) how = 'same';
  if (g.how === 'same' && P.tab === tab && P.sub === sub) how = 'same';
  const calm = sec === 'lost';
  X.sec = sec; X.tab = tab; X.sub = sub; X.S = S;
  MEM[sec] = [tab, sub]; const keep = { ...S }; delete keep.armed; MEM[`${tab}/${sub}`] = keep;
  if (tab === 'trophies') SEEN.trophies = c.trophies.length;
  // the studio follows at once, and the rail and the sub-tabs move before the page is built
  stage(X, tab, S); railUI(X);
  X.fit = fitOf(el);
  const H = mkH(c, S, X.fit);
  let html; try { html = pageHTML(c, o, tab, S, H); } catch (e) { console.error('CareerHub: the page could not be drawn', tab, sub, e); html = '<div class="hub-wait"><h2>Not available</h2><p class="lead">This page could not be drawn just now.</p></div>'; }
  const T = document.createElement('template'); T.innerHTML = html || '';
  let head = T.content.querySelector('[data-slot="head"]'); head?.remove();
  if (tab === 'dev' && !sub) { head = techHead(T) || head; techRegions(T.content); }
  let pg = [...pages.children].find((x) => x.classList.contains('m-page') && !x.classList.contains('m-leave'));
  if (how === 'same' && pg) {
    if (g.region && patch(pg, T.innerHTML, g.region, { dir: g.dir || 0 })) { if (tab === 'dev') techTint(pg, T.content); }
    else { pg.classList.add('m-static'); pg.replaceChildren(T.content); }
  } else pg = swap(pages, T.content, { axis, dir, stagger: stagger && !calm, calm });
  slot(el, head, how !== 'same');
  settle(X, pg);
  refreshShell();
  reportUp(X, H);
  morningUp(X);   // (the night after a race, once, when the report is not up)
}
/** the hub's helpers for the page modules: H = { chartHTML, esc, money, ink, rapI, dTxt, face, fit, per, compact, calm, sub } */
function mkH(c, S, fit) {
  const per = (rowH, chrome = 0, cols = 1, min = 3) => Math.max(min, Math.floor((fit.h - chrome) / rowH)) * cols;
  return { chartHTML, esc, money, ink, rapI, dTxt, face, fit, per, compact: fit.h < 540, calm: graveNow(c), sub: S.sub || '' };
}
/** the page itself, from this file or from the module that owns it */
function pageHTML(c, o, tab, S, H) {
  const wait = (t) => `<div class="hub-wait"><h2>${esc(t)}</h2><p class="lead">This page is still being put together.</p></div>`;
  switch (tab) {
    case 'overview': return S.sub === 'cal' ? calendarHTML(c, S, H) : briefingHTML(c, S, H);
    case 'week': return hs('weekHTML', c, S, H) ?? wait('The week');
    case 'dev': return techPage(c, S, H);
    case 'drivers': return S.sub === 'market' ? marketHTML(c, S, H) : seatsHTML(c, S, H);
    case 'you': return S.sub === 'look' ? lookPageHTML(c, S, H) : hs('youHTML', c, S, H) ?? wait('Your driver');
    case 'life': return hs('lifeHTML', c, S, H) ?? wait('Personal');
    case 'social': return hs('socialHTML', c, S, H) ?? rapportHTML(c, S, H);
    case 'pr': return hs('prHTML', c, S, H) ?? wait('PR & media');
    case 'standings': return S.sub === 'teams' ? teamsHTML(c, S, H) : S.sub === 'results' ? resultsHTML(c, S, H) : standingsHTML(c, S, H);
    case 'charts': return chartsHTML(c, S, H);
    case 'trophies': return S.sub === 'seasons' ? historyHTML(c, S, H) : trophiesHTML(c, S, H);
    case 'lost': return lostHTML(c, o, S, H);
    default: return briefingHTML(c, S, H);
  }
}
/** the studio for the page: the car and your drivers, the podium, the cabinet, the mood, the strings, the camera */
function stage(X, tab, S) {
  const { c, o } = X, team = c.team, me = c.me;
  o.music?.(tab === 'lost' && c.lost.length > 0);   // (In Memoriam: the strings)
  room?.setMood(tab === 'lost' ? 'dim' : 'normal');
  X.el.style.setProperty('--tc', team.color);
  const shown = me && me.alive && me.team === team.name ? me : c.seatsOf(team.name)[0];
  room?.setCar({ color: team.color, color2: team.color2, helmet: shown?.helmet, number: shown?.number ?? 1, driver: shown?.name, team: team.name });
  // (the studio's areas: your drivers in their corner, the championship's top three on the podium, the trophies)
  room?.setCrew(c.seatsOf(team.name).map((d) => ({ name: d.name, color: team.color, color2: team.color2, team: team.name, me: d.id === c.playerId })));
  // (DRIVER › Look: you alone in the corner as you are making yourself - the pair back on any other page)
  lookStage(X, tab, S);
  if (tab === 'standings' || (tab === 'overview' && c.seasonOver)) room?.setPodium(c.driverStandings().filter((d) => d.alive).slice(0, 3).map((d) => ({ name: d.name, color: c.teams[d.team]?.color || '#8a93a0', color2: c.teams[d.team]?.color2, team: d.team })));
  if (tab === 'trophies') { room?.setCabinet(TROPHIES.map((T) => !!c.earned(T.id))); room?.setLost(c.lost || []); }
  // (LIFE › Style: her on a stand in a quiet corner of the studio, the camera on her - put away on any other page)
  let styled = false; try { styled = styleStage(room, X, tab, S); } catch (e) { console.warn('CareerHub: the style preview', e); }
  if (!styled) room?.view(viewFor(c, tab, S)); room?.busy(320);
}
/** which part of the studio a page looks at */
function viewFor(c, tab, S) {
  const sub = S.sub || '';
  switch (tab) {
    // (back from a race: the camera finds your drivers while the round's report is up)
    case 'overview': return sub === 'cal' ? 'charts' : c.seasonOver ? 'standings' : c.report && !c.report.seen ? 'drivers' : 'overview';
    case 'week': return 'week';
    case 'dev': return sub === 'factory' ? 'dev' : safe(() => techView(S), 'dev');
    case 'drivers': return sub === 'market' ? 'rapport' : 'drivers';
    case 'you': return sub === 'look' && canEditLook(c) ? CC_VIEW[hubCam(HUB)] : 'you';
    case 'life': return 'life';
    case 'social': return sub ? 'life' : 'drivers';
    case 'pr': return 'pr';
    case 'standings': return sub === 'results' ? 'charts' : 'standings';
    case 'charts': return 'charts';
    case 'trophies': return 'trophies';
    case 'lost': return 'lost';
    default: return 'overview';
  }
}
/** the head slot: a page's chips, pager or step dots (its [data-slot="head"]), moved up beside the sub-tabs */
function slot(el, head, fade) {
  const s = el.querySelector('.ch-head .slot'); if (!s) return;
  const was = s.innerHTML; s.replaceChildren(...(head ? [head] : []));
  if (fade && head && s.innerHTML !== was) { s.style.setProperty('--m-k', 'm-fade'); s.classList.remove('m-swap'); void s.offsetWidth; s.classList.add('m-swap'); }
}
/** after a page is in: its charts wired, its numbers counting, its faces queued, the lists that may scroll marked */
function settle(X, pg) {
  if (!pg) return;
  wireChart(pg); countAll(pg, PREV.nums); drainFaces(); layout(X.el);
  for (const x of pg.querySelectorAll('.hub-tt .tt-brs, .hub-tt .tt-sec, .hub-tt .tt-det')) x.setAttribute('data-scroll-ok', '');
  if (innerHeight < 700 || innerWidth < 900) pg.setAttribute('data-scroll-ok', ''); else pg.removeAttribute('data-scroll-ok');
  if (X.tab === 'you' && X.sub === 'look' && canEditLook(X.c)) wireHubLook(X, pg); else X.lk = null;
}

// ---- DRIVER › Look: your own look, changed between races ----------------------------------------------------------
/** the camera on the Look tab: your pick from the pill, else your face (all of you for the suit and helmet) */
const hubCam = (X) => X?.lkCam || ((X?.lkTab || 0) === 3 ? 'full' : 'face');
/** the Look tab's page: the editor's tabs up in the head beside the sub-tabs, its four pages below */
function lookPageHTML(c, S, H) {
  const me = c.me, team = c.team, tab = HUB?.lkTab || 0;
  return `<div data-slot="head">${lookTabsHTML(tab)}</div>${lookEditorHTML(me.look || Avatar.blankLook(), { tab, team: { color: team.color, color2: team.color2 }, base: baseLook(me.name), name: me.name, tabs: false })}`;
}
/** the studio for the Look tab: your figure alone (built a frame after the page), the camera's pill over it; off it, all put away */
function lookStage(X, tab, S) {
  const on = tab === 'you' && S.sub === 'look' && canEditLook(X.c), pill = X.el.querySelector('.ch-ui > .lk-cam');
  if (!on) {
    pill?.remove(); clearTimeout(X.lkT);
    if (X.lkOn) PPL.faceCacheTrim?.(4);
    X.lkOn = false; X.lk = null; if (room?.avP || room?.avNext || room?.avDisc) room.clearAvatar();
    return;
  }
  if (!X.lkOn) { X.lkOn = true; X.lkCam = null; }
  if (!pill) X.el.querySelector('.ch-ui')?.insertAdjacentHTML('beforeend', lookCamHTML(hubCam(X), !!X.lkCap));
  hubAvatar(X, 'now');
}
/** your figure built again (as the wizard does: a frame job, one at a time; every 160 ms while a slider moves, else 90 ms after a change) */
function hubAvatar(X, kind) {
  const run = () => {
    X.lkAt = performance.now(); if (X.lkQ) return; X.lkQ = true;
    avJob(() => {
      X.lkQ = false; if (HUB !== X || !X.lkOn) return;
      const c = X.c, me = c.me, team = c.team; if (!me) return;
      room?.setAvatar({ name: me.name, color: team.color, color2: team.color2, team: team.name, cap: !!X.lkCap, draft: !!X.lkDraft });
      if (me.alive && me.team === team.name) room?.setCar({ color: team.color, color2: team.color2, helmet: me.helmet, number: me.number ?? 1, driver: me.name, team: team.name });
      room?.view(CC_VIEW[hubCam(X)]); X.lkAt = performance.now();
    });
  };
  clearTimeout(X.lkT); X.lkDraft = kind === 'slide';
  // (a moving slider: the gap the last draft earned (room.avGap), from when it finished; never one queued behind another)
  if (kind === 'slide') { const gap = room?.avGap?.() ?? 160, dt = performance.now() - (X.lkAt || 0); if (dt >= gap && !X.lkQ) run(); else X.lkT = setTimeout(run, Math.max(16, gap - dt)); }
  else X.lkT = setTimeout(run, kind === 'now' ? 260 : 90);   // (on arriving: once the page has slid in)
}
/** your figure's build, on the next frame - its own, never queued behind the portraits the hub draws while idle */
function avJob(fn) {
  // (a frame that never comes - the page out of sight - must not leave the figure waiting for ever: a timer as well, the first wins)
  let done = false; const go = () => { if (done) return; done = true; try { fn(); } catch (e) { console.warn('CareerHub: your figure', e); } };
  requestAnimationFrame(go); setTimeout(go, 400);
}
/** the Look tab's editor wired: a change goes into the career (saved half a second after the last), the registries, your figure and your portraits */
function wireHubLook(X, pg) {
  const c = X.c, me = c.me, team = c.team, root = pg.querySelector('.lk'); if (!root) { X.lk = null; return; }
  X.lk = wireLookEditor(root, me.look || Avatar.blankLook(), {
    tab: X.lkTab || 0, team: { color: team.color, color2: team.color2 }, base: baseLook(me.name), name: me.name,
    tabsEl: () => X.el.querySelector('.ch-head .slot .lk-tabs'), camEl: () => X.el.querySelector('.ch-ui > .lk-cam'),
    onChange: (L, kind) => {
      if (!c.setLook(L)) return;
      registerLook(me.name, me.look); purgePortraits(me.name); hubAvatar(X, kind);
      clearTimeout(X.lkSave); X.lkSave = setTimeout(() => c.save(), 500);
    },
    onTab: (t) => { X.lkTab = t; X.lkCam = null; for (const b of X.el.querySelectorAll('.lk-cam [data-lview]')) b.classList.toggle('on', b.dataset.lview === hubCam(X)); room?.view(CC_VIEW[hubCam(X)]); },
    onView: (v) => { X.lkCam = v; room?.view(CC_VIEW[hubCam(X)]); },
    onCap: (on) => { X.lkCap = on; hubAvatar(X, 'cap'); },
  });
}

// ---- the frame: the bar, the rail, the sub-tabs, the side card ---------------------------------------------------------
/** what each section has waiting: the week's free slots (or the contractual sponsor day), an injury or ban, points, ... */
function badges(c) {
  const me = c.me, w = c.week && c.week.season === c.season && c.week.round === c.round ? c.week : null;
  const hurt = !!me && outWhy(c, me) === 'injury', slots = w ? Math.max(0, (w.slots || 5) - (w.used?.length || 0)) : 5;
  const sponsorDue = !c.seasonOver && !c.needsDriver && !hurt && !(w && w.sponsorDone);
  const race = c.seasonOver || c.needsDriver ? '' : sponsorDue ? '!' : slots ? String(slots) : '';
  const team = c.seatsOf(c.myTeam).some((d) => outWhy(c, d) || (d.id !== c.playerId && d.contract && d.contract.until <= c.season)) ? '!' : '';
  const pts = me ? pointsOf(c, me) : 0, driver = pts >= 6 ? String(pts) : '';
  const B = c.celebs?.bonds || {}, upset = Object.values(B).some((b) => b && ['partner', 'dating'].includes(b.stage) && (b.upset || 0) > 0), conf = !!c.celebs?.confront;
  const inv = (c.social?.invites || []).filter((v) => v && v.to === 'me' && (!v.status || ['pending', 'open', 'sent', 'waiting'].includes(v.status))).length;
  const life = upset || conf ? '!' : inv ? String(inv) : '', media = c.pr?.crisis ? '!' : '', season = c.trophies.length > SEEN.trophies ? '•' : '';
  return { race, team, driver, life, media, season, lost: c.lost.length ? String(c.lost.length) : '',
    sub: { 'week/': race, 'drivers/': team, 'you/licence': driver, 'life/': upset || conf ? '!' : '', 'social/invites': inv ? String(inv) : '', 'pr/': media, 'trophies/': season } };
}
const badge = (em, v) => { if (!em) return; const was = em.textContent; em.textContent = v || ''; em.classList.toggle('hidden', !v); if (v && v !== was) { em.classList.remove('k-badge'); void em.offsetWidth; em.classList.add('k-badge'); } };
/** the rail's highlight and the sub-tabs, moved before the page is drawn (the thumb glides while the page arrives) */
function railUI(X) {
  const el = X.el, rail = el.querySelector('.ch-rail'), on = rail?.querySelector(`[data-sec="${X.sec}"]`);
  for (const b of rail?.querySelectorAll('[data-sec]') || []) b.classList.toggle('on', b === on);
  indicator(rail?.querySelector('.ind'), on);
  const box = el.querySelector('.ch-sub'), L = subsOf(X.sec);
  const sk = `${X.sec}|${canEditLook(X.c)}`;
  if (box && X.subKey !== sk) { X.subKey = sk; box.innerHTML = L.map(([t, s, n]) => `<button data-tab="${t}" data-sub="${s}" title="${esc(n)}">${esc(n)}<em class="hidden"></em></button>`).join(''); box.classList.toggle('single', L.length < 2); }
  seg(box, SUB_I[`${X.tab}/${X.sub}`] ?? 0);
}
/** the bar's numbers, the badges, the race button and the side card - updated in place, the frame never redrawn */
function refreshShell() {
  const X = HUB; if (!X || X.mode !== 'hub') return;
  const { el, c } = X, me = c.me, team = c.team, B = (k) => el.querySelector(`[data-bind="${k}"]`), track = trackAt(c);
  B('badge').textContent = me && me.alive ? me.number : '—';
  B('title').textContent = team.name.toUpperCase();
  B('sub').textContent = `${me && me.alive ? me.name : 'No driver'} · driver & owner · season ${c.season}, ${c.seasonOver ? 'complete' : `round ${c.round} of ${c.rounds}`}`;
  const myPos = me ? c.driverStandings().indexOf(me) + 1 : 0, pts = me ? me.points : 0, wal = +c.wallet || 0;
  B('pos').innerHTML = `P<b>${myPos || '-'}</b> · <i data-n="tb-pts" data-v="${pts}">${pts}</i> pts`;
  B('budget').innerHTML = `<b data-n="tb-bud" data-v="${team.budget}" data-fmt="m">${money(team.budget)}</b>`;
  B('wallet').innerHTML = `◆ <b data-n="tb-wal" data-v="${wal}" data-fmt="m">${money(wal)}</b>`;
  countAll(el.querySelector('.ch-pills'), PREV.nums);
  const pn = safe(() => phoneBadge(c), 0) || 0; badge(B('phone'), pn ? String(pn) : '');
  // the race button: the round's circuit, or the next season; its caret holds the other ways to run the weekend
  const rk = c.seasonOver ? 'season' : `${c.needsDriver ? 'nd' : 'ok'}|${track}`;
  if (rk !== X.raceKey) {
    X.raceKey = rk; closePop();
    B('race').innerHTML = c.seasonOver ? '<button class="go" data-a="season">NEXT SEASON →</button>'
      : `<button class="go ch-go" data-a="race" ${c.needsDriver ? 'disabled title="Choose who you are first"' : ''}>RACE · ${esc(TN(track)).toUpperCase()} →</button><button class="go ch-caret" data-a="racemenu" title="Other ways to run the weekend (R)" ${c.needsDriver ? 'disabled' : ''}>▾</button>`;
  }
  const bd = badges(c);
  for (const b of el.querySelectorAll('.ch-rail [data-sec]')) badge(b.querySelector('em'), bd[b.dataset.sec]);
  for (const b of el.querySelectorAll('.ch-sub > button')) badge(b.querySelector('em'), bd.sub[`${b.dataset.tab}/${b.dataset.sub}`]);
  sideCard(X);
}
/** the side card for the section: the next race, the car, your driver, your life, the public eye (none for the season or In Memoriam) */
function sideCard(X) {
  const { el, c } = X, side = el.querySelector('.ch-side'); if (!side) return;
  const me = c.me, track = trackAt(c), m = moodSafe(me), H = mkH(c, X.S, X.fit || fitOf(el));
  let html = '';
  if (X.sec === 'race') {
    const w = c.week && c.week.season === c.season && c.week.round === c.round ? c.week : null;
    html = `<h3>${c.seasonOver ? 'THE SEASON' : 'NEXT RACE'}</h3><div class="big">${c.seasonOver ? `Season ${c.season}` : esc(TN(track))}</div><div class="row2"><span>Round</span><b>${c.seasonOver ? 'complete' : `${c.round} of ${c.rounds}`}</b></div>${c.seasonOver ? '' : `<div class="row2"><span>Forecast</span><b>${fcTxt(c.forecastAt())}</b></div><div class="row2"><span>Sponsor day</span><b>${w?.sponsorDone ? 'done' : 'still to do'}</b></div>`}`;
  } else if (X.sec === 'team') html = safe(() => techSide(c, H), '<h3>THE CAR</h3>');
  else if (X.sec === 'driver') html = me ? `<h3>YOUR DRIVER</h3><div class="big">${esc(me.name)}</div><div class="row2"><span>Morale</span><b>${m.morale} · ${esc(safe(() => moraleLabel(m.morale), ''))}</b></div><div class="row2"><span>Licence</span><b>${pointsOf(c, me)} / 12 points</b></div>` : '<h3>YOUR DRIVER</h3><div class="big">No driver</div>';
  else if (X.sec === 'life' && !(X.tab === 'life' && X.sub === 'style')) { const un = safe(() => phoneBadge(c), 0) || 0; html = `<h3>YOUR LIFE</h3><div class="row2"><span>Your own money</span><b>${money(+c.wallet || 0)}</b></div><div class="row2"><span>Messages</span><b>${un ? `${un} unread` : 'none new'}</b></div>`; }
  else if (X.sec === 'media') { const p = c.pr || {}; html = `<h3>THE PUBLIC EYE</h3><div class="row2"><span>Followers</span><b>${esc(safe(() => fameText(p.fame || 0), '-'))}</b></div><div class="row2"><span>Image</span><b>${Math.round(p.image || 0)} · ${esc(safe(() => imageLabel(p.image || 0), ''))}</b></div><div class="row2"><span>Heat</span><b>${Math.round(p.heat || 0)} · ${esc(safe(() => heatLabel(p.heat || 0), ''))}</b></div>`; }
  const hide = !html;
  if (!hide && (X.sideKey !== X.sec || side.innerHTML !== html)) {
    side.innerHTML = html;
    if (X.sideKey !== X.sec) { side.style.setProperty('--m-k', 'm-fade'); side.classList.remove('m-swap'); void side.offsetWidth; side.classList.add('m-swap'); }
  }
  X.sideKey = X.sec; side.classList.toggle('k-hide', hide);
}

// ---- clicks ---------------------------------------------------------------------------------------------------------
/** every button in the hub: the rail and the sub-tabs, the hub's own actions, the tech tree's and the social pages' buttons (theirs first), then the hub's pages */
function click(e) {
  // (nothing while the hub fades out for talks or an evening: its buttons are still under the pointer, unseen)
  const X = HUB; if (!X || X.mode !== 'hub' || X.scene) return;
  const { el, c } = X, b = e.target.closest('button'); if (!b || b.disabled || !el.contains(b) || b.classList.contains('k-dx')) return;
  const d = b.dataset, S = X.S || {};
  if (X.lk?.click(e)) return;   // (DRIVER › Look: the editor's own buttons - its tabs, choices and camera)
  if (d.sec) { goSec(d.sec); return; }
  if (d.tab) {
    const s = d.sub || '';
    if (d.tab === X.tab && s === X.sub && d.cr == null) return;
    closePop(); go(d.tab, { ...(MEM[`${d.tab}/${s}`] || {}), sub: s, ...(d.cr != null ? { cr: +d.cr } : {}) }); return;
  }
  if (d.a) { action(d.a, b, d); return; }
  if (d.become) { c.becomeDriver(d.become); c.save(); go('overview', {}, { fresh: true }); return; }
  let r = null;
  try { r = techClick(c, d, S); } catch (err) { console.warn('CareerHub: the tech tree click failed', err); }
  // (an upgrade picked from the factory's queue opens it in the tree; in the tree itself only the columns it touched change)
  if (r && d.tup != null && X.tab === 'dev' && X.sub === 'factory' && r.S) r.S.sub = '';
  else if (r && !r.region && X.tab === 'dev' && !X.sub && r.tab === 'dev') r.region = techRegionsFor(d);
  if (!r && typeof HS.socialClick === 'function') { try { r = HS.socialClick(c, d, S); } catch (err) { console.warn('CareerHub: the social click failed', err); } }
  if (r) { result(r); return; }
  if (d.chartk) { segTo(b); go('charts', { ...S, chart: d.chartk }, { region: ['chart'] }); }
  else if (d.filter) { segTo(b); go('drivers', { ...S, sub: 'market', filter: d.filter, page: 0 }, { region: ['list'] }); }
  else if (d.sort) { segTo(b); go('drivers', { ...S, sub: 'market', sort: d.sort, page: 0 }, { region: ['list'] }); }
  else if (d.page != null) { const p = +d.page; go(X.tab, { ...S, page: p }, { region: ['list'], dir: Math.sign(p - (+S.page || 0)) }); }
  else if (d.cr != null) go('overview', { ...S, sub: 'cal', cr: +d.cr }, { region: ['cards', 'detail'] });
  else if (d.tfv) { segTo(b); go('dev', { ...S, fv: d.tfv }); }
  else if (d.pick) negotiate(d.pick);
}
/** a segmented control's thumb to the button just pressed (before the page under it changes) */
const segTo = (b) => { const box = b.parentElement; if (box?.classList.contains('k-seg')) seg(box, [...box.children].filter((x) => x.tagName === 'BUTTON').indexOf(b)); };
/** what a page module's click asked for: { tab, S, region, launch (an evening to play), phone (open it, on cid) } */
function result(r) {
  const X = HUB; if (!r || typeof r !== 'object' || !X) return;
  X.drawer?.close(); X.drawer = null;
  // (the phone opens over the page as it is: nothing under it needs drawing again until it closes)
  if (r.phone && !r.tab) { if (r.S) X.S = { ...X.S, armed: null }; openPhone(r.cid || r.S?.cid || null); return; }
  if (r.tab) go(r.tab, r.S || {}, { region: r.region, dir: r.dir });
  else if (r.S) go(X.tab, r.S, { region: r.region, dir: r.dir });
  if (r.phone) openPhone(r.cid || r.S?.cid || null);
  if (r.launch) offerEvening(r.launch);
}
function action(a, b, d) {
  const X = HUB, { el, c, o } = X;
  switch (a) {
    case 'close': {
      o.music?.(false); closePop();
      const k = curtain('#05060c'); k.cover(200).then(() => { closeCareer(); o.onClose?.(); k.reveal(260); });
      return;
    }
    case 'race': o.music?.(false); if (d.sim === 'race') c.simQuali(); closePop(); closeCareer(); o.onRace?.(c, d.sim || null); return;
    case 'racemenu': openRaceMenu(b); return;
    // (the whole weekend simulated: no circuit to load; the round's report comes up)
    case 'simweek': closePop(); c.simWeekend(); go('overview', {}, { fresh: true }); return;
    case 'season': c.nextSeason(); go('overview', {}, { fresh: true }); return;
    case 'gear': openGear(b); return;
    case 'motion': { const on = !document.documentElement.classList.contains('m-off'); setReduced(on); const s = b.querySelector('small'); if (s) s.textContent = motionTxt(); return; }
    case 'abandon':
      // (asked on the button itself, not with the browser's confirm(): a published page may not be allowed to show one)
      if (arm(b, 'CLICK AGAIN: LOSE EVERYTHING')) { closePop(); styleLeave(true); Career.erase(); PREV.nums = {}; for (const k of Object.keys(MEM)) delete MEM[k]; newCareer(el, o); }
      return;
    case 'phone': openPhone(); return;
    // (the round's report closed: tonight's invitations, when the race left any - career/Party.js)
    case 'report': if (c.report) c.report.seen = true; c.save(); reportDown(X); go(X.tab, { ...X.S }, { how: 'same' }); tonightUp(X); return;
    case 'tonight': tonightUp(X); return;
    case 'rnext': reportStep(X, 1); return;
    case 'rback': reportStep(X, -1); return;
    case 'rskip': reportStep(X, 99); return;
    // (the old SHOW EVERYTHING: the news lives in MEDIA › News now; prHTML also reads S.more)
    case 'more': go('pr', { ...(MEM['pr/news'] || {}), sub: 'news', more: true }); return;
    case 'alerts': alertsDrawer(X); return;
    case 'crisis': crisisDrawer(X); return;
    default:
  }
}
const closePop = () => { const X = HUB; if (X?.pop) { X.pop.close(); X.pop = null; } };
const motionTxt = () => (document.documentElement.classList.contains('m-off') ? 'On · screens change without sliding' : 'Off · screens slide and fade');
/** the caret's menu: the other ways into the weekend (or, with qualifying done, the grid slot you start from) */
function openRaceMenu(anchor) {
  const X = HUB, c = X.c; if (X.pop) { closePop(); return; }
  const sg = c.savedGrid && c.savedGrid.season === c.season && c.savedGrid.round === c.round ? c.savedGrid : null;
  const mine = sg ? safe(() => c.entries().find((e) => e.isPlayer), null) : null, gi = sg && mine ? sg.ids.indexOf(mine.careerId) : -1;
  const html = `${sg ? `<div class="pop-note">Qualifying is done${gi >= 0 ? `: you start P${gi + 1}` : ''}${sg.sim ? ' (simulated)' : ''}.</div>` : ''}
    <button class="pop-row" data-a="race"><b>${sg ? 'Drive the race' : 'Drive the full weekend'}</b><small>${sg ? 'From the grid you qualified for' : 'Practice, qualifying and the race'}</small></button>
    ${sg ? '' : `<button class="pop-row" data-a="race" data-sim="quali"><b>Skip practice · qualify</b><small>Load the circuit and go straight to qualifying</small></button>
    <button class="pop-row" data-a="race" data-sim="race"><b>Sim qualifying · race</b><small>Qualifying simulated here, then the circuit loads for the race</small></button>`}
    <button class="pop-row" data-a="simweek"><b>Sim the whole weekend</b><small>Qualifying and the race simulated here: nothing to load</small></button>`;
  X.pop = popover(anchor, html, { host: ui(X.el), align: 'right' }); X.pop.el.classList.add('race');
}
/** the gear: the difficulty (the one setting that is yours), reduced motion, abandoning the career (and on a phone, where the bar has no room for it, the way back to the menu) */
function openGear(anchor) {
  const X = HUB, c = X.c; if (X.pop) { closePop(); return; }
  const html = `<div class="pop-sec"><span class="lbl">Difficulty · <b class="pop-dv">${c.diff} ${diffName(c.diff)}</b></span><input type="range" min="0" max="100" value="${c.diff}" data-diff><small>The AI's pace - the one setting that is yours.</small></div>
    <div class="pop-sec"><span class="lbl">Race distance</span><select data-laps>${DISTANCES.map(([v, n]) => `<option value="${v}"${c.laps === v ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select><small>From the next race on. 8 laps or more: one pit stop is mandatory.</small></div>
    <button class="pop-row" data-a="motion"><b>Reduce motion</b><small>${motionTxt()}</small></button>
    ${innerWidth < 900 ? '<button class="pop-row" data-a="close"><b>← Main menu</b><small>The career is saved as it is</small></button>' : ''}
    <button class="pop-row danger" data-a="abandon"><b>✕ Abandon career</b><small>Everything is lost: it asks twice</small></button>`;
  X.pop = popover(anchor, html, { host: ui(X.el), align: 'right' }); X.pop.el.classList.add('gear');
}
/** contract talks at the table (ui/Negotiation.js): the hub fades out behind them, and back in after */
function negotiate(id) {
  const X = HUB; if (!X || X.scene) return;
  const { el, c } = X, team = c.team, S = X.S, drv = c.drivers[id]; if (!drv) return;
  const pages = el.querySelector('.ch-pages');
  if (drv.refused === c.round) { toast(pages, `${last(drv.name)} won't talk to you again until after the next race.`, { kind: 'warn' }); return; }
  const fee = c.buyout(drv); if (fee > team.budget) { toast(pages, `You can't afford the ${money(fee)} buyout.`, { kind: 'down' }); return; }
  const seats = c.seatsOf(team.name), renew = drv.team === team.name;
  // (whose seat: your team-mate's - or, with no driver of your own, the lower-rated of the two)
  const seat = renew || seats.length < 2 ? null : seats.findIndex((x) => x.id === [...seats].filter((y) => y.id !== c.playerId).sort((a, b) => a.rating - b.rating)[0]?.id);
  closePop(); el.classList.add('away'); X.scene = true;
  setTimeout(() => {
    room?.stop();
    showNegotiation({ c, d: drv, seat, look: { team: team.name, color: team.color, color2: team.color2, night: c.forecastAt().time === 'night' }, done: (r) => {
      if (r.signed) { c.sign(team.name, drv.id, r.offer.salary, r.offer.years, seat, r.offer); c.objectivesFor(); }
      c.save(); el.classList.remove('away'); X.scene = false; if (innerWidth >= 700) room?.start();
      go(renew && c.seasonOver ? 'overview' : 'drivers', { ...S, sub: renew ? '' : S.sub, msg: r.signed ? `${drv.name} signs for ${team.name}.` : `No deal with ${last(drv.name)}.`, mkind: r.signed ? 'up' : 'info' });
    } });
  }, 220);
}

// ---- the phone and evenings out (overlays outside #career) ---------------------------------------------------------
/** the phone over the hub (src/ui/Phone.js), on a thread if cid; the page under it catches up when it closes */
function openPhone(cid = null) {
  const X = HUB; if (!X || X.mode !== 'hub' || X.scene) return;
  closePop();
  // (on a narrow screen the phone covers everything: the studio rests meanwhile)
  const narrow = innerWidth < 700; if (narrow) room?.stop();
  let h = null;
  try { h = showPhone({ c: X.c, onClose: () => { if (HUB !== X) return; if (narrow && !X.scene) room?.start(); go(X.tab, { ...X.S }, { how: 'same' }); } }); } catch (e) { console.warn('CareerHub: the phone failed to open', e); }
  if (cid && h && typeof h.open === 'function') { try { h.open(cid); } catch (e) { console.warn('CareerHub: the phone could not open that chat', e); } }
}
/**
 * An evening booked (Agenda's launch: { venue, guests, key }): the page's PLAY THE EVENING button chose to play it, so
 * it opens at once; a launch marked skip (or auto) is summed up instead, without leaving the hub (HubSocial's own SKIP
 * buttons settle theirs before they get here)
 */
function offerEvening(launch) {
  const X = HUB; if (!X || !launch) return;
  if (launch.skip || launch.auto) skipEvening(launch); else playEvening(launch);
}
/** an evening's people in a few words, for the toasts (Agenda's guests: [{ kind, id, name }]) */
const guestNames = (launch) => nameList((launch?.guests || []).map((g) => (typeof g === 'object' ? g?.name : '') || '').filter(Boolean));
/**
 * Play the evening: the hub fades out ('away') and its studio stops; main.js stages it in the real world when it can
 * (o.onHangout(launch, done, career): it hides the hub, and shows it again before done), else it opens over the hub on
 * its own (ui/Hangout.js). Either way the result comes back here once, and an evening that could not be shown is
 * summed up as SKIP sums it up.
 */
function playEvening(launch) {
  const X = HUB; if (!X || !launch || X.scene) return;
  // (the night after a race keeps its own city and its night: the race's track, never the next one's forecast)
  const party = launch.key === 'party', { el, c, o } = X;
  const track = party && launch.track ? launch.track : trackAt(c), night = party ? launch.night !== false : safe(() => c.forecastAt().time === 'night', false);
  let back = false;
  const done = (r) => { if (back) return; back = true; finishEvening(X, r, launch); };
  closePop(); X.drawer?.close(); X.drawer = null;
  el.classList.add('away'); X.scene = true;
  setTimeout(() => {
    if (HUB !== X) return;
    room?.stop();
    if (typeof o.onHangout === 'function') {
      try {
        const p = o.onHangout(launch, done, c);
        // (main.js stages it asynchronously - the world may have to be built first: a failure there still brings the hub
        // back, and so does a hand-off that settled without taking the stage - the hub still up, no evening open)
        const idle = () => setTimeout(() => { if (!back && el.style.display !== 'none' && !document.getElementById('hangout')) done({ failed: true }); }, 0);
        if (p && typeof p.then === 'function') p.then(idle, (e) => { console.error('CareerHub: the evening could not be staged in the world', e); done({ failed: true }); });
        return;
      } catch (e) { console.error('CareerHub: the evening could not be staged in the world', e); }
    }
    let h = null;
    try { h = showHangout({ c, ...launch, night, track, audio: o.audio, onDone: done }); } catch (e) { console.error('CareerHub: the evening could not open', e); }
    // (no WebGL for it: Hangout.js reports the failure itself on its next tick, a throw does not - settled here too, once)
    if (!h) setTimeout(() => done({ failed: true }), 60);
  }, 220);
}
/**
 * Back from the evening: what it did (Social.hangoutResult; an evening that never really opened is summed up by
 * Social.autoHangout instead), saved, the hub back as it was - the same page updated in place when the evening was
 * booked from it (the week, the planner), else the week - and the outcome as a toast or two.
 */
function finishEvening(X, r, launch) {
  if (HUB !== X) return;
  const { el, c } = X, failed = !r || typeof r !== 'object' || !!r.failed, party = launch?.key === 'party';
  let lines = [];
  // (the night after a race: career/Party.js settles it - the whole night, act 2 included, once - and the morning after
  //  comes up over the week; one that could not be shown is summed up as SUM IT UP sums it up)
  // (a night that stopped at 'On to the club' with no club after it - the venue in its own scene, or the club gone - ended
  //  where it was: back to the hotel from the team's party)
  const rr = party && !failed && r.party?.exit === 'moveon' ? { ...r, party: { ...r.party, exit: 'hotel' } } : r;
  if (party) lines = (failed ? pty('autoParty', c, launch.partyId) : pty('partyResult', c, rr))?.lines || [];
  else try { lines = hangoutResult(c, failed ? autoHangout(c, launch.venue, launch.guests || []) : r)?.lines || []; } catch (e) { console.warn('CareerHub: the evening could not be counted', e); }
  // affection hook: the hugs, the hands held, the kisses and the looking-after (career/AffectionResult.js), after the night itself
  if (!failed) { try { lines.push(...(affectionResult(c, rr || r, launch)?.lines || [])); } catch (e) { console.warn(e); } }
  if (!failed) { try { lines.push(...papsFallout(c, r)); } catch (e) { console.warn(e); } }   // paps hook: the photographers in the press
  c.save();
  X.scene = false; el.style.display = ''; el.classList.remove('away');
  if (!X.unkeys) bindKeys(X);
  if (innerWidth >= 700) room?.start();
  const here = X.tab === 'week' || X.tab === 'social';
  go(here ? X.tab : 'week', here ? { ...X.S } : {}, here ? { how: 'same' } : { fresh: true });
  const pages = el.querySelector('.ch-pages');
  if (failed) toast(pages, party ? 'The night could not be shown: this is how it went.' : `The evening${guestNames(launch) ? ` with ${guestNames(launch)}` : ''} could not be shown: this is how it went.`, { kind: 'info' });
  if (!party) for (const t of lines.slice(0, failed ? 1 : 2)) toast(pages, t, { kind: 'up' });
}
/** skipped: a quick account of the evening (Social.autoHangout, then Social.hangoutResult; a night after a race: Party.autoParty and the morning after) without leaving the hub */
function skipEvening(launch) {
  const X = HUB; if (!X || !launch) return;
  const c = X.c, party = launch.key === 'party'; let lines = [];
  if (party) lines = pty('autoParty', c, launch.partyId)?.lines || [];
  else try { lines = hangoutResult(c, autoHangout(c, launch.venue, launch.guests || []))?.lines || []; } catch (e) { console.warn('CareerHub: the evening could not be summed up', e); }
  c.save();
  go(X.tab, { ...X.S }, { how: 'same' });
  if (!party) { const pages = X.el.querySelector('.ch-pages'); for (const t of lines.slice(0, 2)) toast(pages, t, { kind: 'up' }); }
}

// ---- the night after a race (career/Party.js; ui/PartyCards.js draws it) ----------------------------------------------
/**
 * TONIGHT over the hub: the race's invitations (Party.partyOffers - none after a grave race, and none once the week has
 * begun). GO plays the night in 3D through the evening's own path (result -> offerEvening -> playEvening, key 'party'),
 * SUM IT UP settles it at once (Party.autoParty) and shows the morning after, the hotel settles an early night
 * (Party.skipParty). The report is already marked seen: nothing here reopens it.
 */
function tonightUp(X) {
  if (!X || HUB !== X || X.mode !== 'hub' || X.scene || partySheetUp()) return;
  const c = X.c, offers = pty('partyOffers', c) || []; if (!offers.length) return;
  closePop(); X.drawer?.close(); X.drawer = null;
  const pages = () => X.el.querySelector('.ch-pages');
  const after = () => { X.sheet = null; if (HUB !== X) return false; return true; };
  X.sheet = showTonight({ c, offers, handlers: {
    go: (id, op) => {
      if (!after()) return;
      const L = pty('partyLaunch', c, id, 1, null, { travel: op?.transport || null });
      if (!L) { toast(pages(), 'That invitation is no longer open.', { kind: 'info' }); go(X.tab, { ...X.S }, { how: 'same' }); return; }
      c.save(); result({ launch: L });
    },
    sum: (id) => { if (!after()) return; pty('autoParty', c, id); c.save(); go(X.tab, { ...X.S }, { how: 'same' }); },
    hotel: () => {
      if (!after()) return;
      const r = pty('skipParty', c); c.save(); go(X.tab, { ...X.S }, { how: 'same' });
      toast(pages(), r?.lines?.[0] || 'Back to the hotel: an early night.', { kind: 'up' });
    },
  } });
}
/**
 * The morning after, over the hub, once: c.party.last while it is unseen (never over the round's report, never during
 * an evening). Shown from a copy - the photo goes from the save once it has been seen - then marked seen and saved.
 * Its buttons: on to the week, MEDIA (a story to answer), the phone (the morning's texts).
 */
function morningUp(X) {
  if (!X || HUB !== X || X.mode !== 'hub' || X.scene || partySheetUp()) return;
  const c = X.c, L = c.party?.last; if (!L || !L.unseen || (c.report && !c.report.seen)) return;
  const last = { ...L };
  if (!pty('partySeen', c)) L.unseen = false;
  c.save();
  X.sheet = showMorning({ c, last, handlers: {
    done: () => { X.sheet = null; },
    // (a story raised: its answers in the hub's drawer, as the alert's RESPOND opens them)
    media: () => { X.sheet = null; if (HUB !== X) return; if (c.pr?.crisis) crisisDrawer(X); else go('pr', { ...(MEM['pr/'] || {}), sub: '' }); },
    phone: () => { X.sheet = null; if (HUB === X) openPhone(); },
  } });
}

// ---- the round's report (back from a race), a step at a time -----------------------------------------------------------
/** the report over the hub while it is unread: the result and the sponsors, then the social pages' steps, then the trophies */
function reportUp(X, H) {
  const { el, c } = X, host = el.querySelector('.ch-modal-host'); if (!host) return;
  const up = host.querySelector('.rp-modal:not(.m-closing)');
  if (!c.report || c.report.seen) { if (up) reportDown(X); return; }
  if (up) return;
  const m = document.createElement('div'); m.className = 'modal rp-modal'; m.innerHTML = reportModal(c, H); host.appendChild(m);
  X.rstep = 0; X.rsteps = m.querySelectorAll('.rp-steps > .m-pg').length;
  wireChart(m); mOpen(m, 'fade'); reportStep(X, 0);
  X.unrep?.(); X.unrep = keys(m, { Enter: () => { reportStep(X, 1); }, ArrowRight: () => { reportStep(X, 1); }, ArrowLeft: () => { reportStep(X, -1); }, Escape: () => { reportStep(X, 99); } });
}
function reportDown(X) { X.unrep?.(); X.unrep = null; const m = X.el.querySelector('.rp-modal:not(.m-closing)'); if (m) mClose(m, () => m.remove()); }
/** a step on (d 1), back (-1), to the last (99); NEXT on the last step continues to the hub */
function reportStep(X, d) {
  const m = X.el.querySelector('.rp-modal'); if (!m) return;
  const n = X.rsteps || 1, lastI = n - 1;
  if (d === 1 && X.rstep >= lastI) { action('report', null, {}); return; }
  X.rstep = d === 99 ? lastI : clamp(X.rstep + d, 0, lastI);
  mPage(m.querySelector('.rp-steps'), X.rstep);
  m.querySelectorAll('.rp-foot .k-dots i').forEach((x, i) => x.classList.toggle('on', i === X.rstep));
  const t = m.querySelector('.rp-t'), nx = m.querySelector('[data-a="rnext"]'), bk = m.querySelector('[data-a="rback"]'), sk = m.querySelector('[data-a="rskip"]');
  const pg = m.querySelectorAll('.rp-steps > .m-pg')[X.rstep]; if (t && pg) t.textContent = pg.dataset.title || '';
  if (bk) bk.disabled = X.rstep === 0;
  if (sk) sk.classList.toggle('hidden', X.rstep >= lastI);
  if (nx) nx.textContent = X.rstep >= lastI ? 'CONTINUE' : 'NEXT →';
}
/** back from a race: how it went for you and your sponsors - then the weekend's form, media, licence and life from HubSocial */
function reportModal(c, H) {
  const R = c.report, T = R.trophies || [], calm = !!(H.calm || R.grave), O = (R.objectives || []).slice(0, 4);
  const s1 = `<span class="lbl">Sponsor targets</span><div class="obj">${O.map((o) => `<div class="${o.ok ? 'ok' : 'no'}"><i>${o.ok ? '✓' : '✕'}</i><span>${esc(o.text)}</span><em>${money(o.reward)}</em></div>`).join('') || '<div>No targets this round.</div>'}</div>
    <div class="row" style="margin-top:8px"><b>${R.bonus ? `+${money(R.bonus)} from the sponsors` : 'Nothing from the sponsors this time'}</b><span class="grow"></span>${R.rating != null ? `<span class="muted">Rating ${dTxt(R.rating) || '±0.0'}</span>` : ''}</div>
    ${R.ban ? `<div class="warn" style="margin-top:10px">${esc(R.ban)}</div>` : ''}`;
  let more = [];
  const steps = hs('reportSteps', c, H);
  if (Array.isArray(steps)) more = steps.filter((s) => s && s.html);
  else { const x = hs('reportExtra', c, H); if (x) more = [{ key: 'extra', title: 'The weekend', html: x }]; }
  // (a round where someone was hurt or lost: the result and one quiet step - no trophies paraded, nothing popping)
  if (calm) more = more.slice(0, 1);
  const all = [{ key: 'result', title: 'Result & sponsors', html: s1 }, ...more, ...(T.length && !calm ? [{ key: 'trophies', title: 'New in the trophy room', html: `<span class="lbl">New in the trophy room</span><div class="row">${T.map((n) => `<span class="tag k-badge" style="font-size:12px;padding:5px 10px">🏆 ${esc(n)}</span>`).join('')}</div>` }] : [])];
  return `<div class="box glass${calm ? ' m-calm' : ''}"><div class="rp-head"><small class="muted">ROUND ${R.round} · ${esc(TN(R.track)).toUpperCase()}</small>
      <h2>${R.dnf ? 'DNF' : R.pos ? 'P' + R.pos : '-'}${R.grid && !R.dnf ? ` <span class="muted" style="font-size:14px">from P${R.grid}</span>` : ''}${R.fastest ? ' <span class="tag" style="background:#efe2ff;color:#7b2fd0">FASTEST LAP</span>' : ''}</h2></div>
    <div class="rp-steps m-pages">${all.map((s, i) => `<section class="m-pg${i === 0 ? ' on' : ''}" data-title="${esc(s.title || '')}">${s.html}</section>`).join('')}</div>
    <div class="rp-foot"><span class="k-dots">${all.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</span><span class="rp-t">${esc(all[0].title)}</span><span class="grow"></span>
      <button data-a="rskip"${all.length < 2 ? ' class="hidden"' : ''}>SKIP</button><button data-a="rback" disabled>← BACK</button><button class="go" data-a="rnext">${all.length < 2 ? 'CONTINUE' : 'NEXT →'}</button></div></div>`;
}

// ---- drawers: every alert, the story waiting for an answer -------------------------------------------------------------
function alertsDrawer(X) {
  X.drawer?.close();
  const A = alertsOf(X.c, mkH(X.c, X.S, X.fit || fitOf(X.el))), w = A.length ? '' : hs('overviewWarnings', X.c, mkH(X.c, X.S, X.fit || fitOf(X.el))) || '';
  X.drawer = drawer(X.el.querySelector('.ch-pages'), A.length ? A.map(alertRow).join('') : w || '<div class="al-none">Nothing needs you.</div>', { title: 'Alerts', width: 400, onClose: () => { if (HUB === X) X.drawer = null; } });
}
/** the story waiting for an answer, its answers in a drawer over the page (HubSocial's card with the PR manager's advice when it has one; an answer brings you back to this page) */
function crisisDrawer(X) {
  const K = X.c.pr?.crisis; if (!K) { go(X.tab, { ...X.S }, { how: 'same' }); return; }
  X.drawer?.close();
  const card = alertsOf(X.c, mkH(X.c, X.S, X.fit || fitOf(X.el))).find((a) => a.key === 'crisis' && typeof a.drawer === 'string' && a.drawer)?.drawer;
  const ret = esc(X.tab), own = `<div class="cr-d"><b>${esc(K.title || 'A story needs an answer')}</b><p>${esc(K.text || '')}</p>${(K.options || []).map((op) => `<button class="cr-o" data-crisis="${esc(op.key)}" data-hret="${ret}"><b>${esc(op.label || op.key)}</b>${op.hint ? `<small>${esc(op.hint)}</small>` : ''}</button>`).join('')}</div>`;
  const html = card ? card.replace(/data-hret="[^"]*"/g, `data-hret="${ret}"`) : own;
  X.drawer = drawer(X.el.querySelector('.ch-pages'), html, { title: K.positive ? 'A moment to use' : 'The story', width: 400, onClose: () => { if (HUB === X) X.drawer = null; } });
}

// ---- RACE WEEK: the briefing, the calendar ---------------------------------------------------------------------------
/** the stand-in this round, said the right way: an injury or a ban (12 penalty points) */
function standInAlert(c) {
  const mine = safe(() => c.entries().find((e) => e.isPlayer), null); if (!mine?.standInFor) return null;
  const why = mine.outWhy || outWhy(c, c.me) || 'injury';
  return { level: 'info', key: `standin-${why}`, why, icon: why === 'ban' ? '⊘' : '✚', text: why === 'ban' ? `${mine.standInFor} is suspended for this round (12 penalty points). You race as the stand-in, ${mine.name}, in the ${mine.team} car. Their result is the team's.`
    : `${mine.standInFor} is out injured. You race this round as the stand-in, ${mine.name}, in the ${mine.team} car. Their result is the team's.` };
}
/** everything waiting for you this week: HubSocial's alerts (a story to answer, a ban, the sponsor day ...) and the stand-in */
function alertsOf(c, H) {
  let L = [];
  const a = hs('overviewAlerts', c, H); if (Array.isArray(a)) L = a.filter((x) => x && x.text);
  const si = !c.seasonOver ? standInAlert(c) : null;
  // (serving the ban this round: the stand-in's row says it - HubSocial's own line about the same ban would repeat it)
  if (si) { if (si.why === 'ban') L = L.filter((x) => x.key !== 'ban'); L.unshift(si); }
  return L;
}
const actAttrs = (act) => {
  if (act.data && typeof act.data === 'object') return Object.entries(act.data).filter(([k, v]) => /^[a-z][a-z0-9]*$/i.test(k) && v != null && v !== '').map(([k, v]) => `data-${k.toLowerCase()}="${esc(v)}"`).join(' ');
  return act.tab ? `data-tab="${esc(act.tab)}" data-sub="${esc(act.sub || '')}"` : '';
};
function alertRow(a) {
  const lv = ['crisis', 'warn', 'info'].includes(a.level) ? a.level : 'info';
  // (a story waiting for an answer: RESPOND opens it in a drawer, the answers there)
  let btn = '';
  if ((lv === 'crisis' || a.key === 'crisis') && HUB?.c?.pr?.crisis) btn = `<button data-a="crisis">${esc(a.act?.label || 'RESPOND')}</button>`;
  else if (a.act) { const at = actAttrs(a.act); if (at) btn = `<button ${at}>${esc(a.act.label || 'VIEW')}</button>`; }
  return `<div class="al ${lv}"><i>${esc(a.icon || (lv === 'crisis' ? '!' : lv === 'warn' ? '!' : 'i'))}</i><span title="${esc(a.text)}">${esc(a.text)}</span>${btn}</div>`;
}
function alertsHTML(c, H, room0 = 4) {
  const A = alertsOf(c, H);
  if (!A.length) {
    const w = typeof HS.overviewAlerts === 'function' ? '' : hs('overviewWarnings', c, H) || '';
    return w ? `<div class="wk-alw">${w}</div><button class="al-more" data-a="alerts">SHOW ALL</button>` : '<div class="al-none">Nothing needs you this week.</div>';
  }
  const n = Math.max(1, room0), shown = A.length > n ? A.slice(0, n - 1) : A;
  return shown.map(alertRow).join('') + (A.length > shown.length ? `<button class="al-more" data-a="alerts">+${A.length - shown.length} MORE</button>` : '');
}
/** how many of the briefing's partners are invited to round n (a heart on the calendar; two is a clash) */
const invitedAt = (c, n) => Object.values(c.celebs?.bonds || {}).filter((b) => b?.invited && b.invited.season === c.season && b.invited.round === n).length;
/** the season's rounds, a cell each: done (your place, the winner), next, or the forecast */
function calStrip(c) {
  return `<div class="wk-cal">${c.calendar.map((tid, i) => {
    const n = i + 1, r = c.log.find((x) => x.round === n), nx = !c.seasonOver && n === c.round, h = invitedAt(c, n);
    return `<button class="cc${r ? ' done' : nx ? ' next' : ''}" data-tab="overview" data-sub="cal" data-cr="${n}" title="${esc(`Round ${n} · ${TN(tid)}`)}"><small>R${n}${nx ? ' · NEXT' : ''}${h ? ` <em class="ht${h > 1 ? ' clash' : ''}">♥${h > 1 ? h : ''}</em>` : ''}</small><b>${esc(TN(tid))}</b><span>${r ? `${r.you ? 'P' + r.you : 'DNS'} · ${esc(last(r.winner))}` : fcTxt(c.forecastAt(n))}</span></button>`;
  }).join('')}</div>`;
}
/** the four boxes of the weekend: race day, where you can expect to be, the head-to-head, and form (yours and the two nearest rivals') */
function briefBoxes(c) {
  const fc = c.forecastAt(), es = safe(() => c.entries(), []), sc = (e) => e.perf + e.rating * 0.02, mine = es.find((e) => e.isPlayer);
  const exp = mine ? es.filter((e) => sc(e) > sc(mine)).length + 1 : null;
  const mate = c.teammate(), h = c.h2h || { q: [0, 0], r: [0, 0] }, same = mate && h.mate === mate.id;
  const lab = (e) => e?.form?.label || safe(() => formOf(moodOf(c.drivers[e.careerId])).label, 'STEADY');
  const near = mine ? es.filter((e) => e !== mine).sort((a, b) => Math.abs(sc(a) - sc(mine)) - Math.abs(sc(b) - sc(mine))).slice(0, 2) : [];
  const note = near.map((e) => `${last(e.name)} ${lab(e).toLowerCase()}`).join(' · ');
  return `<div><small>Race day</small><b>${fcTxt(fc)}</b><span>${fc.weather === 'wet' ? 'full wets likely' : fc.weather === 'damp' ? 'intermediates to start' : 'slicks'}</span></div>
    <div><small>Expected</small><b>${exp ? 'P' + exp : '-'}</b><span>on the car's pace and yours</span></div>
    <div><small>vs ${mate ? esc(last(mate.name)) : 'team-mate'}</small><b>${same ? `Q ${h.q[0]}–${h.q[1]} · R ${h.r[0]}–${h.r[1]}` : '–'}</b><span>qualifying · races this season</span></div>
    <div class="fm"><small>Form</small><b>${esc(mine ? lab(mine) : '-')}</b><span title="${esc(note)}">${note ? esc(note) : 'the field around you'}</span></div>`;
}
/** the season's tiles: the championships, the budget, the car's pace - and from HubSocial morale, image and the licence */
function tilesHTML(c, H) {
  const me = c.me, team = c.team, myPos = me ? c.driverStandings().indexOf(me) + 1 : 0, teamPos = c.teamStandings().indexOf(team) + 1;
  const own = `<div class="tile"><small>Championship</small><b>${myPos ? 'P' + myPos : '-'}</b><span>${me ? `<i data-n="pts" data-v="${me.points}">${me.points}</i> points` : ''}</span></div>
    <div class="tile"><small>Constructors</small><b>P${teamPos}</b><span><i data-n="tpts" data-v="${team.points}">${team.points}</i> points</span></div>
    <div class="tile"><small>Budget</small><b data-n="budget" data-v="${team.budget}" data-fmt="m">${money(team.budget)}</b><span>$0.9M a point</span></div>
    <div class="tile"><small>Car pace</small><b>${gapTxt(gapOf(c, team))}</b><span>to the fastest car</span></div>`;
  let more = hs('overviewTiles', c, H);
  // (six to a row: HubSocial's morale, image and licence tiles - the licence takes the image's place from six points on)
  if (typeof more === 'string' && more && me) {
    const T = document.createElement('template'); T.innerHTML = more;
    const tl = [...T.content.children], drop = tl.find((x) => x.querySelector(pointsOf(c, me) >= 6 ? '[data-n="img"]' : '[data-n="lic"]'));
    if (tl.length > 2 && drop) { drop.remove(); more = T.innerHTML; }
  }
  if (more == null && me) {
    // (no tiles from HubSocial yet: morale, and the image - the licence instead once it reaches six points)
    const m = moodSafe(me), pts = pointsOf(c, me), img = Math.round(c.pr?.image || 0);
    more = `<div class="tile"><small>Morale</small><b data-n="mor" data-v="${m.morale}">${m.morale}</b><span>${esc(safe(() => moraleLabel(m.morale), ''))}</span></div>`
      + (pts >= 6 ? `<div class="tile"><small>Licence</small><b><i data-n="lic" data-v="${pts}">${pts}</i> / 12</b><span>penalty points</span></div>` : `<div class="tile"><small>Public image</small><b data-n="img" data-v="${img}">${img}</b><span>${esc(safe(() => imageLabel(img), ''))}</span></div>`);
  }
  return `<div class="wk-tiles">${own}${more || ''}</div>`;
}
/** RACE WEEK › Briefing: the round, the weekend's boxes, the tiles, the sponsors' targets, what needs you, the calendar */
function briefingHTML(c, S, H) {
  const me = c.me, team = c.team, track = trackAt(c);
  if (c.needsDriver) {
    const seats = c.seatsOf(team.name);
    return `<div class="wk nd"><div class="wk-hero"><div class="wk-hl"><h2>${esc(me?.alive === false ? `${me.name} is gone.` : 'You have no driver.')}</h2><p class="lead">You still own ${esc(team.name)}. Choose who you are now - one of your drivers, or sign someone from the market first.</p></div></div>
      <div class="nd-seats">${seats.map((d) => `<button class="pick" data-become="${d.id}" style="--c:${esc(team.color)}"><b>${esc(d.name)} <span class="muted">#${d.number}</span></b><small>rating ${Math.round(d.rating * 100)} · ${d.starts} starts</small></button>`).join('') || `<div class="reserve" style="grid-column:1/-1"><span class="grow">Your seats are empty: sign a driver from the market.</span><button data-tab="drivers" data-sub="market">THE MARKET →</button></div>`}</div>
      ${calStrip(c)}</div>`;
  }
  if (c.seasonOver) {
    const rv = c.seasonReview();
    return `<div class="wk so"><div class="so-hero">${reviewHTML(c, rv)}</div>${tilesHTML(c, H)}
      <div class="wk-al"><span class="lbl">Contracts ending</span>${rv.expiring.length ? rv.expiring.map((d) => `<div class="al warn"><i>!</i><span>${esc(d.name)}: the contract runs out this winter.</span><button data-pick="${d.id}">RENEW</button></div>`).join('') + '<div class="al-none">Let a contract run out and the seat is filled from the market when the new season starts.</div>' : '<div class="al-none">Nobody\'s contract is ending.</div>'}</div>
      <div class="wk-obj"><span class="lbl">The board</span><div class="so-board">Next season: ${money(rv.prize)} prize money for P${rv.teamPos}${rv.bonus ? ` and a ${money(rv.bonus)} bonus from the board` : ''}. Over the winter the young drivers improve, and the other teams will go after better drivers.</div></div>
      ${calStrip(c)}</div>`;
  }
  const room0 = Math.max(2, Math.floor((H.fit.h - 104 - 72 - 60 - 3 * 8 - 20) / 45));
  return `<div class="wk"><div class="wk-hero"><div class="wk-hl"><h2>Round ${c.round} of ${c.rounds} · ${esc(TN(track))}</h2><p class="lead">Qualifying, then the race. The forecast is on the calendar; your sponsors have set their targets.</p></div><div class="wk-brief">${me && me.alive ? briefBoxes(c) : ''}</div></div>
    ${tilesHTML(c, H)}
    <div class="wk-obj"><span class="lbl">Sponsor targets · paid after the race</span><div class="obj">${(c.objectives || []).slice(0, 4).map((o) => `<div><i>◇</i><span>${esc(o.text)}</span><em>${money(o.reward)}</em></div>`).join('') || '<div><i>◇</i><span>No targets this round.</span></div>'}</div></div>
    <div class="wk-al"><span class="lbl">This week</span>${alertsHTML(c, H, room0)}</div>
    ${calStrip(c)}</div>`;
}
/** the season's end: the champions, where you and your team finished against the board's target */
function reviewHTML(c, rv = c.seasonReview()) {
  const col = { delighted: '#1fae64', satisfied: '#3d7bd9', concerned: '#e39a1b', unhappy: '#e5484d' }[rv.verdict];
  return `<div class="review"><small class="muted" style="letter-spacing:.14em;font-weight:700">SEASON ${rv.season} REVIEW</small>
      <div class="two" style="margin-top:8px"><div><span class="muted">Drivers' champion</span><b style="display:block;font-size:19px">${esc(rv.champion?.name || '-')}</b><span class="muted">${esc(rv.champion?.team || '')} · ${rv.champion?.points ?? 0} pts</span></div>
      <div><span class="muted">Constructors' champions</span><b style="display:block;font-size:19px">${esc(rv.constructor?.name || '-')}</b><span class="muted">${rv.constructor?.points ?? 0} pts</span></div></div>
      <div class="row" style="margin-top:10px"><span class="verdict" style="background:${col}">The board is ${rv.verdict}</span><span class="muted">You P${rv.youPos || '-'} with ${rv.youPts} pts · ${esc(c.myTeam)} P${rv.teamPos}, the target was P${rv.target}</span></div></div>`;
}
/** RACE WEEK › Calendar: every round as a card; the chosen one in detail (who scored there, or the forecast and who is coming) */
function calendarHTML(c, S, H) {
  const sel = clamp(+S.cr || (c.seasonOver ? c.rounds : c.round), 1, c.rounds);
  const cards = c.calendar.map((tid, i) => {
    const n = i + 1, r = c.log.find((x) => x.round === n), nx = !c.seasonOver && n === c.round, h = invitedAt(c, n), f = c.forecastAt(n);
    return `<button class="cl-card${r ? ' done' : nx ? ' next' : ''}${n === sel ? ' sel' : ''}" data-cr="${n}"><small>ROUND ${n}${nx ? ' · NEXT' : ''}${h ? ` <em class="ht${h > 1 ? ' clash' : ''}">♥${h > 1 ? h : ''}</em>` : ''}</small><b>${esc(TN(tid))}</b><span class="fc">${fcTxt(f)}</span><span>${r ? `${r.you ? 'P' + r.you : 'DNS'} · ${esc(last(r.winner))} won` : nx ? 'Next up' : ''}</span></button>`;
  }).join('');
  return `<div class="cl-cards" data-region="cards">${cards}</div><div class="cl-det" data-region="detail">${roundDetail(c, sel)}</div>`;
}
function roundDetail(c, n) {
  const tid = c.calendar[n - 1], r = c.log.find((x) => x.round === n), f = c.forecastAt(n);
  if (r) {
    // (who scored that round: the points each gained over it, from the championship's round-by-round record)
    const Hs = c.history || [], h = Hs.find((x) => x.round === n), p = Hs.filter((x) => (x.round || 0) < n).pop();
    const got = h ? Object.entries(h.pts || {}).map(([id, v]) => [id, v - (p?.pts?.[id] || 0)]).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 10) : [];
    return `<h3>Round ${n} · ${esc(TN(tid))}</h3><span class="muted">${esc(r.winner)} won · ${r.you ? `you were P${r.you}` : 'you did not start'} · ${fcTxt(f)}</span>
      ${got.length ? `<span class="lbl">Points scored that round</span><div class="cl-top">${got.map(([id, v], i) => `<div class="${id === c.playerId ? 'me' : ''}"><span class="n">${i + 1}</span><span class="sw" style="background:${esc(ink(c.teams[c.drivers[id]?.team]?.color))}"></span>${esc(c.drivers[id]?.name || id)}<span class="v">+${v}</span></div>`).join('')}</div>` : ''}`;
  }
  const names = Object.entries(c.celebs?.bonds || {}).filter(([, b]) => b?.invited && b.invited.season === c.season && b.invited.round === n).map(([id]) => id.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '));
  return `<h3>Round ${n} · ${esc(TN(tid))}</h3><span class="muted">${c.seasonOver ? 'Not raced this season.' : n === c.round ? 'The next race.' : `${n - c.round} race${n - c.round === 1 ? '' : 's'} away.`}</span>
    <span class="lbl">Race day</span><div>${fcTxt(f)} · ${f.weather === 'wet' ? 'full wets likely' : f.weather === 'damp' ? 'intermediates to start' : 'slicks'}</div>
    ${names.length ? `<span class="lbl">Invited</span><div>${esc(nameList(names))}${names.length > 1 ? ' <span class="down">- both at the same race</span>' : ''}</div>` : ''}`;
}

// ---- TEAM: the tech tree and the factory, your drivers, the market ---------------------------------------------------
/** TEAM › Tech tree (branches | upgrades | the chosen one) and TEAM › Factory (the queue and the facilities), both from HubTech */
function techPage(c, S, H) {
  const fac = S.sub === 'factory', fv = S.fv === 'mx' ? 'mx' : 'sum';
  let inner = '';
  try { inner = techHTML(c, fac ? { ...S, branch: 'facilities', up: null } : S, H); } catch (e) { console.warn('CareerHub: the tech tree failed', e); inner = '<div class="hub-wait"><p class="lead">The tech tree could not be drawn.</p></div>'; }
  const head = fac ? `<div data-slot="head"><div class="k-seg" style="--n:2;--k:${fv === 'mx' ? 1 : 0}"><button data-tfv="sum" class="${fv === 'sum' ? 'on' : ''}">Summary</button><button data-tfv="mx" class="${fv === 'mx' ? 'on' : ''}">Per branch</button></div></div>` : '';
  return `${head}<div class="hub-tt" data-sub="${fac ? 'factory' : ''}" data-fv="${fv}">${inner}</div>`;
}
// (the tree's three columns as regions, so a click changes only what it touches and each column keeps its place)
const TECH_REG = [['.tt-brs', 'brs'], ['.tt-sec', 'list'], ['.tt-det', 'detail']];
function techRegions(root0) { for (const [q, k] of TECH_REG) { const e = root0.querySelector(`.tt > ${q}`); if (e) e.dataset.region = k; } }
/** which of the tree's columns a click of HubTech's changed: a branch, an upgrade picked, a level started or re-tuned */
const techRegionsFor = (d) => (d.tbr != null || d.tdev != null || d.tre != null ? ['brs', 'list', 'detail'] : d.tup != null ? ['list', 'detail'] : null);
/** the branch's colour lives on the tree itself (outside the columns): carried over when only the columns change */
function techTint(pg, root0) { const a = pg.querySelector('.tt'), b = root0.querySelector('.tt'); if (a && b && a.getAttribute('style') !== b.getAttribute('style')) a.setAttribute('style', b.getAttribute('style') || ''); }
/** the tree's KPI chips (budget, pace, parts) up in the head slot, its long introduction behind an ⓘ */
function techHead(T) {
  const k = T.content.querySelector('.tt-kpis'); if (!k) return null;
  const lead = T.content.querySelector('.tt-head .lead')?.textContent || '';
  const box = document.createElement('div'); box.style.cssText = 'display:flex;align-items:center;gap:8px;min-width:0';
  if (lead) { const i = document.createElement('span'); i.className = 'ch-info'; i.title = lead; i.textContent = 'ⓘ'; box.append(i); }
  box.append(k); return box;
}
/** TEAM › Your drivers: the two seats side by side - form, licence, rating, the season, the head-to-head, contracts */
function seatsHTML(c, S, H) {
  const team = c.team, seats = c.seatsOf(team.name), mate = c.teammate(), h = c.h2h || { q: [0, 0], r: [0, 0] }, same = mate && h.mate === mate.id;
  const card = (d) => {
    const why = outWhy(c, d), m = moodSafe(d), pts = pointsOf(c, d), ends = d.id !== c.playerId && d.contract && d.contract.until <= c.season, me = d.id === c.playerId;
    return `<div class="seat dcard" style="--c:${esc(ink(team.color))}"><span class="nn">${d.number}</span>
      <div class="st-hd"><span class="ph">${face(d, team.color, team.color2)}</span><div class="st-nm"><b>${esc(d.name)}${me ? ' <em>YOU</em>' : ''}</b><small>${money(d.contract?.salary || 0)} a year to ${d.contract?.until ?? '-'}</small>
        <div class="st-chips">${why === 'injury' ? '<span class="chip-x red">Injured</span>' : why === 'ban' ? '<span class="chip-x red">Suspended (12 pts)</span>' : ''}${ends ? '<span class="chip-x amber">Contract ends</span>' : ''}${pts ? `<span class="chip-x${pts >= 9 ? ' red' : pts >= 6 ? ' amber' : ''}">Licence ${pts}/12</span>` : '<span class="chip-x">Clean licence</span>'}</div></div></div>
      <div class="st-rw"><span>Morale</span><span class="k-meter"><i style="--v:${(clamp(m.morale, 0, 100) / 100).toFixed(2)};--c:${moraleCol(m.morale)}"></i></span><b>${m.morale} · ${esc(safe(() => moraleLabel(m.morale), ''))}</b></div>
      <div class="st-rw"><span>Rating</span><span class="bar"><i style="width:${Math.max(0, (d.rating - 0.6) / 0.4) * 100}%;background:${esc(ink(team.color))}"></i></span><b>${(d.rating * 100).toFixed(1)} ${dTxt(d.lastDelta)}</b></div>
      <div class="st-rw"><span>Season</span><span class="txt">${d.starts} starts · ${d.wins}W ${d.podiums}P · ${d.poles || 0} poles</span><b>${d.points} pts</b></div>
      ${me && same ? `<div class="st-rw"><span>vs ${esc(last(mate.name))}</span><span class="txt">qualifying · races this season</span><b>Q ${h.q[0]}–${h.q[1]} · R ${h.r[0]}–${h.r[1]}</b></div>` : ''}
      ${ends ? `<div class="st-act"><button data-pick="${d.id}">RENEW →</button></div>` : ''}</div>`;
  };
  return `<div class="seats">${seats.map(card).join('')}${seats.length < 2 ? '<div class="seat dcard empty"><b>Empty seat</b><small>Sign someone from the market</small></div>' : ''}</div>
    <div class="reserve"><span class="grow">Your two seats: their form, their licences and their contracts. The market has the F1 grid (a buyout for the years left on a contract), the reserves, F2 and the juniors.</span><button data-tab="drivers" data-sub="market">THE MARKET →</button></div>`;
}
/** a list's pager for the head slot: ‹ page n of m › (the arrow keys too) */
const pagerHTML = (page, pages, note = '') => `<div data-slot="head"><span class="k-pager"><button data-page="${page - 1}" ${page <= 0 ? 'disabled' : ''} aria-label="Previous page">‹</button><span>${page + 1} / ${pages}${note ? ` · ${esc(note)}` : ''}</span><button data-page="${page + 1}" ${page >= pages - 1 ? 'disabled' : ''} aria-label="Next page">›</button></span></div>`;
/** TEAM › Market: everyone you could sign, filtered and sorted, a page at a time */
function marketHTML(c, S, H) {
  const team = c.team, flt = S.filter || 'all', srt = S.sort || 'rating';
  const F = { all: () => true, F1: (d) => d.from === 'F1', Reserve: (d) => d.from === 'Reserve', F2: (d) => d.from === 'F2', Junior: (d) => d.from === 'Junior' };
  const market = Object.values(c.drivers).filter((d) => d.alive && d.team !== team.name).filter(F[flt] || F.all)
    .sort(srt === 'ask' ? (a, b) => askOf(a) - askOf(b) : srt === 'rapport' ? (a, b) => c.rapportOf(b.id) - c.rapportOf(a.id) : (a, b) => b.rating - a.rating);
  const per = Math.min(14, H.per(60, 50)), pages = Math.max(1, Math.ceil(market.length / per)), page = clamp(+S.page || 0, 0, pages - 1), list = market.slice(page * per, page * per + per);
  const FL = ['all', 'F1', 'Reserve', 'F2', 'Junior'], SO = [['rating', 'Rating'], ['ask', 'Cheapest'], ['rapport', 'Rapport']];
  const row = (d) => {
    const r = c.rapportOf(d.id), now = d.team ? c.teams[d.team] : null, why = outWhy(c, d), m = moodSafe(d), bo = c.buyout(d);
    return `<div class="mk-row" style="--c:${esc(ink(now?.color || '#b9c1cc'))}">${face(d, now?.color, now?.color2)}<div class="nm"><b>${esc(d.name)}</b><small>${now ? esc(now.name) : esc(d.from) + (d.reserveOf ? ' · ' + esc(d.reserveOf) : '')}${why === 'injury' ? ' · injured' : why === 'ban' ? ' · suspended' : ''}</small></div>
      <div class="c"><b>${Math.round(d.rating * 100)}</b><small>rating</small></div><div class="c"><b>${money(askOf(d))}</b><small>asks</small></div><div class="c"><b>${bo ? money(bo) : '-'}</b><small>buyout</small></div>
      <div class="c"><span class="k-meter"><i style="--v:${(clamp(m.morale, 0, 100) / 100).toFixed(2)};--c:${moraleCol(m.morale)}"></i></span><small>morale ${m.morale}</small></div>
      <span class="rap" title="${esc(rapportLabel(r))} (${r > 0 ? '+' : ''}${r})">${rapI(r)}</span><button data-pick="${d.id}">NEGOTIATE</button></div>`;
  };
  return `${pagerHTML(page, pages, `${market.length} drivers`)}<div class="mk-hd"><div class="k-seg" style="--n:${FL.length};--k:${Math.max(0, FL.indexOf(flt))}">${FL.map((k) => `<button data-filter="${k}" class="${flt === k ? 'on' : ''}">${k === 'all' ? 'All' : k}</button>`).join('')}</div><span class="grow"></span><div class="k-seg" style="--n:${SO.length};--k:${Math.max(0, SO.findIndex(([k]) => k === srt))}">${SO.map(([k, n]) => `<button data-sort="${k}" class="${srt === k ? 'on' : ''}">${n}</button>`).join('')}</div></div>
    <div class="mk-list" data-region="list">${list.map(row).join('') || '<div class="mk-none">Nobody here.</div>'}</div>`;
}

// ---- LIFE › Paddock until HubSocial draws it: Paddock Rapport, a page at a time -----------------------------------------
function rapportHTML(c, S, H) {
  const rows = Object.entries(c.rapport).map(([id, v]) => [c.drivers[id], v]).filter(([d]) => d && d.alive && d.team).sort((a, b) => b[1] - a[1]);
  const pc = Math.max(5, Math.min(14, Math.floor((H.fit.h - 70) / 38))), per = pc * 2, pages = Math.max(1, Math.ceil(rows.length / per)), page = clamp(+S.page || 0, 0, pages - 1), L = rows.slice(page * per, page * per + per);
  const col = (rs) => `<div>${rs.map(([d, v]) => `<div class="sd"><span class="sw" style="background:${esc(ink(c.teams[d.team]?.color))}"></span><span class="nm">${esc(d.name)}</span><span class="rap">${rapI(v)}</span><span class="v" style="width:110px;font-weight:600;font-size:12px">${esc(rapportLabel(v))} ${v > 0 ? '+' : ''}${v}</span></div>`).join('')}</div>`;
  return `${pages > 1 ? pagerHTML(page, pages) : ''}<p class="lead" style="flex:none;margin:0">${RAPPORT_NAME}: your standing with every driver. Contact and crashes sour it; what you say can mend it, or wreck it.</p>
    <div class="sd-cols" data-region="list">${col(L.slice(0, pc))}${col(L.slice(pc))}</div>`;
}

// ---- SEASON: the standings, the results, the charts, the trophies, the history -----------------------------------------
/** a driver's marks in a table: † killed, ⊘ serving a ban, ✚ out injured */
const marks = (c, d) => (!d.alive ? ' †' : outWhy(c, d) === 'ban' ? ' ⊘' : outWhy(c, d) === 'injury' ? ' ✚' : '');
function standingsHTML(c, S, H) {
  const ds = c.driverStandings(), mx = Math.max(1, ...ds.map((d) => d.points));
  const pc = Math.min(11, Math.max(6, Math.floor((H.fit.h - 28) / 36))), per = pc * 2, pages = Math.max(1, Math.ceil(ds.length / per)), page = clamp(+S.page || 0, 0, pages - 1), L = ds.slice(page * per, page * per + per);
  const row = (d, i) => `<div class="sd${d.id === c.playerId ? ' me' : ''}"><span class="n">${page * per + i + 1}</span><span class="sw" style="background:${esc(ink(c.teams[d.team]?.color))}"></span><span class="nm">${esc(d.name)}<span class="mk">${marks(c, d)}</span></span><span class="bar"><i style="width:${(d.points / mx) * 100}%;background:${esc(ink(c.teams[d.team]?.color))}"></i></span><span class="v">${d.points}</span></div>`;
  return `${pages > 1 ? pagerHTML(page, pages) : '<div data-slot="head"><span class="sd-key">✚ injured · ⊘ suspended · † lost</span></div>'}<div class="sd-cols" data-region="list"><div>${L.slice(0, pc).map((d, i) => row(d, i)).join('')}</div><div>${L.slice(pc).map((d, i) => row(d, i + pc)).join('')}</div></div>`;
}
function teamsHTML(c, S, H) {
  const ts = c.teamStandings(), mt = Math.max(1, ...ts.map((t) => t.points));
  return `<div class="sd-cols one">${ts.map((t, i) => `<div class="sd${t.own ? ' me' : ''}" style="height:34px"><span class="n">${i + 1}</span><span class="sw" style="background:${esc(ink(t.color))}"></span><span class="nm" style="flex-basis:200px">${esc(t.name)}</span><span class="bar"><i style="width:${(t.points / mt) * 100}%;background:${esc(ink(t.color))}"></i></span><span class="v">${t.points}</span></div>`).join('')}</div>`;
}
function resultsHTML(c, S, H) {
  const L = [...c.log].reverse(), per = H.per(40, 10), pages = Math.max(1, Math.ceil(L.length / per)), page = clamp(+S.page || 0, 0, pages - 1), rs = L.slice(page * per, page * per + per);
  return `${pages > 1 ? pagerHTML(page, pages) : ''}<div class="rp-list" data-region="list">${rs.map((r) => `<div class="rs-row"><span class="n">R${r.round}</span><span>${esc(TN(r.track))}</span><span class="muted">${esc(r.winner)} won</span><span class="v">${r.you ? 'P' + r.you : 'DNS'}</span></div>`).join('') || '<div class="muted" style="padding:14px 4px">No races yet this season.</div>'}</div>`;
}
/** SEASON › Charts: car pace, race pace, points, position, morale, the public image - drawn to the page's size */
function chartsHTML(c, S, H) {
  const Hs = c.history || [], xs = Hs.map((h) => (h.round ? 'R' + h.round : 'Start')), teams = Object.values(c.teams), me = c.me, k = S.chart || 'pace';
  const kinds = [['pace', 'Car pace'], ['race', 'Race pace'], ['points', 'Points'], ['pos', 'Position'], ['morale', 'Morale'], ['image', 'Image']];
  // (the drawing sized to what is left of the page once the switch, the legend - a row for every six or so names - and the note are in)
  const lr = (n) => Math.ceil(n / Math.max(1, Math.floor((H.fit.w - 16) / 125)));
  const szFor = (n) => ({ w: Math.max(480, H.fit.w - 18), h: clamp(H.fit.h - 120 - lr(n) * 30, 180, 520) });
  let chart = '', note = '', sz = szFor(teams.length);
  const dsOf = () => { const ds = c.driverStandings().filter((d) => d.alive).slice(0, 8); for (const d of [me, c.teammate()]) if (d && !ds.includes(d)) ds.push(d); return ds; };
  const ser = (ds, val) => ds.map((d) => ({ key: d.id, name: d.name, short: d.short || d.name.slice(0, 3).toUpperCase(), color: ink(c.teams[d.team]?.color || '#888'), bold: d.id === c.playerId, pts: Hs.map(val(d)) }));
  if (k === 'pace') {
    chart = chartHTML('pace', teams.map((t) => ({ key: t.name, name: t.name, short: teamShort(t.name), color: ink(t.color), bold: !!t.own, pts: Hs.map((h) => (h.perf?.[t.name] != null ? (Math.max(...Object.values(h.perf)) - h.perf[t.name]) * 90 : null)) })), xs, { invert: true, fmt: (v) => (v < 0.005 ? '0.00' : '+' + v.toFixed(2)), ...sz });
    note = 'Every car\'s pace from its development - the gap to the fastest car, in seconds a lap. Lower is faster.';
  } else if (k === 'race') {
    const R = Hs.filter((h) => h.lap && Object.keys(h.lap).length);
    chart = chartHTML('race', teams.map((t) => ({ key: t.name, name: t.name, short: teamShort(t.name), color: ink(t.color), bold: !!t.own, pts: R.map((h) => (h.lap[t.name] != null ? h.lap[t.name] - Math.min(...Object.values(h.lap)) : null)) })), R.map((h) => 'R' + h.round), { invert: true, fmt: (v) => (v < 0.005 ? '0.00' : '+' + v.toFixed(2)), ...sz });
    note = 'What the cars actually did: each team\'s best race lap against the fastest that day, in seconds.';
  } else if (k === 'points') { chart = chartHTML('points', ser(dsOf(), (d) => (h) => h.pts?.[d.id] ?? 0), xs, { int: true, fmt: (v) => Math.round(v), ...sz }); note = 'The championship points, round by round: the leaders, you and your team-mate.'; }
  else if (k === 'pos') {
    const posAt = (h, id) => { const arr = Object.entries(h.pts || {}).sort((a, b) => b[1] - a[1]); const i = arr.findIndex(([x]) => x === id); return i < 0 ? null : i + 1; };
    chart = chartHTML('pos', ser(dsOf(), (d) => (h) => (h.round ? posAt(h, d.id) : null)), xs, { invert: true, int: true, fmt: (v) => 'P' + Math.round(v), ...sz });
    note = 'Where each of them stood in the championship after every round.';
  } else if (k === 'morale') {
    const ds = [me, c.teammate(), ...c.driverStandings().filter((d) => d.alive).slice(0, 6)].filter((d, i, a) => d && a.indexOf(d) === i);
    chart = chartHTML('morale', ser(ds, (d) => (h) => h.morale?.[d.id] ?? null), xs, { int: true, fmt: (v) => Math.round(v), ...sz });
    note = 'Morale after every round (0-100): results against what was expected, the team-mate, the week between races.';
  } else {
    const ph = (c.pr?.hist || []).filter((h) => h && h.season === c.season), x2 = ph.map((h) => 'R' + h.round); sz = szFor(3);
    chart = chartHTML('image', [['image', 'Public image', '#3d7bd9', true], ['heat', 'Heat', '#e5484d', false], ['appeal', 'Sponsor appeal', '#1fae64', false]].map(([key, name, color, bold]) => ({ key, name, short: name.split(' ').pop(), color, bold, pts: ph.map((h) => (h[key] != null ? h[key] : null)) })), x2, { int: true, fmt: (v) => Math.round(v), ...sz });
    note = 'How the public sees you this season: your image (-100 to 100), the heat of any controversy and how sponsors rate you.';
  }
  return `<div class="ct-hd"><div class="k-seg" style="--n:${kinds.length};--k:${Math.max(0, kinds.findIndex(([x]) => x === k))}">${kinds.map(([x, n]) => `<button data-chartk="${x}" class="${k === x ? 'on' : ''}">${n}</button>`).join('')}</div></div>
    <div class="ct-body" data-region="chart">${chart}<p class="muted">${note} Hover for the values; pick names in the legend to compare.</p></div>`;
}
function trophiesHTML(c, S, H) {
  const got = c.trophies.length, per = H.per(112, 90, 5), pages = Math.max(1, Math.ceil(TROPHIES.length / per)), page = clamp(+S.page || 0, 0, pages - 1), L = TROPHIES.slice(page * per, page * per + per);
  return `${pages > 1 ? pagerHTML(page, pages) : ''}<div class="tr-hd"><b>${got} of ${TROPHIES.length} trophies</b><span class="muted">Every milestone of the career.</span></div>
    <div class="trophies" data-region="list">${L.map((T) => { const e = c.earned(T.id); return `<div class="tro${e ? ' on' : ''}" data-tdesc="${esc(`${T.name}: ${T.desc}`)}" title="${esc(T.desc)}"><div class="cup">${e ? '🏆' : '◇'}</div><b>${esc(T.name)}</b><small${e ? ' class="when"' : ''}>${e ? `${e.round ? `R${e.round} · ` : ''}${e.season}` : 'not yet'}</small></div>`; }).join('')}</div>
    <div class="tro-line">Point at a trophy to see what it takes.</div>`;
}
function historyHTML(c, S, H) {
  const Ss = [...(c.seasons || [])].reverse(), titles = Ss.filter((s) => s.youPos === 1).length, best = Ss.reduce((a, s) => (s.youPos && (!a || s.youPos < a) ? s.youPos : a), 0);
  const per = H.per(38, 120), pages = Math.max(1, Math.ceil(Ss.length / per)), page = clamp(+S.page || 0, 0, pages - 1), L = Ss.slice(page * per, page * per + per);
  return `${pages > 1 ? pagerHTML(page, pages) : ''}<div class="hs-tiles"><div class="tile"><small>Seasons</small><b>${Ss.length}</b><span>completed</span></div><div class="tile"><small>Titles</small><b>${titles}</b><span>drivers' championships</span></div><div class="tile"><small>Best finish</small><b>${best ? 'P' + best : '-'}</b><span>in a championship</span></div><div class="tile"><small>Trophies</small><b>${c.trophies.length}</b><span>of ${TROPHIES.length}</span></div></div>
    <div data-region="list">${L.map((s) => `<div class="hs-row"><b>${s.season}</b><span>You P${s.youPos ?? '-'} (${s.youPts} pts) · team P${s.teamPos} <span class="muted">(target P${s.target})</span></span><span class="muted">${esc(s.champion)} champion</span><span class="muted">${esc(s.constructor || '')}</span></div>`).join('') || '<div class="muted" style="padding:14px 4px">The first season is under way.</div>'}</div>`;
}

// ---- IN MEMORIAM ---------------------------------------------------------------------------------------------------
/** those this career has lost: the helmet, the name, the starts - quiet, a page at a time, no motion but a slow fade */
function lostHTML(c, o, S, H) {
  const per = H.per(272, 90, 4, 1), L = c.lost || [], pages = Math.max(1, Math.ceil(L.length / per)), page = clamp(+S.page || 0, 0, pages - 1), P = L.slice(page * per, page * per + per);
  return `<h2 class="lm-h">IN MEMORIAM</h2><p class="lead">${L.length ? 'Those this career has lost. Never forgotten.' : 'No one has been lost.'}</p>
    ${L.length ? `<div class="lm-list" data-region="list"><div class="lostgrid">${P.map((l) => `<div class="lostcard"><img src="${o.helmet?.(l, { colour: true }) || ''}" alt=""><div><b>${esc(l.name)}</b><small>#${l.number} · ${esc(l.team || '')}</small><small>${l.starts} starts · ${l.wins} wins · ${l.podiums} podiums</small><small>Season ${l.season}, round ${l.round}</small></div></div>`).join('')}</div>
    ${pages > 1 ? `<div class="lm-pg"><button data-page="${page - 1}" ${page <= 0 ? 'disabled' : ''}>previous</button><span>${page + 1} of ${pages}</span><button data-page="${page + 1}" ${page >= pages - 1 ? 'disabled' : ''}>next</button></div>` : ''}</div>` : ''}`;
}
const rapI = (v) => `<i style="left:${v < 0 ? 50 + v / 2 : 50}%;width:${Math.abs(v) / 2}%;background:${v < 0 ? '#e5484d' : '#1fae64'}"></i>`;

// ---- the mourning screen --------------------------------------------------------------------------------------------
/**
 * Your driver killed: black and white, the bloodied helmet, the name, the career's starts, a candle. You cannot click
 * past it: HOLD TO LEAVE (the mouse, a finger, Space or Enter) for 4.5 s - and as you hold, the low drone under the
 * screen is filtered down into total silence and the candle's flame shrinks, gutters and goes out into black. Let go
 * and it comes back. Then the career menu. o: { audio } (the game's AudioEngine, for the drone)
 */
export function showMourning(d, helmetURL, done, o = {}) {
  injectCSS();
  const el = document.createElement('div'); el.id = 'mourning';
  el.innerHTML = `<div class="in">${o.helmet3d ? '<canvas class="hel3d"></canvas>' : helmetURL ? `<img src="${helmetURL}" alt="">` : ''}<h2>${esc(d.name)}</h2>
    <div class="meta">#${esc(d.number)} · ${esc(d.team || '')}</div>
    <div class="starts">${d.starts} career start${d.starts === 1 ? '' : 's'}${d.wins ? ` · ${d.wins} win${d.wins > 1 ? 's' : ''}` : ''}${d.podiums ? ` · ${d.podiums} podium${d.podiums > 1 ? 's' : ''}` : ''}</div>
    <div class="candle"><div class="glow"></div><div class="flame"><i></i></div><div class="wick"></div><div class="wax"></div><div class="smoke"></div></div>
    <button class="hold"><span class="fill"></span><b>HOLD TO LEAVE</b></button></div><div class="dark"></div>`;
  document.body.appendChild(el);
  // (the helmet and the candle in 3D, the flame the light on it: ui/Mourning3D.js - else the photograph and the drawn candle)
  let live = null;
  if (o.helmet3d) {
    live = mourning3D(el.querySelector('canvas.hel3d'), o.helmet3d);
    if (live) el.classList.add('live');
    else el.querySelector('canvas.hel3d').outerHTML = helmetURL ? `<img src="${helmetURL}" alt="">` : '';
  }
  requestAnimationFrame(() => el.classList.add('show')); setTimeout(() => el.classList.add('show'), 50);
  // the drone: a low, slow pad (A1 / E2 / A2, a breath of detune) through a low-pass, from the silence after the strings
  const A = o.audio, ctx = A?.ready ? A.ctx : null; let drone = null;
  if (ctx) {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.8;
    const g = ctx.createGain(); g.gain.value = 0; lp.connect(g); g.connect(A.sfx);
    const oscs = [[55, 'sawtooth', 0.5], [82.41, 'sine', 0.8], [110.3, 'sawtooth', 0.35], [109.7, 'triangle', 0.4]].map(([f, type, v]) => { const os = ctx.createOscillator(); os.type = type; os.frequency.value = f; const og = ctx.createGain(); og.gain.value = v; os.connect(og); og.connect(lp); os.start(); return os; });
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 140; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
    g.gain.setTargetAtTime(0.13, ctx.currentTime + 2.5, 2.2);
    drone = { lp, g, stop: () => { const t = ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0, t, 0.05); setTimeout(() => { for (const x of [...oscs, lfo]) { try { x.stop(); } catch (e) { /* stopped */ } } g.disconnect(); }, 600); } };
  }
  const btn = el.querySelector('.hold'), fill = btn.querySelector('.fill'), flame = el.querySelector('.flame'), glow = el.querySelector('.glow'), dark = el.querySelector('.dark'), smoke = el.querySelector('.smoke');
  setTimeout(() => btn.classList.add('on'), 7000);
  const HOLD = 4.5; let p = 0, holding = false, last0 = performance.now(), over = false;
  const tick = (now) => {
    if (over) return;
    const dt = Math.min(0.1, (now - last0) / 1000); last0 = now;
    if (btn.classList.contains('on')) p = Math.max(0, Math.min(1, p + (holding ? dt / HOLD : -dt / 1.5)));
    // the drone filtered down (the cutoff falls away to nothing, the level with it), the flame guttering out
    if (drone) { const t = ctx.currentTime; drone.lp.frequency.setTargetAtTime(30 + 870 * Math.pow(1 - p, 2.2), t, 0.08); if (p > 0) drone.g.gain.setTargetAtTime(0.13 * Math.pow(1 - p, 1.6), t, 0.1); else drone.g.gain.setTargetAtTime(0.13, t, 0.5); }
    const f = 1 - p, flick = p > 0.75 ? 0.6 + Math.random() * 0.4 : 1;
    flame.style.transform = `translateX(-50%) scale(${(0.25 + 0.75 * f) * flick}, ${(0.15 + 0.85 * f) * flick})`; flame.style.opacity = f < 0.02 ? 0 : 0.4 + 0.6 * f;
    glow.style.opacity = 0.85 * f * f; dark.style.opacity = p * (live ? 0.55 : 0.92); fill.style.width = `${p * 100}%`;   // (live: the candle's own light does the darkening)
    live?.set(p >= 1 ? 0 : f, now / 1000);
    if (p >= 1) {
      over = true; flame.style.opacity = 0; glow.style.opacity = 0; smoke.classList.add('on'); drone?.stop();
      if (live) { const smoke3 = (n) => { if (!el.isConnected) { live.dispose(); return; } live.set(0, n / 1000); requestAnimationFrame(smoke3); }; requestAnimationFrame(smoke3); }   // (the smoke rising off the wick into the dark)
      window.removeEventListener('keydown', kd, true); window.removeEventListener('keyup', ku, true);
      dark.style.transition = 'opacity 2.2s ease'; dark.style.opacity = 1;   // (the light gone: black)
      setTimeout(() => { el.remove(); done?.(); }, 3200);
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  const down = (e) => { if (!btn.classList.contains('on')) return; e.preventDefault?.(); holding = true; btn.classList.add('held'); };
  const up = () => { holding = false; btn.classList.remove('held'); };
  btn.addEventListener('pointerdown', down); window.addEventListener('pointerup', up); btn.addEventListener('pointerleave', up);
  const kd = (e) => { if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat) { e.preventDefault(); down(e); } };
  const ku = (e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); up(); } };
  window.addEventListener('keydown', kd, true); window.addEventListener('keyup', ku, true);
}
