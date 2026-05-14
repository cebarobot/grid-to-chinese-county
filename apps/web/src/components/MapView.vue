<script setup lang="ts">
import type { ParsedLocator } from '@grid-to-xian/core/browser';
import { onMounted, ref, watch } from 'vue';
import { useLeafletMap } from '../composables/useLeafletMap';
import type { MatchedCountyFeature } from '../services/countyData';

const props = defineProps<{
  parsedLocator: ParsedLocator | null;
  matchedFeatures: MatchedCountyFeature[];
  loadingMessage: string | null;
}>();

const mapRoot = ref<HTMLElement | null>(null);
const { renderOverlays } = useLeafletMap(mapRoot);

onMounted(() => {
  renderOverlays(props.parsedLocator, props.matchedFeatures);
});

watch(
  () => [props.parsedLocator, props.matchedFeatures] as const,
  ([parsedLocator, matchedFeatures]) => {
    renderOverlays(parsedLocator, matchedFeatures);
  },
  {
    deep: true
  }
);
</script>

<template>
  <section class="map-frame">
    <div ref="mapRoot" class="map-canvas"></div>

    <div v-if="loadingMessage !== null" class="map-overlay map-overlay--loading">
      <strong>正在加载县级 GeoJSON…</strong>
      <p>{{ loadingMessage }}</p>
    </div>
  </section>
</template>
