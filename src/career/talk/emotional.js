// Emotional (shown as EMOTIONAL): sensitive, romantic, tender, expressive, a little insecure - wears their heart on
// their sleeve, feels everything at full volume, writes the small moments down. Hurt shows as honesty, not silence.
// Story slots per stage, three opening moods each (talk-spec v2).
import { DATA as NEW } from './emotional/new.js';
import { DATA as WARM } from './emotional/warm.js';
import { DATA as CLOSE } from './emotional/close.js';
import { DATA as WEEK } from './emotional/week.js';
import { DATA as EVENTS } from './emotional/events.js';
export const PERSONA = { id: 'emotional', convos: [...NEW, ...WARM, ...CLOSE], texts: [...WEEK, ...EVENTS] };
