// scrabbleUtils.tsx

type LetterScores = {
  [key: string]: number;
};

export const letterScores: LetterScores = {
  A: 1,
  B: 3,
  C: 4,
  D: 1,
  E: 1,
  F: 4,
  G: 2,
  H: 2,
  I: 1,
  J: 6,
  K: 4,
  L: 2,
  M: 3,
  N: 1,
  O: 2,
  P: 4,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 6,
  W: 3,
  X: 8,
  Y: 10,
  Z: 3,
  Ä: 6,
  Ö: 8,
  Ü: 6,
};

export const getLetterScore = (letter: string): number => {
  return letterScores[letter.toUpperCase()] || 0;
};
