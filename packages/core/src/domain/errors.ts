export const LOCATOR_ERROR_CODES = {
  EMPTY: 'EMPTY',
  INVALID_LENGTH: 'INVALID_LENGTH',
  INVALID_FIELD: 'INVALID_FIELD',
  INVALID_SQUARE: 'INVALID_SQUARE',
  INVALID_SUBSQUARE: 'INVALID_SUBSQUARE',
  INVALID_EXTENDED: 'INVALID_EXTENDED'
} as const;

export type LocatorErrorCode = (typeof LOCATOR_ERROR_CODES)[keyof typeof LOCATOR_ERROR_CODES];

export class LocatorParseError extends Error {
  public readonly code: LocatorErrorCode;

  public constructor(code: LocatorErrorCode, message: string) {
    super(message);
    this.name = 'LocatorParseError';
    this.code = code;
  }
}
