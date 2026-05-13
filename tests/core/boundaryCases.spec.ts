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

describe('queryLocator boundary behavior', () => {
  it('returns multiple counties and a boundary warning near county borders', () => {
    const result = queryLocator('FN31PR', countyIndex);

    expect(result.candidates).toEqual([
      {
        name: 'Alpha County',
        gbCode: '156000001'
      },
      {
        name: 'Beta County',
        gbCode: '156000002'
      }
    ]);
    expect(result.warnings).toEqual([
      {
        code: 'MULTIPLE_CANDIDATES',
        message: 'The locator intersects multiple county candidates.'
      },
      {
        code: 'BOUNDARY_OVERLAP',
        message: 'The locator overlaps a county boundary.'
      }
    ]);
  });

  it('returns a coarse-grid warning for four-character locators', () => {
    const result = queryLocator('FN31', countyIndex);

    expect(result.candidates).toEqual([
      {
        name: 'Alpha County',
        gbCode: '156000001'
      },
      {
        name: 'Beta County',
        gbCode: '156000002'
      }
    ]);
    expect(result.warnings).toEqual([
      {
        code: 'MULTIPLE_CANDIDATES',
        message: 'The locator intersects multiple county candidates.'
      },
      {
        code: 'COARSE_GRID',
        message: 'The locator precision is coarse and may span a large area.'
      }
    ]);
  });
});