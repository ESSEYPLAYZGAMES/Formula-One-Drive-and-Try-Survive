// Sunny: the sunshine. Warm, easygoing, sincere, a bit dorky, curious about you,
// remembers small things, roots for you, goes pink and giggly when flirted with.
import { DATA as newConvos } from './sunny/new.js';
import { DATA as warmConvos } from './sunny/warm.js';
import { DATA as closeConvos } from './sunny/close.js';
import { DATA as texts } from './sunny/texts.js';

export const PERSONA = {
  id: 'sunny',
  convos: [...newConvos, ...warmConvos, ...closeConvos],
  texts,
};
