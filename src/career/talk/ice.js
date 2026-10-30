// ALOOF (ice): cool, sharp, sophisticated, guarded, dry, observant. High standards; they test people, notice
// everything and say less than they think - a raised eyebrow in words; when the softness comes (late) it lands hard.
// Coldness earns grudging respect early but reads as you pulling away once you're together; eager flirting at first
// reads as cheap, later it lands and they flirt back slow and understated; a dare at warm is something they might
// accept with a look, at close it shows the heat under the ice. v2 story-slot data: ./ice/ (see the persona format).
import { DATA as NEW } from './ice/new.js';
import { DATA as WARM } from './ice/warm.js';
import { DATA as CLOSE } from './ice/close.js';
import { DATA as WEEK } from './ice/week.js';
import { DATA as EVENTS } from './ice/events.js';
export const PERSONA = { id: 'ice', convos: [...NEW, ...WARM, ...CLOSE], texts: [...WEEK, ...EVENTS] };
