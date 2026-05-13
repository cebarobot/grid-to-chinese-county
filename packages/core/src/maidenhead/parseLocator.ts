import type { GeoPoint, GridBounds, ParsedLocator } from '@grid-to-xian/shared-types';
import { buildGridPolygon } from '../geometry/gridPolygon.js';
import { LocatorParseError } from '../domain/errors.js';
import { normalizeLocator } from './normalize.js';
import type { LocatorStepDefinition } from './steps.js';
import { getLocatorStepDefinition } from './steps.js';

const EARTH_LON_SPAN = 360;
const EARTH_LAT_SPAN = 180;

function assertLetterRange(value: string, minLetter: string, maxLetter: string, code: string): number {
  const upper = value.toUpperCase();
  const charCode = upper.charCodeAt(0);
  const minCharCode = minLetter.charCodeAt(0);
  const maxCharCode = maxLetter.charCodeAt(0);

  if (charCode < minCharCode || charCode > maxCharCode) {
    throw new LocatorParseError(code as never, `Invalid locator pair "${value}".`);
  }

  return charCode - minCharCode;
}

function assertDigit(value: string, code: string): number {
  const digit = Number.parseInt(value, 10);

  if (!Number.isInteger(digit) || digit < 0 || digit > 9) {
    throw new LocatorParseError(code as never, `Invalid locator pair "${value}".`);
  }

  return digit;
}

function buildCorners(bounds: GridBounds): GeoPoint[] {
  return [
    { lon: bounds.minLon, lat: bounds.minLat },
    { lon: bounds.maxLon, lat: bounds.minLat },
    { lon: bounds.maxLon, lat: bounds.maxLat },
    { lon: bounds.minLon, lat: bounds.maxLat }
  ];
}

function getPairIndex(value: string, step: LocatorStepDefinition): number {
  if (step.symbolKind === 'letter') {
    return assertLetterRange(value, step.minLetter, step.maxLetter, step.errorCode);
  }

  return assertDigit(value, step.errorCode);
}

function getNextSpan(
  currentLonSpan: number,
  currentLatSpan: number,
  step: LocatorStepDefinition
): { lonSpan: number; latSpan: number } {
  return {
    lonSpan: currentLonSpan / step.divisor,
    latSpan: currentLatSpan / step.divisor
  };
}

export function parseLocator(locator: string): ParsedLocator {
  const normalized = normalizeLocator(locator);
  const pairCount = normalized.length / 2;

  let minLon = -180;
  let minLat = -90;
  let currentLonSpan = EARTH_LON_SPAN;
  let currentLatSpan = EARTH_LAT_SPAN;

  for (let pairIndex = 0; pairIndex < pairCount; pairIndex += 1) {
    const lonChar = normalized.charAt(pairIndex * 2);
    const latChar = normalized.charAt(pairIndex * 2 + 1);
    const step = getLocatorStepDefinition(pairIndex);
    const nextSpan = getNextSpan(currentLonSpan, currentLatSpan, step);
    const lonIndex = getPairIndex(lonChar, step);
    const latIndex = getPairIndex(latChar, step);

    currentLonSpan = nextSpan.lonSpan;
    currentLatSpan = nextSpan.latSpan;
    minLon += lonIndex * currentLonSpan;
    minLat += latIndex * currentLatSpan;
  }

  const bounds: GridBounds = {
    minLon,
    minLat,
    maxLon: minLon + currentLonSpan,
    maxLat: minLat + currentLatSpan
  };
  const center: GeoPoint = {
    lon: minLon + currentLonSpan / 2,
    lat: minLat + currentLatSpan / 2
  };

  return {
    locator: normalized,
    precision: normalized.length,
    bounds,
    center,
    corners: buildCorners(bounds),
    polygon: buildGridPolygon(bounds),
    resolution: {
      lonSpan: currentLonSpan,
      latSpan: currentLatSpan
    }
  };
}
