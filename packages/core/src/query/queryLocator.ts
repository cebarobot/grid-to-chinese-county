import type { QueryResult } from '@grid-to-xian/shared-types';
import { buildCountyIndex, type CountyIndex } from '../data/countyIndex.js';
import {
  DEFAULT_CHINA_COUNTY_GEOJSON_URL,
  loadChinaCountyIndex,
  loadCountyFeatureCollection
} from '../data/countyLoader.js';
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

export async function queryChinaCountyLocator(
  locator: string,
  source: string | URL = DEFAULT_CHINA_COUNTY_GEOJSON_URL
): Promise<QueryResult> {
  return queryLocator(locator, await loadChinaCountyIndex(source));
}

export async function queryLocatorFromCollectionFile(
  locator: string,
  source: string | URL
): Promise<QueryResult> {
  return queryLocatorInCollection(locator, await loadCountyFeatureCollection(source));
}
