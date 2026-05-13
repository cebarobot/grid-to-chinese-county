import type { LocatorErrorCode } from '../domain/errors.js';

interface BaseLocatorStepDefinition {
  errorCode: LocatorErrorCode;
  divisor: number;
}

interface LetterLocatorStepDefinition {
  symbolKind: 'letter';
  minLetter: string;
  maxLetter: string;
}

interface DigitLocatorStepDefinition {
  symbolKind: 'digit';
}

export type LocatorStepDefinition = BaseLocatorStepDefinition &
  (LetterLocatorStepDefinition | DigitLocatorStepDefinition);

export function getLocatorStepDefinition(pairIndex: number): LocatorStepDefinition {
  if (pairIndex % 2 === 0) {
    if (pairIndex === 0) {
      return {
        errorCode: 'INVALID_FIELD',
        divisor: 18,
        symbolKind: 'letter',
        minLetter: 'A',
        maxLetter: 'R'
      };
    }

    return {
      errorCode: 'INVALID_SUBSQUARE',
      divisor: 24,
      symbolKind: 'letter',
      minLetter: 'A',
      maxLetter: 'X'
    };
  }

  if (pairIndex === 1) {
    return {
      errorCode: 'INVALID_SQUARE',
      divisor: 10,
      symbolKind: 'digit',
    };
  }

  return {
    errorCode: 'INVALID_EXTENDED',
    divisor: 10,
    symbolKind: 'digit',
  };
}
