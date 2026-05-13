import { describe, expect, it } from 'vitest';
import { LocatorParseError, normalizeLocator, parseLocator } from '../../packages/core/src/index.js';

function expectCloseTo(actual: number, expected: number): void {
  expect(actual).toBeCloseTo(expected, 10);
}

describe('normalizeLocator', () => {
  it('normalizes whitespace and letter case by pair', () => {
    expect(normalizeLocator('  fn31pr45  ')).toBe('FN31PR45');
  });

  it('rejects empty locators', () => {
    expect(() => normalizeLocator('   ')).toThrow(LocatorParseError);
  });
});

describe('parseLocator', () => {
  it('parses a four-character locator into the expected bounds', () => {
    const parsed = parseLocator('FN31');

    expect(parsed.locator).toBe('FN31');
    expect(parsed.precision).toBe(4);
    expectCloseTo(parsed.bounds.minLon, -74);
    expectCloseTo(parsed.bounds.maxLon, -72);
    expectCloseTo(parsed.bounds.minLat, 41);
    expectCloseTo(parsed.bounds.maxLat, 42);
    expectCloseTo(parsed.resolution.lonSpan, 2);
    expectCloseTo(parsed.resolution.latSpan, 1);
  });

  it('parses a six-character locator and returns center, corners, and polygon', () => {
    const parsed = parseLocator('fn31pr');

    expect(parsed.locator).toBe('FN31PR');
    expect(parsed.corners).toHaveLength(4);
    expect(parsed.polygon.coordinates).toHaveLength(5);
    expectCloseTo(parsed.bounds.minLon, -72.75);
    expectCloseTo(parsed.bounds.maxLon, -72.6666666667);
    expectCloseTo(parsed.bounds.minLat, 41.7083333333);
    expectCloseTo(parsed.bounds.maxLat, 41.75);
    expectCloseTo(parsed.center.lon, -72.7083333333);
    expectCloseTo(parsed.center.lat, 41.7291666667);
  });

  it('supports extended precision locators', () => {
    const parsed = parseLocator('FN31PR45');

    expect(parsed.locator).toBe('FN31PR45');
    expectCloseTo(parsed.resolution.lonSpan, 1 / 120);
    expectCloseTo(parsed.resolution.latSpan, 1 / 240);
    expectCloseTo(parsed.bounds.minLon, -72.7166666667);
    expectCloseTo(parsed.bounds.minLat, 41.7291666667);
  });

  it('rejects odd-length locators', () => {
    expect(() => parseLocator('FN3')).toThrow(LocatorParseError);
  });

  it('rejects invalid field characters', () => {
    expect(() => parseLocator('ZN31')).toThrow(LocatorParseError);
  });

  it('rejects invalid subsquare characters', () => {
    expect(() => parseLocator('FN31P{')).toThrow(LocatorParseError);
  });
});