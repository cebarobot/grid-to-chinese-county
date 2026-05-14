import type {
  CountyFeatureCollection,
  CountyGeometry,
  CountyIndex,
  CountyIndexAsset,
  CountyRecord,
  QueryCandidate
} from '@grid-to-chinese-county/core/browser';
import countyGeojsonUrl from '../../../../geojson/中国_县.geojson?url';
import countyIndexUrl from '../../../../data/county-index.json?url';

export type MatchedCountyFeature = CountyFeatureCollection['features'][number];

export interface CountyQueryResources {
  countyIndex: CountyIndex;
  collection: CountyFeatureCollection;
}

let resourcesPromise: Promise<CountyQueryResources> | null = null;

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load ${path}.`);
  }

  return (await response.json()) as T;
}

function buildCountyIndexFromAssets(indexAsset: CountyIndexAsset, collection: CountyFeatureCollection): CountyIndex {
  const countyByCode = new Map<string, CountyIndexAsset[number]>();

  for (const county of indexAsset) {
    countyByCode.set(county.gbCode, county);
  }

  const counties: CountyRecord[] = collection.features.map((feature) => {
    const county = countyByCode.get(feature.properties.gb)!;

    return {
      name: county.name,
      gbCode: county.gbCode,
      bbox: county.bbox,
      geometry: feature.geometry as CountyGeometry
    };
  });

  return { counties };
}

export async function loadCountyQueryResources(): Promise<CountyQueryResources> {
  if (resourcesPromise !== null) {
    return resourcesPromise;
  }

  resourcesPromise = Promise.all([
    fetchJson<CountyIndexAsset>(countyIndexUrl),
    fetchJson<CountyFeatureCollection>(countyGeojsonUrl)
  ]).then(([indexAsset, collection]) => ({
    countyIndex: buildCountyIndexFromAssets(indexAsset, collection),
    collection
  }));

  return resourcesPromise;
}

export function pickMatchedCountyFeatures(
  collection: CountyFeatureCollection,
  candidates: QueryCandidate[]
): MatchedCountyFeature[] {
  const matchedGbCodes = new Set(candidates.map((candidate) => candidate.gbCode));

  return collection.features.filter((feature) => matchedGbCodes.has(feature.properties.gb));
}
