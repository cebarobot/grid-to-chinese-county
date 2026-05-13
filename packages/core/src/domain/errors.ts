export const LOCATOR_ERROR_CODES = {
  EMPTY: 'EMPTY',
  INVALID_LENGTH: 'INVALID_LENGTH',
  INVALID_CHAR: 'INVALID_CHAR',
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
