import type { GridBounds } from '@grid-to-xian/shared-types';
import type { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson';

export interface CountyFeatureProperties {
  name: string;
  gb: string;
}

export type CountyGeometry = Polygon | MultiPolygon;

export type CountyFeature = Feature<CountyGeometry, CountyFeatureProperties>;

export type CountyFeatureCollection = FeatureCollection<CountyGeometry, CountyFeatureProperties>;

export interface CountyRecord {
  name: string;
  gbCode: string;
  geometry: CountyGeometry;
  bbox: GridBounds;
}

function createBounds(position: Position): GridBounds {
  const lon = position[0]!;
  const lat = position[1]!;

  return {
    minLon: lon,
    minLat: lat,
    maxLon: lon,
    maxLat: lat
  };
}

function extendBounds(bounds: GridBounds, position: Position): void {
  const lon = position[0]!;
  const lat = position[1]!;

  bounds.minLon = Math.min(bounds.minLon, lon);
  bounds.minLat = Math.min(bounds.minLat, lat);
  bounds.maxLon = Math.max(bounds.maxLon, lon);
  bounds.maxLat = Math.max(bounds.maxLat, lat);
}

function mergeBounds(target: GridBounds, source: GridBounds): void {
  target.minLon = Math.min(target.minLon, source.minLon);
  target.minLat = Math.min(target.minLat, source.minLat);
  target.maxLon = Math.max(target.maxLon, source.maxLon);
  target.maxLat = Math.max(target.maxLat, source.maxLat);
}

function computePolygonBounds(coordinates: Position[][]): GridBounds {
  const bounds = createBounds(coordinates[0]![0]!);

  for (const ring of coordinates) {
    for (const position of ring) {
      extendBounds(bounds, position);
    }
  }

  return bounds;
}

export function computeCountyBounds(geometry: CountyGeometry): GridBounds {
  if (geometry.type === 'Polygon') {
    return computePolygonBounds(geometry.coordinates);
  }

  const bounds = computePolygonBounds(geometry.coordinates[0]!);

  for (let polygonIndex = 1; polygonIndex < geometry.coordinates.length; polygonIndex += 1) {
    mergeBounds(bounds, computePolygonBounds(geometry.coordinates[polygonIndex]!));
  }

  return bounds;
}

export function normalizeCountyFeature(feature: CountyFeature): CountyRecord {
  return {
    name: feature.properties.name,
    gbCode: feature.properties.gb,
    geometry: feature.geometry,
    bbox: computeCountyBounds(feature.geometry)
  };
}
