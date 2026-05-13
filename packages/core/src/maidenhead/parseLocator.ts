import type { GeoPoint, GridBounds, ParsedLocator } from '@grid-to-xian/shared-types';
import { buildGridPolygon } from '../geometry/gridPolygon.js';
import { LOCATOR_ERROR_CODES, LocatorParseError } from '../domain/errors.js';
import { normalizeLocator } from './normalize.js';
import { getLocatorStepDefinition } from './steps.js';

function assertLetterRange(value: string, minCharCode: number, maxCharCode: number, code: string): number {
  const upper = value.toUpperCase();
  const charCode = upper.charCodeAt(0);

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

export function parseLocator(locator: string): ParsedLocator {
  const normalized = normalizeLocator(locator);
  const pairCount = normalized.length / 2;

  let minLon = -180;
  let minLat = -90;
  let lonSpan = 20;
  let latSpan = 10;

  for (let pairIndex = 0; pairIndex < pairCount; pairIndex += 1) {
    const lonChar = normalized.charAt(pairIndex * 2);
    const latChar = normalized.charAt(pairIndex * 2 + 1);
    const step = getLocatorStepDefinition(pairIndex);

    if (pairIndex === 0) {
      minLon += assertLetterRange(
        lonChar,
        step.minCharCode ?? 65,
        step.maxCharCode ?? 82,
        LOCATOR_ERROR_CODES.INVALID_FIELD
      ) * step.lonBaseSpan;
      minLat += assertLetterRange(
        latChar,
        step.minCharCode ?? 65,
        step.maxCharCode ?? 82,
        LOCATOR_ERROR_CODES.INVALID_FIELD
      ) * step.latBaseSpan;
      lonSpan = step.lonBaseSpan;
      latSpan = step.latBaseSpan;
      continue;
    }

    if (pairIndex === 1) {
      lonSpan = step.lonBaseSpan;
      latSpan = step.latBaseSpan;
      minLon += assertDigit(lonChar, LOCATOR_ERROR_CODES.INVALID_SQUARE) * lonSpan;
      minLat += assertDigit(latChar, LOCATOR_ERROR_CODES.INVALID_SQUARE) * latSpan;
      continue;
    }

    if (step.kind === 'subsquare' || step.kind === 'extended-letter') {
      lonSpan /= step.divisor;
      latSpan /= step.divisor;
      minLon += assertLetterRange(
        lonChar,
        step.minCharCode ?? 65,
        step.maxCharCode ?? 88,
        LOCATOR_ERROR_CODES.INVALID_SUBSQUARE
      ) * lonSpan;
      minLat += assertLetterRange(
        latChar,
        step.minCharCode ?? 65,
        step.maxCharCode ?? 88,
        LOCATOR_ERROR_CODES.INVALID_SUBSQUARE
      ) * latSpan;
      continue;
    }

    lonSpan /= step.divisor;
    latSpan /= step.divisor;
    minLon += assertDigit(lonChar, LOCATOR_ERROR_CODES.INVALID_EXTENDED) * lonSpan;
    minLat += assertDigit(latChar, LOCATOR_ERROR_CODES.INVALID_EXTENDED) * latSpan;
  }

  const bounds: GridBounds = {
    minLon,
    minLat,
    maxLon: minLon + lonSpan,
    maxLat: minLat + latSpan
  };
  const center: GeoPoint = {
    lon: minLon + lonSpan / 2,
    lat: minLat + latSpan / 2
  };

  return {
    locator: normalized,
    precision: normalized.length,
    bounds,
    center,
    corners: buildCorners(bounds),
    polygon: buildGridPolygon(bounds),
    resolution: {
      lonSpan,
      latSpan
    }
  };
}
