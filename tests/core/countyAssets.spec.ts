import { describe, expect, it } from 'vitest';
import {
  buildCountyIndexAsset,
  loadCountyFeatureCollection
} from '../../packages/core/src/index.js';

describe('county asset builders', () => {
  it('builds a bbox-only county index asset from a county fixture', async () => {
    const collection = await loadCountyFeatureCollection(new URL('../fixtures/county-fixture.geojson', import.meta.url));
    const indexAsset = buildCountyIndexAsset(collection);
    const alphaCounty = indexAsset[0]!;
    const betaCounty = indexAsset[1]!;

    expect(alphaCounty).toMatchObject({
      name: 'Alpha County',
      gbCode: '156000001'
    });
    expect(alphaCounty.bbox.minLon).toBeCloseTo(-74.5, 10);
    expect(betaCounty).toMatchObject({
      name: 'Beta County',
      gbCode: '156000002'
    });
    expect(indexAsset).toHaveLength(2);
  });
});
