import { LOCATOR_ERROR_CODES, LocatorParseError } from '../domain/errors.js';

function isLetterPair(pairIndex: number): boolean {
  if (pairIndex === 0) {
    return true;
  }

  if (pairIndex === 1) {
    return false;
  }

  return pairIndex % 2 === 0;
}

export function normalizeLocator(input: string): string {
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    throw new LocatorParseError(LOCATOR_ERROR_CODES.EMPTY, 'Locator must not be empty.');
  }

  if (trimmed.length % 2 !== 0) {
    throw new LocatorParseError(
      LOCATOR_ERROR_CODES.INVALID_LENGTH,
      'Locator length must be an even number of characters.'
    );
  }

  let normalized = '';
  const pairCount = trimmed.length / 2;

  for (let pairIndex = 0; pairIndex < pairCount; pairIndex += 1) {
    const pair = trimmed.slice(pairIndex * 2, pairIndex * 2 + 2);

    normalized += isLetterPair(pairIndex) ? pair.toUpperCase() : pair;
  }

  return normalized;
}
