export interface GridBounds {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

export interface GeoPoint {
  lon: number;
  lat: number;
}

export interface GridResolution {
  lonSpan: number;
  latSpan: number;
}

export interface GridPolygon {
  coordinates: [number, number][];
}

export interface ParsedLocator {
  locator: string;
  precision: number;
  bounds: GridBounds;
  center: GeoPoint;
  corners: GeoPoint[];
  polygon: GridPolygon;
  resolution: GridResolution;
}

export interface LocatorWarning {
  code: string;
  message: string;
}

export interface QueryCandidate {
  name: string;
  gbCode: string;
}

export interface QueryResult {
  locator: string;
  candidates: QueryCandidate[];
  warnings: LocatorWarning[];
}

export type LocatorPairKind = 'field' | 'square' | 'subsquare' | 'extended-letter' | 'extended-digit';
