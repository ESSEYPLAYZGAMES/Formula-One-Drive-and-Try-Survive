// spark (PLAYFUL) - bubbly, playful, impulsive, teasing, a little chaotic. Dares, bets and schemes; nicknames (you're
// 'Turbo'), a goose-honk laugh, a notebook of every bet they've made, a yellow scooter called Banana, a best friend
// Juno to bet against. Story order: each talk is the next slot of its stage, in the opening mood's version.
import { DATA as NEW } from './spark/new.js';
import { DATA as WARM } from './spark/warm.js';
import { DATA as CLOSE } from './spark/close.js';
import { DATA as WEEK } from './spark/week.js';
import { DATA as EVENTS } from './spark/events.js';
export const PERSONA = { id: 'spark', convos: [...NEW, ...WARM, ...CLOSE], texts: [...WEEK, ...EVENTS] };
