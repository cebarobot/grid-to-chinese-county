import type { GridBounds, GridPolygon } from '@grid-to-chinese-county/shared-types';

export function buildGridPolygon(bounds: GridBounds): GridPolygon {
  return {
    coordinates: [
      [bounds.minLon, bounds.minLat],
      [bounds.maxLon, bounds.minLat],
      [bounds.maxLon, bounds.maxLat],
      [bounds.minLon, bounds.maxLat],
      [bounds.minLon, bounds.minLat]
    ]
  };
}
