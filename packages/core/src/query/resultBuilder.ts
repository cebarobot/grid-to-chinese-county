import type { LocatorWarning, ParsedLocator, QueryCandidate, QueryResult } from '@grid-to-xian/shared-types';
import type { CountyMatch } from './exactMatch.js';

export const QUERY_WARNING_CODES = {
  NO_MATCH: 'NO_MATCH',
  MULTIPLE_CANDIDATES: 'MULTIPLE_CANDIDATES',
  BOUNDARY_OVERLAP: 'BOUNDARY_OVERLAP',
  COARSE_GRID: 'COARSE_GRID'
} as const;

function createWarning(code: string, message: string): LocatorWarning {
  return { code, message };
}

function buildCandidates(matches: CountyMatch[]): QueryCandidate[] {
  const candidatesByGbCode = new Map<string, QueryCandidate>();

  for (const match of matches) {
    candidatesByGbCode.set(match.gbCode, {
      name: match.name,
      gbCode: match.gbCode
    });
  }

  return [...candidatesByGbCode.values()].sort((left, right) => left.gbCode.localeCompare(right.gbCode));
}

export function buildQueryResult(parsed: ParsedLocator, matches: CountyMatch[]): QueryResult {
  const candidates = buildCandidates(matches);
  const warnings: LocatorWarning[] = [];

  if (candidates.length === 0) {
    warnings.push(
      createWarning(
        QUERY_WARNING_CODES.NO_MATCH,
        'The locator does not intersect any county in the current index.'
      )
    );
  }

  if (candidates.length > 1) {
    warnings.push(
      createWarning(
        QUERY_WARNING_CODES.MULTIPLE_CANDIDATES,
        'The locator intersects multiple county candidates.'
      )
    );
  }

  if (parsed.precision <= 4 && candidates.length > 0) {
    warnings.push(
      createWarning(
        QUERY_WARNING_CODES.COARSE_GRID,
        'The locator precision is coarse and may span a large area.'
      )
    );
  }

  if (parsed.precision > 4 && matches.some((match) => match.boundaryOverlap)) {
    warnings.push(
      createWarning(
        QUERY_WARNING_CODES.BOUNDARY_OVERLAP,
        'The locator overlaps a county boundary.'
      )
    );
  }

  return {
    locator: parsed.locator,
    candidates,
    warnings
  };
}
