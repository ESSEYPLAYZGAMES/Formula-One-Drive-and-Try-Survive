// The grid walk: on foot on the grid before the start, as your driver. WASD (or the arrows) to walk, Shift to hurry,
// the mouse to look (click for pointer lock, or drag), E to talk, Enter (or E at your car) to get in.
// The people on it - the drivers by their cars, your team principal, engineer and No. 1 mechanic, the pit-lane
// reporter, the guests - open on something (the driver lost, the race, a rival, your teammate, the title, someone's
// gossip, the guests' questions, the press's), you answer in a tone (kind, firm, light, cold, cruel), they react,
// follow it up, and you answer again - or turn the talk to someone behind their back - and they move on. Two
// back-and-forths each. In a career what you say lasts: rapport with the drivers, the press's quotes in the news, and
// word getting round. Cruel is allowed and costs; no one on the grid ever wishes harm on anyone.
// The stars are on the grid too (career/Celebs.js's celebrities, every one made up) and talk as who they are (career/
// Persona.js: the Spark, the Ice, the Sunshine - opening in the mood you left them in): a first hello, small talk, a
// little flirting, a word with your partner before you get in (ui/GridTalk4.js). And F at a driver close by gives him
// a shove - open hands on the chest, nothing more - which he laughs off, answers with a look or a shove of his own, or
// (pushed far enough) squares up to: handbags, played as quick prompts until people pull you apart (ui/Brawl.js has
// the camera while it plays). What any of it costs - penalty points, rapport, morale, a star's view of you, the papers
// - is worked out in ui/WalkFx.js. Never on a memorial weekend.
// Built on the pre-race show's grid (ui/PreRace.js), which it hands back to be disposed when done. You walk on the flat
// plan, your eye 1.7 m over the ground (pos); on a circuit that is not flat everyone stands on the ground under them
// (world/Terrain.js) and main.js lifts the eye by the ground you stand on (this.look: the eye itself, on the flat).
import * as THREE from 'three';
import { TERRAIN } from '../world/Terrain.js';
import { makePerson } from '../world/People.js';
import { TOPICS, buildTopic, weatherLine } from './GridTalk.js';
import { TOPICS2, venueLines } from './GridTalk2.js';
import { TOPICS3 } from './GridTalk3.js';
import { TOPICS4, FAREWELL4 } from './GridTalk4.js';
import { Jab, Brawl } from './Brawl.js';
import * as WalkFx from './WalkFx.js';
import { personaTalk, TONE_TAG } from '../career/Persona.js';

const CSS = `
#gridwalk { position: fixed; inset: 0; z-index: 44; pointer-events: none; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #fff; }
#gridwalk .bug { position: absolute; left: 3vw; top: 4vh; display: flex; height: 32px; box-shadow: 0 2px 10px rgba(0,0,0,.45); }
#gridwalk .bug b { background: #e10600; padding: 0 12px; display: flex; align-items: center; font: 900 14px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .12em; }
#gridwalk .bug i { background: rgba(10,12,18,.85); padding: 0 12px; display: flex; align-items: center; font: 700 12.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .12em; font-style: normal; font-variant-numeric: tabular-nums; }
#gridwalk .help { position: absolute; left: 3vw; bottom: 3vh; font: 600 12px/1.6 'Segoe UI', Arial, sans-serif; color: rgba(255,255,255,.75); background: rgba(0,0,0,.45); padding: 6px 10px; border-radius: 6px; transition: opacity .4s; }
#gridwalk .help kbd { display: inline-block; min-width: 18px; text-align: center; padding: 0 5px; margin: 0 2px; border: 1px solid rgba(255,255,255,.4); border-radius: 4px; font: 700 11px/16px 'Segoe UI', Arial, sans-serif; }
#gridwalk .btns { position: absolute; right: 3vw; top: 4vh; display: flex; gap: 8px; pointer-events: auto; }
#gridwalk .btns button { background: #e10600; color: #fff; border: 1px solid #e10600; border-radius: 6px; padding: 9px 14px; font: 800 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; cursor: pointer; }
#gridwalk .dot { position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; margin: -2px; border-radius: 50%; background: rgba(255,255,255,.8); box-shadow: 0 0 3px #000; }
#gridwalk .prompt { position: absolute; left: 50%; top: 58%; transform: translateX(-50%); background: rgba(10,12,18,.8); padding: 7px 12px; border-radius: 6px; font: 700 14px/1.2 'Segoe UI', Arial, sans-serif; opacity: 0; transition: opacity .2s; white-space: nowrap; }
#gridwalk .prompt.in { opacity: 1; }
#gridwalk .prompt kbd { background: #fff; color: #111; border-radius: 4px; padding: 1px 6px; margin-right: 6px; font: 900 12px/1.3 'Segoe UI', Arial, sans-serif; }
#gridwalk .prompt small { display: block; font-weight: 500; color: #b9c0cc; margin-top: 2px; font-size: 12px; }
#gridwalk .prompt .alt { margin-left: 14px; color: #ffc2bd; }
#gridwalk .tag { position: absolute; transform: translate(-50%, -100%); font: 700 11.5px/1.25 'Segoe UI', Arial, sans-serif; text-align: center; text-shadow: 0 1px 3px #000, 0 0 8px rgba(0,0,0,.6); white-space: nowrap; transition: opacity .25s; }
#gridwalk .tag small { display: block; font-weight: 500; color: #c9ced8; font-size: 10.5px; }
#gridwalk .tag.done { color: #9aa1ac; }
#gridwalk .talk { position: absolute; left: 50%; bottom: 4vh; transform: translate(-50%, 20px); width: min(760px, 92vw); background: linear-gradient(180deg, rgba(12,14,20,.92), rgba(8,9,13,.95)); border: 1px solid rgba(255,255,255,.12); border-radius: 10px; padding: 14px 18px 12px; opacity: 0; transition: opacity .3s, transform .3s; pointer-events: auto; box-shadow: 0 10px 40px rgba(0,0,0,.5); }
#gridwalk .talk.in { opacity: 1; transform: translate(-50%, 0); }
#gridwalk .talk .who { font: 800 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; color: #e10600; text-transform: uppercase; }
#gridwalk .talk .who small { color: #8c93a0; font-weight: 600; letter-spacing: .08em; margin-left: 8px; text-transform: none; font-size: 12px; }
#gridwalk .talk .line { font: 500 18px/1.45 'Segoe UI', Arial, sans-serif; margin: 8px 0 4px; min-height: 52px; }
#gridwalk .talk .line.me { color: #b9c0cc; font-style: italic; }
#gridwalk .talk .opts { display: flex; flex-direction: column; gap: 5px; margin-top: 6px; }
#gridwalk .talk .opts button { text-align: left; background: rgba(255,255,255,.05); color: #eef1f5; border: 1px solid rgba(255,255,255,.1); border-radius: 6px; padding: 8px 10px; font: 500 15px/1.35 'Segoe UI', Arial, sans-serif; cursor: pointer; display: flex; gap: 10px; align-items: baseline; opacity: 0; transform: translateY(6px); transition: opacity .25s, transform .25s, background .15s; }
#gridwalk .talk .opts button.in { opacity: 1; transform: none; }
#gridwalk .talk .opts button:hover { background: rgba(255,255,255,.12); }
#gridwalk .talk .opts button b { font: 900 12px/1.6 'Segoe UI', Arial, sans-serif; color: #8c93a0; min-width: 14px; }
#gridwalk .talk .opts button i { margin-left: auto; font: 700 9.5px/1.9 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; font-style: normal; color: #7d8592; white-space: nowrap; }
#gridwalk .talk .opts button[data-tone=cruel] i { color: #d9534f; } #gridwalk .talk .opts button[data-tone=kind] i { color: #6cc08b; } #gridwalk .talk .opts button[data-tone=sorry] i { color: #c8b66a; } #gridwalk .talk .opts button[data-tone=gossip] i { color: #c27ad6; }
#gridwalk .talk .opts button[data-tone=flirt] i { color: #e77fae; } #gridwalk .talk .opts button[data-tone=passive] i { color: #c9ced8; } #gridwalk .talk .opts button[data-tone=flirty] i { color: #e77fae; } #gridwalk .talk .opts button[data-tone=risque] i { color: #ff4f7a; } #gridwalk .talk .opts button[data-tone=show] i { color: #e0a33c; }
#gridwalk .talk .next { text-align: right; font: 600 11px/1 'Segoe UI', Arial, sans-serif; color: #7d8592; letter-spacing: .1em; min-height: 11px; }
#gridwalk .toasts { position: absolute; right: 3vw; top: 11vh; display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
#gridwalk .toast { background: rgba(10,12,18,.85); border-left: 3px solid #8c93a0; padding: 7px 11px; font: 600 13px/1.3 'Segoe UI', Arial, sans-serif; animation: gwt 5.5s forwards; max-width: 340px; }
#gridwalk .toast.up { border-color: #3fb06a; } #gridwalk .toast.down { border-color: #e10600; }
@keyframes gwt { 0% { opacity: 0; transform: translateX(20px); } 6% { opacity: 1; transform: none; } 85% { opacity: 1; } 100% { opacity: 0; } }
#gridwalk .respect { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(ellipse at center, rgba(0,0,0,.25), rgba(0,0,0,.7)); opacity: 0; transition: opacity 1.4s; font-family: Georgia, 'Times New Roman', serif; text-align: center; }
#gridwalk .respect.in { opacity: 1; }
#gridwalk .respect .n { font-size: clamp(30px, 4vw, 52px); letter-spacing: .06em; }
#gridwalk .respect .s { margin-top: 10px; font-size: 16px; color: #c9ced8; letter-spacing: .12em; }
#gridwalk .black { position: absolute; inset: 0; background: #000; opacity: 1; transition: opacity .8s ease; }
`;
const pick = (a) => a[(Math.random() * a.length) | 0];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const first = (n) => String(n || '').split(' ')[0], last = (n) => String(n || '').split(' ').pop();
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
const facing = (dx, dz) => Math.atan2(-dz, dx);
// how a tone lands (mood), and its tag on the option (flirt and show are for the stars)
const TONE = { kind: 2, firm: 1, light: 1, cold: -1, cruel: -5, sorry: 3, gossip: 0, leave: -1, flirt: 1, show: 0, passive: 0, flirty: 1, risque: 2 };
const TAG = { kind: 'KIND', firm: 'FIRM', light: 'LIGHT', cold: 'COLD', cruel: 'CRUEL', sorry: 'APOLOGISE', gossip: 'BEHIND THEIR BACK', leave: '', flirt: 'FLIRT', show: 'SHOW OFF', ...TONE_TAG };
// (a personality's tones as the walk's own reckon them - ui/WalkFx: how a star takes a whole conversation)
const AS_WALK = { cold: 'cold', passive: 'kind', flirty: 'flirt', risque: 'flirt' };
const OUTLET = 'Paddock Weekly';
// the action that ends a hostile talk in a shove (never on a memorial weekend, nor once there has been a scuffle, nor
// at anyone who cannot be shoved: x.jabbable, from ui/WalkFx.js)
const shove = (x, n) => (x.L || x.brawled || (x.jabbable && !x.jabbable(n)) ? [] : [{ t: '[Give him a shove]', tone: 'cruel', fx: { jab: true }, r: '' }]);
/** what the walk comes to, worked out in ui/WalkFx.js (k: its name) - a fault in one never stops the walk -> its result, or null */
const wfx = (k, ...a) => { try { return typeof WalkFx[k] === 'function' ? WalkFx[k](...a) ?? null : null; } catch (e) { console.warn(`GridWalk: ${k}`, e); return null; } };
// (made-up crew)
const MECHS = ['Dan', 'Marco', 'Jules', 'Sam', 'Ravi', 'Tomasz', 'Kenji', 'Ollie'];
const ENGINEERS = ['Gemma', 'Luca', 'Ben', 'Aisha', 'Pete', 'Ines'];

// =====================================================================================================================
// The talk. Each topic builds a little tree for one person: { say, opts: [{ t, tone, r, m?, fx?, then?: { say, opts } }] }
// (t: your line; r: their reaction; m: a mood change other than the tone's; fx: what it does after; then: their
// follow-up, which you answer once more.) x.* is the context: me, the lost (L), a third driver to talk about (X)...
// =====================================================================================================================
const T = {};

// ---- the driver lost --------------------------------------------------------------------------------------------------
T.mourn = (x, n) => {
  const L = x.L, N = first(L.name), num = L.number != null ? `#${L.number}` : '', who = n.kind === 'star' ? 'celeb' : n.kind;   // (a star is a guest like any other today)
  const cruel = { t: pick([`${N} knew the risks. Same as all of us. The show goes on.`, `Honestly? I've got a race to win. Spare me the speeches.`, `Everyone's acting like they were best mates with ${N}. Please.`, `One less car to pass, isn't it.`]), tone: 'cruel', fx: { dead: true },
    r: pick(({ driver: [`...What did you just say?`, `Wow. Seriously? Today?`, `Walk away. Right now.`], boss: [`It's everybody's business. Remember that.`, `I'll pretend I didn't hear that. Once.`], mech: [`...Right. I'll, er. I'll get back to the car.`, `The lads loved ${N}. Don't let them hear you say that.`], press: [`I... I'll print that, if that's what you want.`, `You want that on the record?`], celeb: [`Oh. Oh, wow. Okay.`, `That's a horrible thing to say.`], eng: [`I'm going to pretend I didn't hear that.`, `Not today. Please.`] })[who] || [`...`]),
    then: { say: n.kind === 'press' ? `Last chance to take that back before it goes out.` : n.kind === 'boss' ? `${N}'s family are in the paddock today. Think about that.` : pick([`Say that to ${N}'s family.`, `${N}'s family are here today, you know that?`, `Would you say that at the memorial? Out loud?`]),
      opts: [
        { t: pick([`...You're right. That was out of order. I'm sorry.`, `I didn't mean it. I don't know why I said it. Sorry.`]), tone: 'sorry', fx: { undo: true }, r: pick([`...Yeah. It was.`, `Okay. Just... think, next time.`, `Fine. Let's leave it.`]) },
        { t: pick([`I meant every word.`, `It's the truth. Somebody had to say it.`]), tone: 'cruel', fx: { dead: true }, r: pick([`Then we're done talking.`, `Unbelievable.`, `Get away from me.`]) },
        { t: `[Walk away]`, tone: 'leave', end: true, r: '' },
      ] } };
  const followFeel = { say: pick([`Are you doing anything for ${N} today?`, `How do you switch off from it, once the visor's down?`, `Do you think about it? When you're out there?`]),
    opts: [
      { t: pick([`A clean race. ${N} would want that.`, `${N}'s number is on my helmet tonight.`, `One lap, flat out, for ${N}. Then I'll bring it home.`]), tone: 'kind', r: pick([`That's nice. Really.`, `Good. ${N} would like that.`, `I might do the same, if that's okay.`]) },
      { t: pick([`You don't switch off. You just drive.`, `Visor down, eyes up. It's the only way I know.`]), tone: 'firm', r: pick([`Yeah. Suppose so.`, `That's what my old coach used to say.`]) },
      { t: pick([`Every lap. Every corner. Don't you?`, `More than I'll ever say out loud.`]), tone: 'kind', r: pick([`Every single one.`, `...Yeah. Me too.`]) },
      { t: pick([`Not really. It's part of the job.`, `Honestly, no. You can't let it in.`]), tone: 'cold', r: pick([`Right. Must be nice.`, `Okay. If that works for you.`]) },
    ] };
  const followSafe = { say: pick([`Does it scare you? Honestly?`, `Do you think they've done enough? On safety?`, `Do you think it could have been prevented?`]),
    opts: [
      { t: pick([`Of course it does. Anyone who says otherwise is lying.`, `Yes. Every time I pull the belts tight.`]), tone: 'kind', r: pick([`Thanks for saying it. Nobody does.`, `Yeah. Glad it's not just me.`]) },
      { t: pick([`Not enough. Nobody should die doing this. We push them until it's fixed.`, `We owe it to ${N} to keep asking questions. Loudly.`]), tone: 'firm', m: 2, r: pick([`Count me in. All of us should sign it.`, `I'll say the same in the drivers' briefing.`]) },
      { t: pick([`Scared? No. Careful, yes.`, `You can't drive scared. You'd be slow, and slow is dangerous too.`]), tone: 'firm', r: pick([`Fair.`, `Yeah, I get that.`]) },
      { t: pick([`The FIA can do what it likes. I just race.`, `Not my department.`]), tone: 'cold', r: pick([`It's all our department.`, `Hm. Okay.`]) },
    ] };
  const followMem = { say: pick([`What's your best memory of ${N}?`, `You raced ${N} in the juniors, didn't you?`]),
    opts: [
      { t: pick([`${N} lent me a set of gloves in karting. Never gave them back.`, `A wheel-to-wheel fight years ago. Not an inch given, not one touch. Proper racing.`]), tone: 'kind', r: pick([`Ha. That's ${N} all over.`, `That's a good one. Hold on to it.`]) },
      { t: pick([`The laugh. You could hear it across the paddock.`, `${N} always said hello to the mechanics by name. Every one of them.`]), tone: 'kind', r: pick([`Yeah. Yeah, that's right.`, `I'll miss that.`]) },
      { t: pick([`We weren't close.`, `Can't say I knew ${N} well.`]), tone: 'cold', r: pick([`Shame. You'd have liked ${N}.`, `Right.`]) },
    ] };
  const kind = { t: pick([`I'll miss ${N}. Simple as that.`, `${N} was one of the good ones.`, `I can't stop thinking about ${N}'s family.`, `It doesn't feel real yet. I keep expecting ${N} to walk past.`]), tone: 'kind' };
  const firm = { t: pick([`Hurting. But I'll be focused when the lights go out.`, `I'm doing what ${N} would do. Getting in the car.`]), tone: 'firm' };
  const light = { t: pick([`${N} would tell us all to stop moping and get on with it.`, `${N} would be laughing at all of us standing around like this.`]), tone: 'light', m: 0 };
  const cold = { t: pick([`I'd rather not talk about it.`, `Not now. Please.`]), tone: 'cold', m: 0, r: pick([`Fair enough.`, `Sorry. Yeah, of course.`]),
    then: { say: `You alright to race, though?`, opts: [
      { t: `I'm fine.`, tone: 'firm', r: pick([`Okay. Look after yourself.`, `Alright.`]) },
      { t: `Ask me after the flag.`, tone: 'kind', r: pick([`I will.`, `Deal.`]) },
      { t: `Mind your own business.`, tone: 'cruel', m: -3, r: pick([`Wow. Okay.`, `Just trying to help.`]) },
    ] } };
  switch (who) {
    case 'boss': return { say: pick([`Before anything - how are you doing? Honestly. After ${N}.`, `If you need to talk about ${N}, my door's open. Today and after.`, `Nobody in this team will think less of you for feeling it today.`]), opts: [
      { ...kind, t: pick([`Thanks. It's hard. But I want to race.`, `Honestly? Not great. But I'm ready.`]), r: pick([`Good. That's all I need to hear.`, `Thank you for being straight with me.`]), then: { say: `We've put a black band on the car. A minute's quiet on the radio before the formation lap - okay with you?`, opts: [
        { t: `Yes. Please.`, tone: 'kind', r: `Done.` }, { t: `Yes - and then let's get to work.`, tone: 'firm', r: `That's the spirit.` }, { t: `Do what you want.`, tone: 'cold', r: `...Right.` }, { t: `Skip it. I need to concentrate.`, tone: 'cruel', m: -3, r: `I'll keep it. You can stay quiet for a minute.` } ] } },
      { ...firm, r: pick([`That's what I hoped you'd say.`, `Good. For ${N}, then.`]), then: followSafe },
      { ...cold, t: `I'm fine. Can we talk about the race?`, r: `If that's how you want it.` },
      cruel ] };
    case 'mech': return { say: pick([`We put a little ${num || 'black'} sticker on the car, for ${N}. Hope that's alright.`, `The lads are quiet today. Everyone's thinking about ${N}.`, `I worked with ${N}'s crew in the juniors. Good people. Gutted for them.`]), opts: [
      { t: pick([`It's perfect. Thank you.`, `Thanks for doing that. It means a lot.`]), tone: 'kind', r: `Least we could do.`, then: { say: `Car's mint. Just bring it back in one piece. Promise?`, opts: [
        { t: `Promise.`, tone: 'kind', r: `Good.` }, { t: `That's the plan.`, tone: 'firm', r: `Good lad. Good... you know what I mean.` }, { t: `No promises about the front wing.`, tone: 'light', r: `Ha. We've got a spare.` }, { t: `I'll do my job. You do yours.`, tone: 'cold', r: `...Yep.` } ] } },
      { ...light, r: pick([`Ha. Yeah. Probably would.`, `${N} would want it bigger, knowing ${N}.`]), then: followMem },
      { t: `As long as it doesn't cost downforce.`, tone: 'cold', r: `It's a sticker.` , then: followSafe },
      { ...cruel, t: pick([`Peel it off. I'm not driving a shrine.`, cruel.t]) } ] };
    case 'press': return { say: pick([`A difficult day. Can I ask what ${N} meant to you?`, `The grid's very quiet today. How are the drivers coping after ${N}?`, `Some are asking if the race should go ahead today. Should it?`]), opts: [
      { ...kind, fx: { press: true }, r: pick([`Thank you. That's... thank you.`, `I think a lot of people will feel that.`]), then: followSafe },
      { ...firm, fx: { press: true }, r: `Thank you.`, then: { ...followSafe, opts: followSafe.opts.map((o) => ({ ...o, fx: { press: true } })) } },
      { ...cold, t: `No comment today.`, r: `Of course. Sorry.` },
      { ...cruel, fx: { dead: true, press: true } } ] };
    case 'celeb': return { say: pick([`I didn't know if it was right to come today, after ${N}.`, `I'm so sorry about ${N}. I saw it happen and I couldn't sleep.`]), opts: [
      { t: pick([`I'm glad you came. ${N} loved a full grid.`, `Thank you for being here. It matters.`]), tone: 'kind', r: `Thank you. Really.`, then: { say: `Are you scared? Getting in, after that?`, opts: [
        { t: `Yes. And I'll still get in. That's the job.`, tone: 'kind', r: `I don't know how you do it.` }, { t: `Scared? No. Respectful of it, yes.`, tone: 'firm', r: `That's a good way to put it.` }, { t: `Only of the photographers.`, tone: 'light', r: `Ha. Fair.` }, { t: `No.`, tone: 'cold', r: `Oh. Okay.` } ] } },
      { ...firm, t: `We race. It's what ${N} did.`, r: `I think I understand.`, then: followSafe },
      { ...cold, t: `Thanks.`, r: `Sorry. I'll let you get ready.` },
      { ...cruel, t: pick([`You don't get to be sad. You didn't know ${N}.`, cruel.t]) } ] };
    default: return { say: pick([`I keep looking for ${N}'s car down the grid. Stupid, isn't it?`, `Did you sleep? I didn't. Kept thinking about ${N}.`, `${N} would have been winding me up about my starts right about now.`, `Feels wrong, lining up like nothing happened to ${N}.`, `I saw ${N}'s family by the memorial. I didn't know what to say to them.`]), opts: [
      { ...kind, r: pick([`...Yeah. I know.`, `Thanks. Needed to hear someone else say it.`, `Yeah. Every word.`]), then: followFeel },
      { ...firm, r: pick([`Respect.`, `Yeah. That's the only answer, isn't it.`]), then: followSafe },
      Math.random() < 0.6 ? { ...light, r: n.persona === 'stirrer' ? `Ha. Yeah. Yeah, ${N} would.` : `...Yeah. Probably.`, then: followMem } : cold,
      cruel ] };
  }
};

// ---- the race ahead -----------------------------------------------------------------------------------------------
T.race = (x, n) => {
  const tr = x.trackLines, gapGrid = n.car ? (n.car.gridPos || 0) - (x.me.gridPos || 0) : 0;
  const follow = { say: pick([`Leave me some room into Turn 1, yeah?`, `You reckon there's a safety car tonight?`, `What are you starting on? Go on, tell me.`]),
    opts: [
      { t: pick([`Always. Clean and fair.`, `Room for both of us. Every time.`]), tone: 'kind', r: pick([`Appreciate it.`, `Same from me.`]) },
      { t: pick([`At this place? Bet on it.`, `Whatever's quickest. Ask me after.`]), tone: 'firm', r: pick([`Ha. Fair.`, `Worth a go.`]) },
      { t: pick([`Hope and a prayer.`, `Same as you, but faster.`]), tone: 'light', r: pick([`Ha! Good one.`, `We'll see about that.`]) },
      { t: pick([`Room? Get out of my way or get left behind.`, `Your problem, not mine.`]), tone: 'cruel', m: -3, r: pick([`Right. Remember you said that.`, `Okay, if that's how it is.`]) },
    ] };
  switch (n.kind) {
    case 'boss': return { say: pick([`Clean start, no heroics in Turn 1. Points are points.`, `The board's watching tonight. No pressure.`, `${x.me.gridPos ? `P${x.me.gridPos}. ` : ''}${pick(['We can work with that.', 'Make it count.', 'Bring it home and we are happy.'])}`]), opts: [
      { t: pick([`Understood. Clean and quick.`, `I'll bring it home.`]), tone: 'firm', r: `That's my driver.`, then: { say: `And if you get a sniff of a podium?`, opts: [
        { t: `Then I take it. Cleanly.`, tone: 'firm', r: `Good answer.` }, { t: `I'll check with the pit wall first.`, tone: 'kind', r: `Ha. You won't, but thanks.` }, { t: `Then I'll want a raise.`, tone: 'light', r: `Let's not get ahead of ourselves.` } ] } },
      { t: pick([`Thanks for the faith. The car feels good.`, `The crew have been incredible this weekend.`]), tone: 'kind', r: `They'll be glad to hear it.`, then: { say: `Anything you need from us today?`, opts: [
        { t: `Just a good stop. Nothing else.`, tone: 'firm', r: `You'll get one.` }, { t: `A bit of trust on the radio.`, tone: 'kind', r: `You've got it.` }, { t: `A faster car, ideally.`, tone: 'light', r: `Working on it. Literally.` }, { t: `Less micromanaging.`, tone: 'cold', r: `Noted. Sort of.` } ] } },
      { t: pick([`No pressure? Then stop mentioning the board.`, `I know what I'm doing.`]), tone: 'cold', r: `Fair. I'll shut up.` },
      { t: pick([`If the strategy's wrong again, that's on you, not me.`, `Points are points? Aim higher.`]), tone: 'cruel', m: -3, r: `We'll talk after the race. Calmly.`, then: { say: `Anything else you want to get off your chest?`, opts: [
        { t: `No. Sorry. Nerves.`, tone: 'sorry', r: `It happens. Go get it.` }, { t: `Plenty. After the race.`, tone: 'cold', r: `Looking forward to it.` } ] } } ] };
    case 'eng': return { say: pick([`Brakes are cold tonight - give them a proper lap before you lean on them.`, `Clutch bite's the same as practice. Don't overthink the start.`, `Radio check at the five-minute board. Keep it short if it's busy.`, tr.eng]), opts: [
      { t: `Copy.`, tone: 'firm', r: `Good.`, then: { say: `Anything you want me to keep an eye on?`, opts: [
        { t: `Tyre temps. And the gaps behind.`, tone: 'firm', r: `Will do.` }, { t: `Tell me when it rains. Before it rains.`, tone: 'light', r: `I'll see what I can do.` }, { t: `Just keep the chat to a minimum.`, tone: 'cold', r: `Understood.` } ] } },
      { t: pick([`Thanks. And thanks for this weekend.`, `Good work on the setup. It feels right.`]), tone: 'kind', r: `Thank the whole lot of us when you win.`, then: { say: `Any feeling on the balance from the laps to the grid?`, opts: [
        { t: `A touch of understeer in the slow stuff. I'll manage it.`, tone: 'firm', r: `Front wing, one click, if you want it.` }, { t: `Perfect. Don't touch a thing.`, tone: 'kind', r: `Wasn't going to.` }, { t: `It's a car. It's got four wheels.`, tone: 'light', r: `Very technical.` } ] } },
      { t: `Any chance of an extra fifty horsepower?`, tone: 'light', r: `Already in the post.`, then: follow },
      { t: pick([`I know how to drive the car.`, `I don't need a lecture right now.`]), tone: 'cruel', m: -3, r: `Right. Sorry.`, then: { say: `I'll keep it short on the radio, then.`, opts: [
        { t: `Sorry. That was the nerves talking.`, tone: 'sorry', r: `No worries.` }, { t: `Do that.`, tone: 'cold', r: `...` } ] } } ] };
    case 'mech': return { say: pick([`Car's mint. Every bolt checked twice.`, `New front wing on. Try not to need another.`, `Tyre blankets are on until the last minute. You're good to go.`]), opts: [
      { t: pick([`Thanks. You lot are the best crew on the grid.`, `Couldn't do it without you.`]), tone: 'kind', r: `Get off. ...Thanks.`, then: { say: `Pit stop's going to be quick tonight. You'll see.`, opts: [
        { t: `Sub two seconds and the drinks are on me.`, tone: 'light', r: `Deal. Everyone heard that!` }, { t: `I trust you completely.`, tone: 'kind', r: `Good.` }, { t: `It had better be.`, tone: 'cold', r: `...It will be.` } ] } },
      { t: `I'll try not to need another.`, tone: 'light', r: `You said that last time.`, then: follow },
      { t: `Just make sure the wheels are on this time.`, tone: 'cruel', m: -3, r: `They're always on.`, then: { say: `Anything else?`, opts: [ { t: `No. Sorry. That was out of line.`, tone: 'sorry', r: `Yeah. It was.` }, { t: `No.`, tone: 'cold', r: `Fine.` } ] } } ] };
    case 'press': return { say: pick([`Starting P${x.me.gridPos || '-'} - what's realistic tonight?`, `How's the car feeling after qualifying?`, `${tr.press}`]), opts: [
      { t: pick([`Podium. Nothing less.`, `The win, if it's there.`]), tone: 'firm', fx: { press: true }, r: `Bold!`, then: x.X ? T.pressRival(x, n) : null },
      { t: pick([`Points, a clean race, and everyone home safe.`, `Honestly - a clean race and a good result for the team.`]), tone: 'kind', fx: { press: true }, r: `Sensible.`, then: x.X ? T.pressRival(x, n) : null },
      { t: `Realistic? Have you seen my car?`, tone: 'light', fx: { press: true }, r: `Ha! I'll pass that on to your team principal.`, then: x.X ? T.pressRival(x, n) : null },
      { t: `Ask the people behind me. They'll be looking at my rear wing.`, tone: 'cruel', m: -1, fx: { press: true }, r: `Strong words.`, then: x.X ? T.pressRival(x, n) : null } ] };
    default: return { say: pick([
      gapGrid < 0 ? `P${n.car.gridPos}, me. You'll be looking at my gearbox all night.` : gapGrid > 0 ? `I'll be right behind you. Don't brake early.` : `Big run down to Turn 1 here. Somebody's going to be brave.`,
      tr.drv, `Big run down to Turn 1 here. Somebody's going to be brave.`, `Good luck tonight. Genuinely.`]), opts: [
      { t: pick([`I'm going for the win. Simple.`, `Turn 1's mine. Just so you know.`]), tone: 'firm', r: pick([`Bold. We'll see.`, `Love the confidence. Brakes are cold though.`]), then: follow },
      { t: pick([`Clean start, no silly stuff. Long race.`, `Good luck to you too. Genuinely.`]), tone: 'kind', r: pick([`Sensible. Boring, but sensible.`, `Cheers.`]), then: follow },
      { t: pick([`I'll be brave. You be sensible.`, `Somebody's going to be brave and somebody's going to be in the gravel.`]), tone: 'light', r: pick([`Ha! Let's hope it's not either of us.`, `Ha. Right.`]), then: follow },
      { t: pick([`Just stay out of my mirrors. Last time was embarrassing.`, `Doesn't matter. You won't see me after Turn 1.`]), tone: 'cruel', r: pick([`Wow. Okay.`, `Save it for the track.`]), then: { say: `Is that how it's going to be?`, opts: [
        { t: `...Nah. Sorry. Nerves. Good luck.`, tone: 'sorry', r: `Yeah. Good luck.` }, { t: `That's exactly how it's going to be.`, tone: 'cruel', r: `Noted.` }, { t: `It's racing. Don't take it personally.`, tone: 'firm', r: `I'll take it how I like.` }, ...shove(x, n) ] } } ] };
  }
};
T.pressRival = (x, n) => {
  const X = x.X, XN = last(X.name);
  return { say: pick([`${XN} said this week you're too aggressive in wheel-to-wheel. Your response?`, `${XN} has been the story of the season. Can you beat ${XN} tonight?`, `Is there any tension between you and ${XN} after last time?`]),
    opts: [
      { t: pick([`${XN}'s entitled to an opinion. We'll race fair.`, `I've got a lot of respect for ${XN}.`]), tone: 'kind', fx: { press: true, about: X, nice: true }, r: `Diplomatic.` },
      { t: pick([`Hard but fair. Always have been.`, `We'll find out in Turn 1.`]), tone: 'firm', fx: { press: true }, r: `Fair enough.` },
      { t: pick([`${XN} should spend less time talking and more time driving.`, `${XN}'s the last person who should be lecturing anyone about racecraft.`]), tone: 'cruel', m: 0, fx: { press: true, about: X }, r: `I think that's my headline.` },
      { t: `No comment.`, tone: 'cold', r: `Of course.` },
    ] };
};

// ---- a rival near you on the grid --------------------------------------------------------------------------------
T.rival = (x, n) => ({ say: pick([`You and me, side by side again. Don't do anything daft.`, `Last time we were this close, you ran me out of road.`, `Watched your onboard from qualifying. Nice line through the last corner.`]), opts: [
  { t: pick([`Fair and hard. Same as always.`, `You'll get your car's width. Always.`]), tone: 'kind', r: pick([`That's all I ask.`, `Same from me.`]), then: { say: `What happened last time, though - you'd do that again?`, opts: [
    { t: `No. I got it wrong. Sorry about that.`, tone: 'sorry', r: `Appreciate it. Means a lot.` }, { t: `It was a racing incident. Stewards agreed.`, tone: 'firm', r: `Stewards. Right.` }, { t: `Every single time.`, tone: 'cruel', m: -3, r: `Then I'll be ready for it.` } ] } },
  { t: pick([`That's racing. You'd have done the same.`, `You left the door open.`]), tone: 'firm', r: pick([`Maybe.`, `We'll see who leaves doors open tonight.`]), then: { say: `Just keep it clean into Turn 1.`, opts: [
    { t: `Clean. You have my word.`, tone: 'kind', r: `Good.` }, { t: `As clean as you are.`, tone: 'firm', r: `Ha. Fine.` }, { t: `No promises.`, tone: 'cold', r: `Great.` } ] } },
  { t: pick([`Thanks. I've been working on that one.`, `Took me all year to find that line.`]), tone: 'light', r: pick([`Don't get used to the compliments.`, `Won't help you tonight.`]), then: { say: `What did you change for tonight?`, opts: [
    { t: `Not telling you.`, tone: 'light', r: `Worth a try.` }, { t: `Less wing, more nerve.`, tone: 'firm', r: `Brave.` }, { t: `Nothing you'd understand.`, tone: 'cruel', m: -2, r: `Charming.` } ] } },
  { t: pick([`Ran you out of road? You ran out of talent.`, `Watch the onboard again. Slowly.`]), tone: 'cruel', r: pick([`Wow.`, `Say that after the race.`]), then: { say: `You really want to start like this?`, opts: [
    { t: `No. Sorry. Let's just race.`, tone: 'sorry', r: `Yeah. Let's.` }, { t: `I've already started.`, tone: 'cruel', r: `See you in Turn 1, then.` }, ...shove(x, n) ] } } ] });

// ---- your teammate ----------------------------------------------------------------------------------------------------
T.mate = (x, n) => ({ say: pick([`Same rule as always - no contact between us, yeah?`, `Team says no fighting in the first stint. You good with that?`, `If I'm quicker on the day, you let me by. Deal?`]), opts: [
  { t: pick([`Deal. Clean, and both cars home.`, `Both cars home. That's the job.`]), tone: 'kind', r: `Good. That's how it should be.`, then: { say: `And if the team calls it the other way round?`, opts: [
    { t: `Then I'll do the same. Fair's fair.`, tone: 'kind', r: `Respect.` }, { t: `We'll see what the gaps say.`, tone: 'firm', r: `Hm.` }, { t: `Team orders are for the slow car.`, tone: 'cruel', m: -3, r: `Wow. Okay then.` } ] } },
  { t: pick([`If you're quicker you'll get past on your own.`, `Race me. Properly.`]), tone: 'firm', r: `Fair enough. Game on.`, then: { say: `Just not into Turn 1, yeah? Nobody wants two cars in the wall.`, opts: [
    { t: `Agreed. Turn 1's sacred.`, tone: 'kind', r: `Good.` }, { t: `Not unless you leave the door open.`, tone: 'light', r: `Ha. I won't.` }, { t: `Your problem if you do.`, tone: 'cruel', m: -2, r: `Unbelievable.` } ] } },
  { t: `I'll do what the team says.`, tone: 'cold', r: `Okay. Robot mode.` },
  { t: pick([`Let you by? Get real. You're the number two.`, `Quicker? You?`]), tone: 'cruel', r: `...Right. Good to know where I stand.`, then: { say: `You'll want my help one day. Remember this.`, opts: [
    { t: `Sorry. That came out wrong. Both cars home.`, tone: 'sorry', r: `Yeah. Both cars home.` }, { t: `I'll manage.`, tone: 'cold', r: `We'll see.` } ] } } ] });

// ---- the championship (a career) -----------------------------------------------------------------------------------------
T.title = (x, n) => {
  const g = x.gapTo?.(n) ?? null, ahead = g != null && g < 0;
  return { say: g == null ? pick([`Long season. How's it feeling from the inside?`, `Big points on offer tonight.`]) : ahead ? `${-g} points behind me. Getting closer?` : g > 0 ? `${g} points up on me. Don't get comfortable.` : `Level on points. Fancy that.`, opts: [
    { t: pick([`One race at a time.`, `Long way to go yet.`]), tone: 'firm', r: `Boring answer. Probably right.`, then: { say: `You think about the title? Honestly?`, opts: [
      { t: `Every night.`, tone: 'kind', r: `Me too.` }, { t: `Only when someone asks.`, tone: 'light', r: `Sorry.` }, { t: `It's mine. Just a matter of time.`, tone: 'firm', r: `We'll see.` } ] } },
    { t: pick([`Closer every week.`, `Comfortable? Never.`]), tone: 'light', r: `Ha. Good.`, then: { say: `May the best one win, then.`, opts: [ { t: `May the best one win.`, tone: 'kind', r: `Shake on it.` }, { t: `I intend to.`, tone: 'firm', r: `Course you do.` } ] } },
    { t: pick([`You've had the better car. That's all.`, `Enjoy it while it lasts.`]), tone: 'cruel', m: -2, r: `Car, is it. Right.` },
    { t: `Let's not do this on the grid.`, tone: 'cold', r: `Fine.` } ] };
};

// ---- gossip: someone else's name comes up --------------------------------------------------------------------------
T.gossip = (x, n) => {
  const X = x.X, XN = last(X.name);
  return { say: pick([`Did you see ${XN} in qualifying? Nearly took me out.`, `${XN}'s been moaning to the stewards all weekend.`, `Heard ${XN}'s team are already looking at drivers for next year.`, `${XN} walked straight past me at the briefing. Not a word.`]), opts: [
    { t: pick([`${XN}'s quick, to be fair. Fair play.`, `Give ${XN} a break. Tough season.`]), tone: 'kind', r: n.persona === 'stirrer' ? `Boring. But fine.` : `Yeah. You're right.`, then: { say: `You get on with ${XN}, then?`, opts: [
      { t: `Well enough. We race hard and shake hands.`, tone: 'kind', r: `That's how it should be.` }, { t: `Don't really know ${XN}.`, tone: 'cold', r: `Fair.` } ] } },
    { t: x.trash(X), tone: 'gossip', fx: { about: X }, then: { say: pick([`Would you say that to ${XN}'s face?`, `You know the cameras can lip-read, right?`]), opts: [
      { t: `Happily.`, tone: 'firm', r: `Ha! I'd pay to watch.` }, { t: `No. Forget I said it.`, tone: 'sorry', r: `Said what?` }, { t: `After I've beaten ${XN}, sure.`, tone: 'light', r: `Ha. Good luck.` } ] } },
    { t: `Not my business.`, tone: 'cold', r: `Suit yourself.` },
    { t: pick([`Everyone moans to the stewards. It's a hobby.`, `${XN} talks. We drive.`]), tone: 'light', r: `Ha. True.` } ] };
};

// ---- the guests --------------------------------------------------------------------------------------------------------
T.celeb = (x, n) => {
  const who = x.X ? last(x.X.name) : 'the front row';
  const nervous = { say: `Can I ask - are you nervous? Right now?`, opts: [
    { t: `Always. The day you aren't, you stop.`, tone: 'kind', r: `That's lovely. And terrifying.` }, { t: `Not nervous. Ready.`, tone: 'firm', r: `Oh, that's a good line.` }, { t: `Only of your photographer.`, tone: 'light', r: `Ha!` }, { t: `Not as nervous as you look.`, tone: 'cold', r: `...Fair.` } ] };
  const watch = { say: `Who should I watch tonight, apart from you?`, opts: [
    { t: `${who}. Quick and clean.`, tone: 'kind', r: `Noted!` }, { t: `Only me. Nobody else matters.`, tone: 'firm', r: `Ha! Confidence.` }, { t: `The pit wall. That's where it's won.`, tone: 'light', r: `Ooh, insider stuff.` } ] };
  const rude = { t: pick([`Who are you again?`, `Do I know you?`]), tone: 'cruel', m: -3, r: pick([`...I'll let you get on.`, `Wow. Okay. Sorry to bother you.`]) };
  return pick([
    { say: `Sorry - could I get a quick photo? My kids will lose their minds.`, opts: [
      { t: pick([`Of course! Quick one.`, `Sure - come on, get in close.`]), tone: 'kind', r: `Thank you so much! You're a star.`, then: nervous },
      { t: `Go on then. Make it a good one, I've got a helmet face.`, tone: 'light', r: `Ha! Say "pole position"!`, then: watch },
      { t: pick([`Not now, sorry. I'm working.`, `Maybe after the race.`]), tone: 'cold', r: `Oh - of course. Sorry.` },
      rude ] },
    { say: `What's it actually like at three hundred kilometres an hour?`, opts: [
      { t: pick([`Loud. Fast. Your neck hurts for a week.`, `Like being fired out of a cannon, every straight.`]), tone: 'light', r: `I'm never complaining about my commute again.`, then: watch },
      { t: `Calm, weirdly. Everything slows down when it's going right.`, tone: 'kind', r: `That's the opposite of what I expected.`, then: nervous },
      { t: `Fast.`, tone: 'cold', r: `Right. Of course.` },
      rude ] },
    { say: `First time on a grid! Any tips? What do I watch?`, opts: [
      { t: `Watch the first three corners. Then the pit stops. That's the race.`, tone: 'kind', r: `Three corners, then the stops. Got it!`, then: nervous },
      { t: `Watch me. Obviously.`, tone: 'firm', r: `Ha! Obviously.`, then: watch },
      { t: `Earplugs. Seriously. Wear the earplugs.`, tone: 'light', r: `Already lost one. Is that bad?`, then: watch },
      rude ] },
  ]);
};
// ---- a quiet word (a star on a quiet day - a memorial weekend, or her grieving - when nothing else fits) ----------------
T.quiet = (x, n) => ({ say: pick([`It feels a strange day to be here. I hope that's alright.`, `I'll keep out of the way. I only wanted to say good luck.`]), opts: [
  { t: pick([`Of course it is. Thank you for coming.`, `It's good to see you. Really.`]), tone: 'kind', r: pick([`Thank you.`, `Look after yourself out there.`]) },
  { t: pick([`Thanks. I need to get my head in the race now.`, `Thank you. I'd better get to the car.`]), tone: 'firm', r: pick([`Of course. Go.`, `Go on. Take care.`]) },
  { t: `Thanks.`, tone: 'cold', r: `...Okay.` } ] });

// your lines about someone behind their back (name only, about the racing)
const TRASH = [
  (X) => `Between us? ${X} is overrated. The car does the work.`,
  (X) => `${X} brakes like it's a road car. I'll be past by Turn 3.`,
  (X) => `Has anyone told ${X} what mirrors are for?`,
  (X) => `${X} cries to the stewards every time someone gets near.`,
  (X) => `${X} is all mouth. Watch it fall apart the second it gets close.`,
  (X) => `${X} has had a quick car for years and still finds ways to waste it.`,
  (X) => `${X} has been driving the same mistake for three years.`,
];
// their reaction to it, by who they are
const GOSSIP_R = {
  stirrer: [`Ha! Say that louder, the camera's right there.`, `Ha. Not wrong. Don't quote me.`, `Mate, I'm stealing that one.`],
  decent: [`Bit harsh. ${'{X}'}'s alright.`, `Not really my style, talking behind people's backs.`, `Say it to ${'{X}'}'s face, then.`],
  mate: [`That's my teammate you're talking about.`, `Careful. ${'{X}'} is in my garage.`],
  boss: [`Keep that to yourself. I mean it.`, `Not on the grid. Not anywhere.`],
  press: [`Is that on the record?`, `Oh, that's going in.`],
  celeb: [`Ooh. Drama.`, `I did not hear that. Okay, I heard that.`],
  star: [`I'm going to pretend I didn't hear that.`, `Is this what you lot talk about all day?`, `Ooh. I'm staying out of this one.`],
  mech: [`Ha. Don't let the lads hear you. Actually, do.`, `Careful, mate.`],
  eng: [`Focus on your own race.`, `Can we keep it about the car?`],
};
const LEAK = { stirrer: 0.35, decent: 0.5, mate: 0.9, boss: 0, press: 1, celeb: 0.3, star: 0.25, mech: 0.1, eng: 0.05 };

const FAREWELL = {
  good: [`Good luck out there. Bring it home safe.`, `Go well. See you after.`, `Have a good one. Safe race.`],
  ok: [`Right. Better get on.`, `See you out there.`, `Good luck.`],
  bad: [`...Yeah. Whatever.`, `I've got things to do.`, `Right.`],
  awful: [`Don't talk to me again.`, `We're done.`, `...`],
  celeb: [`Thank you so much! Good luck!`, `This made my year. Good luck!`],
  press: [`Thanks for your time. Good luck tonight.`, `Thanks - good luck.`],
};

export class GridWalk {
  /**
   * o: { pre (the PreRace, as it stands), scene, camera, canvas, track, cars, player, career, trackName, night,
   *      weather, audio, strings(on), onDone }
   * brawl: the shove or scuffle playing (a ui/Brawl.js Jab or Brawl: it has the camera and the keys) | null;
   * brawled: what the scuffle came to (ui/WalkFx.js brawlFx: { did, name, result, escalated, onCamera, started }) | null
   */
  constructor(o) {
    Object.assign(this, o);
    const pre = this.pre, tr = this.track, me = this.player;
    this.done = false; this.t = 0; this.left = 240; this.npcs = []; this.toastsShown = 0; this.deadCruel = false; this.respected = false;
    this.brawl = null; this.brawled = null; this.aiT = 0;
    this.F = pre.fwd.clone(); this.L = pre.left.clone(); this.front = pre.front.clone();
    const cars = pre.grid, P = (c) => new THREE.Vector3(c.x, 0, c.z), fwOf = (c) => new THREE.Vector3(Math.cos(c.th), 0, Math.sin(c.th)), lfOf = (c) => new THREE.Vector3(Math.sin(c.th), 0, -Math.cos(c.th));
    const lift = (p) => { if (this.night) for (const k in p.mats) { const m = p.mats[k]; if (m.emissive && m.color) m.emissive.copy(m.color).multiplyScalar(0.2); } };
    const add = (person, at, face) => { lift(person); person.group.position.set(at.x, TERRAIN.at(at.x, at.z), at.z); person.group.rotation.y = face; pre.group.add(person.group); pre.people.push(person); return person; };
    const C = this.career;
    // the drivers back at their cars (the suits at the memorial were them), the reporter's walk over
    for (const m of pre.mourners) if (m.driverName) m.group.visible = false;
    if (pre.walker) pre.walker.group.visible = false;
    // ---- who is here to talk to
    const mine = cars.filter((c) => c !== me), near = (k) => mine.find((c) => (c.gridPos || 0) === (me.gridPos || 0) + k);
    const picks = []; const take = (c) => { if (c && !picks.includes(c) && picks.length < 6) picks.push(c); };
    take(mine.find((c) => c.team === me.team)); take(cars[0] !== me ? cars[0] : null);
    for (const k of [-1, 1, -2, 2, -3, 3, 4, -4, 5, -5, 6]) take(near(k));
    for (const c of picks) {
      const at = P(c).addScaledVector(fwOf(c), -1.3).addScaledVector(lfOf(c), -1.45);
      const p = add(makePerson({ pose: 'talk', kit: 'suit', color: c.color, accent: c.color2, driver: c.name, jitter: 0.015, detail: 0.75 }), at, facing(lfOf(c).x, lfOf(c).z) + Math.PI + 0.4);
      const persona = hash(c.name) % 3 === 0 ? 'stirrer' : 'decent';
      this.npcs.push({ kind: 'driver', car: c, name: c.name, role: `${c.team}${c.gridPos ? ` · P${c.gridPos}` : ''}${c.team === me.team ? ' · your teammate' : ''}`, person: p, did: c.careerId || null, persona, mate: c.team === me.team, mood: C && c.careerId ? Math.round(C.rapportOf(c.careerId) / 25) : 0 });
    }
    const pm = P(me), fm = fwOf(me), lm = lfOf(me);
    const boss = add(makePerson({ pose: 'talk', kit: 'jacket', color: me.color, accent: me.color2, jitter: 0.015, detail: 0.75, teamName: me.team }), pm.clone().addScaledVector(fm, -1.0).addScaledVector(lm, 2.9), facing(-lm.x, -lm.z));
    this.npcs.push({ kind: 'boss', name: 'Team Principal', role: me.team, person: boss, persona: 'decent', mood: 0 });
    const eng = add(makePerson({ pose: 'talk', kit: 'polo', color: me.color, accent: me.color2, cap: true, jitter: 0.015, detail: 0.7, teamName: me.team }), pm.clone().addScaledVector(fm, 1.2).addScaledVector(lm, 3.1), facing(-lm.x, -lm.z) + 0.5);
    this.npcs.push({ kind: 'eng', name: pick(ENGINEERS), role: `Race engineer · ${me.team}`, person: eng, persona: 'decent', mood: 0 });
    const mech = pre.crew.get(me)?.[0];
    if (mech) this.npcs.push({ kind: 'mech', name: pick(MECHS), role: `No. 1 mechanic · ${me.team}`, person: mech, persona: 'stirrer', mood: 0 });
    if (pre.rep) this.npcs.push({ kind: 'press', name: 'Martin Hale', role: `Pit-lane reporter · ${OUTLET}`, person: pre.rep, persona: 'stirrer', mood: 0 });
    if (pre.guest && pre.guestB) this.npcs.push({ kind: 'celeb', name: pre.guestB[0], role: `${pre.guestB[1]} · guest`, person: pre.guest, persona: 'decent', mood: 0 });
    if (pre.celeb && pre.guestA) this.npcs.push({ kind: 'celeb', name: pre.guestA[0], role: `${pre.guestA[1]} · guest of ${pre.celebCar?.team || 'a team'}`, person: pre.celeb, persona: 'stirrer', mood: 0 });
    // the stars, where the show put them (ui/PreRace.js: career/Celebs.js's celebrities, made up, every one)
    for (const s of pre.stars || []) if (s?.person?.group) this.npcs.push({ kind: 'star', celebId: s.id, name: s.name, job: s.job || '', role: `${s.job ? s.job + ' · ' : ''}guest`, person: s.person, persona: 'decent', mood: 0 });
    for (const n of this.npcs) { n.face0 = n.person.group.rotation.y; n.mood0 = n.mood; }

    // ---- the context the lines are written from
    const lost = pre.memorial || [];
    const TL = { lasvegas: { drv: `Tyres are going to be like ice on the out-lap tonight.`, eng: `Track's barely above ten degrees. The fronts will grain if you push too early.`, press: `It's cold out here on the Strip tonight. How does that change things?` },
      austin: { drv: `It's bumpy into Turn 12 and the wind's swirling on the hill. Brake by the board, not by feel.`, eng: `Tyre temperatures climb through the Esses - look after the fronts in sector one.`, press: `Austin, the hill, the Texas crowd - what makes this place special?` },
      montreal: { drv: `Grip's coming back but the walls haven't moved. Keep it off the Wall of Champions.`, eng: `Brakes are working hard today, watch the temperatures behind other cars.`, press: `Montreal, the island, the crowd - what's it like to race here?` },
      silverstone: { drv: `Wind's swinging round again. Copse is going to be fun.`, eng: `The wind's on the nose into Stowe now. Brake a touch earlier than practice.`, press: `A home crowd for some - what does Silverstone mean to you?` } }[tr.def?.id] || { drv: `Tyres are going to be tricky early on.`, eng: `Bring the fronts in gently on the formation lap.`, press: `How does the track feel compared to practice?` };
    if (this.weather && this.weather !== 'dry') TL.drv = `Wet one tonight. Visibility in the spray's going to be horrible.`;
    this.x = { me, L: lost[0] ? { name: lost[0].name, number: lost[0].number, team: lost[0].team } : null, trackLines: TL,
      trash: (X) => pick(TRASH)(last(X.name)),
      // (for the topics in GridTalk.js)
      meFirst: first(me.name), trackName: o.trackName || tr.def?.name || 'here', city: tr.def?.id === 'silverstone' ? 'Silverstone' : tr.def?.id === 'montreal' ? 'Montreal' : tr.def?.id === 'austin' ? 'Austin' : 'Vegas',
      corners: tr.def?.id === 'austin' ? ['Turn 1', 'the Esses', 'the Turn 11 hairpin', 'Turn 12', 'the stadium section', 'Turns 16 to 18', 'Turn 19', 'Turn 20'] : tr.def?.id === 'montreal' ? ['the hairpin', 'the Senna S', 'the last chicane', 'the Wall of Champions', 'Turns 8 and 9', 'Turn 3', 'the Casino straight'] : tr.def?.id === 'silverstone' ? ['Copse', 'Maggotts and Becketts', 'Stowe', 'Club', 'Luffield', 'Brooklands', 'Abbey', 'Vale'] : ['Turn 1', 'the Turn 5 hairpin', 'the Sphere section', 'Turn 12', 'Turn 14', 'the chicane before the Strip', 'the end of the Strip'],
      planText: me.strategy ? `${['no-stop', 'one-stop', 'two-stop', 'three-stop'][me.strategy.stints.length - 1] || 'multi-stop'}, ${me.strategy.stints.map((s) => s.compound.toLowerCase() + 's').join(' to ')}` : 'one-stop', startTyre: (me.strategy?.stints?.[0]?.compound || me.tyres?.compound || 'medium').toLowerCase(), stopLap: me.strategy?.stints?.[0]?.end ?? '15', laps: me.strategy?.laps ?? '',
      mate: (() => { const m = cars.find((c) => c !== me && c.team === me.team); return m ? last(m.name) : null; })(),
      wet: o.wet ?? (this.weather === 'wet' ? 0.8 : this.weather === 'damp' ? 0.35 : 0), night: !!this.night,
      gapTo: C ? (n) => { if (!n.did) return null; const mineP = C.drivers?.[C.playerId]?.points, theirs = C.drivers?.[n.did]?.points; return mineP != null && theirs != null ? mineP - theirs : null; } : null };
    this.x.weatherText = weatherLine(this.x); this.x.venue = venueLines(tr.def?.id);

    // ---- where you start: beside your car, looking down the grid
    this.pos = pm.clone().addScaledVector(lm, 1.9).addScaledVector(fm, -0.5); this.pos.y = 1.7; this.look = this.pos.clone();
    this.yaw = Math.atan2(fm.z, fm.x) + 0.35; this.pitch = -0.05;
    const along = cars.map((c) => (c.x - this.front.x) * this.F.x + (c.z - this.front.z) * this.F.z);
    this.bounds = { a0: Math.min(...along) - 14, a1: (pre.mem ? 36 : 14), w: tr.halfWidth + 0.6 };
    // (the people in full detail you can push past, gently; the memorial you can't)
    this.hq = pre.people.filter((p) => p.group.position.y - TERRAIN.at(p.group.position.x, p.group.position.z) < 0.5 && p.group.visible && !p.busy).map((p) => p.group.position);
    this.solid = []; if (pre.mem) this.solid.push(pre.mem.c0.clone());
    this.life = pre.life || null; this.cars = pre.grid;
    this.cars = cars;
    this.camera.fov = 62; this.camera.updateProjectionMatrix();
    // (what the career says about the people here - a star's bond with you, a friend's warm hello, your partner, the
    // week's stories - set on them and on x by ui/WalkFx.js; a friend's warmer start is where their mood starts from)
    wfx('walkSetup', this);
    for (const n of this.npcs) { n.mood0 = n.mood; if (n.kind === 'star') n.role = `${n.job ? n.job + ' · ' : ''}${n.stage === 'partner' ? 'your partner' : 'guest'}`; }
    this._dom(); this._input();
    this.talk = null;
  }

  // =================================================================================================================
  _dom() {
    if (!document.getElementById('gridwalk-css')) { const st = document.createElement('style'); st.id = 'gridwalk-css'; st.textContent = CSS; document.head.appendChild(st); }
    const el = this.el = document.createElement('div'); el.id = 'gridwalk';
    el.innerHTML = `<div class="bug"><b>GRID</b><i class="clock">4:00</i></div><div class="btns"><button class="go">TO THE CAR ▸</button></div><div class="dot"></div>
      <div class="prompt"></div><div class="tags"></div><div class="toasts"></div>
      <div class="help"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> walk · <kbd>Shift</kbd> hurry · click / drag to look · <kbd>E</kbd> talk${this.x?.L ? '' : ' · <kbd>F</kbd> shove'} · <kbd>Enter</kbd> to the car</div>
      <div class="talk"><div class="who"></div><div class="line"></div><div class="opts"></div><div class="next"></div></div>
      <div class="respect"><div class="n"></div><div class="s"></div></div><div class="black"></div>`;
    document.body.appendChild(el);
    el.querySelector('.go').addEventListener('click', () => this.end());
    this.tags = this.npcs.map((n) => { const d = document.createElement('div'); d.className = 'tag'; d.innerHTML = `${esc(n.kind === 'driver' ? n.name : n.name)}<small>${esc(n.role)}</small>`; el.querySelector('.tags').appendChild(d); return d; });
    requestAnimationFrame(() => { el.querySelector('.black').style.opacity = 0; });
  }
  _input() {
    this.keys = new Set();
    this._kd = (e) => {
      if (this.done) return;
      const c = e.code;
      if (this.respect) { e.preventDefault(); return; }
      // (a shove or a scuffle playing: every key is its own - a key held down repeating is not a press)
      if (this.brawl) { e.preventDefault(); if (!e.repeat) this.brawl.key(c); return; }
      if (this.talk) {
        if (/^Digit[1-4]$/.test(c) || /^Numpad[1-4]$/.test(c)) { e.preventDefault(); this._choose(+c.slice(-1) - 1); }
        else if (this.talk.closing && (c === 'KeyE' || c === 'Escape' || c === 'Enter')) { e.preventDefault(); this._leave(); }   // (done: E, Esc, Enter or a click - not Space)
        else if (c === 'Space' || c === 'Enter' || c === 'KeyE') { e.preventDefault(); this._advance(); }
        return;
      }
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight', 'Space'].includes(c)) { e.preventDefault(); this.keys.add(c); }
      if (c === 'KeyE') { e.preventDefault(); this._interact(); }
      if (c === 'KeyF') { e.preventDefault(); if (!e.repeat) this._shoveKey(); }
      if (c === 'Enter') { e.preventDefault(); this.end(); }
    };
    this._ku = (e) => { this.keys.delete(e.code); };
    this._md = (e) => { if (this.talk?.closing && e.button === 0) { this._leave(); return; }   // (a click away from the talk ends it, and the mouse looks again)
      if (this.done || this.talk || this.respect || this.brawl || e.button !== 0) return; this.drag = true; try { const r = this.canvas.requestPointerLock?.(); r?.catch?.(() => {}); } catch (_) { /* (an artifact's frame may refuse: dragging still looks) */ } };
    this._mu = () => { this.drag = false; };
    this._mm = (e) => {
      if (this.done || this.talk || this.respect || this.brawl) return;
      if (document.pointerLockElement !== this.canvas && !this.drag) return;
      this.yaw += (e.movementX || 0) * 0.0024; this.pitch = Math.max(-0.9, Math.min(0.7, this.pitch - (e.movementY || 0) * 0.0024));
    };
    window.addEventListener('keydown', this._kd, true); window.addEventListener('keyup', this._ku, true);
    this.canvas.addEventListener('mousedown', this._md); window.addEventListener('mouseup', this._mu); window.addEventListener('mousemove', this._mm);
  }

  // ---- moving about ------------------------------------------------------------------------------------------------
  _free(x, z) {
    const a = (x - this.front.x) * this.F.x + (z - this.front.z) * this.F.z, B = this.bounds;
    if (a < B.a0 || a > B.a1) return false;
    if (this.pre.edge ? !this.pre.edge(x, z, 0.35).ok : Math.abs((x - this.front.x) * this.L.x + (z - this.front.z) * this.L.z) > B.w) return false;   // (the track's own walls, either side)
    for (const c of this.cars) { const dx = x - c.x, dz = z - c.z, ca = Math.cos(c.th), sa = Math.sin(c.th), u = dx * ca + dz * sa, v = -dx * sa + dz * ca; if (Math.abs(u) < 2.95 && Math.abs(v) < 1.25) return false; }
    for (const p of this.solid) if ((x - p.x) ** 2 + (z - p.z) ** 2 < 1.4) return false;
    return true;
  }
  /** the people in full detail, eased out of your way like the crowd (CrowdLife.push) -> how hard */
  _pushHQ(x, z, r) {
    let hard = 0;
    for (const p of this.hq) {
      const dx = p.x - x, dz = p.z - z, d = Math.hypot(dx, dz); if (d >= r) continue;
      const k = Math.min(0.05, (r - d) * 0.3), nx = p.x + (d > 1e-3 ? dx / d : 1) * k, nz = p.z + (d > 1e-3 ? dz / d : 0) * k;
      if (!this.cars.some((c) => { const ex = nx - c.x, ez = nz - c.z, ca = Math.cos(c.th), sa = Math.sin(c.th); return Math.abs(ex * ca + ez * sa) < 3.0 && Math.abs(-ex * sa + ez * ca) < 1.2; })) { p.y += TERRAIN.at(nx, nz) - TERRAIN.at(p.x, p.z); p.x = nx; p.z = nz; }   // (still on the ground)
      hard = Math.max(hard, (r - d) / r);
    }
    return hard;
  }
  /** what you are looking at, close enough to use: a person, the memorial, your car */
  _target() {
    const p = this.pos, fx = Math.cos(this.yaw), fz = Math.sin(this.yaw); let best = null, bs = -1;
    const consider = (o, at, reach) => { const dx = at.x - p.x, dz = at.z - p.z, d = Math.hypot(dx, dz); if (d > reach) return; const dot = (dx * fx + dz * fz) / Math.max(1e-3, d); if (dot < 0.72) return; const s = dot - d * 0.05; if (s > bs) { bs = s; best = o; } };
    for (const n of this.npcs) consider({ npc: n }, n.person.group.position, 2.6);
    if (this.pre.mem && !this.respected) consider({ memorial: true }, this.pre.mem.c0, 3.2);
    consider({ car: true }, new THREE.Vector3(this.player.x, 0, this.player.z), 3.4);
    return best;
  }
  _interact() {
    const t = this._target(); if (!t) return;
    if (t.car) { this.end(); return; }
    if (t.memorial) { this._payRespects(); return; }
    if (t.npc) { if (t.npc.talked) { this._toast(`${t.npc.name} has said all they want to say.`, ''); return; } this._open(t.npc); }
  }

  // ---- the memorial ------------------------------------------------------------------------------------------------
  _payRespects() {
    this.respected = true; const M = this.pre.memorial || [], R = this.el.querySelector('.respect');
    try { document.exitPointerLock?.(); } catch (_) { /* */ }
    R.querySelector('.n').textContent = M.map((m) => m.name).join(' · ');
    R.querySelector('.s').textContent = M.map((m) => `#${m.number ?? ''} · ${m.team || ''}`).join('   ');
    this.respect = { t: 0, pitch0: this.pitch, yaw0: this.yaw, c0: this.pre.mem.c0 };
    R.classList.add('in'); this.strings?.(true); this.pre.crowd?.to?.(0.05, 2);
  }

  // ---- a shove, and what it can turn into ------------------------------------------------------------------------------
  /** how far n stands from you, flat -> m */
  _dist(n) { const g = n.person.group.position; return Math.hypot(g.x - this.pos.x, g.z - this.pos.z); }
  /** whether a shove at driver n is on (ui/WalkFx.js canJab: never on a memorial weekend, nor at a driver back from injury, nor once the officials are watching) -> { ok, why } */
  _canShove(n) {
    if (!n || n.kind !== 'driver' || n.brawl) return { ok: false, why: '' };
    // (without WalkFx the plain rules: no memorial weekend, no second scuffle, three shoves at most)
    return wfx('canJab', this, n) || { ok: !this.x.L && !this.brawled && (n.jabbed || 0) < 3, why: '' };
  }
  /** the F prompt: a driver close enough to shove (1.8 m), and a shove on -> bool */
  _shoveable(n) { return !!n && n.kind === 'driver' && this._dist(n) <= 1.8 && !!this._canShove(n).ok; }
  /** F: a shove at the driver you are looking at, close enough */
  _shoveKey() { const t = this._target(); if (t?.npc?.kind === 'driver' && this._dist(t.npc) <= 1.8) this._jab(t.npc); }
  /** a shove at n (F, or a talk that ends in one), if it is on: he takes it his way (ui/Brawl.js Jab), then it costs what it costs -> started */
  _jab(n) {
    if (!n || this.done || this.brawl || this.talk || this.respect || n.kind !== 'driver') return false;
    const ok = this._canShove(n); if (!ok.ok) { if (ok.why) this._toast(ok.why, ''); return false; }
    let J = null;
    try { J = new Jab({ walk: this, npc: n, onDone: (out) => this._jabDone(J, n, out) }); } catch (e) { console.warn('GridWalk: no shove', e); this._unclaim(n); return false; }
    this._act(J); return true;
  }
  /** a scuffle with n (started: you began it, with a jab he squared up to; false: he came over and shoved you) -> started */
  _brawl(n, started) {
    let B = null;
    try { B = new Brawl({ walk: this, npc: n, qte: this.player.form?.qte || 1, started, onDone: (out) => this._brawlDone(B, n, out) }); } catch (e) { console.warn('GridWalk: no scuffle', e); this._unclaim(n); return false; }
    this._act(B); return true;
  }
  /** a shove or a scuffle that never got going: he is the walk's again (his head and his facing), unless a jab still holds him */
  _unclaim(n) { if (n?.brawl && !n._brawlKit) { n.brawl = false; if (n.person) n.person.busy = false; } }
  /** the jab played out: squared up to, the scuffle takes it on (his squared-up body and your arms go with it, so it starts before the jab is let go); otherwise what it comes to */
  _jabDone(J, n, out) {
    if (out?.reaction === 'square' && !this.done && this._brawl(n, true)) { this._actOff(J); return; }
    // (a scuffle that would not start: his squared-up body goes back to the jab, whose dispose puts him back as he was)
    if (J?.handed && !J.handed.gone && !n._brawlKit) n._brawlKit = J.handed;
    this._actOff(J);
    wfx('jabFx', this, n, out?.reaction === 'square' ? 'glare' : out?.reaction || 'glare');
    wfx('refreshForm', this);
  }
  /** the scuffle over: what it comes to (penalty points, rapport, the papers: ui/WalkFx.js), kept for the race and the interview (walk.brawled) */
  _brawlDone(B, n, out) {
    this._actOff(B);
    const b = wfx('brawlFx', this, n, out || {});
    if (b) { if (out?.walkedAway && b.walkedAway == null) b.walkedAway = true; this.brawled = b; }
    // (the talk afterwards knows of it - walking away from one too, though nothing came of it)
    if (b || out?.walkedAway) this.x.brawled = b || { did: n.did || null, name: n.name, walkedAway: true, started: false };
    wfx('refreshForm', this);
  }
  /** a shove or a scuffle takes the walk over: the camera and the keys are its own, the prompt, the tags and the help go */
  _act(a) {
    this.brawl = a; this.keys.clear(); this.drag = false;
    this.el.querySelector('.prompt').classList.remove('in'); this.el.querySelector('.help').style.opacity = 0;
    for (const tag of this.tags) tag.style.opacity = 0;
  }
  /** an action over (or failed): let go of it, and the walk has the camera back */
  _actOff(a) { if (this.brawl === a) this.brawl = null; try { a?.dispose(); } catch (e) { console.warn('GridWalk: dispose', e); } }
  /** a frame of it (it moves the eye, the people in it and your arms) */
  _actUpdate(dt) {
    const a = this.brawl;
    try { a.update(dt); } catch (e) { console.warn('GridWalk: the scuffle stopped', e); this._actOff(a); return; }
    // (over without a word back - it should never be: the walk carries on regardless)
    if (this.brawl === a && a.done) this._actOff(a);
  }
  /** a shove at npc, for tests (window.__F1.walk.jab(n)): the nearest driver if none is given -> started */
  jab(npc = null) {
    const n = npc || this.npcs.filter((m) => m.kind === 'driver').sort((p, q) => this._dist(p) - this._dist(q))[0];
    return this._jab(n);
  }

  // ---- talking -----------------------------------------------------------------------------------------------------
  _topics(n) {
    const x = this.x, others = this.cars.filter((c) => c !== this.player && c !== n.car);
    x.X = others.length ? pick(others.filter((c) => Math.abs((c.gridPos || 0) - (this.player.gridPos || 0)) <= 4).concat(others.slice(0, 3))) : null;
    const W = [], star = n.kind === 'star', quiet = star && (!!x.L || !!n.grieving);
    // (a star you have only just met, or barely know, also asks what any guest asks - less often than her own; never on
    // a quiet day, nor once there is more between you)
    const casual = star && !quiet && ['stranger', 'met', 'friendly'].includes(n.stage || 'stranger');
    if (x.L) W.push([T.mourn, n.kind === 'eng' ? 1 : 4, 'mourn']);
    switch (n.kind) {
      case 'driver': W.push([T.race, 2]); if (n.mate) W.push([T.mate, 3]); if (n.car && Math.abs((n.car.gridPos || 0) - (this.player.gridPos || 0)) <= 2) W.push([T.rival, 2]); if (x.gapTo && n.did) W.push([T.title, 1]); if (x.X) W.push([T.gossip, 1.5]); break;
      case 'boss': case 'eng': W.push([T.race, 3]); break;
      case 'mech': W.push([T.race, 2]); if (x.X) W.push([T.gossip, 1]); break;
      case 'press': W.push([T.race, 3]); break;
      case 'celeb': W.push([T.celeb, 3]); break;
      case 'star': if (casual) W.push([T.celeb, 1]); break;
    }
    // (and everything else people talk about on a grid: GridTalk.js - a star as a guest, now and then)
    const as = star ? (casual ? 'celeb' : null) : n.kind, k = star ? 0.4 : 1;
    if (as) for (const def of [...Object.values(TOPICS), ...Object.values(TOPICS2), ...Object.values(TOPICS3)]) if (def.who.includes(as) && (!def.when || def.when(x, n)) && !(def === TOPICS.mateTalk && n.mate)) W.push([(xx, nn) => buildTopic(def, xx, nn), def.w * k]);
    // (and the driver-life update's, GridTalk4.js: the stars' own - only her quiet ones on a quiet day - the drivers
    // with a score to settle, the crew and the press on the week's stories)
    for (const def of TOPICS4) if (def.who.includes(n.kind) && (!def.when || def.when(x, n))) W.push([(xx, nn) => buildTopic(def, xx, nn), def.w, def.id]);
    if (!W.length) W.push([quiet ? T.quiet : T.celeb, 1, quiet ? 'quiet' : null]);
    // (a star talks as who she is (career/Persona.js): her personality's conversations, opening in the mood you left her
    //  in - except on a quiet day, as an ex, or now and then when there is something to do: ask her out, your partner's
    //  good luck before the start)
    if (star && !quiet && n.stage !== 'ex' && n.celebId) {
      const does = W.filter((w) => w[2] && TOPICS4.some((d) => d.id === w[2] && JSON.stringify(d.opts || []).match(/askout|partner/)));
      if (!(does.length && Math.random() < 0.3)) {
        try { const t = personaTalk(this.career || (this._pc || (this._pc = {})), 'c:' + n.celebId,   /* (a quick race: her moods for this walk only) */ { where: 'grid', T: { name: n.name, job: n.job, venue: 'the grid', track: x.trackName } }); if (t) return t; } catch (e) { console.warn('GridWalk: the personality talk failed', e); }
      } else W.splice(0, W.length, ...does);
    }
    let r = Math.random() * W.reduce((s, w) => s + w[1], 0);
    // (each tree knows which topic it is: ui/WalkFx.js reads it - a T.mourn tree is never news)
    const tree = (f, id) => { const t = f(x, n); if (t && id && !t.id) t.id = id; return t; };
    for (const [f, w, id] of W) { r -= w; if (r <= 0) return tree(f, id); }
    return tree(W[0][0], W[0][2]);
  }
  _open(n) {
    try { document.exitPointerLock?.(); } catch (_) { /* */ }
    this.keys.clear();
    const tree = this._topics(n);
    const greet = n.kind === 'driver' && n.mood <= -2 ? pick([`Oh. You.`, `Make it quick.`, `What do you want?`]) : n.kind === 'driver' && n.mood >= 2 ? pick([`Hey!`, `There you are.`, `${first(this.player.name)}!`]) : '';
    this.talk = { n, step: 0, queue: [], opts: null, typed: 0, line: null, hold: 0, dm: 0, fx: [], topic: tree.id || null, mourn: tree.id === 'mourn', tree, ptones: [] };
    this._queue([greet ? `${greet} ${tree.say}` : tree.say], tree.opts);
    const P = this.el.querySelector('.talk'); P.querySelector('.who').innerHTML = `${esc(n.name)}<small>${esc(n.role)}</small>`; P.classList.add('in');
    this.el.querySelector('.prompt').classList.remove('in');
  }
  _queue(lines, opts) { const T0 = this.talk; T0.queue = lines.filter((l) => l != null && l !== ''); T0.after = opts; T0.opts = null; this.el.querySelector('.opts').innerHTML = ''; this._nextLine(); }
  _nextLine() {
    const T0 = this.talk, L = this.el.querySelector('.line'), nx = this.el.querySelector('.next');
    if (T0.queue.length) { T0.line = T0.queue.shift(); T0.typed = 0; T0.hold = 0; L.classList.toggle('me', T0.line.startsWith('› ')); L.textContent = ''; nx.textContent = ''; return; }
    T0.line = null;
    if (T0.after) this._showOpts(T0.after);
    else this._offerLeave();
  }
  _showOpts(opts) {
    const T0 = this.talk; T0.opts = opts; const box = this.el.querySelector('.opts'); box.innerHTML = '';
    opts.forEach((o, i) => {
      const b = document.createElement('button'); b.dataset.tone = o.tone; b.innerHTML = `<b>${i + 1}</b><span>${esc(o.t)}</span><i>${TAG[o.tone] || ''}</i>`;
      b.addEventListener('click', () => this._choose(i)); box.appendChild(b); setTimeout(() => b.classList.add('in'), 60 + i * 70);
    });
    this.el.querySelector('.next').textContent = '';
  }
  _advance() {
    const T0 = this.talk; if (!T0) return;
    if (T0.line) { if (T0.typed < T0.line.length) T0.typed = T0.line.length; else this._nextLine(); return; }
  }
  /** the talk is over: a Leave button (or click anywhere, E, Esc, Enter) */
  _offerLeave() {
    const T0 = this.talk; if (!T0 || T0.closing) return; T0.closing = true;
    this.el.querySelector('.next').textContent = '';
    const box = this.el.querySelector('.opts'); box.innerHTML = '';
    const b = document.createElement('button'); b.dataset.tone = 'leave'; b.innerHTML = '<b>▸</b><span>Leave</span><i>CLICK · E · ESC</i>';
    b.addEventListener('click', () => this._leave()); box.appendChild(b); setTimeout(() => b.classList.add('in'), 30);
  }
  /** away from them, and the mouse locked for looking again (a click or a key press is what lets the browser do that) */
  _leave() {
    if (!this.talk) return; this._close(); this.el.querySelector('.opts').innerHTML = '';
    try { const r = this.canvas.requestPointerLock?.(); r?.catch?.(() => {}); } catch (_) { /* (refused in a frame: dragging still looks) */ }
  }
  _choose(i) {
    const T0 = this.talk; if (!T0 || !T0.opts) return; const o = T0.opts[i]; if (!o) return;
    const n = T0.n, x = this.x;
    T0.opts = null; this.el.querySelector('.opts').innerHTML = '';
    const dm = o.m ?? TONE[o.tone] ?? 0; n.mood += dm; T0.dm += dm;
    // (every tone chosen, [actions] too: how a star takes a whole conversation, ui/WalkFx.js)
    (T0.tones || (T0.tones = [])).push(AS_WALK[o.tone] || o.tone);
    if (T0.tree?.persona) T0.ptones.push(o.tone);
    if (!o.t.startsWith('[')) (T0.said || (T0.said = [])).push({ t: o.t, tone: o.tone });
    // reactions with a mind of their own: gossip (who they are), the dead (everyone hears of it)
    let r = o.r;
    if (o.tone === 'gossip' && o.fx?.about) {
      const X = o.fx.about, who = n.kind === 'driver' ? (n.car && n.car.team === X.team ? 'mate' : n.persona) : n.kind;
      r = pick(GOSSIP_R[who] || GOSSIP_R.decent).replace(/\{X\}/g, last(X.name));
      const dmg = { stirrer: 1, decent: -2, mate: -4, boss: -1, press: 0, celeb: 0, star: 0, mech: 1, eng: -1 }[who] ?? 0; n.mood += dmg; T0.dm += dmg;
      if (Math.random() < (LEAK[who] ?? 0.3)) T0.fx.push({ leak: X, line: o.t });
    }
    if (o.fx) T0.fx.push({ ...o.fx, line: o.t, tone: o.tone });
    // a talk that ends in a shove ('[Give him a shove]'): it is over, and the shove is next (if it is on)
    if (o.fx?.jab) {
      T0.jab = true; this._close();
      try { const p = this.canvas.requestPointerLock?.(); p?.catch?.(() => {}); } catch (_) { /* (refused in a frame: dragging still looks) */ }
      this._jab(n); return;
    }
    const lines = o.t.startsWith('[') ? [] : [`› ${o.t}`];
    if (r) lines.push(r);
    if (o.end) { n.offended = true; this._queue(lines, null); T0.step = 2; return; }
    if (T0.step === 0 && o.then) {
      T0.step = 1;
      let opts = o.then.opts.slice();
      // and a chance to turn it to someone else, behind their back (not straight after an apology for being cruel)
      if (x.X && !T0.tree?.persona && n.kind !== 'press' && o.tone !== 'cruel' && opts.length < 4 && !(n.car && n.car === x.X) && !(n.kind === 'star' && (x.L || n.grieving))) opts.push({ t: x.trash(x.X), tone: 'gossip', fx: { about: x.X } });
      lines.push(o.then.say); this._queue(lines, opts); return;
    }
    T0.step = 2;
    if (T0.tree?.persona) this._farewell(n); else lines.push(this._farewell(n));   // (a personality talk's last reaction is its goodbye)
    this._queue(lines, null);
  }
  _farewell(n) {
    if (n.mood - n.mood0 <= -5) n.offended = true;
    if (n.kind === 'star') {
      // (a star's goodbye goes by how things stand with her: quiet on a quiet day)
      const d = n.mood - n.mood0, F4 = FAREWELL4, st = n.stage || 'stranger';
      return pick(this.x.L || n.grieving ? F4.quiet : st === 'ex' ? F4.ex : d < 0 ? F4.cold : st === 'partner' || st === 'dating' ? F4.partner : d >= 3 ? F4.warm : F4.star);
    }
    if (n.kind === 'celeb' && n.mood >= n.mood0) return pick(FAREWELL.celeb);
    if (n.kind === 'press' && n.mood >= n.mood0 - 1) return pick(FAREWELL.press);
    const d = n.mood - n.mood0;
    return pick(d >= 3 ? FAREWELL.good : d >= 0 ? FAREWELL.ok : d > -5 ? FAREWELL.bad : FAREWELL.awful);
  }
  _close() {
    const T0 = this.talk; if (!T0) return; const n = T0.n; this.talk = null; n.talked = true;
    this.el.querySelector('.talk').classList.remove('in');
    if (T0.tree?.done && T0.ptones?.length) { try { T0.tree.done(T0.ptones); } catch (e) { console.warn('GridWalk: the mood could not be kept', e); } }   // (where you steered it: how she opens next time - here, at a party, on the phone)
    this._consequences(n, T0);
    if (n.offended) n.turn = n.face0 + Math.PI;   // (their back to you)
    const i = this.npcs.indexOf(n); this.tags[i]?.classList.add('done');
  }
  /** what it all comes to: rapport, the news, word getting round (a career); a note of it either way */
  _consequences(n, T0) {
    const C = this.career, me = this.player, dm = T0.dm;
    const undo = T0.fx.some((f) => f.undo), dead = T0.fx.some((f) => f.dead);
    // the race ahead: a driver you have just insulted (or who has heard what you said) is out to get you - today
    const feud = (car, k, why) => { if (!car || car === me || k <= 0) return; const was = car.feud || 0; car.feud = Math.min(1, Math.max(was, k)); if (car.feud >= 0.35 && car.feud > was + 0.15) this._toast(`${car.name} will be gunning for you today`, 'down'); if (C && why && car.feud >= 0.5 && was < 0.5) C.addNews?.(`${car.name} on the grid: ${why}`); };
    if (n.kind === 'driver' && dm < 0) feud(n.car, Math.min(1, -dm / 6) * (undo ? 0.5 : 1), dead ? `furious at ${me.name}'s words about ${this.x.L?.name}.` : `not happy with ${me.name}. Expect fireworks.`);
    for (const f of T0.fx) { if (f.leak) feud(f.leak, 0.6, `heard what ${me.name} said about them.`); if (f.press && f.about && f.tone === 'cruel') feud(f.about, 0.7, `will have read ${me.name}'s comments by the start.`); }
    if (dead && !undo) for (const c of this.cars) if (c !== me) feud(c, 0.3, null);
    // (how a star took it - in a career, on your own driver's ordinary weekend - is ui/WalkFx.js's to say, below)
    const hers = n.kind === 'star' && !!C && (me.careerId || C.playerId) === C.playerId && !this.x.L && !this.pre.mem && typeof WalkFx.talkFx === 'function';
    if (n.kind === 'driver') {
      // (what lasts in the career is smaller than the anger today: the race is where it comes out)
      const delta = Math.max(-10, Math.min(10, Math.round(dm < 0 ? dm * 1.2 : dm * 2.5)));
      if (C && n.did && delta) C.relate(n.did, delta, dead ? `appalled by what you said about ${this.x.L?.name} on the grid` : delta < 0 ? 'fell out with you on the grid before the start' : 'got on well with you on the grid');
      if (delta) this._toast(`${n.name} · ${delta > 0 ? 'rapport +' + delta : 'rapport ' + delta}`, delta > 0 ? 'up' : 'down');
    } else if (dm >= 3 && !hers) this._toast(`${n.name} warmed to you`, 'up');
    else if (dm <= -3 && !hers) this._toast(`${n.name} won't forget that`, 'down');
    for (const f of T0.fx) {
      if (f.press && f.line && !f.line.startsWith('[')) {
        if (C) C.addNews?.(`${OUTLET}: "${f.line}" - ${me.name}, on the grid.`);
        this._toast(`Quoted in ${OUTLET}`, f.tone === 'cruel' ? 'down' : '');
        if (f.about && C && f.about.careerId) C.relate(f.about.careerId, f.nice ? 3 : f.tone === 'cruel' ? -4 : 0, f.tone === 'cruel' ? 'read what you told the press about them' : null);
        if (f.about && f.tone === 'cruel') this._toast(`${f.about.name} will read that`, 'down');
      }
      if (f.leak) {
        if (C && f.leak.careerId) C.relate(f.leak.careerId, -4, 'heard what you said behind their back on the grid');
        this._toast(`Word may get back to ${f.leak.name}`, 'down');
      }
    }
    if (dead && !undo && !this.deadCruel) {
      this.deadCruel = true;
      if (C) { for (const id of Object.keys(C.rapport || {})) if (id !== n.did) C.relate(id, -3, null); C.addNews?.(`Word went round the paddock about what ${me.name} said about ${this.x.L?.name} before the start.`); }
      this._toast(`The paddock will hear about this`, 'down');
    }
    this._onCamera(n, T0);
    // (and what else it comes to - a star's view of you, the papers, morale, a friendship: ui/WalkFx.js, which keeps
    // to the memorial's rules)
    wfx('talkFx', this, n, T0);
    if (C) C.save?.();
  }
  /** the TV crews following you heard it: the news has it (a career's news tab), a note on screen either way */
  _onCamera(n, T0) {
    const cams = this.life?.watchers?.() || [], P = this.pos;
    T0.onCamera = cams.some((p) => (p.x - P.x) ** 2 + (p.z - P.z) ** 2 < 14 * 14) && !!T0.said?.length;   // (for ui/WalkFx.js: what the cameras caught is what the papers have)
    if (!T0.onCamera) return;
    // (no TV line of a talk with a star: what the cameras saw of you and her is ui/WalkFx.js's, and the papers', to tell)
    if (n.kind === 'star') { this._toast('The cameras caught that', ''); return; }
    const C = this.career, me = this.player.name, who = n.kind === 'driver' ? n.name : n.kind === 'boss' ? `the ${this.player.team} team principal` : n.kind === 'eng' ? 'their race engineer' : n.kind === 'mech' ? 'a mechanic' : n.kind === 'press' ? OUTLET : n.name;
    const worst = T0.said.find((s) => s.tone === 'cruel') || T0.said.find((s) => s.tone === 'gossip') || T0.said.find((s) => s.tone === 'kind') || T0.said[0];
    const q = `"${worst.t}"`, dead = T0.fx.some((f) => f.dead);
    const line = dead ? `Broadcast cameras caught ${me}'s words about ${this.x.L?.name} on the grid: ${q}. The clip has drawn outrage.`
      : worst.tone === 'cruel' ? pick([`Caught on camera on the grid: ${me} to ${who}, ${q}. The clip is everywhere.`, `The grid walk cameras picked up ${me} snapping at ${who}: ${q}.`, `${me} and ${who}: a frosty exchange on the grid, cameras rolling. ${q}`])
      : worst.tone === 'gossip' ? pick([`Overheard on the grid, live on air: ${me} to ${who} - ${q}.`, `A grid-walk microphone caught ${me} talking behind a rival's back: ${q}.`])
      : worst.tone === 'kind' ? pick([`On the grid: ${me} and ${who} share a moment before the start.`, `The cameras caught a warm exchange between ${me} and ${who} on the grid.`])
      : worst.tone === 'light' ? pick([`Laughter on the grid: ${me} and ${who}, cameras rolling. ${q}`, `${me} in good spirits on the grid with ${who}: ${q}`])
      : pick([`${me} spoke to ${who} on the grid, cameras close by. ${q}`, `On camera on the grid: ${me} with ${who}. ${q}`]);
    if (C) C.addNews?.(`TV: ${line}`);
    this._toast(worst.tone === 'cruel' || worst.tone === 'gossip' || dead ? 'Caught on camera - it will be on the news' : 'The cameras caught that', worst.tone === 'cruel' || dead ? 'down' : '');
  }
  _toast(text, cls) {
    const box = this.el.querySelector('.toasts'), d = document.createElement('div'); d.className = `toast ${cls || ''}`; d.textContent = text; box.appendChild(d);
    setTimeout(() => d.remove(), 5600);
  }

  // =================================================================================================================
  update(dt) {
    if (this.done) return;
    this.t += dt; const cam = this.camera;
    this.pre.idle?.(dt, (this.pre.t || 0) + this.t);   // (the grid carries on round you)
    this.life?.follow?.(this.pos, 3, 32);   // (a few of the TV crews and photographers turn to follow you about)
    // the clock to the formation lap (it waits while you talk, at the memorial, and in a scuffle)
    if (!this.talk && !this.respect && !this.brawl) this.left -= dt;
    const m = Math.max(0, Math.ceil(this.left)); this.el.querySelector('.clock').textContent = `FORMATION LAP IN ${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
    if (this.left <= 0) { this.end(); return; }
    this.el.querySelector('.help').style.opacity = this.talk || this.respect || this.brawl ? 0 : this.t > 9 ? 0.35 : 1;
    // the people: heads nodding along as they talk, turning to you to talk, away if you've offended them (not anyone
    // in a shove or a scuffle: ui/Brawl.js has their heads and their facing)
    for (const n of this.npcs) {
      if (n.brawl) continue;
      const g = n.person.group, talking = this.talk?.n === n;
      let want = n.turn ?? n.face0;
      if (talking) want = facing(this.pos.x - g.position.x, this.pos.z - g.position.z);
      let d = want - g.rotation.y; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; g.rotation.y += d * Math.min(1, dt * 4);
      const h = n.person.head; if (h) h.rotation.z = n.person.bow + (talking && this.talk.line && this.talk.typed < this.talk.line.length && !this.talk.line.startsWith('›') ? 0.05 * Math.sin(this.t * 9) : 0) + (n.offended ? 0.12 : 0);
    }
    // a shove or a scuffle playing: it has the eye, the people in it and your arms (and leaves pos, yaw and pitch
    // where it ends, so the walk carries on from there without a jump)
    if (this.brawl) { this._actUpdate(dt); this.look.copy(cam.position); return; }
    if (this.respect) this._respectUpdate(dt);
    else if (this.talk) {
      // the camera turns to them; their line types out
      const T0 = this.talk, hp = new THREE.Vector3(); (T0.n.person.head || T0.n.person.group).getWorldPosition(hp); hp.y -= 0.32 + this.groundAt(this.pos.x, this.pos.z);   // (their face in the upper part of the frame, over the talk; on the flat, as the eye sees it from the ground you are on)
      const dx = hp.x - this.pos.x, dz = hp.z - this.pos.z, wy = Math.atan2(dz, dx), wp = Math.atan2(hp.y - this.pos.y, Math.hypot(dx, dz));
      let d = wy - this.yaw; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; this.yaw += d * Math.min(1, dt * 5); this.pitch += (wp - this.pitch) * Math.min(1, dt * 5);
      if (T0.line) {
        T0.typed = Math.min(T0.line.length, T0.typed + dt * (T0.line.startsWith('›') ? 90 : 42));
        this.el.querySelector('.line').textContent = T0.line.slice(0, Math.floor(T0.typed)).replace(/^› /, '');
        if (T0.typed >= T0.line.length) { T0.hold += dt; if (T0.hold > (T0.line.startsWith('›') ? 0.7 : 0.4 + T0.line.length / 60) && (T0.queue.length || T0.after)) this._nextLine(); }
        if (T0.line && T0.typed >= T0.line.length && !T0.queue.length && !T0.after && T0.hold > 0.2) this._offerLeave();
      }
    } else {
      // walking
      const k = this.keys, fx = Math.cos(this.yaw), fz = Math.sin(this.yaw);
      if (k.has('ArrowLeft')) this.yaw -= dt * 1.8; if (k.has('ArrowRight')) this.yaw += dt * 1.8;
      let mf = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0), ms = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
      const sp = (k.has('ShiftLeft') || k.has('ShiftRight') ? 3.4 : 1.6) * dt, len = Math.hypot(mf, ms) || 1;
      let vx = (fx * mf - fz * ms) / len * sp, vz = (fz * mf + fx * ms) / len * sp;
      if (mf || ms) {
        // people in the way are eased aside (and you slow as you squeeze through)
        const hard = Math.max(this.life?.push(this.pos.x + vx * 4, this.pos.z + vz * 4, 0.55) || 0, this._pushHQ(this.pos.x + vx * 4, this.pos.z + vz * 4, 0.55));
        const slow = 1 - 0.55 * hard; vx *= slow; vz *= slow;
        if (this._free(this.pos.x + vx, this.pos.z)) this.pos.x += vx;
        if (this._free(this.pos.x, this.pos.z + vz)) this.pos.z += vz;
        this.bob = (this.bob || 0) + sp * 5.2;
      }
      const tg = this._target(), pr = this.el.querySelector('.prompt');
      if (tg) {
        const sh = tg.npc && this._shoveable(tg.npc) ? `<span class="alt"><kbd>F</kbd>Shove</span>` : '';
        pr.innerHTML = tg.car ? `<kbd>E</kbd>Get in the car<small>Start the race</small>` : tg.memorial ? `<kbd>E</kbd>Pay your respects<small>${esc((this.pre.memorial || []).map((m) => m.name).join(' · '))}</small>` : tg.npc.talked ? `${esc(tg.npc.name)}${sh}<small>${tg.npc.offended ? 'Has turned their back on you' : 'Has moved on'}</small>` : `<kbd>E</kbd>Talk to ${esc(tg.npc.name)}${sh}<small>${esc(tg.npc.role)}</small>`;
        pr.classList.add('in');
      } else pr.classList.remove('in');
      // (now and then a driver with a score to settle comes over to settle it - who, and whether, is ui/WalkFx.js's
      // call: once a walk at most, never on a memorial weekend)
      if (this.t > 6 && (this.aiT += dt) >= 3) { this.aiT = 0; const s = wfx('aiShover', this); if (s?.person && !s.brawl) this._brawl(s, false); }
    }
    // the eye
    const by = Math.sin(this.bob || 0) * 0.025;
    cam.position.set(this.pos.x, this.pos.y + by - (this.respect ? this.respect.dip || 0 : 0), this.pos.z);
    const cp = Math.cos(this.pitch); cam.up.set(0, 1, 0);
    cam.lookAt(cam.position.x + Math.cos(this.yaw) * cp, cam.position.y + Math.sin(this.pitch), cam.position.z + Math.sin(this.yaw) * cp);
    this.look.copy(cam.position);
    // the name tags over the people you can talk to (where they are, on the flat the eye is placed on)
    const W = innerWidth, H = innerHeight, v = new THREE.Vector3(), gy = this.groundAt(cam.position.x, cam.position.z);
    this.npcs.forEach((n, i) => {
      const tag = this.tags[i]; (n.person.head || n.person.group).getWorldPosition(v); v.y += 0.38 - gy;
      const dist = v.distanceTo(cam.position); v.project(cam);
      const show = !this.talk && !this.respect && !this.brawl && v.z < 1 && dist < 14 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
      tag.style.opacity = show ? Math.min(1, (14 - dist) / 5) * (n.talked ? 0.55 : 1) : 0;
      if (show) { tag.style.left = `${(v.x * 0.5 + 0.5) * W}px`; tag.style.top = `${(-v.y * 0.5 + 0.5) * H}px`; }
    });
  }
  /** the ground at (x, z) - what the people stand on (ui/Brawl.js too: him and the people pulling you apart) */
  groundAt(x, z) { return TERRAIN.at(x, z); }
  _respectUpdate(dt) {
    const R = this.respect; R.t += dt;
    // to the memorial, head bowed, a long moment, then up again
    const c0 = R.c0, dx = c0.x - this.pos.x, dz = c0.z - this.pos.z, wy = Math.atan2(dz, dx);
    let d = wy - this.yaw; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; this.yaw += d * Math.min(1, dt * 2);
    const bow = R.t < 6.5 ? Math.min(1, R.t / 2.5) : Math.max(0, 1 - (R.t - 6.5) / 1.5);
    this.pitch += ((-0.28 - 0.25 * bow) - this.pitch) * Math.min(1, dt * 2); R.dip = 0.12 * bow;
    if (R.t > 6.5 && !R.out) { R.out = true; this.el.querySelector('.respect').classList.remove('in'); this.strings?.(false); this.pre.crowd?.to?.(0.32, 3); }
    if (R.t > 8) {
      this.respect = null;
      for (const n of this.npcs) if (n.kind === 'driver' && !n.talked) n.mood += 1;
      // (a quiet moment that steadies you: ui/WalkFx.js - no story made of it)
      wfx('respectFx', this);
      if (this.career) { this.career.addNews?.(`${this.player.name} stopped at the memorial for ${(this.pre.memorial || []).map((m) => m.name).join(' and ')} before the start.`); this.career.save?.(); }
      this._toast('The grid saw you stop', 'up');
    }
  }

  /** to the car (or the clock ran out) - not in the middle of a shove or a scuffle */
  end() {
    if (this.done || this.brawl) return; this.done = true;
    this.el.querySelector('.black').style.opacity = 1;
    if (this.respect) this.strings?.(false);
    // (the race reads the cars' form as the walk leaves it: ui/WalkFx.js brings it up to date first)
    setTimeout(() => { if (this.killed) return; this._teardown(); wfx('refreshForm', this); this.onDone?.(); }, 850);
  }
  /** gone at once, no hand-over (a quit from the menu) */
  kill() { if (this.killed) return; this.done = true; this._teardown(); }
  _teardown() {
    if (this.killed) return; this.killed = true;
    // (a shove or a scuffle cut short: everyone put back, the arms and its overlay gone - no consequences)
    const a = this.brawl; this.brawl = null; try { a?.dispose(); } catch (e) { console.warn('GridWalk: dispose', e); }
    window.removeEventListener('keydown', this._kd, true); window.removeEventListener('keyup', this._ku, true);
    this.canvas.removeEventListener('mousedown', this._md); window.removeEventListener('mouseup', this._mu); window.removeEventListener('mousemove', this._mm);
    try { if (document.pointerLockElement) document.exitPointerLock(); } catch (_) { /* */ }
    this.el.remove();
  }
}
