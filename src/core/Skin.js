// Skin tones for everyone the game generates (crowds, extras, locals, fans): one broad palette, porcelain to the
// deepest browns, with the undertones real skin has - pink and cool fair, warm and golden, olive, red-brown, deep
// neutral and deep cool - so a room of strangers never looks like six people repeated. Pure (no three.js): the career
// modules that run under Node use it too.
//   SKIN_LIGHT: fair to medium      SKIN_DEEP: tan to the deepest      SKIN_ALL: both, light to deep
export const SKIN_LIGHT = [
  '#f9e6d8', '#f6dece', '#f4d7c4', '#f2d3bd', '#efd0b6', '#f1d8c2', '#ecc9ac', '#e9c4a4', '#e6c19d', '#e3bb96',
  '#e4c2a0', '#dfb68f', '#ddb894', '#d9b08a', '#d6ac86', '#d3a47c', '#d1a983', '#cda07a', '#c99a72', '#c7a07a',
  '#c4966c', '#bf9068',
];
export const SKIN_DEEP = [
  '#bb8a62', '#b5835c', '#b07c57', '#ab7a55', '#a8754f', '#a2714e', '#9e6c4a', '#98674a', '#946345', '#8e5e42',
  '#8b5c3c', '#85573a', '#7d5136', '#784e37', '#70472f', '#6a442f', '#64402b', '#5e3c2a', '#573623', '#523425',
  '#4b2e1f', '#462c21', '#3f271b', '#3a251c', '#33201a', '#2d1d17',
];
export const SKIN_ALL = [...SKIN_LIGHT, ...SKIN_DEEP];
