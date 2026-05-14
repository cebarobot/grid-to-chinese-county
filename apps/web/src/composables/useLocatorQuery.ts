import {
  LocatorParseError,
  buildQueryResult,
  exactMatchCounties,
  filterCountyCandidates,
  parseLocator,
  type ParsedLocator,
  type QueryResult
} from '@grid-to-chinese-county/core/browser';
import { computed, ref, shallowRef } from 'vue';
import {
  loadCountyQueryResources,
  pickMatchedCountyFeatures,
  type CountyQueryResources,
  type MatchedCountyFeature
} from '../services/countyData';

type AssetStatus = 'idle' | 'loading' | 'ready' | 'error';
type SubmitStatus = 'idle' | 'loading';

export function useLocatorQuery() {
  const locatorInput = ref('on80cb');
  const assetStatus = ref<AssetStatus>('idle');
  const assetMessage = ref('首次查询需要加载县级 GeoJSON 与索引，请稍候。');
  const submitStatus = ref<SubmitStatus>('idle');
  const result = ref<QueryResult | null>(null);
  const parsedLocator = ref<ParsedLocator | null>(null);
  const matchedFeatures = ref<MatchedCountyFeature[]>([]);
  const errorMessage = ref<string | null>(null);
  const hasSearched = ref(false);
  const resources = shallowRef<CountyQueryResources | null>(null);

  async function ensureResources(): Promise<CountyQueryResources> {
    if (resources.value !== null) {
      return resources.value;
    }

    assetStatus.value = 'loading';
    assetMessage.value = '正在加载县级 GeoJSON 与 bbox 索引，首次查询可能需要较长时间。';

    try {
      resources.value = await loadCountyQueryResources();
      assetStatus.value = 'ready';
      assetMessage.value = '县级数据已加载完成。';
      return resources.value;
    } catch (error) {
      assetStatus.value = 'error';
      assetMessage.value = error instanceof Error ? error.message : '县级数据加载失败。';
      throw error;
    }
  }

  async function submit(): Promise<void> {
    submitStatus.value = 'loading';
    errorMessage.value = null;
    hasSearched.value = true;

    try {
      const parsed = parseLocator(locatorInput.value);
      const countyResources = await ensureResources();
      const candidates = filterCountyCandidates(countyResources.countyIndex, parsed.bounds);
      const matches = exactMatchCounties(parsed, candidates);

      parsedLocator.value = parsed;
      result.value = buildQueryResult(parsed, matches);
      matchedFeatures.value = pickMatchedCountyFeatures(countyResources.collection, result.value.candidates);
    } catch (error) {
      parsedLocator.value = null;
      result.value = null;
      matchedFeatures.value = [];

      if (error instanceof LocatorParseError || error instanceof Error) {
        errorMessage.value = error.message;
      } else {
        throw error;
      }
    } finally {
      submitStatus.value = 'idle';
    }
  }

  const resultSummary = computed(() => {
    if (errorMessage.value !== null) {
      return '请修正输入后重新查询。';
    }

    if (result.value === null) {
      return '查询完成后，这里会列出命中的县级行政区及提示。';
    }

    return `当前命中 ${result.value.candidates.length} 个候选行政区。`;
  });

  return {
    locatorInput,
    assetStatus,
    assetMessage,
    submit,
    submitStatus,
    result,
    parsedLocator,
    matchedFeatures,
    errorMessage,
    hasSearched,
    resultSummary
  };
}
