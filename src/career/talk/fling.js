// FLING - fun, flirty, late-night, allergic to serious. Eager to meet up after midnight and generous with attention
// when it suits them; deflects whenever you get serious, runs hot then cold, leaves you on read and texts again when
// they want a night out. Never cruel about it - honest that they don't do commitment, and now and then they let slip it
// could be more (and take it back). The stranger with one eye on the exit -> late plans and bent rules -> seeing each
// other without ever calling it anything. (Career/Celebs.js keeps them from ever becoming your partner.)
import { DATA as NEW } from './fling/new.js';
import { DATA as WARM } from './fling/warm.js';
import { DATA as CLOSE } from './fling/close.js';
import { DATA as WEEK } from './fling/week.js';
import { DATA as EVENTS } from './fling/events.js';
export const PERSONA = { id: 'fling', convos: [...NEW, ...WARM, ...CLOSE], texts: [...WEEK, ...EVENTS] };
