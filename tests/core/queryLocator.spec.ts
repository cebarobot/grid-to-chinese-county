import { beforeAll, describe, expect, it } from 'vitest';
import {
  buildCountyIndex,
  loadCountyFeatureCollection,
  queryLocator,
  type CountyIndex
} from '../../packages/core/src/index.js';

let countyIndex: CountyIndex;

beforeAll(async () => {
  const collection = await loadCountyFeatureCollection(new URL('../fixtures/county-fixture.geojson', import.meta.url));
  countyIndex = buildCountyIndex(collection);
});

describe('buildCountyIndex', () => {
  it('normalizes county properties and bounding boxes', () => {
    const alphaCounty = countyIndex.counties[0]!;

    expect(countyIndex.counties).toHaveLength(2);
    expect(alphaCounty).toMatchObject({
      name: 'Alpha County',
      gbCode: '156000001'
    });
    expect(alphaCounty.bbox.minLon).toBeCloseTo(-74.5, 10);
    expect(alphaCounty.bbox.maxLat).toBeCloseTo(42.5, 10);
  });
});

describe('queryLocator', () => {
  it('returns a single county for a locator fully inside one county', () => {
    const result = queryLocator('FN31AA', countyIndex);

    expect(result.candidates).toEqual([
      {
        name: 'Alpha County',
        gbCode: '156000001'
      }
    ]);
    expect(result.warnings).toEqual([]);
  });

  it('returns a no-match warning when the locator is outside the indexed area', () => {
    const result = queryLocator('AA00AA', countyIndex);

    expect(result.candidates).toEqual([]);
    expect(result.warnings).toEqual([
      {
        code: 'NO_MATCH',
        message: 'The locator does not intersect any county in the current index.'
      }
    ]);
  });
});
