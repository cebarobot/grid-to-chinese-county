import type { GridBounds } from '@grid-to-chinese-county/shared-types';
import {
  normalizeCountyFeature,
  type CountyFeatureCollection,
  type CountyRecord
} from './countyNormalizer.js';

export interface CountyIndex {
  counties: CountyRecord[];
}

export function buildCountyIndex(collection: CountyFeatureCollection): CountyIndex {
  return {
    counties: collection.features.map(normalizeCountyFeature)
  };
}

export function boundsIntersect(left: GridBounds, right: GridBounds): boolean {
  return (
    left.minLon <= right.maxLon &&
    left.maxLon >= right.minLon &&
    left.minLat <= right.maxLat &&
    left.maxLat >= right.minLat
  );
}
