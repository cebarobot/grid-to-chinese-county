import { beforeAll, describe, expect, it } from 'vitest';
import {
  loadChinaCountyIndex,
  queryLocator,
  type CountyIndex
} from '../../packages/core/src/index.js';

let countyIndex: CountyIndex;

beforeAll(async () => {
  countyIndex = await loadChinaCountyIndex();
});

describe('queryLocator with real China county GeoJSON', () => {
  it('returns Yanta and Changan for om44le', () => {
    const result = queryLocator('om44le', countyIndex);

    expect(result.candidates).toEqual([
      {
        name: '雁塔区',
        gbCode: '156610113'
      },
      {
        name: '长安区',
        gbCode: '156610116'
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

  it('returns Haidian for on80cb', () => {
    const result = queryLocator('on80cb', countyIndex);

    expect(result.candidates).toEqual([
      {
        name: '海淀区',
        gbCode: '156110108'
      }
    ]);
    expect(result.warnings).toEqual([]);
  });

  it('returns boundary candidates for on70tc', () => {
    const result = queryLocator('on70tc', countyIndex);

    expect(result.candidates).toEqual([
      {
        name: '门头沟区',
        gbCode: '156110109'
      },
      {
        name: '怀来县',
        gbCode: '156130730'
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

  it('returns coarse-grid multi-match for NM54', () => {
    const result = queryLocator('NM54', countyIndex);

    expect(result.candidates).toEqual([
      {
        name: '治多县',
        gbCode: '156632724'
      },
      {
        name: '格尔木市',
        gbCode: '156632801'
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