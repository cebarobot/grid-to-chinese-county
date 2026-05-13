import booleanIntersects from '@turf/boolean-intersects';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
import type { ParsedLocator } from '@grid-to-xian/shared-types';
import type { Feature, GeoJsonProperties, Polygon as GeoJsonPolygon } from 'geojson';
import type { CountyGeometry, CountyRecord } from '../data/countyNormalizer.js';

export interface CountyMatch extends CountyRecord {
  centerHit: boolean;
  cornerHitCount: number;
  intersects: boolean;
  boundaryOverlap: boolean;
}

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

export function exactMatchCounties(parsed: ParsedLocator, counties: CountyRecord[]): CountyMatch[] {
  const gridFeature = createGridFeature(parsed);
  const centerPoint = point([parsed.center.lon, parsed.center.lat]);
  const cornerPoints = parsed.corners.map((corner) => point([corner.lon, corner.lat]));
  const matches: CountyMatch[] = [];

  for (const county of counties) {
    const countyFeature = createCountyFeature(county);
    const centerHit = booleanPointInPolygon(centerPoint, countyFeature);
    const cornerHitCount = cornerPoints.filter((cornerPoint) => booleanPointInPolygon(cornerPoint, countyFeature)).length;
    const intersects = booleanIntersects(gridFeature, countyFeature);

    if (!centerHit && cornerHitCount === 0 && !intersects) {
      continue;
    }

    matches.push({
      ...county,
      centerHit,
      cornerHitCount,
      intersects,
      boundaryOverlap: intersects && (!centerHit || cornerHitCount < cornerPoints.length)
    });
  }

  return matches;
}
