import type { LocatorPairKind } from '@grid-to-xian/shared-types';

export interface LocatorStepDefinition {
  pairIndex: number;
  kind: LocatorPairKind;
  divisor: number;
  lonBaseSpan: number;
  latBaseSpan: number;
  minCharCode?: number;
  maxCharCode?: number;
}

export function getLocatorStepDefinition(pairIndex: number): LocatorStepDefinition {
  if (pairIndex === 0) {
    return {
      pairIndex,
      kind: 'field',
      divisor: 18,
      lonBaseSpan: 20,
      latBaseSpan: 10,
      minCharCode: 65,
      maxCharCode: 82
    };
  }

  if (pairIndex === 1) {
    return {
      pairIndex,
      kind: 'square',
      divisor: 10,
      lonBaseSpan: 2,
      latBaseSpan: 1
    };
  }

  if (pairIndex % 2 === 0) {
    return {
      pairIndex,
      kind: pairIndex === 2 ? 'subsquare' : 'extended-letter',
      divisor: 24,
      lonBaseSpan: 0,
      latBaseSpan: 0,
      minCharCode: 65,
      maxCharCode: 88
    };
  }

  return {
    pairIndex,
    kind: 'extended-digit',
    divisor: 10,
    lonBaseSpan: 0,
    latBaseSpan: 0
  };
}
