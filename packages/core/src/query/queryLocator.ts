import type { QueryResult } from '@grid-to-chinese-county/shared-types';
import { buildCountyIndex, type CountyIndex } from '../data/countyIndex.js';
import type { CountyFeatureCollection } from '../data/countyNormalizer.js';
import { parseLocator } from '../maidenhead/parseLocator.js';
import { filterCountyCandidates } from './bboxFilter.js';
import { exactMatchCounties } from './exactMatch.js';
import { buildQueryResult } from './resultBuilder.js';

export function queryLocator(locator: string, countyIndex: CountyIndex): QueryResult {
  const parsed = parseLocator(locator);
  const candidates = filterCountyCandidates(countyIndex, parsed.bounds);
  const matches = exactMatchCounties(parsed, candidates);

  return buildQueryResult(parsed, matches);
}

export function queryLocatorInCollection(
  locator: string,
  collection: CountyFeatureCollection
): QueryResult {
  return queryLocator(locator, buildCountyIndex(collection));
}
