import booleanIntersects from '@turf/boolean-intersects';
import { polygon } from '@turf/helpers';
import type { ParsedLocator } from '@grid-to-xian/shared-types';
import type { Feature, GeoJsonProperties, Polygon as GeoJsonPolygon } from 'geojson';
import type { CountyGeometry, CountyRecord } from '../data/countyNormalizer.js';

function createCountyFeature(county: CountyRecord): Feature<CountyGeometry, GeoJsonProperties> {
  return {
    type: 'Feature',
    properties: {},
    geometry: county.geometry
  };
}

function createGridFeature(parsed: ParsedLocator): Feature<GeoJsonPolygon, GeoJsonProperties> {
  return polygon([parsed.polygon.coordinates]);
}

export function exactMatchCounties(parsed: ParsedLocator, counties: CountyRecord[]): CountyRecord[] {
  const gridFeature = createGridFeature(parsed);
  const matches: CountyRecord[] = [];

  for (const county of counties) {
    const countyFeature = createCountyFeature(county);
    const intersects = booleanIntersects(gridFeature, countyFeature);

    if (intersects) {
      matches.push(county);
    }
  }
  return matches;
}
