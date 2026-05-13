interface BaseLocatorStepDefinition {
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
  if (pairIndex === 0) {
    return {
      divisor: 18,
      symbolKind: 'letter',
      minLetter: 'A',
      maxLetter: 'R'
    };
  }

  if (pairIndex % 2 === 0) {
    return {
      divisor: 24,
      symbolKind: 'letter',
      minLetter: 'A',
      maxLetter: 'X'
    };
  }

  return {
    divisor: 10,
    symbolKind: 'digit'
  };
}
