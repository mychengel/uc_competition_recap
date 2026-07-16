import { randomInt } from 'crypto';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function randomLetters(length = 8) {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHABET[randomInt(ALPHABET.length)];
  }
  return out;
}

export async function uniqueReportId(existingIds) {
  const taken = new Set(existingIds);
  let id = randomLetters();
  while (taken.has(id)) {
    id = randomLetters();
  }
  return id;
}
