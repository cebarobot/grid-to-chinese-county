import { readFile } from 'node:fs/promises';
import { buildCountyIndex, type CountyIndex } from './countyIndex.js';
import type { CountyFeatureCollection } from './countyNormalizer.js';

export const DEFAULT_CHINA_COUNTY_GEOJSON_URL = new URL('../../../../geojson/中国_县.geojson', import.meta.url);

export async function loadCountyFeatureCollection(
  source: string | URL = DEFAULT_CHINA_COUNTY_GEOJSON_URL
): Promise<CountyFeatureCollection> {
  const content = await readFile(source, 'utf8');

  return JSON.parse(content) as CountyFeatureCollection;
}

export async function loadChinaCountyIndex(
  source: string | URL = DEFAULT_CHINA_COUNTY_GEOJSON_URL
): Promise<CountyIndex> {
  return buildCountyIndex(await loadCountyFeatureCollection(source));
}
