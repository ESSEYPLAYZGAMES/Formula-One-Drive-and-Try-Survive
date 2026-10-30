// Sunny: the sunshine. Warm, easygoing, sincere, a bit dorky, curious about you,
// remembers small things, roots for you, goes pink and giggly when flirted with.
import newConvos from './sunny/new.js';
import warmConvos from './sunny/warm.js';
import closeConvos from './sunny/close.js';
import texts from './sunny/texts.js';

export default {
  id: 'sunny',
  convos: [...newConvos, ...warmConvos, ...closeConvos],
  texts,
};
