// THE SPARK - bubbly, playful, impulsive, magnetic. A big laugh, dares and games, everything turned into an adventure
// ('race you to the bar', 'the karting place shuts in ten minutes...'). Fast-talking, teasing, easily excited, loves an
// audience and loves being chased, a little chaotic. Flirty is their favourite (they fire straight back and escalate the
// game); a bold line thrills them once things are warm; passive bores them a little, so they poke for a reaction; cold
// stings fast - hurt for a moment, then sulky or sassy, and you have to work to get the fun back.
// Plain dialogue data (see the talk format): in-person convos by stage, and the phone.
import NEW from './spark/new.js';
import WARM from './spark/warm.js';
import CLOSE from './spark/close.js';
import TEXTS from './spark/texts.js';

export default {
  id: 'spark',
  convos: [...NEW, ...WARM, ...CLOSE],
  texts: TEXTS,
};
