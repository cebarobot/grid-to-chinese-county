import type { QueryResult } from '@grid-to-xian/shared-types';
import {
  DEFAULT_CHINA_COUNTY_GEOJSON_URL,
  loadChinaCountyIndex,
  loadCountyFeatureCollection
} from '../data/countyLoader.js';
import { queryLocator, queryLocatorInCollection } from './queryLocator.js';

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