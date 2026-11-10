// The drama's cutscenes: the board, the row between your drivers, the debrief after an order refused, a rival's approach
// in the paddock, the stewards' hearing, the scrutineering bay, the auditors, a sponsor's call, the leak, the reserve's
// seat fitting, a mechanic's apology, the press. Each is told from what happened (ctx: career/ManagerStory.js) and most
// ask something of you while they run - an answer against the clock, a moment to catch - and end on the decision.
// What an answer is worth is worked out here (the *Outcome functions) so the scene and the story agree.
import * as SETS from './CineSets.js';
import { paintTable, paintHeadline, paintIncident } from './CineSets.js';
import { drv, staff, suit, say, tween, surname, hd, cu, ots, two, creep, youOpts, seated, P } from './CineScenes.js';

const PI = Math.PI;
const T0 = { name: 'Team', color: '#e10600', color2: '#ffffff' };
const base = (ctx) => ({ T: ctx.T || T0, D: ctx.drivers && ctx.drivers.length ? ctx.drivers : [{ name: 'Driver One', number: 1 }, { name: 'Driver Two', number: 2 }], L: ctx.lines || {} });
const YOU = 'You';

/**
 * The board (20): three meetings as its patience goes - a quiet word, the vote of confidence, the ultimatum. ctx:
 * { stage: 1 | 2 | 3, chair: { name }, table: rows (the constructors', yours lit, the target's line), pos, target,
 *   lines: { open, fact, ask, good, bad, close } }. You answer once (ask 'pitch'): results | invest | own.
 */
export function board(ctx) {
  const { T, L } = base(ctx), st = ctx.stage || 1, ch = ctx.chair?.name || 'The chair';
  return { id: 'board', kicker: `${T.name} · The board`, title: st === 1 ? 'A quiet word' : st === 2 ? 'A vote of confidence' : 'The ultimatum', accent: T.color, bg: '#0b0c10', exposure: 0.95, grade: st === 3 ? 'cold' : 'warm',
    build(k) {
      const A = SETS.boardroom(k, T, { night: st >= 2, screen: paintTable("Constructors' championship", ctx.table || [], T.color, { note: ctx.target ? `TARGET P${ctx.target}` : '' }) });
      const chair = seated(k.person(suit(ch, 'sitLean', { build: 'broad' }), [3.9, 0, 0], -PI / 2)), you = seated(k.person(youOpts(T, 'sit'), [-3.9, 0, 0], PI / 2));
      const m = [0, 1, 2, 3, 4, 5].slice(0, st === 1 ? 2 : 6).map((i) => { const s = A.seats[[2, 3, 6, 7, 4, 5][i]]; const a = seated(k.person(suit(`board${i}`, i % 2 ? 'sit' : 'sitArm', i === 1 || i === 4 ? { figure: 'f', build: 'slim' } : {}), [s[0], 0, s[2]], s[3])); if (a) a.look = { x: -3.9, y: 1.2, z: 0 }; return a; });
      chair.look = { x: -3.9, y: 1.25, z: 0 }; you.look = { x: 3.9, y: 1.25, z: 0 };
      const cC = cu(chair, { ang: 0.3, dist: 2.6, f: 15 }), oY = ots(chair, you, { f: 20, back: 1.1 }), oC = ots(you, chair, { f: 24, back: 1.0, side: -1 });
      const ans = { results: L.aResults || `Judge me on the next three races. ${ctx.target ? `P${ctx.target} is still on.` : ''}`, invest: L.aInvest || 'The car is where the money put it. Back me in the factory and the results follow.', own: L.aOwn || 'It is on me. Not the drivers, not the factory. I will fix it.' };
      const shots = [
        { d: 5, p: [5.2, 2.5, 3.4], l: [0, 0.9, 0], p2: [3.6, 1.9, 3.2], l2: [-1, 1.0, -0.2], f: 30, e: 'io', dof: 0.5, sub: say(ch, L.open || (st === 1 ? 'Thank you for coming up. This will not take long.' : st === 2 ? 'The statement goes out at six. It says you have our full confidence.' : 'We have been patient. I want that understood before I say the rest.')) },
        { d: 4.5, p: [-1.6, 1.75, 0.5], l: [-5.9, 1.95, 0], p2: [-3.0, 1.85, 0.2], f: 26, shake: 0.05, dof: 0.6, sub: say(ch, L.fact || `P${ctx.pos ?? '?'} in the constructors'. We asked for P${ctx.target ?? '?'}.`) },
        { ...creep(cC, 0.1), d: 4, shake: 0.08, low: { name: ch, role: `Chair · ${T.name}` }, sub: say(ch, L.ask || (st === 3 ? 'Two races. Show us this team is going somewhere, or we find someone who can.' : 'So tell us. What changes?')) },
        st < 3 && { ...creep(oY, 0.08), d: 3, shake: 0.12, sub: [], ask: { id: 'pitch', prompt: 'What do you tell the board?', time: 7, def: 'own', options: [{ id: 'results', label: 'Promise results: judge me on the next three races' }, { id: 'invest', label: 'Ask for investment in the factory' }, { id: 'own', label: 'Take it on yourself' }] } },
        st < 3 && { ...creep(oY, 0.1, 0.15), d: 3.5, shake: 0.1, sub: (r) => say(YOU, ans[r.picks.pitch] || ans.own, '#ffffff') },
        st < 3 && { ...creep(cC, 0.14), d: 4, shake: 0.06, on: () => { chair.nod = 0.6; }, sub: (r) => say(ch, r.picks.pitch === 'results' ? (L.rResults || 'Three races. I am writing that down.') : r.picks.pitch === 'invest' ? (L.rInvest || 'You are asking for money while you are behind. Bold. I will take it to the others.') : (L.rOwn || 'That is the first thing anyone has said in this room that I believe.')) },
        st === 3 && { d: 5.5, p: [-2.2, 3.0, 3.5], l: [-3.6, 1.0, 0], p2: [-0.5, 3.2, 3.7], f: 28, e: 'out', dof: 0.3, on: () => { for (const a of m) if (a) a.g.visible = false; chair.g.visible = false; you.look = { x: -6, y: 1.9, z: 0 }; }, sub: say(ch, L.close || 'That is all.') },
        st < 3 && { ...creep(oC, 0.05), d: 3.5, f: 28, shake: 0.05, sub: say(ch, L.close || (st === 2 ? 'You know what a vote of confidence usually means. Prove it wrong.' : 'We will speak again after the summer.')) },
      ];
      return { shots };
    } };
}
/** what the pitch is worth to the board's confidence: a promise buys time and is remembered */
export const boardOutcome = (ctx, r) => ({ pitch: r?.picks?.pitch || 'own', conf: { results: 6, invest: -2, own: 3 }[r?.picks?.pitch || 'own'] ?? 0 });

/**
 * The row (11): your two drivers in the garage after the session, the mechanics pretending not to hear. ctx: { a, b
 * (drivers: a the aggrieved), why, lines: { a1, b1, a2, b2 } }. Asked: step in or let them finish; then the decision:
 * a | b | both.
 */
export function feudRow(ctx) {
  const { T, L } = base(ctx), a = ctx.a || { name: 'Driver One', number: 1 }, b = ctx.b || { name: 'Driver Two', number: 2 };
  return { id: 'feudRow', kicker: `${ctx.track || 'The garage'} · After the flag`, title: `${surname(a.name)} and ${surname(b.name)}`, accent: T.color, bg: '#0d0f14', exposure: 1.0, grade: 'neutral', needsCar: true,
    build(k) {
      k.env(0.5);
      const A = SETS.garage(k, T, { night: ctx.night });
      k.car({ color: T.color, color2: T.color2, team: T.name, livery: T.livery, number: a.number, driver: a.name }, A.car, 0);
      const pa = k.person(drv(a, T, 'gesture'), [-0.75, 0, 3.1], PI / 2), pb = k.person(drv(b, T, 'hips'), [0.75, 0, 3.1], -PI / 2);
      const sa = k.person(drv(a, T, 'shove'), [-0.5, 0, 3.1], PI / 2), sb = k.person(drv(b, T, 'stagger'), [0.6, 0, 3.1], -PI / 2); sa.g.visible = sb.g.visible = false;
      pa.look = { x: 0.75, y: 1.65, z: 3.1 }; pb.look = { x: -0.75, y: 1.65, z: 3.1 }; pa.shake = 0.25;
      const c1 = k.crew({ color: T.color, accent: T.color2, pose: 'wing', work: 1 }, [1.4, 0, 2.3], PI), c2 = k.crew({ color: T.color, accent: T.color2, pose: 'gun', work: 1 }, [-1.3, 0, -0.9], PI / 2), c3 = k.crew({ color: T.color, accent: T.color2, pose: 'stand' }, [3.6, 0, 1.2], -PI / 2), c4 = k.crew({ color: T.color, accent: T.color2, pose: 'carry' }, [-4.6, 0, -1.5], PI / 2);
      c4.walk([[-3.2, 1.6], [-2.2, 2.6]], 1.1, 'stand');
      const eng = k.person(staff(ctx.eng || 'race engineer', T, 'cross'), [-2.4, 0, 1.9], 0.9); eng.look = { x: 0, y: 1.6, z: 3.1 };
      const tw = two(pa, pb, { side: 1, dist: 4.4, f: 22, up: -0.05 });
      const shots = [
        { d: 4.6, p: [5.5, 1.5, 9.5], l: [0, 1.3, 2.5], p2: [3.2, 1.45, 8.2], f: 15, e: 'lin', shake: 0.25, focus: [1.4, 1.0, 2.3], focus2: [0, 1.6, 3.1], sub: say(surname(a.name), L.a1 || 'You saw me. You saw me there and you turned in anyway.', a.color) },
        { ...creep(tw, 0.1, 0.2), d: 3.6, shake: 0.5, sub: say(surname(b.name), L.b1 || 'It was my corner. Look at the data before you start shouting.') },
        { ...creep(cu(pa, { ang: -0.45, dist: 2.0, f: 14 }), 0.1), d: 3.6, shake: 0.4, sub: say(surname(a.name), L.a2 || 'Every weekend it is the same with you.') },
        { ...creep(cu(pb, { ang: 0.45, dist: 2.0, f: 14 }), 0.1), d: 2.6, shake: 0.4, on: () => { pb.shake = 0.3; }, sub: say(surname(b.name), L.b2 || 'Then be faster.'),
          ask: { id: 'step', prompt: 'It is about to boil over', time: 4.5, def: 'let', options: [{ id: 'in', label: 'Step between them' }, { id: 'let', label: 'Let them have it out' }] } },
        { when: (r) => r.picks.step === 'in', d: 4, p: [0, 1.72, 7.6], l: [0, 1.55, 3.1], p2: [0, 1.7, 6.2], f: 28, e: 'out', shake: 0.3, on: () => { pa.look = pb.look = k.cam.position; pa.shake = pb.shake = 0; }, sub: say(YOU, L.youIn || 'Enough. Both of you. Not in front of the crew.', '#ffffff') },
        { when: (r) => r.picks.step !== 'in', ...creep(tw, 0.2, -0.3), d: 3.4, shake: 0.9, on: () => { pa.g.visible = pb.g.visible = false; sa.g.visible = sb.g.visible = true; c3.walk([[1.5, 2.9]], 3.2, 'steady'); c4.walk([[-1.3, 2.9]], 3.2, 'steady'); }, sub: say(ctx.eng || 'Race engineer', L.engLet || 'Hey! Hey! Not in here!'), sfx: (au) => au.play?.('gasp', { gain: 0.5 }) },
        { d: 4.5, p: [-5.6, 3.6, 4.4], l: [0, 1.0, 2.4], p2: [-5.2, 3.3, 3.6], f: 26, shake: 0.06, dof: 0.4, on: () => { sa.g.visible = sb.g.visible = false; pa.g.visible = pb.g.visible = true; pa.at(-2.1, 0, 3.4).face(-6, 4); pb.at(2.3, 0, 3.0).face(6, 2); pa.look = pb.look = null; pa.shake = pb.shake = 0; }, sub: (r) => say(YOU, r.picks.step === 'in' ? (L.endIn || 'They stopped. They have not finished.') : (L.endLet || 'The whole pit lane heard that.'), '#cfd6e4') },
      ];
      return { shots, choice: { prompt: 'Whose side do you take?', options: [{ id: 'a', label: `Back ${surname(a.name)}`, hint: `${surname(b.name)} takes it badly` }, { id: 'b', label: `Back ${surname(b.name)}`, hint: `${surname(a.name)} takes it badly` }, { id: 'both', label: 'Read them both the riot act', hint: 'Neither thanks you; the row cools' }] } };
    } };
}

/**
 * The debrief (12): the driver who would not move over, across your desk. ctx: { d (the driver), order ('swap' |
 * 'hold'), lap, gain (the place he kept), lines: { open, d1, d2 } }. Asked: your tone (calm | hard | wait); the
 * decision: fine | drop (let it go) | warn.
 */
export function debrief(ctx) {
  const { T, L } = base(ctx), d = ctx.d || { name: 'Driver One', number: 1 };
  return { id: 'debrief', kicker: `${T.name} · Sunday night`, title: 'The order he ignored', accent: T.color, bg: '#090a0e', exposure: 0.95, grade: 'warm',
    build(k) {
      const rows = [{ a: `L${ctx.lap || 31}`, b: `"${ctx.order === 'hold' ? 'HOLD POSITION' : 'LET HIM THROUGH'}"`, c: 'PIT WALL', hi: true, col: T.color }, { a: '', b: 'No reply', c: '4.1 s' }, { a: `L${(ctx.lap || 31) + 1}`, b: `"${ctx.order === 'hold' ? 'HOLD. CONFIRM.' : 'SWAP NOW. CONFIRM.'}"`, c: 'PIT WALL', col: T.color }, { a: '', b: L.radio || '"No. I am quicker. Let me race."', c: surname(d.name).toUpperCase().slice(0, 3), hi: true, cc: '#ffd400' }];
      const A = SETS.office(k, T, { cups: ctx.cups || 0, screen: paintTable('Team radio', rows, T.color, { min: 5, note: ctx.track || '' }) });
      const you = seated(k.person(youOpts(T, 'sitLean'), [0, 0, -1.85], 0)), dr = seated(k.person(drv(d, T, 'sitArm', { cap: false }), [-0.7, 0, 0.35], PI));
      you.look = { x: -0.7, y: 1.2, z: 0.35 }; dr.look = { x: 0, y: 1.2, z: -1.85 };
      const oD = ots(you, dr, { f: 22, back: 0.9, side: -1 }), cD = cu(dr, { ang: -0.3, dist: 2.1, f: 15 });
      const reply = { calm: L.rCalm || 'I respect you. I do not respect that call. Both things are true.', hard: L.rHard || 'Shout if you like. I finished ahead, did I not?', wait: L.rWait || '...Fine. It was the wrong moment to ignore you. It was still the right move.' };
      const shots = [
        { d: 4.6, p: [3.2, 1.9, 3.0], l: [0, 1.0, -1], p2: [2.4, 1.6, 2.6], f: 28, e: 'io', dof: 0.5, sub: say(YOU, L.open || `Lap ${ctx.lap || 31}. I gave an order. Talk me through what happened next.`, '#ffffff') },
        { d: 4, p: [-0.4, 1.65, 0.6], l: [-3.9, 1.75, 0.4], p2: [-1.5, 1.7, 0.5], f: 24, shake: 0.05, dof: 0.6, sub: say(surname(d.name), L.d1 || 'I heard it. I was faster. So I raced.') },
        { ...creep(cD, 0.1), d: 3.6, shake: 0.12, low: { name: d.name, role: ctx.traitText || T.name }, sub: say(surname(d.name), L.d2 || 'You hired a racing driver. That is what one does.'),
          ask: { id: 'tone', prompt: 'How do you take it?', time: 6, def: 'wait', options: [{ id: 'calm', label: 'Calmly: explain why the order was given' }, { id: 'hard', label: 'Hard: nobody is bigger than the team' }, { id: 'wait', label: 'Say nothing. Let the silence work' }] } },
        { ...creep(oD, 0.1), d: 3.6, shake: 0.1, on: () => { dr.shake = 0; }, sub: (r) => say(surname(d.name), reply[r.picks.tone] || reply.wait) },
        { d: 4, p: [0.9, 1.5, -3.0], l: [-0.5, 1.15, 0.3], p2: [0.5, 1.45, -3.0], f: 26, shake: 0.06, focus: hd(dr), sub: say(YOU, L.close || 'That is one. There is not a second.', '#ffffff') },
      ];
      return { shots, choice: { prompt: `What do you do about ${surname(d.name)}?`, options: [{ id: 'fine', label: 'Fine him', hint: 'He obeys next time; his morale drops' }, { id: 'drop', label: 'Let it go', hint: 'He is happier; his team-mate is not, and it may happen again' }, { id: 'warn', label: 'A formal warning', hint: 'On the record: a second time costs him the seat' }] } };
    } };
}

/**
 * The approach (13): another team's principal with one of yours at a table in the paddock, seen from across the lane.
 * ctx: { who: { name, role, driver (true: in a race suit) }, rival: { name (the principal), team: { name, color } },
 *   offer (text), lines: { vo, needle, who } }. Asked: walk over or watch; the decision: counter | promise | let.
 */
export function poach(ctx) {
  const { T, L } = base(ctx), who = ctx.who || { name: 'Your driver', role: 'Driver', driver: true }, rv = ctx.rival || { name: 'Rival principal', team: { name: 'Rival', color: '#27f4d2' } };
  return { id: 'poach', kicker: `${ctx.track || 'The paddock'} · Thursday`, title: 'An approach', accent: rv.team.color, bg: '#9fc0e4', fog: [40, 120], fogColor: '#cfe1f2', exposure: 1.0, grade: 'neutral',
    build(k) {
      const A = SETS.paddock(k, T, { other: rv.team }), tb = A.tables[3];
      const rp = k.person({ ...staff(rv.name, rv.team, 'gesture'), color: rv.team.color, teamName: rv.team.name }, [tb[0] + 0.75, 0, tb[1] + 0.1], -PI / 2), wp = k.person(who.driver ? drv(who, T, 'cross') : staff(who.name, T, 'cross'), [tb[0] - 0.75, 0, tb[1] + 0.1], PI / 2);
      const hs1 = k.person({ ...staff(rv.name, rv.team, 'handOut'), color: rv.team.color, teamName: rv.team.name }, [tb[0] + 0.55, 0, tb[1] + 0.9], -PI / 2), hs2 = k.person(who.driver ? drv(who, T, 'handIn') : staff(who.name, T, 'handIn'), [tb[0] - 0.4, 0, tb[1] + 0.9], PI / 2); hs1.g.visible = hs2.g.visible = false;
      rp.look = hd(wp) && { x: tb[0] - 0.75, y: 1.62, z: tb[1] }; wp.look = { x: tb[0] + 0.75, y: 1.62, z: tb[1] }; rp.nod = 0.3;
      const you = k.person(youOpts(T, 'cross'), [-7.5, 0, -2.2], 1.1); you.look = { x: tb[0], y: 1.6, z: tb[1] };
      const far = { p: [-9.6, 1.68, -3.9], l: [tb[0], 1.5, tb[1] + 0.1], f: 9 };
      const shots = [
        { d: 4.8, p: [-16, 2.4, -1.2], l: [0, 1.6, 1.5], p2: [-13, 1.9, -1.6], l2: [tb[0], 1.5, tb[1]], f: 26, e: 'io', dof: 0.5, sub: say(YOU, L.vo || `You notice it because nobody is looking at you. ${rv.team.name}'s table. And one of yours.`, '#cfd6e4') },
        { ...far, p2: [-9.2, 1.68, -4.3], d: 4.2, shake: 0.7, sub: say(rv.name, L.offer || 'I am only saying: when your contract comes up, pick up the phone.', rv.team.color), low: { name: rv.name, role: `Team principal · ${rv.team.name}`, c: rv.team.color } },
        { ...ots(you, wp, { f: 12, back: 0.8 }), d: 3.4, shake: 0.5, on: () => { rp.g.visible = wp.g.visible = false; hs1.g.visible = hs2.g.visible = true; },
          sub: say(YOU, L.see || 'A handshake. In the open. They want it seen.', '#cfd6e4'), ask: { id: 'move', prompt: 'They have not seen you yet', time: 5, def: 'watch', options: [{ id: 'walk', label: 'Walk over' }, { id: 'watch', label: 'Stay where you are' }] } },
        { when: (r) => r.picks.move === 'walk', ...creep(cu(hs1, { ang: -0.7, dist: 2.6, f: 15 }), 0.12), d: 4.2, shake: 0.3, on: () => { hs1.look = hs2.look = k.cam.position; }, sub: say(rv.name, L.needle || `There you are. Relax. We were talking about the weather. It is a lovely day to be at ${rv.team.name}.`, rv.team.color) },
        { when: (r) => r.picks.move !== 'walk', ...far, f: 8, p2: [-9.9, 1.68, -3.6], d: 4, shake: 0.6, on: () => { hs2.look = { x: -9.6, y: 1.68, z: -3 }; }, sub: say(YOU, L.glance || `${surname(who.name)} looks across. Sees you. Looks away first.`, '#cfd6e4') },
        { ...creep(cu(you, { ang: 0.5, dist: 2.4, f: 16 }), 0.1), d: 3.6, shake: 0.15, sub: say(YOU, L.close || `${ctx.offer || 'They can pay more than we do.'} The question is what staying is worth.`, '#cfd6e4') },
      ];
      return { shots, choice: { prompt: `${who.name}: ${rv.team.name} are interested`, options: [{ id: 'counter', label: `Counter-offer${ctx.cost ? ` ($${ctx.cost}M a season more)` : ''}`, hint: 'Money settles it now' }, { id: 'promise', label: 'Make a promise instead', hint: 'Cheaper; kept or broken, it is remembered' }, { id: 'let', label: 'Let them talk', hint: 'Nothing spent; they may be gone at the end of the season' }] } };
    } };
}
export const poachOutcome = (ctx, r) => ({ choice: r?.choice || 'let', seen: r?.picks?.move === 'walk' });

/**
 * The hearing (14): the stewards, the screen, the other team across the floor. ctx: { mine (true: your protest; false:
 * you are protested), rival: { name, team }, inc: { a, b, ca, cb, where, lap }, best ('trace' | 'onboard' | 'radio':
 * what the case turns on - the opening line hints at it), odds (0..1 before your evidence), roll (0..1, drawn by the
 * story), lines }. Asked: your evidence. The verdict is read out: hearingOutcome.
 */
export const hearingOutcome = (ctx, r) => { const pick = r?.picks?.evidence || 'none', odds = Math.max(0.05, Math.min(0.95, (ctx.odds ?? 0.5) + (pick === ctx.best ? 0.3 : pick === 'none' ? -0.15 : -0.05))); return { pick, odds, won: (ctx.roll ?? 0.5) < odds }; };
export function hearing(ctx) {
  const { T, L } = base(ctx), rv = ctx.rival || { name: 'Rival principal', team: { name: 'Rival', color: '#27f4d2' } }, inc = ctx.inc || { a: 'LEC', b: 'RUS', ca: T.color, cb: rv.team.color, where: 'Turn 4', lap: 12 }, mine = ctx.mine !== false;
  const hint = { trace: 'The question for us is who was on the throttle, and when.', onboard: 'The question for us is where each car was placed at the apex.', radio: 'The question for us is what each driver had been told.' }[ctx.best || 'trace'];
  return { id: 'hearing', kicker: `${ctx.track || 'Race control'} · Document ${ctx.doc || 44}`, title: mine ? 'The protest' : 'Summoned', accent: '#b08d57', bg: '#0c0a08', exposure: 0.95, grade: 'warm',
    build(k) {
      let u = 0; const A = SETS.stewards(k, T, { screen: paintIncident(inc, 0) });
      const S3 = A.bench.map((s, i) => seated(k.person(suit(`steward${i}`, i === 1 ? 'sitLean' : 'sit', i === 2 ? { figure: 'f', build: 'slim' } : {}), [s[0], s[1], s[2]], 0)));
      const you = k.person(youOpts(T, 'cross'), [-1.5, 0, 0.9], PI), td = k.person(staff('technical director', T, 'talk'), [-2.4, 0, 1.3], PI * 0.95), rp = k.person({ ...staff(rv.name, rv.team, 'gesture'), color: rv.team.color, teamName: rv.team.name }, [1.6, 0, 0.9], PI), rt = k.person({ ...staff('their sporting director', rv.team, 'hips'), color: rv.team.color, teamName: rv.team.name }, [2.5, 0, 1.3], PI * 1.05);
      for (const a of [you, td, rp, rt]) if (a) a.look = { x: 0, y: 1.5, z: -3.1 }; for (const s of S3) if (s) s.look = { x: 4.9, y: 1.8, z: -0.4 };
      const chairS = S3[1], out = (r) => hearingOutcome(ctx, r);
      const ev = { trace: L.eTrace || 'The throttle trace. Our driver lifts here. Theirs does not.', onboard: L.eOnboard || 'The onboard. Look where the front wheel is at the apex.', radio: L.eRadio || 'Team radio, the lap before. Play it.' };
      const shots = [
        { d: 5, p: [-4.2, 2.3, 3.4], l: [0, 1.3, -2], p2: [-3.2, 1.9, 3.0], f: 28, e: 'io', dof: 0.4, sub: say('Chair of the stewards', L.open || `Document ${ctx.doc || 44}. ${inc.where}, lap ${inc.lap}. Car ${inc.a} and car ${inc.b}. ${hint}`, '#e9e2d0') },
        { d: 4.4, p: [1.6, 1.8, -0.4], l: [4.9, 1.8, -0.4], p2: [2.4, 1.8, -0.4], f: 30, dof: 0, shake: 0.03, run: () => { u = Math.min(1, u + 0.012); A.screen.redraw(paintIncident(inc, u)); }, sub: say(rv.name, L.rival || (mine ? 'A racing incident. They are protesting because they lost.' : 'Their car left ours nowhere to go. It is on the footage.'), rv.team.color) },
        { ...creep(cu(rp, { ang: -0.5, dist: 2.4, f: 15 }), 0.1), d: 3.4, shake: 0.12, low: { name: rv.name, role: `Team principal · ${rv.team.name}`, c: rv.team.color }, sub: say(rv.name, L.rival2 || 'With respect, some teams should look at their own car first.', rv.team.color) },
        { ...creep(ots(you, chairS, { f: 20, back: 1.0 }), 0.08), d: 3, shake: 0.08, on: () => { for (const s of S3) if (s) s.look = { x: -1.5, y: 1.6, z: 0.9 }; }, sub: say('Chair of the stewards', L.ask || `${T.name}. What do you want us to look at?`, '#e9e2d0'),
          ask: { id: 'evidence', prompt: 'Your evidence', time: 7, def: 'none', options: [{ id: 'trace', label: 'The throttle and brake traces' }, { id: 'onboard', label: 'The onboard camera' }, { id: 'radio', label: 'Team radio' }, { id: 'none', label: 'Nothing to add' }] } },
        { when: (r) => r.picks.evidence !== 'none', ...creep(cu(you, { ang: 0.4, dist: 2.3, f: 16 }), 0.1), d: 3.4, shake: 0.1, sub: (r) => say(YOU, ev[r.picks.evidence] || '', '#ffffff') },
        { ...creep(cu(chairS, { ang: 0.25, dist: 2.5, f: 14 }), 0.12), d: 3.6, shake: 0.05, on: () => { chairS.nod = 0.4; }, sub: (r) => say('Chair of the stewards', r.picks.evidence === ctx.best ? (L.good || 'That is... quite clear. Thank you.') : r.picks.evidence === 'none' ? (L.none || 'Then we decide on what we have.') : (L.meh || 'We have seen that. It does not tell us anything new.'), '#e9e2d0') },
        { d: 1.6, card: { kicker: 'Forty minutes later', title: 'The decision' }, p: [0, 1, 0], l: [0, 1, -1] },
        { d: 5, cut: 'dip', p: [0, 1.75, 3.6], l: [0, 1.45, -3], p2: [0, 1.7, 2.2], f: 26, e: 'out', shake: 0.06, on: () => { for (const s of S3) if (s) s.look = null; },
          sub: (r) => { const w = out(r).won; return say('Chair of the stewards', mine ? (w ? (L.win || `The protest is upheld. Five seconds added to car ${inc.b}'s race time.`) : (L.lose || 'The protest is dismissed. The fee is forfeited.')) : (w ? (L.win2 || 'No further action.') : (L.lose2 || `Car ${inc.a} is found at fault. Five seconds added to its race time.`)), '#e9e2d0'); } },
        { d: 3.4, ...creep(cu(rp, { ang: 0.6, dist: 2.6, f: 15 }), 0.08), shake: 0.12, on: (kk) => { rp.look = { x: -1.5, y: 1.62, z: 0.9 }; }, sub: (r) => { const w = out(r).won; return say(rv.name, w ? (L.rvLose || 'Enjoy it. We will remember this one.') : (L.rvWin || 'Next time, save the fee.'), rv.team.color); } },
      ];
      return { shots };
    } };
}


/**
 * The scrutineering bay (15): the technical directive, measured on your own car. ctx: { part (what it bites: 'front
 * wing', 'floor' ...), td: { name }, mm ([measured, limit]), from (the race it applies from), loss (text: what it
 * costs), yours (false: a rival's part - you watch theirs fail), rival, lines }. The decision (yours): comply | run | lobby.
 */
export function scrutineering(ctx) {
  const { T, L, D } = base(ctx), td = ctx.td?.name || 'Technical director', mm = ctx.mm || [11.8, 10], who = ctx.yours === false ? (ctx.rival || T0) : T, part = ctx.part || 'front wing';
  return { id: 'scrutineering', kicker: `Technical directive ${ctx.no || 18}`, title: `The ${part}`, accent: '#3d6fd6', bg: '#0c0e12', exposure: 1.0, grade: 'cold', needsCar: true,
    build(k) {
      k.env(0.6);
      const dial = (v) => (x, W, H) => { x.fillStyle = '#0b0f16'; x.fillRect(0, 0, W, H); x.fillStyle = '#8fa3c4'; x.font = `700 ${H * 0.1}px ${k.FONT}`; x.textAlign = 'center'; x.fillText('DEFLECTION UNDER LOAD', W / 2, H * 0.16); x.fillStyle = v > mm[1] ? '#ff5a4d' : '#7dffa0'; x.font = `900 ${H * 0.36}px ${k.FONT}`; x.fillText(`${v.toFixed(1)} mm`, W / 2, H * 0.56); x.fillStyle = '#ffffff'; x.font = `600 ${H * 0.1}px ${k.FONT}`; x.fillText(`LIMIT ${mm[1].toFixed(1)} mm`, W / 2, H * 0.82); };
      const A = SETS.garage(k, who, { fia: true, night: true, screens: [dial(0), paintTable(`TD${ctx.no || 18}`, [{ a: '1', b: `${part} flexibility`.toUpperCase(), c: '' }, { a: '2', b: 'STATIC LOAD TEST', c: '1000 N' }, { a: '3', b: `IN FORCE: ${String(ctx.from || 'NEXT RACE').toUpperCase()}`, c: '', hi: true }], '#3d6fd6', { min: 4 }), dial(0)] });
      k.car({ color: who.color, color2: who.color2, team: who.name, livery: who.livery, number: D[0].number, driver: D[0].name }, A.car, 0);
      // the rig: a frame over the nose, the weight let down on the wing
      const steel = k.m('#c9ccd1', 0.3, 0.8); k.box(0.08, 1.7, 0.08, steel, -1.25, 0.85, 2.9); k.box(0.08, 1.7, 0.08, steel, 1.25, 0.85, 2.9); k.box(2.6, 0.08, 0.08, steel, 0, 1.7, 2.9);
      const wt = k.cyl(0.11, 0.11, 0.22, k.m('#d9a800', 0.4, 0.5), 0.72, 1.3, 2.9, 16), cable = k.cyl(0.008, 0.008, 1, k.m('#111', 0.5), 0.72, 1.5, 2.9, 6);
      const load = (u) => { wt.position.y = 1.3 - 0.86 * u; cable.scale.y = 0.3 + 0.86 * u; cable.position.y = 1.7 - (0.3 + 0.86 * u) / 2; const v = mm[0] * Math.min(1, u * 1.15); A.screens[0].redraw(dial(v)); A.screens[2].redraw(dial(v)); };
      const o1 = k.person(suit('scrutineer one', 'reach', { acc: ['lanyard'] }), [1.5, 0, 3.2], -PI / 2), o2 = k.person(suit('scrutineer two', 'record', { acc: ['lanyard'], figure: 'f', build: 'slim' }), [-1.7, 0, 3.6], PI * 0.6);
      const tdp = k.person(staff(td, T, 'cross'), [-3.0, 0, 1.6], 0.9), you = k.person(youOpts(T, 'hips'), [-3.6, 0, 2.6], 1.2);
      o1.look = o2.look = { x: 0.7, y: 0.5, z: 2.9 }; tdp.look = you.look = { x: 0.7, y: 0.6, z: 2.9 };
      const shots = [
        { d: 5, p: [0.2, 4.1, 3.4], l: [0, 0.3, 1.8], p2: [-0.6, 3.9, 4.6], l2: [0.2, 0.4, 2.4], f: 30, roll: 0.25, roll2: 0, e: 'io', dof: 0.4, sub: say('Scrutineer', L.open || `Technical directive ${ctx.no || 18}. One thousand newtons on the ${part}. Ten millimetres, no more.`, '#9db8e8') },
        { d: 4.6, p: [1.9, 0.5, 4.1], l: [0.72, 0.5, 2.9], p2: [1.6, 0.42, 3.7], f: 20, shake: 0.06, run: (kk, u) => load(u), sub: say('Scrutineer', L.load || 'Load on.', '#9db8e8') },
        { d: 3.4, p: [-0.3, 1.9, 0.6], l: [-2.4, 2.05, -4.9], p2: [-0.9, 1.95, -0.6], f: 22, dof: 0.6, on: () => load(1), sub: say('Scrutineer', L.read || `${mm[0].toFixed(1)}. That is ${(mm[0] - mm[1]).toFixed(1)} over.`, '#9db8e8') },
        { ...creep(cu(tdp, { ang: -0.35, dist: 2.2, f: 15 }), 0.1), d: 4.2, shake: 0.12, low: { name: td, role: `Technical director · ${T.name}` }, on: () => { tdp.shake = 0.3; }, sub: say(td, L.td || (ctx.yours === false ? `That is their whole front end. They will be ${ctx.loss || 'two tenths'} slower by ${ctx.from || 'the next race'}.` : `It passed every test they had in March. Stiffen it and we lose ${ctx.loss || 'two tenths'}.`)) },
        { ...creep(ots(you, o1, { f: 24, back: 1.0 }), 0.08), d: 4, shake: 0.08, on: () => { o1.look = hd(you) && { x: -3.6, y: 1.62, z: 2.6 }; }, sub: say('Scrutineer', L.close || (ctx.yours === false ? 'It applies to everyone. Yours passed.' : `It applies from ${ctx.from || 'the next race'}. What you run before then is your decision. And your risk.`), '#9db8e8') },
      ];
      return { shots, choice: ctx.yours === false ? null : { prompt: `Directive ${ctx.no || 18}: your ${part} is ${(mm[0] - mm[1]).toFixed(1)} mm over`, options: [{ id: 'comply', label: 'Stiffen it now', hint: `Legal at once; ${ctx.loss || 'pace'} lost until it is developed again` }, { id: 'run', label: 'Run it one more race', hint: 'Full pace this weekend; a protest could throw the result out' }, { id: 'lobby', label: 'Lobby against the directive', hint: 'Costs money and goodwill; it may be delayed to next season' }] } };
    } };
}

/**
 * The auditors (16): the cost cap, the binders on your table. ctx: { spent, cap, over (the $M they find you over),
 * fine, lines }. Asked: your line (books | built | silent); the decision: accept | contest.
 */
export function audit(ctx) {
  const { T, L } = base(ctx), spent = ctx.spent ?? 71.3, cap = ctx.cap ?? 70;
  return { id: 'audit', kicker: 'Cost cap administration', title: 'The audit', accent: '#b08d57', bg: '#0b0c10', exposure: 1.0, grade: 'cold',
    build(k) {
      const bars = (x, W, H) => { x.fillStyle = '#0b0d12'; x.fillRect(0, 0, W, H); x.fillStyle = '#fff'; x.font = `800 ${H * 0.07}px ${k.FONT}`; x.fillText('RELEVANT COSTS ($M)', W * 0.05, H * 0.12); const sc = W * 0.8 / (cap * 1.1); x.fillStyle = '#3b4250'; x.fillRect(W * 0.05, H * 0.3, cap * sc, H * 0.18); x.fillStyle = spent > cap ? '#ff5a4d' : '#7dffa0'; x.fillRect(W * 0.05, H * 0.58, spent * sc, H * 0.18); x.fillStyle = '#ffd400'; x.fillRect(W * 0.05 + cap * sc, H * 0.24, 3, H * 0.58); x.fillStyle = '#fff'; x.font = `700 ${H * 0.07}px ${k.FONT}`; x.fillText(`CAP ${cap.toFixed(1)}`, W * 0.07, H * 0.42); x.fillText(`${T.name.toUpperCase()} ${spent.toFixed(1)}`, W * 0.07, H * 0.7); };
      const A = SETS.boardroom(k, T, { screen: bars });
      const a1 = seated(k.person(suit('auditor one', 'sitLean', { figure: 'f', build: 'slim' }), [-0.8, 0, -1.2], 0)), a2 = seated(k.person(suit('auditor two', 'sit'), [0.8, 0, -1.2], 0)), you = seated(k.person(youOpts(T, 'sitArm'), [0, 0, 1.2], PI));
      a1.look = a2.look = { x: 0, y: 1.25, z: 1.2 }; you.look = { x: -0.8, y: 1.25, z: -1.2 };
      const labs = ['FREIGHT', 'CATERING', 'TUNNEL HOURS', 'SPARES', 'SIMULATOR', 'TRAVEL', 'CONSULTANTS'];
      labs.forEach((n, i) => { k.box(0.09, 0.32, 0.26, k.m(['#27406b', '#6b2727', '#2f5a3a', '#3b3b3b'][i % 4], 0.7), -1.5 + i * 0.11, 0.94, -0.2); k.sign(0.07, 0.28, (x, W, H) => { x.fillStyle = '#f1efe8'; x.fillRect(0, 0, W, H); x.save(); x.translate(W / 2, H / 2); x.rotate(-PI / 2); x.fillStyle = '#111'; x.font = `800 ${W * 0.5}px ${k.FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(n, 0, 0); x.restore(); }, -1.5 + i * 0.11, 0.94, -0.065, 0, 64); });
      const rep = { books: L.rBooks || 'We have read your interpretation. We do not share it.', built: L.rBuilt || 'We are not here about what you built. We are here about what it cost.', silent: L.rSilent || 'Nothing? Then we will take the figures as they stand.' };
      const shots = [
        { d: 4.6, p: [-2.2, 1.02, 0.9], l: [-1.2, 0.95, -0.2], p2: [-0.6, 1.02, 0.8], l2: [-0.9, 0.95, -0.2], f: 18, e: 'lin', shake: 0.04, sub: say('Auditor', L.open || 'Seven binders. We have been through every invoice in them.', '#e9e2d0') },
        { ...creep(cu(a1, { ang: 0.3, dist: 2.3, f: 15 }), 0.1), d: 4, shake: 0.06, sub: say('Auditor', L.find || `We make it $${spent.toFixed(1)}M. The cap is $${cap.toFixed(1)}M.`, '#e9e2d0') },
        { d: 3.6, p: [-1.2, 1.8, 0.4], l: [-5.9, 1.95, 0], p2: [-2.6, 1.85, 0.2], f: 26, dof: 0, shake: 0.03, sub: say('Auditor', L.over || `$${(spent - cap).toFixed(1)}M over. A minor breach, on the page. Not a minor matter.`, '#e9e2d0') },
        { ...creep(ots(a2, you, { f: 20, back: 1.0 }), 0.08), d: 3, shake: 0.1, sub: [], ask: { id: 'line', prompt: 'Your answer', time: 6.5, def: 'silent', options: [{ id: 'books', label: 'It is how the catering and freight are booked' }, { id: 'built', label: 'We built only what we could afford' }, { id: 'silent', label: 'Say nothing' }] } },
        { ...creep(cu(a2, { ang: -0.3, dist: 2.3, f: 15 }), 0.1), d: 3.8, shake: 0.06, sub: (r) => say('Auditor', rep[r.picks.line] || rep.silent, '#e9e2d0') },
        { d: 4, p: [4.6, 2.4, 3.2], l: [0, 0.9, 0], p2: [4.0, 2.2, 3.4], f: 28, dof: 0.4, sub: say('Auditor', L.close || `An accepted breach agreement: a fine of $${(ctx.fine ?? 1.5).toFixed(1)}M and ten per cent of your tunnel time. Or you contest it.`, '#e9e2d0') },
      ];
      return { shots, choice: { prompt: `The audit: $${(spent - cap).toFixed(1)}M over the cap`, options: [{ id: 'accept', label: 'Accept the breach', hint: `$${(ctx.fine ?? 1.5).toFixed(1)}M and less tunnel time next season; it is over` }, { id: 'contest', label: 'Contest it', hint: 'Lawyers cost money; win and it is halved, lose and it is worse' }] } };
    } };
}
export const auditOutcome = (ctx, r) => ({ choice: r?.choice || 'accept', line: r?.picks?.line || 'silent', odds: 0.4 + (r?.picks?.line === 'books' ? 0.15 : r?.picks?.line === 'built' ? 0.05 : 0) });

/**
 * A sponsor's call (17): the wall screen in your office, their commercial director on it. ctx: { sp: { name, fee },
 * missed (targets in a row), ask (what they want: text), lines }. Asked: how you open (promise | contract | charm);
 * the decision: promise | cut | walk.
 */
export function sponsorCall(ctx) {
  const { T, L } = base(ctx), sp = ctx.sp || { name: 'Halcyon Bank', fee: 2.4 }, who = ctx.exec || 'Commercial director';
  return { id: 'sponsorCall', kicker: `${sp.name} · Incoming call`, title: 'The ultimatum', accent: '#d9b04a', bg: '#07080b', exposure: 0.95, grade: 'cold',
    build(k) {
      let lv = 0; const call = (talk, tt = 0) => (x, W, H) => {
        x.fillStyle = '#10151f'; x.fillRect(0, 0, W, H); const g = x.createRadialGradient(W / 2, H * 0.45, 10, W / 2, H * 0.45, W * 0.6); g.addColorStop(0, '#2a3550'); g.addColorStop(1, '#0b0e15'); x.fillStyle = g; x.fillRect(0, 0, W, H);
        x.fillStyle = '#05070b'; x.beginPath(); x.ellipse(W / 2, H * 0.36 + (talk ? Math.sin(tt * 9) * 2 : 0), W * 0.085, H * 0.17, 0, 0, 6.3); x.fill(); x.beginPath(); x.ellipse(W / 2, H * 0.95, W * 0.24, H * 0.36, 0, 0, 6.3); x.fill();
        x.fillStyle = '#d9b04a'; x.fillRect(0, H * 0.86, W, H * 0.14); x.fillStyle = '#111'; x.font = `800 ${H * 0.07}px ${k.FONT}`; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText(`${String(sp.name).toUpperCase()}  ·  ${who.toUpperCase()}`, W * 0.03, H * 0.93);
        if (talk) { x.fillStyle = '#7dffa0'; for (let i = 0; i < 14; i++) { const h = (0.2 + Math.abs(Math.sin(tt * (5 + i) + i))) * H * 0.05; x.fillRect(W * 0.84 + i * W * 0.008, H * 0.08 - h / 2, W * 0.005, h); } }
      };
      const A = SETS.office(k, T, { cups: ctx.cups || 0, screen: call(false) });
      const you = k.person(youOpts(T, 'cross'), [-1.4, 0, 0.4], -PI / 2); you.look = { x: -3.9, y: 1.75, z: 0.4 };
      const talkOn = (kk) => { lv = 1; }, talk = (kk) => { if (lv) A.screen.redraw(call(true, kk.t)); };
      const rep = { promise: L.rPromise || 'Points. In the next two races. I am writing the date on my wall.', contract: L.rContract || 'I have read the contract. So have our lawyers. Clause nine.', charm: L.rCharm || 'I like you. Everybody here likes you. That is not what the board asked me.' };
      const scr = { p: [-0.6, 1.75, 0.4], l: [-3.9, 1.75, 0.4], f: 30 };
      const shots = [
        { d: 4.4, p: [3.0, 1.7, 2.8], l: [-1.5, 1.4, 0.2], p2: [2.2, 1.6, 2.4], f: 26, e: 'io', dof: 0.5, sub: say(YOU, L.vo || `${sp.name}. They never call on a Monday.`, '#cfd6e4') },
        { ...scr, p2: [-1.2, 1.75, 0.4], d: 4.6, dof: 0, shake: 0.03, on: talkOn, run: talk, sub: say(who, L.open || `${ctx.missed || 3} weekends. ${ctx.missed || 3} targets missed. I have a board too, and it has stopped asking me nicely.`, '#d9b04a') },
        { ...creep(cu(you, { ang: -0.6, dist: 2.2, f: 16 }), 0.1), d: 3, shake: 0.1, run: talk, sub: say(who, L.want || `${ctx.ask || 'A points finish in the next two races'}. Or we take the logo off the car.`, '#d9b04a'),
          ask: { id: 'open', prompt: 'How do you answer?', time: 6.5, def: 'charm', options: [{ id: 'promise', label: 'Ask what result would settle it' }, { id: 'contract', label: 'Remind them the contract runs to the end of the season' }, { id: 'charm', label: 'Buy time: talk about the upgrade that is coming' }] } },
        { ...scr, p: [-0.9, 1.75, 0.9], d: 4, dof: 0, shake: 0.03, run: talk, sub: (r) => say(who, rep[r.picks.open] || rep.charm, '#d9b04a') },
        { d: 3.6, p: [0.6, 1.5, -2.9], l: [-1.4, 1.5, 0.4], p2: [0.2, 1.5, -2.8], f: 24, shake: 0.08, focus: [-1.4, 1.6, 0.4], on: () => { lv = 0; A.screen.redraw(call(false)); }, sub: say(YOU, L.close || `$${sp.fee}M a race. That is ${ctx.what || 'a floor upgrade'} every three weekends.`, '#cfd6e4') },
      ];
      return { shots, choice: { prompt: `${sp.name} want an answer`, options: [{ id: 'promise', label: 'Promise the result', hint: `${ctx.ask || 'Points in the next two races'}: deliver and they stay, fail and they go loudly` }, { id: 'cut', label: 'Offer a lower fee', hint: 'They stay to the end of the season for 30% less' }, { id: 'walk', label: 'Let them walk', hint: 'The slot is free for someone else; the paddock notices' }] } };
    } };
}

/**
 * The leak (18): the headline, then the factory's own cameras. ctx: { what (text: what got out), paper, head, deck,
 * suspects: [{ name, role }] (the first is the one), lines }. A moment to catch: freeze the frame as the face turns
 * (good: you have them; ok: one of two; miss: nobody). The decision depends on it.
 */
export const leakOutcome = (ctx, r) => { const g = r?.qte?.freeze || 'miss'; return { grade: g, known: g === 'good', choice: r?.choice || 'ignore' }; };
export function leak(ctx) {
  const { T, L } = base(ctx), S = ctx.suspects && ctx.suspects.length ? ctx.suspects : [{ name: 'A. Marchetti', role: 'Aerodynamicist' }, { name: 'R. Collins', role: 'Design engineer' }];
  return { id: 'leak', kicker: `${T.name} · 02:14`, title: 'Someone talked', accent: '#ff5a4d', bg: '#050608', exposure: 0.9, grade: 'cold',
    build(k) {
      // the factory at night: the lamps off, one desk lit
      const A = SETS.factory(k, T, ctx.lv || { factory: 4, hosp: 2, dil: 2, pitc: 2 }, {});
      k.S.traverse((x) => { if (x.isHemisphereLight) x.intensity = 0.1; if (x.isDirectionalLight) x.intensity = 0.12; if (x.isMesh && x.material?.type === 'MeshBasicMaterial' && !x.material.map && x.geometry?.parameters?.height === 0.05) x.visible = false; });
      const mole = k.person(staff(S[0].name, T, 'phone'), [-0.6, 0, -4.4], PI); k.light.point(0xbfd4ff, 6, [-0.6, 1.5, -5.0], 4);
      const pad = k.at(0, 0, 60), tab = k.screen(1.6, 0.9, paintHeadline({ paper: ctx.paper || 'The Paddock Wire', head: ctx.head || `${T.name}'s secret: ${ctx.what || 'the new floor'}`, deck: ctx.deck || 'Drawings seen by this site show the upgrade in full. Rivals are said to be studying them.', col: '#b3141b' }), 0, 1.2, 0, 0, 1.0, 1024); k.light.point(0xfff1e0, 3, [0, 1.3, 1.2], 4); k.at(0, 0, 0);
      let turn = 0; k.each(() => { mole.yaw = PI + turn; });
      const cam2 = { p: [3.6, 3.4, -1.4], l: [-0.6, 1.4, -4.4], f: 14 };
      const shots = [
        { d: 4.8, p: [0.5, 1.25, 62.4], l: [0, 1.2, 60], p2: [0.2, 1.22, 61.6], f: 24, shake: 0.2, dof: 0, sub: say(YOU, L.vo || `On their front page before it was on our car. ${ctx.what ? `They have ${ctx.what}.` : ''}`, '#cfd6e4') },
        { d: 4.2, cut: 'dip', p: [6, 6.6, 5.5], l: [0, 1, -3], p2: [5.4, 6.6, 5.2], f: 30, lock: true, fill: 0, shake: 0.02, dof: 0, grade: 'mono', hud: 'cctv', hudText: { tl: 'CAM 02 · DESIGN OFFICE', tr: '02:14:07', bl: `${T.name.toUpperCase()} SECURITY` }, sub: say('Head of security', L.sec || 'Thursday night. The office should have been empty.', '#cfd6e4') },
        { ...cam2, d: 5.2, lock: true, fill: 0, shake: 0.02, dof: 0, grade: 'mono', hud: 'cctv', hudText: { tl: 'CAM 04 · BAY 3', tr: '02:14:31', bl: 'ZOOM x4' }, run: (kk, u) => { turn = -Math.max(0, Math.min(1, (u - 0.35) / 0.3)) * 2.2 + Math.max(0, Math.min(1, (u - 0.75) / 0.2)) * 2.2; }, sub: say('Head of security', L.sec2 || 'They look round once. Watch.', '#cfd6e4'),
          qte: { id: 'freeze', kind: 'time', prompt: 'Freeze the frame', from: 1.0, len: 3.6, sweet: [0.42, 0.66], after: 0.6, words: { good: 'GOT THEM', ok: 'PARTIAL', miss: 'TOO LATE' } } },
        { when: (r) => r.qte.freeze === 'good', ...cam2, f: 7, d: 3.8, lock: true, fill: 0.25, shake: 0, dof: 0, grade: 'mono', hud: 'cctv', hudText: { tl: 'CAM 04 · STILL', tr: '02:14:33', bl: 'ENHANCED' }, on: () => { turn = -2.2; }, low: { name: S[0].name, role: `${S[0].role} · ${T.name}`, c: '#ff5a4d' }, sub: say('Head of security', L.got || `${S[0].name}. ${S[0].role}. Six years with us.`, '#cfd6e4') },
        { when: (r) => r.qte.freeze !== 'good', ...cam2, f: 9, d: 3.8, lock: true, fill: 0.25, shake: 0, dof: 0, grade: 'mono', hud: 'cctv', hudText: { tl: 'CAM 04 · STILL', tr: '02:14:35', bl: 'NO MATCH' }, on: () => { turn = -0.5; }, sub: (r) => say('Head of security', r.qte.freeze === 'ok' ? (L.part || `Half a face. It is ${S[0].name} or ${S[1]?.name || 'someone on that floor'}. I cannot say which.`) : (L.none || 'Nothing we can use. Whoever it is knows where the cameras are.'), '#cfd6e4') },
      ];
      return { shots, choice: (r) => (r.qte.freeze === 'good'
        ? { prompt: `${S[0].name} leaked ${ctx.what || 'it'}`, options: [{ id: 'fire', label: 'Dismiss them', hint: 'It stops; the factory loses a pair of hands and knows why' }, { id: 'feed', label: 'Keep them and feed them a false drawing', hint: 'The rival wastes weeks on it - if they never find out' }, { id: 'quiet', label: 'A quiet word, no more', hint: 'Loyalty, perhaps; or it happens again' }] }
        : { prompt: 'The leak is still in the building', options: [{ id: 'probe', label: `Investigate ($${ctx.cost ?? 0.3}M)`, hint: r.qte.freeze === 'ok' ? 'Two names to check: it will find them' : 'It may find them; the factory will feel watched' }, { id: 'ignore', label: 'Let it lie', hint: 'Nothing spent; whoever it is still has a phone' }] }) };
    } };
}

/**
 * The seat fitting (19): your driver is hurt, someone else gets the car. ctx: { hurt: { name }, why, rounds (how many
 * he misses), cands: [{ id, name, note }] (up to three), lines }. Asked, against the clock (the first is taken if you
 * do not): who. The scene goes on with them in the car.
 */
export function seatFit(ctx) {
  const { T, L } = base(ctx), hurt = ctx.hurt || { name: 'Driver One', number: 1 }, C = (ctx.cands && ctx.cands.length ? ctx.cands : [{ id: 'r1', name: 'Reserve One', note: 'Reserve driver' }, { id: 'r2', name: 'Rookie Two', note: 'F2: quick, raw' }]).slice(0, 3);
  return { id: 'seatFit', kicker: `${T.name} · Wednesday, late`, title: 'The empty seat', accent: T.color, bg: '#07080b', exposure: 0.95, grade: 'cold', needsCar: true,
    build(k) {
      k.env(0.5);
      const A = SETS.garage(k, T, { night: true });
      k.car({ color: T.color, color2: T.color2, team: T.name, livery: T.livery, number: hurt.number, driver: null }, A.car, 0);
      const eng = k.person(staff(ctx.eng || 'race engineer', T, 'cross'), [-2.0, 0, 2.2], 0.7), c1 = k.crew({ color: T.color, accent: T.color2, pose: 'steady', work: 0.5 }, [1.25, 0, 0.5], -PI / 2), c2 = k.crew({ color: T.color, accent: T.color2, pose: 'wing' }, [-1.2, 0, 0.1], PI / 2);
      const res = C.map((c) => { const p = k.person(drv({ name: c.name }, T, 'hips', { cap: false }), [1.9, 0, 2.6], -0.8); p.g.visible = false; return p; });
      const helmet = k.ball(0.15, k.m(T.color, 0.25, 0.3), 0.75, 0.83, 0.5); helmet.scale.set(1.12, 1, 1);
      const pickOf = (r) => Math.max(0, C.findIndex((c) => c.id === r.picks.who));
      const shots = [
        { d: 4.8, p: [0.9, 1.5, 1.9], l: [0, 0.75, 0.2], p2: [0.5, 1.35, 1.5], f: 22, shake: 0.06, sub: say(ctx.eng || 'Race engineer', L.open || `${surname(hurt.name)} is out for ${ctx.rounds || 2} race${(ctx.rounds || 2) === 1 ? '' : 's'}. ${ctx.why || 'A fracture in the wrist.'} The seat is still warm.`) },
        { d: 3.6, p: [-4.6, 1.3, 4.6], l: [0, 0.9, 0.3], p2: [-3.9, 1.25, 4.9], f: 24, shake: 0.08, dof: 0.6, sub: say(ctx.eng || 'Race engineer', L.need || 'I need a name tonight. The seat takes six hours to pour.') ,
          ask: { id: 'who', prompt: 'Who drives?', time: 10, def: C[0].id, options: C.map((c) => ({ id: c.id, label: `${c.name}${c.note ? ` — ${c.note}` : ''}` })) } },
        { d: 4.6, p: [3.6, 1.55, 4.4], l: [1.9, 1.5, 2.6], p2: [3.0, 1.6, 3.9], f: 18, shake: 0.12, on: () => {}, sub: (r) => { const i = pickOf(r); res.forEach((p, n) => { p.g.visible = n === i; }); res[i].look = { x: 0, y: 0.8, z: 0.3 }; return say(surname(C[i].name), L.res || 'I have been waiting two years for this phone call.'); }, low: null },
        { d: 4.8, p: [-0.3, 2.6, 6.2], l: [0.3, 0.9, 1.2], p2: [-0.9, 3.4, 7.2], f: 26, e: 'io', dof: 0.5, shake: 0.04, sub: (r) => say(ctx.eng || 'Race engineer', L.close || `Then get in. ${surname(hurt.name)} is six centimetres taller than you: we start with the pedals.`) },
      ];
      return { shots };
    } };
}

/**
 * A mechanic's word (25): after the stop that went wrong, or before a last race. ctx: { who: { name, role }, what
 * ('botch' | 'retire'), time (the stop, s), years, lines }. The decision: botch: faith | move | drill; retire: stop | role.
 */
export function crewTalk(ctx) {
  const { T, L } = base(ctx), who = ctx.who || { name: 'Dario Conti', role: 'Front-left gun' }, botch = ctx.what !== 'retire';
  return { id: 'crewTalk', kicker: `${T.name} · The garage, after hours`, title: botch ? `${(ctx.time ?? 4.9).toFixed(1)} seconds` : 'The last season', accent: T.color, bg: '#07080b', exposure: 0.95, grade: 'warm', needsCar: true,
    build(k) {
      k.env(0.5);
      const A = SETS.garage(k, T, { night: true });
      k.car({ color: T.color, color2: T.color2, team: T.name, livery: T.livery, number: ctx.drivers?.[0]?.number }, A.car, 0);
      const cm = k.crew({ color: T.color, accent: T.color2, pose: 'gun', work: 1 }, [1.3, 0, 1.75], -PI / 2), you = k.person(youOpts(T, 'cross'), [3.4, 0, 3.4], -2.2);
      k.cyl(0.05, 0.06, 0.34, k.m('#c9ccd1', 0.3, 0.8), 0.95, 0.42, 1.75, 10).rotation.z = PI / 2;
      you.look = { x: 1.3, y: 1.2, z: 1.75 };
      const shots = [
        { d: 4.8, p: [2.6, 0.5, 0.2], l: [1.1, 0.5, 1.75], p2: [2.9, 0.55, 1.0], f: 20, shake: 0.06, sub: say(YOU, L.vo || (botch ? 'Everyone else went back to the hotel. The gun was still going.' : `${ctx.years || 22} years in that corner of the garage.`), '#cfd6e4') },
        { d: 4.6, p: [-3.8, 1.5, 5.2], l: [1.6, 1.1, 2.2], p2: [-3.2, 1.5, 5.6], f: 20, shake: 0.08, on: () => { cm.pose = 'stand'; cm.work = 0; cm.face(3.4, 3.4); }, low: { name: who.name, role: `${who.role} · ${T.name}` }, sub: say(surname(who.name), L.m1 || (botch ? `${(ctx.time ?? 4.9).toFixed(1)} seconds. I have watched it forty times. The nut was on. I went again anyway.` : 'My knees say this is the last one. I wanted you to hear it from me.')) },
        { ...creep(ots(you, cm, { f: 22, back: 0.9 }), 0.1), d: 4.4, shake: 0.1, sub: say(surname(who.name), L.m2 || (botch ? `It cost ${ctx.cost || 'us the place'}. If you want someone else on that gun, I understand.` : 'One more stop under two and a half. Then I will go and annoy my grandchildren.')) },
      ];
      return { shots, choice: botch
        ? { prompt: `${who.name} asks if he keeps the gun`, options: [{ id: 'faith', label: 'Keep faith', hint: 'He steadies; the crew see you stand by them' }, { id: 'move', label: 'Move him to tyres', hint: 'A safer pair of hands on the gun; he takes it hard' }, { id: 'drill', label: 'Extra practice for the whole crew', hint: 'Sharper all round, and more tired' }] }
        : { prompt: `${who.name} retires at the end of the season`, options: [{ id: 'stop', label: 'Give him the last stop of the year', hint: 'The crew will remember it' }, { id: 'role', label: 'Offer him the crew centre', hint: 'A salary; the next gunners learn from him' }] } };
    } };
}

/**
 * The press (22): one question, from someone who remembers what you said last time. ctx: { j: { name, outlet, lean },
 * q (the question), opts: [{ id, label, reply (what you say), head (the headline it makes) }] (three; a fourth, no
 * comment, is added), after (the journalist's last word by lean), lines }.
 */
export function press(ctx) {
  const { T, L } = base(ctx), j = ctx.j || { name: 'Marta Voss', outlet: 'The Paddock Wire', lean: 'hostile' };
  const O = (ctx.opts && ctx.opts.length ? ctx.opts : [{ id: 'a', label: 'Defend the team', reply: 'We win and lose together.', head: `${T.name} boss closes ranks` }, { id: 'b', label: 'Admit the mistake', reply: 'We got it wrong. That is on me.', head: `"On me": ${T.name} boss owns it` }, { id: 'c', label: 'Turn it on a rival', reply: 'Ask the team ahead how they found half a second in a fortnight.', head: `${T.name} boss points the finger` }]).slice(0, 3);
  const nc = { id: 'nc', label: 'No comment', reply: 'Next question.', head: `${T.name} boss dodges the question` }, all = [...O, nc], of = (r) => all.find((x) => x.id === r.picks.answer) || nc;
  return { id: 'press', kicker: `${ctx.track || 'The media centre'} · ${T.name}`, title: 'One more question', accent: T.color, bg: '#06070a', exposure: 1.0, grade: 'neutral',
    build(k) {
      const A = SETS.pressroom(k, T, { names: ctx.sponsors || [] });
      const you = seated(k.person(youOpts(T, 'sitLean'), A.seats[1].slice(0, 3), 0), 1.27), jr = k.person(suit(j.name, 'record', j.female === false ? {} : { figure: 'f', build: 'slim' }), [1.9, 0, 2.3], PI + 0.25);
      you.look = { x: 1.9, y: 1.6, z: 2.3 }; jr.look = { x: 0, y: 1.6, z: -1.85 };
      const scr = k.at(0, 0, 60).screen(1.6, 0.9, paintHeadline({ paper: j.outlet, head: '...', deck: '' }), 0, 1.2, 0, 0, 1.0, 1024); k.light.point(0xfff1e0, 3, [0, 1.3, 1.2], 4); k.at(0, 0, 0);
      const shots = [
        { d: 4.2, p: [-5.5, 2.3, 6.5], l: [0, 1.4, -1.5], p2: [-4.4, 2.0, 5.6], f: 26, e: 'io', dof: 0.5, shake: 0.1, sub: say('Moderator', L.mod || `Last one. ${j.name}, ${j.outlet}.`, '#cfd6e4') },
        { ...creep(cu(jr, { ang: -0.5, dist: 2.3, f: 15 }), 0.1), d: 4.6, shake: 0.14, low: { name: j.name, role: j.outlet, c: j.lean === 'friendly' ? '#7dffa0' : j.lean === 'hostile' ? '#ff5a4d' : '#ffd400' }, sub: say(j.name, ctx.q || `Three races ago you told this room the upgrade would fix it. It has not. What do you say to the fans tonight?`) },
        { d: 3, p: [1.2, 1.5, 3.9], l: [0, 1.5, -1.85], p2: [0.9, 1.5, 3.3], f: 18, shake: 0.2, focus: [1.2, 1.3, 2.6], focus2: [0, 1.55, -1.85], sub: [], ask: { id: 'answer', prompt: 'Your answer', time: 7.5, def: 'nc', options: all.map((x) => ({ id: x.id, label: x.label })) } },
        { ...creep(cu(you, { ang: 0.3, dist: 2.4, f: 15 }), 0.1), d: 3.6, shake: 0.08, sub: (r) => say(YOU, of(r).reply, '#ffffff') },
        { ...creep(cu(jr, { ang: -0.3, dist: 2.0, f: 14 }), 0.08), d: 3, shake: 0.14, on: () => { jr.nod = 0.5; }, sub: (r) => say(j.name, (ctx.after && ctx.after[r.picks.answer]) || (r.picks.answer === 'nc' ? 'That will be the headline, then.' : j.lean === 'friendly' ? 'Thank you. Good luck on Sunday.' : 'We will hold you to that.')) },
        { d: 3.8, cut: 'dip', p: [0.5, 1.25, 62.4], l: [0, 1.2, 60], p2: [0.2, 1.22, 61.7], f: 24, shake: 0.2, dof: 0, on: (kk, r) => { scr.redraw(paintHeadline({ paper: j.outlet, head: of(r).head, deck: ctx.deck || `${ctx.track ? `${ctx.track}: ` : ''}what was said in the room, and what it means.`, col: j.lean === 'hostile' ? '#b3141b' : '#1d3b6e' })); } },
      ];
      return { shots };
    } };
}
export const pressOutcome = (ctx, r) => r?.picks?.answer || 'nc';

export const DRAMA = { board, feudRow, debrief, poach, hearing, scrutineering, audit, sponsorCall, leak, seatFit, crewTalk, press };
