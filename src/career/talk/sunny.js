// Sunny (shown as SWEET): warm, sincere, a bit dorky; curious about you, remembers the small things, roots for you,
// goes pink and giggly when flirted with. Story slots per stage, three opening moods each (talk-spec v2).
import { DATA as NEW } from './sunny/new.js';
import { DATA as WARM } from './sunny/warm.js';
import { DATA as CLOSE } from './sunny/close.js';
import { DATA as WEEK } from './sunny/week.js';
import { DATA as EVENTS } from './sunny/events.js';
export const PERSONA = { id: 'sunny', convos: [...NEW, ...WARM, ...CLOSE], texts: [...WEEK, ...EVENTS] };
