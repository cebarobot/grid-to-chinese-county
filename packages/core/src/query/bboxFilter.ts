import type { GridBounds } from '@grid-to-chinese-county/shared-types';
import { boundsIntersect, type CountyIndex } from '../data/countyIndex.js';
import type { CountyRecord } from '../data/countyNormalizer.js';

export function filterCountyCandidates(index: CountyIndex, bounds: GridBounds): CountyRecord[] {
  return index.counties.filter((county) => boundsIntersect(county.bbox, bounds));
}
