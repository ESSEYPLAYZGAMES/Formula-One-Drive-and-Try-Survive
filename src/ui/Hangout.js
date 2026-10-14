// An evening out between race weekends, in 3D and on foot (the career hub hands over to it): a rooftop lounge high
// over the Strip at night with the Sphere glowing across the city, a village pub near Silverstone with rain on the leaded
// windows and a fire in the inglenook, a sim-racing lounge in neon, your own flat with dinner to cook, a private dining
// room lit by candles, an indoor karting hall - or, in a hard week, a quiet corner café. You walk in (WASD or the
// arrows, Shift to hurry, the mouse to look: click for pointer lock, or drag), the people you came with are there - the
// drivers in their own clothes, the celebrity you are seeing in hers, standing at the glass or sitting at the table -
// and E does whatever is in front of you: talk (ui/HangoutTalk.js: typed out, answered 1-4 in a tone, three
// conversations with each of them), order something (coffee, juices, mocktails, food: everyone is in season), change
// the music, sit down, step out for a quiet minute at the window or on the balcony, take a photo together, or play: pool
// and darts at the pub, a lights-out start and a lap on the sim rigs, the arcade cabinet, three laps of the karting
// track against them, dinner at the kitchen island. F raises a glass. A long lens outside a low-privacy place can catch
// the two of you (a flash at the edge of the night), and if you are seeing more than one person your phone may pick its
// moment to buzz. Esc (or Q, or LEAVE) calls it a night; after six minutes or so the evening starts to wind down by
// itself. What it came to - a score, the moments, the games, the tones you took, whether anyone got a picture - goes
// back to the career as the result (Social.hangoutResult); nothing here writes to the career. At these seven evening
// venues (rooftop, pub, sim lounge, flat, restaurant, karting, café) it is soft drinks - everyone is in season - and the
// drivers are real people, so the evening is only ever racing, games, food, music and the job; a grave week is a quiet
// coffee and kind words, with no music, no games, no cameras and no phone. Nobody wishes anyone harm.
// The after-party is different (party hook blocks; the rooms are ui/PartyVenues.js's, the night ui/PartyPlay.js's, the
// result career/Party.js's partyResult): the team's hospitality after the debrief, then a Strip nightclub or a Mayfair
// members' club - realistic adult F1 nightlife as it happens: alcohol and its consequences, revealing but realistic
// clubwear, PG romance with the invented adult stars, handbags scuffles with invented people only. Never nudity, sexual
// content or poses, illegal drugs (not even implied), drink-driving or underage drinking (21 in Nevada, 18 in London).
// Real drivers attend, toast, dance and network, but are never drunk, never in romance or scandal and never in a fight.
// Hosted (the usual way, o.host): the evening happens in the game's own world - the Las Vegas, or the Silverstone, you
// race in, with the real Sphere and its shows across the road - drawn by the game's renderer and camera. The place is one
// group standing at the anchor the game picks, its glass and windows turned to the view, a tower under it when it is
// high up; the painted skylines are left out. Unhosted, it opens its own renderer over a painted night (the fallback).
// Built for an Intel UHD laptop: no shadows, glow from emissive materials and soft decals, every venue's static geometry
// merged into one mesh per look (the plain ones sharing a mesh, their colour in the vertices), and the people built one a
// frame behind the opening cover. Its own renderer has one hemisphere and one directional light; hosted, it adds no light
// to the world at all - the room's light is folded into its own materials (see roomLit).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makePerson } from '../world/People.js';
import { lookOf as lookOfMe } from '../world/People.js';
import { CLUB_KITS_M } from '../world/People.js';
import { FLOOD } from '../world/Lighting.js';
import * as Celebs from '../career/Celebs.js';
import * as HT from './HangoutTalk.js';
// (her look, planned in the room - L, on the roof and at dinner: ui/HubStyle.js's sheet)
import { sheetFor, openStyleSheet } from './HubStyle.js';
// party hook: the after-party's rooms (ui/PartyVenues.js), its play layer (ui/PartyPlay.js) and its crowd (world/PartyCrowd.js)
import { PARTY_PLACES, PARTY_ALIAS, PARTY_HOSTED, PARTY_FOOTPRINT, PARTY_ORDERS, partyClock, partyOccasion, brandLook, zoneAt, spotFor, isPartyVenue } from './PartyVenues.js';
import { PartyPlay } from './PartyPlay.js';
import { PartyCrowd } from '../world/PartyCrowd.js';
// pool hook: the pool club - by night, or (dayclub) by day - built by ui/PartyPool.js
import { POOL_PLACES, POOL_ALIAS, POOL_HOSTED, POOL_FOOTPRINT, POOL_ORDERS, poolOccasion, poolDriverLook } from './PartyPool.js';
// affection hook: hugs, holding, a slow dance, a kiss - and the drink - at any evening (ui/Affection.js)
import { Affection, AFFECTION_ON } from './Affection.js';
import { papsSeen, papsPrompt, papsKey, papsTick, papsResultInto, papsLens, papsNote, papsDispose, papsLab } from './PapsConfront.js';
export const HANGOUT_CSS = `
#hangout { position: fixed; inset: 0; z-index: 47; background: #000; color: #fff; font-family: 'Segoe UI', Roboto, Arial, sans-serif; overflow: hidden; user-select: none; -webkit-user-select: none; --hc: #e10600; }
#hangout canvas.hg-3d { position: absolute; inset: 0; width: 100%; height: 100%; display: block; outline: none; }
#hangout.hosted { background: transparent; }
#hangout .hg-pad { position: absolute; inset: 0; outline: none; }
#hangout-curtain { position: fixed; inset: 0; z-index: 47; background: #000; pointer-events: none; opacity: 1; transition: opacity .26s ease; }
#hangout-curtain.off { opacity: 0; }
#hangout .hg-ui { position: absolute; inset: 0; pointer-events: none; }
#hangout button { font-family: inherit; }
#hangout kbd { display: inline-block; min-width: 18px; padding: 1px 6px; margin-right: 6px; border-radius: 4px; background: #fff; color: #111; font: 900 11.5px/1.35 'Segoe UI', Arial, sans-serif; text-align: center; }
#hangout .hg-bug { position: absolute; left: 22px; top: 18px; display: flex; height: 30px; box-shadow: 0 2px 10px rgba(0,0,0,.45); max-width: calc(100vw - 170px); }
#hangout .hg-bug b { background: var(--hc); padding: 0 12px; display: flex; align-items: center; font: 900 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; white-space: nowrap; }
#hangout .hg-bug i { background: rgba(10,12,18,.92); padding: 0 12px; display: flex; align-items: center; font: 600 12.5px/1 'Segoe UI', Arial, sans-serif; font-style: normal; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
#hangout .hg-bug em { background: rgba(10,12,18,.92); border-left: 1px solid rgba(255,255,255,.12); padding: 0 11px; display: flex; align-items: center; font: 700 12.5px/1 'Segoe UI', Arial, sans-serif; font-style: normal; font-variant-numeric: tabular-nums; color: #c9ced8; }
#hangout .hg-leave { position: absolute; right: 22px; top: 18px; pointer-events: auto; background: rgba(10,12,18,.92); color: #fff; border: 1px solid rgba(255,255,255,.24); border-radius: 6px; padding: 8px 14px; font: 800 11.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .16em; cursor: pointer; transition: background .14s, border-color .14s; }
#hangout .hg-leave:hover, #hangout .hg-leave:focus-visible { background: var(--hc); border-color: var(--hc); outline: none; }
#hangout .hg-dot { position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; margin: -2px; border-radius: 50%; background: rgba(255,255,255,.85); box-shadow: 0 0 3px #000; transition: opacity .14s; }
#hangout .hg-prompt { position: absolute; left: 50%; bottom: 24px; transform: translate(-50%, 8px); background: rgba(10,12,18,.9); border: 1px solid rgba(255,255,255,.1); padding: 8px 14px; border-radius: 999px; font: 700 13.5px/1.25 'Segoe UI', Arial, sans-serif; opacity: 0; transition: opacity .16s, transform .16s; white-space: nowrap; text-align: center; max-width: calc(100vw - 32px); }
#hangout .hg-prompt.in { opacity: 1; transform: translate(-50%, 0); }
#hangout .hg-prompt small { display: block; font-weight: 500; color: #aeb5c2; margin-top: 2px; font-size: 11.5px; }
#hangout .hg-prompt span + span::before { content: '·'; margin: 0 9px; color: #6d7482; }
#hangout .hg-sub { position: absolute; left: 50%; bottom: 84px; transform: translate(-50%, 6px); max-width: min(720px, calc(100vw - 40px)); background: rgba(10,12,18,.82); padding: 6px 12px; border-radius: 6px; font: 500 15px/1.35 'Segoe UI', Arial, sans-serif; text-align: center; opacity: 0; transition: opacity .2s, transform .2s; }
#hangout .hg-sub.in { opacity: 1; transform: translate(-50%, 0); }
#hangout .hg-sub b { font: 800 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: var(--hc); margin-right: 8px; }
#hangout .hg-tags, #hangout .hg-bars { position: absolute; inset: 0; pointer-events: none; }
#hangout .hg-tag { position: absolute; left: 0; top: 0; transform: translate(-50%, -100%); font: 700 11.5px/1.25 'Segoe UI', Arial, sans-serif; text-align: center; text-shadow: 0 1px 3px #000, 0 0 8px rgba(0,0,0,.6); white-space: nowrap; opacity: 0; transition: opacity .2s; }
#hangout .hg-tag small { display: block; font-weight: 500; color: #c9ced8; font-size: 10.5px; }
#hangout .hg-toasts { position: absolute; right: 22px; top: 62px; display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
#hangout .hg-toast { background: rgba(10,12,18,.9); border-left: 3px solid #8c93a0; padding: 7px 11px; font: 600 13px/1.3 'Segoe UI', Arial, sans-serif; max-width: 320px; opacity: 0; transform: translateX(16px); transition: opacity .2s, transform .2s; }
#hangout .hg-toast.in { opacity: 1; transform: none; }
#hangout .hg-toast.up { border-color: #3fb06a; } #hangout .hg-toast.down { border-color: #e5484d; } #hangout .hg-toast.warn { border-color: #f5b400; }
#hangout .hg-talk { position: absolute; left: 50%; bottom: 22px; transform: translate(-50%, 20px); width: min(760px, calc(100vw - 32px)); background: rgba(12,14,20,.92); border: 1px solid rgba(255,255,255,.12); border-radius: 10px; padding: 13px 18px 11px; opacity: 0; transition: opacity .26s, transform .26s; pointer-events: none; box-shadow: 0 10px 40px rgba(0,0,0,.5); box-sizing: border-box; }
#hangout .hg-talk.in { opacity: 1; transform: translate(-50%, 0); pointer-events: auto; }
#hangout .hg-talk .who { font: 800 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; color: var(--hc); text-transform: uppercase; }
#hangout .hg-talk .who small { color: #8c93a0; font-weight: 600; letter-spacing: .06em; margin-left: 8px; text-transform: none; font-size: 12px; }
#hangout .hg-talk .line { font: 500 clamp(15px, 1.35vw, 18px)/1.45 'Segoe UI', Arial, sans-serif; margin: 8px 0 4px; min-height: 48px; }
#hangout .hg-talk .line.me { color: #b9c0cc; font-style: italic; }
#hangout .hg-talk .opts { display: flex; flex-direction: column; gap: 5px; margin-top: 6px; }
#hangout .hg-talk .opts button { text-align: left; background: rgba(255,255,255,.05); color: #eef1f5; border: 1px solid rgba(255,255,255,.1); border-radius: 6px; padding: 7px 10px; font: 500 14.5px/1.35 'Segoe UI', Arial, sans-serif; cursor: pointer; display: flex; gap: 10px; align-items: baseline; opacity: 0; transform: translateY(6px); transition: opacity .2s calc(var(--i, 0) * 40ms), transform .2s calc(var(--i, 0) * 40ms), background .14s; }
#hangout .hg-talk .opts button.in { opacity: 1; transform: none; }
#hangout .hg-talk .opts button:hover, #hangout .hg-talk .opts button:focus-visible { background: rgba(255,255,255,.13); outline: none; }
#hangout .hg-talk .opts button:disabled { opacity: .4; cursor: default; }
#hangout .hg-talk .opts button b { font: 900 12px/1.6 'Segoe UI', Arial, sans-serif; color: #8c93a0; min-width: 14px; }
#hangout .hg-talk .opts button i { margin-left: auto; font: 700 9.5px/1.9 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; font-style: normal; color: #7d8592; white-space: nowrap; }
#hangout .hg-talk .opts button i u { text-decoration: none; margin-left: 8px; color: #c8b66a; }
#hangout .hg-talk .opts button[data-tone=cruel] i { color: #e5484d; } #hangout .hg-talk .opts button[data-tone=kind] i { color: #6cc08b; } #hangout .hg-talk .opts button[data-tone=sorry] i { color: #c8b66a; }
#hangout .hg-talk .opts button[data-tone=gossip] i { color: #c27ad6; } #hangout .hg-talk .opts button[data-tone=flirt] i { color: #ef7fb4; } #hangout .hg-talk .opts button[data-tone=show] i { color: #e8a24a; }
#hangout .hg-talk .opts button[data-tone=firm] i { color: #8fb3e8; } #hangout .hg-talk .opts button[data-tone=light] i { color: #7fd4d8; }
#hangout .hg-talk .next { text-align: right; font: 600 11px/1 'Segoe UI', Arial, sans-serif; color: #7d8592; letter-spacing: .1em; min-height: 11px; }
#hangout .hg-ask, #hangout .hg-buzz { position: absolute; background: rgba(12,14,20,.95); border: 1px solid rgba(255,255,255,.14); border-radius: 12px; box-shadow: 0 14px 40px rgba(0,0,0,.55); opacity: 0; transition: opacity .2s, transform .2s; pointer-events: none; box-sizing: border-box; }
#hangout .hg-ask { left: 50%; top: 50%; transform: translate(-50%, -46%); width: min(380px, calc(100vw - 32px)); padding: 20px 22px 16px; text-align: center; }
#hangout .hg-ask.in { opacity: 1; transform: translate(-50%, -50%); pointer-events: auto; }
#hangout .hg-ask h3 { margin: 0 0 4px; font: 800 19px/1.2 'Segoe UI', Arial, sans-serif; }
#hangout .hg-ask p { margin: 0 0 14px; font: 500 13px/1.4 'Segoe UI', Arial, sans-serif; color: #aeb5c2; }
#hangout .hg-ask div { display: flex; gap: 8px; }
#hangout .hg-ask button, #hangout .hg-buzz button { flex: 1; background: rgba(255,255,255,.06); color: #fff; border: 1px solid rgba(255,255,255,.16); border-radius: 8px; padding: 10px 8px; font: 700 12.5px/1.2 'Segoe UI', Arial, sans-serif; cursor: pointer; transition: background .14s; }
#hangout .hg-ask button:hover, #hangout .hg-buzz button:hover { background: rgba(255,255,255,.14); }
#hangout .hg-ask button.go { background: var(--hc); border-color: var(--hc); }
#hangout .hg-buzz { right: 22px; bottom: 22px; width: min(330px, calc(100vw - 32px)); padding: 12px 13px 12px; transform: translateX(40px); }
#hangout .hg-buzz.in { opacity: 1; transform: none; pointer-events: auto; }
#hangout .hg-buzz header { display: flex; align-items: center; gap: 9px; font: 800 10.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .16em; color: #8c93a0; text-transform: uppercase; }
#hangout .hg-buzz header i { width: 26px; height: 26px; border-radius: 50%; background: var(--bc, #c83a6a); display: flex; align-items: center; justify-content: center; font: 800 11px/1 'Segoe UI', Arial, sans-serif; color: #fff; font-style: normal; letter-spacing: 0; }
#hangout .hg-buzz p { margin: 8px 0 10px; font: 500 14px/1.35 'Segoe UI', Arial, sans-serif; }
#hangout .hg-buzz p b { display: block; font-weight: 800; font-size: 13px; margin-bottom: 2px; }
#hangout .hg-buzz div { display: flex; flex-direction: column; gap: 5px; }
#hangout .hg-buzz button { text-align: left; font-weight: 600; padding: 8px 10px; }
#hangout .hg-buzz s { display: block; height: 3px; margin-top: 9px; border-radius: 2px; background: rgba(255,255,255,.14); overflow: hidden; text-decoration: none; }
#hangout .hg-buzz s u { display: block; height: 100%; background: #fff; transform-origin: left; text-decoration: none; }
#hangout .hg-mg { position: absolute; left: 50%; top: 16px; transform: translate(-50%, -8px); display: flex; flex-direction: column; align-items: center; gap: 5px; opacity: 0; transition: opacity .2s, transform .2s; text-align: center; }
#hangout .hg-mg.in { opacity: 1; transform: translate(-50%, 0); }
#hangout .hg-mg b { background: var(--hc); padding: 6px 12px; font: 900 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .18em; }
#hangout .hg-mg span { background: rgba(10,12,18,.9); padding: 6px 12px; border-radius: 6px; font: 700 15px/1.25 'Segoe UI', Arial, sans-serif; font-variant-numeric: tabular-nums; white-space: nowrap; }
#hangout .hg-mg small { background: rgba(10,12,18,.8); padding: 4px 10px; border-radius: 6px; font: 600 12px/1.3 'Segoe UI', Arial, sans-serif; color: #c9ced8; }
#hangout .hg-mgh { position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%); background: rgba(10,12,18,.85); padding: 7px 13px; border-radius: 999px; font: 600 12.5px/1.3 'Segoe UI', Arial, sans-serif; color: #dfe3ea; white-space: nowrap; opacity: 0; transition: opacity .2s; }
#hangout .hg-mgh.in { opacity: 1; }
#hangout .hg-meter { position: absolute; left: 50%; bottom: 66px; width: min(420px, 70vw); height: 16px; transform: translateX(-50%); background: rgba(10,12,18,.88); border: 1px solid rgba(255,255,255,.2); border-radius: 9px; overflow: hidden; opacity: 0; transition: opacity .16s; }
#hangout .hg-meter.in { opacity: 1; }
#hangout .hg-meter i { position: absolute; top: 0; bottom: 0; background: rgba(63,176,106,.55); }
#hangout .hg-meter i.gold { background: rgba(245,180,0,.75); }
#hangout .hg-meter em { position: absolute; top: -2px; bottom: -2px; width: 4px; margin-left: -2px; background: #fff; border-radius: 2px; box-shadow: 0 0 6px rgba(255,255,255,.8); }
#hangout .hg-meter u { position: absolute; left: 0; top: 0; bottom: 0; background: linear-gradient(90deg, #3fb06a, #f5b400 70%, #e5484d); transform-origin: left; text-decoration: none; }
#hangout .hg-aim { position: absolute; left: 0; top: 0; width: 34px; height: 34px; margin: -17px; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 0 0 1px rgba(0,0,0,.6), inset 0 0 0 1px rgba(0,0,0,.4); opacity: 0; }
#hangout .hg-aim::after { content: ''; position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; margin: -2px; border-radius: 50%; background: #e5484d; }
#hangout .hg-aim.in { opacity: 1; }
#hangout .hg-big { position: absolute; left: 50%; top: 40%; transform: translate(-50%, -50%) scale(.92); text-align: center; white-space: nowrap; opacity: 0; transition: opacity .16s, transform .16s; }
#hangout .hg-big.in { opacity: 1; transform: translate(-50%, -50%); }
#hangout .hg-big span { display: block; font: 900 clamp(26px, 4.2vw, 54px)/1 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; text-shadow: 0 3px 18px rgba(0,0,0,.85); }
#hangout .hg-big small { display: block; margin-top: 8px; font: 700 13px/1.3 'Segoe UI', Arial, sans-serif; letter-spacing: .2em; color: #d5d9e0; text-shadow: 0 1px 4px #000; text-transform: uppercase; }
#hangout .hg-big.good span { color: #41e07a; } #hangout .hg-big.bad span { color: #ff6a5a; } #hangout .hg-big.gold span { color: #ffd34d; }
#hangout .hg-bars::before, #hangout .hg-bars::after { content: ''; position: absolute; left: 0; right: 0; height: 11vh; background: #000; transition: transform .26s ease; }
#hangout .hg-bars::before { top: 0; transform: translateY(-100%); } #hangout .hg-bars::after { bottom: 0; transform: translateY(100%); }
#hangout .hg-bars.in::before, #hangout .hg-bars.in::after { transform: none; }
#hangout .hg-cap { position: absolute; left: 50%; bottom: 13vh; transform: translate(-50%, 8px); width: min(720px, calc(100vw - 40px)); text-align: center; font: 400 clamp(16px, 1.6vw, 21px)/1.45 Georgia, 'Times New Roman', serif; color: #eef0f4; text-shadow: 0 1px 6px #000; opacity: 0; transition: opacity .26s, transform .26s; }
#hangout .hg-cap.in { opacity: 1; transform: translate(-50%, 0); }
#hangout .hg-flash { position: absolute; inset: 0; background: #fff; opacity: 0; }
#hangout .hg-photo { position: absolute; right: 26px; bottom: 26px; width: min(250px, 30vw); background: #f6f4ef; padding: 9px 9px 30px; box-shadow: 0 14px 36px rgba(0,0,0,.55); transform: translateY(24px) rotate(3deg); opacity: 0; transition: opacity .22s, transform .22s; color: #2a2d33; }
#hangout .hg-photo.in { opacity: 1; transform: rotate(-2deg); }
#hangout .hg-photo img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: #222; }
#hangout .hg-photo p { position: absolute; left: 10px; right: 10px; bottom: 7px; margin: 0; font: italic 500 12.5px/1.2 Georgia, serif; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#hangout .hg-help { position: absolute; left: 22px; bottom: 22px; font: 600 12px/1.6 'Segoe UI', Arial, sans-serif; color: rgba(255,255,255,.8); background: rgba(0,0,0,.55); padding: 6px 10px; border-radius: 6px; transition: opacity .26s; max-width: calc(100vw - 44px); }
#hangout .hg-help kbd { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,.45); margin: 0 2px; font-size: 10.5px; padding: 0 5px; }
#hangout .hg-cover { position: absolute; inset: 0; z-index: 9; background: #000; opacity: 1; transition: opacity .26s ease; pointer-events: none; }
#hangout .hg-cover.off { opacity: 0; }
#hangout .hg-cover.fast { transition-duration: .2s; }
#hangout .hg-cover p { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); margin: 0; font: 700 12px/1.6 'Segoe UI', Arial, sans-serif; letter-spacing: .26em; color: #7d8592; text-transform: uppercase; text-align: center; white-space: nowrap; }
#hangout .hg-cover p small { display: block; letter-spacing: .08em; text-transform: none; font-weight: 500; font-size: 13px; color: #5c6370; }
@media (max-height: 560px) { #hangout .hg-talk .line { min-height: 36px; margin: 5px 0 2px; } #hangout .hg-talk .opts button { padding: 5px 9px; font-size: 13.5px; } #hangout .hg-sub { bottom: 70px; } }
@media (prefers-reduced-motion: reduce) { #hangout, #hangout * , #hangout *::before, #hangout *::after, #hangout-curtain { transition-duration: 1ms !important; transition-delay: 0ms !important; animation-duration: 1ms !important; } }
`;

// ---- small helpers -------------------------------------------------------------------------------------------------
const pick = (a) => a[(Math.random() * a.length) | 0];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ss = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const firstOf = (s) => String(s || '').trim().split(' ')[0];
const lastOf = (s) => String(s || '').trim().split(' ').pop();
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
/** a seeded random (mulberry32): the same venue looks the same every evening -> () => 0..1 */
const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
/** a person's turn (rotation.y) to face along (dx, dz): People face +x */
const facing = (dx, dz) => Math.atan2(-dz, dx);
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
/** a normal-ish random (sum of three) in -1..1 */
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
// (a player who has asked the system for less motion: no head bob, no shake, softer flashes)
const REDUCED = (() => { try { return !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches; } catch (_) { return false; } })();
/** a test switch on window (window.__hangoutBuzz, __hangoutPaps, __hangoutFast) -> its value or null */
const flag = (k) => { try { return window[k] ?? null; } catch (_) { return null; } };
/** hours as a clock ('21:05') */
const hhmm = (h) => { const m = Math.floor(((h % 24) + 24) % 24 * 60); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
/** seconds as a lap time ('1:31.482' / '31.482') */
const lapTxt = (s) => { if (!(s > 0) || !isFinite(s)) return '-'; const m = Math.floor(s / 60), r = s - m * 60; return m ? `${m}:${r.toFixed(3).padStart(6, '0')}` : r.toFixed(3); };
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone' };

// ---- the places ------------------------------------------------------------------------------------------------------
// (the venues of career/Social.js: name, what it is, how private (0..1: how likely a long lens is), the bug's colour, the
// hour the evening starts; coffee is the grave week's quiet café)
const PLACES = {
  rooftop: { name: 'Skyline Terrace', kind: 'Rooftop lounge', city: 'Las Vegas', privacy: 0.2, hc: '#7b5cff', start: 21.25, build: rooftop },
  pub: { name: 'The Woodcote Arms', kind: 'Village pub', city: 'near Silverstone', privacy: 0.5, hc: '#b0793a', start: 19.5, build: pub },
  simlounge: { name: 'Slipstream', kind: 'Sim-racing lounge', city: '', privacy: 0.6, hc: '#00b8c8', start: 20.0, build: simlounge },
  apartment: { name: 'Your flat', kind: 'At home', city: '', privacy: 0.95, hc: '#e0861a', start: 19.5, build: apartment },
  restaurant: { name: 'The Lantern Room', kind: 'Private dining room', city: '', privacy: 0.8, hc: '#b23a48', start: 20.0, build: restaurant },
  karting: { name: 'Redline Karting', kind: 'Indoor karting hall', city: '', privacy: 0.4, hc: '#e10600', start: 19.0, build: karting },
  coffee: { name: 'The Corner Café', kind: 'A quiet coffee', city: '', privacy: 0.85, hc: '#8a6a4a', start: 17.0, build: coffee },
};
const ALIAS = { cafe: 'coffee', 'sim-lounge': 'simlounge', sim: 'simlounge', flat: 'apartment', home: 'apartment', dinner: 'restaurant', kart: 'karting', rooftopbar: 'rooftop' };
// (what each place calls for, the people's clothes (career/Celebs.js celebLook): the roof an evening out, the
// restaurant dinner, the pub, the sim lounge and the café easy, the karting hall sporty, your flat at home)
const OCCASION = { rooftop: 'evening', restaurant: 'dinner', pub: 'casual', simlounge: 'casual', coffee: 'casual', karting: 'sporty', apartment: 'home' };
// (and the roof some nights is a club night - late, the DJ playing, the lounge turned purple (its 'Late night'): what a
// club or an after-party calls for, career/Celebs.js wear.club - by the evening's own seed, never on a quiet one)
const NIGHTLIFE = new Set(['rooftop']);
/**
 * A man's clothes out at a club (kit: People's CLUB_KITS_M; h: his own number): dark, each his own way - an open silk
 * shirt with a chain, a fine knitted polo, a T-shirt under a blazer or a leather jacket, a bomber, a blazer over an open
 * shirt - slim dark trousers or black jeans, loafers, Chelsea boots or white trainers, a watch -> makePerson's options
 */
function clubOf(kit, h) {
  const k = (L, s = 0) => L[(h >>> s) % L.length];
  const color = { silkshirt: ['#111114', '#5a1422', '#1b2440', '#f2f0ea', '#2e3a2c', '#3a2a4a'], knitpolo: ['#111114', '#1b2440', '#2a2420', '#e8e4dc', '#3a3f48'], teeblazer: ['#111114', '#1e2a44', '#2a2c33'], leather: ['#111114', '#2a2420', '#3a2418'], bomber: ['#111114', '#2e3a2c', '#1b2440'], pantsuit: ['#111114', '#1a1d24', '#2a2420'] }[kit] || ['#111114'];
  const accent = { silkshirt: null, knitpolo: null, teeblazer: ['#f1f0ec', '#111114'], leather: ['#f1f0ec', '#111114', '#8a8f99'], bomber: ['#111114', '#f1f0ec'], pantsuit: ['#f1f0ec', '#111114'] }[kit];
  const c = k(color, 3), legs = kit === 'pantsuit' ? c : k(['#111114', '#1c1f26', '#1a1a1e', '#2a2c33'], 6), shoe = kit === 'teeblazer' || kit === 'bomber' ? k(['trainer', 'trainer', 'boot'], 9) : kit === 'leather' ? 'boot' : k(['shoe', 'shoe', 'boot'], 9);
  return { kit, color: c, accent: accent ? k(accent, 12) : c, legs, shoe, shoes: shoe === 'trainer' ? '#ecebe6' : '#141416', acc: ['watch'], jewel: kit === 'silkshirt' || (h >>> 15) % 3 === 0 ? { chain: true } : undefined };
}
/** a venue id from an id or a { id } -> a PLACES key */
const venueKey = (v) => { const id = String((v && typeof v === 'object' ? v.id : v) || '').toLowerCase(); return PLACES[id] ? id : ALIAS[id] || (/coffee|cafe/.test(id) ? 'coffee' : 'simlounge'); };
// (the evening's length, s: the 'getting late' cue, then it winds down)
const LATE = 360, CLOSE = 570;
// (the evening clock: game seconds a real second)
const RATE = 15;
// (hosted in the game's world, per place: which way it looks out - its glass, its windows: the frame's -z (view -1) or
// +z (1), turned to the anchor's yaw -, how much of the world's own light gets in (all of it, nearly, on an open roof; a
// little through a pub's windows), the room's own light against it, the Sphere's glow, the camera's near plane, and for
// the roof how far off the Sphere its yaw may point before it is turned to face it)
const HOSTED = {
  rooftop: { view: -1, world: 0.6, room: 0.62, sphere: 0.7, near: 0.14, face: 1.2 },
  apartment: { view: -1, world: 0.3, room: 1, sphere: 0, near: 0.09 },
  restaurant: { view: -1, world: 0.22, room: 1, sphere: 0, near: 0.07 },
  coffee: { view: -1, world: 0.2, room: 1, sphere: 0, near: 0.07 },
  pub: { view: 1, world: 0.16, room: 1, sphere: 0, near: 0.07 },
  simlounge: { view: 1, world: 0.12, room: 1, sphere: 0, near: 0.07 },
  karting: { view: 1, world: 0.1, room: 1, sphere: 0, near: 0.08 },
};
/**
 * Hosted: the ground each place covers round its anchor, in metres, walls and its own tower included - front (toward
 * its view: the look), back, side (either way), and r, the half-size of a square on the anchor that holds all of it
 * (for the caller's clear-footprint test: the karting hall is far bigger than a pub)
 */
export const HANGOUT_FOOTPRINT = {
  rooftop: { front: 5.9, back: 6.95, side: 7.3, r: 7.3 },
  apartment: { front: 6.75, back: 9, side: 11, r: 11 },
  restaurant: { front: 4.2, back: 4.2, side: 4.7, r: 4.7 },
  coffee: { front: 3.7, back: 3.7, side: 4.7, r: 4.7 },
  pub: { front: 4.7, back: 4.7, side: 6.2, r: 6.2 },
  simlounge: { front: 5.2, back: 5.2, side: 6.7, r: 6.7 },
  karting: { front: 11.7, back: 16.4, side: 22.7, r: 22.7 },
};

// ---- how talk lands (the grid walk's tones; ui/HangoutTalk.js keeps the master copies) -------------------------------
const TONE = HT.HANGOUT_TONE || { kind: 2, firm: 1, light: 1, cold: -1, cruel: -5, sorry: 3, gossip: 0, leave: -1, flirt: 1, show: 0 };
const TAG = HT.HANGOUT_TAG || { kind: 'KIND', firm: 'FIRM', light: 'LIGHT', cold: 'COLD', cruel: 'CRUEL', sorry: 'APOLOGISE', gossip: 'GOSSIP', leave: '', flirt: 'FLIRT', show: 'SHOW OFF' };
// party hook: the after-party's own effects (network, loose, provoke, dance, together, kiss) - tagged unless the talk's own tags say otherwise
const FX_TAG = { network: 'NETWORK', loose: 'LOOSE', provoke: 'PROVOKE', dance: 'DANCE', together: 'LEAVE TOGETHER', kiss: '', ...(HT.HANGOUT_FX_TAG || { cover: 'COVER STORY', confess: 'OWN UP', deep: 'OPEN UP', invite: 'INVITE', flirt: '', charm: '' }) };
const FX = ['flirt', 'charm', 'deep', 'cover', 'confess', 'invite', 'network', 'loose', 'provoke', 'dance', 'together', 'kiss'];
const BYE = HT.HANGOUT_BYE || { good: ['Good chat.'], ok: ['Back in a bit.'], bad: ['Right.'], warm: ["Don't go far."], cold: ['I need a minute.'], quiet: ['Thanks for this. Really.'] };

// ---- what people say around the room (short lines, not conversations; real drivers: only the evening and the job) ----
const BARK = {
  hello: { driver: ['There he is. Took your time.', 'Alright? Good shout, this place.', 'Finally. I was about to order without you.', 'Look at you, out in the wild.'],
    celeb: ['Hi. You found it, then.', 'There you are. I was starting to think you were lost.', "Hey. I've been looking forward to this.", "You look nice. Don't let it go to your head."],
    quiet: ['Hey. Thanks for coming.', "Hi. I'm glad you're here.", 'Hello. Come and sit down.'] },
  order: ['Good shout.', 'Perfect. Thank you.', 'Ooh. Yes please.', "You know me too well.", 'Lovely.'],
  cheers: ['Cheers.', 'To a good evening.', 'To the next one.', 'Cheers - to nights off.'],
  won: ['Fine. You win this one.', "Lucky. I'm calling it lucky.", 'Rematch. Immediately.', 'Okay, okay. Well played.'],
  lost: ['Ha! Get in.', "Don't take it personally.", "That's going on the group chat.", 'Unlucky. Not really, but unlucky.'],
  even: ['A draw. Nobody tells anyone.', "Level. We'll call that fair."],
  flash: ['Was that a camera?', 'Did you see that flash?', 'Oh, brilliant. Someone outside.', 'Was someone taking pictures?'],
  late: ["It's getting late, isn't it?", "I should think about heading off soon.", "Where did the evening go?"],
  music: ['Oh, I like this.', 'Better.', 'Good choice.', 'Ha. Your taste in music.'],
  photo: ['Send me that one.', "Let me see - no, take another.", 'Ha. Nice.', "That's a good one."],
  view: ["Look at that.", "It's not bad, this, is it?", 'Worth the trip just for that.'],
  group: ['Did you see the onboard from last week?', "Don't start.", "That's not what happened and you know it.", 'Ha. Go on, tell him.', 'Who booked this? Good shout.', 'My trainer would kill me for that.', 'Same again next week?', "You're still on about that?"],
};

// ---- what you can order, by venue ----------------------------------------------------------------------------------
const ORDERS = {
  rooftop: ['Two passion-fruit mocktails', 'Iced coffees, extra shot', 'Sparkling water with lime', 'A sharing plate of tacos'],
  pub: ['Two lemonades, lots of ice', 'A pot of tea for the table', 'Fish and chips to share', 'Hot chocolates'],
  simlounge: ['Two cans of cola', 'Iced tea', 'Sparkling water', 'A pizza for the rigs'],
  apartment: ['Fresh orange juice from the fridge', 'Two coffees from the machine', 'Sparkling water', 'The good olives'],
  restaurant: ['Still water for the table', "The chef's risotto", 'The sea bass, and the greens', 'One dessert, two spoons'],
  karting: ['Two slushies', 'Hot dogs', 'Coffee from the machine', 'Bottled water'],
  coffee: ['Two flat whites', 'A pot of tea', 'Hot chocolate', 'Two slices of the lemon cake'],
};
// party hook: the after-party's venues join every table - the place, its aliases, what it calls for, how it is hosted,
// the ground it covers, the bar's list (PartyPlay serves from PARTY_ORDERS; this is the evening's own fallback menu).
// The 7 evening venues above stay as they were: soft drinks, everyone in season.
for (const [id, P] of Object.entries(PARTY_PLACES)) { PLACES[id] = P; OCCASION[id] = partyOccasion(id); HOSTED[id] = PARTY_HOSTED[id]; HANGOUT_FOOTPRINT[id] = PARTY_FOOTPRINT[id]; ORDERS[id] = (PARTY_ORDERS[id] || []).slice(0, 5).map((d) => d.label); }
Object.assign(ALIAS, PARTY_ALIAS);
// pool hook: the pool club as an evening's venue like the others (ui/PartyPool.js builds it and runs its own crowd when
// it is not a party; what it calls for is the 'pool' wardrobe once the stars have one, else the club's)
for (const [id, P] of Object.entries(POOL_PLACES)) { PLACES[id] = P; OCCASION[id] = poolOccasion(); HOSTED[id] = POOL_HOSTED[id]; HANGOUT_FOOTPRINT[id] = POOL_FOOTPRINT[id]; ORDERS[id] = (POOL_ORDERS[id] || []).slice(0, 5).map((d) => d.label); }
Object.assign(ALIAS, POOL_ALIAS);

// ---- how good each guest is at each game (0..1): drivers are quick at anything with a steering wheel ----------------
const CSKILL = {
  'zoe-hartley': { sim: 0.93, karting: 0.86, arcade: 0.92, darts: 0.4 }, 'lena-marsh': { karting: 0.74, pool: 0.45, darts: 0.5, arcade: 0.62 },
  'clara-voss': { pool: 0.62, darts: 0.66, karting: 0.72, sim: 0.55 }, 'maya-lindqvist': { cooking: 1, darts: 0.45 }, 'tessa-kealoha': { karting: 0.68, pool: 0.5 },
  'jade-okafor': { arcade: 0.78, darts: 0.6, pool: 0.55 }, 'ava-rennick': { pool: 0.58, karting: 0.62 }, 'elena-marchetti': { darts: 0.55 },
};
/** a guest's skill at a game (0..1): the game's own number for the drivers (hashed from the name, a little each way), her own for a celebrity */
const skillOf = (g, game) => {
  if (!g) return 0.5;
  const h = (hash(String(g.id || g.name) + game) % 1000) / 1000;
  if (g.kind === 'driver') return clamp(({ karting: 0.9, sim: 0.88, arcade: 0.7, pool: 0.62, darts: 0.55, cooking: 0.45 }[game] ?? 0.6) + (h - 0.5) * 0.14, 0.3, 0.98);
  return clamp(CSKILL[g.id]?.[game] ?? (0.42 + (h - 0.5) * 0.2), 0.2, 0.98);
};

// =====================================================================================================================
// textures, painted on canvases (seeded, so a venue looks the same every time)
// =====================================================================================================================
/** a canvas painted by draw(ctx, w, h) -> CanvasTexture (sRGB; rep: [u, v] repeats; nearest: crisp pixels) */
function ctex(w, h, draw, rep = null, nearest = false) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const x = cv.getContext('2d'); draw(x, w, h);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  if (nearest) { t.magFilter = THREE.NearestFilter; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; }
  t.userData.cv = cv; t.userData.x = x; return t;
}
/** specks and blotches of colour over a canvas (grain, wear, the variation in stone) */
function speck(x, w, h, R, n, cols, s = 2) { for (let i = 0; i < n; i++) { x.fillStyle = cols[(R() * cols.length) | 0]; const r = 0.5 + R() * s; x.globalAlpha = 0.05 + R() * 0.12; x.fillRect(R() * w, R() * h, r, r * (0.5 + R())); } x.globalAlpha = 1; }
/** floorboards (or a deck): rows of planks in a few tones, butt joints staggered, grain lines along them */
function planks(x, w, h, R, cols, rows, o = {}) {
  const ph = h / rows;
  for (let r = 0; r < rows; r++) {
    let px = -R() * w * 0.5;
    while (px < w) {
      const L = w * (0.35 + R() * 0.45), c = cols[(R() * cols.length) | 0]; x.fillStyle = c; x.fillRect(px, r * ph, L, ph);
      x.globalAlpha = 0.18; for (let k = 0; k < 7; k++) { x.strokeStyle = R() < 0.5 ? '#000' : '#fff'; x.lineWidth = 0.6 + R(); x.beginPath(); const y = r * ph + R() * ph; x.moveTo(px, y); x.bezierCurveTo(px + L * 0.3, y + (R() - 0.5) * 4, px + L * 0.7, y + (R() - 0.5) * 4, px + L, y + (R() - 0.5) * 3); x.stroke(); }
      x.globalAlpha = 1; x.fillStyle = o.gap || 'rgba(0,0,0,.55)'; x.fillRect(px, r * ph, 1.5, ph); px += L;
    }
    x.fillStyle = o.gap || 'rgba(0,0,0,.55)'; x.fillRect(0, r * ph, w, o.seam || 1.5);
  }
  speck(x, w, h, R, 1400, ['#000', '#fff'], 1.6);
}
/** tiles or flagstones: a grid (irregular when loose) with grout, each stone its own shade */
function tiles(x, w, h, R, cols, nx, ny, grout, loose = 0) {
  x.fillStyle = grout; x.fillRect(0, 0, w, h);
  const cw = w / nx, ch = h / ny;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const jx = (R() - 0.5) * loose * cw, jy = (R() - 0.5) * loose * ch; x.fillStyle = cols[(R() * cols.length) | 0]; x.fillRect(i * cw + 2 + jx * 0.3, j * ch + 2 + jy * 0.3, cw - 4 - Math.abs(jx) * 0.3, ch - 4 - Math.abs(jy) * 0.3); }
  speck(x, w, h, R, 1800, ['#000', '#fff', '#777'], 2.4);
}
/** a building's face at night: a grid of windows, most lit (warm or cool), some dark, a few blinds half down */
function facade(x, w, h, R, warm = 0.6, lit = 0.62) {
  x.fillStyle = '#0c0e14'; x.fillRect(0, 0, w, h);
  const cw = w / 8, ch = h / 12;
  for (let j = 0; j < 12; j++) for (let i = 0; i < 8; i++) {
    const on = R() < lit, a = on ? 0.55 + R() * 0.45 : 0.05 + R() * 0.06;
    x.fillStyle = on ? (R() < warm ? `rgba(255,${190 + (R() * 50) | 0},${120 + (R() * 60) | 0},${a})` : `rgba(${170 + (R() * 50) | 0},${205 + (R() * 40) | 0},255,${a})`) : `rgba(120,140,170,${a})`;
    x.fillRect(i * cw + cw * 0.14, j * ch + ch * 0.18, cw * 0.72, ch * 0.62);
    if (on && R() < 0.2) { x.fillStyle = 'rgba(10,12,18,.7)'; x.fillRect(i * cw + cw * 0.14, j * ch + ch * 0.18, cw * 0.72, ch * 0.62 * R()); }
  }
}
/** a vertical gradient (stops: [[0..1, colour], ...]) */
function vgrad(x, w, h, stops) { const g = x.createLinearGradient(0, 0, 0, h); for (const [p, c] of stops) g.addColorStop(p, c); x.fillStyle = g; x.fillRect(0, 0, w, h); }
/** a soft round glow, white in the middle to nothing at the edge (for glow decals, halos, steam) */
function softTex() {
  return ctex(128, 128, (x, w) => { const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,.55)'); g.addColorStop(0.6, 'rgba(255,255,255,.14)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, w); });
}
/** a night (or dusk) sky over a lit city: deep blue overhead, the city's glow at the horizon, a few stars */
function skyTex(R, dusk = false) {
  return ctex(64, 512, (x, w, h) => {
    vgrad(x, w, h, dusk ? [[0, '#1b2350'], [0.34, '#47386e'], [0.47, '#c0607a'], [0.5, '#f0a46a'], [0.52, '#3a2a3a'], [1, '#0a0a10']] : [[0, '#05060f'], [0.32, '#0e1230'], [0.45, '#2a2348'], [0.495, '#6a3d5a'], [0.505, '#2a1c28'], [1, '#07070b']]);
    if (!dusk) for (let i = 0; i < 70; i++) { x.fillStyle = `rgba(255,255,255,${0.2 + R() * 0.5})`; x.fillRect(R() * w, R() * h * 0.38, 1, 1); }
  });
}
/** a street grid seen from high up at night: dark blocks, orange street lights, one bright boulevard (bright: its light) */
function streetTex(R, bright = 1) {
  return ctex(1024, 1024, (x, w, h) => {
    x.fillStyle = '#07080c'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) { const p = (i + R() * 0.5) * (w / 26); x.fillStyle = `rgba(255,170,80,${0.25 + R() * 0.3})`; x.fillRect(p, 0, 1.5, h); x.fillRect(0, p, w, 1.5); }
    for (let i = 0; i < 2600; i++) { x.fillStyle = R() < 0.7 ? `rgba(255,${160 + (R() * 80) | 0},90,${R() * 0.8})` : `rgba(200,220,255,${R() * 0.7})`; x.fillRect(R() * w, R() * h, 1.6, 1.6); }
    // (the boulevard: a river of headlights one way, tail lights the other, the hotels' glow either side)
    const by = h * 0.38; x.fillStyle = `rgba(255,190,120,${0.22 * bright})`; x.fillRect(0, by - 26, w, 52);
    for (let i = 0; i < 900; i++) { x.fillStyle = R() < 0.5 ? `rgba(255,250,235,${0.6 * bright})` : `rgba(255,60,50,${0.7 * bright})`; x.fillRect(R() * w, by - 8 + (R() < 0.5 ? 0 : 10) + R() * 3, 2 + R() * 3, 1.5); }
  });
}
/** a framed picture: draw(x, w, h) inside a mount */
function framed(draw, w = 256, h = 192, mount = '#efe9dc') { return ctex(w, h, (x) => { x.fillStyle = mount; x.fillRect(0, 0, w, h); x.save(); x.beginPath(); x.rect(18, 18, w - 36, h - 36); x.clip(); x.translate(18, 18); draw(x, w - 36, h - 36); x.restore(); x.strokeStyle = 'rgba(0,0,0,.25)'; x.strokeRect(18, 18, w - 36, h - 36); }); }
/** words on a canvas in a font, centred (glow: a neon halo) */
function words(x, s, cx, cy, font, col, glow = 0) { x.font = font; x.textAlign = 'center'; x.textBaseline = 'middle'; if (glow) { x.shadowColor = col; x.shadowBlur = glow; } x.fillStyle = col; x.fillText(s, cx, cy); x.shadowBlur = 0; }

// =====================================================================================================================
// building a place: static geometry merged into one mesh per material, the solid bits, the spots, the things to use
// =====================================================================================================================
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s1 = new THREE.Vector3(1, 1, 1);
/** a geometry made mergeable: non-indexed, with exactly position, normal and uv */
const norm = (g) => {
  const n = g.index ? g.toNonIndexed() : g; if (n !== g) g.dispose();
  for (const k of Object.keys(n.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') n.deleteAttribute(k);
  if (!n.attributes.normal) n.computeVertexNormals();
  if (!n.attributes.uv) n.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2));
  n.morphAttributes = {}; return n;
};
/** a geometry's uvs scaled (a texture's repeats in metres) -> g */
const uvs = (g, su, sv) => { const a = g.attributes.uv; if (a) { for (let i = 0; i < a.count; i++) a.setXY(i, a.getX(i) * su, a.getY(i) * sv); } return g; };
/** a geometry's vertices in a material's colour (rgba: see-through glass, its opacity per vertex; an additive glow has its opacity folded into the colour) */
const tint = (g, m, rgba) => {
  const n = g.attributes.position.count, k = rgba ? 4 : 3, a = new Float32Array(n * k), c = m.color, f = m.blending === THREE.AdditiveBlending ? m.opacity : 1;
  for (let i = 0; i < n; i++) { a[i * k] = c.r * f; a[i * k + 1] = c.g * f; a[i * k + 2] = c.b * f; if (rgba) a[i * k + 3] = m.opacity; }
  g.setAttribute('color', new THREE.BufferAttribute(a, k));
};

// ---- hosted: the room's light, without a light in the world ---------------------------------------------------------
// (one more light in the game's scene would have three.js rebuild every shader of the world - on the way in and again on
// the way out, seconds of stall on an integrated GPU - and would light the whole city besides. So a hosted place keeps
// the light it was built with, its hemisphere and its key light, inside its own materials: their light loop gets the
// room's two lights as code, the world's own light (sky, moon or sun, the city's reflections) is scaled by how much of it
// gets in, the floodlights' spot lights are compiled out (the cars' highlights: a pool of track lighting has no business
// on a pub's ceiling, and each of the eight costs every pixel), and on the roof the Sphere's glow - the same baked field
// the city is lit by - falls across the deck)
const ROOM = { hgSky: { value: new THREE.Color() }, hgGround: { value: new THREE.Color() }, hgKey: { value: new THREE.Color() }, hgKeyDir: { value: new THREE.Vector3(0, 1, 0) }, hgWorld: { value: 1 }, hgSph: { value: 0 } };
const ROOM_PARS = 'uniform vec3 hgSky, hgGround, hgKey, hgKeyDir; uniform float hgWorld, hgSph; uniform sampler2D sphA, sphB; uniform vec2 sphMin, sphInv; uniform vec3 sphColor; uniform float floodY0, floodDY; varying vec3 vHgW;';
const ROOM_VERT = `
vec4 hgP = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
hgP = batchingMatrix * hgP;
#endif
#ifdef USE_INSTANCING
hgP = instanceMatrix * hgP;
#endif
vHgW = ( modelMatrix * hgP ).xyz;
`;
const ROOM_FRAG = `
reflectedLight.directDiffuse *= hgWorld; reflectedLight.directSpecular *= hgWorld; reflectedLight.indirectDiffuse *= hgWorld; reflectedLight.indirectSpecular *= hgWorld;
{
  IncidentLight hl; hl.visible = true; hl.color = hgKey; hl.direction = normalize( ( viewMatrix * vec4( hgKeyDir, 0.0 ) ).xyz );
  RE_Direct( hl, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
  float hw = 0.5 * dot( geometryNormal, normalize( ( viewMatrix * vec4( 0.0, 1.0, 0.0, 0.0 ) ).xyz ) ) + 0.5;
  RE_IndirectDiffuse( mix( hgGround, hgSky, hw ), geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
  vec2 suv = ( vHgW.xz - sphMin ) * sphInv;
  if ( hgSph > 0.0 && sphColor != vec3( 0.0 ) && suv.x > 0.0 && suv.y > 0.0 && suv.x < 1.0 && suv.y < 1.0 ) {
    float fk = clamp( ( vHgW.y - floodY0 ) / floodDY, 0.0, 1.0 );
    vec3 sv = ( viewMatrix * vec4( mix( texture2D( sphA, suv ).xyz, texture2D( sphB, suv ).xyz, fk ), 0.0 ) ).xyz; float sm = length( sv );
    if ( sm > 1e-4 ) { hl.direction = sv / sm; hl.color = sphColor * ( sm * hgSph ); RE_Direct( hl, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight ); }
  }
}
`;
let roomBegin = null;
/** the room's light into a lit material's shader (see ROOM; one function for all, so they share their programs) */
function roomPatch(sh) {
  Object.assign(sh.uniforms, ROOM, { sphA: FLOOD.sphA, sphB: FLOOD.sphB, sphMin: FLOOD.sphMin, sphInv: FLOOD.sphInv, sphColor: FLOOD.sphColor, floodY0: FLOOD.floodY0, floodDY: FLOOD.floodDY });
  if (!roomBegin) roomBegin = THREE.ShaderChunk.lights_fragment_begin.replace('#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )', '#if 0');
  sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vHgW;').replace('#include <project_vertex>', '#include <project_vertex>' + ROOM_VERT);
  sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + ROOM_PARS).replace('#include <lights_fragment_begin>', roomBegin).replace('#include <lights_fragment_end>', '#include <lights_fragment_end>' + ROOM_FRAG);
}
const ROOMLIT = new WeakSet();
/** a lit material of a hosted place lit by its room (one that already has a shader hook of its own is left alone) */
function roomLit(m) {
  if (!m?.isMeshStandardMaterial || ROOMLIT.has(m) || m.onBeforeCompile !== THREE.Material.prototype.onBeforeCompile) return;
  ROOMLIT.add(m); m.onBeforeCompile = roomPatch; m.userData.timeSkip = true; m.needsUpdate = true;
}

class Kit {
  constructor(ev) {
    this.ev = ev; this.S = ev.scene; this.bk = new Map(); this.mc = new Map(); this.tex = []; this.glows = [];
    this.areas = []; this.solids = []; this.discs = []; this.hots = []; this.anims = []; this.dyn = [];
    this.ox = 0; this.oz = 0; this.ry = 0; this.soft = this.t(softTex());
  }
  /** a texture kept for disposal -> t */
  t(t) { this.tex.push(t); return t; }
  /** a lit material (cached by its look) */
  m(col, r = 0.7, mt = 0, o = {}) {
    const k = `s|${col}|${r}|${mt}|${o.map?.uuid || ''}|${o.transparent ? o.opacity : ''}|${o.side || ''}|${o.emissive || ''}|${o.ei || ''}`;
    let M = this.mc.get(k); if (M) return M;
    // (no environment map to reflect, so metal is kept half-metal: brass and steel would otherwise go black)
    const { ei, ...rest } = o; M = new THREE.MeshStandardMaterial({ color: col, roughness: Math.max(r, mt > 0.5 ? 0.32 : 0), metalness: Math.min(mt, 0.5), ...rest }); if (ei) M.emissiveIntensity = ei;
    this.mc.set(k, M); return M;
  }
  /** a lit material over a texture */
  mt(map, r = 0.7, mt = 0, o = {}) { return this.m('#ffffff', r, mt, { map, ...o }); }
  /** glass: faintly tinted, see-through, no depth write */
  glass(col = '#a8d8ea', op = 0.15, o = {}) { return this.m(col, 0.05, 0.2, { transparent: true, opacity: op, depthWrite: false, ...o }); }
  /** a glowing (unlit) material; the room's mood scales it unless fixed -> MeshBasicMaterial */
  e(col, o = {}) {
    const k = `e|${col}|${o.map?.uuid || ''}|${o.opacity ?? ''}|${o.fixed ? 1 : 0}|${o.blending || ''}|${o.side || ''}`;
    let M = this.mc.get(k); if (M) return M;
    const { fixed, ...rest } = o; M = new THREE.MeshBasicMaterial({ color: col, toneMapped: false, ...rest });
    if (o.opacity != null && o.opacity < 1) M.transparent = true;
    if (!fixed) this.glows.push({ m: M, base: M.color.clone() });
    this.mc.set(k, M); return M;
  }
  /** a soft additive glow (decals: pools of light on floors and walls) */
  g(col, a = 0.4) { return this.e(col, { map: this.soft, transparent: true, opacity: a, blending: THREE.AdditiveBlending, depthWrite: false }); }
  /** a point in the current frame -> world Vector3 */
  P(x, y, z) { const c = Math.cos(this.ry), s = Math.sin(this.ry); return V3(this.ox + x * c + z * s, y, this.oz - x * s + z * c); }
  /** draw in a local frame (origin x, z; turned ry about y): fn(K) */
  at(x, z, ry, fn) { const s = [this.ox, this.oz, this.ry], p = this.P(x, 0, z); this.ox = p.x; this.oz = p.z; this.ry = s[2] + ry; try { fn(this); } finally { [this.ox, this.oz, this.ry] = s; } }
  /** a geometry into its material's merge: turned (ry, then rx, rz) about its own centre, moved to x, y, z in the frame */
  add(mat, g, x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0) {
    if (rx || ry || rz) { _e.set(rx, ry, rz, 'YXZ'); g.applyMatrix4(_m4.makeRotationFromEuler(_e)); }
    g.translate(x, y, z); if (this.ry) g.rotateY(this.ry); g.translate(this.ox, 0, this.oz);
    let L = this.bk.get(mat); if (!L) this.bk.set(mat, (L = [])); L.push(g); return g;
  }
  /** a box (x, z its middle, y its foot) */
  box(mat, x, y, z, w, h, d, ry = 0, uv = null) { const g = new THREE.BoxGeometry(w, h, d); if (uv) uvs(g, uv[0], uv[1]); return this.add(mat, g, x, y + h / 2, z, ry); }
  /** a cylinder standing on y */
  cyl(mat, x, y, z, r0, r1, h, seg = 16, o = {}) { const g = new THREE.CylinderGeometry(r0, r1, h, seg, 1, !!o.open); return this.add(mat, g, x, y + h / 2, z, o.ry || 0, o.rx || 0, o.rz || 0); }
  /** a cylinder lying along x (ry turns it) */
  bar(mat, x, y, z, r, len, ry = 0, seg = 10) { const g = new THREE.CylinderGeometry(r, r, len, seg); g.rotateZ(Math.PI / 2); return this.add(mat, g, x, y, z, ry); }
  sph(mat, x, y, z, r, ws = 16, hs = 12, sx = 1, sy = 1, sz = 1) { const g = new THREE.SphereGeometry(r, ws, hs); g.scale(sx, sy, sz); return this.add(mat, g, x, y, z); }
  /** a flat panel: w x h, facing +z before turning (ry), or laid flat (flat: facing up) */
  plane(mat, x, y, z, w, h, ry = 0, flat = false, uv = null) { const g = new THREE.PlaneGeometry(w, h); if (uv) uvs(g, uv[0], uv[1]); if (flat) g.rotateX(-Math.PI / 2); return this.add(mat, g, x, y, z, ry); }
  /** a floor from x0, z0 to x1, z1 at height y, its texture tm metres a repeat */
  floor(mat, x0, z0, x1, z1, tm = 2, y = 0) { this.plane(mat, (x0 + x1) / 2, y, (z0 + z1) / 2, x1 - x0, z1 - z0, 0, true, [(x1 - x0) / tm, (z1 - z0) / tm]); }
  /** a lathe (profile [[r, y], ...]) standing at x, y, z */
  lathe(mat, x, y, z, prof, seg = 20) { return this.add(mat, new THREE.LatheGeometry(prof.map(([r, h]) => new THREE.Vector2(r, h)), seg), x, y, z); }
  /** a tube along points [[x, y, z], ...] (in the frame) */
  tube(mat, pts, r, seg = 24, rs = 6) { return this.add(mat, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => V3(p[0], p[1], p[2]))), seg, r, rs, false)); }
  /** a pool of light on the floor (r: radius) */
  pool(col, x, z, r, a = 0.35, y = 0.012) { this.plane(this.g(col, a), x, y, z, r * 2, r * 2, 0, true); }
  /** a wash of light on a wall (facing ry, w x h) */
  wash(col, x, y, z, w, h, ry, a = 0.3) { this.plane(this.g(col, a), x, y, z, w, h, ry); }
  /** somewhere you can walk (a rectangle) */
  area(x0, z0, x1, z1) { const a = this.P(x0, 0, z0), b = this.P(x1, 0, z1); this.areas.push({ x0: Math.min(a.x, b.x), z0: Math.min(a.z, b.z), x1: Math.max(a.x, b.x), z1: Math.max(a.z, b.z) }); }
  /** something you cannot walk through (a rectangle in the frame) */
  solid(x0, z0, x1, z1) { const P = [this.P(x0, 0, z0), this.P(x1, 0, z0), this.P(x0, 0, z1), this.P(x1, 0, z1)]; this.solids.push({ x0: Math.min(...P.map((p) => p.x)), z0: Math.min(...P.map((p) => p.z)), x1: Math.max(...P.map((p) => p.x)), z1: Math.max(...P.map((p) => p.z)) }); }
  disc(x, z, r) { const p = this.P(x, 0, z); this.discs.push({ x: p.x, z: p.z, r }); }
  /** a thing to use with E: { id, kind, x, y, z, reach, label(ev), sub(ev), use(ev), cond(ev) } (x, y, z in the frame) */
  hot(o) { const h = { reach: 2, ...o, p: this.P(o.x, o.y ?? 1.2, o.z) }; this.hots.push(h); return h; }
  /** a spot a guest can be put: x, z, face (their turn, in the frame), pose 'sit' | 'stand', y (a seat's lift) */
  spot(x, z, face, pose = 'stand', y = 0, o = {}) { const p = this.P(x, 0, z); return { x: p.x, z: p.z, face: face + this.ry, pose, y, ...o }; }
  /** a dynamic object (not merged), in the scene */
  obj(o) { this.S.add(o); this.dyn.push(o); return o; }
  /** something to run every frame: fn(t, dt) */
  anim(fn) { this.anims.push(fn); }
  /**
   * Every merge into its mesh. Looks that differ only in their colour (no texture of their own, or just the soft glow)
   * share one mesh, the colour carried in its vertices: a bar's twenty bottles are one draw call, not eight, and a whole
   * venue comes to a few dozen.
   */
  bake() {
    const gl = new Set(this.glows.map((G) => G.m)), groups = new Map();
    for (const [mat, gs] of this.bk) {
      if (!gs.length) continue;
      const k = this._look(mat, gl) ?? mat.uuid; let e = groups.get(k);
      if (!e) groups.set(k, (e = { mat, parts: [] })); e.parts.push([mat, gs]);
    }
    for (const { mat, parts } of groups.values()) {
      const vc = parts.length > 1, rgba = vc && mat.transparent && mat.blending !== THREE.AdditiveBlending, all = [];
      for (const [m, gs] of parts) for (const g of gs) { const n = norm(g); if (vc) tint(n, m, rgba); all.push(n); }
      const g = mergeGeometries(all); for (const x of all) x.dispose();
      if (!g) { console.warn('Hangout: a merge failed'); continue; }
      const M = vc ? this._shared(mat, gl) : mat, m = new THREE.Mesh(g, M); m.matrixAutoUpdate = false; m.updateMatrix();
      if (M.transparent) m.renderOrder = M.blending === THREE.AdditiveBlending ? 3 : 2;
      this.S.add(m);
    }
    this.bk.clear();
  }
  /** what a material looks like apart from its colour -> a key to merge by, or null (a texture of its own: alone) */
  _look(m, gl) {
    if (m.alphaMap || m.emissiveMap || m.vertexColors || (m.map && m.map !== this.soft)) return null;
    const t = m.transparent ? `t${m.blending}|${m.depthWrite ? 1 : 0}|${m.map ? 'soft' : ''}` : '';
    if (m.isMeshStandardMaterial && !m.map) return `s|${m.roughness}|${m.metalness}|${m.emissive.getHex()}|${m.emissiveIntensity}|${m.side}|${t}`;
    if (m.isMeshBasicMaterial) return `b|${gl.has(m) ? 'glow' : 'fixed'}|${m.side}|${t}|${m.toneMapped}|${m.fog}`;
    return null;
  }
  /** the material a merged look shares: the first one's, white, the colour (and the opacity) in the vertices; it glows with the room's mood if they did */
  _shared(mat, gl) {
    const M = mat.clone(); M.vertexColors = true; M.color.set(0xffffff); if (M.transparent) M.opacity = 1;
    if (gl.has(mat)) this.glows.push({ m: M, base: M.color.clone() });
    return M;
  }
}

/**
 * The shell of a room from x0, z0 to x1, z1, h high: floor, ceiling, four walls (t thick, their inner faces on the
 * bounds) with openings per side - open: { n, s, w, e: [[a0, a1, y0, y1], ...] } along the wall (x for n/s, z for e/w).
 * M: { floor, ceil, wall | { n, s, w, e } }, tm: { floor, wall } texture metres.
 */
function shell(K, x0, z0, x1, z1, h, M, open = {}, tm = {}, t = 0.2) {
  if (M.floor) K.floor(M.floor, x0, z0, x1, z1, tm.floor || 2);
  // (the ceiling: a panel facing down)
  if (M.ceil) { const g = uvs(new THREE.PlaneGeometry(x1 - x0, z1 - z0), (x1 - x0) / (tm.ceil || 2), (z1 - z0) / (tm.ceil || 2)); g.rotateX(Math.PI / 2); K.add(M.ceil, g, (x0 + x1) / 2, h, (z0 + z1) / 2); }
  const W = (s) => (M.wall && M.wall[s]) || M.wall;
  wallRun(K, W('n'), 'x', z0 - t / 2, x0 - t, x1 + t, h, t, open.n, tm.wall);
  wallRun(K, W('s'), 'x', z1 + t / 2, x0 - t, x1 + t, h, t, open.s, tm.wall);
  wallRun(K, W('w'), 'z', x0 - t / 2, z0, z1, h, t, open.w, tm.wall);
  wallRun(K, W('e'), 'z', x1 + t / 2, z0, z1, h, t, open.e, tm.wall);
  K.area(x0, z0, x1, z1);
}
/** a wall along x (or z) at c, from a0 to a1, h high, with holes [[b0, b1, y0, y1], ...] (wall below y0 and above y1) */
function wallRun(K, mat, axis, c, a0, a1, h, t, holes = [], tm = 2) {
  if (!mat) return;
  const H = [...(holes || [])].sort((p, q) => p[0] - q[0]); let a = a0;
  const seg = (s0, s1, y0, y1) => { if (s1 - s0 < 0.005 || y1 - y0 < 0.005) return; const L = s1 - s0, uv = [L / (tm || 2), (y1 - y0) / (tm || 2)]; if (axis === 'x') K.box(mat, (s0 + s1) / 2, y0, c, L, y1 - y0, t, 0, uv); else K.box(mat, c, y0, (s0 + s1) / 2, L, y1 - y0, t, Math.PI / 2, uv); };
  for (const [b0, b1, y0, y1] of H) { seg(a, b0, 0, h); seg(b0, b1, 0, y0); seg(b0, b1, y1, h); a = b1; }
  seg(a, a1, 0, h);
}
/** a window in an opening: a frame, glazing bars (cols x rows), the glass, and the view outside (a plane d metres out); n: the inward direction as a turn */
function windowIn(K, M, x, z, w, y0, y1, ry, o = {}) {
  K.at(x, z, ry, () => {
    const fw = 0.06, h = y1 - y0, cols = o.cols || 2, rows = o.rows || 2;
    K.box(M.frame, 0, y0 - 0.04, 0, w + 0.12, 0.06, 0.24); K.box(M.frame, 0, y1, 0, w + 0.12, fw, 0.16);
    K.box(M.frame, -w / 2 - 0.03, y0, 0, fw, h, 0.16); K.box(M.frame, w / 2 + 0.03, y0, 0, fw, h, 0.16);
    for (let i = 1; i < cols; i++) K.box(M.bar || M.frame, -w / 2 + (w * i) / cols, y0, 0, o.thin || 0.03, h, 0.05);
    for (let j = 1; j < rows; j++) K.box(M.bar || M.frame, 0, y0 + (h * j) / rows - 0.015, 0, w, o.thin || 0.03, 0.05);
    if (M.glass) K.plane(M.glass, 0, y0 + h / 2, -0.02, w, h);
    if (M.rain) K.plane(M.rain, 0, y0 + h / 2, -0.035, w, h);
    if (M.view) K.plane(M.view, o.vx || 0, y0 + h / 2 + (o.vy || 0), -(o.d || 0.9), w * (o.vw || 1.9), h * (o.vh || 1.9));
    if (o.sill) K.box(M.sill || M.frame, 0, y0 - 0.06, 0.12, w + 0.3, 0.05, 0.28);
  });
}
/**
 * Hosted: the building a raised place stands in - boxes [x0, y0, z0, x1, y1, z1] in its frame, down to the street - as
 * one mesh in the city's own window look (the world's facade shader, its lit windows on the same 3.5 m storeys), so from
 * the street it is one more tower in the skyline, not a room floating in the night.
 */
function buildingMass(K, E, boxes) {
  const gs = boxes.filter((b) => b[4] - b[1] > 0.05 && b[3] - b[0] > 0.05 && b[5] - b[2] > 0.05).map(([x0, y0, z0, x1, y1, z1]) => { const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); return norm(g); });
  if (!gs.length) return null;
  const g = mergeGeometries(gs); for (const x of gs) x.dispose(); if (!g) return null;
  // (the facade shader tints each building by its vertex colour; this one a shade under white, like most of the city)
  g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 3).fill(0.96), 3));
  const win = E.hx?.win || null, m = K.obj(new THREE.Mesh(g, win || new THREE.MeshStandardMaterial({ color: '#23272f', roughness: 0.85 })));
  m.matrixAutoUpdate = false; m.updateMatrix(); m.userData.hgKeep = !!win;
  return m;
}

// ---- furniture (each in its own frame: someone sitting on it faces the frame's +x) --------------------------------
/** a dining chair, its seat sh high at the frame's origin, the back behind (-x) */
function chair(K, M, x, z, face, sh = 0.46, back = 0.5) {
  K.at(x, z, face, () => {
    K.box(M.wood, -0.03, sh - 0.05, 0, 0.44, 0.05, 0.44); if (M.seat) K.box(M.seat, -0.03, sh, 0, 0.41, 0.045, 0.41);
    for (const [a, b] of [[-0.22, -0.19], [-0.22, 0.19], [0.16, -0.19], [0.16, 0.19]]) K.box(M.wood, a, 0, b, 0.035, sh - 0.05, 0.035);
    for (const b of [-0.19, 0.19]) K.box(M.wood, -0.235, sh, b, 0.035, back, 0.035);
    K.box(M.back || M.seat || M.wood, -0.24, sh + 0.14, 0, 0.035, back - 0.17, 0.36); K.box(M.wood, -0.235, sh + back - 0.04, 0, 0.04, 0.05, 0.42);
  });
  K.disc(x, z, 0.24);
}
/** a stool with a foot ring, seat h high */
function stool(K, M, x, z, h = 0.74) {
  K.cyl(M.metal, x, 0, z, 0.2, 0.22, 0.02, 18); K.cyl(M.metal, x, 0.02, z, 0.028, 0.028, h - 0.07, 8);
  K.add(M.metal, new THREE.TorusGeometry(0.17, 0.011, 6, 22), x, h * 0.36, z, 0, Math.PI / 2); K.cyl(M.seat, x, h - 0.06, z, 0.19, 0.2, 0.07, 20);
  K.disc(x, z, 0.22);
}
/** a round table r across, h high, on a pedestal */
function roundTable(K, M, x, z, r, h = 0.74) { K.cyl(M.leg || M.top, x, 0, z, 0.22, 0.25, 0.03, 20); K.cyl(M.leg || M.top, x, 0.03, z, 0.04, 0.05, h - 0.06, 10); K.cyl(M.top, x, h - 0.035, z, r, r, 0.035, 36); K.disc(x, z, r + 0.04); }
/** a rectangular table w (along the frame's x) by d, h high, on four legs */
function rectTable(K, M, x, z, w, d, h = 0.74) {
  K.box(M.top, x, h - 0.045, z, w, 0.045, d); K.box(M.leg || M.top, x, h - 0.12, z, w - 0.12, 0.075, d - 0.12);
  for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) K.box(M.leg || M.top, x + a * (w / 2 - 0.07), 0, z + b * (d / 2 - 0.07), 0.055, h - 0.12, 0.055);
  K.solid(x - w / 2, z - d / 2, x + w / 2, z + d / 2);
}
/** a sofa, len long (the frame's z), its seat facing +x */
function sofa(K, M, x, z, len, face, sh = 0.44) {
  K.at(x, z, face, () => {
    K.box(M.frame, 0, 0.06, 0, 0.92, sh - 0.16, len); K.box(M.frame, -0.36, 0.06, 0, 0.2, 0.8, len);
    for (const s of [-1, 1]) K.box(M.frame, 0.02, 0.06, s * (len / 2 - 0.09), 0.88, 0.56, 0.18);
    const n = Math.max(2, Math.round((len - 0.36) / 0.75)), cw = (len - 0.36) / n;
    for (let i = 0; i < n; i++) { const zz = -len / 2 + 0.18 + (i + 0.5) * cw; K.box(M.cushion, 0.08, sh - 0.1, zz, 0.66, 0.14, cw - 0.025); K.box(M.cushion, -0.2, sh + 0.02, zz, 0.16, 0.44, cw - 0.05); }
    for (const s of [-1, 1]) K.box(M.foot || M.frame, 0.36, 0, s * (len / 2 - 0.1), 0.05, 0.06, 0.05), K.box(M.foot || M.frame, -0.36, 0, s * (len / 2 - 0.1), 0.05, 0.06, 0.05);
  });
  K.at(x, z, face, () => K.solid(-0.46, -len / 2, 0.46, len / 2));
}
/** a potted plant (s: its size): a pot and a crown of leaves */
function plant(K, M, x, z, s, R) {
  K.lathe(M.pot, x, 0, z, [[0, 0], [0.17 * s, 0], [0.22 * s, 0.38 * s], [0.2 * s, 0.4 * s], [0, 0.4 * s]], 16);
  K.cyl(M.soil, x, 0.36 * s, z, 0.19 * s, 0.19 * s, 0.02, 12); K.cyl(M.stem || M.leaf, x, 0.36 * s, z, 0.015 * s, 0.025 * s, 0.6 * s, 6);
  for (let i = 0; i < 9; i++) { const a = R() * 6.28, r = (0.05 + R() * 0.22) * s, g = new THREE.IcosahedronGeometry((0.12 + R() * 0.12) * s, 0); g.scale(1, 0.7, 1); K.add(i % 3 ? M.leaf : M.leaf2 || M.leaf, g, x + Math.cos(a) * r, (0.8 + R() * 0.55) * s, z + Math.sin(a) * r, R() * 3, R() * 0.6); }
  K.disc(x, z, 0.26 * s);
}
/** a tree in a planter box (s: its size) */
function tree(K, M, x, z, s, R) {
  K.box(M.pot, x, 0, z, 1.0 * s, 0.7 * s, 1.0 * s); K.box(M.soil, x, 0.7 * s, z, 0.92 * s, 0.02, 0.92 * s);
  K.cyl(M.bark, x, 0.7 * s, z, 0.045 * s, 0.08 * s, 1.35 * s, 7, { rz: 0.06 });
  for (let i = 0; i < 9; i++) { const a = R() * 6.28, r = R() * 0.5 * s, g = new THREE.IcosahedronGeometry(0.36 * s * (0.7 + R() * 0.5), 1); g.scale(1, 0.72, 1); K.add(i % 2 ? M.leaf : M.leaf2, g, x + Math.cos(a) * r, (1.95 + R() * 0.65) * s, z + Math.sin(a) * r, R() * 3); }
  K.solid(x - 0.52 * s, z - 0.52 * s, x + 0.52 * s, z + 0.52 * s);
}
/** a pendant light hanging from y0 to y (a cord and a glowing shade; a pool of its light below at yb) */
function pendant(K, M, x, z, y0, y, r, col, yb = 0, a = 0.3) {
  K.cyl(M.cord, x, y + r * 0.6, z, 0.004, 0.004, y0 - y - r * 0.6, 4);
  if (M.shade) K.lathe(M.shade, x, y - r * 0.2, z, [[0.02, r * 1.05], [r * 0.4, r * 0.95], [r, 0], [r * 0.96, -0.01], [0.001, r * 0.9]], 18);
  K.sph(K.e(col), x, y, z, r * (M.shade ? 0.55 : 1), 14, 10);
  if (yb != null) K.pool(col, x, z, 0.9 + r * 4, a, yb + 0.004);
}
/** bottles and jars along a shelf (cols: their colours) */
function bottles(K, x0, x1, y, z, R, cols, n = 14) {
  for (let i = 0; i < n; i++) {
    const x = x0 + (i + 0.5 + (R() - 0.5) * 0.3) * ((x1 - x0) / n), m = K.m(cols[(R() * cols.length) | 0], 0.18, 0.05), h = 0.16 + R() * 0.12, r = 0.028 + R() * 0.018;
    if (R() < 0.75) { K.cyl(m, x, y, z, r, r, h, 10); K.cyl(m, x, y + h, z, r * 0.4, r * 0.85, 0.05, 8); K.cyl(m, x, y + h + 0.05, z, r * 0.35, r * 0.35, 0.04, 6); }
    else { K.cyl(m, x, y, z, r * 1.5, r * 1.5, h * 0.75, 12); K.cyl(K.m('#2a2a2d', 0.4, 0.5), x, y + h * 0.75, z, r * 1.55, r * 1.55, 0.025, 12); }
  }
}

// ---- views through windows, signs, pictures -------------------------------------------------------------------------
/** a village street at dusk in the rain: cottages with lit windows, street lamps, their light on the wet road */
function villageDusk(x, w, h, R) {
  vgrad(x, w, h, [[0, '#1f2a40'], [0.42, '#3f4c66'], [0.6, '#646a7e'], [0.62, '#262a33'], [1, '#121419']]);
  for (let i = 0; i < 8; i++) {
    const cx = i * 140 + R() * 50 - 30, bw = 100 + R() * 70, bh = 90 + R() * 60, by = h * 0.62;
    x.fillStyle = R() < 0.5 ? '#1c1f26' : '#22252c'; x.fillRect(cx, by - bh, bw, bh);
    x.beginPath(); x.moveTo(cx - 10, by - bh); x.lineTo(cx + bw / 2, by - bh - 44 - R() * 24); x.lineTo(cx + bw + 10, by - bh); x.fill();
    x.fillStyle = '#15171c'; x.fillRect(cx + bw * 0.7, by - bh - 60, 14, 40);
    for (let k = 0; k < 3; k++) if (R() < 0.75) { x.fillStyle = `rgba(255,${185 + (R() * 45) | 0},115,${0.55 + R() * 0.45})`; x.fillRect(cx + 12 + k * 30, by - bh + 24 + (R() < 0.5 ? 0 : 36), 18, 22); }
  }
  for (let i = 0; i < 4; i++) {
    const lx = 110 + i * 255 + R() * 30; x.fillStyle = '#0c0e12'; x.fillRect(lx, h * 0.3, 4, h * 0.32);
    const g = x.createRadialGradient(lx + 2, h * 0.3, 0, lx + 2, h * 0.3, 80); g.addColorStop(0, 'rgba(255,205,130,.95)'); g.addColorStop(1, 'rgba(255,170,90,0)'); x.fillStyle = g; x.fillRect(lx - 80, h * 0.3 - 80, 160, 160);
    const r = x.createLinearGradient(0, h * 0.63, 0, h); r.addColorStop(0, 'rgba(255,190,110,.5)'); r.addColorStop(1, 'rgba(255,190,110,0)'); x.fillStyle = r; x.fillRect(lx - 8, h * 0.63, 20, h * 0.37);
  }
  speck(x, w, h, R, 500, ['#9fb4d0', '#d8e4f4'], 1.5);
}
/** rain on a pane: streaks and beads, on clear (for an overlay that scrolls down) */
function rainStreaks(x, w, h, R) {
  x.clearRect(0, 0, w, h);
  for (let i = 0; i < 170; i++) { const sx = R() * w, sy = R() * h, L = 8 + R() * 34; x.strokeStyle = `rgba(220,235,255,${0.14 + R() * 0.34})`; x.lineWidth = 0.7 + R() * 1.2; x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + (R() - 0.5) * 3, sy + L); x.stroke(); }
  for (let i = 0; i < 110; i++) { x.fillStyle = `rgba(230,240,255,${0.22 + R() * 0.4})`; x.beginPath(); x.arc(R() * w, R() * h, 0.8 + R() * 2.2, 0, 7); x.fill(); }
}
/** a city at night through a window: towers with lit windows over a glow, a few red lights on top (dusk: an orange sky) */
function cityNight(x, w, h, R, dusk = false) {
  vgrad(x, w, h, dusk ? [[0, '#2a2f5a'], [0.45, '#7a4f78'], [0.68, '#e48a5a'], [0.7, '#2a2230'], [1, '#0d0d14']] : [[0, '#060816'], [0.5, '#141a3a'], [0.68, '#3a2c4c'], [0.7, '#161420'], [1, '#08080c']]);
  if (!dusk) for (let i = 0; i < 80; i++) { x.fillStyle = `rgba(255,255,255,${0.2 + R() * 0.5})`; x.fillRect(R() * w, R() * h * 0.45, 1, 1); }
  for (let layer = 0; layer < 3; layer++) {
    const base = h * (0.72 + layer * 0.06), sc = 1 - layer * 0.25;
    for (let i = 0; i < 26; i++) {
      const bw = (30 + R() * 70) * sc, bh = (60 + R() * 260) * (layer ? 0.7 : 1), bx = R() * w; x.fillStyle = layer ? '#0b0d14' : '#10131c'; x.fillRect(bx, base - bh, bw, bh + h);
      for (let yy = base - bh + 6; yy < base - 4; yy += 9 * sc) for (let xx = bx + 4; xx < bx + bw - 4; xx += 8 * sc) if (R() < 0.42) { x.fillStyle = R() < 0.65 ? `rgba(255,${200 + (R() * 40) | 0},140,${0.5 + R() * 0.5})` : `rgba(180,215,255,${0.5 + R() * 0.4})`; x.fillRect(xx, yy, 3.4 * sc, 4.2 * sc); }
      if (bh > 200 && R() < 0.6) { x.fillStyle = '#ff3a2a'; x.fillRect(bx + bw / 2 - 2, base - bh - 4, 4, 4); }
    }
  }
  const g = x.createLinearGradient(0, h * 0.82, 0, h); g.addColorStop(0, 'rgba(255,170,90,.0)'); g.addColorStop(1, 'rgba(255,170,90,.35)'); x.fillStyle = g; x.fillRect(0, h * 0.82, w, h * 0.18);
}
/** an old racing print: a cigar-shaped single-seater on a sweep of track under a big sky, the corner's name below */
function racingPrint(x, w, h, R, name, hue) {
  vgrad(x, w, h, [[0, `hsl(${hue},45%,72%)`], [0.62, `hsl(${hue + 20},40%,86%)`], [0.63, '#6f8a52'], [1, '#4c6338']]);
  x.fillStyle = '#5a5a5e'; x.beginPath(); x.moveTo(0, h * 0.8); x.quadraticCurveTo(w * 0.5, h * 0.55, w, h * 0.68); x.lineTo(w, h * 0.8); x.quadraticCurveTo(w * 0.5, h * 0.7, 0, h * 0.95); x.fill();
  const cx = w * (0.35 + R() * 0.25), cy = h * 0.68, col = ['#b0251f', '#1f4fa8', '#2a6e3a', '#d8b02a', '#e8e4dc'][(R() * 5) | 0];
  x.fillStyle = col; x.beginPath(); x.ellipse(cx, cy, w * 0.2, h * 0.055, -0.08, 0, 7); x.fill();
  x.fillStyle = '#1a1a1a'; for (const dx of [-0.12, 0.12]) { x.beginPath(); x.arc(cx + dx * w, cy + h * 0.05, h * 0.055, 0, 7); x.fill(); }
  x.fillStyle = '#f2efe6'; x.beginPath(); x.arc(cx - w * 0.02, cy - h * 0.005, h * 0.03, 0, 7); x.fill(); x.fillStyle = '#1a1a1a'; x.font = `bold ${h * 0.04}px Georgia`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(2 + ((R() * 30) | 0)), cx - w * 0.02, cy);
  x.fillStyle = '#2a2a2a'; x.beginPath(); x.arc(cx + w * 0.04, cy - h * 0.05, h * 0.025, 0, 7); x.fill();
  words(x, name, w / 2, h * 0.12, `italic 700 ${h * 0.1}px Georgia`, 'rgba(30,30,34,.85)');
  speck(x, w, h, R, 700, ['#000', '#fff'], 1.4);
}
/** a chalkboard: a dark board, chalky words line by line */
function chalk(x, w, h, R, lines, title) {
  x.fillStyle = '#20251f'; x.fillRect(0, 0, w, h); speck(x, w, h, R, 1600, ['#3a4038', '#2c3229', '#ffffff'], 2);
  if (title) words(x, title, w / 2, h * 0.13, `700 ${h * 0.1}px 'Segoe Print', 'Comic Sans MS', cursive`, 'rgba(245,240,225,.92)');
  lines.forEach((s, i) => words(x, s, w / 2, h * (title ? 0.3 : 0.16) + i * h * 0.12, `${h * 0.068}px 'Segoe Print', 'Comic Sans MS', cursive`, i % 3 === 2 ? 'rgba(255,214,140,.9)' : 'rgba(240,238,228,.85)'));
}
/** a fire's texture: three tongues of flame, white at the root to red at the tips, on clear */
function flameTex() {
  return ctex(64, 128, (x, w, h) => {
    for (let i = 0; i < 3; i++) {
      const cx = w / 2 + (i - 1) * 9, top = h * (0.08 + i * 0.06), g = x.createRadialGradient(cx, h * 0.82, 2, cx, h * 0.62, h * 0.5);
      g.addColorStop(0, 'rgba(255,250,225,1)'); g.addColorStop(0.25, 'rgba(255,196,90,.92)'); g.addColorStop(0.6, 'rgba(255,96,24,.5)'); g.addColorStop(1, 'rgba(255,40,0,0)');
      x.fillStyle = g; x.beginPath(); x.moveTo(cx, top); x.quadraticCurveTo(cx + 17, h * 0.62, cx, h * 0.98); x.quadraticCurveTo(cx - 17, h * 0.62, cx, top); x.fill();
    }
  });
}
/** a flame (or a fire): a few crossed panels of fire that flicker -> { group } (animated by the kit) */
function flame(K, tex, x, y, z, w, h, n = 3, k = 1) {
  const g = new THREE.Group(), m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide, color: '#ffffff' });
  const geo = new THREE.PlaneGeometry(w, h); geo.translate(0, h / 2, 0);
  for (let i = 0; i < n; i++) { const p = new THREE.Mesh(geo, m); p.rotation.y = (i * Math.PI) / n; g.add(p); }
  const P = K.P(x, y, z); g.position.copy(P); K.obj(g); K.glows.push({ m, base: m.color.clone() });
  const ph = Math.random() * 10; K.anim((t) => { g.scale.set(1 + 0.08 * Math.sin(t * 7.3 + ph), 1 + k * (0.12 * Math.sin(t * 11 + ph) + 0.07 * Math.sin(t * 23.7 + ph * 2)), 1); m.opacity = 0.82 + 0.18 * Math.sin(t * 17 + ph); });
  return g;
}
/** an emissive screen with its own canvas (w x h px) at x, y, z facing ry -> { mesh, tex, x (ctx), w, h, draw(fn) } */
function screen(K, cw, ch, x, y, z, w, h, ry, o = {}) {
  const tex = K.t(ctex(cw, ch, (c) => { c.fillStyle = '#000'; c.fillRect(0, 0, cw, ch); }, null, !!o.nearest)), mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat), P = K.P(x, y, z); mesh.position.copy(P); mesh.rotation.y = K.ry + ry; K.obj(mesh);
  const S = { mesh, tex, x: tex.userData.x, w: cw, h: ch, draw(fn) { fn(S.x, cw, ch); tex.needsUpdate = true; } };
  return S;
}
/** a racing sim's screen: the road ahead (a sweep of asphalt, kerbs and grass) and a timer - for a screen nobody is using */
function simIdle(x, w, h, t, label, seed) {
  vgrad(x, w, h, [[0, '#4a78b8'], [0.45, '#a9c8e8'], [0.46, '#3c6a34'], [1, '#2f5528']]);
  const hz = h * 0.46, bend = Math.sin(t * 0.4 + seed) * w * 0.18;
  for (let y = hz; y < h; y += 2) { const k = (y - hz) / (h - hz), rw = w * (0.04 + k * 0.62), cx = w / 2 + bend * (1 - k) * (1 - k), st = Math.floor((1 / (k + 0.02)) * 2 + t * 18) % 2; x.fillStyle = st ? '#c8102e' : '#f2f2f2'; x.fillRect(cx - rw / 2 - rw * 0.07, y, rw * 1.14, 2); x.fillStyle = st ? '#5d5f63' : '#56585c'; x.fillRect(cx - rw / 2, y, rw, 2); }
  x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(0, 0, w, h * 0.14); words(x, label, w * 0.3, h * 0.07, `700 ${h * 0.065}px 'Segoe UI', Arial`, '#fff');
  words(x, lapTxt(80 + ((t * 1) % 12) + seed), w * 0.82, h * 0.07, `700 ${h * 0.07}px Consolas, monospace`, '#ffd34d');
}

// =====================================================================================================================
// the venues. Each builds into the kit and returns what the evening needs: the light, the moods, where you start, the
// spots for the guests (date: one of them; group: a cluster), the seats you can take, where a long lens might be, the
// sound of the room, staff, and whatever its games use. x runs east, z south; the walls' inner faces are the bounds.
// Hosted (E.host), the painted views are left out - the real world is outside the glass - and E.hx says what the world
// has: its facade material (win), the Sphere in the place's frame (sphere), whether it is raining (wet); E.ay is the
// height the place stands at.
// =====================================================================================================================
/** a rooftop lounge over the Strip at night: a timber deck behind a glass balustrade, the city to the north, the Sphere */
function rooftop(K, E) {
  const R = rng(101), hosted = !!E.host, sphere = E.hx?.sphere || null;
  const deckT = K.t(ctex(512, 512, (x, w, h) => planks(x, w, h, R, ['#5e4330', '#6a4b35', '#553b2a', '#71523b'], 10, { gap: 'rgba(10,6,4,.85)', seam: 2.5 }), [1, 1]));
  const deck = K.mt(deckT, 0.82), stone = K.m('#3a3c42', 0.6), marble = K.m('#e6e2da', 0.22), steel = K.m('#aab0b8', 0.28, 0.85), black = K.m('#141518', 0.55, 0.15);
  const wood = K.m('#4a3326', 0.55), slatM = K.m('#5c4030', 0.5), core = K.m('#25272d', 0.85), glass = K.glass('#9fd3e6', 0.12), fabric = K.m('#cfc6b6', 0.92), cush = K.m('#2c3f55', 0.9);
  const coping = K.m('#d9d4c8', 0.45), pot = K.m('#2a2b2f', 0.7), soil = K.m('#2b2118', 1), leaf = K.m('#3d6a3a', 0.9), leaf2 = K.m('#557e45', 0.9), bark = K.m('#5b4838', 0.95);
  const FM = { metal: steel, seat: K.m('#2b2d33', 0.6) };
  // ---- the deck (around the plunge pool), the balustrade, the lift core and the pergola over the bar
  K.floor(deck, -7, -5.6, 3.4, 6.5, 2.2); K.floor(deck, 3.4, -5.6, 7, -2.6, 2.2); K.floor(deck, 3.4, 1.4, 7, 6.5, 2.2); K.floor(deck, 6.6, -2.6, 7, 1.4, 2.2);
  // (the slab's edge below the deck, seen when you look over the glass; hosted, deep enough to close the gap down to the
  // roof of the tower under it, which stays below the plunge pool's floor)
  if (hosted) { K.box(stone, 0, -1.32, -5.75, 14.6, 1.32, 0.3); for (const s of [-1, 1]) K.box(stone, s * 7.15, -1.32, 0.5, 0.3, 1.32, 12.6); K.box(stone, 0, -1.32, 6.68, 14.6, 1.32, 0.34); }
  else { K.box(stone, 0, -0.6, -5.75, 14.6, 0.6, 0.3); K.box(stone, -7.15, -0.6, 0.35, 0.3, 0.6, 12.2); K.box(stone, 7.15, -0.6, 0.35, 0.3, 0.6, 12.2); }
  const rail = (ax, a0, a1, c) => {
    const L = a1 - a0, m = (a0 + a1) / 2;
    if (ax === 'x') { K.box(stone, m, 0, c, L, 0.22, 0.3); K.plane(glass, m, 0.73, c, L, 1.0); K.bar(steel, m, 1.25, c, 0.028, L); for (let p = a0; p <= a1 + 1e-6; p += 1.75) K.box(steel, p, 0.2, c, 0.045, 1.06, 0.045); }
    else { K.box(stone, c, 0, m, 0.3, 0.22, L); K.plane(glass, c, 0.73, m, L, 1.0, Math.PI / 2); K.bar(steel, c, 1.25, m, 0.028, L, Math.PI / 2); for (let p = a0; p <= a1 + 1e-6; p += 1.75) K.box(steel, c, 0.2, p, 0.045, 1.06, 0.045); }
  };
  rail('x', -7.1, 7.1, -5.75); rail('z', -5.75, 6.4, -7.15); rail('z', -5.75, 6.4, 7.15);
  K.box(core, 0, 0, 6.68, 14.6, 3.5, 0.34); K.box(K.m('#1c1d22', 0.7), 0, 3.5, 6.68, 14.6, 0.08, 0.5);
  K.box(steel, 5.2, 0, 6.5, 1.5, 2.3, 0.04); K.box(K.m('#2f3238', 0.4, 0.6), 5.2, 0, 6.48, 0.02, 2.3, 0.05); K.box(K.e('#9be7ff'), 5.2, 2.42, 6.5, 0.5, 0.08, 0.02);
  K.box(K.e('#d9c4ff'), -6.2, 2.42, 6.5, 0.36, 0.1, 0.02);
  for (let x = -6.4; x <= 6.41; x += 1.6) K.box(wood, x, 3.05, 4.95, 0.1, 0.18, 3.4);
  K.box(wood, 0, 3.05, 3.3, 13.2, 0.22, 0.14);
  for (const x of [-6.45, 6.45]) { K.box(wood, x, 0, 3.3, 0.14, 3.1, 0.14); K.solid(x - 0.1, 3.2, x + 0.1, 3.4); }
  // ---- the bar under it: a slatted front, a marble top lit from beneath, the lit shelves behind, the bartender
  K.box(wood, -1.2, 0, 5.22, 5.6, 1.0, 0.56);
  for (let i = 0; i < 28; i++) K.box(slatM, -3.9 + i * 0.2, 0.06, 4.92, 0.12, 0.88, 0.03);
  K.box(marble, -1.2, 1.0, 5.16, 5.9, 0.06, 0.8); K.box(K.e('#ffb070'), -1.2, 0.93, 4.775, 5.7, 0.025, 0.02); K.bar(steel, -1.2, 0.2, 4.72, 0.02, 5.5);
  for (let i = 0; i < 4; i++) K.pool('#ff9a50', -3.4 + i * 1.45, 4.55, 0.85, 0.22);
  K.box(black, -1.2, 0, 6.22, 5.6, 0.92, 0.48); K.box(marble, -1.2, 0.92, 6.22, 5.6, 0.04, 0.5);
  K.box(K.e('#ff9850'), -1.2, 1.2, 6.49, 5.4, 1.5, 0.02);
  for (const y of [1.48, 1.98]) K.box(K.glass('#ffffff', 0.25), -1.2, y, 6.35, 5.4, 0.02, 0.26);
  bottles(K, -3.8, 1.4, 1.5, 6.35, R, ['#d8862a', '#9fbf4a', '#c23a3a', '#e8d9a0', '#5a8fa8', '#f0c040'], 22); bottles(K, -3.8, 1.4, 2.0, 6.35, R, ['#e8d9a0', '#7fbfb0', '#d8862a', '#b04a6a'], 18);
  K.box(steel, 1.0, 0.96, 6.2, 0.62, 0.44, 0.44); K.box(black, 1.0, 1.06, 5.97, 0.5, 0.26, 0.02); for (const dx of [-0.12, 0.12]) K.cyl(steel, 1.0 + dx, 1.0, 5.94, 0.03, 0.035, 0.06, 10);
  for (const x of [-3.0, -1.2, 0.6]) pendant(K, { cord: black, shade: K.m('#c79a5a', 0.3, 0.7) }, x, 5.1, 3.05, 2.2, 0.13, '#ffcf8a', 1.06, 0.25);
  for (const x of [-3.4, -2.2, -1.0, 0.2]) stool(K, FM, x, 4.4, 0.76);
  K.solid(-4.1, 4.86, 1.75, 6.5);
  // ---- the lounge: two sofas either side of a fire table
  const SM = { frame: fabric, cushion: cush, foot: steel };
  sofa(K, SM, -5.2, -2.2, 2.4, 0); sofa(K, SM, -1.2, -2.2, 2.4, Math.PI);
  K.box(stone, -3.2, 0, -2.2, 0.8, 0.4, 1.6); K.box(K.m('#141414', 0.9), -3.2, 0.4, -2.2, 0.46, 0.02, 1.24);
  K.box(glass, -3.2, 0.42, -2.2, 0.5, 0.2, 1.3); K.solid(-3.65, -3.05, -2.75, -1.35);
  const fireT = K.t(flameTex()); for (const dz of [-0.36, 0, 0.36]) flame(K, fireT, -3.2, 0.42, -2.2 + dz, 0.26, 0.34, 2, 1.2);
  K.pool('#ff7a2a', -3.2, -2.2, 2.0, 0.34);
  // ---- a high table at the glass, two stools; the plunge pool, a lounger; the trees; the DJ's desk
  K.cyl(steel, 1.4, 0, -4.1, 0.25, 0.28, 0.03, 24); K.cyl(steel, 1.4, 0.03, -4.1, 0.035, 0.035, 0.97, 10); K.cyl(marble, 1.4, 1.0, -4.1, 0.4, 0.4, 0.04, 36); K.disc(1.4, -4.1, 0.45);
  stool(K, FM, 0.72, -4.1, 0.76); stool(K, FM, 2.08, -4.1, 0.76);
  K.box(coping, 5.0, -0.02, -2.75, 3.6, 0.07, 0.3); K.box(coping, 5.0, -0.02, 1.55, 3.6, 0.07, 0.3); K.box(coping, 3.25, -0.02, -0.6, 0.3, 0.07, 4.0); K.box(coping, 6.75, -0.02, -0.6, 0.3, 0.07, 4.0);
  K.box(K.e('#0d6a86'), 5.0, -1.25, -0.6, 3.2, 0.02, 4.0);
  K.box(K.e('#1386a6'), 5.0, -1.25, -2.6, 3.2, 1.2, 0.02); K.box(K.e('#1386a6'), 5.0, -1.25, 1.4, 3.2, 1.2, 0.02); K.box(K.e('#117c9a'), 3.4, -1.25, -0.6, 0.02, 1.2, 4.0); K.box(K.e('#117c9a'), 6.6, -1.25, -0.6, 0.02, 1.2, 4.0);
  for (const z of [-1.6, 0.4]) K.sph(K.e('#e8fbff'), 3.42, -0.45, z, 0.06, 10, 8, 0.3, 1, 1);
  const wT = K.t(ctex(256, 256, (x, w, h) => { x.fillStyle = '#7fe6f7'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 2; for (let i = 0; i < 40; i++) { x.beginPath(); const sx = R() * w, sy = R() * h; x.moveTo(sx, sy); x.bezierCurveTo(sx + 20, sy - 14, sx + 40, sy + 14, sx + 64, sy); x.stroke(); } }, [3, 4]));
  const water = K.obj(new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.0), new THREE.MeshBasicMaterial({ map: wT, color: '#5cb8cc', transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false })));
  water.rotation.x = -Math.PI / 2; water.position.set(5.0, -0.07, -0.6); K.glows.push({ m: water.material, base: water.material.color.clone() });
  K.anim((t) => { wT.offset.set(t * 0.02, t * 0.035); });
  K.pool('#3fd3f0', 5.0, -0.6, 3.2, 0.16); K.solid(3.1, -2.9, 6.9, 1.7);
  K.at(6.1, 3.2, Math.PI / 2, () => { K.box(steel, 0, 0, 0, 1.9, 0.3, 0.62); K.box(K.m('#e9e4d8', 0.95), 0.1, 0.3, 0, 1.5, 0.08, 0.6); K.box(K.m('#e9e4d8', 0.95), -0.78, 0.3, 0, 0.36, 0.45, 0.6); K.solid(-0.95, -0.32, 0.95, 0.32); });
  const TM = { pot, soil, leaf, leaf2, bark };
  tree(K, TM, -6.3, 5.75, 1, R); tree(K, TM, -6.35, -4.95, 0.9, R); tree(K, TM, 6.35, -4.95, 0.9, R);
  K.at(-6.15, 2.4, 0, () => {
    K.box(black, 0, 0, 0, 0.6, 0.95, 1.5); K.box(K.e('#7b5cff'), 0.305, 0.22, 0, 0.01, 0.05, 1.4);
    for (const z of [-0.42, 0.42]) { K.cyl(K.m('#1d1e22', 0.4, 0.3), 0.05, 0.95, z, 0.16, 0.16, 0.03, 24); K.add(K.e('#3ad7ff'), new THREE.TorusGeometry(0.16, 0.006, 6, 32), 0.05, 0.985, z, 0, Math.PI / 2); }
    K.box(K.m('#22252b', 0.4), 0.06, 0.95, 0, 0.3, 0.025, 0.24); K.box(K.e('#cfdcff'), -0.12, 0.96, 0, 0.02, 0.2, 0.3);
    for (const z of [-1.15, 1.15]) { K.cyl(steel, 0, 0, z, 0.02, 0.02, 1.2, 6); K.box(black, 0, 1.2, z, 0.34, 0.56, 0.32); K.cyl(K.m('#0a0a0b', 0.5), 0.18, 1.45, z, 0.1, 0.1, 0.02, 18, { rz: Math.PI / 2 }); }
    K.solid(-0.35, -1.35, 0.35, 1.35);
  });
  // ---- string lights on posts, criss-crossing the deck (one mesh of bulbs, one of wire, a haze of halos)
  const bulb = K.e('#ffd59a'), wire = K.m('#101012', 0.6), halo = [];
  for (const [x, z] of [[-6.9, -5.45], [6.9, -5.45], [-6.9, 0.6], [6.9, 0.6]]) K.cyl(steel, x, 0, z, 0.035, 0.04, 3.3, 8);
  const string = (a, b, sag) => {
    const n = Math.max(6, Math.round(Math.hypot(b[0] - a[0], b[2] - a[2]) / 0.55)), P = [];
    for (let i = 0; i <= n; i++) { const u = i / n; P.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - sag * 4 * u * (1 - u), a[2] + (b[2] - a[2]) * u]); }
    K.tube(wire, P, 0.006, n * 2, 4);
    for (let i = 1; i < n; i++) { const p = P[i]; K.cyl(wire, p[0], p[1] - 0.05, p[2], 0.008, 0.008, 0.05, 5); K.sph(bulb, p[0], p[1] - 0.075, p[2], 0.032, 8, 6, 1, 1.3, 1); halo.push(p[0], p[1] - 0.075, p[2]); }
  };
  string([-6.9, 3.25, -5.45], [6.9, 3.25, -5.45], 0.42); string([-6.9, 3.25, -5.45], [6.4, 3.12, 3.3], 0.7); string([6.9, 3.25, -5.45], [-6.4, 3.12, 3.3], 0.7); string([-6.9, 3.25, 0.6], [6.9, 3.25, 0.6], 0.55);
  const hg = new THREE.BufferGeometry(); hg.setAttribute('position', new THREE.Float32BufferAttribute(halo, 3));
  const hm = new THREE.PointsMaterial({ map: K.soft, color: '#ffb766', size: 0.55, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  K.obj(new THREE.Points(hg, hm)); K.glows.push({ m: hm, base: hm.color.clone() });
  for (let i = 0; i < 7; i++) K.pool('#ffc27a', -5 + i * 1.7, -2 + Math.sin(i * 1.7) * 2.2, 1.3, 0.1);
  // ---- the city. Hosted, the real Las Vegas is the view, and the deck is the roof of a slim tower that goes down to the
  // street; otherwise a painted one: the sky, the street grid far below, towers all round, two near neighbours, the Sphere
  if (hosted) buildingMass(K, E, [[-7.3, -E.ay, -5.9, 7.3, -1.32, 6.85]]);
  else {
    const sky = K.obj(new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 16), new THREE.MeshBasicMaterial({ map: K.t(skyTex(R)), side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false })));
    sky.renderOrder = -1;
    K.plane(K.e('#ffffff', { map: K.t(streetTex(R)), fixed: true }), 0, -110, -200, 3000, 3000, 0, true);
    const fm = [0.78, 0.35, 0.56].map((wm, i) => K.e('#a8a8a8', { map: K.t(ctex(256, 384, (x, w, h) => facade(x, w, h, rng(300 + i), wm, 0.42 + i * 0.07), [1, 1])), fixed: true }));
    const roof = K.m('#0b0c10', 0.9), red = K.e('#ff2a1a', { fixed: true }), crown = [K.e('#ffcf8a', { fixed: true }), K.e('#9fd8ff', { fixed: true }), K.e('#d9a8ff', { fixed: true })];
    const tower = (x, z, w, d, top, i) => {
      const H = top + 110, g = uvs(new THREE.BoxGeometry(w, H, d), Math.max(1, Math.round(w / 14)), Math.max(1, Math.round(H / 20))); K.add(fm[i % 3], g, x, -110 + H / 2, z);
      K.box(roof, x, top, z, w + 0.4, 0.5, d + 0.4); if (top > 40) { K.sph(red, x, top + 2, z, 0.9, 6, 4); K.box(crown[i % 3], x, top - 6, z, w + 0.6, 1.2, d + 0.6); }
    };
    // (the Strip's towers: most well below the deck, a few above it, none in the way of the Sphere)
    const aS = Math.atan2(-620, -280);
    for (let i = 0; i < 52; i++) {
      const back = i >= 40, a = back ? R() * Math.PI * 2 : -Math.PI / 2 + (R() - 0.5) * 2.7, d = (back ? 320 : 240) + R() * 640;
      if (!back && Math.abs(wrap(a - aS)) < 0.17 && d < 760) continue;
      const top = R() < 0.3 ? 10 + R() * 120 : -85 + R() * 75; tower(Math.cos(a) * d, Math.sin(a) * d, 26 + R() * 40, 26 + R() * 40, top, i);
    }
    tower(130, -120, 40, 50, 24, 0); tower(-62, -20, 34, 38, -8, 1);
    const sphT = K.t(ctex(512, 256, (x, w, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(0,0,0,.4)'; for (let j = 0; j < h; j += 4) for (let i = 0; i < w; i += 4) x.fillRect(i + 2, j + 2, 2, 2); }));
    const sphM = new THREE.MeshBasicMaterial({ map: sphT, color: '#3a7bff', fog: false, toneMapped: false });
    const sph = K.obj(new THREE.Mesh(new THREE.SphereGeometry(78, 48, 32), sphM)); sph.position.set(-280, -54, -620);
    const shalo = K.obj(new THREE.Sprite(new THREE.SpriteMaterial({ map: K.soft, color: '#3a7bff', transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false })));
    shalo.position.copy(sph.position); shalo.scale.setScalar(340);
    const SC = ['#2f6bff', '#b23cff', '#ff4f7a', '#ffb23a', '#2fe0c8', '#5a7bff'].map((c) => new THREE.Color(c)), tc = new THREE.Color();
    K.anim((t) => { const u = (t / 9) % SC.length, i = Math.floor(u), f = ss(0.55, 1, u - i); tc.copy(SC[i]).lerp(SC[(i + 1) % SC.length], f); sphM.color.copy(tc); shalo.material.color.copy(tc); sph.rotation.y = t * 0.015; });
    E.scene.fog = new THREE.Fog('#141026', 260, 1700);
  }
  K.area(-6.75, -5.45, 6.75, 6.3);
  // ---- what there is to do
  const look = hosted ? (sphere ? sphere.clone() : V3(0, -25, -400)) : V3(-280, -40, -620), showy = !hosted || !!sphere;
  K.hot({ id: 'bar', kind: 'order', x: -1.2, y: 1.15, z: 4.75, reach: 2.0, label: 'Order something', sub: 'Mocktails, coffee, juices' });
  K.hot({ id: 'dj', kind: 'juke', x: -5.75, y: 1.05, z: 2.4, reach: 2.1, label: 'Change the music' });
  K.hot({ id: 'view', kind: 'moment', x: 3.0, y: 1.3, z: -5.5, reach: 2.0, label: 'Take in the view', look });
  K.hot({ id: 'photo', kind: 'photo', x: -0.9, y: 1.3, z: -5.5, reach: 2.2, label: showy ? 'Take a photo, the Sphere behind you' : 'Take a photo, the city behind you' });
  K.hot({ id: 'pool', kind: 'flavour', x: 5.0, y: 0.1, z: -0.6, reach: 2.4, label: 'Dip a hand in the pool', text: 'Warm, of course. It is Las Vegas.' });
  K.hot({ id: 'fire', kind: 'flavour', x: -3.2, y: 0.5, z: -2.2, reach: 2.0, label: 'Warm your hands at the fire', text: 'The desert gets cold at night. The fire is very welcome.', taste: 'quiet' });
  return {
    light: { hemi: ['#6a72b0', '#2a1e2c', 0.7], dir: ['#ffd2a0', 0.8, [2, 6, 5]], exposure: 1.1, bg: '#0b0a16' }, lift: 0.1,
    moods: [{ name: 'Easy', music: 'atmos1', hemi: 1, glow: 1 }, { name: 'Late night', music: 'atmos2', hemi: 0.8, glow: 1.2 }, { name: 'Low and slow', music: 'atmos3', hemi: 0.68, glow: 0.78 }, { name: 'Quiet', music: null, hemi: 0.95, glow: 0.9 }],
    start: { x: 5.2, z: 5.0, yaw: Math.atan2(-1, -0.75) },
    date: [K.spot(2.08, -4.1, Math.PI, 'sit', 0.28, { seat: 0 }), K.spot(0.1, -4.75, facing(0.35, 1))],
    group: [K.spot(-3.2, -3.85, facing(0, 1)), K.spot(-1.95, -4.6, facing(-0.5, 1)), K.spot(-0.55, -3.75, facing(-1, 0.35))],
    seats: [{ x: 0.72, z: -4.1, yaw: 0, eye: 1.47 }],
    staff: { name: 'Rafi', role: 'Bartender', x: -1.2, z: 5.88, face: facing(0, -1), hot: 'bar', look: { kit: 'blazer', color: '#17181c', accent: '#e9e4da', legs: '#121316', pose: 'talk', seed: 'rooftop-bartender' } },
    // (hosted: a long lens on a lower roof across the way)
    paps: hosted ? [V3(38, -12, -64), V3(-58, -5, 22)] : [V3(109.5, 6, -110), V3(-46, -6, -14)], bed: 'city',
    moment: !hosted ? ['The Strip, a long way down, every hotel lit. Across the city the Sphere turns slowly from blue to gold.', 'Twenty floors of warm air below the glass, and the whole of Las Vegas glittering to the horizon.']
      : sphere ? ['The Strip, a long way down, every hotel lit. Across the way the Sphere runs through its shows, the circuit threading its lights between the towers.', 'Twenty floors of night air below the glass, the Sphere filling the view, and the whole of Las Vegas glittering to the horizon.']
        : ['The Strip, a long way down, every hotel lit, and the whole of Las Vegas glittering to the horizon.'],
    photoBack: showy ? 'the Sphere' : 'the city lights',
  };
}

/** a village pub near Silverstone at dusk: oak boards and flagstones, beams, booths, a fire in the inglenook, darts, pool */
function pub(K, E) {
  const R = rng(202), RP = (a) => a[(R() * a.length) | 0], hosted = !!E.host, wet = !hosted || !!E.hx?.wet;
  const boards = K.t(ctex(512, 512, (x, w, h) => planks(x, w, h, R, ['#5a3b24', '#4e331f', '#634329', '#553823'], 7), [1, 1]));
  const flags = K.t(ctex(512, 512, (x, w, h) => tiles(x, w, h, R, ['#6d6a63', '#5f5c55', '#77736a', '#68645c'], 4, 4, '#3a3833', 0.5), [1, 1]));
  const plaster = K.t(ctex(256, 256, (x, w, h) => { x.fillStyle = '#e6dcc6'; x.fillRect(0, 0, w, h); speck(x, w, h, R, 2600, ['#c9bfa8', '#fff8e8', '#b8ad95'], 3); }, [1, 1]));
  const panelT = K.t(ctex(256, 256, (x, w, h) => { x.fillStyle = '#3b2616'; x.fillRect(0, 0, w, h); for (let i = 0; i < 2; i++) { x.fillStyle = '#4a311d'; x.fillRect(16 + i * 128, 18, 96, h - 36); x.strokeStyle = 'rgba(0,0,0,.5)'; x.lineWidth = 4; x.strokeRect(16 + i * 128, 18, 96, h - 36); x.strokeStyle = 'rgba(255,220,170,.12)'; x.lineWidth = 2; x.strokeRect(21 + i * 128, 23, 86, h - 46); } speck(x, w, h, R, 900, ['#000', '#6a4a30'], 2); }, [1, 1]));
  const brickT = K.t(ctex(256, 256, (x, w, h) => { x.fillStyle = '#4a3c34'; x.fillRect(0, 0, w, h); for (let j = 0; j < 16; j++) for (let i = -1; i < 5; i++) { x.fillStyle = RP(['#8a4a32', '#7a3f2a', '#94553a', '#6e3a28', '#5e3324']); x.fillRect(i * 64 + (j % 2) * 32 + 2, j * 16 + 2, 60, 12); } speck(x, w, h, R, 1500, ['#000', '#c08060'], 2); }, [1, 1]));
  const oak = K.m('#4a301c', 0.55), oakD = K.m('#3a2414', 0.6, 0, { emissive: '#1a0f08' }), brass = K.m('#b08a3e', 0.3, 0.9), leather = K.m('#6e2622', 0.5), black = K.m('#121212', 0.6), plasterM = K.mt(plaster, 0.95), ceilM = K.mt(plaster, 0.95, 0, { emissive: '#4a3a2a' });
  // ---- the room: 12 x 9 m, 2.7 m to the plaster between the beams; windows on the street (south) and the lane (west)
  const H = 2.7, WIN = { s: [[-2.2, -0.8, 1.05, 2.2], [1.6, 3.0, 1.05, 2.2], [-5.3, -4.1, 0, 2.08]], w: [[-3.3, -2.1, 1.32, 2.25], [-0.9, 0.3, 1.32, 2.25]] };
  shell(K, -6, -4.5, 6, 4.5, H, { floor: K.mt(boards, 0.7), ceil: ceilM, wall: plasterM }, WIN, { floor: 1.6, wall: 1.2 });
  K.floor(K.mt(flags, 0.8), -1.4, -4.5, 6, -1.7, 1.3, 0.004);
  for (let x = -5.3; x <= 5.4; x += 1.35) K.box(oakD, x, H - 0.24, 0, 0.2, 0.24, 9.0);
  K.box(oakD, 0, H - 0.3, -1.6, 12, 0.3, 0.26);
  // (panelling to the dado rail, all round, round the door)
  const dado = (ax, c, a0, a1, skip = []) => { let a = a0; for (const [b0, b1] of [...skip, [a1, a1]]) { if (b0 - a > 0.02) { if (ax === 'x') K.box(K.mt(panelT, 0.6), (a + b0) / 2, 0, c, b0 - a, 1.02, 0.03, 0, [(b0 - a) / 0.9, 1]); else K.box(K.mt(panelT, 0.6), c, 0, (a + b0) / 2, b0 - a, 1.02, 0.03, Math.PI / 2, [(b0 - a) / 0.9, 1]); if (ax === 'x') K.box(oak, (a + b0) / 2, 1.02, c, b0 - a, 0.05, 0.06); else K.box(oak, c, 1.02, (a + b0) / 2, 0.06, 0.05, b0 - a); } a = b1; } };
  dado('x', -4.48, -6, 6); dado('x', 4.48, -6, 6, [[-5.35, -4.05]]); dado('z', -5.985, -4.5, 4.5); dado('z', 5.985, -4.5, 4.5, [[-1.05, 1.55]]);
  K.box(K.m('#3a2614', 0.5), -4.7, 0, 4.56, 1.14, 2.06, 0.06); K.box(brass, -4.25, 1.0, 4.52, 0.04, 0.04, 0.04); K.box(K.glass('#ffd8a0', 0.35), -4.7, 1.45, 4.53, 0.5, 0.4, 0.01);
  // (hosted: the windows look out on the real world, the circuit across the fields; rain on the glass only if it rains)
  const view = hosted ? null : K.e('#ffffff', { map: K.t(ctex(1024, 512, (x, w, h) => villageDusk(x, w, h, R))), fixed: true });
  const rainT = K.t(ctex(256, 256, (x, w, h) => rainStreaks(x, w, h, R), [1, 1]));
  const WM = { frame: oakD, bar: K.m('#222326', 0.4, 0.6), glass: K.glass('#a8bccc', 0.1), rain: wet ? K.e('#dfe9ff', { map: rainT, opacity: 0.45, depthWrite: false, fixed: true }) : null, view, sill: oak };
  windowIn(K, WM, -1.5, 4.5, 1.4, 1.05, 2.2, Math.PI, { cols: 3, rows: 4, thin: 0.012, d: 1.6, sill: true }); windowIn(K, WM, 2.3, 4.5, 1.4, 1.05, 2.2, Math.PI, { cols: 3, rows: 4, thin: 0.012, d: 1.6, sill: true, vx: 0.8 });
  windowIn(K, WM, -6, -2.7, 1.2, 1.32, 2.25, Math.PI / 2, { cols: 3, rows: 3, thin: 0.012, d: 1.6 }); windowIn(K, WM, -6, -0.3, 1.2, 1.32, 2.25, Math.PI / 2, { cols: 3, rows: 3, thin: 0.012, d: 1.6, vx: -0.6 });
  K.anim((t) => { rainT.offset.y = t * 0.22; });
  K.box(oak, 2.3, 0, 4.18, 1.6, 0.45, 0.42); K.box(leather, 2.3, 0.45, 4.18, 1.55, 0.06, 0.4); K.solid(1.5, 3.95, 3.1, 4.5);
  // ---- the bar along the north wall: oak counter, brass foot rail, the back bar, a chalkboard, the landlord
  K.box(oak, 2.3, 0, -3.2, 6.2, 1.0, 0.6); for (let i = 0; i < 9; i++) K.box(oakD, -0.6 + i * 0.72, 0.1, -2.89, 0.5, 0.8, 0.02);
  K.box(oakD, 2.3, 1.0, -3.18, 6.4, 0.07, 0.78); K.bar(brass, 2.3, 0.22, -2.78, 0.022, 6.1); for (let i = 0; i < 6; i++) K.cyl(brass, -0.4 + i * 1.2, 0, -2.8, 0.012, 0.012, 0.22, 6);
  K.box(oakD, 2.3, 0, -4.27, 6.2, 0.9, 0.44); K.box(oak, 2.3, 0.9, -4.27, 6.2, 0.04, 0.46);
  K.box(K.m('#0e1012', 0.15, 0.9), 2.3, 1.2, -4.47, 4.0, 1.0, 0.02);
  for (const y of [1.25, 1.75]) K.box(oak, 2.3, y, -4.36, 6.0, 0.035, 0.26);
  bottles(K, -0.6, 5.2, 1.285, -4.36, R, ['#d8862a', '#e8d9a0', '#9fbf4a', '#c84040', '#e0e0e0'], 24); bottles(K, -0.6, 5.2, 1.785, -4.36, R, ['#e8d9a0', '#7a5a3a', '#f0c040', '#aac8d8'], 20);
  K.box(K.m('#9aa0a8', 0.3, 0.85), 4.8, 0.94, -4.27, 0.55, 0.42, 0.4); K.box(black, 4.8, 1.02, -4.06, 0.45, 0.24, 0.02);
  K.cyl(K.m('#e8e2d6', 0.4), 0.2, 1.07, -3.2, 0.16, 0.16, 0.02, 20); K.add(K.glass('#ffffff', 0.25), new THREE.SphereGeometry(0.15, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), 0.2, 1.09, -3.2);
  for (let i = 0; i < 5; i++) K.cyl(K.m('#d9a75a', 0.8), 0.13 + (i % 3) * 0.07, 1.09, -3.25 + ((i / 3) | 0) * 0.08, 0.035, 0.035, 0.04, 10);
  const menu = K.mt(K.t(ctex(512, 320, (x, w, h) => chalk(x, w, h, R, ['Soft drinks · coffee · tea', 'Fresh orange · lemonade', 'Fish & chips', 'Pie of the day', 'Hot chocolate'], 'TONIGHT'))), 0.9);
  K.plane(menu, -0.3, 2.0, -4.47, 1.1, 0.68); K.box(oakD, -0.3, 1.63, -4.47, 1.18, 0.04, 0.04);
  for (const x of [0.4, 2.3, 4.2]) pendant(K, { cord: black, shade: K.m('#1f3a2a', 0.5, 0.2) }, x, -3.2, H - 0.3, 1.95, 0.14, '#ffd59a', 1.07, 0.22);
  K.solid(-0.85, -4.5, 5.45, -2.78);
  // ---- the inglenook on the east wall: brick, an oak lintel, a log fire, a mantel; the jukebox in the corner
  K.at(5.7, 0.25, Math.PI, () => {
    const B = K.mt(brickT, 0.9);
    K.box(B, 0, 0, -1.0, 0.6, H, 0.5, 0, [0.5, H / 1.2]); K.box(B, 0, 0, 1.0, 0.6, H, 0.5, 0, [0.5, H / 1.2]); K.box(B, 0, 1.05, 0, 0.6, H - 1.05, 1.5, 0, [1.2, 1.4]);
    // (the frame faces into the room: +x is the hearth side, -x the back of the fire)
    K.box(oakD, 0.02, 0.85, 0, 0.62, 0.22, 2.5); K.box(oakD, 0.25, 1.3, 0, 0.42, 0.06, 2.6);
    K.box(K.m('#141110', 0.95), -0.18, 0, 0, 0.24, 0.85, 1.5); K.box(K.m('#3a3634', 0.9), 0.5, 0, 0, 0.5, 0.05, 2.4);
    for (let i = 0; i < 3; i++) K.bar(K.m('#4a3424', 0.95), -0.06 + i * 0.02, 0.1 + (i % 2) * 0.09, (i - 1) * 0.12, 0.06, 0.62, 0.3 * (i - 1));
    K.box(K.e('#ff5a1a'), -0.04, 0.03, 0, 0.3, 0.06, 0.7); flame(K, K.t(flameTex()), -0.04, 0.1, 0, 0.55, 0.55, 3, 1.1);
    K.pool('#ff7a2a', 0.9, 0, 1.9, 0.38); K.wash('#ff8a3a', 0.31, 0.6, 0, 1.4, 1.0, Math.PI / 2, 0.25);
    K.box(K.m('#c8102e', 0.4), 0.25, 1.36, -0.7, 0.18, 0.06, 0.08); K.box(K.m('#1d1d1f'), 0.25, 1.36, -0.75, 0.05, 0.04, 0.12);
    for (const z of [0.55, 0.85]) { K.cyl(brass, 0.25, 1.36, z, 0.03, 0.04, 0.02, 10); K.cyl(K.m('#efe6d2', 0.6), 0.25, 1.38, z, 0.015, 0.015, 0.2, 8); }
    K.solid(-0.3, -1.25, 0.75, 1.25);
  });
  K.at(5.62, 3.55, Math.PI, () => {
    K.box(K.m('#3a1d12', 0.4), 0, 0, 0, 0.55, 1.15, 0.72); K.add(K.m('#3a1d12', 0.4), new THREE.CylinderGeometry(0.36, 0.36, 0.55, 20, 1, false, 0, Math.PI), 0, 1.15, 0, 0, 0, Math.PI / 2);
    for (const [r, c] of [[0.34, '#ff9a3a'], [0.29, '#ff4fa0'], [0.24, '#47e08a']]) K.add(K.e(c), new THREE.TorusGeometry(r, 0.022, 6, 24, Math.PI), 0.28, 1.15, 0, Math.PI / 2);
    K.box(K.e('#ffd59a'), 0.28, 0.66, 0, 0.01, 0.36, 0.5); K.box(K.m('#1a1210', 0.8), 0.28, 0.12, 0, 0.01, 0.42, 0.56); K.box(K.m('#c9ced6', 0.25, 0.9), 0.28, 0.6, 0, 0.02, 0.03, 0.66);
    K.wash('#ff7ab0', 0.3, 1.0, 0, 1.0, 1.2, Math.PI / 2, 0.2); K.pool('#ff9a3a', 0.6, 0, 0.9, 0.22); K.solid(-0.3, -0.38, 0.3, 0.38);
  });
  // ---- the booths on the west wall: high backs, oxblood leather, oak tables
  const booth = (z) => {
    rectTable(K, { top: oak, leg: oakD }, -5.2, z, 1.3, 0.8);
    for (const s of [-1, 1]) { const bz = z + s * 0.82; K.box(oakD, -5.2, 0, bz, 1.5, 0.42, 0.46); K.box(leather, -5.2, 0.42, bz, 1.46, 0.07, 0.44); K.box(oakD, -5.2, 0, bz + s * 0.25, 1.5, 1.28, 0.07); K.box(leather, -5.2, 0.5, bz + s * 0.2, 1.42, 0.62, 0.06); K.solid(-5.95, bz - 0.27, -4.45, bz + 0.27); }
    K.cyl(K.m('#efe6d2', 0.6), -5.2, 0.74, z, 0.025, 0.025, 0.07, 10); flame(K, K.t(flameTex()), -5.2, 0.81, z, 0.03, 0.05, 2, 0.6); K.pool('#ffb060', -5.2, z, 0.6, 0.25, 0.745);
  };
  booth(-2.8); booth(-0.4);
  K.at(-5.98, 0, Math.PI / 2, () => {
    for (const [i, zz] of [[0, 3.9], [1, 1.5]]) { const nm = ['WOODCOTE', 'COPSE', 'BECKETTS', 'STOWE', 'CLUB'][(R() * 5) | 0]; K.box(oakD, zz, 1.45, 0.01, 0.62, 0.48, 0.03); K.plane(K.mt(K.t(framed((x, w, h) => racingPrint(x, w, h, R, nm, 30 + i * 140))), 0.8), zz, 1.69, 0.03, 0.56, 0.42); }
  });
  K.at(0, 4.48, Math.PI, () => { for (const [i, xx] of [[0, 0.4], [1, -3.4]]) { K.box(oakD, xx, 1.42, 0.01, 0.62, 0.48, 0.03); K.plane(K.mt(K.t(framed((x, w, h) => racingPrint(x, w, h, R, ['STOWE', 'CLUB', 'ABBEY'][i + (R() < 0.5 ? 0 : 1)], 200 + i * 60))), 0.8), xx, 1.66, 0.03, 0.56, 0.42); } });
  for (const [x, z, ry] of [[-5.96, 0.95, Math.PI / 2], [5.96, -2.4, -Math.PI / 2], [5.96, 2.6, -Math.PI / 2], [-3.0, -4.47, 0], [0.9, 4.47, Math.PI]]) K.at(x, z, ry, () => { K.box(brass, 0, 1.7, 0.04, 0.08, 0.12, 0.08); K.sph(K.e('#ffd29a'), 0, 1.86, 0.1, 0.07, 10, 8, 1, 1.25, 1); K.wash('#ffc078', 0, 1.9, 0.02, 1.3, 1.3, 0, 0.3); });
  // ---- the pool table, under its lamp (the balls, the cue and the aiming line are the game's)
  const PT = { x: 0.7, z: 1.1, y: 0.79, L: 1.8, W: 0.9 };
  K.at(PT.x, PT.z, 0, () => {
    const L = PT.L, W = PT.W, baize = K.m('#1f6b3a', 0.95), cushM = K.m('#1a5e33', 0.9);
    K.box(oak, 0, 0.6, 0, L + 0.3, 0.19, W + 0.3); K.plane(baize, 0, PT.y + 0.001, 0, L, W, 0, true);
    for (const s of [-1, 1]) { K.box(cushM, -L / 4 - 0.01, PT.y, s * (W / 2 + 0.025), L / 2 - 0.12, 0.042, 0.05); K.box(cushM, L / 4 + 0.01, PT.y, s * (W / 2 + 0.025), L / 2 - 0.12, 0.042, 0.05); K.box(cushM, s * (L / 2 + 0.025), PT.y, 0, 0.05, 0.042, W - 0.12); }
    for (const s of [-1, 1]) { K.box(oak, 0, PT.y, s * (W / 2 + 0.1), L + 0.3, 0.05, 0.1); K.box(oak, s * (L / 2 + 0.1), PT.y, 0, 0.1, 0.05, W + 0.1); }
    for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1], [0, -1], [0, 1]]) K.cyl(black, a * (L / 2 + 0.005), PT.y + 0.005, b * (W / 2 + 0.005), a ? 0.06 : 0.055, a ? 0.06 : 0.055, 0.05, 16);
    for (let i = 1; i < 8; i++) if (i !== 4) for (const s of [-1, 1]) K.cyl(K.m('#efe6d2', 0.5), -L / 2 + (i * L) / 8, PT.y + 0.05, s * (W / 2 + 0.1), 0.007, 0.007, 0.003, 8);
    for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) K.box(oakD, a * (L / 2 + 0.02), 0, b * (W / 2 + 0.02), 0.16, 0.62, 0.16);
    K.box(K.m('#1f3a2a', 0.5, 0.2), 0, 1.6, 0, 1.3, 0.13, 0.34); K.box(K.e('#fff1c8'), 0, 1.595, 0, 1.24, 0.01, 0.3);
    for (const dx of [-0.5, 0.5]) K.cyl(brass, dx, 1.73, 0, 0.004, 0.004, H - 0.3 - 1.73, 4);
    K.pool('#fff1c8', 0, 0, 1.0, 0.2, PT.y + 0.004); K.solid(-1.08, -0.62, 1.08, 0.62);
  });
  const ballM = new THREE.MeshStandardMaterial({ roughness: 0.16, metalness: 0 });
  PT.balls = K.obj(new THREE.InstancedMesh(new THREE.SphereGeometry(0.0254, 20, 14), ballM, 16)); PT.balls.frustumCulled = false;
  PT.cue = K.obj(new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0135, 1.45, 10), K.m('#d8b884', 0.45))); PT.cue.visible = false;
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(12), 3));
  PT.line = K.obj(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.55, depthWrite: false }))); PT.line.visible = false; PT.line.frustumCulled = false;
  K.at(4.75, 4.47, Math.PI, () => { K.box(oakD, 0, 0.9, 0.03, 0.5, 0.06, 0.06); K.box(oakD, 0, 1.75, 0.03, 0.5, 0.06, 0.06); for (const dx of [-0.15, 0, 0.15]) K.cyl(K.m('#c8a874', 0.45), dx, 0.9, 0.06, 0.006, 0.012, 1.45, 8); K.box(K.m('#3a6ea8', 0.8), 0.24, 1.0, 0.05, 0.03, 0.03, 0.03); });
  // ---- the darts: the board on the west wall in its cabinet, the oche on the floor, a chalk scoreboard
  const DB = { c: V3(-5.906, 1.73, 3.0), n: V3(1, 0, 0), r: V3(0, 0, -1), up: V3(0, 1, 0), eye: V3(-5.97 + 2.37 + 0.12, 1.62, 3.0), darts: [] };
  const boardT = K.t(ctex(512, 512, (x, w, h) => dartboard(x, w, h)));
  K.at(-5.97, 3.0, Math.PI / 2, () => {
    K.box(oakD, 0, 1.33, 0.02, 0.62, 0.8, 0.04); K.box(oakD, -0.47, 1.33, 0.06, 0.3, 0.8, 0.03); K.box(oakD, 0.47, 1.33, 0.06, 0.3, 0.8, 0.03);
    K.cyl(black, 0, 1.73, 0.045, 0.235, 0.235, 0.03, 40, { rx: Math.PI / 2 });
    const g = new THREE.CircleGeometry(0.2255, 64); K.add(K.mt(boardT, 0.85), g, 0, 1.73, 0.062);
    K.wash('#fff1d8', 0, 1.73, 0.07, 1.0, 1.0, 0, 0.18);
    K.plane(K.mt(K.t(ctex(256, 384, (x, w, h) => chalk(x, w, h, R, ['501', '', 'YOU', '', 'THEM'], 'DARTS'))), 0.95), 0.78, 1.55, 0.03, 0.42, 0.62);
  });
  K.box(brass, -5.98 + 2.37, 0, 3.0, 0.04, 0.006, 0.9);
  for (let i = 0; i < 6; i++) {
    const d = new THREE.Group(), st = K.m('#b8bcc4', 0.3, 0.9), fl = K.m(i < 3 ? '#c8102e' : '#1f4fa8', 0.6, 0, { side: THREE.DoubleSide });
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.0022, 0.03, 6), st); tip.rotation.z = -Math.PI / 2; tip.position.x = 0.015;
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.05, 8), st); bar.rotation.z = Math.PI / 2; bar.position.x = -0.025;
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0025, 0.04, 6), black); sh.rotation.z = Math.PI / 2; sh.position.x = -0.07;
    for (let k = 0; k < 2; k++) { const f = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 0.03), fl); f.position.x = -0.09; f.rotation.x = k * Math.PI / 2; d.add(f); }
    d.add(tip, bar, sh); d.visible = false; K.obj(d); DB.darts.push(d);
  }
  K.area(-6, -4.5, 6, 4.5);
  // ---- what there is to do
  K.hot({ id: 'bar', kind: 'order', x: 2.3, y: 1.1, z: -2.85, reach: 2.0, label: 'Order at the bar', sub: 'Soft drinks, tea, food' });
  K.hot({ id: 'juke', kind: 'juke', x: 5.35, y: 1.1, z: 3.55, reach: 2.0, label: 'Put something on the jukebox' });
  K.hot({ id: 'pool', kind: 'game', game: 'pool', x: PT.x, y: 0.85, z: PT.z, reach: 2.3, label: 'Play pool with {opp}', sub: 'Three shots each. Most balls potted wins.' });
  K.hot({ id: 'darts', kind: 'game', game: 'darts', x: DB.c.x, y: DB.c.y, z: DB.c.z, reach: 3.3, label: 'Darts with {opp}', sub: 'Three darts each. Highest score wins.' });
  K.hot({ id: 'fire', kind: 'flavour', x: 5.4, y: 0.5, z: 0.25, reach: 2.2, label: 'Warm your hands at the fire', text: wet ? 'The logs crack and settle. Outside, the rain keeps on.' : 'The logs crack and settle. Outside, the evening is still.', taste: 'quiet' });
  K.hot({ id: 'window', kind: 'moment', x: 2.3, y: 1.6, z: 4.45, reach: 1.9, label: wet ? 'Watch the rain' : 'Look out at the circuit', look: V3(2.3, 1.4, 12) });
  K.hot({ id: 'photo', kind: 'photo', x: 5.2, y: 1.5, z: 1.9, reach: 2.2, label: 'Take a photo by the fire' });
  K.hot({ id: 'prints', kind: 'flavour', x: -5.95, y: 1.7, z: 2.35, reach: 2.4, label: 'Look at the old prints', text: 'Faded pictures of the circuit up the road, signed by people whose names have long since worn away.' });
  return {
    light: { hemi: ['#ffe2bf', '#5a4632', 1.1], dir: ['#ffd2a6', 0.7, [4, 5, 2]], exposure: 1.1, bg: '#14161c' }, lift: 0.05,
    moods: [{ name: 'Easy', music: 'atmos1', hemi: 1, glow: 1 }, { name: 'Late night', music: 'atmos2', hemi: 0.82, glow: 1.12 }, { name: 'Low and slow', music: 'atmos3', hemi: 0.72, glow: 0.85 }, { name: 'Quiet', music: null, hemi: 0.95, glow: 0.95 }],
    start: { x: -4.7, z: 3.75, yaw: -1.0 },
    date: [K.spot(-5.2, -3.62, facing(0, 1), 'sit', -0.06, { seat: 0 })],
    group: [K.spot(-5.5, -3.62, facing(0, 1), 'sit', -0.06), K.spot(-4.9, -3.62, facing(0, 1), 'sit', -0.06), K.spot(-4.9, -1.98, facing(0, -1), 'sit', -0.06, { seat: 1 })],
    seats: [{ x: -5.2, z: -1.98, yaw: -Math.PI / 2, eye: 1.13 }, { x: -5.5, z: -1.98, yaw: -Math.PI / 2, eye: 1.13 }],
    staff: { name: 'Graham', role: 'Landlord', x: 2.6, z: -3.85, face: facing(0, 1), hot: 'bar', look: { kit: 'casual', color: '#4b5a3c', accent: '#d8d2c4', legs: '#2a2d33', pose: 'cross', seed: 'pub-landlord' } },
    paps: [V3(2.3, 1.6, 7.2), V3(-8.4, 1.6, -2.7)], bed: wet ? 'rain' : 'room', where: wet ? 'watching the rain' : 'at the window',
    moment: !hosted ? ['Rain runs down the old glass. Across the lane the cottage windows glow, and the fire ticks behind you.', 'A wet Northamptonshire evening outside; in here, the warm, the low beams and the smell of woodsmoke.']
      : wet ? ['Rain runs down the old glass. Out past the lane the circuit lies quiet in the wet, and the fire ticks behind you.', 'A wet Northamptonshire evening outside; in here, the warm, the low beams and the smell of woodsmoke.']
        : ['Beyond the old glass the circuit lies quiet, a long way from race day. The fire ticks behind you.', 'A still Northamptonshire evening outside; in here, the warm, the low beams and the smell of woodsmoke.'],
    pool: PT, darts: DB, photoBack: 'the fire',
  };
}
/** a sim-racing lounge in neon: three rigs facing their screens, a lap board, an arcade cabinet, a fridge, a window on the city */
function simlounge(K, E) {
  const R = rng(303), RP = (a) => a[(R() * a.length) | 0];
  const conc = K.t(ctex(512, 512, (x, w, h) => { x.fillStyle = '#44474e'; x.fillRect(0, 0, w, h); speck(x, w, h, R, 5000, ['#2c2e33', '#55585f', '#62656c'], 3); x.strokeStyle = 'rgba(0,0,0,.4)'; x.lineWidth = 2; x.strokeRect(1, 1, w - 2, h - 2); }, [1, 1]));
  const slat = K.t(ctex(256, 256, (x, w, h) => { x.fillStyle = '#1c1f25'; x.fillRect(0, 0, w, h); for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 ? '#30343c' : '#282b32'; x.fillRect(i * 16 + 1, 0, 12, h); } }, [1, 1]));
  const H = 3.4, al = K.m('#9aa1aa', 0.35, 0.8), blk = K.m('#16171b', 0.5, 0.2), red = K.m('#c8102e', 0.5), cyan = K.e('#18e0ff'), mag = K.e('#ff2d9a');
  shell(K, -6.5, -5, 6.5, 5, H, { floor: K.mt(conc, 0.3, 0.15), ceil: K.m('#14161b', 0.9), wall: K.mt(slat, 0.85) }, { s: [[0.8, 5.2, 1.25, 2.9], [-6.1, -4.9, 0, 2.2]] }, { floor: 3, wall: 1.5 });
  // (down-lights in two rows: pools of white on the floor, the rest of the light the neon's)
  for (const z of [-1.0, 2.6]) for (const x of [-4, -1.3, 1.3, 4]) { K.cyl(K.m('#22252c', 0.5, 0.5), x, H - 0.08, z, 0.12, 0.14, 0.08, 14); K.cyl(K.e('#f2f6ff'), x, H - 0.085, z, 0.1, 0.1, 0.005, 14); K.pool('#dfe8ff', x, z, 1.5, 0.16); }
  for (const [x, z, w, d] of [[0, -4.95, 13, 0.04], [0, 4.95, 13, 0.04], [-6.45, 0, 0.04, 10], [6.45, 0, 0.04, 10]]) { K.box(cyan, x, H - 0.12, z, w, 0.03, d); K.box(mag, x, 0.05, z, w, 0.025, d); }
  K.wash('#18e0ff', 0, H - 0.55, -4.97, 13, 1.1, 0, 0.16); K.wash('#18e0ff', -6.47, H - 0.55, 0, 10, 1.1, Math.PI / 2, 0.14); K.wash('#18e0ff', 6.47, H - 0.55, 0, 10, 1.1, -Math.PI / 2, 0.14);
  for (const z of [-2.6, 1.6]) K.bar(K.m('#2a2d33', 0.5, 0.6), 0, H - 0.38, z, 0.2, 13, 0, 16);
  K.box(K.glass('#bfe8ff', 0.18), -5.5, 0, 5.0, 1.2, 2.2, 0.04); K.box(cyan, -5.5, 2.2, 4.98, 1.25, 0.03, 0.03); for (const x of [-6.1, -4.9]) K.box(cyan, x, 0, 4.98, 0.03, 2.2, 0.03);
  // ---- the rigs: aluminium frames, bucket seats, wheels, pedals, three screens each (the middle one is live)
  const sideM = K.e('#ffffff', { map: K.t(ctex(256, 144, (x, w, h) => simIdle(x, w, h, 3, '', 1))) }), rigs = [];
  for (const [i, rx] of [[0, -3.6], [1, 0], [2, 3.6]]) K.at(rx, -2.2, Math.PI / 2, () => {
    for (const z of [-0.28, 0.28]) K.box(al, 0.45, 0.02, z, 1.75, 0.06, 0.06);
    for (const xx of [-0.3, 0.5, 1.2]) K.box(al, xx, 0.02, 0, 0.06, 0.06, 0.62);
    for (const z of [-0.28, 0.28]) K.box(al, 0.5, 0.08, z, 0.06, 0.56, 0.06);
    K.box(al, 0.5, 0.62, 0, 0.14, 0.04, 0.62);
    K.box(blk, -0.02, 0.3, 0, 0.5, 0.09, 0.46); K.box(blk, -0.28, 0.32, 0, 0.1, 0.66, 0.48); K.box(red, -0.225, 0.62, 0, 0.02, 0.26, 0.3);
    for (const z of [-0.23, 0.23]) K.box(blk, -0.02, 0.38, z, 0.46, 0.14, 0.05);
    K.box(blk, 0.53, 0.66, 0, 0.1, 0.1, 0.12); K.add(blk, new THREE.TorusGeometry(0.15, 0.017, 8, 26), 0.49, 0.74, 0, Math.PI / 2); K.box(K.e('#ff3b30'), 0.465, 0.8, 0, 0.005, 0.02, 0.1);
    for (const z of [-0.11, 0, 0.11]) K.box(al, 0.98, 0.1, z, 0.03, 0.2, 0.07);
    K.box(al, 1.38, 0, 0, 0.08, 0.72, 0.08); K.box(blk, 1.4, 0.7, 0, 0.04, 0.52, 0.88);
    for (const s of [-1, 1]) K.at(1.27, s * 0.8, -s * 0.6, () => { K.box(blk, 0, 0.7, 0, 0.04, 0.52, 0.88); K.plane(sideM, -0.025, 0.96, 0, 0.84, 0.48, -Math.PI / 2); });
    K.pool('#ff2d9a', 0.45, 0, 1.25, 0.3);
    const scr = screen(K, 512, 288, 1.376, 0.96, 0, 0.84, 0.48, -Math.PI / 2);
    rigs.push({ i, scr, x: rx, seat: K.P(0, 0.44, 0), eye: K.P(-0.04, 1.06, 0), look: K.P(1.376, 0.93, 0) });
    K.solid(-0.4, -0.36, 1.45, 0.36);
  });
  const board = screen(K, 1024, 256, 0, 2.55, -4.97, 4.2, 1.05, 0);
  K.box(blk, 0, 2.0, -4.99, 4.4, 1.15, 0.03);
  // ---- the arcade cabinet, the fridge, the sound system
  K.at(-6.05, 0.4, 0, () => {
    const pur = K.m('#2a1450', 0.5), art = K.mt(K.t(ctex(128, 256, (x, w, h) => { vgrad(x, w, h, [[0, '#ff2d9a'], [0.5, '#6a2ad8'], [1, '#18e0ff']]); for (let i = 0; i < 9; i++) { x.strokeStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.moveTo(0, i * 32); x.lineTo(w, i * 32 + 40); x.stroke(); } })), 0.5);
    for (const s of [-1, 1]) K.box(art, -0.02, 0, s * 0.36, 0.78, 1.86, 0.035);
    K.box(pur, -0.12, 0, 0, 0.5, 0.88, 0.69); K.box(pur, -0.22, 0.88, 0, 0.32, 0.98, 0.69);
    K.add(blk, new THREE.BoxGeometry(0.34, 0.05, 0.66), 0.17, 0.95, 0, 0, 0, -0.22);
    K.cyl(blk, 0.2, 0.97, -0.13, 0.009, 0.009, 0.07, 6); K.sph(red, 0.2, 1.05, -0.13, 0.022, 10, 8);
    for (let k = 0; k < 3; k++) K.cyl(K.e(['#ff2d9a', '#18e0ff', '#ffd34d'][k]), 0.17 + k * 0.025, 0.975, 0.03 + k * 0.08, 0.017, 0.017, 0.015, 10);
    K.box(blk, 0.0, 1.13, 0, 0.05, 0.56, 0.64);
    K.plane(K.e('#ffffff', { map: K.t(ctex(256, 64, (x, w, h) => { x.fillStyle = '#0a0612'; x.fillRect(0, 0, w, h); words(x, 'NIGHT RUN', w / 2, h / 2, "italic 900 34px 'Segoe UI', Arial", '#ff4fa8', 12); })) }), 0.06, 1.74, 0, 0.62, 0.16, Math.PI / 2);
    K.pool('#ff2d9a', 0.6, 0, 0.9, 0.25);
    K.solid(-0.42, -0.4, 0.38, 0.4);
  });
  const arcade = { scr: screen(K, 320, 240, -6.02, 1.41, 0.4, 0.46, 0.345, Math.PI / 2, { nearest: true }), eye: V3(-5.2, 1.52, 0.4), look: V3(-6.02, 1.39, 0.4) };
  K.at(-6.15, -2.1, 0, () => {
    K.box(blk, -0.05, 0, 0, 0.6, 2.0, 0.82); K.box(K.e('#dff3ff'), -0.31, 0.12, 0, 0.02, 1.76, 0.7);
    for (const y of [0.42, 0.82, 1.22, 1.62]) { K.box(K.glass('#ffffff', 0.3), -0.05, y, 0, 0.5, 0.015, 0.7); for (let k = 0; k < 6; k++) { const c = K.m(RP(['#c8102e', '#1f4fa8', '#d8d8dc', '#2e9e5a', '#f0b020', '#7a2ad8']), 0.3, 0.6); K.cyl(c, -0.1 + (k % 2) * 0.12, y + 0.015, -0.28 + k * 0.11, 0.032, 0.032, 0.122, 10); } }
    K.box(K.glass('#cfe8ff', 0.16), 0.26, 0.08, 0, 0.02, 1.84, 0.76); K.box(al, 0.28, 0.6, 0.34, 0.03, 0.8, 0.03); K.pool('#cfe8ff', 0.8, 0, 1.0, 0.18);
    K.solid(-0.38, -0.44, 0.3, 0.44);
  });
  K.at(6.1, -2.4, Math.PI, () => {
    for (const z of [-0.55, 0.55]) { K.box(blk, 0, 0, z, 0.45, 1.3, 0.5); for (const [y, r] of [[0.35, 0.16], [0.85, 0.11], [1.15, 0.05]]) { K.cyl(K.m('#1e1f23', 0.6), 0.226, y, z, r, r, 0.02, 20, { rz: Math.PI / 2 }); K.add(K.e('#18e0ff'), new THREE.TorusGeometry(r + 0.012, 0.004, 4, 24), 0.236, y, z, Math.PI / 2); } }
    K.box(blk, 0, 0.82, 0, 0.42, 0.1, 0.58); K.box(K.e('#47ff9a'), 0.12, 0.925, 0, 0.12, 0.005, 0.36); K.box(K.e('#ff2d9a'), 0.2, 0.86, 0, 0.005, 0.03, 0.5);
    K.solid(-0.25, -0.85, 0.3, 0.85);
  });
  // ---- the neon sign, the window ledge and its stools, the sofa
  K.at(6.47, 0.8, -Math.PI / 2, () => {
    const t = K.t(ctex(1024, 256, (x, w, h) => { x.fillStyle = '#06070b'; x.fillRect(0, 0, w, h); words(x, 'SLIPSTREAM', w / 2, h * 0.44, "italic 900 150px 'Segoe UI', Arial", '#3ef0ff', 28); x.fillStyle = '#ff2d9a'; x.shadowColor = '#ff2d9a'; x.shadowBlur = 18; x.fillRect(w * 0.2, h * 0.78, w * 0.6, 6); x.shadowBlur = 0; words(x, 'SIM RACING LOUNGE', w / 2, h * 0.9, "700 26px 'Segoe UI', Arial", '#ff9ad0', 8); }));
    K.plane(K.e('#ffffff', { map: t }), 0, 2.35, 0.02, 3.0, 0.75); K.wash('#3ef0ff', 0, 2.35, 0.01, 4.2, 1.8, 0, 0.18);
  });
  // (hosted: the window is on the real street, the circuit's lights beyond it)
  const view = E.host ? null : K.e('#ffffff', { map: K.t(ctex(1024, 400, (x, w, h) => cityNight(x, w, h, R))), fixed: true });
  windowIn(K, { frame: blk, glass: K.glass('#9fc8e8', 0.08), view }, 3.0, 5.0, 4.4, 1.25, 2.9, Math.PI, { cols: 4, rows: 1, d: 2.2, vh: 2.2 });
  K.box(K.m('#1d2026', 0.4, 0.3), 3.0, 1.0, 4.74, 4.6, 0.05, 0.5); for (const x of [1.0, 3.0, 5.0]) K.box(al, x, 0.6, 4.95, 0.04, 0.4, 0.04);
  K.solid(0.7, 4.48, 5.3, 5.0);
  const FM = { metal: al, seat: K.m('#c8102e', 0.6) };
  for (const x of [1.3, 2.4, 3.5, 4.6]) stool(K, FM, x, 4.18, 0.74);
  sofa(K, { frame: K.m('#22252c', 0.85), cushion: K.m('#3a3f4a', 0.9), foot: al }, -2.6, 4.45, 2.6, Math.PI / 2);
  K.box(blk, -2.6, 0, 3.45, 1.2, 0.38, 0.55); K.solid(-3.2, 3.15, -2.0, 3.75);
  K.area(-6.5, -5, 6.5, 5);
  // ---- what there is to do
  for (const rg of rigs) K.hot({ id: 'rig' + rg.i, kind: 'game', game: 'sim', x: rg.x, y: 0.9, z: -2.2, reach: 2.1, label: 'Race {opp} on the sims', sub: 'Lights out, then hold the line for a lap.' });
  K.hot({ id: 'arcade', kind: 'game', game: 'arcade', x: -5.8, y: 1.4, z: 0.4, reach: 2.0, label: 'Play Night Run', sub: "Beat {opp}'s high score." });
  K.hot({ id: 'fridge', kind: 'order', x: -5.8, y: 1.2, z: -2.1, reach: 1.9, label: 'Grab something from the fridge' });
  K.hot({ id: 'speakers', kind: 'juke', x: 5.8, y: 1.0, z: -2.4, reach: 2.2, label: 'Change the music' });
  K.hot({ id: 'window', kind: 'moment', x: 3.0, y: 2.0, z: 4.95, reach: 2.4, label: E.host ? 'Look out at the circuit' : 'Look out over the city', look: V3(3, 2, 60) });
  K.hot({ id: 'photo', kind: 'photo', x: 6.3, y: 2.1, z: 0.8, reach: 2.8, label: 'Take a photo under the sign' });
  K.hot({ id: 'board', kind: 'board', x: 0, y: 2.5, z: -4.9, reach: 3.2, label: 'Check the lap board' });
  return {
    light: { hemi: ['#a6b8ff', '#3a2440', 1.15], dir: ['#e2e8ff', 0.75, [-2, 5, 4]], exposure: 1.15, bg: '#05060a' }, lift: 0.06,
    moods: [{ name: 'Easy', music: 'atmos1', hemi: 1, glow: 1 }, { name: 'Late night', music: 'atmos2', hemi: 0.78, glow: 1.25 }, { name: 'Low and slow', music: 'atmos3', hemi: 0.7, glow: 0.75 }, { name: 'Quiet', music: null, hemi: 0.95, glow: 0.9 }],
    start: { x: -5.5, z: 3.9, yaw: Math.atan2(-1, 0.7) },
    date: [K.spot(0, -2.2, Math.PI / 2, 'sit', -0.08, { rig: 1 }), K.spot(2.6, 3.7, facing(-0.4, -1))],
    group: [K.spot(0, -2.2, Math.PI / 2, 'sit', -0.08, { rig: 1 }), K.spot(3.6, -2.2, Math.PI / 2, 'sit', -0.08, { rig: 2 }), K.spot(1.8, -0.5, facing(-0.7, 1))],
    seats: [], staff: null, paps: [V3(3, 2.2, 14)], bed: 'hum', rigs, board, arcade,
    moment: E.host ? ['Through the glass, the fences of the circuit, and nobody on it now. Behind you the rigs tick over, waiting for someone brave.', 'The world outside going about its evening, and the hum of the sims in the room behind.']
      : ['The city keeps its lights on below. Behind you the rigs tick over, waiting for someone brave.', 'Rain-dark streets, a thousand lit windows, and the hum of the sims in the room behind.'],
    photoBack: 'the neon sign', where: E.host ? 'at the window' : undefined,
  };
}

/** your flat: an open-plan room with a kitchen island to cook at, a sofa and a big TV, a record player, a balcony on the city */
function apartment(K, E) {
  const R = rng(404), RP = (a) => a[(R() * a.length) | 0], dusk = E.night === false;
  const oakT = K.t(ctex(512, 512, (x, w, h) => planks(x, w, h, R, ['#b48a5e', '#a77f55', '#bf9567', '#9e774f'], 8, { gap: 'rgba(60,40,20,.5)' }), [1, 1]));
  const marbleT = K.t(ctex(512, 256, (x, w, h) => { x.fillStyle = '#eceae6'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(120,120,130,.35)'; for (let i = 0; i < 14; i++) { x.lineWidth = 0.6 + R() * 2; x.beginPath(); let px = R() * w, py = R() * h; x.moveTo(px, py); for (let k = 0; k < 8; k++) { px += (R() - 0.3) * 80; py += (R() - 0.5) * 50; x.lineTo(px, py); } x.stroke(); } speck(x, w, h, R, 1200, ['#cfcfd4', '#ffffff'], 2); }, [1, 1]));
  const H = 2.8, wall = K.m('#ece8e1', 0.9), black = K.m('#18191c', 0.5, 0.3), white = K.m('#f4f3f0', 0.6), walnut = K.m('#5a3d28', 0.5), steel = K.m('#b8bdc4', 0.3, 0.85), marble = K.mt(marbleT, 0.3);
  shell(K, -6, -4.5, 6, 4.5, H, { floor: K.mt(oakT, 0.55), ceil: K.m('#f2f0ec', 0.95, 0, { emissive: '#4e4a44' }), wall: { n: null, s: wall, w: wall, e: wall } }, {}, { floor: 2.2 });
  // ---- the glass wall onto the balcony (one panel slid open), the balcony, the city beyond
  const glass = K.glass('#b8d8ea', 0.1), ms = [-6, -4.4, -2.8, -1.2, 1.0, 2.6, 4.3, 6];
  for (let i = 0; i < ms.length; i++) { K.box(black, ms[i], 0, -4.5, 0.06, H, 0.12); if (i < ms.length - 1 && ms[i] !== 1.0) K.plane(glass, (ms[i] + ms[i + 1]) / 2, H / 2, -4.5, ms[i + 1] - ms[i], H); }
  K.box(black, 0, 0, -4.5, 12, 0.05, 0.14); K.box(black, 0, H - 0.06, -4.5, 12, 0.06, 0.14); K.plane(glass, 1.85, H / 2, -4.42, 1.6, H);
  K.solid(-6, -4.58, 1.0, -4.42); K.solid(2.6, -4.58, 6, -4.42);
  K.floor(K.m('#3a3a3e', 0.8), -6, -6.6, 6, -4.5, 2); K.box(K.m('#8a8a90', 0.85), 0, H, -5.55, 12.4, 0.25, 2.3); K.box(K.m('#8a8a90', 0.85), 0, -0.4, -5.55, 12.4, 0.38, 2.3);
  for (const x of [-6.1, 6.1]) K.box(K.m('#7a7a80', 0.9), x, 0, -5.55, 0.2, H, 2.1);
  K.plane(K.glass('#b8d8ea', 0.14), 0, 0.55, -6.6, 12, 1.05); K.bar(steel, 0, 1.08, -6.6, 0.025, 12); for (let x = -5.5; x <= 5.6; x += 1.5) K.box(steel, x, 0, -6.6, 0.04, 1.08, 0.04);
  K.at(-4.8, -5.5, 0, () => { roundTable(K, { top: black, leg: black }, 0, 0, 0.3, 0.72); chair(K, { wood: black, seat: K.m('#c8c0b0', 0.9) }, 0.55, 0.15, Math.PI, 0.45); });
  K.area(-5.9, -6.45, 5.9, -4.5);
  // ---- the city. Hosted, the real one is beyond the glass, and the flat is one floor of a tower: the storeys under it
  // down to the street, a few over it, a wing either side and the rest of the floor behind; otherwise a painted night
  if (E.host) {
    const top = H + 0.25, X = 11, Z0 = -6.75, Z1 = 9;
    buildingMass(K, E, [[-X, -E.ay, Z0, X, -0.4, Z1], [-X, top, Z0, X, top + 10.5, Z1], [-X, -0.4, Z0, -6.2, top, Z1], [6.2, -0.4, Z0, X, top, Z1], [-6.2, -0.4, 4.7, 6.2, top, Z1]]);
  } else {
    const sky = K.obj(new THREE.Mesh(new THREE.SphereGeometry(1200, 32, 16), new THREE.MeshBasicMaterial({ map: K.t(skyTex(R, dusk)), side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false }))); sky.renderOrder = -1;
    K.plane(K.e('#ffffff', { map: K.t(streetTex(R, 0.6)), fixed: true }), 0, -40, -300, 2400, 2400, 0, true);
    const fm = [0.7, 0.4].map((wm, i) => K.e('#ffffff', { map: K.t(ctex(256, 384, (x, w, h) => facade(x, w, h, rng(410 + i), wm, 0.5)), [1, 1]), fixed: true })), roof = K.m('#0b0c10', 0.9);
    for (let i = 0; i < 40; i++) { const a = -Math.PI / 2 + (R() - 0.5) * 2.4, d = 70 + R() * 520, w = 18 + R() * 34, top = -20 + R() * (R() < 0.3 ? 140 : 40), Hh = top + 40, x = Math.cos(a) * d, z = Math.sin(a) * d; K.add(fm[i % 2], uvs(new THREE.BoxGeometry(w, Hh, w * (0.7 + R() * 0.6)), Math.max(1, Math.round(w / 9)), Math.max(1, Math.round(Hh / 14))), x, -40 + Hh / 2, z); K.box(roof, x, top, z, w + 0.3, 0.4, w * 1.3 + 0.3); }
    E.scene.fog = new THREE.Fog(dusk ? '#3a3050' : '#0d1022', 150, 1200);
  }
  // ---- the kitchen: an island with a hob (the cooking's), stools, the units along the east wall, pendants
  K.box(white, 3.4, 0, 1.0, 2.4, 0.9, 1.0); K.box(marble, 3.4, 0.9, 1.0, 2.5, 0.04, 1.08); K.box(K.m('#c9c4bb', 0.6), 3.4, 0.08, 1.52, 2.36, 0.02, 0.02);
  K.box(K.m('#0a0a0c', 0.12, 0.3), 3.4, 0.94, 1.2, 0.62, 0.006, 0.46); K.solid(2.15, 0.45, 4.65, 1.55);
  const ringM = new THREE.MeshBasicMaterial({ color: '#2a0a06', toneMapped: false }), ring = K.obj(new THREE.Mesh(new THREE.RingGeometry(0.1, 0.13, 32), ringM)); ring.rotation.x = -Math.PI / 2; ring.position.set(3.4, 0.948, 1.2);
  const pan = new THREE.Group(), panM = new THREE.MeshStandardMaterial({ color: '#2a2b2f', roughness: 0.35, metalness: 0.7 });
  pan.add(new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.12, 0], [0.135, 0.045], [0.14, 0.05], [0.13, 0.048], [0.118, 0.006], [0, 0.006]].map(([r, y]) => new THREE.Vector2(r, y)), 28), panM));
  const hdl = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.2, 8), new THREE.MeshStandardMaterial({ color: '#141414', roughness: 0.6 })); hdl.rotation.z = Math.PI / 2; hdl.position.set(0.23, 0.04, 0); pan.add(hdl);
  pan.position.set(3.4, 0.948, 1.2); pan.rotation.y = 0.5; K.obj(pan);
  const food = K.obj(new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 10, 8), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7 }), 9)); food.frustumCulled = false; food.visible = false;
  K.lathe(K.m('#f6f6f2', 0.3), 2.72, 0.94, 1.25, [[0, 0], [0.1, 0], [0.13, 0.012], [0.135, 0.016], [0.12, 0.012], [0, 0.008]], 28);
  const FM = { metal: steel, seat: K.m('#2e2f33', 0.7) };
  for (const x of [2.8, 4.0]) stool(K, FM, x, 0.08, 0.65);
  K.box(white, 5.7, 0, 0.6, 0.6, 0.9, 4.6); K.box(marble, 5.66, 0.9, 0.6, 0.68, 0.04, 4.6); K.box(white, 5.8, 1.55, 0.6, 0.4, 0.8, 4.6); K.box(K.e('#fff1d8'), 5.6, 1.54, 0.6, 0.02, 0.02, 4.4);
  K.wash('#fff1d8', 5.97, 1.25, 0.6, 4.4, 0.6, -Math.PI / 2, 0.25);
  for (let z = -1.4; z <= 2.7; z += 0.6) K.box(steel, 5.39, 0.72, z, 0.02, 0.02, 0.22);
  K.box(steel, 5.62, 0.9, -0.6, 0.5, 0.02, 0.62); K.cyl(steel, 5.86, 0.92, -0.6, 0.012, 0.012, 0.32, 8);
  K.box(K.m('#d8d4cc', 0.5), 5.65, 0, -2.4, 0.7, 2.25, 0.9); K.box(steel, 5.29, 0.9, -2.1, 0.02, 0.7, 0.03);
  K.box(black, 5.4, 0.15, 2.4, 0.02, 0.55, 0.58); K.box(K.e('#ff9a40'), 5.39, 0.6, 2.4, 0.005, 0.03, 0.2);
  K.solid(5.3, -2.9, 6, 2.95);
  for (const z of [0.55, 1.0, 1.45]) pendant(K, { cord: black, shade: null }, 3.4, z, H, 2.05, 0.09, '#ffe3b4', 0.94, 0.2);
  // ---- the living room: the TV on the west wall, the sofa, a rug, a lamp; the dining table by the glass
  K.box(walnut, -5.75, 0, -0.6, 0.45, 0.5, 2.4); K.box(black, -5.96, 0.78, -0.6, 0.04, 1.02, 1.8);
  const tv = screen(K, 512, 288, -5.935, 1.29, -0.6, 1.7, 0.96, Math.PI / 2);
  sofa(K, { frame: K.m('#8a8478', 0.95), cushion: K.m('#9d968a', 0.95), foot: black }, -3.0, -0.6, 2.8, Math.PI);
  K.box(K.m('#8a8478', 0.95), -3.9, 0.06, 1.25, 1.5, 0.3, 0.8); K.box(K.m('#9d968a', 0.95), -3.9, 0.36, 1.25, 1.44, 0.12, 0.76); K.solid(-4.65, 0.85, -3.15, 1.65);
  K.box(walnut, -4.3, 0, -0.6, 0.6, 0.4, 1.2); K.solid(-4.6, -1.2, -4.0, 0);
  K.plane(K.mt(K.t(ctex(512, 384, (x, w, h) => { x.fillStyle = '#d9cfbf'; x.fillRect(0, 0, w, h); x.strokeStyle = '#8a5a3a'; x.lineWidth = 8; x.strokeRect(20, 20, w - 40, h - 40); for (let i = 0; i < 6; i++) { x.strokeStyle = i % 2 ? '#3a5a6a' : '#b06a40'; x.lineWidth = 4; x.strokeRect(50 + i * 18, 50 + i * 14, w - 100 - i * 36, h - 100 - i * 28); } speck(x, w, h, R, 2000, ['#000', '#fff'], 2); })), 0.95), -4.2, 0.006, -0.6, 3.2, 2.4, 0, true);
  K.cyl(black, -2.2, 0, -2.6, 0.16, 0.18, 0.03, 16); K.tube(black, [[-2.2, 0, -2.6], [-2.25, 1.6, -2.6], [-2.6, 2.05, -2.1], [-3.2, 2.0, -1.4], [-3.4, 1.85, -1.1]], 0.012, 24, 5);
  K.lathe(K.m('#e8e2d6', 0.6), -3.4, 1.62, -1.1, [[0.01, 0.24], [0.1, 0.22], [0.18, 0.02], [0.17, 0], [0.001, 0.2]], 18); K.sph(K.e('#ffe3b4'), -3.4, 1.7, -1.1, 0.06, 10, 8); K.pool('#ffe3b4', -3.4, -1.1, 1.4, 0.2);
  rectTable(K, { top: walnut, leg: black }, -1.6, -3.2, 1.6, 0.9);
  const CM = { wood: black, seat: K.m('#c8c0b0', 0.9) };
  for (const x of [-2.0, -1.2]) { chair(K, CM, x, -3.92, facing(0, 1), 0.46); chair(K, CM, x, -2.48, facing(0, -1), 0.46); }
  pendant(K, { cord: black, shade: K.m('#1f2024', 0.4, 0.4) }, -1.6, -3.2, H, 1.6, 0.17, '#ffe0a8', 0.74, 0.25);
  // ---- the record player on its sideboard, records, the bookcase (with your trophies), a print, plants
  K.at(-2.2, 4.27, Math.PI / 2, () => {
    K.box(walnut, 0, 0.12, 0, 0.45, 0.5, 1.8); for (const z of [-0.6, 0, 0.6]) K.box(K.m('#4a3220', 0.5), 0.226, 0.17, z, 0.005, 0.4, 0.56);
    for (const z of [-0.85, 0.85]) K.box(walnut, 0, 0, z, 0.4, 0.12, 0.04);
    K.box(K.m('#2a2a2c', 0.4), 0, 0.62, 0.2, 0.36, 0.08, 0.44); K.cyl(K.m('#0d0d0e', 0.3), 0, 0.7, 0.18, 0.15, 0.15, 0.012, 32); K.cyl(K.m('#c8102e', 0.5), 0, 0.712, 0.18, 0.045, 0.045, 0.002, 16);
    K.box(steel, 0.1, 0.72, 0.36, 0.015, 0.015, 0.2, 0.4);
    for (const z of [-0.45, 0.75]) { K.box(black, 0, 0.62, z, 0.22, 0.34, 0.2); K.cyl(K.m('#2e2e30', 0.6), 0.112, 0.78, z, 0.07, 0.07, 0.01, 16, { rz: Math.PI / 2 }); }
    for (let i = 0; i < 14; i++) K.box(K.m(RP(['#c8102e', '#1f4fa8', '#f0b020', '#2e9e5a', '#e8e2d6', '#1a1a1a', '#7a2ad8']), 0.7), -0.05, 0.62, -0.3 + i * 0.012, 0.3, 0.3, 0.008);
  });
  K.solid(-3.15, 4.0, -1.25, 4.5);
  K.plane(K.mt(K.t(framed((x, w, h) => { vgrad(x, w, h, [[0, '#e8b070'], [1, '#c0503a']]); for (let i = 0; i < 5; i++) { x.fillStyle = ['#1f3a5a', '#f2ead8', '#2a2a2a', '#e8c25a', '#8a3a2a'][i]; x.beginPath(); x.arc(w * (0.2 + i * 0.15), h * (0.3 + (i % 2) * 0.35), h * (0.12 + R() * 0.12), 0, 7); x.fill(); } }, 256, 192, '#fbfaf6')), 0.9), -2.2, 1.8, 4.48, 1.3, 0.97, Math.PI);
  const me = E.c?.drivers?.[E.c.playerId], wins = me?.wins || 0, pods = me?.podiums || 0;
  K.at(-4.75, 4.3, Math.PI, () => {
    K.box(walnut, 0, 0, 0, 1.3, 2.1, 0.36); for (const y of [0.42, 0.84, 1.26, 1.68]) K.box(K.m('#6a4a32', 0.5), 0, y, -0.02, 1.24, 0.03, 0.33);
    const bookT = K.mt(K.t(ctex(256, 128, (x, w, h) => { for (let i = 0; i < 24; i++) { x.fillStyle = RP(['#7a2a2a', '#2a4a6a', '#3a5a3a', '#c8b07a', '#2a2a2a', '#8a6a4a', '#e8e2d6']); const bw = 7 + R() * 6, bh = h * (0.7 + R() * 0.3); x.fillRect(i * 10.6, h - bh, bw, bh); } })), 0.85);
    for (const y of [0.45, 1.29]) K.plane(bookT, 0, y + 0.18, 0.12, 1.2, 0.36, 0);
    const tro = (x, y, col, k) => { const m = K.m(col, 0.25, 0.9); K.lathe(m, x, y, 0.02, [[0, 0], [0.04 * k, 0], [0.04 * k, 0.03], [0.012, 0.05], [0.012, 0.12 * k], [0.05 * k, 0.16 * k], [0.06 * k, 0.24 * k], [0, 0.22 * k]], 14); };
    const n = Math.min(3, pods), cols = wins ? ['#d8b040', '#c0c4cc', '#b87a48'] : ['#c0c4cc', '#b87a48', '#b87a48'];
    for (let i = 0; i < n; i++) tro(-0.4 + i * 0.4, 0.875, cols[i], i === 0 && wins ? 1.25 : 1);
    if (!n) K.box(K.m('#c8102e', 0.4), 0, 0.875, 0.02, 0.3, 0.12, 0.12);
  });
  K.solid(-5.45, 4.08, -4.05, 4.5);
  const PM = { pot: K.m('#e8e2d6', 0.7), soil: K.m('#2b2118', 1), leaf: K.m('#2f6a3a', 0.85), leaf2: K.m('#3f7a44', 0.85) };
  plant(K, PM, 5.3, -3.85, 1.6, R); plant(K, PM, -5.4, -3.85, 1.4, R); plant(K, PM, 5.4, 4.0, 1.1, R);
  K.box(K.m('#c9c2b4', 0.6), 4.85, 0, 4.47, 1.0, 2.1, 0.05); K.box(steel, 4.45, 1.0, 4.43, 0.12, 0.02, 0.03);
  K.hot({ id: 'hob', kind: 'game', game: 'cooking', x: 3.4, y: 0.95, z: 1.2, reach: 1.9, label: 'Cook for {opp}', sub: 'Stir, flip, plate up.' });
  K.hot({ id: 'records', kind: 'juke', x: -2.2, y: 0.75, z: 4.2, reach: 2.0, label: 'Put a record on' });
  K.hot({ id: 'tv', kind: 'tv', x: -5.9, y: 1.3, z: -0.6, reach: 4.2, label: 'Put the race highlights on' });
  K.hot({ id: 'fridge', kind: 'order', x: 5.4, y: 1.2, z: -2.4, reach: 1.9, label: 'Get something from the fridge' });
  K.hot({ id: 'balcony', kind: 'moment', x: 1.8, y: 1.3, z: -6.45, reach: 2.0, label: 'Step out onto the balcony', look: V3(0, -5, -300) });
  K.hot({ id: 'photo', kind: 'photo', x: -0.4, y: 1.4, z: -4.45, reach: 2.2, label: 'Take a photo by the window' });
  K.hot({ id: 'trophies', kind: 'flavour', x: -4.75, y: 1.0, z: 4.2, reach: 2.2, label: 'Look at the shelf', text: wins ? 'Your trophies, dusted for company. The one from your first win sits a little apart from the rest.' : pods ? 'A trophy or two, dusted for company.' : 'Room on the shelf for a trophy. One day.' });
  return {
    light: { hemi: ['#ffe9d2', '#4a3b30', 0.95], dir: ['#ffe0bc', 0.6, [2, 5, 3]], exposure: 1.05, bg: '#0c1020' }, lift: 0.03,
    moods: [{ name: 'Easy', music: 'atmos1', hemi: 1, glow: 1 }, { name: 'Late night', music: 'atmos2', hemi: 0.75, glow: 1.15 }, { name: 'Low and slow', music: 'atmos3', hemi: 0.62, glow: 0.85 }, { name: 'Quiet', music: null, hemi: 0.95, glow: 0.95 }],
    start: { x: 4.6, z: 3.7, yaw: Math.atan2(-1, -0.6) },
    date: [K.spot(3.4, 0.08, facing(0, 1), 'sit', 0.13), K.spot(-1.6, -3.92, facing(0, 1), 'sit', -0.06, { seat: 0 })],
    group: [K.spot(2.8, 0.08, facing(0, 1), 'sit', 0.13), K.spot(4.0, 0.08, facing(0, 1), 'sit', 0.13), K.spot(4.95, 2.05, facing(-1, -0.4))],
    seats: [{ x: -1.6, z: -2.48, yaw: -Math.PI / 2, eye: 1.13 }], staff: null, paps: [V3(-38, 8, -90)], bed: 'cityfar',
    hob: { pan, ring: ringM, food, eye: V3(3.4, 1.62, 2.05), look: V3(3.4, 0.95, 1.12), plate: V3(2.72, 0.96, 1.25) }, tv,
    moment: ['The city spread out below the balcony, its noise turned down to a hum. Up here it is just the two of you and the lights.', E.host ? 'A cool breath of air on the balcony. Far below, the traffic moves in ribbons of light.' : 'A cool breath of air on the balcony. Somewhere below, a siren; somewhere further, the motorway, a river of headlights.'],
    photoBack: 'the city lights',
  };
}

/** a private dining room: green panelling, a round table laid for dinner by candlelight, a chandelier, a window on the river */
function restaurant(K, E) {
  const R = rng(505), RP = (a) => a[(R() * a.length) | 0], dusk = E.night === false;
  const parquet = K.t(ctex(512, 512, (x, w, h) => { x.fillStyle = '#2a1a10'; x.fillRect(0, 0, w, h); const s = 32; for (let j = -1; j < 18; j++) for (let i = -1; i < 18; i++) { x.save(); x.translate(i * s + (j % 2 ? s / 2 : 0), j * s); x.rotate(((i + j) % 2 ? 1 : -1) * Math.PI / 4); x.fillStyle = RP(['#5a3a24', '#4e321f', '#664229', '#553621']); x.fillRect(-s * 0.72, -s * 0.18, s * 1.44, s * 0.36); x.restore(); } speck(x, w, h, R, 1500, ['#000', '#8a6a4a'], 1.5); }, [1, 1]));
  const damask = K.t(ctex(256, 256, (x, w, h) => { x.fillStyle = '#1e3a34'; x.fillRect(0, 0, w, h); for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const cx = i * 64 + (j % 2) * 32 + 16, cy = j * 64 + 32; x.strokeStyle = 'rgba(200,180,120,.22)'; x.lineWidth = 2; x.beginPath(); x.ellipse(cx, cy, 10, 20, 0, 0, 7); x.stroke(); x.beginPath(); x.arc(cx - 12, cy - 18, 6, 0, 4); x.arc(cx + 12, cy - 18, 6, 3, 7); x.stroke(); } }, [1, 1]));
  const panelT = K.t(ctex(256, 256, (x, w, h) => { x.fillStyle = '#1a2e28'; x.fillRect(0, 0, w, h); for (let i = 0; i < 2; i++) { x.strokeStyle = 'rgba(0,0,0,.5)'; x.lineWidth = 5; x.strokeRect(14 + i * 128, 16, 100, h - 32); x.strokeStyle = 'rgba(200,180,120,.25)'; x.lineWidth = 2; x.strokeRect(20 + i * 128, 22, 88, h - 44); } }, [1, 1]));
  const H = 3.0, gold = K.m('#b8923e', 0.3, 0.9), wood = K.m('#2a1a10', 0.5), cloth = K.m('#f4f1ea', 0.85), velvet = K.m('#5a1626', 0.9), silver = K.m('#d0d4da', 0.25, 0.9);
  // (the window's half-width: hosted, a wall of glass on the real circuit outside)
  const hw = E.host ? 3.1 : 1.5;
  shell(K, -4.5, -4, 4.5, 4, H, { floor: K.mt(parquet, 0.5), ceil: K.m('#e8e0cc', 0.9, 0, { emissive: '#3a3024' }), wall: K.mt(damask, 0.9) }, { n: [[-hw, hw, 0.55, 2.65]] }, { floor: 1.4, wall: 0.8 });
  const dado = (ax, c, a0, a1, ry, skip = []) => { let a = a0; for (const [b0, b1] of [...skip, [a1, a1]]) { if (b0 - a > 0.02) { const L = b0 - a, m = (a + b0) / 2; if (ax === 'x') { K.box(K.mt(panelT, 0.55), m, 0, c, L, 1.2, 0.03, 0, [L / 1.0, 1]); K.box(gold, m, 1.2, c, L, 0.03, 0.05); } else { K.box(K.mt(panelT, 0.55), c, 0, m, L, 1.2, 0.03, Math.PI / 2, [L / 1.0, 1]); K.box(gold, c, 1.2, m, 0.05, 0.03, L); } } a = b1; } };
  dado('x', -3.985, -4.5, 4.5, 0, [[-hw - 0.1, hw + 0.1]]); dado('x', 3.985, -4.5, 4.5, 0, [[1.9, 3.3]]); dado('z', -4.485, -4, 4); dado('z', 4.485, -4, 4);
  for (let x = -4.5; x <= 4.51; x += 1.5) K.box(wood, x, H - 0.2, 0, 0.14, 0.2, 8); for (let z = -4; z <= 4.01; z += 1.6) K.box(wood, 0, H - 0.2, z, 9, 0.2, 0.14);
  K.box(gold, 0, H - 0.12, -3.97, 9, 0.12, 0.06);
  // ---- the window on the river (hosted: on the circuit), curtains either side
  const view = E.host ? null : K.e('#ffffff', { map: K.t(ctex(1024, 512, (x, w, h) => { cityNight(x, w, h * 0.62, R, dusk); x.fillStyle = dusk ? '#2a2638' : '#0a0c16'; x.fillRect(0, h * 0.62, w, h); for (let i = 0; i < 260; i++) { const sx = R() * w; x.fillStyle = R() < 0.7 ? `rgba(255,200,130,${R() * 0.5})` : `rgba(180,210,255,${R() * 0.4})`; x.fillRect(sx, h * (0.63 + R() * 0.37), 2 + R() * 6, 1.5); } x.strokeStyle = 'rgba(30,30,40,1)'; x.lineWidth = 10; x.beginPath(); x.moveTo(0, h * 0.6); x.quadraticCurveTo(w / 2, h * 0.44, w, h * 0.6); x.stroke(); for (let i = 0; i <= 16; i++) { const u = i / 16, bx = u * w, by = h * 0.6 - Math.sin(u * Math.PI) * h * 0.115; x.fillStyle = '#ffe2a0'; x.beginPath(); x.arc(bx, by - 6, 3, 0, 7); x.fill(); } })), fixed: true });
  windowIn(K, { frame: K.m('#e8e0cc', 0.6), glass: K.glass('#b8d0e0', 0.08), view }, 0, -4, hw * 2, 0.55, 2.65, 0, { cols: E.host ? 4 : 2, rows: 3, thin: 0.035, d: 2.0, sill: true, vh: 2.0, vy: -0.55 });
  for (const s of [-1, 1]) { for (let i = 0; i < 6; i++) K.cyl(velvet, s * (hw + 0.18 + i * 0.075), 0.02, -3.88 + (i % 2) * 0.04, 0.055, 0.07, 2.88, 10); K.box(gold, s * (hw + 0.4), 1.15, -3.82, 0.5, 0.04, 0.04); }
  K.box(velvet, 0, 2.85, -3.86, hw * 2 + 1.2, 0.22, 0.14); K.box(gold, 0, 2.84, -3.79, hw * 2 + 1.2, 0.025, 0.02);
  // ---- the table, laid for dinner: the cloth, four places, two candles, roses; the chairs; the chandelier over it
  const T = { x: 0, z: -2.0 };
  K.cyl(cloth, T.x, 0.45, T.z, 0.6, 0.66, 0.31, 44, { open: true }); K.cyl(cloth, T.x, 0.755, T.z, 0.6, 0.6, 0.02, 44); K.disc(T.x, T.z, 0.66);
  const plate = [[0, 0], [0.12, 0], [0.135, 0.006], [0.14, 0.012], [0.128, 0.01], [0.09, 0.004], [0, 0.003]];
  for (const [dx, dz, ry] of [[0, -0.36, 0], [0, 0.36, 0], [0.36, 0, Math.PI / 2], [-0.36, 0, Math.PI / 2]]) {
    K.lathe(K.m('#fbfbf7', 0.28), T.x + dx, 0.776, T.z + dz, plate, 28);
    K.at(T.x + dx, T.z + dz, ry, () => { for (const s of [-1, 1]) K.box(silver, s * 0.17, 0.777, 0, 0.018, 0.004, 0.19); K.lathe(K.glass('#e8f4ff', 0.3), 0.12, 0.776, -0.16, [[0, 0], [0.03, 0], [0.032, 0.09], [0.0, 0.09]], 14); });
  }
  for (const dx of [-0.12, 0.12]) { K.lathe(silver, T.x + dx, 0.776, T.z, [[0, 0], [0.05, 0], [0.04, 0.012], [0.012, 0.03], [0.012, 0.11], [0.022, 0.12], [0, 0.122]], 14); K.cyl(K.m('#f2ead6', 0.6), T.x + dx, 0.896, T.z, 0.011, 0.011, 0.2, 8); flame(K, K.t(flameTex()), T.x + dx, 1.098, T.z, 0.025, 0.05, 2, 0.6); }
  K.lathe(K.glass('#dff0ff', 0.25), T.x + 0.3, 0.776, T.z - 0.08, [[0, 0], [0.03, 0], [0.04, 0.06], [0.025, 0.12], [0.026, 0.14], [0, 0.14]], 14);
  for (let i = 0; i < 5; i++) K.sph(K.m('#9e1022', 0.6), T.x + 0.3 + (R() - 0.5) * 0.06, 0.93 + R() * 0.05, T.z - 0.08 + (R() - 0.5) * 0.06, 0.022, 10, 8);
  K.pool('#ffb860', T.x, T.z, 1.6, 0.35, 0.78);
  const CM = { wood, seat: velvet, back: velvet };
  for (const [x, z, f] of [[0, -2.78, facing(0, 1)], [0, -1.22, facing(0, -1)], [0.8, -2.0, facing(-1, 0)], [-0.8, -2.0, facing(1, 0)]]) chair(K, CM, x, z, f, 0.48, 0.55);
  K.cyl(gold, 0, 2.5, T.z, 0.006, 0.006, H - 2.5, 4); K.add(gold, new THREE.TorusGeometry(0.42, 0.014, 6, 36), 0, 2.45, T.z, 0, Math.PI / 2);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2, cx = Math.cos(a) * 0.42, cz = T.z + Math.sin(a) * 0.42; K.cyl(gold, cx, 2.45, cz, 0.018, 0.012, 0.05, 8); K.sph(K.e('#ffdca0'), cx, 2.53, cz, 0.025, 8, 6, 1, 1.5, 1); K.add(K.glass('#ffffff', 0.4), new THREE.OctahedronGeometry(0.018), cx, 2.38, cz); }
  K.sph(K.e('#ffdca0'), 0, 2.45, T.z, 0.05, 10, 8);
  // ---- the sideboard (the old radio on it), a dresser of plates, paintings, sconces, the doors
  K.at(-4.25, 0.6, 0, () => {
    K.box(wood, 0, 0, 0, 0.45, 0.9, 1.8); K.box(K.m('#3a2416', 0.4), 0, 0.9, 0, 0.5, 0.04, 1.86); for (const z of [-0.6, 0, 0.6]) K.box(gold, 0.232, 0.5, z, 0.01, 0.02, 0.12);
    K.box(K.m('#6a4a2a', 0.45), 0, 0.94, -0.4, 0.28, 0.3, 0.46); K.box(K.e('#ffcf7a'), 0.142, 1.1, -0.4, 0.005, 0.06, 0.26); K.box(K.m('#2a2016', 0.9), 0.142, 0.98, -0.4, 0.005, 0.1, 0.36);
    K.lathe(K.glass('#e8f4ff', 0.3), 0.02, 0.94, 0.3, [[0, 0], [0.06, 0], [0.065, 0.12], [0.03, 0.2], [0.032, 0.26], [0, 0.26]], 16);
    K.lathe(silver, 0, 0.94, 0.68, [[0, 0], [0.06, 0], [0.012, 0.03], [0.012, 0.16], [0.14, 0.17], [0.14, 0.18], [0, 0.18]], 20);
    K.solid(-0.25, -0.92, 0.25, 0.92);
  });
  K.at(4.25, -1.5, Math.PI, () => {
    K.box(wood, 0, 0, 0, 0.45, 0.9, 1.6); K.box(wood, 0.08, 0.9, 0, 0.28, 1.4, 1.6); K.box(K.glass('#ffffff', 0.15), 0.23, 0.95, 0, 0.01, 1.3, 1.5);
    for (const y of [1.2, 1.65]) for (let k = 0; k < 4; k++) { const g = new THREE.CylinderGeometry(0.11, 0.11, 0.012, 20); g.rotateZ(Math.PI / 2); K.add(K.m('#f4f2ec', 0.3), g, 0.12, y + 0.12, -0.54 + k * 0.36); }
    K.solid(-0.25, -0.82, 0.3, 0.82);
  });
  const oil = (hue) => framed((x, w, h) => { vgrad(x, w, h, [[0, `hsl(${hue},35%,62%)`], [0.55, `hsl(${hue + 20},30%,78%)`], [0.56, `hsl(${hue + 60},30%,38%)`], [1, `hsl(${hue + 70},30%,24%)`]]); for (let i = 0; i < 400; i++) { x.fillStyle = `hsla(${hue + R() * 80},35%,${30 + R() * 40}%,.25)`; x.fillRect(R() * w, R() * h, 4 + R() * 10, 2 + R() * 5); } }, 256, 192, '#2a1a10');
  K.at(-4.48, -2.2, Math.PI / 2, () => { K.box(gold, 0, 1.45, 0.01, 1.12, 0.86, 0.04); K.plane(K.mt(K.t(oil(200)), 0.85), 0, 1.88, 0.035, 1.04, 0.78); });
  K.at(4.48, 1.8, -Math.PI / 2, () => { K.box(gold, 0, 1.45, 0.01, 1.12, 0.86, 0.04); K.plane(K.mt(K.t(oil(30)), 0.85), 0, 1.88, 0.035, 1.04, 0.78); });
  for (const [x, z, ry] of [[-4.47, 0.6, Math.PI / 2], [-4.47, -3.2, Math.PI / 2], [4.47, -3.2, -Math.PI / 2], [4.47, 0.4, -Math.PI / 2], [-2.6, 3.97, Math.PI]]) K.at(x, z, ry, () => { K.box(gold, 0, 1.75, 0.03, 0.06, 0.16, 0.06); K.lathe(K.m('#f2e6cc', 0.8), 0, 1.86, 0.11, [[0.02, 0.13], [0.06, 0.13], [0.08, 0], [0.001, 0.01]], 14); K.sph(K.e('#ffd8a0'), 0, 1.92, 0.11, 0.035, 8, 6); K.wash('#ffc888', 0, 1.95, 0.02, 1.4, 1.5, 0, 0.32); });
  for (const s of [-1, 1]) K.box(K.m('#3a2416', 0.45), 2.6 + s * 0.36, 0, 3.97, 0.7, 2.3, 0.06); K.box(gold, 2.6, 0, 3.94, 0.02, 2.3, 0.02); for (const s of [-1, 1]) K.box(gold, 2.6 + s * 0.08, 1.05, 3.92, 0.02, 0.18, 0.03);
  plant(K, { pot: K.m('#2a3a34', 0.5, 0.2), soil: K.m('#2b2118', 1), leaf: K.m('#2f5a36', 0.85) }, 3.8, 3.4, 1.5, R);
  K.area(-4.5, -4, 4.5, 4);
  K.hot({ id: 'waiter', kind: 'order', x: 3.3, y: 1.4, z: 2.5, reach: 2.4, label: 'Call the waiter over', sub: 'The menu, the water, dessert' });
  K.hot({ id: 'radio', kind: 'juke', x: -4.05, y: 1.05, z: 0.2, reach: 2.0, label: 'Retune the old radio' });
  K.hot({ id: 'window', kind: 'moment', x: 0, y: 1.6, z: -3.95, reach: 2.4, label: E.host ? 'Look out at the circuit' : 'Look out at the river', look: V3(0, 1, -40) });
  K.hot({ id: 'photo', kind: 'photo', x: -1.2, y: 1.4, z: -3.9, reach: 2.2, label: 'Take a photo by the window' });
  return {
    light: { hemi: ['#ffdcb0', '#2a1a12', 0.62], dir: ['#ffcc90', 0.6, [0.5, 3.5, 1.5]], exposure: 1.15, bg: '#08070a' }, lift: 0.06,
    moods: [{ name: 'Supper club', music: 'atmos1', hemi: 1, glow: 1 }, { name: 'Late night', music: 'atmos2', hemi: 0.8, glow: 1.1 }, { name: 'Low and slow', music: 'atmos3', hemi: 0.7, glow: 0.85 }, { name: 'Quiet', music: null, hemi: 0.95, glow: 0.95 }],
    start: { x: 2.6, z: 3.4, yaw: Math.atan2(-1, -0.45) },
    date: [K.spot(0, -2.78, facing(0, 1), 'sit', -0.04, { seat: 0 })],
    group: [K.spot(0, -2.78, facing(0, 1), 'sit', -0.04, { seat: 0 }), K.spot(0.8, -2.0, facing(-1, 0), 'sit', -0.04, { seat: 0 }), K.spot(-0.8, -2.0, facing(1, 0), 'sit', -0.04, { seat: 0 })],
    seats: [{ x: 0, z: -1.22, yaw: -Math.PI / 2, eye: 1.14 }],
    staff: { name: 'Luca', role: 'Waiter', x: 3.3, z: 2.55, face: facing(-1, -0.8), hot: 'waiter', look: { kit: 'blazer', color: '#111214', accent: '#f4f4f2', legs: '#111214', pose: 'talk', seed: 'restaurant-waiter' } },
    paps: [V3(4, 1.2, -18)], bed: 'room',
    moment: E.host ? ['Beyond the glass the circuit lies quiet, a long way from race day. The candles lean when the door opens behind you.', 'The track, the fences and the empty stands outside, and the warm room at your back.']
      : ['The river slides by below the window, the bridge lamps doubled in the water. The candles lean when the door opens behind you.', 'Lights along the far bank, a boat going by without a sound, and the warm room at your back.'],
    photoBack: E.host ? 'the window' : 'the river', where: E.host ? 'at the window' : undefined,
  };
}

/** an indoor karting hall: a twisting track between tyre walls, a start gantry, karts in the pit lane, a timing screen */
function karting(K, E) {
  const R = rng(606), RP = (a) => a[(R() * a.length) | 0];
  const asphT = K.t(ctex(512, 512, (x, w, h) => { x.fillStyle = '#34363b'; x.fillRect(0, 0, w, h); speck(x, w, h, R, 9000, ['#26282c', '#45484e', '#1e2023'], 2.2); }, [1, 1]));
  const epoxy = K.t(ctex(512, 512, (x, w, h) => { x.fillStyle = '#4a5363'; x.fillRect(0, 0, w, h); speck(x, w, h, R, 3000, ['#3e4656', '#59627a'], 3); }, [1, 1]));
  const corr = K.t(ctex(256, 256, (x, w, h) => { for (let i = 0; i < 16; i++) { const g = x.createLinearGradient(i * 16, 0, i * 16 + 16, 0); g.addColorStop(0, '#2a3854'); g.addColorStop(0.5, '#43567c'); g.addColorStop(1, '#2a3854'); x.fillStyle = g; x.fillRect(i * 16, 0, 16, h); } }, [1, 1]));
  const tyreT = K.t(ctex(512, 128, (x, w, h) => { x.fillStyle = '#0c0c0d'; x.fillRect(0, 0, w, h); for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) { const cx = i * 64 + 32, cy = r * 64 + 32, band = (i + r) % 4 === 0; x.fillStyle = band ? (r ? '#e8e8ea' : '#c8102e') : '#1b1b1d'; x.beginPath(); x.ellipse(cx, cy, 31, 30, 0, 0, 7); x.fill(); x.fillStyle = '#060606'; x.beginPath(); x.ellipse(cx, cy, 16, 15, 0, 0, 7); x.fill(); x.strokeStyle = 'rgba(255,255,255,.12)'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, 24, 3.6, 5.2); x.stroke(); } }, [1, 1]));
  const kerbT = K.t(ctex(64, 128, (x, w, h) => { for (let j = 0; j < 4; j++) { x.fillStyle = j % 2 ? '#f2f2f2' : '#c8102e'; x.fillRect(0, j * 32, w, 32); } }, [1, 1]));
  const H = 8, hall = { x0: -22.5, z0: -16.2, x1: 22.5, z1: 11.5 };
  // (hosted: three high windows over the walk-in side, on the real world outside)
  const HI = E.host ? [[-18, -12], [-4, 4], [12, 18]].map(([a, b]) => [a, b, 5.4, 7.0]) : [];
  shell(K, hall.x0, hall.z0, hall.x1, hall.z1, H, { floor: K.mt(epoxy, 0.6), ceil: K.m('#1c222e', 0.9, 0, { emissive: '#10141c' }), wall: K.mt(corr, 0.7, 0.3, { emissive: '#0c1220' }) }, { s: HI }, { floor: 4, wall: 3 });
  for (const [a, b, y0, y1] of HI) windowIn(K, { frame: K.m('#3a3f48', 0.5, 0.6), glass: K.glass('#cfe2ff', 0.08) }, (a + b) / 2, hall.z1, b - a, y0, y1, Math.PI, { cols: 3, rows: 1 });
  // ---- the track: a closed loop sampled every 25 cm (x, z, tangent, curvature, distance), its asphalt, kerbs and tyre walls
  const CP = [[-14, 3], [0, 3], [12, 3], [16.8, 1.6], [18.4, -2.5], [18.2, -8.5], [16, -11.8], [11, -12.8], [5, -12.6], [1.4, -10.6], [0, -7.6], [-3, -6], [-6.4, -7.2], [-9.5, -10.6], [-13.5, -12], [-17.2, -10], [-18.4, -5], [-18, -0.6], [-16.6, 2.2]];
  const curve = new THREE.CatmullRomCurve3(CP.map(([x, z]) => V3(x, 0, z)), true, 'centripetal'), L = curve.getLength(), N = Math.round(L / 0.25), hw = 2.6;
  const pts = curve.getSpacedPoints(N), S = new Float32Array(N * 6), ds = L / N;
  for (let i = 0; i < N; i++) {
    const p = pts[i], a = pts[(i + 1) % N], b = pts[(i - 1 + N) % N], tx = a.x - b.x, tz = a.z - b.z, tl = Math.hypot(tx, tz) || 1;
    const k = wrap(Math.atan2(a.z - p.z, a.x - p.x) - Math.atan2(p.z - b.z, p.x - b.x)) / ds;
    S.set([p.x, p.z, tx / tl, tz / tl, k, i * ds], i * 6);
  }
  for (let pass = 0; pass < 3; pass++) for (let i = 0; i < N; i++) S[i * 6 + 4] = (S[((i - 1 + N) % N) * 6 + 4] + S[i * 6 + 4] * 2 + S[((i + 1) % N) * 6 + 4]) / 4;
  /** a strip along the loop from offset o0 to o1 (left of the direction of travel positive), at height y (or a wall from y0 to y1), its v by distance */
  const strip = (o0, o1, y0, y1, vScale, sel = null, along = false) => {
    const P = [], U = [], I = []; let n = 0;
    for (let j = 0; j <= N; j++) {
      const i = j % N, x = S[i * 6], z = S[i * 6 + 1], nx = -S[i * 6 + 3], nz = S[i * 6 + 2], s = j * ds;
      P.push(x + nx * o0, y0, z + nz * o0, x + nx * o1, y1, z + nz * o1); if (along) U.push(s / vScale, 0, s / vScale, 1); else U.push(0, s / vScale, 1, s / vScale);
      if (j > 0 && (!sel || sel(i))) I.push(n - 2, n, n - 1, n - 1, n, n + 1); n += 2;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); g.setIndex(I); g.computeVertexNormals(); return g;
  };
  K.add(K.mt(asphT, 0.85), strip(hw, -hw, 0.012, 0.012, 5));
  const kerbAt = (i, side) => Math.sign(S[i * 6 + 4]) === side && Math.abs(S[i * 6 + 4]) > 0.07;
  K.add(K.mt(kerbT, 0.6), strip(hw, hw - 0.5, 0.02, 0.02, 1.0, (i) => kerbAt(i, 1))); K.add(K.mt(kerbT, 0.6), strip(-hw + 0.5, -hw, 0.02, 0.02, 1.0, (i) => kerbAt(i, -1)));
  K.add(K.mt(K.t(ctex(64, 64, (x, w, h) => { x.fillStyle = '#f2f2f2'; x.fillRect(0, 0, w, h); }), [1, 1]), 0.6), strip(hw - 0.06, hw - 0.14, 0.016, 0.016, 2)); K.add(K.mt(K.t(ctex(64, 64, (x, w, h) => { x.fillStyle = '#f2f2f2'; x.fillRect(0, 0, w, h); }), [1, 1]), 0.6), strip(-hw + 0.14, -hw + 0.06, 0.016, 0.016, 2));
  const tyreM = K.m('#ffffff', 0.85, 0, { map: tyreT, side: THREE.DoubleSide });
  K.add(tyreM, strip(hw + 0.35, hw + 0.35, 0, 0.56, 4, null, true)); K.add(tyreM, strip(-hw - 0.35, -hw - 0.35, 0, 0.56, 4, null, true));
  K.add(K.m('#111113', 0.9), strip(hw + 0.55, hw + 0.15, 0.56, 0.56, 4)); K.add(K.m('#111113', 0.9), strip(-hw - 0.15, -hw - 0.55, 0.56, 0.56, 4));
  // (the start line, two grid boxes behind it, the gantry and its five lights: the loop starts on the main straight, 10 m before the line)
  const si = Math.round((-4 - S[0]) / ds), sx = S[si * 6], sz = S[si * 6 + 1];
  const chq = K.mt(K.t(ctex(32, 256, (x) => { for (let i = 0; i < 2; i++) for (let j = 0; j < 16; j++) { x.fillStyle = (i + j) % 2 ? '#111' : '#f2f2f2'; x.fillRect(i * 16, j * 16, 16, 16); } })), 0.6);
  K.plane(chq, sx, 0.018, sz, 0.5, hw * 2, 0, true);
  const white = K.m('#f2f2f2', 0.6);
  for (const [dx, dz] of [[-2.2, 1.1], [-4.4, -1.1]]) { const gx = sx + dx, gz = sz + dz; K.box(white, gx, 0.012, gz - 0.5, 1.6, 0.006, 0.06); K.box(white, gx, 0.012, gz + 0.5, 1.6, 0.006, 0.06); K.box(white, gx + 0.78, 0.012, gz, 0.06, 0.006, 1.0); }
  const steel = K.m('#9aa1aa', 0.35, 0.8), blk = K.m('#15161a', 0.6, 0.2), lights = [];
  for (const s of [-1, 1]) K.box(steel, sx, 0, sz + s * (hw + 0.6), 0.2, 3.3, 0.2);
  K.box(blk, sx, 3.0, sz, 0.3, 0.5, hw * 2 + 1.4); K.plane(K.e('#ffffff', { map: K.t(ctex(512, 64, (x, w, h) => { x.fillStyle = '#c8102e'; x.fillRect(0, 0, w, h); words(x, 'REDLINE  ·  START / FINISH', w / 2, h / 2, "italic 900 34px 'Segoe UI', Arial", '#fff'); })), fixed: true }), sx - 0.16, 3.25, sz, hw * 2 + 1.2, 0.26, -Math.PI / 2);
  for (let i = 0; i < 5; i++) { const m = new THREE.MeshBasicMaterial({ color: '#2a0806', toneMapped: false }), l = K.obj(new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), m)); l.position.set(sx - 0.18, 2.88, sz - 1.2 + i * 0.6); lights.push(m); }
  // ---- the hall: trusses, high-bay lights, the pit wall, the walk-in side (timing screen, helmets, drinks, podium, karts)
  for (let z = -14; z <= 10; z += 6) { K.box(K.m('#3a3f48', 0.5, 0.6), 0, 7.0, z, 45, 0.25, 0.25); K.box(K.m('#3a3f48', 0.5, 0.6), 0, 7.6, z, 45, 0.12, 0.12); }
  for (let z = -13; z <= 9; z += 6) for (let x = -18; x <= 18; x += 6) { K.cyl(K.m('#22262e', 0.5, 0.5), x, 6.75, z, 0.32, 0.38, 0.25, 16); K.cyl(K.e('#f4f8ff'), x, 6.74, z, 0.3, 0.3, 0.01, 16); K.pool('#e8f0ff', x, z, 3.4, 0.2, 0.03); }
  K.box(K.m('#8a9098', 0.8), 0, 0, 6.2, 45, 1.0, 0.3); K.plane(K.glass('#cfe2ff', 0.1), 0, 1.3, 6.2, 45, 0.6); for (let x = -21; x <= 21; x += 3) K.box(steel, x, 1.0, 6.2, 0.05, 0.62, 0.05);
  K.solid(hall.x0, 5.95, hall.x1, 6.45);
  K.floor(K.m('#3a414c', 0.7), hall.x0, 6.35, hall.x1, hall.z1, 3, 0.004);
  const banner = (text, sub, col) => K.t(ctex(1024, 192, (x, w, h) => { x.fillStyle = col; x.fillRect(0, 0, w, h); words(x, text, w / 2, h * 0.42, "italic 900 92px 'Segoe UI', Arial", '#ffffff'); words(x, sub, w / 2, h * 0.82, "700 26px 'Segoe UI', Arial", 'rgba(255,255,255,.8)'); }));
  K.plane(K.mt(banner('REDLINE', 'INDOOR KARTING', '#c8102e'), 0.8), 0, 5.0, hall.z0 + 0.03, 12, 2.25);
  K.plane(K.mt(banner('HELMETS ON', 'VISORS DOWN  ·  NO BUMPING', '#1b2a4a'), 0.8), hall.x0 + 0.03, 4.6, -6, 10, 1.9, Math.PI / 2);
  K.plane(K.mt(banner('SAFETY FIRST', 'WATCH THE MARSHALS  ·  BLUE FLAG: LET THEM BY', '#1b2a4a'), 0.8), hall.x1 - 0.03, 4.6, -6, 10, 1.9, -Math.PI / 2);
  const tscr = screen(K, 768, 352, 0, 3.7, hall.z1 - 0.04, 4.6, 2.1, Math.PI); K.box(blk, 0, 2.6, hall.z1 - 0.06, 4.8, 2.3, 0.04);
  K.at(-15.5, hall.z1 - 0.22, Math.PI, () => {
    K.box(blk, 0, 0, 0, 2.6, 1.9, 0.4); for (const y of [0.5, 1.05, 1.6]) K.box(steel, 0, y, -0.02, 2.5, 0.03, 0.36);
    for (const [, y] of [[0, 0.53], [1, 1.08], [2, 1.63]]) for (let i = 0; i < 6; i++) { const c = RP(['#c8102e', '#1f4fa8', '#f2f2f2', '#f0b020', '#2e9e5a', '#1a1a1a', '#ff6a00']); K.sph(K.m(c, 0.35, 0.1), -1.05 + i * 0.42, y + 0.15, 0, 0.14, 14, 10, 1, 0.95, 1); K.sph(K.m('#0a0c10', 0.1, 0.6), -1.05 + i * 0.42, y + 0.16, 0.07, 0.12, 12, 8, 0.9, 0.45, 0.5); }
    K.solid(-1.35, -0.3, 1.35, 0.3);
  });
  K.at(14, hall.z1 - 0.9, Math.PI / 2, () => {
    K.box(K.m('#f2f2f2', 0.5), 0, 0, 0, 0.6, 1.05, 3.0); K.box(K.m('#c8102e', 0.5), 0.31, 0.2, 0, 0.01, 0.12, 2.9); K.box(blk, 0, 1.05, 0, 0.66, 0.04, 3.06);
    K.box(blk, -0.7, 0, 1.1, 0.6, 1.9, 0.75); K.box(K.e('#dff3ff'), -0.39, 0.12, 1.1, 0.01, 1.6, 0.6); K.box(K.m('#b8bdc4', 0.3, 0.85), 0.0, 1.09, -0.9, 0.4, 0.38, 0.36);
    K.solid(-1.05, -1.55, 0.35, 1.55);
  });
  K.at(7, 9.8, Math.PI / 2, () => {
    const pm = K.m('#f2f2f2', 0.5), num = (n) => K.mt(K.t(ctex(64, 64, (x, w, h) => { x.fillStyle = '#c8102e'; x.fillRect(0, 0, w, h); words(x, String(n), w / 2, h / 2, "900 46px 'Segoe UI', Arial", '#fff'); })), 0.6);
    for (const [n, z, hh] of [[1, 0, 0.5], [2, -0.9, 0.35], [3, 0.9, 0.25]]) { K.box(pm, 0, 0, z, 0.8, hh, 0.88); K.plane(num(n), 0.41, hh / 2, z, 0.3, 0.3, Math.PI / 2); }
    K.solid(-0.4, -1.35, 0.4, 1.35);
  });
  for (const [x, z] of [[17.2, 8.2], [19.8, 8.4]]) { roundTable(K, { top: K.m('#f2f2f2', 0.4), leg: steel }, x, z, 0.38, 0.74); for (const s of [-1, 1]) chair(K, { wood: steel, seat: K.m('#c8102e', 0.6) }, x + s * 0.65, z, s < 0 ? 0 : Math.PI, 0.46, 0.45); }
  K.at(-19.2, 8.6, 0, () => { K.box(blk, 0, 0, 0, 0.7, 1.0, 1.4); K.box(K.m('#2a2e36', 0.4), 0.05, 1.0, 0, 0.5, 0.04, 1.2); K.box(K.e('#47ff9a'), 0.1, 1.045, -0.2, 0.25, 0.004, 0.4); K.cyl(blk, -0.1, 1.04, 0.4, 0.008, 0.008, 0.3, 6); K.sph(blk, -0.1, 1.36, 0.4, 0.025, 8, 6); K.solid(-0.4, -0.75, 0.4, 0.75); });
  // ---- the karts parked in the pit lane (merged), and the two race karts (the game's)
  const kc = ['#c8102e', '#1f4fa8', '#f0b020', '#2e9e5a'];
  for (let i = 0; i < 4; i++) K.at(-10.4 + i * 1.9, 8.1, Math.PI / 2, () => kartParts((k, g) => K.add(k === 'body' ? K.m(kc[i], 0.45) : k === 'tyre' ? K.m('#141414', 0.9) : k === 'seat' ? K.m('#1a1a1a', 0.7) : K.m('#2a2c30', 0.5, 0.5), g)));
  for (let i = 0; i < 4; i++) K.solid(-11.0 + i * 1.9, 7.25, -9.8 + i * 1.9, 8.95);
  K.area(hall.x0 + 0.3, 6.6, hall.x1 - 0.3, hall.z1 - 0.3);
  K.hot({ id: 'karts', kind: 'game', game: 'karting', x: -7.5, y: 0.6, z: 8.1, reach: 3.2, label: 'Race {opp}: three laps', sub: 'A and D to steer, S to brake. The throttle is yours to forget.' });
  K.hot({ id: 'helmets', kind: 'helmet', x: -15.5, y: 1.2, z: hall.z1 - 0.4, reach: 2.4, label: 'Pick a helmet' });
  K.hot({ id: 'drinks', kind: 'order', x: 14, y: 1.1, z: hall.z1 - 1.3, reach: 2.2, label: 'Get something from the counter' });
  K.hot({ id: 'pa', kind: 'juke', x: -18.9, y: 1.1, z: 8.6, reach: 2.2, label: 'Ask for different music on the PA' });
  K.hot({ id: 'podium', kind: 'photo', x: 7, y: 0.8, z: 9.8, reach: 2.6, label: 'Take a photo on the podium' });
  K.hot({ id: 'times', kind: 'board', x: 0, y: 3.6, z: hall.z1 - 0.1, reach: 5.0, label: 'Check the times' });
  return {
    light: { hemi: ['#e6ecf5', '#2a2e36', 1.0], dir: ['#ffffff', 0.75, [3, 12, 4]], exposure: 1.0, bg: '#0b0d12' }, lift: 0.02,
    moods: [{ name: 'Race day', music: 'atmos1', hemi: 1, glow: 1 }, { name: 'Late session', music: 'atmos2', hemi: 0.8, glow: 1.1 }, { name: 'Low and slow', music: 'atmos3', hemi: 0.72, glow: 0.85 }, { name: 'Quiet', music: null, hemi: 0.95, glow: 0.95 }],
    start: { x: 12, z: 9.6, yaw: Math.atan2(-0.35, -1) },
    date: [K.spot(-0.6, 6.95, facing(0.8, 0.6))],
    group: [K.spot(-0.6, 6.95, facing(0.8, 0.6)), K.spot(0.8, 7.7, facing(-0.4, -1)), K.spot(-1.9, 7.9, facing(0.9, -0.3))],
    seats: [], staff: { name: 'Mo', role: 'Marshal', x: 3.2, z: 6.8, face: facing(0, -1), hot: null, look: { kit: 'marshal', color: '#f2661b', accent: '#e8e8e8', pose: 'hips', seed: 'karting-marshal' } },
    paps: [V3(22.2, 1.8, 10.3)], bed: 'hall',
    track: { S, N, L, hw, ds, si, lights, scr: tscr, grid: [[sx - 2.2 + 0.4, sz + 1.1], [sx - 4.4 + 0.4, sz - 1.1]] },
    photoBack: 'the podium',
  };
}
/** a kart's parts into add(kind, geometry): the floor tray, side pods, nose and rear bumper, the seat, wheel and engine, four tyres (forward: +x) */
function kartParts(add) {
  const B = (k, w, h, d, x, y, z, rz = 0) => { const g = new THREE.BoxGeometry(w, h, d); if (rz) g.rotateZ(rz); g.translate(x, y, z); add(k, g); };
  B('frame', 1.45, 0.035, 0.7, 0, 0.07, 0); B('frame', 0.05, 0.05, 1.12, 0.48, 0.1, 0); B('frame', 0.05, 0.05, 1.12, -0.6, 0.1, 0);
  for (const s of [-1, 1]) B('body', 0.62, 0.17, 0.13, -0.04, 0.1, s * 0.5);
  B('body', 0.34, 0.2, 0.92, 0.82, 0.08, 0); B('body', 0.5, 0.08, 0.5, 0.58, 0.12, 0, -0.25); B('frame', 0.12, 0.14, 1.18, -0.86, 0.08, 0);
  B('seat', 0.4, 0.1, 0.38, -0.24, 0.08, 0); B('seat', 0.08, 0.42, 0.38, -0.44, 0.12, 0, 0.25);
  const col = new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6); col.rotateZ(-1.0); col.translate(0.32, 0.3, 0); add('frame', col);
  const wh = new THREE.TorusGeometry(0.13, 0.014, 6, 18); wh.rotateY(Math.PI / 2); wh.rotateZ(-0.5); wh.translate(0.12, 0.44, 0); add('seat', wh);
  B('frame', 0.3, 0.26, 0.24, -0.56, 0.1, -0.3); const ex = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8); ex.rotateZ(Math.PI / 2); ex.translate(-0.72, 0.22, -0.3); add('frame', ex);
  for (const [x, r, w] of [[0.56, 0.135, 0.13], [-0.62, 0.15, 0.2]]) for (const s of [-1, 1]) { const t = new THREE.CylinderGeometry(r, r, w, 16); t.rotateX(Math.PI / 2); t.translate(x, r, s * 0.56); add('tyre', t); const hb = new THREE.CylinderGeometry(r * 0.55, r * 0.55, w + 0.01, 10); hb.rotateX(Math.PI / 2); hb.translate(x, r, s * 0.56); add('frame', hb); }
}
/** a race kart, with its driver in a helmet (col: the kart, hel: the helmet, suit) -> { group, set(steer) } (forward +x) */
function raceKart(col, hel, suit) {
  const g = new THREE.Group(), P = { body: [], frame: [], seat: [], tyre: [] };
  kartParts((k, q) => P[k].push(q));
  const M = { body: new THREE.MeshStandardMaterial({ color: col, roughness: 0.45 }), frame: new THREE.MeshStandardMaterial({ color: '#2a2c30', roughness: 0.5, metalness: 0.5 }), seat: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.7 }), tyre: new THREE.MeshStandardMaterial({ color: '#141414', roughness: 0.9 }) };
  for (const k in P) g.add(new THREE.Mesh(mergeGeometries(P[k].map(norm)), M[k]));
  const D = [], cap = (a, b, r) => { const d = new THREE.Vector3().subVectors(b, a), q = new THREE.CapsuleGeometry(r, Math.max(0.01, d.length() - 2 * r), 4, 10); q.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), d.clone().normalize())); const m = a.clone().add(b).multiplyScalar(0.5); q.translate(m.x, m.y, m.z); return q; };
  D.push(cap(V3(-0.28, 0.2, 0), V3(-0.2, 0.62, 0), 0.15), cap(V3(-0.12, 0.62, -0.17), V3(0.1, 0.44, -0.13), 0.045), cap(V3(-0.12, 0.62, 0.17), V3(0.1, 0.44, 0.13), 0.045), cap(V3(-0.2, 0.22, -0.1), V3(0.55, 0.2, -0.1), 0.06), cap(V3(-0.2, 0.22, 0.1), V3(0.55, 0.2, 0.1), 0.06));
  g.add(new THREE.Mesh(mergeGeometries(D.map(norm)), new THREE.MeshStandardMaterial({ color: suit, roughness: 0.6 })));
  const hm = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 12), new THREE.MeshStandardMaterial({ color: hel, roughness: 0.3, metalness: 0.1 })); hm.position.set(-0.16, 0.82, 0); hm.scale.set(1.05, 1, 0.95); g.add(hm);
  const vz = new THREE.Mesh(new THREE.SphereGeometry(0.152, 16, 8, -0.9, 1.8, Math.PI * 0.36, Math.PI * 0.2), new THREE.MeshStandardMaterial({ color: '#0c0e12', roughness: 0.1, metalness: 0.6 })); vz.position.copy(hm.position); vz.scale.copy(hm.scale); vz.rotation.y = Math.PI; g.add(vz);
  return { group: g, mats: M };
}

/** a corner café on a wet evening: a counter and its espresso machine, little tables, a big window on the street (the grave week's quiet coffee) */
function coffee(K, E) {
  const R = rng(707), RP = (a) => a[(R() * a.length) | 0], hosted = !!E.host, wet = !hosted || !!E.hx?.wet;
  const hex = K.t(ctex(256, 256, (x, w, h) => { x.fillStyle = '#d8d2c6'; x.fillRect(0, 0, w, h); for (let j = 0; j < 10; j++) for (let i = 0; i < 10; i++) { const cx = i * 28 + (j % 2) * 14, cy = j * 24; x.fillStyle = RP(['#efeae0', '#e6e0d4', '#f4f0e8', '#3a3a3c']); x.beginPath(); for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 + Math.PI / 6; x.lineTo(cx + Math.cos(a) * 13, cy + Math.sin(a) * 13); } x.fill(); } }, [1, 1]));
  const H = 3.0, wood = K.m('#6a4a32', 0.55), dark = K.m('#2a2622', 0.6), steel = K.m('#c0c4ca', 0.25, 0.9), green = K.m('#2f4a3c', 0.7);
  shell(K, -4.5, -3.5, 4.5, 3.5, H, { floor: K.mt(hex, 0.6), ceil: K.m('#e9e4da', 0.95, 0, { emissive: '#4a453e' }), wall: K.m('#e8e1d2', 0.92) }, { n: [[-3.6, 1.8, 0.7, 2.6]] }, { floor: 1.2 });
  K.box(green, 0, 0, -3.48, 9, 0.7, 0.04); K.box(green, -4.48, 0, 0, 0.04, 1.1, 7); K.box(green, 4.48, 0, 0, 0.04, 1.1, 7);
  // (hosted: the real street outside the big window; rain on the glass only if it rains)
  const view = hosted ? null : K.e('#ffffff', { map: K.t(ctex(1024, 512, (x, w, h) => villageDusk(x, w, h, R))), fixed: true }), rainT = K.t(ctex(256, 256, (x, w, h) => rainStreaks(x, w, h, R), [1, 1]));
  windowIn(K, { frame: dark, glass: K.glass('#b8ccd8', 0.08), rain: wet ? K.e('#dfe9ff', { map: rainT, opacity: 0.4, depthWrite: false, fixed: true }) : null, view }, -0.9, -3.5, 5.4, 0.7, 2.6, 0, { cols: 3, rows: 1, d: 1.8 });
  K.anim((t) => { rainT.offset.y = t * 0.2; });
  K.box(wood, -0.9, 0.6, -3.3, 5.6, 0.05, 0.36);
  K.at(3.6, 0.2, Math.PI, () => {
    // (the frame faces into the room: the counter in front, the barista's gap, the shelves against the wall)
    K.box(wood, 0.1, 0, 0, 0.55, 1.0, 3.2); K.box(K.m('#f2efe8', 0.3), 0.1, 1.0, 0, 0.64, 0.04, 3.3);
    K.box(steel, 0.12, 1.04, -0.6, 0.42, 0.42, 0.7); K.box(K.m('#c8102e', 0.4), 0.335, 1.15, -0.6, 0.01, 0.12, 0.6); for (const z of [-0.8, -0.4]) K.cyl(steel, 0.32, 1.1, z, 0.03, 0.035, 0.08, 10);
    K.box(K.glass('#ffffff', 0.25), 0.1, 1.04, 0.7, 0.5, 0.36, 1.2); for (let i = 0; i < 6; i++) K.cyl(K.m(RP(['#d8a050', '#f0e0b0', '#8a5030', '#e8c060']), 0.8), 0.1, 1.06, 0.25 + i * 0.18, 0.06, 0.06, 0.05, 12);
    K.box(dark, -0.75, 0, 0, 0.3, 2.6, 3.2); for (const y of [1.3, 1.7, 2.1]) { K.box(wood, -0.58, y, 0, 0.12, 0.03, 3.0); for (let i = 0; i < 9; i++) K.cyl(K.m('#f4f2ec', 0.4), -0.58, y + 0.03, -1.3 + i * 0.32, 0.04, 0.035, 0.08, 10); }
    K.plane(K.mt(K.t(ctex(512, 256, (x, w, h) => chalk(x, w, h, R, ['Flat white · latte · espresso', 'Tea · hot chocolate', 'Lemon cake · cinnamon buns'], 'THE CORNER CAFÉ'))), 0.9), -0.59, 2.45, 0, 2.0, 0.9, Math.PI / 2);
    K.solid(-0.9, -1.65, 0.4, 1.65);
  });
  const TM = { top: K.m('#efeae0', 0.4), leg: dark }, CM = { wood: dark, seat: K.m('#8a5a3a', 0.7) };
  for (const [x, z] of [[-2.6, -1.7], [0.3, -1.7], [-2.6, 1.3], [0.6, 1.4]]) { roundTable(K, TM, x, z, 0.36, 0.74); chair(K, CM, x, z - 0.62, facing(0, 1), 0.46); chair(K, CM, x, z + 0.62, facing(0, -1), 0.46); pendant(K, { cord: dark, shade: K.m('#2f4a3c', 0.5) }, x, z, H, 1.75, 0.12, '#ffe2b0', 0.74, 0.22); K.lathe(K.m('#f4f2ec', 0.4), x + 0.1, 0.74, z, [[0, 0], [0.04, 0], [0.045, 0.08], [0, 0.08]], 12); }
  const PM = { pot: K.m('#c06a40', 0.7), soil: K.m('#2b2118', 1), leaf: K.m('#2f6a3a', 0.85), leaf2: K.m('#3f7a44', 0.85) };
  plant(K, PM, -4.0, -3.0, 1.2, R); plant(K, PM, 2.6, -3.0, 1.0, R); plant(K, PM, -4.0, 3.0, 1.3, R);
  K.box(dark, 1.5, 0, 3.47, 1.1, 2.2, 0.05); K.box(K.glass('#ffe8c0', 0.3), 1.5, 1.2, 3.44, 0.7, 0.8, 0.01);
  K.area(-4.5, -3.5, 4.5, 3.5);
  K.hot({ id: 'counter', kind: 'order', x: 3.0, y: 1.1, z: 0.2, reach: 2.0, label: 'Order at the counter' });
  K.hot({ id: 'window', kind: 'moment', x: -0.9, y: 1.6, z: -3.45, reach: 2.4, label: wet ? 'Watch the rain for a while' : 'Look out of the window for a while', look: V3(-0.9, 1.4, -20) });
  return {
    light: { hemi: ['#ffe6c8', '#3a3028', 0.95], dir: ['#c8d4e8', 0.45, [-1, 4, -6]], exposure: 1.02, bg: '#14161c' }, lift: 0.03,
    moods: [{ name: 'Quiet', music: null, hemi: 1, glow: 1 }, { name: 'Something soft', music: 'atmos3', hemi: 0.9, glow: 0.95 }],
    start: { x: 1.5, z: 2.9, yaw: Math.atan2(-1, -0.6) },
    date: [K.spot(-2.6, -2.32, facing(0, 1), 'sit', -0.06, { seat: 0 })],
    group: [K.spot(-2.6, -2.32, facing(0, 1), 'sit', -0.06, { seat: 0 }), K.spot(0.3, -2.32, facing(0, 1), 'sit', -0.06), K.spot(0.3, -1.08, facing(0, -1), 'sit', -0.06)],
    seats: [{ x: -2.6, z: -1.08, yaw: -Math.PI / 2, eye: 1.13 }],
    staff: { name: 'Ana', role: 'Barista', x: 4.0, z: 0.2, face: facing(-1, 0), hot: 'counter', look: { kit: 'casual', color: '#2f4a3c', accent: '#e8e2d4', legs: '#2a2d33', pose: 'talk', seed: 'cafe-barista' } },
    paps: [], bed: wet ? 'rain' : 'room', where: wet ? 'watching the rain' : 'at the window',
    moment: !hosted ? ['Rain on the window, the street lamps blurred in it. Neither of you needs to say anything for a while.', 'The café hums quietly behind you. Outside, people hurry past under umbrellas.']
      : wet ? ['Rain on the window, the lights outside blurred in it. Neither of you needs to say anything for a while.', 'The café hums quietly behind you. Outside, the rain keeps on.']
        : ['The evening outside the window, going on without you. Neither of you needs to say anything for a while.', 'The café hums quietly behind you, and the world outside is quiet too.'],
    photoBack: '',
  };
}
// =====================================================================================================================
// the sound of the room: the game's own WebAudio, on the recorded-sound bus (nothing at all if there is no sound)
// =====================================================================================================================
class Sound {
  constructor(A) {
    this.A = A && A.ready && A.ctx ? A : null; this.loops = []; this.eng = null;
    if (!this.A) return;
    const x = this.x = A.ctx; this.out = x.createGain(); this.out.gain.value = A.muted ? 0 : 0.9; this.out.connect(A.sfx || x.destination);
  }
  get on() { return !!this.A && !this.A.muted; }
  _nb() { if (this.nbuf) return this.nbuf; const x = this.x, n = x.sampleRate * 2, b = x.createBuffer(1, n, x.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return (this.nbuf = b); }
  /** a loop of filtered noise (the air of a room: rain on glass, a city below, an air-conditioner) -> its gain */
  bed(type, f, q, gain) {
    if (!this.A) return null;
    const x = this.x, s = x.createBufferSource(), fl = x.createBiquadFilter(), g = x.createGain(); s.buffer = this._nb(); s.loop = true; fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    g.gain.value = 0; g.gain.setTargetAtTime(gain, x.currentTime, 1.2); s.connect(fl); fl.connect(g); g.connect(this.out); s.start(); this.loops.push({ s, g }); return g;
  }
  /** a tone: f Hz for dur s (gliding to f2), its attack quick and its tail exponential */
  tone(f, dur, vol = 0.08, type = 'sine', at = 0, f2 = 0) {
    if (!this.on) return;
    const x = this.x, t = x.currentTime + at, o = x.createOscillator(), g = x.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(this.out); o.start(t); o.stop(t + dur + 0.02);
  }
  /** a burst of filtered noise: a click, a clack, a thunk */
  hit(f, dur, vol = 0.1, q = 1.5, at = 0, type = 'bandpass') {
    if (!this.on) return;
    const x = this.x, t = x.currentTime + at, s = x.createBufferSource(), fl = x.createBiquadFilter(), g = x.createGain(); s.buffer = this._nb(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(fl); fl.connect(g); g.connect(this.out); s.start(t, Math.random()); s.stop(t + dur + 0.02);
  }
  clink() { this.tone(2650, 0.35, 0.05); this.tone(3900, 0.25, 0.03, 'sine', 0.01); this.tone(2700, 0.3, 0.04, 'sine', 0.09); }
  clack(k = 1) { this.hit(2600, 0.05, 0.12 * k, 2.5); this.tone(1900, 0.04, 0.03 * k, 'triangle'); }
  thunk() { this.hit(380, 0.09, 0.18, 1.2); }
  shutter() { this.hit(3200, 0.03, 0.12, 1, 0, 'highpass'); this.hit(2400, 0.04, 0.1, 1, 0.07, 'highpass'); }
  buzz() { for (let i = 0; i < 3; i++) this.tone(150, 0.16, 0.05, 'square', i * 0.22); }
  pop(up = true) { this.tone(up ? 660 : 440, 0.09, 0.04, 'sine', 0, up ? 990 : 330); }
  /** a kart's engine: two detuned saws and a growl through a low-pass -> { set(rpm 0..1, load 0..1), stop() } */
  engine(vol = 0.045) {
    if (!this.A) return { set() {}, stop() {} };
    const x = this.x, f = x.createBiquadFilter(), g = x.createGain(), o1 = x.createOscillator(), o2 = x.createOscillator(); f.type = 'lowpass'; f.Q.value = 3; f.frequency.value = 600; g.gain.value = 0;
    o1.type = 'sawtooth'; o2.type = 'sawtooth'; o2.detune.value = 14; o1.connect(f); o2.connect(f); f.connect(g); g.connect(this.out); o1.start(); o2.start();
    const E = { set: (rpm, load) => { if (E.dead) return; const t = x.currentTime, hz = 55 + rpm * 150; o1.frequency.setTargetAtTime(hz, t, 0.05); o2.frequency.setTargetAtTime(hz * 1.5, t, 0.05); f.frequency.setTargetAtTime(500 + rpm * 1800 + load * 600, t, 0.08); g.gain.setTargetAtTime(this.on ? vol * (0.45 + 0.55 * load) : 0, t, 0.08); },
      stop: () => { if (E.dead) return; E.dead = true; const t = x.currentTime; g.gain.setTargetAtTime(0, t, 0.15); o1.stop(t + 0.8); o2.stop(t + 0.8); } };
    this.eng = E; return E;
  }
  stop() {
    if (!this.A) return;
    const t = this.x.currentTime; for (const L of this.loops) { try { L.g.gain.setTargetAtTime(0, t, 0.2); L.s.stop(t + 0.9); } catch (_) { /* already stopped */ } } this.loops = [];
    this.eng?.stop(); const out = this.out; setTimeout(() => { try { out.disconnect(); } catch (_) { /* gone */ } }, 1000);
  }
}

// =====================================================================================================================
// the conversation: ui/HangoutTalk.js picks and builds a topic; the same rules here, should that ever fail
// =====================================================================================================================
/** one conversation with a guest -> { id, say, opts } | null (nothing fresh left) */
function talkFor(x, n, used) {
  if (typeof HT.hangoutTalk === 'function') { try { return HT.hangoutTalk(x, n, used); } catch (e) { console.warn('Hangout: the talk could not be built', e); } }
  return localTalk(x, n, used);
}
/** the local builder: HANGOUT_TOPICS filtered by who, where and when (a grave week or her grief: only the quiet ones), picked by weight, its tokens filled */
function localTalk(x, n, used) {
  const T = Array.isArray(HT.HANGOUT_TOPICS) ? HT.HANGOUT_TOPICS : [], star = n.kind === 'celeb', group = !!(n.other || x.other), hush = !!x.grave || (star && !!n.grieving);
  const fits = (d) => { try { return !d.when || !!d.when(x, n); } catch (_) { return false; } };
  const L = T.filter((d) => !used.includes(d.id) && (d.who.includes(star ? 'celeb' : 'driver') || (group && d.who.includes('group'))) && (!d.where || d.where.includes(x.venue)) && (!hush || d.quiet) && fits(d));
  if (!L.length) return null;
  let r = Math.random() * L.reduce((s, d) => s + (d.w || 1), 0), D = L[L.length - 1]; for (const d of L) if ((r -= d.w || 1) <= 0) { D = d; break; }
  const tok = { name: n.name, first: n.first || firstOf(n.name), team: n.team || 'the team', venue: 'here', track: x.track || 'the next race', result: 'the last race', her: n.first || firstOf(n.name), job: String(n.job || 'work').toLowerCase(), partner: x.partnerName ? firstOf(x.partnerName) : 'her', other: firstOf(n.other || x.other || 'the others') };
  const fill = (s) => String(pick([].concat(s))).replace(/\{(\w+)\}/g, (m, k) => (k === 'herWork' ? pick(n.work || ['work']) : tok[k] ?? ''));
  const flags = (fx) => { if (!fx) return undefined; const o = {}; for (const k of [].concat(fx)) if (FX.includes(k)) o[k] = true; return Object.keys(o).length ? o : undefined; };
  const opt = (o) => ({ t: fill(o.t), tone: o.tone, r: o.r ? fill(o.r) : '', m: o.m, end: o.end, fx: flags(o.fx), then: o.then ? { say: fill(o.then.say), opts: o.then.opts.slice(0, 4).map(opt) } : undefined });
  return { id: D.id, say: fill(D.open), opts: D.opts.map((o) => [Math.random(), o]).sort((a, b) => a[0] - b[0]).slice(0, 4).map((p) => opt(p[1])) };
}

// =====================================================================================================================
// the games. Each owns the camera while it plays, runs off update(dt), takes keys and the mouse, can be stopped (Q)
// at any time, and ends with { game, won: true | false | 'even' | null (stopped), text, you, them }. back: where you
// stand afterwards.
// =====================================================================================================================
const UP = V3(0, 1, 0);
class Game {
  constructor(ev, opp, name, title) {
    this.ev = ev; this.opp = opp; this.name = name; this.t = 0; this.done = false; this.result = null; this.k = new Set();
    const cam = ev.cam; this.cp = ev._toL(cam.position.clone()); this.cl = ev._toL(cam.position.clone().add(cam.getWorldDirection(V3()).multiplyScalar(2))); this.fov0 = cam.fov;
    ev._mgShow(title);
  }
  /** the camera eased from where it was to look from p at l (the place's frame; k: how quickly; fov: to zoom) */
  view(p, l, dt, k = 5, fov = null) {
    const a = 1 - Math.exp(-dt * k), cam = this.ev.cam; this.cp.lerp(p, a); this.cl.lerp(l, a); this.ev._look(this.cp, this.cl);
    if (fov && Math.abs(cam.fov - fov) > 0.05) { cam.fov += (fov - cam.fov) * a; cam.updateProjectionMatrix(); }
  }
  key(c, down) { if (down) this.k.add(c); else this.k.delete(c); }
  mouse() {}
  update() {}
  info() { return {}; }
  skip() { this.end(null, ''); }
  end(won, text, you = 0, them = 0) { if (this.done) return; this.done = true; this.result = { game: this.name, won, text, you, them, with: this.opp?.cid || null }; }
  dispose() { const cam = this.ev.cam; if (cam.fov !== this.fov0) { cam.fov = this.fov0; cam.updateProjectionMatrix(); } this.ev._meter(null); this.ev._aimAt(null); }
}

// ---- pool: three shots each on the pub table (UK rules, loosely: most balls potted wins, the black counts two) ----------
/** the table's balls racked: the cue ball on the baulk line, fifteen in the triangle on the foot spot (reds, yellows, the black in the middle) -> [ball] */
function poolRack(T) {
  const r = 0.0254, L = T.L, B = [{ x: -L / 2 + L / 5, z: 0, vx: 0, vz: 0, on: true, c: '#f6f4ec', cue: true, r: 0.0238 }], lay = 'RYRYKRRYYRYRYYR'; let k = 0;
  for (let row = 0; row < 5; row++) for (let j = 0; j <= row; j++) { const t = lay[k++]; B.push({ x: L / 4 + row * r * 1.75, z: (j - row / 2) * r * 2.02, vx: 0, vz: 0, on: true, c: t === 'R' ? '#c8102e' : t === 'Y' ? '#f2c230' : '#141414', black: t === 'K', r }); }
  return B;
}
const _bm = new THREE.Matrix4(), _bc = new THREE.Color();
/** the balls where they lie on the table (and their colours, when asked) */
function poolPlace(T, B, paint = false) {
  const M = T.balls;
  B.forEach((b, i) => { if (b.on) _bm.makeTranslation(T.x + b.x, T.y + b.r, T.z + b.z); else _bm.makeScale(0, 0, 0); M.setMatrixAt(i, _bm); if (paint) M.setColorAt(i, _bc.set(b.c)); });
  M.instanceMatrix.needsUpdate = true; if (paint && M.instanceColor) M.instanceColor.needsUpdate = true;
}
class Pool extends Game {
  constructor(ev, opp) {
    super(ev, opp, 'pool', 'POOL');
    const T = this.T = ev.V.pool, L = T.L / 2, W = T.W / 2; this.b = poolRack(T); poolPlace(T, this.b, true);
    this.pk = [[-L, -W, 0.058], [L, -W, 0.058], [-L, W, 0.058], [L, W, 0.058], [0, -W - 0.012, 0.05], [0, W + 0.012, 0.05]].map(([x, z, r]) => ({ x, z, r }));
    this.turn = 0; this.shots = [0, 0]; this.pots = [0, 0]; this.phase = 'aim'; this.aim = 0; this.pow = 0; this.ct = 0; this.charging = false; this.wait = 0; this.got = 0; this.foul = false; this.strike = 0; this.ai = null;
    this.camP = V3(T.x, T.y + 2.25, T.z + 0.62); this.camL = V3(T.x, T.y, T.z + 0.05); this._u = V3(); this._a = V3();
    T.cue.visible = true; T.line.visible = true; this.back = { x: T.x, z: T.z + 1.3, yaw: -Math.PI / 2 };
    ev._mgHelp('A / D or the mouse to aim (Shift: finer) · hold Space or the mouse button, let go to strike · Q to stop'); this._hud();
  }
  _hud() { const f = this.opp.first.toUpperCase(); this.ev._mg(`YOU ${this.pots[0]}  ·  ${this.pots[1]} ${f}`, this.done ? '' : `Shot ${Math.min(3, this.shots[this.turn] + 1)} of 3 · ${this.turn ? `${this.opp.first} to play` : 'your shot'}`); }
  info() { return { phase: this.phase, turn: this.turn, pots: this.pots.slice(), shots: this.shots.slice() }; }
  key(c, down) {
    super.key(c, down); if (this.phase !== 'aim') return;
    if (c === 'Space' && down && !this.charging) { this.charging = true; this.ct = 0; }
    if (c === 'Space' && !down && this.charging) this._strike();
  }
  mouse(kind, e) {
    if (this.phase !== 'aim') return;
    if (kind === 'move') this.aim += (e.movementX || 0) * 0.0021;
    else if (kind === 'down' && e.button === 0 && !this.charging) { this.charging = true; this.ct = 0; }
    else if (kind === 'up' && this.charging) this._strike();
  }
  _strike() { this.charging = false; this._shoot(this.aim, 0.25 + this.pow * 3.9); }
  update(dt) {
    this.t += dt; this.view(this.camP, this.camL, dt, 4, 50);
    const T = this.T;
    if (this.phase === 'aim') {
      const sp = (this.k.has('ShiftLeft') || this.k.has('ShiftRight') ? 0.22 : 0.95) * dt;
      if (this.k.has('KeyA') || this.k.has('ArrowLeft')) this.aim -= sp; if (this.k.has('KeyD') || this.k.has('ArrowRight')) this.aim += sp;
      if (this.charging) { this.ct += dt; this.pow = 1 - Math.abs(((this.ct * 0.85) % 2) - 1); }
      this.ev._meter({ fill: this.pow }); this._cue(this.aim, this.charging ? this.pow : 0); this._line(this.aim);
    } else if (this.phase === 'think') {
      this.wait -= dt; const a = this.ai.ang + Math.sin(this.wait * 5) * 0.04 * Math.max(0, this.wait - 0.5);
      this._cue(a, clamp(1.4 - this.wait, 0, 0.7) * (this.ai.v / 3.6)); this._line(a);
      if (this.wait <= 0) this._shoot(this.ai.ang, this.ai.v);
    } else if (this.phase === 'roll') {
      if (this.strike > 0) { this.strike -= dt; this._cue(this.shotAng, -0.03 * (1 - this.strike / 0.12)); } else T.cue.visible = false;
      for (let i = 0; i < 10; i++) this._step(dt / 10);
      poolPlace(T, this.b);
      if (this.b.every((b) => !b.on || Math.hypot(b.vx, b.vz) < 0.012)) { for (const b of this.b) { b.vx = 0; b.vz = 0; } this._after(); }
    } else if (this.phase === 'gap') { this.wait -= dt; if (this.wait <= 0) this._next(); }
  }
  /** the cue behind the cue ball along ang, drawn back by pull (0..1) */
  _cue(ang, pull) {
    const T = this.T, c = this.b[0], dx = Math.cos(ang), dz = Math.sin(ang), u = this._u.set(dx, -0.12, dz).normalize(), back = c.r + 0.012 + pull * 0.24;
    T.cue.quaternion.setFromUnitVectors(UP, u); T.cue.position.set(T.x + c.x - dx * back - u.x * 0.725, T.y + c.r + 0.012 - u.y * 0.725, T.z + c.z - dz * back - u.z * 0.725); T.cue.visible = true;
  }
  /** the aiming line: from the cue ball to the first ball or cushion it meets, and where that ball would go */
  _line(ang) {
    const T = this.T, c = this.b[0], dx = Math.cos(ang), dz = Math.sin(ang), L = T.L / 2, W = T.W / 2, A = T.line.geometry.attributes.position, y = T.y + c.r;
    let tm = Math.min(dx > 0 ? (L - c.r - c.x) / dx : dx < 0 ? (-L + c.r - c.x) / dx : 9, dz > 0 ? (W - c.r - c.z) / dz : dz < 0 ? (-W + c.r - c.z) / dz : 9), hit = null;
    for (const b of this.b) { if (!b.on || b === c) continue; const fx = c.x - b.x, fz = c.z - b.z, R = c.r + b.r, bb = fx * dx + fz * dz, cc = fx * fx + fz * fz - R * R, disc = bb * bb - cc; if (disc < 0) continue; const t = -bb - Math.sqrt(disc); if (t > 0 && t < tm) { tm = t; hit = b; } }
    const ex = c.x + dx * tm, ez = c.z + dz * tm;
    A.setXYZ(0, T.x + c.x, y, T.z + c.z); A.setXYZ(1, T.x + ex, y, T.z + ez);
    if (hit) { const ox = hit.x - ex, oz = hit.z - ez, ol = Math.hypot(ox, oz) || 1; A.setXYZ(2, T.x + hit.x, y, T.z + hit.z); A.setXYZ(3, T.x + hit.x + (ox / ol) * 0.3, y, T.z + hit.z + (oz / ol) * 0.3); } else { A.setXYZ(2, T.x + ex, y, T.z + ez); A.setXYZ(3, T.x + ex, y, T.z + ez); }
    A.needsUpdate = true; T.line.visible = true;
  }
  _shoot(ang, v) { const c = this.b[0]; c.vx = Math.cos(ang) * v; c.vz = Math.sin(ang) * v; this.shotAng = ang; this.strike = 0.12; this.phase = 'roll'; this.got = 0; this.foul = false; this.T.line.visible = false; this.ev._meter(null); this.ev.snd.clack(Math.min(1, v / 3)); }
  /** a slice of time on the table: rolling (and slowing), balls off balls, pockets, cushions */
  _step(h) {
    const B = this.b, L = this.T.L / 2, W = this.T.W / 2;
    for (const b of B) { if (!b.on) continue; b.x += b.vx * h; b.z += b.vz * h; const s = Math.hypot(b.vx, b.vz); if (s > 0) { const ns = Math.max(0, s - (0.18 + 0.1 * s) * h); b.vx *= ns / s; b.vz *= ns / s; } }
    for (let i = 0; i < B.length; i++) {
      const a = B[i]; if (!a.on) continue;
      for (let j = i + 1; j < B.length; j++) {
        const c = B[j]; if (!c.on) continue; const dx = c.x - a.x, dz = c.z - a.z, d = Math.hypot(dx, dz), m = a.r + c.r; if (d >= m || d < 1e-9) continue;
        const nx = dx / d, nz = dz / d, rel = (a.vx - c.vx) * nx + (a.vz - c.vz) * nz, o = (m - d) / 2; a.x -= nx * o; a.z -= nz * o; c.x += nx * o; c.z += nz * o;
        if (rel > 0) { const k = rel * 0.96; a.vx -= k * nx; a.vz -= k * nz; c.vx += k * nx; c.vz += k * nz; if (rel > 0.12) this.ev.snd.clack(Math.min(1, rel / 2)); }
      }
    }
    for (const b of B) {
      if (!b.on) continue;
      for (const p of this.pk) if ((b.x - p.x) ** 2 + (b.z - p.z) ** 2 < p.r * p.r) { b.on = false; b.vx = b.vz = 0; if (b.cue) this.foul = true; else this.got += b.black ? 2 : 1; this.ev.snd.thunk(); break; }
      if (!b.on) continue;
      if (Math.abs(b.x) > L - b.r) { b.x = Math.sign(b.x) * (L - b.r); b.vx = -b.vx * 0.72; b.vz *= 0.92; }
      if (Math.abs(b.z) > W - b.r) { b.z = Math.sign(b.z) * (W - b.r); b.vz = -b.vz * 0.72; b.vx *= 0.92; }
    }
  }
  _after() {
    const who = this.turn, c = this.b[0]; let pts = this.got;
    if (this.foul) { pts -= 1; c.on = true; c.x = -this.T.L / 2 + this.T.L / 5; c.z = 0; while (this.b.some((b) => b !== c && b.on && Math.hypot(b.x - c.x, b.z - c.z) < 0.06)) c.z += 0.06; poolPlace(this.T, this.b); }
    this.pots[who] = Math.max(0, this.pots[who] + pts); this.shots[who]++;
    this.ev._big(this.foul ? 'FOUL' : this.got >= 2 ? 'SHOT!' : this.got === 1 ? 'POTTED' : 'NOTHING', this.foul ? 'the cue ball went down' : who ? this.opp.first : 'you', this.foul ? 'bad' : this.got && !who ? 'good' : '', 1.1);
    if (who && this.got) this.ev._bark(this.opp, pick(['Get in.', 'Shot.', 'Easy game.', "Didn't even look."]));
    if (!who && this.got >= 2) this.ev._bark(this.opp, pick(['Oh, come on.', 'Lucky.', 'Fine. Good shot.']));
    this.phase = 'gap'; this.wait = 1.2; this._hud();
  }
  _next() {
    if ((this.shots[0] >= 3 && this.shots[1] >= 3) || !this.b.some((b) => b.on && !b.cue)) {
      const [a, b] = this.pots, f = this.opp.first; this.T.cue.visible = false; this.T.line.visible = false;
      this.end(a > b ? true : a < b ? false : 'even', a > b ? `Beat ${f} at pool, ${a}-${b}.` : a < b ? `${f} won at pool, ${b}-${a}.` : `Level with ${f} at pool, ${a}-${b}.`, a, b); return;
    }
    this.turn = this.shots[0] > this.shots[1] ? 1 : 0;
    if (this.turn) { this.ai = this._ai(); this.phase = 'think'; this.wait = 1.5; }
    else { this.phase = 'aim'; this.pow = 0; this.charging = false; const c = this.b[0], o = this.b.find((b) => b.on && !b.cue); if (o) this.aim = Math.atan2(o.z - c.z, o.x - c.x); }
    this._hud();
  }
  /** whether anything but a and skip lies across the line from a to (x, z) */
  _blocked(a, x, z, skip) {
    const dx = x - a.x, dz = z - a.z, L = Math.hypot(dx, dz) || 1;
    for (const b of this.b) { if (!b.on || b === a || b === skip) continue; const t = clamp(((b.x - a.x) * dx + (b.z - a.z) * dz) / (L * L), 0, 1), px = a.x + dx * t - b.x, pz = a.z + dz * t - b.z; if (px * px + pz * pz < (a.r + b.r) ** 2 * 0.95) return true; }
    return false;
  }
  /** their shot: the easiest pot on the table (the straightest, shortest line to a pocket), a little off by their skill -> { ang, v } */
  _ai() {
    const c = this.b[0], sk = skillOf(this.opp, 'pool'); let best = null;
    for (const o of this.b) {
      if (!o.on || o.cue) continue;
      for (const p of this.pk) {
        const tx = p.x - o.x, tz = p.z - o.z, tl = Math.hypot(tx, tz), ux = tx / tl, uz = tz / tl, gx = o.x - ux * (o.r + c.r), gz = o.z - uz * (o.r + c.r), ax = gx - c.x, az = gz - c.z, al = Math.hypot(ax, az);
        if (al < 0.05) continue; const cos = (ax * ux + az * uz) / al; if (cos < 0.3) continue;
        if (this._blocked(c, gx, gz, o) || this._blocked(o, p.x, p.z, null)) continue;
        const s = (cos * cos) / (0.6 + al + tl) * (o.black ? 1.3 : 1); if (!best || s > best.s) best = { s, ang: Math.atan2(az, ax), v: clamp(0.9 + (al + tl) * 1.25, 1.1, 3.6) };
      }
    }
    if (!best) { const o = this.b.find((x) => x.on && !x.cue); best = { ang: o ? Math.atan2(o.z - c.z, o.x - c.x) : 0, v: 2.2 }; }
    return { ang: best.ang + gauss() * ((1 - sk) * 0.05 + 0.006), v: best.v * (1 + gauss() * 0.08) };
  }
  dispose() { super.dispose(); this.T.cue.visible = false; this.T.line.visible = false; }
}

// ---- darts: three each at the board (a dartboard's real geometry: the trebles, the doubles, the bull) -------------------
const BOARD = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
/** where a dart lands (u right, v up: metres from the bull) -> [points, label] */
function dartScore(u, v) {
  const r = Math.hypot(u, v); if (r < 0.00635) return [50, 'BULL']; if (r < 0.0159) return [25, '25']; if (r >= 0.17) return [0, 'MISS'];
  const a = (Math.atan2(u, v) + Math.PI / 20 + Math.PI * 4) % (Math.PI * 2), n = BOARD[Math.floor(a / (Math.PI / 10)) % 20];
  if (r >= 0.099 && r < 0.107) return [n * 3, 'T' + n]; if (r >= 0.162) return [n * 2, 'D' + n]; return [n, String(n)];
}
class Darts extends Game {
  constructor(ev, opp) {
    super(ev, opp, 'darts', 'DARTS'); const D = this.D = ev.V.darts;
    this.u = 0; this.v = 0.103; this.su = 0; this.sv = 0; this.turn = 0; this.thrown = [0, 0]; this.sc = [0, 0]; this.hits = [[], []]; this.fly = null; this.wait = 0; this.breath = 2.5; this.phase = 'aim';
    for (const d of D.darts) d.visible = false;
    this._p = V3(); this._d = V3(); this._f = V3(); this.back = { x: D.eye.x + 0.25, z: D.eye.z + 0.7, yaw: Math.PI };
    ev._mgHelp('Move the mouse (or W A S D) to aim · hold Shift to steady your hand · click or Space to throw · Q to stop'); this._hud();
  }
  _hud() { this.ev._mg(`YOU ${this.sc[0]}  ·  ${this.sc[1]} ${this.opp.first.toUpperCase()}`, `${this.turn ? `${this.opp.first} throwing` : `Dart ${Math.min(3, this.thrown[0] + 1)} of 3`}${this.hits[this.turn].length ? ' · ' + this.hits[this.turn].join(', ') : ''}`); }
  info() { return { phase: this.phase, sc: this.sc.slice(), thrown: this.thrown.slice() }; }
  /** a point on the board's face (u right, v up) -> out */
  _pt(u, v, out) { const D = this.D; return out.copy(D.c).addScaledVector(D.r, u).addScaledVector(D.up, v); }
  key(c, down) { super.key(c, down); if (down && c === 'Space') this._throw(); }
  mouse(kind, e) { if (kind === 'move' && this.phase === 'aim') { this.u = clamp(this.u + (e.movementX || 0) * 0.00042, -0.23, 0.23); this.v = clamp(this.v - (e.movementY || 0) * 0.00042, -0.23, 0.23); } else if (kind === 'down' && e.button === 0) this._throw(); }
  _throw() { if (this.phase !== 'aim' || this.fly || this.thrown[0] >= 3) return; this._launch(0, this.u + this.su + gauss() * 0.006, this.v + this.sv + gauss() * 0.006); }
  /** a dart in flight to (u, v) on the board, from your hand or theirs */
  _launch(who, u, v) {
    const D = this.D, d = D.darts[who * 3 + this.thrown[who]], from = D.eye.clone().addScaledVector(D.r, who ? -0.3 : 0.12).add(V3(0, -0.16, 0)).addScaledVector(D.n, -0.35);
    d.visible = true; this.fly = { d, who, u, v, from, to: this._pt(u, v, V3()), t: 0, dur: 0.24 };
  }
  update(dt) {
    this.t += dt; const D = this.D; this.view(D.eye, D.c, dt, 5, 24);
    const steady = (this.k.has('ShiftLeft') || this.k.has('ShiftRight')) && this.breath > 0;
    this.breath = clamp(this.breath + (steady ? -dt : dt * 0.8), 0, 2.5);
    const A = steady ? 0.006 : this.breath <= 0.05 ? 0.034 : 0.02, t = this.t;
    this.su = A * (Math.sin(t * 1.7) + 0.6 * Math.sin(t * 3.1 + 1.3)); this.sv = A * (Math.cos(t * 1.3 + 0.4) + 0.5 * Math.sin(t * 2.7));
    const kx = (this.k.has('KeyD') ? 1 : 0) - (this.k.has('KeyA') ? 1 : 0), ky = (this.k.has('KeyW') ? 1 : 0) - (this.k.has('KeyS') ? 1 : 0);
    this.u = clamp(this.u + kx * dt * 0.12, -0.23, 0.23); this.v = clamp(this.v + ky * dt * 0.12, -0.23, 0.23);
    this.ev._aimAt(this.phase === 'aim' && !this.fly ? this._pt(this.u + this.su, this.v + this.sv, this._p) : null);
    if (this.fly) {
      const F = this.fly; F.t += dt; const e = Math.min(1, F.t / F.dur);
      const p = this._p.copy(F.from).lerp(F.to, e); p.y += Math.sin(e * Math.PI) * 0.07; this._d.copy(F.to).sub(F.from).normalize(); this._d.y -= (0.5 - e) * 0.25;
      F.d.quaternion.setFromUnitVectors(this._f.set(1, 0, 0), this._d.normalize()); F.d.position.copy(p).addScaledVector(this._d, -0.015);
      if (e >= 1) {
        const [pts, lab] = dartScore(F.u, F.v); this.sc[F.who] += pts; this.hits[F.who].push(lab); this.thrown[F.who]++; this.ev.snd.thunk();
        this.ev._big(lab, pts ? `${pts}` : 'off the board', F.who ? '' : pts >= 40 ? 'gold' : pts ? 'good' : 'bad', 0.8); this.fly = null; this._hud();
        if (!F.who && this.thrown[0] >= 3) { this.phase = 'gap'; this.wait = 1.4; this.ev._bark(this.opp, this.sc[0] >= 60 ? pick(['Okay. Not bad.', 'Hm. Decent.', 'Show-off.']) : pick(['Is that it?', 'My turn, then.', 'Ha. Watch this.'])); }
      }
    }
    if (this.phase === 'gap') { this.wait -= dt; if (this.wait <= 0) { for (let i = 0; i < 3; i++) D.darts[i].visible = false; this.phase = 'them'; this.turn = 1; this.wait = 0.5; this._hud(); } }
    else if (this.phase === 'them' && !this.fly) {
      this.wait -= dt;
      if (this.wait <= 0) {
        if (this.thrown[1] < 3) { const sk = skillOf(this.opp, 'darts'), s = 0.011 + (1 - sk) * 0.04, aimV = this.opp.kind === 'driver' ? 0.103 : 0.07; this._launch(1, gauss() * s, aimV + gauss() * s); this.wait = 0.85; }
        else { const [a, b] = this.sc, f = this.opp.first; this.phase = 'over'; this.end(a > b ? true : a < b ? false : 'even', a > b ? `Beat ${f} at darts, ${a} to ${b}.` : a < b ? `${f} won the darts, ${b} to ${a}.` : `Level with ${f} at darts, ${a} each.`, a, b); }
      }
    }
  }
  dispose() { super.dispose(); for (const d of this.D.darts) d.visible = false; }
}

// ---- the sim rigs: a lights-out start, then a lap holding the racing line (your time against theirs) --------------------
/** the sim's road: rows of grass, kerb and asphalt from the horizon down, bent by the bend ahead; the green racing line; your car */
function simRoad(x, w, h, bend, cam, line, s, col) {
  const hz = h * 0.42; vgrad(x, w, hz + 1, [[0, '#2f5a9a'], [1, '#a8c4e4']]);
  x.fillStyle = '#5a6a7a'; for (let i = 0; i < 9; i++) { const bx = ((i * 97 + s * 3) % (w + 80)) - 40; x.fillRect(bx, hz - 18 - (i % 3) * 7, 30 + (i % 4) * 9, 18 + (i % 3) * 7); }
  for (let y = Math.floor(hz); y < h; y += 2) {
    const k = (y - hz) / (h - hz), z = 1 / (k + 0.05), rw = w * (0.02 + 0.5 * k), cx = w / 2 + bend * (1 - k) * (1 - k) * w * 0.5 - cam * rw, band = Math.floor(z * 2.2 + s * 9) & 1;
    x.fillStyle = band ? '#3f7a34' : '#3a7030'; x.fillRect(0, y, w, 2);
    x.fillStyle = band ? '#c8102e' : '#f2f2f2'; x.fillRect(cx - rw * 1.1, y, rw * 2.2, 2);
    x.fillStyle = band ? '#55575c' : '#4f5156'; x.fillRect(cx - rw, y, rw * 2, 2);
    if (line) { const lx = cx + line(k) * rw; x.fillStyle = 'rgba(70,230,120,.55)'; x.fillRect(lx - rw * 0.17, y, rw * 0.34, 2); }
  }
  // (the car from behind: tyres, the floor, the rear wing in the team's colour)
  const cy = h * 0.88, cw = w * 0.2; x.fillStyle = '#111'; x.fillRect(w / 2 - cw * 0.55, cy - 4, cw * 0.22, h * 0.09); x.fillRect(w / 2 + cw * 0.33, cy - 4, cw * 0.22, h * 0.09);
  x.fillStyle = col; x.fillRect(w / 2 - cw * 0.3, cy - 10, cw * 0.6, h * 0.07); x.fillRect(w / 2 - cw * 0.45, cy - h * 0.07, cw * 0.9, 6); x.fillStyle = '#ff2a1a'; x.fillRect(w / 2 - 4, cy + 2, 8, 4);
}
class SimRig extends Game {
  constructor(ev, opp) {
    super(ev, opp, 'sim', 'SIM RACE'); const V = ev.V; this.rig = V.rigs[0]; this.scr = this.rig.scr; this.orig = V.rigs.find((r) => r.i === (opp.spot?.rig ?? 1)) || V.rigs[1];
    this.phase = 'intro'; this.pt = 0; this.lit = 0; this.hold = 0.6 + Math.random() * 2.0; this.outAt = 0; this.react = 0; this.jump = false; this.p = 0; this.pv = 0; this.off = 0; this.s = 0; this.acc = 0; this.idle = 0;
    this.base = { silverstone: 87.9, lasvegas: 94.2 }[ev.trackId] ?? 90.6; this.trk = String(TRACK[ev.trackId] || 'Silverstone').toUpperCase();
    this.oppT = this.base + (1 - skillOf(opp, 'sim')) * 2.4 + 0.14 + Math.random() * 0.42; this.myT = 0; this.oppCol = '#' + new THREE.Color(opp.color || '#3a4150').getHexString();
    this.back = { x: this.rig.x, z: -0.9, yaw: -Math.PI / 2 };
    ev._mgHelp('Space when the lights go out · A / D to keep the car on the green line · Q to stop'); this._hud();
  }
  _hud() { const d = this.phase === 'drive' ? this.off * 0.32 : 0; this.ev._mg(this.phase === 'drive' ? `${lapTxt(Math.max(0, this.s * (this.base / 20)))}  ·  ${d > 0.005 ? '+' + d.toFixed(2) + ' OFF LINE' : 'ON THE LINE'}` : this.phase === 'result' ? `${lapTxt(this.myT)}  ·  ${this.opp.first} ${lapTxt(this.oppT)}` : `${this.trk} · ONE LAP`, this.phase === 'drive' ? `${Math.max(0, 20 - this.s).toFixed(0)} s to the flag` : `against ${this.opp.first}`); }
  info() { return { phase: this.phase, react: this.react, off: this.off, myT: this.myT, oppT: this.oppT }; }
  _curve(s) { return 0.8 * Math.sin(s * 0.33) + 0.45 * Math.sin(s * 0.81 + 1.2); }
  _line(s) { return clamp(-this._curve(s + 0.6) * 0.55, -0.62, 0.62); }
  key(c, down) {
    super.key(c, down); if (!down || c !== 'Space') return;
    if (this.phase === 'lights') { this.jump = true; this.react = 0; this.phase = 'drive'; this.ev._big('JUMP START', '+1.0 s', 'bad', 1.1); }
    else if (this.phase === 'react') { this.react = Math.max(0.1, this.pt - this.outAt); this.phase = 'drive'; this.ev._big(`${this.react.toFixed(3)} s`, 'reaction', this.react < 0.25 ? 'gold' : 'good', 0.9); }
  }
  update(dt) {
    this.t += dt; this.pt += dt; this.view(this.rig.eye, this.rig.look, dt, 4, 44);
    if (this.phase === 'intro' && this.pt > 1.6) { this.phase = 'lights'; this.pt = 0; }
    else if (this.phase === 'lights') { this.lit = Math.min(5, Math.floor(this.pt / 0.8) + 1); if (this.pt >= 4 + this.hold) { this.phase = 'react'; this.outAt = this.pt; this.ev.snd.pop(true); } }
    else if (this.phase === 'react' && this.pt - this.outAt > 1.4) { this.react = 1.4; this.phase = 'drive'; }
    else if (this.phase === 'drive') {
      this.s += dt; const dir = ((this.k.has('KeyD') || this.k.has('ArrowRight')) ? 1 : 0) - ((this.k.has('KeyA') || this.k.has('ArrowLeft')) ? 1 : 0);
      this.pv += dir * 5.0 * dt - this.pv * 3.2 * dt; this.p = clamp(this.p + (this.pv + this._curve(this.s) * 0.22) * dt, -1.1, 1.1);
      if (Math.abs(this.p - this._line(this.s)) > 0.17) this.off += dt;
      if (this.s >= 20) {
        this.myT = this.base + (this.jump ? 1.0 : this.react * 0.9) + this.off * 0.32 + 0.05 * gauss(); this.phase = 'result'; this.pt = 0;
        const won = this.myT < this.oppT; this.ev._big(won ? 'FASTER' : 'SLOWER', `${lapTxt(this.myT)} against ${lapTxt(this.oppT)}`, won ? 'good' : 'bad', 2.6); this.ev._lapBoard([['YOU', this.myT], [this.opp.first, this.oppT]]);
      }
    } else if (this.phase === 'result' && this.pt > 3.0) { const won = this.myT < this.oppT, gap = Math.abs(this.myT - this.oppT).toFixed(3), f = this.opp.first; this.end(won, won ? `Out-qualified ${f} on the sims by ${gap} s.` : `${f} was ${gap} s quicker on the sims.`, this.myT, this.oppT); }
    this.acc += dt; if (this.acc >= 1 / 30) { this.acc = 0; this._paint(); }
    this.idle += dt; if (this.idle >= 1 / 6 && this.orig?.scr) { this.idle = 0; this.orig.scr.draw((x, w, h) => { simRoad(x, w, h, this.phase === 'drive' ? this._curve(this.s + 0.4) : 0, Math.sin(this.t) * 0.08, null, this.phase === 'drive' ? this.s : 0, this.oppCol); }); }
    this._hud();
  }
  _paint() {
    const S = this.scr, x = S.x, w = S.w, h = S.h, ph = this.phase, col = this.ev.myColor || '#c8102e';
    if (ph === 'drive' || ph === 'result') {
      const s = this.s; simRoad(x, w, h, this._curve(s + 0.5), this.p, (k) => this._line(s + (1 - k) * 0.9), s, col);
      x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(0, 0, w, 34); words(x, `${this.trk}  ·  HOLD THE LINE`, w * 0.3, 17, "700 15px 'Segoe UI', Arial", '#fff');
      words(x, lapTxt(Math.max(0, s * (this.base / 20))), w * 0.82, 17, '700 17px Consolas, monospace', '#ffd34d');
      const on = Math.abs(this.p - this._line(s)) <= 0.17; x.fillStyle = on ? '#41e07a' : '#ff5a4a'; x.fillRect(w / 2 - 40, 40, 80, 5);
    } else {
      simRoad(x, w, h, 0, 0, null, 0, col);
      x.fillStyle = 'rgba(0,0,0,.45)'; x.fillRect(0, 0, w, h * 0.36);
      for (let i = 0; i < 5; i++) { const cx = w * (0.26 + i * 0.12), on = ph === 'lights' && i < this.lit; x.fillStyle = '#0c0c0e'; x.fillRect(cx - 20, h * 0.05, 40, 62); for (const yy of [0.1, 0.2]) { x.fillStyle = on ? '#ff1a10' : '#2a0806'; x.beginPath(); x.arc(cx, h * yy + 8, 12, 0, 7); x.fill(); } }
      words(x, ph === 'intro' ? `${this.trk}  ·  ONE LAP` : ph === 'react' ? 'GO!' : 'SPACE AT LIGHTS OUT', w / 2, h * 0.32, "800 20px 'Segoe UI', Arial", ph === 'react' ? '#41e07a' : '#ffffff');
    }
    S.tex.needsUpdate = true;
  }
}

// ---- karting: three laps of the indoor track against them (A/D steer, S brakes, the throttle is automatic) --------------
class Karting extends Game {
  constructor(ev, opp) {
    super(ev, opp, 'karting', 'KARTING'); const T = this.T = ev.V.track;
    const st = Math.atan2(T.S[T.si * 6 + 3], T.S[T.si * 6 + 2]);
    this.me = this._kart(raceKart(ev.kartColor || '#c8102e', ev.helmet || ev.myColor || '#f2f2f2', ev.mySuit || '#22324a'), T.grid[1], st);
    this.op = this._kart(raceKart(pick(['#1f4fa8', '#f0b020', '#2e9e5a']), opp.color || '#f2f2f2', opp.kind === 'driver' ? opp.color || '#3a4150' : '#2a2e36'), T.grid[0], st);
    this.op.sk = 0.86 + 0.14 * skillOf(opp, 'karting'); this.op.wait = 0.25;
    if (opp.person) opp.person.group.visible = false;
    this.phase = 'lights'; this.pt = 0; this.rt = 0; this.hold = 0.5 + Math.random() * 1.4; this.first = null; this.shake = 0; this.acc = 0;
    this._cp = V3(); this._cl = V3(); this.eng = ev.snd.engine(0.045); this.back = { x: -7.3, z: 9.7, yaw: -Math.PI / 2 };
    ev._mgHelp('A / D to steer · S to brake · the throttle looks after itself · Q to stop'); this._hud();
  }
  _kart(obj, at, h) { const k = { obj, x: at[0], z: at[1], h, v: 0, steer: 0, idx: this._nearAll(at[0], at[1]), lap: 0, laps: [], best: 0, half: false, started: false, done: false, finish: 0, slide: 0, lapAt: 0, prevP: null, wait: 0, sk: 1 }; this.ev.scene.add(obj.group); this.ev._hostLit(obj.group); this._put(k); return k; }
  _put(k) { k.obj.group.position.set(k.x, 0, k.z); k.obj.group.rotation.y = -k.h; }
  _nearAll(x, z) { const S = this.T.S; let bi = 0, bd = 1e9; for (let i = 0; i < this.T.N; i++) { const d = (S[i * 6] - x) ** 2 + (S[i * 6 + 1] - z) ** 2; if (d < bd) { bd = d; bi = i; } } return bi; }
  /** the nearest sample to a kart, searched round the last one */
  _near(k) { const S = this.T.S, N = this.T.N; let bi = k.idx, bd = 1e9; for (let j = -24; j <= 40; j++) { const i = (k.idx + j + N) % N, d = (S[i * 6] - k.x) ** 2 + (S[i * 6 + 1] - k.z) ** 2; if (d < bd) { bd = d; bi = i; } } k.idx = bi; return bi; }
  _hud() {
    const me = this.me, f = this.opp.first, ahead = this._ahead(), lap = Math.min(3, me.lap + 1);
    this.ev._mg(this.phase === 'lights' ? 'LIGHTS' : `LAP ${lap}/3  ·  P${ahead ? 1 : 2}`, this.phase === 'lights' ? `three laps against ${f}` : `${me.laps.length ? 'last ' + lapTxt(me.laps[me.laps.length - 1]) + ' · ' : ''}${me.best ? 'best ' + lapTxt(me.best) : 'no lap yet'}`);
  }
  /** you are ahead (on laps, then how far round) */
  _ahead() { const N = this.T.N, pr = (k) => k.lap * N + (k.started ? (k.idx - this.T.si + N) % N : ((k.idx - this.T.si + N) % N) - N); return this.first ? this.first === this.me : pr(this.me) >= pr(this.op); }
  info() { return { phase: this.phase, lap: this.me.lap, opLap: this.op.lap, v: +this.me.v.toFixed(1), ahead: this._ahead() }; }
  update(dt) {
    this.t += dt; const T = this.T, me = this.me;
    if (this.phase === 'lights') {
      this.pt += dt; const lit = Math.min(5, Math.floor(this.pt / 0.8) + 1), out = this.pt >= 4 + this.hold;
      T.lights.forEach((m, i) => m.color.set(i < lit && !out ? '#ff1a10' : '#2a0806'));
      if (out) { this.phase = 'race'; this.ev._big('GO', '', 'good', 0.7); this.ev.snd.pop(true); }
    } else {
      this.rt += dt;
      for (let s = 0; s < 3; s++) { this._step(me, dt / 3, false); this._step(this.op, dt / 3, true); this._bump(); }
      this._laps(me); this._laps(this.op);
      if (me.done && (this.op.done || this.rt > me.finish + 7) && this.phase === 'race') { this.phase = 'over'; this.pt = 0; }
      if (this.rt > 150 && this.phase === 'race') { this.phase = 'over'; this.pt = 0; }
      if (this.phase === 'over') { this.pt += dt; if (this.pt > 1.6) this._finish(); }
    }
    this._put(me); this._put(this.op);
    const fx = Math.cos(me.h), fz = Math.sin(me.h); this._cp.set(me.x - fx * 4.6, 2.9, me.z - fz * 4.6); this._cl.set(me.x + fx * 4.5, 0.25, me.z + fz * 4.5); this.view(this._cp, this._cl, dt, 6, 62);
    if (this.shake > 0 && !REDUCED) { const c = this.ev.cam; c.position.x += (Math.random() - 0.5) * this.shake * 0.12; c.position.y += (Math.random() - 0.5) * this.shake * 0.08; this.shake = Math.max(0, this.shake - dt * 3); }
    const brake = this.k.has('KeyS') || this.k.has('ArrowDown'); this.eng.set(me.v / 15.5, this.phase === 'race' && !me.done ? (brake ? 0.2 : 1) : 0.1);
    this.acc += dt; if (this.acc > 0.25) { this.acc = 0; this._screen(); this._hud(); }
  }
  _step(k, h, ai) {
    if (this.phase !== 'race' && this.phase !== 'over') return;
    const T = this.T, S = T.S; let thr = 0, brk = 0, st = 0;
    if (k.done) { brk = 0.25; st = 0; }
    else if (ai) { if ((k.wait -= h) > 0) return; const r = this._ai(k); thr = r.thr; brk = r.brk; st = r.st; }
    else { const b = this.k.has('KeyS') || this.k.has('ArrowDown'); thr = b ? 0 : 1; brk = b ? 1 : 0; st = ((this.k.has('KeyD') || this.k.has('ArrowRight')) ? 1 : 0) - ((this.k.has('KeyA') || this.k.has('ArrowLeft')) ? 1 : 0); }
    k.steer += clamp(st - k.steer, -h * 5, h * 5);
    k.v = Math.max(0, k.v + (thr * 6.2 * (1 - k.v / 15.5) - brk * 10.5 - 0.006 * k.v * k.v - (k.v > 0.1 ? 0.3 : 0)) * h);
    let w = (k.v * Math.tan(k.steer * 0.42)) / 1.05; const lat = k.v * w;
    if (Math.abs(lat) > 12.6) { w = (Math.sign(w) * 12.6) / Math.max(1, k.v); k.v *= 1 - 0.7 * h; k.slide = 1; } else k.slide = Math.max(0, k.slide - h * 3);
    k.h += w * h; k.x += Math.cos(k.h) * k.v * h; k.z += Math.sin(k.h) * k.v * h;
    // (the tyre walls: pushed back on to the track, the nose turned along it, most of the speed gone)
    const i = this._near(k), nx = -S[i * 6 + 3], nz = S[i * 6 + 2], off = (k.x - S[i * 6]) * nx + (k.z - S[i * 6 + 1]) * nz, lim = T.hw - 0.55;
    if (Math.abs(off) > lim) {
      const sg = Math.sign(off), pen = Math.abs(off) - lim; k.x -= nx * pen * sg; k.z -= nz * pen * sg;
      const fx = Math.cos(k.h), fz = Math.sin(k.h), dn = (fx * nx + fz * nz) * sg; if (dn > 0) k.h = Math.atan2(fz - nz * sg * dn * 1.4, fx - nx * sg * dn * 1.4);
      if (k.v > 3 && !ai) { this.ev.snd.thunk(); this.shake = Math.min(1, k.v / 12); } k.v *= 0.6;
    }
  }
  /** their driving: aim at a point down the track (towards the inside of the bend ahead), as fast as the tightest bend coming allows */
  _ai(k) {
    const T = this.T, S = T.S, N = T.N, j = (k.idx + Math.round((3.2 + k.v * 0.42) / T.ds)) % N;
    let km = 0; for (let q = 8; q < 56; q += 4) km = Math.max(km, Math.abs(S[((k.idx + q) % N) * 6 + 4]));
    const lo = clamp(S[j * 6 + 4] * 14, -1.1, 1.1), tx = S[j * 6] - S[j * 6 + 3] * lo, tz = S[j * 6 + 1] + S[j * 6 + 2] * lo;
    const vt = Math.min(15.5 * k.sk, Math.sqrt((11.8 * k.sk) / Math.max(0.02, km)));
    return { thr: k.v < vt ? 1 : 0, brk: k.v > vt + 0.7 ? 1 : 0, st: clamp(wrap(Math.atan2(tz - k.z, tx - k.x) - k.h) * 2.4, -1, 1) };
  }
  /** the two karts touching: pushed apart, a little speed swapped (no damage: it is karting) */
  _bump() {
    const a = this.me, b = this.op, dx = b.x - a.x, dz = b.z - a.z, d = Math.hypot(dx, dz); if (d >= 1.15 || d < 1e-6) return;
    const nx = dx / d, nz = dz / d, o = (1.15 - d) / 2; a.x -= nx * o; a.z -= nz * o; b.x += nx * o; b.z += nz * o; const dv = (a.v - b.v) * 0.2; a.v -= dv; b.v += dv;
  }
  _laps(k) {
    const T = this.T, N = T.N, p = (k.idx - T.si + N) % N, prev = k.prevP ?? p; k.prevP = p;
    if (p > N * 0.42 && p < N * 0.62) k.half = true;
    if (!(prev > N * 0.85 && p < N * 0.15)) return;
    if (!k.started) { k.started = true; k.lapAt = this.rt; k.half = false; return; }
    if (!k.half || k.done) return;
    const lt = this.rt - k.lapAt; k.lapAt = this.rt; k.half = false; k.laps.push(lt); k.best = k.best ? Math.min(k.best, lt) : lt; k.lap++;
    if (k === this.me) this.ev._big(k.lap >= 3 ? 'CHEQUERED FLAG' : `LAP ${k.lap + 1}`, lapTxt(lt), k.best === lt ? 'gold' : '', 1.0);
    if (k.lap >= 3) { k.done = true; k.finish = this.rt; if (!this.first) this.first = k; }
  }
  _screen() {
    const S = this.T.scr, me = this.me, op = this.op, f = this.opp.first.toUpperCase(), ahead = this._ahead();
    S.draw((x, w, h) => {
      x.fillStyle = '#05070c'; x.fillRect(0, 0, w, h); x.fillStyle = '#c8102e'; x.fillRect(0, 0, w, 54); words(x, 'REDLINE  ·  LIVE TIMING', w / 2, 28, "italic 900 30px 'Segoe UI', Arial", '#fff');
      ['POS', 'DRIVER', 'LAP', 'LAST', 'BEST'].forEach((s, i) => words(x, s, [50, 220, 420, 520, 660][i], 82, "700 18px 'Segoe UI', Arial", '#8c93a0'));
      const rows = ahead ? [[me, 'YOU'], [op, f]] : [[op, f], [me, 'YOU']];
      rows.forEach(([k, n], r) => { const y = 130 + r * 56, last = k.laps[k.laps.length - 1]; x.fillStyle = r % 2 ? '#0d1018' : '#111522'; x.fillRect(10, y - 24, w - 20, 48); [String(r + 1), n, `${Math.min(3, k.lap + (k.done ? 0 : 1))}/3`, last ? lapTxt(last) : '-', k.best ? lapTxt(k.best) : '-'].forEach((s, i) => words(x, s, [50, 220, 420, 520, 660][i], y, i === 4 && k.best && k.best <= Math.min(me.best || 99, op.best || 99) ? "700 22px Consolas, monospace" : "600 22px 'Segoe UI', Arial", i === 4 && k.best && k.best <= Math.min(me.best || 99, op.best || 99) ? '#c77dff' : '#fff')); });
    });
  }
  _finish() {
    const me = this.me, f = this.opp.first, won = this.first === me, other = won ? this.op : me, gap = other.done ? Math.abs(this.op.finish - me.finish).toFixed(2) : null;
    this.end(won, won ? `Beat ${f} over three laps of the karting${gap ? ` by ${gap} s` : ''}.` : `${f} won the karting${gap ? ` by ${gap} s` : ''}.`, me.finish, this.op.finish);
  }
  dispose() {
    super.dispose(); this.eng.stop(); this.T.lights.forEach((m) => m.color.set('#2a0806'));
    for (const k of [this.me, this.op]) { this.ev.scene.remove(k.obj.group); k.obj.group.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } }); }
    if (this.opp.person && !this.opp.gone) this.opp.person.group.visible = true;
  }
}

// ---- cooking at the island: stir, flip, plate up - each a tap in time -----------------------------------------------------
const DISHES = ['lemon and herb chicken with greens', 'a mushroom risotto', 'prawn linguine with chilli and lemon', 'a proper vegetable stir-fry', 'gnocchi with brown butter and sage'];
class Cooking extends Game {
  constructor(ev, opp) {
    super(ev, opp, 'cooking', 'DINNER'); const H = this.H = ev.V.hob;
    this.step = 'stir'; this.taps = []; this.ph = 0; this.heat = 0; this.flipG = 0; this.plateG = 0; this.wait = 0.8; this.anim = 0; this.flipT = -1; this.plateT = -1;
    this.dish = opp.id === 'maya-lindqvist' ? 'pan-fried salmon with dill and new potatoes' : pick(DISHES);
    this.cols = ['#f0d8b0', '#e8c890', '#7aa84a', '#f2e6c8', '#d89060', '#5a8a3a', '#f4e8d0', '#c8a070', '#9ac860'].map((c) => new THREE.Color(c)); this.gold = new THREE.Color('#b8743a'); this.burnt = new THREE.Color('#3a2414');
    this.pcs = []; for (let i = 0; i < 9; i++) { const a = Math.random() * 6.28, r = 0.02 + Math.random() * 0.075; this.pcs.push({ a, r, y: 0, sx: 0, sz: 0 }); }
    this._m = new THREE.Matrix4(); this._c = new THREE.Color(); this._sc = V3(1.2, 0.7, 1.0);
    H.food.visible = true; H.ring.color.set('#ff3a1a'); this._paint(0);
    const n = 16, P = new Float32Array(n * 3); this.steam = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(P, 3)), new THREE.PointsMaterial({ map: ev.K.soft, color: '#ffffff', size: 0.09, transparent: true, opacity: 0.22, depthWrite: false }));
    this.steamS = Array.from({ length: n }, () => Math.random()); this.steam.frustumCulled = false; ev.scene.add(this.steam);
    this.back = { x: H.eye.x, z: H.eye.z + 0.05, yaw: -Math.PI / 2 };
    ev._mgHelp('Space when the marker is in the green · stir, flip, plate up · Q to stop'); this._hud();
  }
  _hud() { const lab = { stir: `1 · STIR  (${this.taps.length}/3)`, flip: '2 · FLIP IT WHEN IT IS GOLDEN', plate: '3 · PLATE UP', done: 'SERVED' }[this.step]; this.ev._mg(lab, `${this.dish} for ${this.opp.first}`); }
  info() { return { step: this.step, taps: this.taps.slice(), flip: this.flipG, plate: this.plateG }; }
  _paint(heat) { const H = this.H; for (let i = 0; i < 9; i++) { const c = this._c.copy(this.cols[i]); if (heat > 0) { if (heat < 0.7) c.lerp(this.gold, heat / 0.7 * 0.8); else c.copy(this.gold).lerp(this.burnt, clamp((heat - 0.7) / 0.3, 0, 1)); } H.food.setColorAt(i, c); } if (H.food.instanceColor) H.food.instanceColor.needsUpdate = true; }
  /** a tap graded against the green (and the gold within it) -> 1 | 0.7 | 0.25 */
  _grade(v, g0, g1, a0, a1) { return v >= a0 && v <= a1 ? 1 : v >= g0 && v <= g1 ? 0.7 : 0.25; }
  _say(g) { this.ev._big(g >= 1 ? 'PERFECT' : g >= 0.7 ? 'GOOD' : 'MESSY', '', g >= 1 ? 'gold' : g >= 0.7 ? 'good' : 'bad', 0.6); this.ev.snd.pop(g >= 0.7); }
  key(c, down) {
    super.key(c, down); if (!down || c !== 'Space' || this.wait > 0) return;
    if (this.step === 'stir') { const m = 0.5 + 0.5 * Math.sin(this.ph * Math.PI * 2 * 0.9), g = this._grade(m, 0.38, 0.62, 0.46, 0.54); this.taps.push(g); this._say(g); for (const p of this.pcs) p.a += 0.9 + Math.random() * 0.4; this.anim = 0.35; if (this.taps.length >= 3) { this.step = 'flip'; this.wait = 0.7; this.heat = 0; } this._hud(); }
    else if (this.step === 'flip' && this.flipT < 0) { this.flipG = this._grade(this.heat, 0.58, 0.78, 0.65, 0.71); this._say(this.flipG); this.flipT = 0; }
    else if (this.step === 'plate' && this.plateT < 0) { const m = 0.5 + 0.5 * Math.sin(this.ph * Math.PI * 2 * 1.4); this.plateG = this._grade(m, 0.42, 0.58, 0.48, 0.52); this._say(this.plateG); this.plateT = 0; }
  }
  update(dt) {
    this.t += dt; const H = this.H; this.view(H.eye, H.look, dt, 4, 46);
    if (this.wait > 0) this.wait -= dt; else this.ph += dt;
    if (this.step === 'stir') this.ev._meter({ mark: 0.5 + 0.5 * Math.sin(this.ph * Math.PI * 2 * 0.9), zones: [[0.38, 0.62], [0.46, 0.54, 'gold']] });
    else if (this.step === 'flip') {
      if (this.flipT < 0 && this.wait <= 0) { this.heat = Math.min(1, this.heat + dt / 3.6); this._paint(this.heat); if (this.heat >= 1) { this.flipG = 0.1; this._say(0.1); this.flipT = 0; } }
      this.ev._meter({ fill: this.heat, zones: [[0.58, 0.78], [0.65, 0.71, 'gold']] });
      if (this.flipT >= 0) { this.flipT += dt; if (this.flipT > 0.7) { this.step = 'plate'; this.wait = 0.6; this.ph = 0; this._hud(); } }
    } else if (this.step === 'plate') {
      this.ev._meter(this.plateT < 0 ? { mark: 0.5 + 0.5 * Math.sin(this.ph * Math.PI * 2 * 1.4), zones: [[0.42, 0.58], [0.48, 0.52, 'gold']] } : null);
      if (this.plateT >= 0) { this.plateT += dt; if (this.plateT > 1.6) this._serve(); }
    }
    // the food: swirled by a stir, tossed by the flip, slid on to the plate
    const P = this.H.pan.position, Q = this.H.plate, up = this.flipT >= 0 && this.flipT < 0.55 ? Math.sin((this.flipT / 0.55) * Math.PI) * 0.17 : 0, pl = this.plateT >= 0 ? ss(0, 0.6, this.plateT) : 0;
    this.anim = Math.max(0, this.anim - dt);
    this.pcs.forEach((p, i) => {
      const sw = this.anim > 0 ? (this.anim / 0.35) * 0.04 : 0, x = Math.cos(p.a + sw * 3) * p.r, z = Math.sin(p.a + sw * 3) * p.r, j = 0.004 * Math.sin(this.t * 12 + i);
      const wx = P.x + x + (Q.x + x * 0.8 - P.x - x) * pl, wz = P.z + z + (Q.z + z * 0.8 - P.z - z) * pl, wy = P.y + 0.028 + j * (1 - pl) + up * (0.8 + 0.4 * Math.sin(i)) + (Q.y + 0.025 - P.y - 0.028) * pl + Math.sin(pl * Math.PI) * 0.08;
      this._m.makeRotationY(p.a + up * 6).scale(this._sc).setPosition(wx, wy, wz); H.food.setMatrixAt(i, this._m);
    });
    H.food.instanceMatrix.needsUpdate = true;
    const A = this.steam.geometry.attributes.position; for (let i = 0; i < this.steamS.length; i++) { this.steamS[i] = (this.steamS[i] + dt * (0.35 + (i % 3) * 0.1)) % 1; const s = this.steamS[i]; A.setXYZ(i, P.x + Math.sin(i * 2.3 + s * 3) * 0.06, P.y + 0.05 + s * 0.45, P.z + Math.cos(i * 1.7) * 0.06); } A.needsUpdate = true;
    this.steam.material.opacity = 0.08 + 0.2 * (this.step === 'flip' ? this.heat : 0.5);
  }
  _serve() {
    if (this.step === 'done') return; this.step = 'done'; this.H.ring.color.set('#2a0a06');
    const st = this.taps.reduce((s, g) => s + g, 0) / Math.max(1, this.taps.length), q = st * 0.35 + this.flipG * 0.4 + this.plateG * 0.25, f = this.opp.first, chef = this.opp.id === 'maya-lindqvist';
    const verdict = q >= 0.85 ? 'properly good' : q >= 0.6 ? 'really good, actually' : q >= 0.4 ? 'edible, mostly' : 'a brave attempt';
    this.ev._bark(this.opp, chef ? (q >= 0.8 ? "Okay. That's good. I'm annoyed by how good that is." : q >= 0.5 ? 'Not bad. More salt next time. And more confidence.' : 'Thank you. Really. Shall I help next time?') : q >= 0.8 ? pick(["Wait - you can cook? Since when?", 'This is really good.', "I'm stealing this recipe."]) : q >= 0.5 ? pick(['Nice. Honestly.', 'Good. Really good.']) : pick(["It's... the thought that counts.", 'Ha. Shall we order something as well?']));
    this.end(q >= 0.6, `Cooked ${this.dish} for ${f}: ${verdict}.`, Math.round(q * 100), 0);
  }
  dispose() { super.dispose(); this.ev.scene.remove(this.steam); this.steam.geometry.dispose(); this.steam.material.dispose(); this.H.ring.color.set('#2a0a06'); }
}

// ---- the arcade cabinet: Night Run, three lanes of traffic and getting faster ---------------------------------------------
class Arcade extends Game {
  constructor(ev, opp) {
    super(ev, opp, 'arcade', 'NIGHT RUN'); this.A = ev.V.arcade; this.scr = this.A.scr;
    this.lane = 1; this.lx = 1; this.obs = []; this.dist = 0; this.sp = 1; this.lives = 3; this.inv = 0; this.spawn = 0.9; this.phase = 'intro'; this.pt = 0; this.acc = 0; this.score = 0; this.scroll = 0;
    this.hi = Math.round((2200 + skillOf(opp, 'arcade') * 2600) / 10) * 10; this.hiName = (opp.first || 'AAA').slice(0, 3).toUpperCase();
    this.back = { x: -5.0, z: 0.4, yaw: Math.PI };
    ev._mgHelp('A / D (or the arrows) to change lanes · dodge the traffic · Q to stop'); this._hud();
  }
  _hud() { this.ev._mg(`SCORE ${this.score}  ·  HI ${this.hi} ${this.hiName}`, this.phase === 'run' ? `${'♥'.repeat(Math.max(0, this.lives))}  ·  ${Math.max(0, 40 - this.pt).toFixed(0)} s` : `beat ${this.opp.first}'s high score`); }
  info() { return { phase: this.phase, score: this.score, hi: this.hi, lives: this.lives }; }
  key(c, down) { super.key(c, down); if (!down || this.phase !== 'run') return; if (c === 'KeyA' || c === 'ArrowLeft') this.lane = Math.max(0, this.lane - 1); if (c === 'KeyD' || c === 'ArrowRight') this.lane = Math.min(2, this.lane + 1); }
  update(dt) {
    this.t += dt; this.view(this.A.eye, this.A.look, dt, 4, 38);
    if (this.phase === 'intro') { this.pt += dt; if (this.pt > 1.8) { this.phase = 'run'; this.pt = 0; } }
    else if (this.phase === 'run') {
      this.pt += dt; this.sp = 1 + this.pt / 22; this.dist += dt * this.sp; this.score = Math.floor(this.dist * 60); this.scroll += dt * 220 * this.sp; this.lx += (this.lane - this.lx) * Math.min(1, dt * 14);
      this.spawn -= dt;
      if (this.spawn <= 0) { this.spawn = Math.max(0.32, 0.9 - this.pt * 0.015) * (0.7 + Math.random() * 0.6); const free = [0, 1, 2].filter((l) => !this.obs.some((o) => o.l === l && o.y < 70)); if (free.length > 1) this.obs.push({ l: pick(free), y: -30, c: pick(['#ff3b30', '#ffd34d', '#47ff9a', '#3ad7ff', '#ff4fa8']) }); }
      for (let i = this.obs.length - 1; i >= 0; i--) { const o = this.obs[i]; o.y += dt * 150 * this.sp; if (o.y > 280) this.obs.splice(i, 1); }
      if (this.inv > 0) this.inv -= dt;
      else for (const o of this.obs) if (Math.abs(o.l - this.lx) < 0.5 && Math.abs(o.y - 196) < 26) { this.lives--; this.inv = 1.2; this.ev.snd.hit(300, 0.12, 0.15); o.y = 400; if (this.lives <= 0) { this.phase = 'over'; this.pt = 0; } break; }
      if (this.pt > 40 && this.phase === 'run') { this.phase = 'over'; this.pt = 0; }
    } else if (this.phase === 'over') {
      this.pt += dt;
      if (this.pt > 2.4) { const won = this.score > this.hi, f = this.opp.first; this.end(won, won ? `Set a new high score on Night Run (${this.score}), beating ${f}'s ${this.hi}.` : `Scored ${this.score} on Night Run; ${f}'s ${this.hi} still stands.`, this.score, this.hi); }
    }
    this.acc += dt; if (this.acc >= 1 / 30) { this.acc = 0; this._paint(); this._hud(); }
  }
  _paint() {
    const S = this.scr, x = S.x, w = S.w, h = S.h, lx = (l) => 110 + l * 50;
    x.fillStyle = '#12061f'; x.fillRect(0, 0, w, h); x.fillStyle = '#232028'; x.fillRect(80, 0, 160, h);
    x.fillStyle = '#ff4fa8'; x.fillRect(78, 0, 3, h); x.fillRect(239, 0, 3, h);
    x.fillStyle = '#d8d8e0'; for (const lx2 of [135, 185]) for (let y = -40 + (this.scroll % 40); y < h; y += 40) x.fillRect(lx2 - 1, y, 2, 20);
    for (let i = 0; i < 6; i++) { x.fillStyle = '#3ad7ff'; x.fillRect(20 + (i % 2) * 260, ((i * 53 + this.scroll * 0.7) % (h + 40)) - 20, 22, 30); }
    for (const o of this.obs) { const ox = lx(o.l); x.fillStyle = o.c; x.fillRect(ox - 14, o.y - 22, 28, 44); x.fillStyle = '#111'; x.fillRect(ox - 10, o.y - 12, 20, 10); x.fillStyle = '#ff2a1a'; x.fillRect(ox - 13, o.y + 18, 6, 3); x.fillRect(ox + 7, o.y + 18, 6, 3); }
    if (this.phase !== 'over' && !(this.inv > 0 && Math.floor(this.inv * 10) % 2)) { const px = 110 + this.lx * 50; x.fillStyle = '#ff4fa8'; x.fillRect(px - 14, 174, 28, 44); x.fillStyle = '#ffd6ec'; x.fillRect(px - 10, 180, 20, 9); x.fillStyle = '#fff7b0'; x.fillRect(px - 13, 172, 6, 3); x.fillRect(px + 7, 172, 6, 3); }
    x.fillStyle = 'rgba(0,0,0,.6)'; x.fillRect(0, 0, w, 20); x.font = "bold 12px 'Courier New', monospace"; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillStyle = '#fff'; x.fillText(`SCORE ${String(this.score).padStart(5, '0')}`, 6, 10); x.textAlign = 'right'; x.fillStyle = '#ffd34d'; x.fillText(`HI ${this.hiName} ${this.hi}`, w - 6, 10);
    x.textAlign = 'left'; x.fillStyle = '#ff4fa8'; x.fillText('♥'.repeat(Math.max(0, this.lives)), 6, h - 10);
    if (this.phase !== 'run') { x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(40, 80, 240, 80); x.textAlign = 'center'; x.font = "bold 22px 'Courier New', monospace"; x.fillStyle = this.phase === 'intro' ? '#3ad7ff' : this.score > this.hi ? '#47ff9a' : '#ff4fa8'; x.fillText(this.phase === 'intro' ? 'NIGHT RUN' : this.score > this.hi ? 'NEW HIGH SCORE' : 'GAME OVER', w / 2, 108); x.font = "bold 12px 'Courier New', monospace"; x.fillStyle = '#fff'; x.fillText(this.phase === 'intro' ? (Math.floor(this.t * 3) % 2 ? 'A / D  TO  DODGE' : `HI  ${this.hiName}  ${this.hi}`) : `SCORE ${this.score}`, w / 2, 136); }
    S.tex.needsUpdate = true;
  }
}

// =====================================================================================================================
// the evening
// =====================================================================================================================
/** a track id from an id, a name or a track (its def); else the career's next race */
const trackIdOf = (t, c) => {
  const v = t && typeof t === 'object' ? t.def?.id || t.id : t;
  if (v && TRACK[v]) return v; if (typeof v === 'string' && /vegas/i.test(v)) return 'lasvegas'; if (typeof v === 'string' && /silver/i.test(v)) return 'silverstone';
  return c?.calendar?.length ? c.calendar[(c.round - 1) % c.calendar.length] : v || null;
};
// (a driver's friendship stage as the tag shows it; how a taste reads when it is noticed - lightly, and only ever the game's)
const FRIEND = { acquaintance: 'Acquaintance', friendly: 'Friendly', friend: 'Friend', mate: 'Mate', best: 'Best mate' };
const TASTE_WORD = { gaming: 'a game or two', food: 'good food', music: 'the music', competition: 'a bit of competition', quiet: 'somewhere quieter', views: 'a view', coffee: 'a good coffee' };
const GAME_TASTE = { pool: ['competition'], darts: ['competition'], sim: ['competition', 'gaming'], arcade: ['gaming'], karting: ['competition'], cooking: ['food'] };
// (the last thing said as you leave)
const GOODNIGHT = {
  driver: { good: ['Good night, this. Same again soon.', 'Cheers for tonight. See you in the paddock.', "Proper night. Don't tell the team how late it got."], ok: ['Right. See you at the track.', 'Night. Safe trip home.'], bad: ['Night.', 'See you at the track, I suppose.'] },
  celeb: { good: ['This was lovely. Text me when you get in.', 'Thank you for tonight. Really.', "I had the best time. Don't make me wait for the next one."], ok: ['That was nice. Good night.', 'Thanks for tonight.'], bad: ['Good night.', "I'll get a car. Night."] },
  quiet: ['Thanks for this. Take care of yourself.', "I'm glad we did this. Look after yourself this week.", 'Thank you. Really.'],
};
const BUZZ_LINES = ['Thinking of you. Call me later?', 'Are you free this weekend?', 'Saw the replay. Proud of you x', 'Miss you. When are you back?', 'Are we still on for Thursday?'];
const MOMENT_WHERE = { rooftop: 'at the glass over the Strip', pub: 'watching the rain', simlounge: 'looking out over the city', apartment: 'on the balcony', restaurant: 'at the window over the river', coffee: 'watching the rain' };
const HELMETS = ['#f2f2f2', '#1a1a1a', '#f0b020', '#1f4fa8', '#c8102e', '#2e9e5a'];
// (the keys the evening uses: walking, looking, E, F, Q, Esc, Space, Enter, the answers)
const OWN_KEYS = /^(Key[WASDEFQLCG]|Arrow(Up|Down|Left|Right)|Shift(Left|Right)|Space|Escape|Enter|NumpadEnter|Digit[1-6]|Numpad[1-6])$/;   // (affection hook: G, get close)
const MOOD_TINT = { 'Late night': '#7a6cff', 'Late session': '#7a6cff', 'Low and slow': '#ff9a50', 'Supper club': '#ffcf8a' };
// party hook: what ui/PartyVenues.js's builders are handed (ev.lib) - this module's own furniture and light, so they import nothing from it
const LIB = { shell, wallRun, windowIn, screen, bottles, sofa, rectTable, roundTable, stool, chair, plant, tree, pendant, buildingMass, roomPatch, ROOM };
// party hook: a person's role as a name tag says it, and the drink a principal holds (hand drinks: one set of geometry for the room)
const ROLE_WORD = { rep: 'Sponsor', agent: 'Driver manager', press: 'Columnist', infl: 'Influencer', boss: 'Team principal', eng: 'Race engineer', dj: 'DJ', bartender: 'Bar', security: 'Security', antagonist: '' };
const UNSEALED_ZONES = new Set(['quiet', 'vestibule']);

class Evening {
  constructor(o) {
    this.o = o; this.c = o.c || null; this.audio = o.audio || null; this.snd = new Sound(this.audio);
    // (hosted: the game's own scene, camera and renderer; anything less and it opens its own, as the fallback)
    const H = o.host; this.host = H && H.scene?.isScene && H.camera?.isPerspectiveCamera && H.renderer ? H : null;
    this.vid = venueKey(o.venue); this.P = PLACES[this.vid]; this.vary = null; this.trackId = trackIdOf(o.track ?? this.host?.trackId, this.c); this.night = (o.night ?? this.host?.night) !== false;
    // party hook: an after-party (ui/PartyVenues.js) runs on its own clock for the circuit just raced - the launch's own
    // start, close and last call win (a second act starts when the first one ended) - and winds down at its late hour
    this.isParty = isPartyVenue(this.vid) && (this.vid !== 'poolclub' || o.key === 'party');   // (the pool club is an ordinary evening too: a party only when launched as one)
    if (this.isParty) { this.P = { ...this.P, ...(partyClock(this.vid, this.trackId) || {}) }; for (const f of ['start', 'close', 'lastCall']) if (o[f] != null && Number.isFinite(+o[f])) this.P[f] = +o[f]; }
    this.lateT = this.isParty ? Math.max(30, ((this.P.late - this.P.start) * 3600) / (this.P.rate || RATE)) : LATE; this.closeT = this.isParty ? Math.max(90, ((this.P.close - this.P.start) * 3600) / (this.P.rate || RATE)) : CLOSE;
    this.privacy = o.venue && typeof o.venue === 'object' && typeof o.venue.privacy === 'number' ? o.venue.privacy : this.P.privacy;
    // party hook: a party's principals (P.cap), its two 'present' drivers (one word each) and the DJ when she is someone
    // to talk to; its other people - security, a resident DJ, the bartender, the drama's antagonist - are its cast
    const G0 = (Array.isArray(o.guests) ? o.guests : []).filter(Boolean);
    this.gs = (this.isParty ? this._partyPick(G0) : G0.slice(0, 3)).map((g, i) => this._partyFill(this._guest(g, i), g));
    this.x = this._context(); this.quiet = !!this.x.grave || !!o.quiet;
    // (what the evening calls for: the place's own - and a nightlife venue's some nights a club night (o.occasion: 'club'
    // or 'evening' to choose), by the evening's own seed: who came and when; a quiet one never)
    this.occ = (() => {
      const base = OCCASION[this.vid] || 'casual'; if (!NIGHTLIFE.has(this.vid) || this.quiet) return base;
      if (o.occasion === 'club' || o.occasion === 'evening') return o.occasion; if (!this.night) return base;
      let h = 7; for (const ch of `${this.c?.season || 0}|${this.c?.round || 0}|${this.gs.map((g) => g.id || g.name).join(',')}|club`) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      return (h >>> 3) % 2 ? 'club' : base;
    })();
    // party hook: what the night calls for - a club's clubwear (or evening wear), the team's party what she wore at the circuit
    if (this.isParty) this.occ = this.vid === 'poolclub' ? poolOccasion() : partyOccasion(this.vid, this.P.night !== false);
    // wardrobe hook: some warm nights the roof's a pool night round its plunge pool (o.poolNight to choose; by the
    // evening's own seed, one in three; never a quiet one) - a few of the stars in a cover-up over their swimwear
    // (_makeGuest: career/Celebs.js wear.pool, o.cover)
    this.poolNight = this.vid === 'rooftop' && !this.isParty && !this.quiet && this.night && (typeof o.poolNight === 'boolean' ? o.poolNight : (() => { let h = 11; for (const ch of `${this.c?.season || 0}|${this.c?.round || 0}|${this.gs.map((g) => g.id || g.name).join(',')}|pool`) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return (h >>> 5) % 3 === 0; })());
    const me = this.c?.drivers?.[this.c.playerId], team = this.c?.teams?.[this.c?.myTeam];
    // (you as your save has you: your race suit's own colour if your look has one, your own helmet's colour)
    this.meName = me?.name || 'You'; this.myColor = team?.color || '#c8102e'; this.mySuit = lookOfMe(this.meName).suit?.primary || team?.color || '#22324a'; this.helmet = me?.helmet || null; this.kartColor = '#c8102e';
    this.R = { moments: [], tones: {}, games: [], seen: false, flashes: 0, selfies: 0, photo: null, orders: 0, toasts: 0, moment: false, buzz: null, buzzFrom: null, cover: 0, confess: false, flirt: 0, fx: { flirt: 0, charm: 0, deep: 0, cover: 0, confess: 0, invite: 0, network: 0, loose: 0, provoke: 0, dance: 0, together: 0, kiss: 0 }, walkedOut: null, mood: null, exposure: 0, tv: false };
    this.tasted = new Set(); this.usedAll = []; this.t = 0; this.tl = 0; this.clock = this.P.start; this.ready = false; this.on = true; this.revealed = false; this.closing = false;
    this.keys = new Set(); this.pos = V3(0, 1.66, 0); this.yaw = 0; this.pitch = -0.06; this.bob = 0; this.seat = null; this.drag = false;
    this.talk = null; this.menu = null; this.game = null; this.moment = null; this.ask = null; this.buzzE = null; this.subT = 0; this.bigT = 0; this.photoT = 0; this.helpT = 14; this.chatT = 8 + Math.random() * 6; this.papT = -1; this.lastG = null;
    // party hook: the after-party's play layer (ui/PartyPlay.js), made before the page (it sets x.party and R.party)
    this.party = null; this.cast = {}; this.crowd = null; this.zone = ''; this.zoneMix = 0;
    if (this.isParty && o.key === 'party') { try { this.party = new PartyPlay(this, o); } catch (e) { console.warn('Hangout: the party could not start', e); this.party = null; } }
    // affection hook: getting close, and the drink (ui/Affection.js) - after PartyPlay, whose night it reads
    this.aff = null; if (AFFECTION_ON) try { this.aff = new Affection(this, o); } catch (e) { console.warn('Hangout: affection could not start', e); this.aff = null; }
    this.buzzAt = this._buzzPlan(); this._v = V3(); this._w = V3(); this._c0 = V3(); this._c1 = V3(); this._c2 = V3(); this.prHtml = null; this.clockTxt = '';
    // (the page and the renderer now; the place on the first frame, behind the cover, then the people one a frame; if the
    // opening fails half-way, whatever was done is undone - the world's camera, the group in its scene - before it throws)
    this.hots = []; this.queue = [() => this._build()];
    try { this._dom(); this._three(); this._input(); } catch (e) { this._dispose(); throw e; }
    this.api = this._api(); window.__hangout = this.api;
    if (!this.host) this._loop();
  }
  // ---- who came, and the evening as the talk reads it -----------------------------------------------------------------
  _guest(g, i) {
    // (party hook: a 'person' - a sponsor's rep, an agent, the diarist, the influencer, the team principal - with a 'p:' or 'x:' cid of its own)
    const kind = g.kind === 'celeb' || g.kind === 'star' ? 'celeb' : g.kind === 'person' ? 'person' : 'driver', id = g.id || g.celebId || null, C = kind === 'celeb' ? Celebs.CELEB?.[id] || null : null;
    const d = kind === 'driver' && id ? this.c?.drivers?.[id] : null, team = g.team || d?.team || null, T = team && this.c?.teams ? this.c.teams[team] : null;
    const name = g.name || C?.name || d?.name || (kind === 'celeb' ? 'Your date' : 'A friend');
    return { i, kind, id, cid: g.cid || (kind === 'celeb' ? 'c:' : kind === 'person' ? 'p:' : 'd:') + (id || name), name, first: g.first || firstOf(name), team, C, look: g.look || null,
      color: g.color || T?.color || C?.look?.outfit || '#3a4150', color2: g.color2 || T?.color2 || C?.look?.accent || '#e8e8e8',
      dm: 0, talks: 0, used: [], fx: {}, cheers: false, offended: false, shaken: 0, gone: false, wins: 0, losses: 0, taste: 0, person: null, spot: null, n: null, face0: 0, hy: 0, hz: 0, nod: 0, glance: 0, glanceAt: null, ph: Math.random() * 10, drink: null, disc: null };
  }
  _context() {
    const o = this.o, gs = this.gs, base = { venue: { id: this.vid, name: this.P.name, privacy: this.privacy }, guests: gs.map((g) => ({ kind: g.kind, id: g.id, name: g.name, team: g.team })), track: this.trackId, night: this.night, privacy: this.privacy, secret: !!o.secret, grave: !!(o.grave || o.quiet), isParty: !!this.isParty };
    let x = null;
    try { if (typeof HT.hangoutEvening === 'function') x = HT.hangoutEvening(this.c, base); } catch (e) { console.warn('Hangout: could not read the evening', e); }
    if (!x) x = { venue: this.vid, track: TRACK[this.trackId] || null, night: this.night, privacy: this.privacy, others: gs.map((g) => g.name), guests: gs.length, grave: base.grave, secret: base.secret, lastPos: null, lastDnf: false, points: 0, crisis: null, partner: false, partnerId: null, partnerName: null, seeing: 0 };
    x.venueName = this.P.name; x.date = gs.length === 1 && gs[0].kind === 'celeb';
    for (const g of gs) {
      let n = null; try { if (typeof HT.hangoutGuest === 'function') n = HT.hangoutGuest(this.c, { kind: g.kind, id: g.id, name: g.name, team: g.team, ...(g.role ? { cid: g.cid, role: g.role, real: g.real, brand: g.brand, why: g.why, clients: g.clients } : {}) }, x); } catch (e) { console.warn('Hangout: could not read a guest', e); }
      g.n = n || { kind: g.kind, id: g.id, name: g.name, first: g.first, team: g.team }; g.n.talks = 0;
      if (g.kind === 'celeb' && g.C) { g.n.celebId = g.n.celebId || g.id; g.n.job = g.n.job || g.C.job; g.n.work = g.n.work || g.C.work; }
    }
    return x;
  }
  /** when (if ever) your phone buzzes tonight: on a date, while you are seeing someone else as well -> seconds | null */
  _buzzPlan() {
    const force = !!flag('__hangoutBuzz');
    // (party hook: at a party the buzz is about whoever PartyPlay says - the star you came with - or nobody)
    const her = this._buzzHer();
    if (this.quiet || (!this.party && !this.x.date) || !her) return null;
    let others = []; try { others = (typeof Celebs.seeing === 'function' && this.c ? Celebs.seeing(this.c) : []).filter((id) => id !== her.id); } catch (_) { others = []; }
    this.buzzOther = others.length ? pick(others) : null;
    if (!force && (!others.length || Math.random() > (this.x.secret || her.n?.secret ? 0.85 : 0.55))) return null;
    return force ? 30 : 70 + Math.random() * 100;
  }
  /** the line under a guest's name: how you stand with them and who they are */
  _sub(g) {
    const n = g.n || {};
    // (party hook: the career's own line for the tag - who they are and why they matter - else a person's role)
    if (g.why) return g.why;
    if (this.party?.why) { try { const w = this.party.why(g); if (w) return w; } catch (_) { /* the evening's own line */ } }
    if (g.kind === 'person') return [ROLE_WORD[g.role] || '', g.team && this.c?.teams?.[g.team]?.name].filter(Boolean).join(' · ');
    if (g.kind === 'celeb') { const st = n.stage && typeof Celebs.stageLabel === 'function' ? Celebs.stageLabel(n.stage) : ''; return [g.C?.job, st && st !== 'Not met' ? st : ''].filter(Boolean).join(' · '); }
    return [n.mate ? 'Your team-mate' : FRIEND[n.stage] || '', g.team].filter(Boolean).join(' · ');
  }

  // ---- party hook: the after-party's people, its room's zones and light (ui/PartyVenues.js builds the room, ui/PartyPlay.js
  // runs the night, world/PartyCrowd.js fills it) -----------------------------------------------------------------------
  /** a party's guest list -> those you can talk to (principals to P.cap, two 'present', the DJ when she is someone to talk to); the rest kept as the cast's specs */
  _partyPick(L) {
    const cap = this.P.cap || 8, out = [], spec = this.castSpec = {}; let np = 0, nq = 0;
    const tier = (g) => g.tier || (g.role === 'present' ? 'present' : ['dj', 'bartender', 'security'].includes(g.role) ? 'staff' : g.role === 'antagonist' ? 'reserved' : 'principal');
    for (const g of L) {
      const t = tier(g);
      if (t === 'principal') { if (np < cap) { out.push(g); np++; } }
      else if (t === 'present') { if (nq < (this.P.presentCap || 4)) { out.push(g); nq++; } }   // (up to four other drivers about the room: career/Party.js PRESENT_CLUB; extra ones take the friends' and the group's spots)
      else if (g.role === 'dj' && (g.talk ?? 0) > 0 && !spec.dj) { out.push(g); spec.dj = g; }
      else if (['dj', 'bartender', 'security', 'antagonist'].includes(g.role) && !spec[g.role]) spec[g.role] = g;
    }
    return out;
  }
  /** a guest with the party's fields: role, tier, real, age, soft drinks, the tag's line, talks left (a 'present' driver: one) */
  _partyFill(G, g) {
    if (!this.isParty) return G;
    const talk = g.talk ?? (g.tier === 'present' || g.role === 'present' ? 1 : 3);
    Object.assign(G, { role: g.role || 'friend', tier: g.tier || null, real: g.real ?? (G.kind === 'driver' && !g.fictional), fictional: !!g.fictional || g.real === false, age: g.age ?? null, soft: !!g.soft,
      why: g.why || null, brand: g.brand || null, clients: g.clients || null, stage: g.stage || null, talk, talks: clamp(3 - talk, 0, 3) });
    // (the team's own party: a driver in the team's kit, as they come from the debrief)
    if (this.P.host === 'team' && G.kind === 'driver' && !G.look) G.look = { kit: 'polo', color: G.color, accent: G.color2, legs: '#1c1f26' };
    return G;
  }
  /** who the phone's buzz is about: the star you came with (PartyPlay says), else the evening's own date */
  _buzzHer() { if (!this.party) return this.gs[0] || null; try { return this.party.buzzHer?.() || null; } catch (_) { return null; } }
  /** the party's cast (security, a resident DJ, the drama's antagonist - hidden until called), its crowd, PartyPlay's own steps: all queued behind the cover */
  _partyBuild(V) {
    const spec = this.castSpec || {}, cast = this.cast = {}, PP = V.people || {};
    this.taken = this.taken || new Set();
    if (V.staff && spec.bartender) { V.staff.name = spec.bartender.name || V.staff.name; if (spec.bartender.look) V.staff.look = { ...V.staff.look, ...spec.bartender.look }; }
    if (V.staff) this.queue.push(() => { const S = this.staff; if (!S) return; Object.assign(S, { first: firstOf(S.name), opts: V.staff.look, spot: { x: S.x, z: S.z, face: S.face, pose: 'stand', y: 0 } }); cast.bartender = S; });
    const dj = this.gs.find((g) => g.role === 'dj');
    if (dj) cast.dj = dj;
    else if ((spec.dj || PP.dj) && V.spots?.dj?.length) cast.dj = this._castMake({ ...(PP.dj || {}), ...(spec.dj || {}), look: { ...(PP.dj?.look || {}), ...(spec.dj?.look || {}) } }, 'dj', 0.6);
    if ((spec.security || PP.security) && V.spots?.security?.length) cast.security = this._castMake({ name: 'Security', ...(PP.security || {}), ...(spec.security || {}), look: { ...(PP.security?.look || {}), ...(spec.security?.look || {}) } }, 'security', 0.6);
    if (spec.antagonist) cast.antagonist = this._castMake(spec.antagonist, 'antagonist', 0.75, true);
    // (the crowd: its templates baked a couple a frame, then everyone stood in their place - nobody walks in later)
    if (V.crowdSpots?.length) {
      try {
        const B = this.o.brand ? brandLook(this.o.brand, this.vid) : null, T = this.c?.teams?.[this.c?.myTeam];
        // (a venue with a crowd of its own kind - the pool club's PoolCrowd, PartyCrowd's options - makes it: V.crowdMake)
        const co = { night: this.P.night !== false && this.night, bpm: V.beat?.bpm || this.P.bpm || 124, patch: this.host ? roomPatch : null, keepKey: 'hgKeep', lift: V.lift || 0.08 };
        const C = this.crowd = typeof V.crowdMake === 'function' ? V.crowdMake(co) : new PartyCrowd(co);
        this.scene.add(C.group);
        const spots = V.crowdSpots.filter((s) => !s.brand || B).map((s) => (s.pose === 'sit' ? { ...s, seat: true } : s.pose === 'lean' ? { ...s, lean: true } : s));
        const pools = { kind: this.P.host === 'team' ? 'team' : 'club', occ: 0.5, cam: { x: V.start.x, z: V.start.z }, ...(V.crowdPools || {}), ...(B ? { brand: { name: B.name, color: B.color, accent: B.color2 } } : {}), ...(T ? { team: { color: T.color, accent: T.color2 } } : {}) };
        for (const f of C.build(spots, pools) || []) this.queue.push(f);
      } catch (e) { console.warn('Hangout: the crowd could not be built', e); try { this.crowd?.dispose?.(); } catch (_) { /* */ } this.crowd = null; }
    }
    // (the terrace's own light, as colours ready to ease to)
    const Z = V.zoneLight?.quiet;
    if (Z && this.host) this._zl = { sky: new THREE.Color(Z.sky).multiplyScalar(Z.hemi), ground: new THREE.Color(Z.ground).multiplyScalar(Z.hemi), key: new THREE.Color(Z.key).multiplyScalar(Z.keyI), d0: ROOM.hgKeyDir.value.clone(), d1: V3(...(Z.keyDir || [0, 1, 0])).normalize().applyQuaternion(this.scene.quaternion), world: Z.world ?? 0.5, world0: ROOM.hgWorld.value };
    try { for (const f of this.party?.steps?.() || []) this.queue.push(f); } catch (e) { console.warn('Hangout: the party could not queue its steps', e); }
  }
  /** one of the cast (security, a resident DJ, the antagonist): a guest-shaped person (a talk can open with him), placed by role, built behind the cover */
  _castMake(s, role, detail = 0.6, hidden = false) {
    const g = this._partyFill(this._guest({ kind: 'person', ...s }, -1), { ...s, role, talk: s.talk ?? 0 });
    g.spot = spotFor(this.V, role, this.taken) || this.V.group[0]; g.cast = true; g.hidden = hidden;
    let n = null; try { if (typeof HT.hangoutGuest === 'function') n = HT.hangoutGuest(this.c, { kind: g.kind, id: g.id, name: g.name, team: g.team, cid: g.cid, role, real: g.real }, this.x); } catch (_) { n = null; }
    g.n = n || { kind: g.kind, id: g.id, name: g.name, first: g.first, team: g.team, role }; g.n.talks = 0;
    this.queue.push(() => this._castBuild(g, detail));
    return g;
  }
  _castBuild(g, detail) {
    const sp = g.spot, h = hash(g.name || g.cid);
    const o = { pose: g.role === 'security' ? 'cross' : 'talk', kit: 'blazer', color: '#16181c', accent: '#e8e6e0', legs: '#16181c', jitter: 0.01, detail, seed: g.cid };
    if (this.occ === 'club' && !g.look?.kit) Object.assign(o, clubOf(CLUB_KITS_M[h % CLUB_KITS_M.length], h));
    if (g.look) Object.assign(o, g.look);
    const p = makePerson(o); this._lift(p); p.group.position.set(sp.x, sp.y || 0, sp.z); p.group.rotation.y = sp.face; this.scene.add(p.group); this._hostLit(p.group);
    g.person = p; g.opts = o; g.face0 = sp.face; g.pose = o.pose;
    if (g.hidden) p.group.visible = false; else { g.disc = { x: sp.x, z: sp.z, r: 0.3, pp: 1 }; this.K.discs.push(g.disc); }   // (pp: a person - soft to your walk)
  }
  /**
   * A drink in a principal's hand, to suit them: champagne or a cocktail for the stars, a flute or a beer for a driver,
   * whisky for an agent, wine for the diarist - soft drinks for anyone under age; none for the DJ, the security or the
   * influencer (her phone). One set of geometry and materials for the room (two small draw calls a glass).
   */
  _partyDrink(g) {
    const p = g.person; if (!p?.wrR || g.drink || ['dj', 'security', 'infl', 'antagonist'].includes(g.role)) return;
    if (g.spot?.pose === 'sit' || !['talk', 'gesture', 'pose', 'drink', 'toast'].includes(g.pose)) return;
    const D = this._pd || (this._pd = this._partyDrinkKit()), h = hash(g.cid || g.name), team = this.P.host === 'team';
    const kind = g.soft ? 'soft' : g.kind === 'celeb' ? ['flute', 'coupe', 'flute', 'wine'][h % 4] : g.role === 'agent' ? 'tumbler' : g.role === 'press' ? 'wine' : g.role === 'eng' ? 'beer' : g.kind === 'driver' ? (team ? ['beer', 'flute', 'beer'][h % 3] : ['flute', 'beer', 'tumbler', 'flute'][h % 4]) : 'flute';
    const glass = { flute: 'flute', coupe: 'coupe', wine: 'wine', tumbler: 'tumbler', soft: 'tumbler', beer: 'beer' }[kind], liq = { flute: 'champ', coupe: 'cocktail', wine: 'wine', tumbler: 'whisky', soft: 'cola', beer: null }[kind];
    const grp = new THREE.Group(); grp.add(new THREE.Mesh(D.geo[glass], glass === 'beer' ? D.mat.bottle : D.mat.glass)); if (liq) grp.add(new THREE.Mesh(D.geo[glass + 'L'], D.mat[liq]));
    const s = p.group.children[0]?.scale?.x || 1, w = p.wrR.clone().multiplyScalar(s); grp.position.set(w.x + 0.02, w.y - (glass === 'beer' ? 0.09 : 0.11), w.z);
    p.group.add(grp); g.drink = grp; g.drinkKind = kind; this._hostLit(grp);
  }
  _partyDrinkKit() {
    const L = (pts, n = 14) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), n);
    const geo = {
      flute: L([[0, 0], [0.032, 0], [0.032, 0.004], [0.004, 0.012], [0.004, 0.09], [0.02, 0.1], [0.026, 0.15], [0.028, 0.215], [0.026, 0.215], [0.024, 0.15], [0.018, 0.106], [0, 0.102]]), fluteL: L([[0, 0.106], [0.018, 0.108], [0.023, 0.15], [0.0245, 0.185], [0, 0.185]], 10),
      coupe: L([[0, 0], [0.034, 0], [0.004, 0.01], [0.004, 0.105], [0.05, 0.16], [0.048, 0.16], [0, 0.11]]), coupeL: L([[0, 0.112], [0.043, 0.152], [0, 0.152]], 10),
      wine: L([[0, 0], [0.034, 0], [0.004, 0.01], [0.004, 0.085], [0.03, 0.105], [0.042, 0.155], [0.036, 0.2], [0.034, 0.2], [0, 0.095]]), wineL: L([[0, 0.097], [0.03, 0.108], [0.038, 0.135], [0, 0.135]], 10),
      tumbler: L([[0, 0], [0.037, 0], [0.039, 0.09], [0.036, 0.09], [0.033, 0.008], [0, 0.008]]), tumblerL: new THREE.CylinderGeometry(0.033, 0.032, 0.045, 12).translate(0, 0.031, 0),
      beer: L([[0, 0], [0.031, 0], [0.032, 0.115], [0.013, 0.165], [0.011, 0.205], [0.012, 0.21], [0, 0.21]]),
    };
    const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.25, ...o });
    const mat = { glass: M('#e8f2f6', { roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.36, depthWrite: false }), bottle: M('#4a2a0e', { roughness: 0.15 }), champ: M('#e8d27a', { transparent: true, opacity: 0.85 }), cocktail: M('#e0607a'), wine: M('#5a0f1e'), whisky: M('#b8742a', { transparent: true, opacity: 0.85 }), cola: M('#3a1a0c') };
    return { geo, mat };
  }
  /** where you stand (zone), and the terrace's light eased in as you step out */
  _partyZone(dt) {
    const V = this.V; if (!V) return;
    this.zone = V.zones ? zoneAt(V, this.pos.x, this.pos.z) : '';
    const want = this.zone === 'quiet' ? 1 : this.zone === 'vestibule' ? 0.4 : 0;
    this.zoneMix = dt > 0 ? this.zoneMix + (want - this.zoneMix) * Math.min(1, dt * 2.5) : want;
  }
  _partyUpdate(dt) {
    this._partyZone(dt);
    // (a raised deck, the steps up to it: the eye stays 1.66 m over whatever is underfoot)
    if (this.V?.heightAt && !this.seat && !this.moment) { const want = 1.66 + (this.V.heightAt(this.pos.x, this.pos.z) || 0); this.pos.y += (want - this.pos.y) * Math.min(1, dt * 12); }
    if (this.party) { try { this.party.update?.(dt); } catch (e) { if (!this.partyErr) console.warn('Hangout: the party frame failed', e); this.partyErr = (this.partyErr || 0) + 1; } }
    // (the crowd, driven here (PartyPlay sets its energy and calls arrive / near / flashes): its detail about the camera
    // - wherever a moment has put it - on the music's beat, as full as the clock and the mood make the room; and the
    // people in your way stepping aside as you walk through them, which slows you down)
    const C = this.crowd;
    if (C?.update) {
      const cp = this._toL((this._cl || (this._cl = V3())).copy(this.cam.position)), fw = this._cf || (this._cf = { x: 1, z: 0 });
      // (where the lens really looks, in the place's frame - a moment's or a scuffle's camera too: the crowd draws only
      // the people in front of it)
      const cd = this.cam.getWorldDirection(this._cd || (this._cd = V3())); if (this.host) cd.transformDirection(this.Mi); const ch = Math.hypot(cd.x, cd.z);
      if (ch > 1e-3) { fw.x = cd.x / ch; fw.z = cd.z / ch; } else { fw.x = Math.cos(this.yaw); fw.z = Math.sin(this.yaw); }
      C.zoneOnly = this.V?.club && this.zone === 'quiet' && !this.moment && !this.game ? 'quiet' : null;   // (a club's terrace or courtyard: its walls hide the room - never the team's glass unit)
      let beat, occ; try { beat = this.party?.beat?.t; occ = this.party?.occupancy; } catch (_) { beat = undefined; occ = undefined; }
      if (!Number.isFinite(occ)) occ = clamp(0.45 + 0.55 * ((this.clock - this.P.start) / 1.5), 0.3, 1);
      try { C.update(dt, cp, Number.isFinite(beat) ? beat : undefined, occ, fw); this.crowdSlow = !this.talk && !this.game && !this.moment && !this.seat && C.push ? C.push(this.pos.x, this.pos.z, 0.42) : 0; if (C.push && !this.game && !this.seat) C.push(this.pos.x, this.pos.z, this.talk || this.moment ? 1.05 : 0.85); /* (nobody at the lens: a step of room, more while you talk or a moment plays) */ } catch (e) { if (!this.crowdErr) console.warn('Hangout: the crowd frame failed', e); this.crowdErr = (this.crowdErr || 0) + 1; }
    }
  }
  /** hosted, after _roomSync: out on the terrace (or in the courtyard) its own light, not the club's wash */
  _partyRoom() {
    const Z = this._zl, k = this.zoneMix; if (!Z) return;
    if (k < 0.002) { ROOM.hgWorld.value = Z.world0; ROOM.hgKeyDir.value.copy(Z.d0); return; }
    ROOM.hgSky.value.lerp(Z.sky, k); ROOM.hgGround.value.lerp(Z.ground, k); ROOM.hgKey.value.lerp(Z.key, k);
    ROOM.hgKeyDir.value.copy(Z.d0).lerp(Z.d1, k).normalize(); ROOM.hgWorld.value = Z.world0 + (Z.world - Z.world0) * k;
  }
  /** may the world outside be hidden: a sealed venue ('all'; 'inside' unless you are out on its terrace or in the passage to it) - PartyPlay sets ev.unseal for a moment that needs the world */
  _sealed() {
    const s = this.P?.sealed; if (!this.isParty || !s || !this.V || this.disposed || this.unseal || !this.ready) return false;
    // (PartyPlay's own say as well: an exit out to the street, its terrace flag)
    let pp = true; try { if (this.party && 'seal' in this.party) pp = !!this.party.seal; } catch (_) { pp = true; }
    return pp && (s === 'all' ? true : !UNSEALED_ZONES.has(this.zone));
  }

  // ---- the page, the renderer, the place -------------------------------------------------------------------------------
  _dom() {
    const el = this.el = document.createElement('div'); el.id = 'hangout'; el.style.setProperty('--hc', this.P.hc);
    // (party hook: a night after a race has a room full - three names and how many more, so the bug never runs off the top)
    const N = this.gs.map((g) => g.name), withTxt = N.length > 4 ? ` · with ${N.slice(0, 3).join(', ')} and ${N.length - 3} more` : N.length ? ` · with ${N.length > 1 ? N.slice(0, -1).join(', ') + ' and ' + N[N.length - 1] : N[0]}` : '', where = this.P.name + (this.P.city ? ' · ' + this.P.city : '');
    // (hosted: the overlay is see-through over the game's canvas, and an empty pad in the canvas's place takes the mouse)
    if (this.host) el.classList.add('hosted');
    el.innerHTML = `${this.host ? '<div class="hg-pad" tabindex="-1"></div>' : '<canvas class="hg-3d" tabindex="-1"></canvas>'}<div class="hg-ui">
      <div class="hg-bug"><b>${esc(this.quiet ? 'A quiet coffee' : this.occ === 'club' ? 'Club night' : this.P.kind)}</b><i>${esc(where + withTxt)}</i><em>${hhmm(this.clock)}</em></div>
      <button class="hg-leave" type="button">LEAVE</button><div class="hg-dot"></div><div class="hg-tags"></div><div class="hg-toasts"></div>
      <div class="hg-sub"></div><div class="hg-prompt"></div>
      <div class="hg-talk"><div class="who"></div><div class="line"></div><div class="opts"></div><div class="next"></div></div>
      <div class="hg-mg"><b></b><span></span><small></small></div><div class="hg-meter"></div><div class="hg-aim"></div><div class="hg-big"><span></span><small></small></div><div class="hg-mgh"></div>
      <div class="hg-buzz"></div><div class="hg-ask"></div><div class="hg-bars"></div><div class="hg-cap"></div><div class="hg-flash"></div><div class="hg-photo"><img alt=""><p></p></div>
      <div class="hg-help"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> walk · <kbd>Shift</kbd> hurry · click or drag to look · <kbd>E</kbd> talk / use${this.quiet ? '' : ' · <kbd>F</kbd> cheers'}${this.aff ? ' · <kbd>G</kbd> get close' : ''} · <kbd>Q</kbd> call it a night</div>
    </div><div class="hg-cover"><p>${esc(this.P.name)}<small>${esc(this.quiet ? 'A quiet coffee' : (this.occ === 'club' ? 'Club night' : this.P.kind) + (this.P.city ? ' · ' + this.P.city : ''))}</small></p></div>`;
    document.body.appendChild(el);
    const $ = (s) => el.querySelector(s); this.$ = $; this.canvas = $(this.host ? '.hg-pad' : 'canvas'); this.cover = $('.hg-cover');
    this.tagEls = this.gs.map((g) => { const d = document.createElement('div'); d.className = 'hg-tag'; d.innerHTML = `${esc(g.name)}<small>${esc(this._sub(g))}</small>`; $('.hg-tags').appendChild(d); return d; });
    $('.hg-leave').addEventListener('click', () => { if (this.ready && !this.closing && !this.game) this._askLeave(); });
  }
  _three() {
    if (this.host) return this._hosted();
    const R = this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    R.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); R.toneMapping = THREE.ACESFilmicToneMapping; R.outputColorSpace = THREE.SRGBColorSpace;
    // (the graphics driver gave up on us: out at once with what there is, rather than a frozen room)
    this.canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); if (!this.disposed) { console.warn('Hangout: the WebGL context was lost'); this._abort(); } });
    this.scene = new THREE.Scene(); this.cam = new THREE.PerspectiveCamera(64, (innerWidth || 16) / (innerHeight || 9), 0.06, 2600); this.glc = this.canvas;
  }
  /**
   * Hosted: the game's renderer and camera (its fov, near and far kept, to be put back on the way out), and the place as
   * one group in the game's scene - standing at the anchor, its view (the glass, the windows) turned to the anchor's yaw.
   * Everything the evening does happens in the group's own frame; the camera is carried into the world's (_look).
   */
  _hosted() {
    const H = this.host, T = HOSTED[this.vid] || HOSTED.simlounge, cam = this.cam = H.camera;
    this.renderer = H.renderer; this.glc = H.renderer.domElement;
    this.camSave = { fov: cam.fov, near: cam.near, far: cam.far, zoom: cam.zoom, up: cam.up.clone(), pos: cam.position.clone(), quat: cam.quaternion.clone() };
    cam.up.set(0, 1, 0); cam.fov = 64; cam.near = T.near; cam.zoom = 1; cam.updateProjectionMatrix();
    this.hx = this._survey(); const A = this._place(T);
    const G = this.scene = new THREE.Group(); G.name = 'hangout'; G.position.set(A.x, A.y, A.z); G.rotation.y = A.rot; H.scene.add(G); G.updateMatrixWorld(true);
    this.M = G.matrixWorld.clone(); this.Mi = this.M.clone().invert(); this.ay = A.y; this.anchor = A;
    if (this.hx.sphereW) this.hx.sphere = this.hx.sphereW.clone().applyMatrix4(this.Mi);
    // (the talk's evening learns the real weather too: x.wet, for lines about the rain on the windows)
    this.x.wet = !!this.hx.wet;
  }
  /** hosted: what the world has that the place uses - the city's facade material, the Sphere (world position), whether it is raining -> hx */
  _survey() {
    const hx = { win: null, sphereW: null, sphere: null, wet: false };
    this.host.scene.traverse((o) => {
      if (o.name === 'buildings' && o.material?.uniforms?.uLitProb) hx.win = o.material;
      else if (o.name === 'lm:sphere' && !hx.sphereW) { const b = new THREE.Box3().setFromObject(o); if (!b.isEmpty()) hx.sphereW = b.getCenter(V3()); }
      else if (o.name === 'rain' && o.isPoints) hx.wet = !!o.visible;
    });
    return hx;
  }
  /**
   * Hosted: where the place stands and which way it looks. anchor { x, y, z, yaw }: its view faces world (sin yaw, 0, cos
   * yaw), i.e. yaw = atan2(tx - x, tz - z) for a point t to look at; anchor.look { x, z }, if given, is faced instead. The
   * roof is there for the Sphere: a yaw that would leave it well out of view is taken for a slip and the deck faces it.
   * -> { x, y, z, yaw, rot (the group's turn: the view side of its frame onto yaw) }
   */
  _place(T) {
    const A = this.host.anchor || {}, n = (v) => (v != null && Number.isFinite(+v) ? +v : 0), x = n(A.x), y = n(A.y), z = n(A.z);
    let yaw = n(A.yaw); if (A.look && A.look.x != null && A.look.z != null && Number.isFinite(+A.look.x) && Number.isFinite(+A.look.z)) yaw = Math.atan2(A.look.x - x, A.look.z - z);
    const S = this.hx.sphereW; if (S && T.face) { const want = Math.atan2(S.x - x, S.z - z); if (Math.abs(wrap(want - yaw)) > T.face) yaw = want; }
    return { x, y, z, yaw, rot: yaw + (T.view < 0 ? Math.PI : 0) };
  }
  /** a point of the place's frame into the world's (in place; unhosted they are the same) -> v */
  _toW(v) { return this.host ? v.applyMatrix4(this.M) : v; }
  /** a world point into the place's frame (in place) -> v */
  _toL(v) { return this.host ? v.applyMatrix4(this.Mi) : v; }
  /** the camera at p, looking at l (both in the place's frame) */
  _look(p, l) { const c = this.cam; if (!this.host) { c.position.copy(p); c.lookAt(l); return; } c.position.copy(p).applyMatrix4(this.M); c.lookAt(this._c2.copy(l).applyMatrix4(this.M)); }
  /** hosted: everything lit under o lit by the room, not by the world's floodlights (see roomLit) */
  _hostLit(o) { if (this.host && o) o.traverse((x) => { if (x.material) for (const m of [].concat(x.material)) roomLit(m); }); }
  /** hosted: the room's two lights as the mood has them, into the shared uniforms */
  _roomSync() { const h = this.hemi, s = this.sun; ROOM.hgSky.value.copy(h.color).multiplyScalar(h.intensity); ROOM.hgGround.value.copy(h.groundColor).multiplyScalar(h.intensity); ROOM.hgKey.value.copy(s.color).multiplyScalar(s.intensity); }
  _build() {
    // (party hook: the builders of ui/PartyVenues.js get this module's own helpers - they import nothing from it)
    this.lib = LIB; const K = this.K = new Kit(this), V = this.V = this.P.build(K, this);
    (V.seats || []).forEach((s, i) => K.hot({ id: 'seat' + i, kind: 'seat', x: s.x, y: 0.7, z: s.z, reach: 1.7, label: 'Sit down', seat: s }));
    if (V.pool) poolPlace(V.pool, poolRack(V.pool), true);
    if (V.board) this._lapBoard([]);
    for (const r of V.rigs || []) r.scr.draw((x, w, h) => simIdle(x, w, h, 0, 'PRACTICE · ' + String(TRACK[this.trackId] || 'Silverstone').toUpperCase(), r.i));
    if (V.arcade) V.arcade.scr.draw((x, w, h) => { x.fillStyle = '#12061f'; x.fillRect(0, 0, w, h); words(x, 'NIGHT RUN', w / 2, h * 0.4, "bold 30px 'Courier New', monospace", '#ff4fa8', 10); words(x, 'INSERT COIN', w / 2, h * 0.62, "bold 14px 'Courier New', monospace", '#3ad7ff'); });
    if (V.track) this._timesIdle();
    if (V.tv) { this.tvAcc = 0; this._tvDraw(false); K.anim((t, dt) => { if (!this.tvOn) return; this.tvAcc += dt; if (this.tvAcc > 0.12) { this.tvAcc = 0; this._tvDraw(true); } }); }
    this.paps = K.obj(new THREE.Sprite(new THREE.SpriteMaterial({ map: K.soft, color: '#eef4ff', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false }))); this.paps.visible = false;
    K.bake();
    const L = V.light; this.hemi = new THREE.HemisphereLight(L.hemi[0], L.hemi[1], L.hemi[2]); this.sun = new THREE.DirectionalLight(L.dir[0], L.dir[1]); this.sun.position.set(...L.dir[2]);
    // (hosted: the two lights are never put in the world's scene - their values go into the room's materials, the world's
    // exposure, background and fog are left as they are, and the room's light is set against how much of the world's gets in)
    const T = this.host ? HOSTED[this.vid] || HOSTED.simlounge : null, k = T ? T.room : 1;
    if (T) { ROOM.hgKeyDir.value.copy(this.sun.position).normalize().applyQuaternion(this.scene.quaternion); ROOM.hgWorld.value = T.world; ROOM.hgSph.value = T.sphere; this._hostLit(this.scene); }
    else { this.scene.add(this.hemi, this.sun, this.sun.target); this.renderer.toneMappingExposure = L.exposure; this.scene.background = new THREE.Color(L.bg); }
    this.L0 = { hemi: L.hemi[2], dir: L.dir[1] }; this.base = { hemi: L.hemi[2] * k, dir: L.dir[1] * k, sky: this.hemi.color.clone() }; this.mk = { hemi: 1, glow: 1 }; this.mt = { hemi: 1, glow: 1, sky: null }; this.moodI = -1;
    if (T) { this.hemi.intensity = this.base.hemi; this.sun.intensity = this.base.dir; this._roomSync(); }
    this.pos.set(V.start.x, 1.66, V.start.z); this.yaw = V.start.yaw;
    // (the guests' places: one guest takes one of the venue's spots for two - a date's, a quiet table's - and a group its cluster)
    // (party hook: at a party each by their role - V.spots: the partner beside your booth, the stars at the host's table -
    // with a drink in the hand to suit them)
    if (this.isParty && V.spots) { this.taken = new Set(); for (const g of this.gs) g.spot = spotFor(V, g.role || 'friend', this.taken) || V.group[g.i % V.group.length]; }
    else { const S = this.gs.length === 1 ? [pick(V.date)] : V.group; this.gs.forEach((g, i) => { g.spot = S[i] || V.group[i % V.group.length]; }); }
    for (const g of this.gs) this.queue.push(this.isParty ? () => { this._makeGuest(g); this._partyDrink(g); } : () => this._makeGuest(g));
    if (V.staff) this.queue.push(() => this._makeStaff(V.staff));
    if (!this.quiet && (this.isParty || K.hots.some((h) => h.kind === 'photo'))) this.queue.push(() => this._makeMe());
    if (this.isParty) this._partyBuild(V);   // party hook: its cast, its crowd and PartyPlay's own steps, all behind the cover
    try { for (const f of this.aff?.steps?.() || []) this.queue.push(f); } catch (e) { console.warn('Hangout: affection could not queue its steps', e); }   // affection hook: you (when missing), six pair frames, the drink
    this.hots = K.hots;
  }
  /** everything built: the shaders compiled off the main thread where the browser can (no stall on the first frame), then in (hosted: the place's materials against the world's lights and fog) */
  _compile() {
    if (this.compiling) return; this.compiling = true;
    const go = () => { if (this.on && !this.ready) this._ready(); };
    try { const p = this.renderer.compileAsync?.(this.scene, this.cam, this.host ? this.host.scene : null); if (p?.then) { p.then(go, go); setTimeout(go, 4000); return; } } catch (e) { /* compiled on the first frame instead */ }
    go();
  }
  /** a person's materials lifted a touch in a dark room (emissive = colour x lift), as the grid walk does at night */
  _lift(p) {
    const k = this.V.lift || 0; if (!k) return; const sk = p.mats?.skin?.color;
    // party hook: in a dark club the lift leans on how dark each surface is (PreRace._keyLit's rule): dark skin and dark
    // clothes keep their shape the way warm fill light keeps them readable in real club photos (the face: by the skin)
    for (const [n, m] of Object.entries(p.mats || {})) if (m && m.emissive && m.color) {
      let f = 1; if (this.isParty) { const c = n === 'face' && sk ? sk : m.color, l = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b, t = Math.min(1, Math.max(0, (l - 0.03) / 0.32)); f = 1 + 1.4 * (1 - t * t * (3 - 2 * t)); }
      m.emissive.copy(m.color).multiplyScalar(k * f);
    }
  }
  _makeGuest(g) {
    const sp = g.spot, sit = sp.pose === 'sit', h = hash(g.name), occ = this.occ || OCCASION[this.vid] || 'casual'; let o;
    if (g.kind === 'celeb') {
      const pose = sit ? 'sit' : g.C?.look?.pose || 'talk';
      // (someone you are seeing in the looks the two of you planned (LIFE › Style) - never written to here)
      const lk = (C, x) => (this.c && typeof Celebs.styledLook === 'function' ? Celebs.styledLook(this.c, C, x) : Celebs.celebLook(C, x));
      // wardrobe hook: a pool night on the roof - three in five of the stars in a cover-up over their swimwear; at a pool
      // club, stood in the water (a spot below the deck), only what is swum in (g.lookX: the style sheet's too)
      const lx = g.lookX = this.poolNight && (h >>> 3) % 5 < 3 ? { occasion: 'pool', cover: true } : occ === 'pool' && (sp.y || 0) < -0.05 ? { water: true } : null;
      o = g.C && typeof Celebs.celebLook === 'function' ? lk(g.C, { pose, detail: 0.75, occasion: occ, night: this.night, track: this.trackId, vary: this.vary ?? (this.vary = `${this.c?.season || 0}.${this.c?.round || 0}.${this.vid}.${(Math.random() * 1e4) | 0}`), ...(lx || {}) }) : { pose, kit: 'casual', figure: 'f', color: g.color, accent: g.color2, seed: g.id || g.name, style: { hs: 'long', fh: null, lip: true }, jitter: 0.01, detail: 0.75 };
    } else {
      // (drivers in their own clothes, by the place - a suit or a blazer on the roof, a blazer or a jumper at dinner, a
      // T-shirt, a jacket or a jumper at the pub, the sim lounge or the café, a track top for karting, easy at home - each
      // his own way, his team's colour at the collar)
      const pick = { evening: ['pantsuit', 'blazer'], club: CLUB_KITS_M, dinner: ['blazer', 'pantsuit', 'sweater'], casual: ['casual', 'bomber', 'leather', 'sweater'], sporty: ['athleisure', 'casual'], home: ['sweater', 'casual'] }[occ] || ['pantsuit', 'blazer'], kit = pick[h % pick.length];   // (party hook: an occasion it has no row for - a team party's 'night' or 'grid' - dresses as an evening)
      const smart = kit === 'blazer' || kit === 'pantsuit', top = smart ? ['#1a1d24', '#252a33', '#2a2420', '#1e2a44'][h % 4] : kit === 'athleisure' ? g.color || '#22324a' : ['#1d2230', '#f1f0ec', '#3a3f48', '#22324a', '#2e3a2c', '#4a2a2e'][(h >>> 3) % 6];
      o = { pose: sit ? 'sit' : ['talk', 'cross', 'hips', 'gesture', 'talk'][(h >>> 6) % 5], kit, color: top, accent: kit === 'pantsuit' ? '#e8e6e0' : kit === 'athleisure' ? '#f1f0ec' : g.color, legs: kit === 'pantsuit' ? top : smart ? '#1c1f26' : ['#2c3e66', '#24272d', '#3a3a3e'][(h >>> 9) % 3], driver: g.name, jitter: 0.008, detail: 0.75 };
      // (out at a club: his own clothes for it, dark - an open silk shirt with a chain, a fine knit, a T-shirt under a
      // blazer or a leather jacket - his team's colours left at the track)
      if (occ === 'club') Object.assign(o, clubOf(CLUB_KITS_M[h % CLUB_KITS_M.length], h));
      // wardrobe hook: at a pool club his swim shorts and slides - an open shirt over them on the deck; barefoot in the
      // water (ui/PartyPool.js poolDriverLook)
      if (occ === 'pool') { const inW = (sp.y || 0) < -0.05; Object.assign(o, poolDriverLook(h, this.P?.day === true || !this.night, !inW)); if (inW) o.shoe = 'bare'; }
    }
    if (g.look) Object.assign(o, g.look);
    const p = makePerson(o); this._lift(p); p.group.position.set(sp.x, sp.y || 0, sp.z); p.group.rotation.y = sp.face; this.scene.add(p.group); this._hostLit(p.group);
    g.person = p; g.opts = o; g.face0 = sp.face; g.pose = o.pose; g.disc = { x: sp.x, z: sp.z, r: sit ? 0.28 : 0.3, pp: sit ? 2 : 1 }; this.K.discs.push(g.disc);
  }
  _makeStaff(s) {
    const p = makePerson({ jitter: 0.01, detail: 0.6, ...s.look }); this._lift(p); p.group.position.set(s.x, 0, s.z); p.group.rotation.y = s.face; this.scene.add(p.group); this._hostLit(p.group);
    this.staff = { ...s, person: p, face0: s.face, hy: 0, nod: 0 }; this.K.discs.push({ x: s.x, z: s.z, r: 0.3, pp: 3 });
  }
  /** you, for the photos only (hidden otherwise): your driver in their own clothes - for a club night, a club's (clubOf) */
  _makeMe() {
    const h = hash(this.meName || 'You'), o = { pose: 'talk', kit: 'casual', color: '#1f2430', accent: this.myColor, legs: '#2c3e66', driver: this.meName, jitter: 0, detail: 0.7 }; if (this.occ === 'club') Object.assign(o, clubOf(CLUB_KITS_M[(h >>> 2) % CLUB_KITS_M.length], h));
    // (party hook: at the team's own party you are in the team polo, as your team-mate and the crew are - the team photo shows it)
    if (this.P.host === 'team') { const T = this.c?.teams?.[this.c?.myTeam]; Object.assign(o, { kit: 'polo', color: T?.color || this.myColor, accent: T?.color2 || '#f2f2f2', legs: '#1c1f26' }); }
    // affection hook: at the pool you are dressed for it (ui/Affection.js meLook); the options kept for the pair frames
    try { if (this.occ === 'pool') Object.assign(o, this.aff?.meLook?.(h) || {}); } catch (e) { console.warn('Hangout: your pool look', e); } this.meOpts = o;
    const p = makePerson(o); this._lift(p); p.group.visible = false; this.scene.add(p.group); this._hostLit(p.group); this.me = p; }
  _ready() {
    this.ready = true;
    // (a club night opens late: the lounge in its 'Late night')
    const qi = this.V.moods.findIndex((m) => m.name === 'Quiet'), li = this.occ === 'club' ? this.V.moods.findIndex((m) => m.name === 'Late night') : -1; this._moodSet(this.quiet ? Math.max(0, qi) : Math.max(0, li), true);
    this.mk = { hemi: this.mt.hemi, glow: this.mt.glow }; this.hemi.intensity = this.base.hemi * this.mk.hemi; if (this.mt.sky) this.hemi.color.copy(this.mt.sky);
    for (const G of this.K.glows) G.m.color.copy(G.base).multiplyScalar(this.mk.glow);
    for (const b of { city: [['lowpass', 320, 0.6, 0.05], ['bandpass', 900, 0.4, 0.012]], rain: [['highpass', 1800, 0.5, 0.03], ['lowpass', 500, 0.7, 0.012]], hum: [['lowpass', 170, 1.2, 0.035]], cityfar: [['lowpass', 260, 0.6, 0.02]], room: [['lowpass', 300, 0.5, 0.012]], hall: [['lowpass', 220, 0.8, 0.03]] }[this.V.bed] || []) this.snd.bed(...b);
    this._camera(0);
    if (this.isParty) { this._partyZone(0); try { this.party?.ready?.(); } catch (e) { console.warn('Hangout: the party could not open', e); } }   // party hook
  }
  /** the first moment in the room: whoever you came with says hello */
  _arrive() {
    const g = this._present()[0]; if (!g) return;
    setTimeout(() => { if (!this.closing && !this.talk && !this.game) this._bark(g, pick(this.quiet ? BARK.hello.quiet : BARK.hello[g.kind] || BARK.hello.driver)); }, 700);
  }

  // ---- the frame -------------------------------------------------------------------------------------------------------
  // (unhosted, its own requestAnimationFrame loop; hosted, the game's loop calls the handle's update(dt) and renders)
  _loop() {
    const loop = (now) => {
      if (!this.on) return; requestAnimationFrame(loop);
      if (document.hidden) { this.last = 0; return; }   // (stopped in the background)
      const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 1 / 60; this.last = now;
      this._tick(dt);
    };
    requestAnimationFrame(loop);
  }
  /** one frame, and a failing one counted: after the fourth the evening ends with what there is */
  _tick(dt) {
    try {
      this.frame(dt); if (this.host && this.on && this.hemi) { this._roomSync(); if (this.isParty) this._partyRoom(); }
      // party hook: the beat's wash over the room's light, after _roomSync (which would overwrite it) - hosted or not
      if (this.party && this.on && this.hemi && this.ready) this.party.light?.();
    }
    catch (e) { console.error('Hangout: a frame failed', e); this.errs = (this.errs || 0) + 1; if (this.errs > 3) this._abort(); }
  }
  frame(dt) {
    // (one person a frame, behind the cover; the room is shown once they are all there)
    if (this.queue.length && !this.closing) {
      const f = this.queue.shift();
      try { f(); } catch (e) { if (!this.V) { console.error('Hangout: the place could not be built', e); this._abort(); return; } console.warn('Hangout: someone could not be built', e); }
      if (!this.queue.length) this._compile(); return;
    }
    if (!this.ready && !this.closing) return;
    if (this.K) for (const f of this.K.anims) f(this.t, dt);
    if (this.closing) this._closing(dt);
    else if (this.ready) this.update(dt);
    // (closed during this very frame: its renderer is gone - unhosted - or the world's camera handed back - hosted)
    if (this.quick || !this.on) return;
    if (!this.host) { this._resize(); this.renderer.render(this.scene, this.cam); }
    if (this.ready && !this.revealed) { this.revealed = true; const off = () => this.cover.classList.add('off'); requestAnimationFrame(off); setTimeout(off, 80); setTimeout(() => this.cover.querySelector('p')?.remove(), 400); this._arrive(); }
  }
  update(dt) {
    this.t += dt; this.tl += dt * (flag('__hangoutFast') ? 20 : 1); this.clock = this.P.start + (this.tl * (this.P.rate || RATE)) / 3600;
    this._cues(dt); this._events(dt); this._people(dt); this._moodLerp(dt);
    if (this.isParty) this._partyUpdate(dt);   // party hook: where you stand (zone, the deck's height), then PartyPlay's own frame
    if (this.aff) { try { this.aff.update(dt); } catch (e) { if (!this.affErr) { this.affErr = true; console.warn('Hangout: affection', e); } } }   // affection hook: links, heads, her moves, the drink
    if (this.game) { this.game.update(dt); if (this.game.done) this._gameOver(); }
    else if (this.moment) this._momentUpdate(dt);
    else if (this.talk) this._talkUpdate(dt);
    else if (!this.menu && !this.ask && !this.sty) this._walk(dt);
    if (!this.game && !this.moment && !this.talk) this._camera(dt);
    this._tags(); this._hud(dt);
  }
  _resize() {
    const c = this.canvas, w = c.clientWidth || innerWidth, h = c.clientHeight || innerHeight, pr = this.renderer.getPixelRatio();
    if (c.width !== Math.round(w * pr) || c.height !== Math.round(h * pr)) { this.renderer.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); }
  }
  _camera() {
    const by = REDUCED || this.seat ? 0 : Math.sin(this.bob) * 0.022, cp = Math.cos(this.pitch), y = this.pos.y + by;
    this._look(this._c0.set(this.pos.x, y, this.pos.z), this._c1.set(this.pos.x + Math.cos(this.yaw) * cp, y + Math.sin(this.pitch), this.pos.z + Math.sin(this.yaw) * cp));
  }
  _hud(dt) {
    const s = hhmm(this.clock); if (s !== this.clockTxt) { this.clockTxt = s; this.$('.hg-bug em').textContent = s; }
    if (this.subT > 0 && (this.subT -= dt) <= 0) this.$('.hg-sub').classList.remove('in');
    if (this.bigT > 0 && (this.bigT -= dt) <= 0) this.$('.hg-big').classList.remove('in');
    if (this.photoT > 0 && (this.photoT -= dt) <= 0) this.$('.hg-photo').classList.remove('in');
    if (this.helpT > 0 && (this.helpT -= dt) <= 0) this.$('.hg-help').style.opacity = '0';
    const busy = !!(this.game || this.moment || this.talk || this.menu || this.ask || this.sty); this.$('.hg-dot').style.opacity = busy ? 0 : 1;
    if (busy) { this.$('.hg-prompt').classList.remove('in'); this.prHtml = null; if (this.helpT > 0) { this.helpT = 0; this.$('.hg-help').style.opacity = '0'; } }
    if (this.ask?.auto && (this.ask.t += dt) > 10) this._finish('normal');
  }

  // ---- walking about ---------------------------------------------------------------------------------------------------
  /** somewhere you can stand (inside the room, clear of the furniture and the people; r: how much room) */
  _free(x, z, r = 0.24, skip = null, soft = false) {   // (soft: the people - discs with pp - never block; your own walk)
    const K = this.K; if (!K.areas.some((a) => x > a.x0 + r && x < a.x1 - r && z > a.z0 + r && z < a.z1 - r)) return false;
    for (const s of K.solids) if (x > s.x0 - r && x < s.x1 + r && z > s.z0 - r && z < s.z1 + r) return false;
    for (const d of K.discs) if (d !== skip && !(soft && d.pp) && (x - d.x) ** 2 + (z - d.z) ** 2 < (d.r + r) ** 2) return false;
    return true;
  }
  /** walking into people (rev. 10-11): nobody is a wall - you ease through, they give a step (standing guests shuffle
   *  aside, never through the furniture), and a gentle push keeps you out of their bodies. Only discs within reach are
   *  touched; nothing is allocated. -> 0..1 how hard you are pressing into someone (it slows you) */
  _pressPeople(dt, moving) {
    const P = this.pos, D = this.K.discs; let hard = 0;
    for (let i = 0; i < D.length; i++) {
      const d = D[i]; if (!d.pp) continue;
      const dx = P.x - d.x, dz = P.z - d.z, R = d.r + 0.24, q = dx * dx + dz * dz; if (q >= R * R) continue;
      const l = Math.sqrt(q), ov = R - l, ux = l > 1e-3 ? dx / l : Math.cos(this.yaw + Math.PI), uz = l > 1e-3 ? dz / l : Math.sin(this.yaw + Math.PI);
      hard = Math.max(hard, ov / R); if (!moving) continue;
      // (they step aside: a standing guest moves sideways off your line - never shoved on ahead of you)
      if (d.pp === 1) { const g = this._discOwner(d), gp = g?.person?.group?.position; if (gp && !g.gone && g.role !== 'security' && g.role !== 'dj' && g.role !== 'bartender') { const mx = -Math.sin(this.yaw), mz = Math.cos(this.yaw), sd = -(ux * mx + uz * mz) < 0 ? -1 : 1, k = Math.min(ov * 0.6, dt * 0.9), nx = d.x + mx * sd * k, nz = d.z + mz * sd * k; if (this._free(nx, nz, 0.2, d)) { gp.x += nx - d.x; gp.z += nz - d.z; d.x = nx; d.z = nz; } } }
      // (and you are eased back out of them - less than your stride, so pressing on always gets you through)
      const k = Math.min(ov, dt * 0.4), px = P.x + ux * k, pz = P.z + uz * k; if (this._free(px, pz, 0.24, null, true)) { P.x = px; P.z = pz; }
    }
    return hard;
  }
  _discOwner(d) { const G = this.gs; for (let i = 0; i < G.length; i++) if (G[i].disc === d) return G[i]; return null; }
  _walk(dt) {
    const k = this.keys;
    if (k.has('ArrowLeft')) this.yaw -= dt * 1.8; if (k.has('ArrowRight')) this.yaw += dt * 1.8;
    const mf = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0), ms = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
    if (this.seat) { if (mf || ms) this._stand(); this._prompt(); return; }
    if (mf || ms) {
      const fx = Math.cos(this.yaw), fz = Math.sin(this.yaw), sp = (k.has('ShiftLeft') || k.has('ShiftRight') ? 2.6 : 1.45) * dt * (this.crowdSlow ? 1 - 0.45 * this.crowdSlow : 1) * (this.pressSlow ? 1 - 0.35 * this.pressSlow : 1), len = Math.hypot(mf, ms);   // (party hook: a packed floor slows you; so does easing past a guest)
      const vx = ((fx * mf - fz * ms) / len) * sp, vz = ((fz * mf + fx * ms) / len) * sp;
      if (this._free(this.pos.x + vx, this.pos.z, 0.24, null, true)) this.pos.x += vx; if (this._free(this.pos.x, this.pos.z + vz, 0.24, null, true)) this.pos.z += vz;   // (people are soft: _pressPeople)
      this.pressSlow = this._pressPeople(dt, true);
      this.bob += sp * 5.2; this.helpT = Math.min(this.helpT, 6);
    }
    this._prompt();
  }
  _sit(s) { this.seat = s; this.pos.set(s.x, s.eye, s.z); this.yaw = s.yaw; this.pitch = -0.12; }
  _stand() {
    const s = this.seat; if (!s) return; this.seat = null;
    for (const d of [0.62, 0.8, 1.0, 1.3]) for (const a of [Math.PI, Math.PI - 0.7, Math.PI + 0.7, Math.PI / 2, -Math.PI / 2]) { const x = s.x + Math.cos(s.yaw + a) * d, z = s.z + Math.sin(s.yaw + a) * d; if (this._free(x, z)) { this.pos.set(x, 1.66, z); return; } }
    this.pos.set(this.V.start.x, 1.66, this.V.start.z);
  }
  /** what you are looking at, close enough to use: a guest, a thing, the staff */
  _target() {
    const p = this.pos, fx = Math.cos(this.yaw), fz = Math.sin(this.yaw); let best = null, bs = -9;
    const consider = (o, x, z, reach, bias = 0) => { const dx = x - p.x, dz = z - p.z, d = Math.hypot(dx, dz); if (d > reach) return; const dot = d < 0.35 ? 1 : (dx * fx + dz * fz) / d; if (dot < 0.72) return; const s = dot - d * 0.06 + bias; if (s > bs) { bs = s; best = o; } };
    // (party hook: at a party the bar wins over whoever stands at it, and someone with nothing left to say gives way)
    for (const g of this.gs) if (g.person && !g.gone) consider({ g }, g.person.group.position.x, g.person.group.position.z, this.seat ? 2.9 : 2.5, this.isParty && g.talks >= 3 ? -0.3 : 0);
    for (const h of this.hots) { if ((h.kind === 'seat' && this.seat) || (this.quiet && (h.kind === 'game' || h.kind === 'photo'))) continue; consider({ h }, h.p.x, h.p.z, h.reach, this.isParty && h.kind === 'bar' ? 0.12 : 0); }
    if (this.staff?.person && !this.staff.hot) consider({ s: this.staff }, this.staff.x, this.staff.z, 2.4);
    return best;
  }
  _prompt() {
    const t = this._target(), pr = this.$('.hg-prompt'), opp = this._opponent(), O = (s) => esc(String(s || '').replace(/\{opp\}/g, opp ? opp.first : 'them'));
    let html = '';
    if (t?.g) { const g = t.g, look = this._styleOk(g) ? '<span><kbd>L</kbd>Her look</span>' : ''; html = g.offended || g.shaken > 0 ? `${esc(g.first)}<small>Needs a minute</small>` : g.talks >= 3 ? `${look ? `${look} ` : ''}${esc(g.first)}<small>Happy just being here</small>` : `<span><kbd>E</kbd>Talk to ${esc(g.first)}</span>${this._canCheers(g) ? '<span><kbd>F</kbd>Cheers</span>' : ''}${look}<small>${esc(this._sub(g))}</small>`; }
    else if (t?.h) html = `<span><kbd>E</kbd>${O(t.h.label)}</span>${t.h.sub ? `<small>${O(t.h.sub)}</small>` : ''}`;
    else if (t?.s) html = `<span><kbd>E</kbd>Say hello to ${esc(t.s.name)}</span><small>${esc(t.s.role)}</small>`;
    if (this.seat) html = `<span><kbd>W</kbd>Stand up</span>${html ? ' ' + html : ''}`;
    try { if (this.aff) html = this.aff.prompt(t, html); } catch (e) { console.warn('Hangout: the affection prompt', e); }   // affection hook: G, and who you are with
    try { html = papsPrompt(this, html); } catch (_) { /* */ }   // paps hook (ui/PapsConfront.js): P, the photographers
    if (html !== this.prHtml) { this.prHtml = html; pr.innerHTML = html; pr.classList.toggle('in', !!html); }
    this.tgt = t;
  }
  // ---- her look, planned here (L: the roof and dinner, someone you are seeing - ui/HubStyle.js's sheet; the edit comes
  // back in the result, the career's own to keep) -------------------------------------------------------------------------
  _styleOk(g) { return !!g && !this.quiet && !this.closing && !g.gone && !!g.person && sheetFor(this.c, this.vid, g); }
  _styleOpen() {
    const t = this._target(), g = t?.g && this._styleOk(t.g) ? t.g : this.gs.find((x) => this._styleOk(x) && x.person && Math.hypot(x.person.group.position.x - this.pos.x, x.person.group.position.z - this.pos.z) < 6);
    if (!g || this.sty) return;
    this._unlock(); this.keys.clear(); this.drag = false;
    try { this.sty = openStyleSheet(this, g); } catch (e) { console.warn('Hangout: her look could not be opened', e); this.sty = null; }
    if (this.sty) { this.$('.hg-prompt').classList.remove('in'); this.prHtml = null; }
  }
  _styleClose(relock = true) { const S = this.sty; if (!S) return; this.sty = null; try { const r = S.close(); this.R.style = r || null; } catch (e) { console.warn('Hangout: her look', e); } if (relock) this._lock(); }
  _interact() {
    const t = this._target(); if (!t) return; this.helpT = Math.min(this.helpT, 3);
    if (t.g) this._open(t.g); else if (t.h) this._use(t.h);
    else if (t.s) this._bark({ first: t.s.name }, pick(['Evening. Enjoy yourselves.', 'Shout if you need anything.', "Track's yours whenever you're ready.", 'Good to see you.']));
  }
  _use(h) {
    // party hook: PartyPlay first (the bar, your table, the DJ, the dance floor, the step-and-repeat, the door, the terrace,
    // the crew, the blackjack table); what it does not take, the evening's own way
    try { if (this.party?.use?.(h)) return; } catch (e) { console.warn('Hangout: the party could not use that', e); }
    switch (h.kind) {
      case 'seat': this._sit(h.seat); break;
      case 'bar': this._order(h); break;
      case 'dj': this._musicMenu(h); break;
      case 'quiet': this._startMoment(h); break;
      case 'door': this._askLeave(); break;
      case 'wall': if (!this.quiet) this._photo(h); break;
      case 'table': case 'dance': case 'garage': case 'blackjack': this._toast(h.text || h.sub || h.label || '', ''); break;
      case 'order': this._order(h); break;
      case 'juke': this._musicMenu(h); break;
      case 'moment': this._startMoment(h); break;
      case 'photo': if (!this.quiet) this._photo(h); break;
      case 'game': if (!this.quiet) this._startGame(h.game); break;
      case 'tv': this._tv(); break;
      case 'board': this._boardToast(); break;
      case 'helmet': { const i = (HELMETS.indexOf(this.helmet) + 1) % HELMETS.length; this.helmet = HELMETS[i]; this._toast(`A ${['white', 'black', 'yellow', 'blue', 'red', 'green'][i]} helmet from the rack. It even fits.`, ''); break; }
      default: this._toast(h.text || '', ''); if (h.taste) this._taste(h.taste);
    }
  }
  /** the guests still here, built */
  _present() { return this.gs.filter((g) => g.person && !g.gone); }
  /** the nearest guest within r m -> guest | null */
  _companion(r) { let b = null, bd = r; for (const g of this._present()) { const d = Math.hypot(g.person.group.position.x - this.pos.x, g.person.group.position.z - this.pos.z); if (d < bd) { bd = d; b = g; } } return b; }
  /** who you would play: the one you last talked to if they are close, else the nearest (on the sims, whoever is in a rig) */
  _opponent(game = null) {
    const P = this._present(); if (!P.length) return null;
    if (game === 'sim') { const r = P.find((g) => g.spot?.rig); if (r) return r; }
    if (this.lastG && P.includes(this.lastG) && Math.hypot(this.lastG.person.group.position.x - this.pos.x, this.lastG.person.group.position.z - this.pos.z) < 9) return this.lastG;
    return this._companion(99) || P[0];
  }
  /** a guest who likes this (their tastes: the game's, hashed - only the drivers have them) enjoys it, once */
  _taste(tag) {
    for (const g of this._present()) {
      const T = g.n?.tastes, k = g.cid + '|' + tag; if (!Array.isArray(T) || !T.includes(tag) || this.tasted.has(k)) continue;
      this.tasted.add(k); g.taste++; this._toast(`${g.first} seems to like ${TASTE_WORD[tag] || tag}`, 'up');
    }
  }

  // ---- the people: heads that follow you, bodies that turn to talk, a glance at each other -----------------------------
  _people(dt) {
    const P = this.pos, t = this.t, T0 = this.talk;
    for (const g of this._present()) {
      const p = g.person, gp = p.group, sit = g.spot.pose === 'sit', talking = T0?.g === g;
      if (g.shaken > 0) g.shaken -= dt;
      let want = g.face0; if (talking && !sit) want = facing(P.x - gp.position.x, P.z - gp.position.z); else if ((g.offended || g.shaken > 0) && !sit) want = g.face0 + 0.9;
      gp.rotation.y += wrap(want - gp.rotation.y) * Math.min(1, dt * 3.5);
      const h = p.head; if (!h) continue;
      const dx = P.x - gp.position.x, dz = P.z - gp.position.z, d = Math.hypot(dx, dz), hy = (sit ? 1.12 : 1.56) * (g.kind === 'celeb' ? 0.95 : 1) + (g.spot.y || 0);
      let ty = 0.16 * Math.sin(t * 0.31 + g.ph) + 0.07 * Math.sin(t * 0.73 + g.ph * 2), tz = 0.02 * Math.sin(t * 0.5 + g.ph);
      if (g.glance > 0 && g.glanceAt) { g.glance -= dt; ty = clamp(wrap(facing(g.glanceAt.x - gp.position.x, g.glanceAt.z - gp.position.z) - gp.rotation.y), -1.1, 1.1); }
      else if (talking || (d < 4.2 && !g.offended && !(g.shaken > 0))) { ty = clamp(wrap(facing(dx, dz) - gp.rotation.y), -1.0, 1.0); tz = clamp(Math.atan2(P.y - hy, Math.max(0.4, d)), -0.35, 0.45) * 0.7; }
      else if (g.offended || g.shaken > 0) { ty = 0.5; tz = -0.12; }
      g.hy += (ty - g.hy) * Math.min(1, dt * 4); g.hz += (tz - g.hz) * Math.min(1, dt * 4); if (g.nod > 0) g.nod -= dt;
      const speaking = (talking && T0.line && T0.typed < T0.line.length && !T0.line.startsWith('›')) || g.nod > 0;
      h.rotation.y = g.hy; h.rotation.z = p.bow + g.hz + (speaking ? 0.05 * Math.sin(t * 9 + g.ph) : 0);
    }
    const S = this.staff; if (S?.person?.head) { const gp = S.person.group, d = Math.hypot(P.x - gp.position.x, P.z - gp.position.z), ty = d < 3.2 ? clamp(wrap(facing(P.x - gp.position.x, P.z - gp.position.z) - gp.rotation.y), -0.9, 0.9) : 0.2 * Math.sin(t * 0.27); S.hy += (ty - S.hy) * Math.min(1, dt * 3); if (S.nod > 0) S.nod -= dt; S.person.head.rotation.y = S.hy; S.person.head.rotation.z = S.person.bow - (S.nod > 0 ? Math.abs(Math.sin(S.nod * 7)) * 0.12 : 0); }
  }
  _tags() {
    const W = innerWidth, H = innerHeight, busy = this.talk || this.game || this.moment || this.menu || this.ask, v = this._v;
    this.gs.forEach((g, i) => {
      const el = this.tagEls[i]; if (!g.person || g.gone || busy) { el.style.opacity = 0; return; }
      (g.person.head || g.person.group).getWorldPosition(v); v.y += 0.34; const d = v.distanceTo(this.cam.position); v.project(this.cam);
      const show = v.z < 1 && d < 6.5 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1; el.style.opacity = show ? Math.min(1, (6.5 - d) / 2.5) * (g.talks >= 3 ? 0.6 : 1) : 0;
      if (show) el.style.transform = `translate(${((v.x * 0.5 + 0.5) * W).toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * H).toFixed(1)}px) translate(-50%, -100%)`;
    });
  }

  // ---- talking (the grid walk's way: typed lines, 1-4 to answer, a tag for the tone) ------------------------------------
  _open(g) {
    if (g.gone) return;
    if (g.offended || g.shaken > 0) { this._toast(`${g.first} needs a minute.`, ''); return; }
    if (g.talks >= 3) { this._toast(`${g.first} is happy just being here.`, ''); return; }
    const x = this.x, n = g.n, others = this._present().filter((o) => o !== g);
    n.talks = g.talks; n.other = others[0]?.name; x.other = others[0]?.name || null; x.others = this.gs.map((o) => o.name);
    // (party hook: a private word - the terrace, a quiet corner of the booths, nobody within earshot - has no one else in it)
    let priv = false; try { priv = !!this.party?.isPrivate?.(g); } catch (_) { priv = false; }
    if (priv) { n.other = null; x.other = null; x.others = []; }
    let tree = talkFor(x, n, this.usedAll.concat(g.used)); if (!tree) tree = talkFor(x, n, g.used);
    if (!tree) { this._toast(`${g.first} has run out of things to say. For now.`, ''); g.talks = 3; return; }
    this.usedAll.push(tree.id); g.used.push(tree.id); this.lastG = g;
    this._unlock(); this.keys.clear(); if (this.buzzE?.open) this._buzzPick(0); this.$('.hg-sub').classList.remove('in'); this.subT = 0;
    this.talk = { g, step: 0, queue: [], after: null, opts: null, typed: 0, line: null, hold: 0, dm: 0, closing: false };
    const P = this.$('.hg-talk'); P.querySelector('.who').innerHTML = `${esc(g.name)}<small>${esc(this._sub(g))}</small>`; P.classList.add('in');
    this._queue([tree.say], tree.opts);
  }
  _queue(lines, opts) { const T0 = this.talk; T0.queue = lines.filter((l) => l != null && l !== ''); T0.after = opts; T0.opts = null; this.$('.hg-talk .opts').innerHTML = ''; this._nextLine(); }
  _nextLine() {
    const T0 = this.talk, L = this.$('.hg-talk .line'), nx = this.$('.hg-talk .next');
    if (T0.queue.length) { T0.line = T0.queue.shift(); T0.typed = 0; T0.hold = 0; L.classList.toggle('me', T0.line.startsWith('› ')); L.textContent = ''; nx.textContent = 'SPACE ▸'; return; }
    T0.line = null; nx.textContent = '';
    if (T0.after) this._showOpts(T0.after); else this._offerLeave();
  }
  _showOpts(opts) {
    // (party hook: the drink talking - a loose line in place of one answer, the options swimming when drunk)
    if (this.party && this.talk?.g) { try { opts = this.party.opts?.(opts, this.talk.g) || opts; } catch (e) { console.warn('Hangout: the party options', e); } }
    const T0 = this.talk, box = this.$('.hg-talk .opts'); T0.opts = opts; box.innerHTML = '';
    opts.forEach((o, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.dataset.tone = o.tone; b.style.setProperty('--i', i);
      const fx = o.fx ? Object.keys(o.fx).map((k) => FX_TAG[k]).filter(Boolean)[0] : '';
      b.innerHTML = `<b>${i + 1}</b><span>${esc(o.t)}</span><i>${esc(TAG[o.tone] || '')}${fx ? `<u>${esc(fx)}</u>` : ''}</i>`;
      b.addEventListener('click', () => this._choose(i)); box.appendChild(b); requestAnimationFrame(() => b.classList.add('in'));
    });
  }
  _advance() { const T0 = this.talk; if (!T0 || !T0.line) return; if (T0.typed < T0.line.length) T0.typed = T0.line.length; else this._nextLine(); }
  /** straight to the answers (tests) */
  _skipToOpts() { let k = 0; while (this.talk && !this.talk.opts && !this.talk.closing && k++ < 12) { if (this.talk.line) this.talk.typed = this.talk.line.length; this._nextLine(); } }
  _offerLeave() {
    const T0 = this.talk; if (!T0 || T0.closing) return; T0.closing = true;
    const box = this.$('.hg-talk .opts'); box.innerHTML = ''; const b = document.createElement('button'); b.type = 'button'; b.dataset.tone = 'leave'; b.innerHTML = '<b>▸</b><span>Carry on</span><i>CLICK · E · ESC</i>';
    b.addEventListener('click', () => this._leaveTalk()); box.appendChild(b); requestAnimationFrame(() => b.classList.add('in'));
    try { this.aff?.closer?.(box, T0); } catch (e) { console.warn('Hangout: the affection closer', e); }   // affection hook: [Hug her] / [Kiss her] after a warm talk
  }
  _leaveTalk() { if (!this.talk) return; this._closeTalk(); this._lock(); }
  _choose(i) {
    const T0 = this.talk; if (!T0 || !T0.opts) return; const o = T0.opts[i]; if (!o) return; const g = T0.g, R = this.R;
    T0.opts = null; this.$('.hg-talk .opts').innerHTML = '';
    const dm = typeof HT.hangoutMood === 'function' ? HT.hangoutMood(o) : o.m ?? TONE[o.tone] ?? 0; g.dm += dm; T0.dm += dm;
    if (o.tone) R.tones[o.tone] = (R.tones[o.tone] || 0) + 1;
    if (o.fx) for (const k of Object.keys(o.fx)) { g.fx[k] = (g.fx[k] || 0) + 1; R.fx[k] = (R.fx[k] || 0) + 1; }
    try { this.party?.chosen?.(o, g); } catch (e) { console.warn('Hangout: the party choice', e); }   // party hook
    if (o.fx?.cover) R.cover++; if (o.fx?.flirt) R.flirt++;
    if (o.fx?.confess) { R.confess = true; g.shaken = 50; R.moments.push(`Told ${g.first} the truth about someone else.`); }
    if (o.fx?.deep && (g.fx.deep || 0) === 1) R.moments.push(`A real conversation with ${g.first}.`);
    if (o.fx?.invite && (g.fx.invite || 0) === 1) R.moments.push(`Made plans with ${g.first} for another time.`);
    const lines = o.t.startsWith('[') ? [] : [`› ${o.t}`]; if (o.r) lines.push(o.r);
    if (o.end) { g.offended = true; T0.step = 2; this._queue(lines, null); try { papsNote(this, 'row', g); } catch (_) { /* */ } return; }   // (paps hook: an argument in public)
    if (T0.step === 0 && o.then) { T0.step = 1; lines.push(o.then.say); this._queue(lines, o.then.opts); return; }
    T0.step = 2; lines.push(this._bye(g, T0.dm)); this._queue(lines, null);
  }
  _bye(g, dm) { try { if (typeof HT.hangoutBye === 'function') return HT.hangoutBye(this.x, g.n, dm); } catch (_) { /* the local pools */ } return pick(this.x.grave ? BYE.quiet : g.kind === 'celeb' ? (dm < 0 ? BYE.cold : BYE.warm) : dm >= 3 ? BYE.good : dm >= 0 ? BYE.ok : BYE.bad); }
  _closeTalk() {
    const T0 = this.talk; if (!T0) return; const g = T0.g; this.talk = null; g.talks++; if (g.n) g.n.talks = g.talks;
    this.$('.hg-talk').classList.remove('in'); this.$('.hg-talk .opts').innerHTML = '';
    if (T0.dm >= 3) this._toast(`${g.first} enjoyed that`, 'up'); else if (T0.dm <= -3) this._toast(`${g.first} didn't like that`, 'down');
    // (she has a mind of her own: pushed far enough, she goes home)
    if (g.kind === 'celeb' && (g.dm <= -8 || (g.offended && g.dm <= -5))) this._walkOut(g);
  }
  _talkUpdate(dt) {
    const T0 = this.talk, hp = this._w; (T0.g.person.head || T0.g.person.group).getWorldPosition(hp); this._toL(hp); hp.y -= 0.22;
    const dx = hp.x - this.pos.x, dz = hp.z - this.pos.z, wy = Math.atan2(dz, dx), wp = Math.atan2(hp.y - this.pos.y, Math.hypot(dx, dz));
    this.yaw += wrap(wy - this.yaw) * Math.min(1, dt * 5); this.pitch += (wp - this.pitch) * Math.min(1, dt * 5); this._camera(dt);
    if (!T0.line) return;
    T0.typed = Math.min(T0.line.length, T0.typed + dt * (T0.line.startsWith('›') ? 90 : 42));
    this.$('.hg-talk .line').textContent = T0.line.slice(0, Math.floor(T0.typed)).replace(/^› /, '');
    if (T0.typed >= T0.line.length) { T0.hold += dt; if (T0.hold > (T0.line.startsWith('›') ? 0.7 : 0.45 + T0.line.length / 60) && (T0.queue.length || T0.after)) this._nextLine(); else if (!T0.queue.length && !T0.after && T0.hold > 0.25) this._offerLeave(); }
  }
  _walkOut(g) {
    g.gone = true; this.R.walkedOut = g.cid; this.R.moments.push(`${g.first} left early.`);
    this.cover.classList.add('fast'); this.cover.classList.remove('off');
    setTimeout(() => { if (g.person) g.person.group.visible = false; const i = this.K.discs.indexOf(g.disc); if (i >= 0) this.K.discs.splice(i, 1); if (!this.closing) this.cover.classList.add('off'); this._toast(`${g.first} has called a car and gone home.`, 'down'); if (!this._present().length && !this.closing) setTimeout(() => this._finish('normal'), 2600); }, 240);
  }
  _canCheers(g) { return !this.quiet && this.R.orders > 0 && !g.cheers && !g.offended && !(g.shaken > 0) && !g.gone; }
  _cheers() {
    const t = this._target(); if (!t?.g || this.quiet) return; const g = t.g;
    if (!this.R.orders) { this._toast('Order something first.', ''); return; }
    if (!this._canCheers(g)) return;
    g.cheers = true; g.dm += 1; this.R.toasts++; this.snd.clink(); this._bark(g, pick(BARK.cheers)); g.nod = 1.2;
  }

  // ---- the bar, the music, the TV, the board ---------------------------------------------------------------------------
  _menu(who, line, items, fn) {
    this._unlock(); this.keys.clear(); this.menu = { items, fn }; this.$('.hg-sub').classList.remove('in'); this.subT = 0;
    const P = this.$('.hg-talk'), L = P.querySelector('.line'), box = P.querySelector('.opts');
    P.querySelector('.who').innerHTML = esc(who); L.classList.remove('me'); L.textContent = line; P.querySelector('.next').textContent = `1-${items.length} · ESC TO CLOSE`; box.innerHTML = '';
    items.forEach((s, i) => { const b = document.createElement('button'); b.type = 'button'; b.style.setProperty('--i', i); b.innerHTML = `<b>${i + 1}</b><span>${esc(s)}</span><i></i>`; b.addEventListener('click', () => this._menuPick(i)); box.appendChild(b); requestAnimationFrame(() => b.classList.add('in')); });
    P.classList.add('in');
  }
  _menuPick(i) { const M = this.menu; if (!M || i < 0 || i >= M.items.length) return; this._menuClose(); M.fn(i); }
  _menuClose(relock = true) { if (!this.menu) return; this.menu = null; const P = this.$('.hg-talk'); P.classList.remove('in'); P.querySelector('.opts').innerHTML = ''; if (relock) this._lock(); }
  _order(h) {
    const items = ORDERS[this.vid] || ORDERS.coffee, S = this.staff && this.staff.hot === h.id ? this.staff : null;
    const line = S ? pick(['What can I get you?', "Evening. What'll it be?", 'What are you having?']) : pick(['What do you fancy?', 'Help yourself.']);
    this._menu(S ? `${S.name} · ${S.role}` : this.P.name, line, [...items, 'Nothing for now'], (i) => { if (i < items.length) this._ordered(items[i]); });
    if (S) S.nod = 1.0;
  }
  _ordered(item) {
    let sv = null; try { sv = this.aff?.served?.(item) || null; } catch (e) { console.warn('Hangout: the affection drink', e); }   // affection hook: the pool's own drink model (its line: water at last)
    this.R.orders++; this._toast(sv?.line || `Ordered: ${item[0].toLowerCase()}${item.slice(1)}`, ''); this._drinks(item);
    // (something to drink, something to share: the talk goes a little easier after it)
    if (this.R.orders <= 2) for (const g of this._present()) g.dm += 0.5;
    const g = this._companion(8); if (g) this._bark(g, pick(BARK.order));
    if (/coffee|flat white|tea|espresso/i.test(item)) this._taste('coffee');
    if (/chips|plate|taco|pizza|risotto|bass|dessert|cake|olives|hot dog|fish/i.test(item)) this._taste('food');
  }
  /** a glass (or a cup) for each guest: on the table in front of anyone sitting, in the hand of anyone standing easy */
  _drinks(item) {
    if (/chips|plate|taco|pizza|risotto|bass|dessert|olives|hot dog/i.test(item)) return;
    const cup = /coffee|flat white|tea|espresso|chocolate/i.test(item), col = /orange|passion|slush/i.test(item) ? '#f0a030' : /cola|iced tea/i.test(item) ? '#5a2a14' : /lemon|water|lime/i.test(item) ? '#e4eeee' : /chocolate/i.test(item) ? '#6a3a22' : '#d84a5a';
    const D = this._dg || (this._dg = { glass: new THREE.LatheGeometry([[0, 0], [0.033, 0], [0.036, 0.11], [0.033, 0.11], [0.03, 0.006], [0, 0.006]].map(([r, y]) => new THREE.Vector2(r, y)), 16), liquid: new THREE.CylinderGeometry(0.031, 0.028, 0.07, 14),
      cup: new THREE.LatheGeometry([[0, 0], [0.03, 0], [0.042, 0.075], [0.039, 0.075], [0.027, 0.006], [0, 0.006]].map(([r, y]) => new THREE.Vector2(r, y)), 18), top: new THREE.CircleGeometry(0.038, 16),
      glassM: new THREE.MeshStandardMaterial({ color: '#e8f2f6', roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.38, depthWrite: false }), cupM: new THREE.MeshStandardMaterial({ color: '#f6f4ee', roughness: 0.35 }), mats: [] });
    for (const g of this._present()) {
      if (g.drink) continue; const p = g.person, sit = g.spot.pose === 'sit'; if (!sit && !['talk', 'gesture', 'pose'].includes(g.pose)) continue;
      const s = p.group.children[0].scale.x, w = p.wrR.clone().multiplyScalar(s), grp = new THREE.Group(), lm = new THREE.MeshStandardMaterial({ color: cup ? '#3a2416' : col, roughness: 0.25 }); D.mats.push(lm);
      if (cup) { grp.add(new THREE.Mesh(D.cup, D.cupM)); const tp = new THREE.Mesh(D.top, lm); tp.rotation.x = -Math.PI / 2; tp.position.y = 0.066; grp.add(tp); }
      else { const lq = new THREE.Mesh(D.liquid, lm); lq.position.y = 0.042; grp.add(lq, new THREE.Mesh(D.glass, D.glassM)); }
      if (sit) grp.position.set(w.x + 0.03, w.y - 0.04, w.z + 0.1); else grp.position.set(w.x + 0.02, w.y - 0.11, w.z);
      p.group.add(grp); g.drink = grp; this._hostLit(grp);
    }
  }
  _musicMenu(h) {
    const M = this.V.moods;
    this._menu(`${this.P.name} · the music`, this.quiet ? 'Something soft, or nothing at all.' : 'What are we listening to?', M.map((m, i) => `${m.name}${i === this.moodI ? '  (on now)' : ''}`), (i) => {
      if (i === this.moodI) return; this._moodSet(i);
      if (!this.quiet) { const g = this._companion(9); if (g) this._bark(g, pick(BARK.music)); }
    });
  }
  /** a mood: the room's light and glow eased to it, its music crossfaded (the engine's beds; silence without sound) */
  _moodSet(i, first = false) {
    const M = this.V.moods[i]; if (!M) return; this.moodI = i; if (!first) this.R.mood = M.name;
    // (the room's light leans with the music: cooler for late night, warmer for low and slow)
    const tint = M.tint ?? MOOD_TINT[M.name] ?? null; this.mt = { hemi: M.hemi, glow: M.glow, sky: tint ? this.base.sky.clone().lerp(new THREE.Color(tint), 0.35) : this.base.sky.clone() };
    // (a club - a club night on the roof, or a club of its own (V.club / P.club) - plays the club's own music under any
    // mood but a quiet one, with the room full of people under it (assets/audio clubmusic and clubcrowd, both loops))
    const clubby = this.occ === 'club' || !!this.V.club || !!this.P?.club, mus = clubby && M.music !== null ? (M.clubMusic || 'clubmusic') : M.music;
    if (mus !== this.musName) {
      try { this.mus?.stop?.(1.5); } catch (_) { /* gone */ } this.mus = null; this.musName = mus;
      // (never the dark atmospheres (atmos1-3): those are the crash news's and the mourning's own, not an evening out's)
      if (mus && !/^atmos/.test(mus) && this.audio?.ready && typeof this.audio.music === 'function') { try { this.mus = this.audio.music(mus, { loop: true, gain: clubby ? 0.42 : 0.3, fadeIn: 1.6, offset: Math.random() * 30 }); } catch (e) { this.mus = null; } }
    }
    const crowd = clubby && mus ? 'clubcrowd' : null;
    if (crowd !== this.crowdName) {
      try { this.crowdBed?.stop?.(1.5); } catch (_) { /* gone */ } this.crowdBed = null; this.crowdName = crowd;
      if (crowd && this.audio?.ready && typeof this.audio.music === 'function') { try { this.crowdBed = this.audio.music(crowd, { loop: true, gain: 0.24, fadeIn: 2.2, offset: Math.random() * 60 }); } catch (e) { this.crowdBed = null; } }
    }
    if (!first) this._taste(M.music ? 'music' : 'quiet');
  }
  _moodLerp(dt) {
    const m = this.mk, t = this.mt, c = this.hemi.color; if (Math.abs(m.hemi - t.hemi) + Math.abs(m.glow - t.glow) < 0.002 && (!t.sky || c.equals(t.sky))) return;
    const a = Math.min(1, dt * 1.6); m.hemi += (t.hemi - m.hemi) * a; m.glow += (t.glow - m.glow) * a;
    if (t.sky) { c.lerp(t.sky, a); if (Math.abs(c.r - t.sky.r) + Math.abs(c.g - t.sky.g) + Math.abs(c.b - t.sky.b) < 0.003) c.copy(t.sky); }
    this.hemi.intensity = this.base.hemi * m.hemi; this.sun.intensity = this.base.dir * (0.55 + 0.45 * m.hemi);
    for (const G of this.K.glows) G.m.color.copy(G.base).multiplyScalar(m.glow);
  }
  _tv() {
    this.tvOn = !this.tvOn; this._tvDraw(this.tvOn);
    if (this.tvOn && !this.R.tv) { this.R.tv = true; const g = this._companion(9); if (g) this._bark(g, g.kind === 'celeb' ? pick(['Is that you? Turn it up.', 'I want to see the start again.']) : pick(['Ha. Not this again.', 'Go on, then. Pause it at the start.', 'Skip to the good bit.'])); }
  }
  /** the flat's TV: off (a dark screen with a sheen), or the highlights - a corner from above, two cars, the caption */
  _tvDraw(on) {
    const S = this.V.tv; if (!S) return; const t = this.t;
    S.draw((x, w, h) => {
      if (!on) { vgrad(x, w, h, [[0, '#0d0e12'], [1, '#050507']]); x.fillStyle = 'rgba(255,255,255,.035)'; x.beginPath(); x.moveTo(w * 0.62, 0); x.lineTo(w, 0); x.lineTo(w * 0.78, h); x.lineTo(w * 0.38, h); x.fill(); return; }
      vgrad(x, w, h, [[0, '#2f5e2c'], [1, '#214a22']]);
      x.lineCap = 'round'; x.strokeStyle = '#4b4d52'; x.lineWidth = 64; x.beginPath(); x.moveTo(-40, h * 0.86); x.quadraticCurveTo(w * 0.62, h * 0.96, w * 0.62, h * 0.42); x.quadraticCurveTo(w * 0.62, -20, w + 40, h * 0.12); x.stroke();
      x.setLineDash([10, 10]); x.strokeStyle = '#d8d8dc'; x.lineWidth = 4; x.stroke(); x.setLineDash([]);
      const P = (u) => { const a = u < 0.5, k = a ? u * 2 : u * 2 - 1, p0 = a ? [-40, h * 0.86] : [w * 0.62, h * 0.42], p1 = a ? [w * 0.62, h * 0.96] : [w * 0.62, -20], p2 = a ? [w * 0.62, h * 0.42] : [w + 40, h * 0.12]; return [(1 - k) ** 2 * p0[0] + 2 * (1 - k) * k * p1[0] + k * k * p2[0], (1 - k) ** 2 * p0[1] + 2 * (1 - k) * k * p1[1] + k * k * p2[1]]; };
      for (const [du, col] of [[0, '#' + new THREE.Color(this.myColor).getHexString()], [0.06, '#f2f2f2']]) { const [cx, cy] = P((t * 0.16 + du) % 1); x.fillStyle = col; x.beginPath(); x.ellipse(cx, cy, 9, 5, 0.6, 0, 7); x.fill(); }
      x.fillStyle = 'rgba(10,12,18,.88)'; x.fillRect(0, h - 46, w, 46); x.fillStyle = '#e10600'; x.fillRect(0, h - 46, 8, 46);
      const pos = this.x.lastDnf ? 'DNF' : this.x.lastPos ? `P${this.x.lastPos}` : '';
      words(x, `RACE HIGHLIGHTS  ·  ${String(this.x.track || 'LAST TIME').toUpperCase()}`, w * 0.42, h - 23, "800 20px 'Segoe UI', Arial", '#fff'); if (pos) words(x, `${this.meName.split(' ').pop().toUpperCase()}  ${pos}`, w * 0.86, h - 23, "800 20px 'Segoe UI', Arial", '#ffd34d');
    });
  }
  /** the sim lounge's lap board: the regulars (made up), and whatever was set tonight */
  _lapBoard(add) {
    const V = this.V; if (!V.board) return;
    if (!this.lap) { const R = rng(hash(this.trackId || 'board')), base = { silverstone: 87.9, lasvegas: 94.2 }[this.trackId] ?? 90.6; this.lap = ['turbo_gav', 'K. Mensah', 'apexhunter', 'L. Hart', 'R. Okafor', 'sideways_sal'].map((n) => [n, base + 0.3 + R() * 2.6]); }
    for (const [n, t] of add) { const r = this.lap.find((q) => q[0] === n); if (r) r[1] = Math.min(r[1], t); else this.lap.push([n, t]); }
    this.lap.sort((a, b) => a[1] - b[1]);
    V.board.draw((x, w, h) => {
      x.fillStyle = '#04060a'; x.fillRect(0, 0, w, h); x.fillStyle = '#00b8c8'; x.fillRect(0, 0, w, 44);
      words(x, `LAP BOARD  ·  ${String(TRACK[this.trackId] || 'Silverstone').toUpperCase()}  ·  HOLD THE LINE`, w / 2, 23, "italic 900 26px 'Segoe UI', Arial", '#04060a');
      this.lap.slice(0, 6).forEach(([n, t], i) => { const cx = i % 2 ? w * 0.75 : w * 0.25, cy = 80 + Math.floor(i / 2) * 58, me = n === 'YOU'; x.fillStyle = me ? 'rgba(255,211,77,.14)' : 'rgba(255,255,255,.04)'; x.fillRect(cx - w * 0.23, cy - 24, w * 0.46, 48); words(x, `P${i + 1}`, cx - w * 0.19, cy, "800 24px 'Segoe UI', Arial", '#00d4e6'); words(x, n, cx - w * 0.03, cy, "700 24px 'Segoe UI', Arial", me ? '#ffd34d' : '#ffffff'); words(x, lapTxt(t), cx + w * 0.15, cy, '700 24px Consolas, monospace', me ? '#ffd34d' : '#c9ced8'); });
    });
  }
  _timesIdle() { const S = this.V.track?.scr; if (!S) return; S.draw((x, w, h) => { x.fillStyle = '#05070c'; x.fillRect(0, 0, w, h); x.fillStyle = '#c8102e'; x.fillRect(0, 0, w, 54); words(x, 'REDLINE  ·  LIVE TIMING', w / 2, 28, "italic 900 30px 'Segoe UI', Arial", '#fff'); words(x, 'TRACK OPEN', w / 2, h * 0.5, "800 44px 'Segoe UI', Arial", '#47ff9a'); words(x, this.bestKart ? `Fastest lap tonight  ${lapTxt(this.bestKart)}` : 'Arrive and drive · three-lap races', w / 2, h * 0.72, "600 24px 'Segoe UI', Arial", '#c9ced8'); }); }
  _boardToast() {
    if (this.V.board) { const b = this.lap?.[0]; this._toast(b ? `Fastest on the board tonight: ${b[0]}, ${lapTxt(b[1])}` : 'Nobody has set a time yet.', ''); }
    else this._toast(this.bestKart ? `Fastest lap tonight: ${lapTxt(this.bestKart)}` : 'No times yet tonight. The track is open.', '');
  }

  // ---- a quiet minute at the window (a deeper talk after it), a photo together ------------------------------------------
  _startMoment(h) {
    if (this.moment || this.game) return;
    const g = this._companion(6); this._unlock(); this.keys.clear(); if (this.seat) this._stand();
    this.moment = { t: 0, h, g, moved: false };
    this.$('.hg-bars').classList.add('in');
    const stand = g && g.spot.pose !== 'sit';
    this._caption(pick(this.V.moment || ['A quiet minute.']) + (stand ? ` ${g.first} comes to stand beside you.` : ''));
    if (stand) { this.cover.classList.add('fast'); this.cover.classList.remove('off'); }
  }
  _momentUpdate(dt) {
    const M = this.moment; M.t += dt; const L = M.h.look || this._w.set(this.pos.x + Math.cos(this.yaw) * 10, 1.5, this.pos.z + Math.sin(this.yaw) * 10);
    const dx = L.x - this.pos.x, dz = L.z - this.pos.z, wy = Math.atan2(dz, dx), wp = clamp(Math.atan2(L.y - this.pos.y, Math.hypot(dx, dz)), -0.6, 0.4);
    if (!M.moved && M.t > 0.2) { M.moved = true; if (M.g && M.g.spot.pose !== 'sit') { this.yaw = wy; this._beside(M.g, wy); } this.cover.classList.add('off'); }
    this.yaw += wrap(wy - this.yaw) * Math.min(1, dt * 1.6); this.pitch += (wp - this.pitch) * Math.min(1, dt * 1.6); this._camera(dt);
    if (M.t > 6.2) this._endMoment();
  }
  _endMoment() {
    const M = this.moment; if (!M) return; this.moment = null; this.$('.hg-bars').classList.remove('in'); this._caption(null); this.cover.classList.add('off');
    this.x.moment = true;
    if (!this.R.moment) { this.R.moment = true; this.R.moments.push(M.g ? `A quiet minute with ${M.g.first} ${this.V.where || MOMENT_WHERE[this.vid] || 'at the window'}.` : 'A quiet minute at the window.'); }
    if (M.g && !this.quiet) this._bark(M.g, pick(BARK.view)); this._taste('views'); this._lock();
  }
  /** her standing beside you, looking out the same way (a free spot to your right, else your left) -> moved */
  _beside(g, wy) {
    const fx = Math.cos(wy), fz = Math.sin(wy), rx = -fz, rz = fx;
    for (const s of [0.75, -0.75, 1.05, -1.05]) {
      const x = this.pos.x + rx * s + fx * 0.15, z = this.pos.z + rz * s + fz * 0.15; if (!this._free(x, z, 0.26, g.disc)) continue;
      g.person.group.position.set(x, 0, z); g.spot = { ...g.spot, x, z, y: 0, face: facing(fx, fz) }; g.face0 = g.spot.face; g.person.group.rotation.y = g.face0; g.disc.x = x; g.disc.z = z; return true;
    }
    return false;
  }
  _photo() {
    if (this.quiet || this.photoT > 3.5) return;
    const g = this._companion(5); let url = null;
    try { url = this._snap(g); } catch (e) { console.warn('Hangout: the photo did not come out', e); }
    this.snd.shutter(); const f = this.$('.hg-flash'); f.style.transition = 'none'; f.style.opacity = REDUCED ? '0.25' : '0.85'; requestAnimationFrame(() => requestAnimationFrame(() => { f.style.transition = 'opacity .26s'; f.style.opacity = '0'; }));
    const P = this.$('.hg-photo'); if (url) P.querySelector('img').src = url; P.querySelector('p').textContent = `${g ? `${g.first} and you` : 'The view'} · ${this.P.name}`; P.classList.add('in'); this.photoT = 4.5;
    this.R.selfies++;
    if (g) {
      this.R.photo = { with: [g.cid], venue: this.vid, secret: !!this.x.secret }; this.R.moments.push(`A photo with ${g.first}${this.V.photoBack ? ' by ' + this.V.photoBack : ''}.`); this._bark(g, pick(BARK.photo));
      if (this.x.secret) { this.R.exposure = Math.min(1, this.R.exposure + 0.15); this._toast('A lovely photo. Maybe keep that one to yourselves.', 'warn'); } else this._toast('A photo to post later, if you want to (PR)', '');
    }
  }
  /** the photo itself: you and them side by side, the phone held out in front, rendered once and read back -> data URL (hosted: the world behind you is in it) */
  _snap(g) {
    const R = this.renderer, me = this.me, W3 = this.host ? this.host.scene : this.scene;
    const cam = this.photoCam || (this.photoCam = new THREE.PerspectiveCamera(60, 1, this.host ? 0.08 : 0.05, this.host ? this.cam.far : 2600)); cam.aspect = this.cam.aspect;
    if (!g?.person) { R.render(W3, this.cam); return this.glc.toDataURL('image/jpeg', 0.82); }
    const gp = g.person.group, sit = g.spot.pose === 'sit', saved = [gp.position.clone(), gp.rotation.y, g.person.head?.rotation.y ?? 0];
    const fwd = sit ? V3(Math.cos(g.spot.face), 0, -Math.sin(g.spot.face)) : V3(Math.cos(this.yaw), 0, Math.sin(this.yaw)), rx = -fwd.z, rz = fwd.x;
    if (!sit && !this.seat) gp.position.set(this.pos.x + rx * 0.5, gp.position.y, this.pos.z + rz * 0.5);
    let showMe = false;
    if (me && !this.seat) { if (sit) me.group.position.set(gp.position.x - fwd.x * 0.3 - rx * 0.5, 0, gp.position.z - fwd.z * 0.3 - rz * 0.5); else me.group.position.set(this.pos.x, 0, this.pos.z); me.group.visible = true; showMe = true; }
    try { if (showMe && !sit) this.aff?.photoPose?.(g, true); } catch (e) { console.warn('Hangout: the photo pose', e); }   // affection hook: an arm round each other, when those bodies are built
    gp.updateMatrixWorld(true); if (showMe) me.group.updateMatrixWorld(true);
    // (worked out in the place's frame - where the people are - and the photo's camera carried into the world's)
    const H2 = this._toL((g.person.head || gp).getWorldPosition(V3())), H1 = showMe ? this._toL((me.head || me.group).getWorldPosition(V3())) : V3(this.pos.x, this.pos.y, this.pos.z);
    const mid = H1.clone().add(H2).multiplyScalar(0.5), cp = mid.clone().addScaledVector(fwd, sit ? 1.0 : 0.85).add(V3(0, 0.07, 0));
    if (!sit) gp.rotation.y = facing(cp.x - gp.position.x, cp.z - gp.position.z);
    if (showMe) me.group.rotation.y = facing(cp.x - me.group.position.x, cp.z - me.group.position.z);
    if (g.person.head) g.person.head.rotation.y = sit ? clamp(wrap(facing(cp.x - gp.position.x, cp.z - gp.position.z) - gp.rotation.y), -0.8, 0.8) : 0;
    cam.position.copy(this._toW(cp)); cam.lookAt(this._toW(mid)); cam.updateProjectionMatrix(); this.scene.updateMatrixWorld(true);
    R.render(W3, cam); const url = this.glc.toDataURL('image/jpeg', 0.82);
    try { this.aff?.photoPose?.(g, false); } catch (e) { console.warn('Hangout: the photo pose', e); }   // affection hook
    gp.position.copy(saved[0]); gp.rotation.y = saved[1]; if (g.person.head) g.person.head.rotation.y = saved[2]; if (me) me.group.visible = false;
    R.render(W3, this.cam); return url;
  }

  // ---- the night going on round you: the clock, a long lens, a phone, the others talking among themselves ---------------
  _cues() {
    // (party hook: a party's own late hour and close - the lights up at five in Las Vegas - in place of an evening's)
    if (!this.x.late && this.tl > this.lateT) { this.x.late = true; const g = this._present()[0]; if (g && !this.quiet && !this.talk) this._bark(g, pick(BARK.late)); this._toast("It's getting late.", ''); }
    if (this.tl > this.closeT && !this.game && !this.talk && !this.moment && !this.menu && !this.ask && !this.closing) this._askLeave(true);
  }
  _events(dt) {
    if (this.papT >= 0) { this.papT += dt; const t = this.papT; this.paps.visible = t < 0.06 || (t > 0.16 && t < 0.23); if (t > 0.3) { this.papT = -1; this.paps.visible = false; } }
    // paps hook (ui/PapsConfront.js): the photographers - who comes, when and why, each a person in the room; with it
    // off, the old long lens now and then
    let papsOn = false; try { papsOn = papsTick(this, dt); } catch (_) { papsOn = false; }
    if (!papsOn && !this.quiet && this.V.paps?.length && this.R.flashes < 2 && !this.game && this.t > 25) {
      const fame = this._present().reduce((m, g) => Math.max(m, g.kind === 'celeb' ? (g.C?.fame ?? 60) / 100 : 0.42), 0);
      if (Math.random() < Math.pow(1 - this.privacy, 2) * fame * 0.0045 * (flag('__hangoutPaps') ? 300 : 1) * dt) this._flash();
    }
    if (this.buzzAt != null && this.t > this.buzzAt && !this.talk && !this.game && !this.moment && !this.menu && !this.ask && !this.buzzE) this._buzz();
    if (this.buzzE?.open) { this.buzzE.t += dt; this.$('.hg-buzz s u').style.transform = `scaleX(${Math.max(0, 1 - this.buzzE.t / 8).toFixed(3)})`; if (this.buzzE.t > 8) this._buzzPick(0); }
    if (!this.quiet && !this.talk && !this.game && this._present().length > 1 && (this.chatT -= dt) <= 0) {
      this.chatT = 9 + Math.random() * 8; const P = this._present(), a = pick(P), b = pick(P.filter((g) => g !== a));
      a.glanceAt = b.person.group.position.clone(); a.glance = 3; a.nod = 2.2; b.glanceAt = a.person.group.position.clone(); b.glance = 2.6;
      if (a.kind === 'driver' && b.kind === 'driver' && Math.hypot(a.person.group.position.x - this.pos.x, a.person.group.position.z - this.pos.z) < 5) this._bark(a, pick(BARK.group), 2.8, b.first);
    }
    if (this.vid === 'pub' && Math.random() < dt * 4) this.snd.hit(1800 + Math.random() * 3000, 0.02, 0.016, 2);
  }
  /** a camera flash (at: a photographer's lens; line: what the toast says): they were seen */
  _flash(at = null, line = null) {
    if (this.quiet) return; let p = at || null; if (!p) { try { p = papsLens(this); } catch (_) { p = null; } }   // paps hook: from a photographer's lens (one steps in when none is about)
    const P = this.V.paps; if (!p) { if (!P?.length) return; p = pick(P); } const d = p.distanceTo(this.pos);
    this.paps.position.copy(p); this.paps.scale.setScalar(Math.max(d < 12 ? 0.7 : 2.2, d * 0.05)); this.papT = 0; this.R.flashes++; this.R.seen = true;
    if (!REDUCED) { const f = this.$('.hg-flash'); f.style.transition = 'none'; f.style.opacity = '0.08'; requestAnimationFrame(() => { f.style.transition = 'opacity .2s'; f.style.opacity = '0'; }); }
    this.snd.shutter();
    for (const g of this._present()) { g.glanceAt = p.clone(); g.glance = 1.8; }
    const shy = this._present().find((g) => g.kind === 'celeb' && (g.C?.traits?.privacy || 0) >= 0.6), by = shy || this._present()[0];
    if (by && !this.talk) this._bark(by, pick(BARK.flash)); if (shy) shy.dm -= 1;
    this._toast(line || 'A camera flash, outside. Someone got a picture.', 'warn');
    if (!at) { try { papsSeen(this, p); } catch (_) { /* */ } }   // paps hook (a photographer's own flash tells it himself)
  }
  /** your phone, buzzing on the table: someone else you are seeing (1 ignore it, 2 step away and answer, 3 tell her it is work) */
  _buzz() {
    if (this.buzzE) return; const her = this.buzzG = this._buzzHer(); if (!her || her.gone) { this.buzzAt = null; return; }
    const C = Celebs.CELEB?.[this.buzzOther] || (Celebs.CELEBS || []).find((x) => x.id !== her.id) || { id: 'someone', name: 'Unknown number', look: {} };
    this.buzzE = { open: true, t: 0, from: 'c:' + C.id, name: C.name, noticed: Math.random() < 0.3 + 0.5 * (her.C?.traits?.jealousy ?? 0.4) }; this.buzzAt = null;
    const B = this.$('.hg-buzz'); B.style.setProperty('--bc', C.look?.outfit || '#c83a6a');
    B.innerHTML = `<header><i>${esc(firstOf(C.name)[0] || '?')}</i>Messages · now</header><p><b>${esc(C.name)}</b>${esc(pick(BUZZ_LINES))}</p><div><button type="button" data-b="0"><kbd>1</kbd>Ignore it</button><button type="button" data-b="1"><kbd>2</kbd>Step away and answer</button><button type="button" data-b="2"><kbd>3</kbd>"Work stuff," you tell ${esc(her.first)}</button></div><s><u></u></s>`;
    B.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => this._buzzPick(+b.dataset.b)));
    B.classList.add('in'); this.snd.buzz(); this._unlock();
  }
  _buzzPick(i) {
    const E = this.buzzE; if (!E?.open) return; E.open = false; this.$('.hg-buzz').classList.remove('in');
    const her = this.buzzG || this.gs[0], f = her.first, k = ['ignore', 'answer', 'excuse'][i] || 'ignore'; this.R.buzz = k; this.R.buzzFrom = E.from;
    if (k === 'ignore') { if (E.noticed) { this.x.buzz = true; her.dm -= 1; this._toast(`${f} noticed your phone buzzing.`, 'warn'); } }
    else if (k === 'answer') { this.x.buzz = true; her.dm -= 2; this._caption('You step away for a minute to answer.', 1.8); this.R.moments.push(`Stepped away from ${f} to answer a message from ${firstOf(E.name)}.`); }
    else { this.x.buzz = true; this.R.cover++; if ((her.n?.suspicion || 0) > 40) her.dm -= 2; this._bark(her, pick(['Work. At this time of night.', 'Okay.', "Mm. Busy, aren't you?"])); this.R.moments.push(`Told ${f} a message from ${firstOf(E.name)} was work.`); }
    this._lock();
  }

  // ---- the games ---------------------------------------------------------------------------------------------------------
  _startGame(name) {
    if (this.game || this.quiet) return; const G = { pool: Pool, darts: Darts, sim: SimRig, karting: Karting, cooking: Cooking, arcade: Arcade }[name];
    const need = { pool: 'pool', darts: 'darts', sim: 'rigs', karting: 'track', cooking: 'hob', arcade: 'arcade' }[name];
    if (!G || !this.V[need]) return; const opp = this._opponent(name); if (!opp) { this._toast('Nobody to play.', ''); return; }
    if (this.seat) this._stand(); this.keys.clear(); if (this.buzzE?.open) this._buzzPick(0);
    try { this.game = new G(this, opp); } catch (e) { console.warn('Hangout: the game could not start', e); this.game = null; this._mgHide(); return; }
    this.x.played = name; this.helpT = 0; this.$('.hg-help').style.opacity = '0';
  }
  _gameOver() {
    const G = this.game, r = G.result; this.game = null;
    try { G.dispose(); } catch (e) { console.warn('Hangout: a game did not tidy up', e); }
    this._mgHide();
    if (G.back && this._free(G.back.x, G.back.z)) { this.pos.set(G.back.x, 1.66, G.back.z); this.yaw = G.back.yaw; }
    this.pitch = -0.08;
    if (!r || r.won === null) { this._lock(); return; }
    const g = G.opp; this.R.games.push(r); if (r.won === true) g.wins++; else if (r.won === false) g.losses++;
    this.x.played = r.game; this.x.won = r.won === true ? true : r.won === false ? false : undefined; if (r.text) this.R.moments.push(r.text);
    if (r.game === 'karting' && G.me?.laps?.length) this.bestKart = Math.min(this.bestKart || 999, ...G.me.laps);
    if (r.game !== 'cooking') this._bark(g, pick(r.won === true ? BARK.won : r.won === false ? BARK.lost : BARK.even));
    this._toast(r.text, r.won === true ? 'up' : '');
    for (const tg of GAME_TASTE[r.game] || []) this._taste(tg);
    if (r.game === 'karting') this._timesIdle();
    this._lock();
  }
  _mgShow(title) { this.$('.hg-mg b').textContent = title; this.$('.hg-mg span').textContent = ''; this.$('.hg-mg small').textContent = ''; this.$('.hg-mg').classList.add('in'); this.$('.hg-prompt').classList.remove('in'); }
  _mg(main, sub) { const s = this.$('.hg-mg span'), m = this.$('.hg-mg small'); if (s.textContent !== main) s.textContent = main; if (m.textContent !== (sub || '')) m.textContent = sub || ''; m.style.display = sub ? '' : 'none'; }
  _mgHelp(text) { const h = this.$('.hg-mgh'); h.textContent = text; h.classList.add('in'); }
  _mgHide() { this.$('.hg-mg').classList.remove('in'); this.$('.hg-mgh').classList.remove('in'); this._meter(null); this._aimAt(null); }
  /** the bar under a game: { fill (0..1), mark (0..1), zones: [[a, b, 'gold'?]] } or null to hide */
  _meter(o) {
    const M = this.$('.hg-meter'); if (!o) { M.classList.remove('in'); this.meterKey = null; return; }
    const key = JSON.stringify(o.zones || []) + (o.fill != null ? 'f' : '') + (o.mark != null ? 'm' : '');
    if (key !== this.meterKey) { this.meterKey = key; M.innerHTML = `${o.fill != null ? '<u></u>' : ''}${(o.zones || []).map(([a, b, c]) => `<i class="${c || ''}" style="left:${(a * 100).toFixed(1)}%;width:${((b - a) * 100).toFixed(1)}%"></i>`).join('')}${o.mark != null ? '<em></em>' : ''}`; }
    if (o.fill != null) M.querySelector('u').style.transform = `scaleX(${clamp(o.fill, 0, 1).toFixed(3)})`;
    if (o.mark != null) M.querySelector('em').style.left = `${(clamp(o.mark, 0, 1) * 100).toFixed(2)}%`;
    M.classList.add('in');
  }
  /** the darts' sight on the screen over a world point (null hides it) */
  _aimAt(p) {
    const A = this.$('.hg-aim'); if (!p) { A.classList.remove('in'); return; }
    const v = this._toW(this._v.copy(p)).project(this.cam); A.style.transform = `translate(${((v.x * 0.5 + 0.5) * innerWidth).toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * innerHeight).toFixed(1)}px)`; A.classList.add('in');
  }
  _big(text, sub = '', cls = '', dur = 1) { const B = this.$('.hg-big'); B.className = `hg-big in ${cls}`; B.querySelector('span').textContent = text; B.querySelector('small').textContent = sub || ''; this.bigT = dur; }

  // ---- words on the screen -----------------------------------------------------------------------------------------------
  _toast(text, cls = '') {
    if (!text) return; const box = this.$('.hg-toasts'), d = document.createElement('div'); d.className = `hg-toast ${cls}`; d.textContent = text; box.appendChild(d);
    while (box.children.length > 4) box.firstChild.remove();
    requestAnimationFrame(() => d.classList.add('in')); setTimeout(() => d.classList.remove('in'), 4400); setTimeout(() => d.remove(), 4700);
  }
  /** a line someone says out loud (a subtitle; to: who they are talking to, if not you) */
  _bark(g, text, dur = 3.2, to = null) {
    if (!g || !text || this.talk || this.menu || (this.isParty && this.moment)) return; const S = this.$('.hg-sub');   // (party hook: never over a moment's caption)
    S.innerHTML = `<b>${esc(g.first || g.name)}</b>${to ? `<span style="color:#8c93a0;margin-right:6px">to ${esc(to)}</span>` : ''}${esc(text)}`; S.classList.add('in'); this.subT = dur; if (g.person) g.nod = Math.min(2.4, dur * 0.6);
  }
  _caption(text, dur = 0) {
    const C = this.$('.hg-cap'); if (!text) { C.classList.remove('in'); return; }
    C.textContent = text; C.classList.add('in'); if (dur) setTimeout(() => { if (!this.moment) C.classList.remove('in'); }, dur * 1000);
  }

  // ---- calling it a night ---------------------------------------------------------------------------------------------
  _askLeave(auto = false) {
    if (this.ask || this.closing || this.game) return;
    try { if (this.party?.door?.(auto)) return; } catch (e) { console.warn('Hangout: the party door', e); }   // party hook: the DOOR menu
    this._menuClose(false); this._unlock(); this.keys.clear();
    const f = this._present().length === 1 ? this._present()[0].first : null;
    this.ask = { auto, t: 0 };
    const A = this.$('.hg-ask');
    A.innerHTML = `<h3>${auto ? 'The evening is winding down' : 'Call it a night?'}</h3><p>${auto ? `${esc(f || 'Everyone')} is starting to think about home.` : this.x.late ? "It's getting late." : f ? `${esc(f)} will understand.` : 'The others will understand.'}</p><div><button type="button" data-a="no">Not yet <kbd>Esc</kbd></button><button type="button" class="go" data-a="yes">${auto ? 'Head home' : 'Yes'} <kbd>E</kbd></button></div>`;
    A.querySelector('[data-a=yes]').addEventListener('click', () => this._finish(this._leftKind()));
    A.querySelector('[data-a=no]').addEventListener('click', () => this._closeAsk());
    A.classList.add('in');
  }
  _closeAsk() { if (!this.ask) return; if (this.ask.auto) this.tl = this.closeT - 75; this.ask = null; this.$('.hg-ask').classList.remove('in'); this._lock(); }
  _leftKind() { return this.t < 150 && !this.x.late ? 'early' : 'normal'; }
  /** goodnight: the last thing they say, then the cover, then back to the career with the result */
  _finish(left = 'normal') {
    if (this.closing) return; this.closing = true;
    this.$('.hg-ask').classList.remove('in'); this._menuClose(false); if (this.talk) { this.talk = null; this.$('.hg-talk').classList.remove('in'); }
    if (this.game) { try { this.game.dispose(); } catch (_) { /* leaving anyway */ } this.game = null; this._mgHide(); }
    if (this.moment) { this.moment = null; this.$('.hg-bars').classList.remove('in'); this._caption(null); }
    if (this.buzzE?.open) this._buzzPick(0);
    if (this.sty) this._styleClose(false);
    this.res = this.result(left); const g = this._present()[0];
    if (g) { const band = this.res.score >= 0.62 ? 'good' : this.res.score >= 0.4 ? 'ok' : 'bad'; this._bark(g, pick(this.quiet ? GOODNIGHT.quiet : GOODNIGHT[g.kind]?.[band] || GOODNIGHT.driver.ok), 2); }
    this.endT = g ? 1.1 : 0.05; this.coverT = -1; this._unlock();
  }
  _closing(dt) {
    if (this.endT > 0) { this.endT -= dt; if (this.endT <= 0) { this.cover.classList.add('fast'); this.cover.classList.remove('off'); this.coverT = 0.22; } return; }
    if (this.coverT > 0 && (this.coverT -= dt) <= 0) this._done();
  }
  _done() {
    const res = this.res || this.result('early'), cb = this.o.onDone; this._dispose();
    if (typeof cb === 'function') { try { cb(res); } catch (e) { console.error('Hangout: onDone failed', e); } }
  }
  /** something went badly wrong: out at once, with what there is */
  _abort() { if (this.disposed) return; this.res = this.result('early'); this.res.failed = true; this._done(); }

  // ---- what it came to ---------------------------------------------------------------------------------------------------
  /** how the evening went for one guest, 0..1 */
  _gscore(g) { return clamp(0.46 + clamp(g.dm * 0.032, -0.32, 0.32) + Math.min(3, g.talks) * 0.03 + (g.cheers ? 0.015 : 0) + Math.min(0.06, g.taste * 0.02) + g.wins * 0.03 + g.losses * 0.02 + (g.fx.deep ? 0.04 : 0) - (g.gone ? 0.25 : 0), 0, 1); }
  _score(left) {
    const G = this.gs, R = this.R; let s = G.length ? G.reduce((a, g) => a + this._gscore(g), 0) / G.length : 0.5;
    s += (R.moment ? 0.05 : 0) + Math.min(2, R.orders) * 0.02 + (R.mood && !this.quiet ? 0.01 : 0) + (R.selfies && !this.x.secret ? 0.01 : 0) + Math.min(0.06, R.games.length * 0.015);
    if (R.seen && (this.x.secret || G.some((g) => (g.C?.traits?.privacy || 0) >= 0.6))) s -= 0.05;
    s -= { answer: 0.06, excuse: 0.02 }[R.buzz] || 0; if (left === 'early') s -= 0.08;
    return Math.round(clamp(s, 0, 1) * 100) / 100;
  }
  /**
   * The result: { venue, guests: [cid], score 0..1, moments, minigames: { won, lost }, seen, tones, dur, left } and, for
   * the career's reader (Social.hangoutResult -> Celebs.dateResult), the sneaky side - buzz ('ignore' | 'answer' |
   * 'excuse' | null) and buzzFrom (cid), cover (cover stories told), confess, flirt - and each guest's own evening (per).
   */
  result(left = 'normal') {
    const R = this.R, res = this._result(left, R);
    // party hook: the night itself (R.party: drinks, exit, contacts, drama...) for career/Party.js partyResult
    if (this.party) { try { this.party.resultInto?.(res); } catch (e) { console.warn('Hangout: the party result', e); } }
    if (this.aff) { try { this.aff.resultInto?.(res); } catch (e) { console.warn('Hangout: the affection result', e); } }   // affection hook: res.aff (after the party's: a car home is not a walk-out)
    try { papsResultInto(this, res); } catch (_) { /* */ }   // paps hook: res.paps
    return res;
  }
  _result(left, R) {
    return { venue: this.vid, guests: this.gs.map((g) => g.cid), score: this._score(left), moments: R.moments.slice(0, 12),
      minigames: { won: R.games.filter((r) => r.won === true).length, lost: R.games.filter((r) => r.won === false).length }, seen: R.seen, tones: { ...R.tones }, dur: Math.round(this.t), left,
      buzz: R.buzz, buzzFrom: R.buzzFrom, cover: R.cover, confess: R.confess, flirt: R.flirt, fx: { ...R.fx }, games: R.games.map((r) => ({ game: r.game, won: r.won, you: r.you, them: r.them, with: r.with })),
      selfies: R.selfies, photo: R.photo, exposure: R.exposure, flashes: R.flashes, orders: R.orders, toasts: R.toasts, moment: R.moment, mood: R.mood, walkedOut: R.walkedOut,
      date: !!this.x.date, secret: !!this.x.secret, quiet: this.quiet,
      // (her look as the two of you planned it here, L: { id, rec } - the career keeps it, Social.hangoutResult)
      style: R.style || null,
      per: Object.fromEntries(this.gs.map((g) => [g.cid, { name: g.name, kind: g.kind, score: Math.round(this._gscore(g) * 100) / 100, mood: g.dm, talks: g.talks, fx: { ...g.fx }, won: g.wins, lost: g.losses, cheers: g.cheers, gone: g.gone }])) };
  }
  get state() {
    const info = this.renderer?.info?.render;
    return { venue: this.vid, ready: this.ready, closing: this.closing, t: Math.round(this.t * 10) / 10, clock: hhmm(this.clock), late: !!this.x.late, quiet: this.quiet,
      pos: { x: +this.pos.x.toFixed(2), y: +this.pos.y.toFixed(2), z: +this.pos.z.toFixed(2) }, yaw: +this.yaw.toFixed(3), seated: !!this.seat,
      talk: this.talk ? { with: this.talk.g.name, line: this.talk.line, opts: this.talk.opts ? this.talk.opts.map((o) => o.t) : null } : null, menu: this.menu ? this.menu.items.slice() : null,
      game: this.game ? { name: this.game.name, ...this.game.info() } : null, moment: !!this.moment, asking: !!this.ask, buzz: this.buzzE ? { open: !!this.buzzE.open, from: this.buzzE.name } : null,
      target: this.tgt ? (this.tgt.g ? 'guest:' + this.tgt.g.name : this.tgt.h ? this.tgt.h.id : 'staff') : null,
      guests: this.gs.map((g) => ({ cid: g.cid, name: g.name, built: !!g.person, talks: g.talks, mood: g.dm, gone: g.gone, spot: g.spot ? { x: +g.spot.x.toFixed(2), z: +g.spot.z.toFixed(2), pose: g.spot.pose } : null })),
      hots: (this.hots || []).map((h) => h.id), score: this._score('normal'), seen: this.R.seen, render: info ? { calls: info.calls, tris: info.triangles } : null,
      hosted: this.host ? { anchor: this.anchor ? { x: this.anchor.x, y: this.anchor.y, z: this.anchor.z, yaw: +this.anchor.yaw.toFixed(3) } : null, wet: !!this.hx?.wet, sphere: !!this.hx?.sphere, world: ROOM.hgWorld.value, glow: ROOM.hgSph.value, meshes: this._count() } : null };
  }
  /** hosted: how many meshes (draw calls at most) the place has in the world's scene, and how many of them are people */
  _count() {
    let n = 0, p = 0; const P = new Set([...this.gs.map((g) => g.person?.group), this.staff?.person?.group, this.me?.group].filter(Boolean));
    const walk = (o, person) => { if (!o.visible) return; const q = person || P.has(o); if (o.isMesh || o.isPoints || o.isLine || o.isSprite) { n++; if (q) p++; } for (const k of o.children) walk(k, q); };
    if (this.scene) walk(this.scene, false);
    return { all: n, people: p, place: n - p };
  }
  _api() {
    const ev = this;
    return { get state() { return ev.state; }, get game() { return ev.game; }, finish: (left = 'normal') => ev._finish(left),
      get ready() { return !!ev.ready; },   // (party hook: still building behind its cover - main.js's hangFrame draws nothing then)
      // (party hook: may the world outside be hidden this frame (a sealed venue, you not out on its terrace) - main.js's
      // hangFrame reads it every frame; where you stand ('floor' | 'bar' | 'vip' | 'dj' | 'quiet' | 'vestibule' | 'door' |
      // 'casino' | 'garage' | 'room' | ''); the party's play layer, its crowd, its cast, for tests)
      get seal() { return ev._sealed(); }, get zone() { return ev.zone || ''; }, get party() { return ev.party; }, get crowd() { return ev.crowd; }, get cast() { return ev.cast; }, get venue() { return ev.V || null; },
      get aff() { return ev.aff; },   // affection hook: the play layer (tests: menuFor, tryIt, state)
      get paps() { try { return papsLab(ev); } catch (_) { return null; } },   // paps hook: the night's photographers (tests)
      use: (id) => { const h = ev.hots?.find((x) => x.id === id); if (h && ev.ready && !ev.closing) ev._use(h); return !!h; },
      talk: (i = 0) => { const g = ev.gs[i]; if (g && ev.ready && !ev.talk) ev._open(g); ev._skipToOpts(); return ev.talk ? ev.talk.opts?.map((o) => o.t) || [] : null; },
      choose: (i = 0) => { ev._skipToOpts(); ev._choose(i); ev._skipToOpts(); return ev.talk ? (ev.talk.closing ? 'done' : ev.talk.opts?.map((o) => o.t) || []) : null; },
      leaveTalk: () => ev._leaveTalk(), play: (name) => { if (ev.ready) ev._startGame(name); return ev.game ? ev.game.name : null; }, key: (code, down = true) => ev.game?.key(code, down),
      buzz: () => ev._buzz(), pick: (i) => ev._buzzPick(i), flash: () => ev._flash(), order: (i = 0) => { const items = ORDERS[ev.vid] || ORDERS.coffee; ev._ordered(items[i % items.length]); },
      moment: () => { const h = ev.hots?.find((x) => x.kind === 'moment'); if (h) ev._startMoment(h); return !!h; }, photo: () => ev._photo(), mood: (i) => ev._moodSet(i),
      go: (x, z, yaw) => { ev.pos.x = x; ev.pos.z = z; if (yaw != null) ev.yaw = yaw; }, result: () => ev.result('normal'),
      // (her look's sheet, L: open (true) or closed (false) -> open now; the guest as she now stands, for tests)
      style: (open = true) => { if (open) ev._styleOpen(); else ev._styleClose(); return !!ev.sty; }, guest: (i = 0) => ev.gs[i] || null,
      // (frames by hand, for a test page in the background where requestAnimationFrame never fires)
      step: (n = 1, dt = 1 / 60, quick = false) => { ev.quick = quick; try { for (let i = 0; i < n && ev.on; i++) ev.frame(dt); } finally { ev.quick = false; } return ev.on ? ev.state : null; },
      // (hosted: the game's loop calls update(dt) every frame and renders the world itself; done turns true once the evening
      // has closed - its group gone from the scene, the camera put back, onDone called; dispose() closes it at once,
      // without onDone. Unhosted, update does nothing: the evening runs its own loop)
      update: (dt = 1 / 60) => { if (ev.host && ev.on) ev._tick(Math.min(0.05, Math.max(0, +dt || 0))); },
      dispose: () => ev._dispose(), get done() { return !!ev.disposed; },
      // (hosted, for tuning by eye: how much of the world's light gets in, the Sphere's glow, the room's own light)
      tune: ({ world, sphere, room } = {}) => {
        if (world != null) ROOM.hgWorld.value = +world; if (sphere != null) ROOM.hgSph.value = +sphere;
        if (room != null && ev.L0) { ev.base.hemi = ev.L0.hemi * room; ev.base.dir = ev.L0.dir * room; ev.mk.hemi += 0.01; }
        return { world: ROOM.hgWorld.value, sphere: ROOM.hgSph.value, room: ev.L0 ? ev.base.hemi / ev.L0.hemi : null };
      } };
  }

  // ---- input -------------------------------------------------------------------------------------------------------------
  _lock() { if (this.closing || !this.ready) return; try { const r = this.canvas.requestPointerLock?.(); r?.catch?.(() => {}); } catch (_) { /* (refused in a frame: dragging still looks) */ } }
  _unlock() { try { if (document.pointerLockElement) document.exitPointerLock(); } catch (_) { /* */ } }
  _input() {
    const MOVE = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight'];
    this._kd = (e) => {
      const c = e.code;
      // (hosted: the evening's keys stop here, so the game underneath never takes an Esc or a Space of ours for its own)
      if (this.host && OWN_KEYS.test(c)) e.stopPropagation();
      if (!this.ready || this.closing) { if (MOVE.includes(c) || ['Space', 'KeyE', 'KeyQ', 'Escape', 'Enter'].includes(c)) e.preventDefault(); return; }
      // party hook: the party's own keys first - C (who's here), 1/2 for a round sent over, everything while its pages are open
      try { if (papsKey(this, e)) { e.preventDefault(); return; } } catch (err) { console.warn('Hangout: the paps key', err); }   // paps hook: P
      try { if (this.party?.key?.(e)) { e.preventDefault(); return; } } catch (err) { console.warn('Hangout: the party key', err); }
      try { if (this.aff?.key?.(e)) { e.preventDefault(); return; } } catch (err) { console.warn('Hangout: the affection key', err); }   // affection hook: G
      if (this.ask) { e.preventDefault(); if (e.repeat) return; if (c === 'KeyE' || c === 'Enter' || c === 'NumpadEnter') this._finish(this._leftKind()); else if (c === 'Escape' || c === 'KeyQ') this._closeAsk(); return; }
      if (this.moment) { e.preventDefault(); if (!e.repeat && this.moment.t > 1.5) this._endMoment(); return; }
      if (this.game) { e.preventDefault(); if (c === 'KeyQ' || c === 'Escape') { if (!e.repeat) this.game.skip(); return; } if (!e.repeat) this.game.key(c, true); return; }
      // (her look open: L or Esc closes it; every other key is the sheet's own - its sliders' arrows - never a step or a word)
      if (this.sty) { if ((c === 'KeyL' || c === 'Escape') && !e.repeat) { e.preventDefault(); this._styleClose(); } return; }
      if (this.menu) { e.preventDefault(); if (/^(Digit|Numpad)[1-6]$/.test(c)) this._menuPick(+c.slice(-1) - 1); else if (c === 'Escape' || c === 'KeyQ' || c === 'KeyE') this._menuClose(); return; }
      if (this.talk) {
        e.preventDefault(); if (e.repeat) return;
        if (/^(Digit|Numpad)[1-4]$/.test(c)) this._choose(+c.slice(-1) - 1);
        else if (this.talk.closing && (c === 'KeyE' || c === 'Escape' || c === 'Enter' || c === 'Space')) this._leaveTalk();
        else if (c === 'Space' || c === 'Enter' || c === 'KeyE') this._advance();
        return;
      }
      if (this.buzzE?.open && /^(Digit|Numpad)[1-3]$/.test(c)) { e.preventDefault(); this._buzzPick(+c.slice(-1) - 1); return; }
      if (MOVE.includes(c)) { e.preventDefault(); this.keys.add(c); }
      if (e.repeat) return;
      if (c === 'KeyE') { e.preventDefault(); this._interact(); } else if (c === 'KeyF') { e.preventDefault(); this._cheers(); } else if (c === 'KeyL') { e.preventDefault(); this._styleOpen(); } else if (c === 'KeyQ' || c === 'Escape') { e.preventDefault(); this._askLeave(); } else if (c === 'Space') e.preventDefault();
    };
    this._ku = (e) => { this.keys.delete(e.code); if (this.game && !this.closing) this.game.key(e.code, false); };
    this._md = (e) => {
      if (!this.ready || this.closing) return;
      if (this.game) { this.drag = true; this._lock(); this.game.mouse('down', e); return; }
      if (this.talk?.closing && e.button === 0) { this._leaveTalk(); return; }
      if (this.talk || this.menu || this.ask || this.moment || this.sty || e.button !== 0) return;
      this.drag = true; this._lock();
    };
    this._mu = (e) => { this.drag = false; if (this.game && !this.closing) this.game.mouse('up', e); };
    this._mm = (e) => {
      if (!this.ready || this.closing || (document.pointerLockElement !== this.canvas && !this.drag)) return;
      if (this.game) { this.game.mouse('move', e); return; }
      if (this.talk || this.menu || this.ask || this.moment || this.sty) return;
      this.yaw += (e.movementX || 0) * 0.0024; this.pitch = clamp(this.pitch - (e.movementY || 0) * 0.0024, -1.0, 0.75);
    };
    this._bl = () => { this.keys.clear(); this.drag = false; };
    window.addEventListener('keydown', this._kd, true); window.addEventListener('keyup', this._ku, true); window.addEventListener('mouseup', this._mu); window.addEventListener('mousemove', this._mm); window.addEventListener('blur', this._bl);
    this.canvas.addEventListener('mousedown', this._md);
  }
  _dispose() {
    if (this.disposed) return; this.disposed = true; this.on = false;
    try { this.aff?.dispose?.(); } catch (e) { console.warn('Hangout: affection did not tidy up', e); } this.aff = null;   // affection hook: first (its pair frames before PartyPlay's and the people's)
    try { papsDispose(this); } catch (_) { /* */ }   // paps hook: the photographers out of the room
    // party hook: the play layer first (its HUD, its pseudo-games), then the crowd out of the room (its templates and shared
    // material are the session's: they must not be freed with the room's own)
    try { this.party?.dispose?.(); } catch (e) { console.warn('Hangout: the party did not tidy up', e); } this.party = null;
    try { this.crowd?.dispose?.(); } catch (e) { console.warn('Hangout: the crowd did not tidy up', e); } this.crowd = null;
    for (const g of Object.values(this.cast || {})) { if (!g?.person || this.gs.includes(g) || g === this.staff) continue; this.scene?.remove(g.person.group); try { g.person.dispose(); } catch (_) { /* */ } g.person = null; }
    window.removeEventListener('keydown', this._kd, true); window.removeEventListener('keyup', this._ku, true); window.removeEventListener('mouseup', this._mu); window.removeEventListener('mousemove', this._mm); window.removeEventListener('blur', this._bl);
    this.canvas?.removeEventListener('mousedown', this._md); this._unlock();
    try { this.game?.dispose(); } catch (_) { /* */ } this.game = null;
    try { this.sty?.destroy(); } catch (_) { /* */ } this.sty = null;
    try { this.mus?.stop?.(1.2); } catch (_) { /* */ } try { this.crowdBed?.stop?.(1.2); } catch (_) { /* */ } this.snd.stop();
    for (const p of [...this.gs.map((g) => g.person), this.staff?.person, this.me]) { if (!p) continue; this.scene.remove(p.group); try { p.dispose(); } catch (_) { /* */ } }
    // (hosted: the group out of the world's scene, then freed - all but the city's facade material, which it only borrowed)
    if (this.host && this.scene) this.host.scene.remove(this.scene);
    this.scene?.traverse((o) => { if (o.isInstancedMesh) o.dispose(); if ((o.isMesh || o.isPoints || o.isLine) && o.geometry) o.geometry.dispose(); if (o.material && !o.userData.hgKeep) for (const m of [].concat(o.material)) { m.map?.dispose?.(); m.dispose?.(); } });
    if (this._dg) { for (const k of ['glass', 'liquid', 'cup', 'top']) this._dg[k].dispose(); this._dg.glassM.dispose(); this._dg.cupM.dispose(); for (const m of this._dg.mats) m.dispose(); }
    if (this._pd) { for (const g of Object.values(this._pd.geo)) g.dispose(); for (const m of Object.values(this._pd.mat)) m.dispose(); this._pd = null; }   // party hook: the hand drinks
    for (const t of this.K?.tex || []) t.dispose();
    if (this.host) this._unhost();
    else { try { this.renderer?.dispose(); this.renderer?.forceContextLoss?.(); } catch (_) { /* */ } }
    this.el?.remove(); if (window.__hangout === this.api) window.__hangout = null;
  }
  /**
   * Hosted, on the way out: the game's camera as it was (fov, near, far, where it stood and looked), the Sphere's glow off,
   * and a black curtain for a moment, fading as the career comes back, so no stray frame of the world shows in between
   * (the renderer and the scene are the game's: nothing of theirs is disposed).
   */
  _unhost() {
    const C = this.camSave, cam = this.cam;
    if (C && cam) { cam.fov = C.fov; cam.near = C.near; cam.far = C.far; cam.zoom = C.zoom; cam.up.copy(C.up); cam.position.copy(C.pos); cam.quaternion.copy(C.quat); cam.updateProjectionMatrix(); }
    ROOM.hgSph.value = 0;
    try { const k = document.createElement('div'); k.id = 'hangout-curtain'; document.body.appendChild(k); requestAnimationFrame(() => requestAnimationFrame(() => k.classList.add('off'))); setTimeout(() => k.remove(), 600); } catch (_) { /* (no page to draw on) */ }
  }
}

/**
 * The evening, played: o = { c (the career, or null), venue (a Social VENUES id or { id, name, privacy }), guests: [{ kind:
 * 'driver' | 'celeb', id, name, team?, color?, color2?, look? }], night, track (id or track), audio (the AudioEngine),
 * secret (a date kept quiet), quiet / grave (a grave week), onDone(result), host? } -> a handle (window.__hangout as
 * well): { state, finish(left), update(dt), dispose(), done, ... }.
 * host = { scene, camera, renderer, anchor: { x, y, z, yaw, look? }, trackId, night }: the evening is staged in the
 * game's own world - one group in host.scene at the anchor, its floor at anchor.y, its view (the roof's glass, the pub's
 * windows, the flat's glass wall) facing world (sin yaw, 0, cos yaw), i.e. yaw = atan2(tx - x, tz - z) to face a point
 * t (or pass anchor.look = { x, z }) - with no renderer, loop, background, fog or light of its own: the caller's loop calls
 * update(dt) every frame and renders the frame itself; host.camera is driven while it lasts and its fov, near, far and
 * pose are put back when it closes, and done turns true. Without a host it opens its own renderer (the fallback).
 * If the 3D cannot start, onDone gets a neutral result on the next tick so the hub never waits (hosted, the handle
 * returned is then already done; unhosted, it is null).
 */
export function showHangout(o = {}) {
  if (!document.getElementById('hangout-css')) { const st = document.createElement('style'); st.id = 'hangout-css'; st.textContent = HANGOUT_CSS; document.head.appendChild(st); }
  if (window.__hangout && document.getElementById('hangout')) return window.__hangout;
  try { return new Evening(o).api; }
  catch (e) {
    console.error('Hangout: the evening could not open', e); document.getElementById('hangout')?.remove();
    const res = { venue: venueKey(o.venue), guests: (o.guests || []).filter(Boolean).map((g) => (g.kind === 'celeb' || g.kind === 'star' ? 'c:' : 'd:') + (g.id || g.name)), score: 0.5, moments: [], minigames: { won: 0, lost: 0 }, seen: false, tones: {}, dur: 0, left: 'early', failed: true };
    setTimeout(() => { try { o.onDone?.(res); } catch (err) { console.error('Hangout: onDone failed', err); } }, 0);
    // (hosted: a handle that is already done, so a loop calling update() each frame simply hands back)
    return o.host ? { done: true, state: null, update() {}, finish() {}, dispose() {} } : null;
  }
}

/** a dartboard: twenty segments in black and cream, red and green doubles and trebles, the bull, the numbers round it (radius 225.5 mm on 256 px) */
function dartboard(x, w, h) {
  const c = w / 2, k = 256 / 0.2255, O = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
  x.fillStyle = '#111'; x.fillRect(0, 0, w, h);
  const ring = (r0, r1, a0, a1, col) => { x.fillStyle = col; x.beginPath(); x.arc(c, c, r1 * k, a0, a1); x.arc(c, c, r0 * k, a1, a0, true); x.closePath(); x.fill(); };
  for (let i = 0; i < 20; i++) {
    const a0 = -Math.PI / 2 + (i - 0.5) * (Math.PI / 10), a1 = a0 + Math.PI / 10, dark = i % 2 === 0;
    ring(0.0159, 0.099, a0, a1, dark ? '#16130f' : '#efe2c2'); ring(0.099, 0.107, a0, a1, dark ? '#c8102e' : '#1f8a52'); ring(0.107, 0.162, a0, a1, dark ? '#16130f' : '#efe2c2'); ring(0.162, 0.170, a0, a1, dark ? '#c8102e' : '#1f8a52');
    const am = a0 + Math.PI / 20; words(x, String(O[i]), c + Math.cos(am) * 0.196 * k, c + Math.sin(am) * 0.196 * k, `700 ${0.022 * k}px 'Segoe UI', Arial`, '#f2f2f2');
  }
  x.fillStyle = '#1f8a52'; x.beginPath(); x.arc(c, c, 0.0159 * k, 0, 7); x.fill(); x.fillStyle = '#c8102e'; x.beginPath(); x.arc(c, c, 0.00635 * k, 0, 7); x.fill();
  x.strokeStyle = 'rgba(200,200,205,.7)'; x.lineWidth = 1; for (const r of [0.0159, 0.099, 0.107, 0.162, 0.170]) { x.beginPath(); x.arc(c, c, r * k, 0, 7); x.stroke(); }
}
