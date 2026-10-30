// The Ice: cool, sharp, sophisticated, guarded, high standards. Tests people, notices everything, says less than they
// think - a raised eyebrow in words. Coldness earns grudging respect early (they like someone who doesn't fawn) but
// reads as pulling away once you're together; eager flirting at first meeting reads as cheap, later it lands and they
// flirt back slow and understated; a dare at warm is something they might accept with a look, at close it shows the
// heat under the ice. Plain data (see the persona format); the parts live in ./ice/.
import { DATA as newConvos } from './ice/new.js';
import { DATA as warmConvos } from './ice/warm.js';
import { DATA as closeConvos } from './ice/close.js';
import { DATA as texts } from './ice/texts.js';
import { DATA as raceTexts } from './ice/races.js';

export const PERSONA = {
  id: 'ice',
  convos: [...newConvos, ...warmConvos, ...closeConvos],
  texts: [...texts, ...raceTexts],
};
