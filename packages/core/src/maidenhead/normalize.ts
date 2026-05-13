import { LOCATOR_ERROR_CODES, LocatorParseError } from '../domain/errors.js';

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

  return trimmed.toUpperCase();
}
