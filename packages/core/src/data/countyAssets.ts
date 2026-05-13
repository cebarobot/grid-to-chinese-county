import type { GridBounds } from '@grid-to-xian/shared-types';
import type { CountyFeatureCollection, CountyRecord } from './countyNormalizer.js';
import { buildCountyIndex } from './countyIndex.js';

export interface CountyIndexAssetItem {
  name: string;
  gbCode: string;
  bbox: GridBounds;
}

export type CountyIndexAsset = CountyIndexAssetItem[];

function toIndexAssetItem(county: CountyRecord): CountyIndexAssetItem {
  return {
    name: county.name,
    gbCode: county.gbCode,
    bbox: county.bbox
  };
}

export function buildCountyIndexAsset(collection: CountyFeatureCollection): CountyIndexAsset {
  const counties = buildCountyIndex(collection).counties;

  return counties.map(toIndexAssetItem);
}
