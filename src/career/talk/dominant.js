// The Dominant: commanding, assertive, decisive, competitive, protective, a little possessive. Books the table before
// you ask, tells you where to stand for the photo, issues playful orders ('sit', 'eat something before your race'),
// hates losing and keeps score. Confident, never coercive: a no is respected - they can be stung, sardonic, or rise to
// the challenge in words. Coldness is a challenge they respect early, defiance once you're together; passive lets them
// take the wheel; flirting they escalate and lead; risque they meet head-on, even at first, in charge of the tempo.
// The arc: power-play sparring -> testing whether you can keep up -> the protective, devoted side. Plain data (see the
// persona format); the parts live in ./dominant/.
import { DATA as NEW } from './dominant/new.js';
import { DATA as WARM } from './dominant/warm.js';
import { DATA as CLOSE } from './dominant/close.js';
import { DATA as WEEK } from './dominant/week.js';
import { DATA as EVENTS } from './dominant/events.js';

export const PERSONA = { id: 'dominant', convos: [...NEW, ...WARM, ...CLOSE], texts: [...WEEK, ...EVENTS] };
