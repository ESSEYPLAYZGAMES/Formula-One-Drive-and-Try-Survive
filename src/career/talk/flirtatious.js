// FLIRTATIOUS - seductive, bold, sultry, teasing, magnetic: the most openly flirtatious personality in the game. Every
// line can turn into innuendo, eye contact is a sport ('you blinked'), they enjoy the chase from both ends and say
// exactly what they want. Not shallow: underneath there's wit, a grandmother called Vivi who taught them all the rules,
// and - once it's close - genuine feeling they're less sure how to handle. Flirty is their language (they raise the
// stakes); a risque line is welcome even at first (they answer in kind - suggestive, never explicit); passive is a bit
// dull (they try to tempt you into playing); cold bores or irritates them - sulky, smouldering, 'I'll make you regret that'.
// Plain dialogue data (talk format v2): in-person story slots by stage, and the phone.
import { DATA as NEW } from './flirtatious/new.js';
import { DATA as WARM } from './flirtatious/warm.js';
import { DATA as CLOSE } from './flirtatious/close.js';
import { DATA as WEEK } from './flirtatious/week.js';
import { DATA as EVENTS } from './flirtatious/events.js';

export const PERSONA = { id: 'flirtatious', convos: [...NEW, ...WARM, ...CLOSE], texts: [...WEEK, ...EVENTS] };
