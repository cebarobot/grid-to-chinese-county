<script setup lang="ts">
import { computed } from 'vue';
import LocatorForm from './components/LocatorForm.vue';
import MapView from './components/MapView.vue';
import ResultPanel from './components/ResultPanel.vue';
import StatusBanner from './components/StatusBanner.vue';
import { useLocatorQuery } from './composables/useLocatorQuery';
import { getTiandituWarning } from './services/tileProvider';

const {
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
} = useLocatorQuery();

const tileWarning = getTiandituWarning();
const isBusy = computed(() => submitStatus.value === 'loading');
</script>

<template>
  <div class="app-shell">
    <header class="hero-panel">
      <p class="eyebrow">Maidenhead to County</p>
      <h1>网格定位到中国县级行政区</h1>
      <p class="hero-copy">
        输入 Maidenhead Locator，前端本地完成查询，并只绘制网格方框与命中的县边界。
      </p>
    </header>

    <main class="content-grid">
      <section class="control-column">
        <LocatorForm
          v-model="locatorInput"
          :busy="isBusy"
          @submit="submit"
        />

        <StatusBanner
          v-if="assetStatus === 'loading'"
          kind="info"
          title="正在加载县级数据"
          :message="assetMessage"
        />

        <StatusBanner
          v-if="assetStatus === 'error'"
          kind="error"
          title="数据加载失败"
          :message="assetMessage"
        />

        <StatusBanner
          v-if="tileWarning !== null"
          kind="warning"
          title="底图未启用"
          :message="tileWarning"
        />

        <ResultPanel
          :result="result"
          :error-message="errorMessage"
          :has-searched="hasSearched"
          :result-summary="resultSummary"
        />
      </section>

      <section class="map-column">
        <MapView
          :parsed-locator="parsedLocator"
          :matched-features="matchedFeatures"
          :loading-message="assetStatus === 'loading' ? assetMessage : null"
          :tile-warning="tileWarning"
        />
      </section>
    </main>
  </div>
</template>
