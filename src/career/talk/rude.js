// RUDE - blunt, sarcastic, contrarian, hard to impress; roasts everyone (you included) and is secretly soft about it.
import { DATA as NEW } from './rude/new.js';
import { DATA as WARM } from './rude/warm.js';
import { DATA as CLOSE } from './rude/close.js';
import { DATA as WEEK } from './rude/week.js';
import { DATA as EVENTS } from './rude/events.js';
export const PERSONA = { id: 'rude', convos: [...NEW, ...WARM, ...CLOSE], texts: [...WEEK, ...EVENTS] };
