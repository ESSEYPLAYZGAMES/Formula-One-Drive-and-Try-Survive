// Your phone, in the career hub. It slides in from the right over the studio: a modern handset, the screen in the
// hub's light glass, your team's colour on everything you send. MESSAGES first - everyone you can text, unread at the
// top: the drivers you have got to know on the grid walk (your team-mate is always there), the celebrities you have
// met, your team principal, your race engineer and, if you hired one, your PR manager. Each has their initials in their
// team's colour or the colour she wears, where you stand with them, and a small lock on a relationship you are keeping
// quiet (its previews hidden on the list, as a careful person's phone would). A filter narrows it to drivers,
// celebrities or the team. Open a chat and it is all there in bubbles, grouped by race week; pick a reply (1-4) and it
// goes, the dots tell you they are typing, and their answer pops in. PLANS: who (one celebrity, or up to three drivers
// for a night out), where (the places open this week - the rooftop over the Strip only in Las Vegas week, the village
// pub only at Silverstone - with what each costs, what it takes out of you, how private it is and whether it is their
// kind of place), then the invitation; the answer comes back in the chat, and a yes is booked in THE WEEK. Invitations
// to you wait in PLANS for an answer. A chat can be deleted (tap twice: it leaves no trace, which is rather the point),
// and when someone you are seeing has found out about someone else, she is pinned on top until you face her. In a grave
// week the phone is quiet: kind words only, and no plans but a quiet coffee with a friend. All of it is the career's
// (Social.js, Celebs.js): the phone draws it, saves after every change and never touches the hub behind it. Esc puts it
// away, Backspace goes back a screen, Enter confirms.
import { contactsOf, threadOf, markRead, replyOptions, sendText, deleteThread, inviteOut, respondInvite, unreadCount, VENUES } from '../career/Social.js';
import * as Celebs from '../career/Celebs.js';

const CSS = `
#phone { position: fixed; inset: 0; z-index: 46; pointer-events: none; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #151a22; --tc: #e10600; }
#phone button { all: unset; box-sizing: border-box; cursor: pointer; -webkit-tap-highlight-color: transparent; }
#phone button:focus-visible { outline: 2px solid var(--tc); outline-offset: 2px; }
#phone button:disabled { cursor: default; opacity: .42; }
#phone svg { display: block; flex: none; fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
#phone .ph-scrim { position: absolute; inset: 0; pointer-events: auto; cursor: default; background: linear-gradient(90deg, rgba(21,26,34,0) 30%, rgba(21,26,34,.24)); opacity: 0; transition: opacity .22s ease; }
#phone.show .ph-scrim { opacity: 1; }
#phone .ph-dev { position: absolute; right: 32px; top: 0; bottom: 0; margin: auto 0; width: 372px; height: min(744px, calc(100vh - 32px)); padding: 10px; border-radius: 54px; pointer-events: auto; outline: none; background: linear-gradient(150deg, #3a404b, #111318 34%, #1c2027 72%, #0a0b0e); box-shadow: inset 0 0 0 1.5px #4d5461, inset 0 0 0 4px #07080b, 0 34px 80px rgba(10,14,24,.40), 0 8px 22px rgba(10,14,24,.20); transform: translateX(calc(100% + 80px)) rotate(4deg); transition: transform .22s cubic-bezier(.2,.8,.2,1); }
#phone.show .ph-dev { transform: none; }
#phone .ph-dev::before, #phone .ph-dev::after { content: ''; position: absolute; width: 3px; border-radius: 2px; background: #2a2f37; }
#phone .ph-dev::before { right: -2px; top: 150px; height: 72px; }
#phone .ph-dev::after { left: -2px; top: 120px; height: 44px; box-shadow: 0 58px 0 #2a2f37; }
#phone .ph-scr { position: relative; height: 100%; border-radius: 45px; overflow: hidden; background: #f2f4f7; display: flex; flex-direction: column; isolation: isolate; }
#phone .ph-sb { flex: none; position: relative; height: 42px; display: flex; align-items: center; justify-content: space-between; padding: 6px 28px 0 34px; font: 700 13.5px/1 'Segoe UI', Arial, sans-serif; font-variant-numeric: tabular-nums; }
#phone .ph-isl { position: absolute; left: 50%; top: 11px; width: 100px; height: 29px; margin-left: -50px; border-radius: 16px; background: #050608; }
#phone .ph-sig { display: flex; align-items: center; gap: 5px; }
#phone .ph-sig small { font: 700 11px/1 'Segoe UI', Arial, sans-serif; color: #d6202e; }
#phone .ph-bars { display: flex; align-items: flex-end; gap: 1.5px; height: 11px; margin-right: 2px; } #phone .ph-bars i { width: 3px; border-radius: 1px; background: #151a22; }
#phone .ph-bat { position: relative; width: 24px; height: 12px; border-radius: 4px; border: 1.5px solid rgba(21,26,34,.42); padding: 1.5px; }
#phone .ph-bat::after { content: ''; position: absolute; right: -4px; top: 2.5px; width: 2px; height: 4px; border-radius: 0 2px 2px 0; background: rgba(21,26,34,.42); }
#phone .ph-bat i { display: block; height: 100%; border-radius: 2px; background: #151a22; transform-origin: left center; transform: scaleX(var(--b, .96)); transition: transform .25s ease; }
#phone .ph-bat.low i { background: #e5484d; }
#phone .ph-home { position: absolute; left: 50%; bottom: 7px; width: 124px; height: 4.5px; margin-left: -62px; border-radius: 3px; background: rgba(21,26,34,.38); z-index: 4; pointer-events: none; }
#phone .ph-view { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; }
#phone .ph-view.push { animation: phPush .2s cubic-bezier(.2,.8,.2,1) both; } #phone .ph-view.pop { animation: phPop .2s cubic-bezier(.2,.8,.2,1) both; } #phone .ph-view.swap { animation: phSwap .18s ease both; }
@keyframes phPush { from { opacity: 0; transform: translateX(28px); } }
@keyframes phPop { from { opacity: 0; transform: translateX(-28px); } }
@keyframes phSwap { from { opacity: 0; transform: translateY(8px); } }
#phone .ph-list.in { animation: phSwap .16s ease both; }
#phone .ph-hd { flex: none; padding: 2px 18px 6px; }
#phone .ph-hdt { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
#phone .ph-hd h2 { margin: 0; font: 800 27px/1.1 'Segoe UI', Arial, sans-serif; letter-spacing: -.01em; }
#phone .ph-hd > small { display: block; margin-top: 2px; font: 600 12px/1.3 'Segoe UI', Arial, sans-serif; color: #6b7480; }
#phone .ph-done { font: 700 14px/1 'Segoe UI', Arial, sans-serif; color: var(--tc); padding: 6px 4px; }
#phone .ph-hdx { flex: none; padding: 4px 14px 8px; }
#phone .ph-seg { display: flex; gap: 2px; padding: 3px; border-radius: 11px; background: rgba(21,26,34,.07); }
#phone .ph-seg button { flex: 1; text-align: center; padding: 7px 4px; border-radius: 8px; font: 700 11.5px/1 'Segoe UI', Arial, sans-serif; color: #3a4350; transition: background .15s, box-shadow .15s, color .15s; }
#phone .ph-seg button.on { background: #fff; color: #151a22; box-shadow: 0 1px 6px rgba(25,35,60,.14); }
#phone .ph-seg button i { font-style: normal; color: #8a93a0; margin-left: 4px; font-weight: 600; }
#phone .ph-tip { display: block; margin: 7px 4px 0; font: 600 11.5px/1.3 'Segoe UI', Arial, sans-serif; color: #6b7480; } #phone .ph-tip.c { text-align: center; margin-top: 8px; }
#phone .ph-body { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 2px 10px 12px; scrollbar-width: thin; scrollbar-color: rgba(21,26,34,.2) transparent; }
#phone .ph-body::-webkit-scrollbar, #phone .ph-msgs::-webkit-scrollbar { width: 4px; } #phone .ph-body::-webkit-scrollbar-thumb, #phone .ph-msgs::-webkit-scrollbar-thumb { background: rgba(21,26,34,.2); border-radius: 2px; }
#phone .ph-empty { margin: 22px 18px; text-align: center; font: 500 13px/1.45 'Segoe UI', Arial, sans-serif; color: #6b7480; }
#phone .ph-row { display: flex; align-items: center; gap: 11px; width: 100%; padding: 8px; border-radius: 14px; transition: background .12s; }
#phone .ph-row:hover { background: rgba(21,26,34,.045); }
#phone .ph-mid { flex: 1; min-width: 0; display: block; }
#phone .ph-row b { display: block; font: 700 14px/1.25 'Segoe UI', Arial, sans-serif; color: #2a313c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#phone .ph-row p { margin: 2px 0 0; font: 400 12.5px/1.3 'Segoe UI', Arial, sans-serif; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#phone .ph-row p i { color: #9aa3ae; }
#phone .ph-row.unread b, #phone .ph-row.unread p { color: #151a22; } #phone .ph-row.unread p { font-weight: 600; }
#phone .ph-end { flex: none; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
#phone .ph-end small { font: 600 11px/1 'Segoe UI', Arial, sans-serif; color: #8a93a0; }
#phone .ph-dot { min-width: 19px; height: 19px; padding: 0 6px; border-radius: 10px; background: color-mix(in srgb, var(--tc) 90%, #000); color: #fff; font: 800 11px/19px 'Segoe UI', Arial, sans-serif; font-style: normal; text-align: center; }
#phone .ph-st { display: inline-block; padding: 3px 7px; border-radius: 999px; font: 800 9.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: color-mix(in srgb, var(--sc) 78%, #000); background: color-mix(in srgb, var(--sc) 14%, #fff); white-space: nowrap; }
#phone .ph-av { flex: none; position: relative; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; font: 800 14.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .02em; color: var(--ai, #fff); background: radial-gradient(circle at 32% 26%, color-mix(in srgb, var(--ac) 62%, #fff), var(--ac) 58%, color-mix(in srgb, var(--ac) 78%, #000)); box-shadow: inset 0 0 0 1px rgba(21,26,34,.08); }
#phone .ph-av.sm { width: 30px; height: 30px; font-size: 11px; } #phone .ph-av.lg { width: 84px; height: 84px; font-size: 28px; }
#phone .ph-lk { position: absolute; right: -3px; bottom: -3px; width: 18px; height: 18px; border-radius: 50%; background: #151a22; color: #fff; display: grid; place-items: center; box-shadow: 0 0 0 2px #f2f4f7; font-style: normal; }
#phone .ph-av.sm .ph-lk { width: 14px; height: 14px; right: -4px; bottom: -4px; } #phone .ph-lk svg { stroke-width: 2.6; }
#phone .ph-cf { display: flex; align-items: center; gap: 11px; width: 100%; margin: 2px 0 8px; padding: 10px 12px; border-radius: 16px; background: linear-gradient(135deg, #fff1f1, #fff 70%); box-shadow: inset 0 0 0 1px rgba(229,72,77,.35), 0 6px 16px rgba(229,72,77,.12); }
#phone .ph-cf b { display: block; font: 800 14px/1.2 'Segoe UI', Arial, sans-serif; color: #a31620; } #phone .ph-cf small { display: block; margin-top: 2px; font: 600 12px/1.2 'Segoe UI', Arial, sans-serif; color: #8f2a20; }
#phone .ph-cf > i { flex: none; width: 10px; height: 10px; margin-right: 4px; border-radius: 50%; background: #e5484d; animation: phPing 1.6s ease-out infinite; }
@keyframes phPing { 0%, 100% { transform: scale(.85); opacity: 1; } 60% { transform: scale(1.45); opacity: .35; } }
#phone .ph-tabs { flex: none; display: flex; gap: 8px; padding: 6px 40px 20px; background: rgba(255,255,255,.92); border-top: 1px solid rgba(21,26,34,.07); }
#phone .ph-tabs button { position: relative; flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding-top: 3px; font: 700 10.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .03em; color: #8a93a0; transition: color .15s; }
#phone .ph-tabs button.on { color: var(--tc); }
#phone .ph-tabs em { position: absolute; top: -2px; left: calc(50% + 7px); min-width: 17px; height: 17px; padding: 0 5px; border-radius: 9px; background: #e5484d; color: #fff; font: 800 10px/17px 'Segoe UI', Arial, sans-serif; font-style: normal; text-align: center; box-shadow: 0 0 0 2px #fff; }
#phone .ph-th { flex: none; display: flex; align-items: center; gap: 8px; padding: 0 10px 8px 6px; border-bottom: 1px solid rgba(21,26,34,.07); }
#phone .ph-ib { flex: none; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; color: var(--tc); transition: background .12s; }
#phone .ph-ib:hover { background: rgba(21,26,34,.06); }
#phone .ph-ib.armed { width: auto; padding: 0 12px; border-radius: 18px; background: #e5484d; color: #fff; font: 800 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .08em; animation: phSwap .14s ease both; }
#phone .ph-who { flex: 1; min-width: 0; display: block; }
#phone .ph-who b { display: block; font: 700 15px/1.2 'Segoe UI', Arial, sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#phone .ph-who small { display: block; margin-top: 2px; font: 600 11.5px/1.2 'Segoe UI', Arial, sans-serif; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#phone .ph-who small em { font-style: normal; font-weight: 800; color: color-mix(in srgb, var(--sc) 80%, #000); margin-right: 5px; }
#phone .ph-mt { display: block; height: 3px; margin-top: 5px; max-width: 120px; border-radius: 2px; background: #e3e7ed; overflow: hidden; }
#phone .ph-mt i { display: block; height: 100%; background: var(--mc, var(--tc)); transform-origin: left center; transform: scaleX(var(--p, 0)); }
#phone .ph-steps { display: flex; gap: 4px; margin-right: 6px; } #phone .ph-steps i { width: 7px; height: 7px; border-radius: 50%; background: #d6dbe3; } #phone .ph-steps i.on { background: var(--tc); }
#phone .ph-sus { flex: none; display: flex; align-items: center; gap: 7px; padding: 7px 14px; background: #fff7e6; color: #8a5a00; font: 600 12px/1.3 'Segoe UI', Arial, sans-serif; border-bottom: 1px solid #f5dca8; }
#phone .ph-msgs { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 6px 12px 8px; display: flex; flex-direction: column; gap: 2px; scrollbar-width: thin; scrollbar-color: rgba(21,26,34,.2) transparent; }
#phone .ph-day { align-self: center; margin: 12px 0 6px; padding: 3px 9px; border-radius: 999px; background: rgba(21,26,34,.05); font: 700 10px/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: .1em; color: #7d8592; text-transform: uppercase; }
#phone .ph-b { position: relative; max-width: 80%; padding: 8px 12px; border-radius: 18px; font: 400 14px/1.36 'Segoe UI', Arial, sans-serif; overflow-wrap: anywhere; }
#phone .ph-b.them { align-self: flex-start; background: #fff; color: #151a22; box-shadow: 0 1px 1.5px rgba(25,35,60,.10); }
#phone .ph-b.me { align-self: flex-end; background: color-mix(in srgb, var(--tc) 88%, #000); color: #fff; }
#phone .ph-b.them.tail { border-bottom-left-radius: 6px; margin-bottom: 5px; } #phone .ph-b.me.tail { border-bottom-right-radius: 6px; margin-bottom: 5px; }
#phone .ph-b.inv small { display: block; font: 800 9.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; opacity: .75; margin-bottom: 4px; }
#phone .ph-b.sys { align-self: center; max-width: 88%; text-align: center; background: rgba(21,26,34,.055); color: #3a4350; font-size: 12px; border-radius: 12px; margin: 4px 0; }
#phone .ph-b.big { font-size: 15.5px; max-width: 92%; }
#phone .ph-b.pop, #phone .ph-note.pop { animation: phBub .2s cubic-bezier(.2,.9,.3,1.25) both; animation-delay: var(--d, 0ms); }
#phone .ph-b.me.pop { transform-origin: 100% 100%; } #phone .ph-b.them.pop { transform-origin: 0 100%; }
@keyframes phBub { from { opacity: 0; transform: translateY(10px) scale(.8); } }
#phone .ph-typing { align-self: flex-start; display: flex; gap: 4px; padding: 13px 14px; margin-top: 2px; border-radius: 18px 18px 18px 6px; background: #fff; box-shadow: 0 1px 1.5px rgba(25,35,60,.10); transform-origin: 0 100%; animation: phBub .2s cubic-bezier(.2,.9,.3,1.25) .35s both; }
#phone .ph-typing i { width: 7px; height: 7px; border-radius: 50%; background: #9aa3ae; animation: phDot 1.1s ease-in-out infinite; } #phone .ph-typing i:nth-child(2) { animation-delay: .16s; } #phone .ph-typing i:nth-child(3) { animation-delay: .32s; }
@keyframes phDot { 0%, 60%, 100% { transform: translateY(0); opacity: .45; } 30% { transform: translateY(-4px); opacity: 1; } }
#phone .ph-seen { align-self: flex-end; margin: -2px 4px 2px; font: 600 10.5px/1 'Segoe UI', Arial, sans-serif; color: #8a93a0; }
#phone .ph-note { align-self: center; display: flex; align-items: center; gap: 8px; max-width: 92%; margin: 8px 0 4px; padding: 9px 12px; border-radius: 14px; font: 600 12.5px/1.35 'Segoe UI', Arial, sans-serif; }
#phone .ph-note.ok { background: #e9f8ef; color: #1d5e3c; } #phone .ph-note.no { background: #fff1f0; color: #8f2a20; }
#phone .ph-dock { flex: none; display: flex; flex-direction: column; gap: 5px; padding: 8px 10px 20px; background: rgba(255,255,255,.94); border-top: 1px solid rgba(21,26,34,.07); }
#phone .ph-rp { display: flex; align-items: flex-start; gap: 8px; width: 100%; padding: 8px 10px; border-radius: 14px; background: #f2f4f7; box-shadow: inset 0 0 0 1px rgba(21,26,34,.07); font: 500 13px/1.32 'Segoe UI', Arial, sans-serif; color: #151a22; transition: background .12s, box-shadow .12s, transform .12s; }
#phone .ph-rp:hover:not(:disabled) { background: #fff; box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--tc) 55%, transparent); }
#phone .ph-rp:active:not(:disabled), #phone .ph-opt:active:not(:disabled) { transform: scale(.985); }
#phone kbd { flex: none; width: 18px; height: 18px; border-radius: 5px; background: #fff; box-shadow: inset 0 0 0 1px #d6dbe3; display: grid; place-items: center; font: 800 10.5px/1 'Segoe UI', Arial, sans-serif; color: #5d6675; }
#phone .ph-rp span { flex: 1; min-width: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#phone .ph-rp i { flex: none; font: 800 9px/18px 'Segoe UI', Arial, sans-serif; letter-spacing: .12em; font-style: normal; color: var(--tn, #8a93a0); }
#phone .ph-none { margin: 4px 0 2px; text-align: center; font: 500 12.5px/1.3 'Segoe UI', Arial, sans-serif; color: #8a93a0; }
#phone .ph-plan { display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%; margin-top: 2px; padding: 8px 10px; border-radius: 12px; font: 700 12.5px/1 'Segoe UI', Arial, sans-serif; color: var(--tc); transition: background .12s; }
#phone .ph-plan:hover:not(:disabled) { background: color-mix(in srgb, var(--tc) 8%, transparent); }
#phone .ph-new { display: flex; align-items: center; gap: 11px; width: 100%; margin: 4px 0; padding: 12px 13px; border-radius: 16px; background: #fff; box-shadow: 0 1px 3px rgba(25,35,60,.08); color: var(--tc); transition: transform .14s, box-shadow .14s; }
#phone .ph-new:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(25,35,60,.12); }
#phone .ph-new > span { flex: 1; min-width: 0; } #phone .ph-new b { display: block; font: 800 14px/1.2 'Segoe UI', Arial, sans-serif; color: #151a22; } #phone .ph-new small { display: block; margin-top: 3px; font: 500 12px/1.3 'Segoe UI', Arial, sans-serif; color: #6b7480; }
#phone .ph-sec { margin: 14px 6px 7px; font: 800 10.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #8a93a0; }
#phone .ph-card { background: #fff; border-radius: 16px; padding: 11px 12px; box-shadow: 0 1px 3px rgba(25,35,60,.08); margin-bottom: 8px; }
#phone .ph-ch { display: flex; align-items: center; gap: 10px; }
#phone .ph-ch b { display: block; font: 700 13.5px/1.2 'Segoe UI', Arial, sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #phone .ph-ch small { display: block; margin-top: 2px; font: 600 11.5px/1.2 'Segoe UI', Arial, sans-serif; color: #6b7480; }
#phone .ph-card > p { margin: 8px 0 0; font: 400 13px/1.4 'Segoe UI', Arial, sans-serif; color: #3a4350; }
#phone .ph-card > p.ph-ok { color: #1f8a52; font-weight: 700; font-size: 12px; }
#phone .ph-avs { display: flex; flex: none; } #phone .ph-avs .ph-av + .ph-av { margin-left: -9px; box-shadow: 0 0 0 2px #fff; }
#phone .ph-acts { display: flex; gap: 6px; margin-top: 10px; }
#phone .ph-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; border-radius: 12px; background: #eef1f5; font: 800 11.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: #1d2430; transition: transform .12s, box-shadow .12s, background .12s; }
#phone .ph-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(25,35,60,.12); }
#phone .ph-btn.go { background: color-mix(in srgb, var(--tc) 90%, #000); color: #fff; }
#phone .ph-btn.wide { width: 100%; padding: 13px 12px; font-size: 12px; }
#phone .ph-foot { flex: none; padding: 8px 12px 22px; background: rgba(255,255,255,.94); border-top: 1px solid rgba(21,26,34,.07); }
#phone .ph-tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
#phone .ph-tile { position: relative; display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 0; padding: 11px 6px 9px; border-radius: 15px; background: #fff; box-shadow: 0 1px 3px rgba(25,35,60,.08); text-align: center; transition: transform .14s, box-shadow .14s; }
#phone .ph-tile:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(25,35,60,.12); }
#phone .ph-tile.on { box-shadow: 0 0 0 2px var(--tc), 0 8px 16px rgba(25,35,60,.12); }
#phone .ph-tile b { max-width: 100%; font: 700 12.5px/1.15 'Segoe UI', Arial, sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #phone .ph-tile small { max-width: 100%; font: 600 10.5px/1.15 'Segoe UI', Arial, sans-serif; color: #8a93a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#phone .ph-tick { position: absolute; top: 7px; right: 7px; width: 18px; height: 18px; border-radius: 50%; background: var(--tc); color: #fff; display: grid; place-items: center; animation: phBub .16s both; } #phone .ph-tick svg { stroke-width: 3; }
#phone .ph-guests { display: flex; align-items: center; } #phone .ph-guests .ph-av + .ph-av { margin-left: -8px; box-shadow: 0 0 0 2px #f2f4f7; }
#phone .ph-guests small { flex: 1; min-width: 0; margin-left: 9px; font: 600 12px/1.25 'Segoe UI', Arial, sans-serif; color: #3a4350; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#phone .ph-vg { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
#phone .ph-vc { position: relative; display: flex; flex-direction: column; gap: 5px; min-width: 0; padding: 10px 10px 9px; border-radius: 16px; background: #fff; box-shadow: 0 1px 3px rgba(25,35,60,.08); text-align: left; transition: transform .14s, box-shadow .14s; }
#phone .ph-vc:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(25,35,60,.13); }
#phone .ph-vc:disabled { opacity: .62; }
#phone .ph-vc kbd { position: absolute; top: 9px; right: 9px; }
#phone .ph-vi { width: 34px; height: 34px; border-radius: 11px; display: grid; place-items: center; color: #fff; background: linear-gradient(140deg, color-mix(in srgb, var(--vc) 70%, #fff), var(--vc)); box-shadow: 0 4px 10px color-mix(in srgb, var(--vc) 35%, transparent); }
#phone .ph-vi.lg { width: 54px; height: 54px; border-radius: 16px; }
#phone .ph-vc b { font: 700 13px/1.2 'Segoe UI', Arial, sans-serif; } #phone .ph-vc p { margin: 0; font: 400 11.5px/1.3 'Segoe UI', Arial, sans-serif; color: #6b7480; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#phone .ph-vt { display: flex; flex-wrap: wrap; gap: 4px; } #phone .ph-vt span { display: inline-flex; align-items: center; gap: 3px; padding: 3px 6px; border-radius: 7px; background: #f2f4f7; font: 700 10px/1 'Segoe UI', Arial, sans-serif; color: #3a4350; }
#phone .ph-vc em { display: flex; align-items: center; gap: 4px; font: 700 10.5px/1.2 'Segoe UI', Arial, sans-serif; font-style: normal; color: #1f8a52; } #phone .ph-vc em.no { color: #b4232c; } #phone .ph-vc em.meh { color: #a87400; }
#phone .ph-hero { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; margin: 6px 0 10px; padding: 16px 16px 14px; border-radius: 20px; color: #fff; background: radial-gradient(120% 140% at 100% 0%, color-mix(in srgb, var(--vc) 55%, #fff) 0%, var(--vc) 45%, color-mix(in srgb, var(--vc) 55%, #000) 100%); box-shadow: 0 12px 26px color-mix(in srgb, var(--vc) 30%, transparent); }
#phone .ph-hero .ph-vi { background: rgba(255,255,255,.18); box-shadow: inset 0 0 0 1px rgba(255,255,255,.3); }
#phone .ph-hero b { font: 800 19px/1.15 'Segoe UI', Arial, sans-serif; } #phone .ph-hero p { margin: 0; font: 500 12.5px/1.4 'Segoe UI', Arial, sans-serif; opacity: .92; }
#phone .ph-kv { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid #edf0f4; font: 500 12.5px/1.3 'Segoe UI', Arial, sans-serif; color: #6b7480; } #phone .ph-kv:last-child { border-bottom: 0; }
#phone .ph-kv b { display: flex; align-items: center; gap: 6px; font-weight: 700; color: #151a22; text-align: right; } #phone .ph-kv b i { font-style: normal; font-weight: 500; color: #8a93a0; }
#phone .ph-pv { display: inline-flex; gap: 2px; } #phone .ph-pv i { width: 6px; height: 6px; border-radius: 50%; background: #d6dbe3; } #phone .ph-pv i.on { background: #1f8a52; }
#phone .ph-tipc { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; padding: 9px 11px; border-radius: 13px; font: 600 12px/1.35 'Segoe UI', Arial, sans-serif; }
#phone .ph-tipc.good { background: #e9f8ef; color: #1d5e3c; } #phone .ph-tipc.warn { background: #fff4e0; color: #8a5a00; } #phone .ph-tipc.meh { background: #eceff3; color: #5d6675; }
#phone .ph-cfv { display: flex; flex-direction: column; align-items: center; padding-top: 12px; }
#phone .ph-cfa { position: relative; margin: 6px 0 12px; }
#phone .ph-cfa::before { content: ''; position: absolute; inset: -7px; border-radius: 50%; box-shadow: 0 0 0 2px rgba(229,72,77,.55); animation: phRing 2s ease-out infinite; }
@keyframes phRing { 0% { transform: scale(.94); opacity: .9; } 80%, 100% { transform: scale(1.2); opacity: 0; } }
#phone .ph-cfv.out .ph-cfa::before { display: none; }
#phone .ph-cfv .ph-sec { align-self: stretch; text-align: center; }
#phone .ph-opt { display: flex; align-items: flex-start; gap: 10px; width: 100%; margin-bottom: 6px; padding: 10px 12px; border-radius: 14px; background: #fff; box-shadow: 0 1px 3px rgba(25,35,60,.08); text-align: left; transition: transform .12s, box-shadow .12s; }
#phone .ph-opt:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 16px rgba(25,35,60,.12); }
#phone .ph-opt > span { flex: 1; min-width: 0; } #phone .ph-opt b { display: block; font: 700 13.5px/1.25 'Segoe UI', Arial, sans-serif; } #phone .ph-opt small { display: block; margin-top: 2px; font: 500 11.5px/1.3 'Segoe UI', Arial, sans-serif; color: #6b7480; }
#phone .ph-cfv.out h3 { margin: 0 0 8px; font: 800 20px/1.2 'Segoe UI', Arial, sans-serif; } #phone .ph-res { margin: 0 18px; text-align: center; font: 500 14px/1.5 'Segoe UI', Arial, sans-serif; color: #3a4350; }
#phone .ph-toast { position: absolute; left: 14px; right: 14px; top: 46px; z-index: 5; padding: 10px 13px; border-radius: 14px; background: rgba(21,26,34,.93); color: #fff; font: 600 12.5px/1.38 'Segoe UI', Arial, sans-serif; box-shadow: 0 12px 26px rgba(10,14,24,.25); opacity: 0; transform: translateY(-10px) scale(.97); transition: opacity .18s ease, transform .18s ease; pointer-events: none; }
#phone .ph-toast.on { opacity: 1; transform: none; } #phone .ph-toast.ok { background: rgba(21,98,60,.95); } #phone .ph-toast.bad { background: rgba(158,30,38,.95); }
@media (max-height: 660px) { #phone .ph-hd h2 { font-size: 23px; } #phone .ph-row { padding: 6px 8px; } #phone .ph-av { width: 38px; height: 38px; font-size: 13px; } #phone .ph-av.sm { width: 28px; height: 28px; font-size: 10.5px; } #phone .ph-av.lg { width: 68px; height: 68px; font-size: 23px; } #phone .ph-rp { padding: 6px 9px; } #phone .ph-dock, #phone .ph-tabs, #phone .ph-foot { padding-bottom: 16px; } #phone .ph-vc p { -webkit-line-clamp: 1; } #phone .ph-hero { padding: 12px 14px 11px; } }
@media (max-width: 720px) { #phone .ph-dev { right: 8px; left: 8px; width: auto; height: calc(100vh - 16px); border-radius: 40px; padding: 7px; } #phone .ph-scr { border-radius: 34px; } }
@media (prefers-reduced-motion: reduce) { #phone *, #phone *::before, #phone *::after { animation-duration: .01ms !important; animation-delay: 0ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
`;

// ---- small helpers (local copies: the phone imports nothing from the hub) --------------------------------------------
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const first = (n) => String(n || '').split(' ')[0];
const initials = (n) => { const p = String(n || '?').trim().split(/\s+/); return ((p[0]?.[0] || '?') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); };
/** $M as the phone shows it: 'Free', '$50k', '$1.2M' */
const money = (m) => (!m ? 'Free' : m < 0.1 ? `$${Math.round(m * 1000)}k` : `$${(Math.round(m * 10) / 10).toFixed(1)}M`);
/** how light a colour is (0 black .. 1 white): a near-white livery or outfit gets dark initials and is never a bubble colour */
const luma = (hex) => {
  let h = String(hex || '').replace('#', ''); if (h.length === 3) h = h.replace(/./g, (x) => x + x);
  const n = parseInt(h, 16); if (h.length !== 6 || Number.isNaN(n)) return 0.4;
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone', montreal: 'Montreal' };
const trackName = (id) => TRACK[id] || String(id || '').replace(/^\w/, (x) => x.toUpperCase());
const svg = (d, w = 24) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" aria-hidden="true">${d}</svg>`;
// (line icons, drawn in currentColor)
const I = {
  back: '<path d="M15 4.5 7.5 12l7.5 7.5"/>', next: '<path d="M9 4.5 16.5 12 9 19.5"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  chat: '<path d="M12 4.5c4.7 0 8.5 3.1 8.5 7s-3.8 7-8.5 7c-1 0-2-.1-2.9-.4L4.5 19.5l1.2-3.6a6.6 6.6 0 0 1-2.2-4.4c0-3.9 3.8-7 8.5-7z"/>',
  plans: '<rect x="3.5" y="5" width="17" height="15" rx="3.5"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14h3M8 17h6"/>',
  bin: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 12.5h9l1-12.5M10 11v5M14 11v5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  check: '<path d="M5 12.5 10 17l9-10"/>', cross: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  bolt: '<path d="M13 3 5.5 13.5H11L10 21l7.5-10.5H12z"/>', star: '<path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/>',
  warn: '<path d="M12 4 21 19.5H3z"/><path d="M12 10v4M12 17v.5"/>', eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
};
// (each place's icon and colour: a skyline and a moon, a dartboard, a steering wheel, a home, a candlelit table, a flag)
const VI = {
  rooftop: '<path d="M3 20h18M5 20v-7h3v7M10 20V8h4v12M16 20v-5h3v5"/><path d="M18.5 3.5a2.5 2.5 0 1 0 2 4 3 3 0 0 1-2-4z"/>',
  pub: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/>',
  simlounge: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.2"/><path d="M4.4 10.5h5.4M14.2 10.5h5.4M12 14.2V20"/>',
  apartment: '<path d="M4 11 12 5l8 6v9H4z"/><path d="M10 20v-5h4v5"/>',
  restaurant: '<path d="M7 3v7a2 2 0 0 0 4 0V3M9 12v9M16 3c-2.2 2-2.2 7 0 9v9"/>',
  karting: '<path d="M5 21V4h13l-2.5 4.5L18 13H5"/><path d="M9 4v9M13 4v9M5 8.5h13"/>',
  coffee: '<path d="M5 9.5h11v4.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8.5 3.5v3M12 3.5v3"/>',
  other: '<path d="M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>',
  poolclub: '<path d="M3 15c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0M3 19.5c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0"/><path d="M9 12V5a2 2 0 0 1 4 0M15 12V5a2 2 0 0 1 4 0M9 8h6"/>',
};
const VC = { poolclub: '#0fa3b8', rooftop: '#5b3fd0', pub: '#8a5a2b', simlounge: '#0f9fb2', apartment: '#e0861a', restaurant: '#b23a48', karting: '#e10600', coffee: '#7a5537', cafe: '#7a5537' };
const vIcon = (id) => VI[id] || (/coffee|cafe/i.test(id || '') ? VI.coffee : VI.other);
// (a reply's tone, tagged like the grid walk's options; leave and neutral lines carry no tag)
const TONE = { kind: ['KIND', '#1f8a52'], firm: ['FIRM', '#3d7bd9'], light: ['LIGHT', '#a87400'], cold: ['COLD', '#6b7480'], cruel: ['CRUEL', '#d6202e'], sorry: ['APOLOGISE', '#7c5cc9'],
  gossip: ['GOSSIP', '#a849b8'], flirt: ['FLIRT', '#d6336c'], show: ['SHOW OFF', '#d9480f'], cover: ['COVER STORY', '#5d6675'], deep: ['HEART TO HEART', '#3d7bd9'], banter: ['BANTER', '#a87400'], advice: ['ADVICE', '#0f8f84'] };
// (where you stand: a friendship's stage with a driver, a bond's stage with a celebrity)
const FRIEND = { acquaintance: ['Acquaintance', '#8a93a0'], friendly: ['Friendly', '#3d7bd9'], friend: ['Friend', '#1f9d5a'], mate: ['Mate', '#0f8f84'], best: ['Best mate', '#c08a12'] };
const HEART = { stranger: ['Not met', '#8a93a0'], met: ['Just met', '#8a93a0'], friendly: ['Friendly', '#3d7bd9'], flirting: ['Flirting', '#d6336c'], dating: ['Dating', '#c2255c'], partner: ['Partner', '#a61e4d'], ex: ['Ex', '#6b7480'] };
// (a driver's tastes are a game mechanic, shown lightly: never a claim about the real person)
const TASTE = { gaming: 'a game or two', food: 'good food', music: 'music', competition: 'a bit of competition', quiet: 'quieter spots', views: 'a view', coffee: 'good coffee' };
// (her favourite evening as a place: dinner is the private dining room, cooking is your flat)
const FAV = { cooking: 'apartment', dinner: 'restaurant', rooftop: 'rooftop', karting: 'karting' };
// (what each answer to a confrontation tends to bring, under the label the career gives it)
const HINT = { confess: 'Honest. It will hurt, and she may still stay.', deny: 'Only works if she has little to go on.', tabloids: 'Easier with a good public image.',
  endOther: 'She stays, warily. {other} will not take it well.', beg: 'It rarely works twice.',
  chooseHer: 'She gets what she wanted. {other} reads about it in the papers.', stall: 'Buys you a little time. She will not wait twice.', endHer: 'She may not go quietly.' };
// (an invitation still waiting for an answer)
const LIVE = ['pending', 'open', 'sent', 'waiting'];
const STATUS = { accepted: ['Accepted', '#1f8a52'], declined: ['Declined', '#d6202e'], lapsed: ['Lapsed', '#8a93a0'], expired: ['Lapsed', '#8a93a0'], done: ['Done', '#3d7bd9'], used: ['Done', '#3d7bd9'] };
const NOSIG = '<div class="ph-body ph-cfv"><p class="ph-empty">No signal. Your phone comes with a career.</p></div>';

// ---- reading the career (every call guarded: a hiccup in the social engine never breaks the phone) -------------------
const safe = (f, d = null) => { try { const v = f(); return v ?? d; } catch (e) { console.warn('Phone:', e); return d; } };
const save = (c) => { try { c?.save?.(); } catch (e) { console.warn('Phone: save failed', e); } };
/** a contact id's kind: 'd:<driver>' a driver, 'c:<celeb>' a celebrity, 'x:boss' / 'x:eng' / 'x:pr' your team */
const kindOf = (cid) => (String(cid).startsWith('d:') ? 'driver' : String(cid).startsWith('c:') ? 'celeb' : 'staff');
const idOf = (cid) => String(cid).slice(2);
const CEL = (id) => Celebs.CELEB?.[id] || null;
const bond = (c, id) => (typeof Celebs.bondOf === 'function' && CEL(id) ? safe(() => Celebs.bondOf(c, id)) : null);
const trackOf = (c) => (c?.calendar?.length ? c.calendar[(Math.max(1, c.round) - 1) % c.calendar.length] : null);
const weekLine = (c) => (c.round > c.rounds ? 'Off-season' : `${trackName(trackOf(c))} week`);
const ago = (c, at) => (at && at.season != null ? (c.season - at.season) * (c.rounds || 6) + (c.round - at.round) : 99);
/** a grave week: the race just run hurt someone, or the paddock has just lost someone (the phone goes quiet) */
const grave = (c) => !!c?.pr?.ctx?.grave || (c?.lost || []).some((l) => ago(c, l) <= 1);
const contacts = (c) => safe(() => contactsOf(c), []);
const thread = (c, cid) => safe(() => threadOf(c, cid), []);
const confrontOf = (c) => (c?.celebs?.confront && CEL(c.celebs.confront.id) ? c.celebs.confront : null);
const venues = () => (Array.isArray(VENUES) ? VENUES : []);
const venueOf = (id) => venues().find((v) => v.id === id) || null;
/** in a grave week: only a quiet coffee (a place the social engine marks quiet), never a night out */
const quietVenues = () => venues().filter((v) => v.grave || v.quiet || /coffee|cafe/i.test(v.id || ''));
const invites = (c) => (Array.isArray(c?.social?.invites) ? c.social.invites : []);
const isLive = (v) => !v.status || LIVE.includes(v.status);
const incoming = (c) => invites(c).filter((v) => v.to === 'me' && isLive(v));
const outgoing = (c) => invites(c).filter((v) => v.to !== 'me' && (isLive(v) || ago(c, v) <= 0)).slice(-6).reverse();
const book = (c) => new Map(contacts(c).map((x) => [x.cid, x]));
/** who a contact id is, from the phone book or the career itself */
const nameOf = (c, cid, B = null) => {
  const x = B?.get(cid); if (x?.name) return x.name;
  const k = kindOf(cid), id = idOf(cid);
  if (k === 'driver') return c.drivers?.[id]?.name || 'Unknown';
  if (k === 'celeb') return CEL(id)?.name || 'Unknown';
  return { boss: 'Team principal', eng: 'Race engineer', pr: c.pr?.manager?.name || 'PR manager' }[id] || 'Unknown';
};
/** their colour: a driver's team, the colour she wears, your team for the engineer */
const colourOf = (c, cid) => {
  const k = kindOf(cid), id = idOf(cid);
  if (k === 'driver') return c.teams?.[c.drivers?.[id]?.team]?.color || '#6b7480';
  if (k === 'celeb') return (typeof Celebs.styledColor === 'function' && safe(() => Celebs.styledColor(c, id))) || CEL(id)?.look?.outfit || '#8a6a9a';   // (the colour of the look you planned for her)
  return id === 'pr' ? '#6d5bd0' : id === 'eng' ? c.teams?.[c.myTeam]?.color || '#3d7bd9' : '#20252e';
};
const avatar = (c, cid, name, cls = '', lock = false) => {
  const col = colourOf(c, cid);
  return `<span class="ph-av${cls ? ' ' + cls : ''}" style="--ac:${esc(col)};--ai:${luma(col) > 0.62 ? '#151a22' : '#fff'}">${esc(initials(name))}${lock ? `<i class="ph-lk">${svg(I.lock, cls === 'sm' ? 8 : 10)}</i>` : ''}</span>`;
};
/** a relationship you are keeping quiet (the phone book says so, or her bond does) */
const secretOf = (c, x) => !!x?.secret || (kindOf(x?.cid) === 'celeb' && !!bond(c, idOf(x.cid))?.secret);
const stageOf = (x) => { const T = kindOf(x.cid) === 'driver' ? FRIEND : kindOf(x.cid) === 'celeb' ? HEART : null; return T && x.stage ? T[x.stage] || [String(x.stage), '#8a93a0'] : null; };
const pill = (x) => { const s = stageOf(x); return s ? `<span class="ph-st" style="--sc:${s[1]}">${esc(s[0])}</span>` : ''; };
/** a message's stamp: 'R3' (another season: '2026 · R3') */
const rTxt = (c, m) => (m?.round == null ? '' : m.season != null && m.season !== c.season ? `${m.season} · R${m.round}` : `R${m.round}`);
/** the divider above a race week's messages: 'R3 · Las Vegas week' */
const weekTxt = (c, m) => {
  if (m?.round == null) return '';
  if (m.season != null && m.season !== c.season) return `${m.season} · Round ${m.round}`;
  return m.round > (c.rounds || 99) ? "Season's end" : `R${m.round} · ${trackName(c.calendar?.[(m.round - 1) % (c.calendar?.length || 1)])} week`;
};
/** where you stand, as a hairline under the name: friendship with a driver, her affection for you */
const meterOf = (c, cid) => {
  const k = kindOf(cid), id = idOf(cid);
  if (k === 'driver') {
    const lv = c.social?.friends?.[id]?.level; if (lv == null) return '';
    return `<i class="ph-mt" title="Friendship ${Math.round(lv)}/100"><i style="--p:${(Math.max(0, Math.min(100, lv)) / 100).toFixed(3)}"></i></i>`;
  }
  if (k === 'celeb') {
    const b = bond(c, id); if (!b || b.stage === 'stranger') return '';
    const a = b.aff || 0;
    return `<i class="ph-mt" title="Affection ${Math.round(a)}"><i style="--p:${(Math.min(100, Math.abs(a)) / 100).toFixed(3)};--mc:${a < 0 ? '#e5484d' : '#d6336c'}"></i></i>`;
  }
  return '';
};
const privTxt = (p) => (p >= 0.8 ? 'Discreet' : p >= 0.55 ? 'Quiet' : p >= 0.35 ? 'Seen' : 'Very public');
/** whether it is their kind of place: [text, good] or null */
const suits = (c, cids, v) => {
  if (cids.length === 1 && kindOf(cids[0]) === 'celeb') {
    const C = CEL(idOf(cids[0])); if (!C) return null;
    return FAV[C.fav] === v.id ? [`${first(C.name)} would love this`, true] : FAV[C.meh] === v.id ? [`Not really ${first(C.name)}'s thing`, false] : null;
  }
  for (const g of cids) {
    const t = (c.social?.friends?.[idOf(g)]?.tastes || []).find((x) => (v.tastes || []).includes(x));
    if (t) return [`${first(nameOf(c, g))} likes ${TASTE[t] || t}`, true];
  }
  return null;
};
/** the places for these guests this week, each with why it cannot be booked ('' when it can) -> [{ v, why }] */
const venuesFor = (c, cids) => {
  const tr = trackOf(c), k = cids.length > 1 ? 'group' : kindOf(cids[0]) === 'celeb' ? 'date' : 'friend';
  return (grave(c) ? quietVenues() : venues()).map((v) => {
    const why = v.where && v.where !== tr ? `${trackName(v.where)} week only` : Array.isArray(v.kinds) && !v.kinds.includes(k) ? (k === 'date' ? 'Not for a date' : k === 'group' ? 'Not for a group' : 'Not for this') : (c.wallet ?? 0) < (v.cost || 0) ? `Needs ${money(v.cost)}` : '';
    return { v, why };
  });
};
/** whether a plan can be made with this kind of contact now (a grave week: a quiet coffee with a driver at most) */
const planOk = (c, k) => k !== 'staff' && (!grave(c) || (k === 'driver' && quietVenues().length > 0));

// ---- the screens -------------------------------------------------------------------------------------------------------
const head = (t, sub) => `<div class="ph-hd"><div class="ph-hdt"><h2>${esc(t)}</h2><button class="ph-done" data-pa="close">Done</button></div><small>${esc(sub)}</small></div>`;
const tabs = (c, on) => {
  const n = (safe(() => unreadCount(c), 0) || 0) + (confrontOf(c) ? 1 : 0), p = incoming(c).length;
  return `<nav class="ph-tabs"><button data-pt="chats" class="${on === 'chats' ? 'on' : ''}">${svg(I.chat, 23)}<span>Messages</span>${n ? `<em>${n > 9 ? '9+' : n}</em>` : ''}</button><button data-pt="plans" class="${on === 'plans' ? 'on' : ''}">${svg(I.plans, 23)}<span>Plans</span>${p ? `<em>${p}</em>` : ''}</button></nav>`;
};
const stepHead = (t, n) => `<div class="ph-th"><button class="ph-ib" data-pa="back" aria-label="Back">${svg(I.back)}</button><span class="ph-who"><b>${esc(t)}</b><small>New plan · step ${n} of 3</small></span><span class="ph-steps">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span></div>`;
/** a chat on the list: who, the last word (hidden for a secret), when, unread or where you stand */
const row = (c, x) => {
  const T = thread(c, x.cid), m = T[T.length - 1], lock = secretOf(c, x);
  const prev = lock && m ? '<i>Preview hidden</i>' : m ? `${m.from === 'me' ? 'You: ' : ''}${esc(m.text)}` : esc(x.sub || '');
  return `<button class="ph-row${x.unread ? ' unread' : ''}" data-pc="${esc(x.cid)}">${avatar(c, x.cid, x.name, '', lock)}<span class="ph-mid"><b>${esc(x.name)}</b><p>${prev}</p></span><span class="ph-end"><small>${esc(m ? rTxt(c, m) : '')}</small>${x.unread ? `<em class="ph-dot">${x.unread > 9 ? '9+' : x.unread}</em>` : pill(x)}</span></button>`;
};

/** MESSAGES: a confrontation pinned on top, a filter, then everyone you can text (unread first) */
function chatsView(c, S) {
  const L = contacts(c), by = (k) => L.filter((x) => kindOf(x.cid) === k), n = L.reduce((a, x) => a + (x.unread || 0), 0), cf = confrontOf(c);
  const segs = [['all', 'All', L.length], ['driver', 'Drivers', by('driver').length], ['celeb', 'Celebs', by('celeb').length], ['staff', 'Team', by('staff').length]].filter(([k, , m]) => k === 'all' || m);
  const F = segs.some(([k]) => k === S.filter) ? S.filter : 'all', shown = F === 'all' ? L : by(F), C = cf ? CEL(cf.id) : null;
  return `${head('Messages', `${n ? `${n} unread` : 'All caught up'} · ${weekLine(c)}`)}
    <div class="ph-hdx"><div class="ph-seg">${segs.map(([k, t, m]) => `<button data-pf="${k}" class="${F === k ? 'on' : ''}">${t}${k !== 'all' ? `<i>${m}</i>` : ''}</button>`).join('')}</div></div>
    <div class="ph-body">${C ? `<button class="ph-cf" data-pa="conf">${avatar(c, 'c:' + cf.id, C.name)}<span class="ph-mid"><b>${esc(first(C.name))} wants to talk</b><small>Now. It can't wait.</small></span><i></i></button>` : ''}<div class="ph-list">${shown.map((x) => row(c, x)).join('') || `<p class="ph-empty">${L.length ? 'Nobody here yet.' : 'No one to text yet. Meet people on the grid walk.'}</p>`}</div></div>
    ${tabs(c, 'chats')}`;
}

/** a conversation: who, where you stand, the bubbles by race week, the dots while they type, your replies (1-4) */
function threadView(c, S) {
  const cid = S.cid, B = book(c), x = B.get(cid) || { cid, name: nameOf(c, cid), sub: '', stage: null }, k = kindOf(cid), F = first(x.name), lock = secretOf(c, x);
  const T = thread(c, cid), typing = S.typing && S.typing.cid === cid ? S.typing : null, upto = typing ? Math.min(typing.at, T.length) : T.length, wk = (m) => `${m?.season}|${m?.round}`;
  let out = '', prev = null;
  for (let i = 0; i < upto; i++) {
    const m = T[i], nx = i + 1 < upto ? T[i + 1] : null; if (!m) continue;
    const day = weekTxt(c, m);
    if (day && (!prev || wk(prev) !== wk(m))) out += `<div class="ph-day">${esc(day)}</div>`;
    const sys = (m.from !== 'me' && m.from !== 'them') || m.kind === 'system' || m.kind === 'sys', pop = S.pop != null && i >= S.pop;
    const st = pop ? ` style="--d:${Math.min(5, i - S.pop) * 70}ms"` : '', tail = !nx || nx.from !== m.from || wk(nx) !== wk(m);
    const cls = sys ? 'ph-b sys' : `ph-b ${m.from === 'me' ? 'me' : 'them'}${tail ? ' tail' : ''}${m.kind === 'invite' ? ' inv' : ''}`;
    out += `<div class="${cls}${pop ? ' pop' : ''}"${st}>${!sys && m.kind === 'invite' ? '<small>Invitation</small>' : ''}${esc(m.text)}</div>`;
    prev = m;
  }
  if (!typing && upto && T[upto - 1].from === 'me') out += '<div class="ph-seen">Delivered</div>';
  if (typing) out += `<div class="ph-typing" role="status" aria-label="${esc(F)} is typing"><i></i><i></i><i></i></div>`;
  else if (S.note && S.note.cid === cid) out += `<div class="ph-note ${S.note.ok ? 'ok' : 'no'}${S.note.fresh ? ' pop' : ''}">${svg(S.note.ok ? I.check : I.cross, 16)}<span>${esc(S.note.text)}</span></div>`;
  if (!out) out = `<p class="ph-empty">No messages with ${esc(F)} yet.</p>`;
  const s = stageOf(x), armed = S.armed === 'del:' + cid, b = k === 'celeb' ? bond(c, idOf(cid)) : null;
  const sus = b && (b.stage === 'dating' || b.stage === 'partner') && (b.suspicion || 0) >= 40;
  const opts = (safe(() => replyOptions(c, cid), []) || []).slice(0, 4), dis = typing ? ' disabled' : '';
  return `<div class="ph-th"><button class="ph-ib" data-pa="back" aria-label="Back">${svg(I.back)}</button>${avatar(c, cid, x.name, 'sm', lock)}<span class="ph-who"><b>${esc(x.name)}</b><small>${s ? `<em style="--sc:${s[1]}">${esc(s[0])}</em>` : ''}${esc(x.sub || '')}${lock ? ' · kept quiet' : ''}</small>${meterOf(c, cid)}</span>${T.length ? `<button class="ph-ib${armed ? ' armed' : ''}" data-pa="del" aria-label="Delete this chat">${armed ? 'DELETE?' : svg(I.bin, 20)}</button>` : ''}</div>
    ${sus ? `<div class="ph-sus">${svg(I.warn, 14)}<span>${esc(F)} has been asking questions lately.</span></div>` : ''}
    <div class="ph-msgs">${out}</div>
    <div class="ph-dock">${opts.map((o, i) => { const t = TONE[o.tone]; return `<button class="ph-rp" data-pr="${esc(o.key)}" data-kn="${i + 1}"${dis}><kbd>${i + 1}</kbd><span>${esc(o.text)}</span>${t ? `<i style="--tn:${t[1]}">${t[0]}</i>` : ''}</button>`; }).join('') || '<p class="ph-none">Nothing more to say for now.</p>'}${planOk(c, k) ? `<button class="ph-plan" data-pa="plan"${dis}>${svg(I.plans, 16)}<span>${grave(c) ? `A quiet coffee with ${esc(F)}` : `Make plans with ${esc(F)}`}</span>${svg(I.next, 14)}</button>` : ''}</div>`;
}

/** an invitation as a card: who, where, the message; yours carry how it went, theirs wait for your answer */
const inviteCard = (c, B, v, inbound) => {
  const V = venueOf(v.venue), who = (inbound ? [v.from, ...(v.guests || []).filter((g) => g !== v.from)] : v.guests?.length ? v.guests : [v.to]).filter((g) => g && g !== 'me');
  const names = who.map((g) => first(nameOf(c, g, B))), st = STATUS[v.status] || ['Waiting', '#a87400'], id = esc(String(v.id));
  const title = inbound ? `${names[0] || 'Someone'}${names.length > 1 ? ` + ${names.length - 1}` : ''}` : names.join(', ') || 'Your plan';
  return `<div class="ph-card"><div class="ph-ch"><span class="ph-avs">${who.slice(0, 3).map((g) => avatar(c, g, nameOf(c, g, B), 'sm')).join('')}</span><span class="ph-mid"><b>${esc(title)}</b><small>${esc(V ? V.name : 'Somewhere')}${v.kind === 'date' ? ' · a date' : ''}</small></span>${inbound ? '' : `<span class="ph-st" style="--sc:${st[1]}">${st[0]}</span>`}</div>${v.msg ? `<p>${esc(v.msg)}</p>` : ''}${inbound ? `<div class="ph-acts"><button class="ph-btn" data-pi="${id}" data-ok="0">Not this week</button><button class="ph-btn go" data-pi="${id}" data-ok="1">${svg(I.check, 15)}Accept</button></div>` : v.status === 'accepted' ? '<p class="ph-ok">Book it in THE WEEK.</p>' : ''}</div>`;
};

/** PLANS: a new plan, the invitations waiting for your answer, and what you have asked this week */
function plansView(c, S) {
  const B = book(c), inc = incoming(c), mine = outgoing(c), quiet = grave(c), can = planOk(c, 'driver');
  const neu = can ? `<button class="ph-new" data-pa="new">${svg(I.plus, 20)}<span><b>${quiet ? 'A quiet coffee' : 'Make a plan'}</b><small>${quiet ? 'Somewhere quiet with a friend. Nothing more this week.' : 'Who, where, then the invitation. A yes is booked in THE WEEK.'}</small></span>${svg(I.next, 16)}</button>` : '<p class="ph-empty">A quiet week. Plans can wait.</p>';
  return `${head('Plans', `${inc.length ? `${inc.length} waiting for you` : 'Nothing waiting'} · ${weekLine(c)}`)}
    <div class="ph-body"><div class="ph-list">${neu}${inc.length ? `<div class="ph-sec">Waiting for you</div>${inc.map((v) => inviteCard(c, B, v, true)).join('')}` : ''}${mine.length ? `<div class="ph-sec">This week</div>${mine.map((v) => inviteCard(c, B, v, false)).join('')}` : ''}${!inc.length && !mine.length && can ? '<p class="ph-empty">No plans yet this week.</p>' : ''}</div></div>
    ${tabs(c, 'plans')}`;
}

/** a new plan, step one: who - one celebrity (a date), or up to three drivers (a night out) */
function whoView(c, S) {
  const P = S.plan, L = contacts(c), kinds = grave(c) ? ['driver'] : ['driver', 'celeb'], K = kinds.includes(P.kind) ? P.kind : 'driver';
  const list = L.filter((x) => kindOf(x.cid) === K), n = P.cids.length, full = K === 'driver' && n >= 3;
  const tile = (x) => { const on = P.cids.includes(x.cid), s = stageOf(x); return `<button class="ph-tile${on ? ' on' : ''}" data-pg="${esc(x.cid)}"${!on && full ? ' disabled' : ''}>${avatar(c, x.cid, x.name, '', secretOf(c, x))}<b>${esc(first(x.name))}</b><small>${esc(s ? s[0] : x.sub || '')}</small>${on ? `<i class="ph-tick">${svg(I.check, 12)}</i>` : ''}</button>`; };
  return `${stepHead('Who?', 1)}
    <div class="ph-hdx">${kinds.length > 1 ? `<div class="ph-seg">${kinds.map((k) => `<button data-pk="${k}" class="${K === k ? 'on' : ''}">${k === 'driver' ? 'Drivers' : 'Celebrities'}</button>`).join('')}</div>` : ''}<small class="ph-tip">${K === 'driver' ? (grave(c) ? 'A friend, for a quiet coffee.' : 'Up to three: a night out together.') : 'One at a time: it is a date.'}</small></div>
    <div class="ph-body"><div class="ph-tiles ph-list">${list.map(tile).join('') || `<p class="ph-empty">${K === 'driver' ? 'No drivers in your phone yet.' : 'You have not met anyone yet.'}</p>`}</div></div>
    <div class="ph-foot"><button class="ph-btn go wide" data-pa="next" data-kenter="1"${n ? '' : ' disabled'}>${n ? `Choose a place · ${n === 1 ? esc(first(nameOf(c, P.cids[0]))) : `${n} people`}` : 'Pick someone'}${svg(I.next, 15)}</button></div>`;
}

/** step two: where - the places open this week, what each costs, what it takes out of you, how private it is */
function whereView(c, S) {
  const P = S.plan, B = book(c), list = venuesFor(c, P.cids), names = P.cids.map((g) => first(nameOf(c, g, B))).join(', ');
  const card = ({ v, why }, i) => {
    const s = why ? null : suits(c, P.cids, v);
    return `<button class="ph-vc" data-pv="${esc(v.id)}" data-kn="${i + 1}"${why ? ' disabled' : ''} style="--vc:${VC[v.id] || '#3d7bd9'}"><kbd>${i + 1}</kbd><span class="ph-vi">${svg(vIcon(v.id), 18)}</span><b>${esc(v.name)}</b><p>${esc(v.blurb || '')}</p><span class="ph-vt"><span>${money(v.cost)}</span><span>${svg(I.bolt, 11)}${v.energy ?? 0}</span><span>${privTxt(v.privacy ?? 0.5)}</span></span>${why ? `<em class="no">${esc(why)}</em>` : s ? `<em class="${s[1] ? '' : 'meh'}">${svg(s[1] ? I.star : I.eye, 11)}${esc(s[0])}</em>` : ''}</button>`;
  };
  return `${stepHead('Where?', 2)}
    <div class="ph-hdx"><div class="ph-guests">${P.cids.map((g) => avatar(c, g, nameOf(c, g, B), 'sm')).join('')}<small>${esc(names)} · ${esc(weekLine(c))}</small></div></div>
    <div class="ph-body"><div class="ph-vg">${list.map(card).join('') || '<p class="ph-empty">Nowhere suitable this week.</p>'}</div></div>`;
}

/** step three: the invitation - where, who, the cost, the energy, how private, and anything worth knowing first */
function confirmView(c, S) {
  const P = S.plan, v = venueOf(P.venue), B = book(c); if (!v) return whereView(c, S);
  const s = suits(c, P.cids, v), secret = P.cids.some((g) => secretOf(c, B.get(g) || { cid: g })), en = c.week?.energy, p = v.privacy ?? 0.5, notes = [];
  if (s) notes.push([s[1] ? 'good' : 'meh', s[0]]);
  if (secret) notes.push(p < 0.6 ? ['warn', 'Not very private: a photographer could easily spot the two of you here.'] : ['good', 'Discreet. Nobody needs to know.']);
  if (en != null && v.energy && en < v.energy) notes.push(['warn', `You are running low: energy ${Math.round(en)}, and this takes ${v.energy}.`]);
  const what = P.cids.length > 1 ? 'A night out together' : kindOf(P.cids[0]) === 'celeb' ? 'A date' : grave(c) ? 'A quiet coffee' : 'An evening out';
  const kv = (k, val) => `<div class="ph-kv"><span>${k}</span><b>${val}</b></div>`;
  return `${stepHead('The invitation', 3)}
    <div class="ph-body"><div class="ph-hero" style="--vc:${VC[v.id] || '#3d7bd9'}"><span class="ph-vi lg">${svg(vIcon(v.id), 26)}</span><b>${esc(v.name)}</b><p>${esc(v.blurb || '')}</p></div>
    <div class="ph-card">${kv('With', esc(P.cids.map((g) => first(nameOf(c, g, B))).join(', ')))}${kv('What', what)}${kv('Cost', `${money(v.cost)}<i>· you have ${money(c.wallet ?? 0)}</i>`)}${kv('Energy', `${v.energy ?? 0}${en != null ? `<i>· you have ${Math.round(en)}</i>` : ''}`)}${kv('Privacy', `<span class="ph-pv">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= Math.round(p * 5) ? 'on' : ''}"></i>`).join('')}</span>${privTxt(p)}`)}</div>
    ${notes.map(([cl, t]) => `<div class="ph-tipc ${cl}">${svg(cl === 'warn' ? I.warn : cl === 'good' ? I.star : I.eye, 14)}<span>${esc(t)}</span></div>`).join('')}</div>
    <div class="ph-foot"><button class="ph-btn go wide" data-pa="send" data-kenter="1">Send the invitation${svg(I.next, 15)}</button><small class="ph-tip c">A yes is booked in THE WEEK, where it takes a slot.</small></div>`;
}

/** the confrontation: she has found out (or thinks she has) and wants it out in the open */
function confrontView(c, S) {
  const cf = confrontOf(c), C = CEL(cf.id), F = first(C.name), O = (cf.otherIds || []).map((id) => first(CEL(id)?.name || '')).filter(Boolean).join(' and ');
  const line = cf.text || (O ? `I need you to be honest with me. Who is ${O}?` : 'Is there someone else? Be honest with me.'), can = typeof Celebs.resolveConfront === 'function';
  return `<div class="ph-th"><button class="ph-ib" data-pa="back" aria-label="Not now">${svg(I.back)}</button><span class="ph-who"><b>${esc(F)} wants to talk</b><small>${esc(C.job || '')}</small></span></div>
    <div class="ph-body ph-cfv"><div class="ph-cfa">${avatar(c, 'c:' + cf.id, C.name, 'lg')}</div><div class="ph-b them tail big pop">${esc(line)}</div>
    <div class="ph-sec">How do you answer?</div>${(cf.options || []).map((o, i) => `<button class="ph-opt" data-px="${esc(o.key)}" data-kn="${i + 1}"${can ? '' : ' disabled'}><kbd>${i + 1}</kbd><span><b>${esc(o.label)}</b><small>${esc((HINT[o.key] || '').replace('{other}', O || 'the other one'))}</small></span></button>`).join('')}${can ? '' : '<p class="ph-empty">Answer her from PERSONAL in the hub.</p>'}</div>`;
}

/** how the confrontation went */
function outcomeView(c, S) {
  const R = S.outcome || {}, C = CEL(R.id);
  return `<div class="ph-body ph-cfv out"><div class="ph-cfa">${C ? avatar(c, 'c:' + R.id, C.name, 'lg') : ''}</div><h3>${esc(C ? first(C.name) : '')}</h3><p class="ph-res">${esc(R.text || 'It is said. There is nothing to add tonight.')}</p></div>
    <div class="ph-foot"><button class="ph-btn go wide" data-pa="home" data-kenter="1">Back to messages</button></div>`;
}

const VIEWS = { chats: chatsView, plans: plansView, thread: threadView, who: whoView, where: whereView, confirm: confirmView, confront: confrontView, outcome: outcomeView };

// ---- the phone ---------------------------------------------------------------------------------------------------------
let OPEN = null;
/**
 * Your phone over the career hub. o: { c (the career), onClose() (the hub re-renders itself: badges), onLaunch
 * (reserved: the hub books hangouts through THE WEEK; the phone only arranges invitations) } -> { el, S, close, paint,
 * open(cid), reply(key) } (also window.__phone, for the test console). Opening it twice returns the one already open
 */
export function showPhone({ c = null, onClose = null, onLaunch = null } = {}) {
  if (OPEN) return OPEN;
  if (!document.getElementById('phone-css')) { const st = document.createElement('style'); st.id = 'phone-css'; st.textContent = CSS; document.head.appendChild(st); }
  const reduced = safe(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, false);
  const S = { root: 'chats', view: 'chats', filter: 'all', cid: null, plan: null, typing: null, pop: null, note: null, armed: null, outcome: null };
  const el = document.createElement('div'); el.id = 'phone';
  const tc = c?.teams?.[c.myTeam]?.color || '#e10600'; el.style.setProperty('--tc', luma(tc) > 0.62 ? '#3a4350' : tc);
  el.innerHTML = `<button class="ph-scrim" data-pa="close" tabindex="-1" aria-label="Put the phone away"></button><div class="ph-dev" role="dialog" aria-modal="true" aria-label="Your phone" tabindex="-1"><div class="ph-scr"><div class="ph-sb"><span class="ph-clock"></span><i class="ph-isl"></i><span class="ph-sig"><span class="ph-bars"><i style="height:4px"></i><i style="height:6px"></i><i style="height:8px"></i><i style="height:11px"></i></span><small class="ph-pct"></small><span class="ph-bat"><i></i></span></span></div><div class="ph-toast" role="status" aria-live="polite"></div><div class="ph-view"></div><i class="ph-home"></i></div></div>`;
  document.body.appendChild(el);
  let view = el.querySelector('.ph-view'), closed = false, toastT = 0, armT = 0;
  const timers = new Set();
  const later = (f, ms) => { const t = setTimeout(() => { timers.delete(t); if (!closed) f(); }, ms); timers.add(t); return t; };

  // (the status bar: the time, and the battery - every message this week drains it, as the social engine counts them)
  const bar = () => {
    const d = new Date(), B = el.querySelector('.ph-bat'), n = c?.social?.phone?.sent?.[`${c?.season}|${c?.round}`] || 0, pc = Math.max(1, 96 - n * 12);
    el.querySelector('.ph-clock').textContent = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    B.style.setProperty('--b', (pc / 100).toFixed(2)); B.classList.toggle('low', pc <= 20); el.querySelector('.ph-pct').textContent = pc <= 20 ? `${pc}%` : '';
  };
  const clockT = setInterval(bar, 15000);
  const toast = (text, kind = '') => {
    if (!text || closed) return;
    const t = el.querySelector('.ph-toast'); t.textContent = text; t.className = `ph-toast on${kind ? ' ' + kind : ''}`;
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2800);
  };
  /** draw the current screen; anim: 'push' (deeper), 'pop' (back), 'swap' (another tab), 'list' (a filter), or none */
  const paint = (anim = null) => {
    if (closed) return;
    if (S.view === 'confront' && !confrontOf(c)) S.view = 'chats';
    if (['who', 'where', 'confirm'].includes(S.view) && !S.plan) S.view = S.root;
    if (S.view === 'thread' && !S.cid) S.view = S.root;
    const old = view.querySelector('.ph-body'), top = !anim && old ? old.scrollTop : 0, v = document.createElement('div');
    v.className = `ph-view${anim && anim !== 'list' ? ' ' + anim : ''}`;
    v.innerHTML = c ? (VIEWS[S.view] || chatsView)(c, S) : NOSIG;
    view.replaceWith(v); view = v; S.pop = null; if (S.note) S.note.fresh = false;
    const b = v.querySelector('.ph-body'); if (b && top) b.scrollTop = top;
    const m = v.querySelector('.ph-msgs'); if (m) m.scrollTop = m.scrollHeight;
    if (anim === 'list') v.querySelector('.ph-list')?.classList.add('in');
    bar();
  };
  const go = (to, anim = 'push') => { S.view = to; S.armed = null; paint(anim); };
  /** one screen back (a root screen has nowhere to go) -> whether it went */
  const back = () => {
    const v = S.view, to = v === 'thread' ? S.root : v === 'where' ? (S.plan?.from === 'thread' ? 'thread' : 'who') : { who: 'plans', confirm: 'where', confront: 'chats', outcome: 'chats' }[v];
    if (!to) return false;
    if (v === 'thread') S.note = null;
    if ((v === 'who' && to === 'plans') || (v === 'where' && to === 'thread')) S.plan = null;
    if (to === 'chats' || to === 'plans') S.root = to;
    go(to, 'pop'); return true;
  };
  /** open a chat: what you had not read pops in, and is read */
  const open = (cid, anim = 'push') => {
    const T = thread(c, cid), u = T.findIndex((m) => m.from !== 'me' && !m.read);
    S.cid = cid; S.note = null; S.pop = u >= 0 ? u : null;
    if (u >= 0) { safe(() => markRead(c, cid)); save(c); }
    go('thread', anim);
  };
  /** new messages in a chat: yours pop in at once, theirs wait behind the typing dots */
  const expect = (cid, n0, anim = null, note = null) => {
    const T = thread(c, cid), at = T.findIndex((m, i) => i >= n0 && m.from !== 'me');
    S.pop = n0; S.note = note;
    if (at < 0 && !note) { S.view = 'thread'; paint(anim); return; }
    const tk = S.typing = { cid, at: at < 0 ? T.length : at }, len = at < 0 ? note.text.length : String(T[at].text || '').length;
    later(() => {
      if (S.typing !== tk) return;
      S.typing = null;
      if (S.view === 'thread' && S.cid === cid) { if (at >= 0) { safe(() => markRead(c, cid)); save(c); S.pop = at; } if (S.note) S.note.fresh = true; paint(); }
      else if (S.view === 'chats' || S.view === 'plans') paint();
    }, reduced ? 450 : Math.min(2400, 900 + len * 14));
    S.view = 'thread'; paint(anim);
  };
  const reply = (key) => {
    const cid = S.cid; if (!cid || (S.typing && S.typing.cid === cid)) return;
    const n0 = thread(c, cid).length, r = safe(() => sendText(c, cid, key));
    if (!r) { toast('Not sent. Try again.', 'bad'); return; }
    save(c);
    if (thread(c, cid).length === n0) { toast(r.ok ? r.reply || r.text : r.text || 'Not sent.', r.ok ? '' : 'bad'); paint(); return; }
    expect(cid, n0);
  };
  /** delete a chat: the first tap arms the button, the second (within a few seconds) clears it for good */
  const del = () => {
    const cid = S.cid, key = 'del:' + cid;
    if (S.armed !== key) { S.armed = key; clearTimeout(armT); armT = later(() => { if (S.armed === key) { S.armed = null; paint(); } }, 3500); paint(); return; }
    const r = safe(() => deleteThread(c, cid)); save(c);
    if (S.typing?.cid === cid) S.typing = null;
    S.armed = null; S.note = null; S.root = 'chats'; go('chats', 'pop'); toast(r?.text || 'Chat deleted.');
  };
  const plan = (from, cids = []) => { S.plan = { cids, venue: null, from, kind: cids.length && kindOf(cids[0]) === 'celeb' ? 'celeb' : 'driver' }; go(cids.length ? 'where' : 'who'); };
  /** who is coming: one celebrity (a date) or up to three drivers, never both */
  const pickGuest = (cid) => {
    const P = S.plan; if (!P) return;
    const on = P.cids.includes(cid);
    if (kindOf(cid) === 'celeb') P.cids = on ? [] : [cid];
    else { P.cids = P.cids.filter((g) => kindOf(g) === 'driver' && g !== cid); if (!on && P.cids.length < 3) P.cids.push(cid); }
    paint();
  };
  /** send it: one guest's answer comes back in their chat; a group's in PLANS */
  const send = () => {
    const P = S.plan; if (!P || !P.venue || !P.cids.length) return;
    const one = P.cids.length === 1 ? P.cids[0] : null, n0 = one ? thread(c, one).length : 0, r = safe(() => inviteOut(c, P.cids.slice(), P.venue));
    if (!r) { toast('The invitation did not send.', 'bad'); return; }
    save(c);
    if (!r.invite && !r.ok) { toast(r.text || 'Not now.', 'bad'); return; }
    const from = P.from; S.plan = null;
    if (!one) { S.root = 'plans'; go('plans', 'pop'); toast(r.text, r.ok ? 'ok' : ''); return; }
    S.cid = one; S.armed = null;
    const grew = thread(c, one).length > n0;
    expect(one, n0, from === 'thread' ? 'pop' : 'push', grew ? null : { cid: one, text: r.text || (r.ok ? 'They are in.' : 'Not this time.'), ok: !!r.ok, fresh: false });
  };
  const answer = (id, yes) => {
    const v = invites(c).find((x) => String(x.id) === id), r = safe(() => respondInvite(c, v ? v.id : id, yes)); save(c);
    toast(r?.text || (yes ? 'Accepted.' : 'Turned down.'), yes ? 'ok' : ''); paint();
  };
  const resolve = (key) => {
    const cf = confrontOf(c); if (!cf || typeof Celebs.resolveConfront !== 'function') return;
    const r = safe(() => Celebs.resolveConfront(c, key)); save(c);
    S.outcome = { id: cf.id, text: r?.text || '' }; go('outcome');
  };

  // (only buttons do anything; every action redraws the phone alone)
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || b.disabled || closed || !el.contains(b)) return;
    const d = b.dataset;
    if (S.armed && d.pa !== 'del') S.armed = null;
    if (d.pa === 'close') close();
    else if (d.pa === 'back') back();
    else if (d.pa === 'home') { S.root = 'chats'; S.outcome = null; go('chats', 'pop'); }
    else if (d.pt) { if (d.pt !== S.view) { S.root = d.pt; go(d.pt, 'swap'); } }
    else if (d.pf) { S.filter = d.pf; paint('list'); }
    else if (d.pc) open(d.pc);
    else if (d.pr) reply(d.pr);
    else if (d.pa === 'del') del();
    else if (d.pa === 'plan') plan('thread', [S.cid]);
    else if (d.pa === 'new') plan('plans');
    else if (d.pk) { if (S.plan && S.plan.kind !== d.pk) { S.plan.kind = d.pk; S.plan.cids = []; } paint('list'); }
    else if (d.pg) pickGuest(d.pg);
    else if (d.pa === 'next') go('where');
    else if (d.pv) { if (S.plan) { S.plan.venue = d.pv; go('confirm'); } }
    else if (d.pa === 'send') send();
    else if (d.pi) answer(d.pi, d.ok === '1');
    else if (d.pa === 'conf') go('confront');
    else if (d.px) resolve(d.px);
  });
  // (Esc puts it away, Backspace goes back, 1-9 picks the numbered reply, place or answer, Enter confirms)
  const onKey = (e) => {
    if (closed) return;
    const num = /^(?:Digit|Numpad)([1-9])$/.exec(e.code || ''), ae = document.activeElement, onBtn = ae && ae.tagName === 'BUTTON' && el.contains(ae);
    let b = null;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key === 'Backspace') { e.preventDefault(); e.stopPropagation(); back(); return; }
    if (num) b = view.querySelector(`button[data-kn="${num[1]}"]`);
    else if (e.key === 'Enter' && !onBtn) b = view.querySelector('button[data-kenter]');
    if (b) { e.preventDefault(); e.stopPropagation(); if (!b.disabled && !e.repeat) b.click(); }
  };
  window.addEventListener('keydown', onKey, true);
  const close = () => {
    if (closed) return;
    closed = true; for (const t of timers) clearTimeout(t); timers.clear(); clearTimeout(toastT); clearInterval(clockT);
    window.removeEventListener('keydown', onKey, true);
    el.classList.remove('show'); if (OPEN === H) OPEN = null; if (window.__phone === H) window.__phone = null;
    setTimeout(() => { el.remove(); onClose?.(); }, reduced ? 0 : 240);
  };
  const H = { el, S, close, paint, open: (cid) => open(cid), reply: (key) => reply(key), onLaunch };
  OPEN = H; window.__phone = H;
  paint();
  requestAnimationFrame(() => requestAnimationFrame(() => { if (!closed) el.classList.add('show'); }));
  setTimeout(() => { if (!closed) el.classList.add('show'); }, 60);
  el.querySelector('.ph-dev').focus({ preventScroll: true });
  return H;
}

/** the hub's phone button: unread messages, plus one for a confrontation waiting -> number */
export function phoneBadge(c) {
  if (!c) return 0;
  return (safe(() => unreadCount(c), 0) || 0) + (confrontOf(c) ? 1 : 0);
}
