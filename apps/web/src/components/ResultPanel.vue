<script setup lang="ts">
import type { QueryResult } from '@grid-to-xian/shared-types';

defineProps<{
  result: QueryResult | null;
  errorMessage: string | null;
  hasSearched: boolean;
  resultSummary: string;
}>();
</script>

<template>
  <section class="panel card-stack result-panel">
    <div>
      <p class="panel-label">查询结果</p>
      <h2 class="panel-title">命中行政区</h2>
      <p class="panel-copy">{{ resultSummary }}</p>
    </div>

    <p v-if="errorMessage !== null" class="result-error">{{ errorMessage }}</p>

    <template v-else-if="result !== null">
      <ul v-if="result.candidates.length > 0" class="candidate-list">
        <li v-for="candidate in result.candidates" :key="candidate.gbCode" class="candidate-card">
          <strong>{{ candidate.name }}</strong>
          <span>{{ candidate.gbCode }}</span>
        </li>
      </ul>

      <p v-else class="empty-copy">当前网格没有命中任何县级行政区。</p>

      <ul v-if="result.warnings.length > 0" class="warning-list">
        <li v-for="warning in result.warnings" :key="warning.code">
          {{ warning.message }}
        </li>
      </ul>
    </template>

    <p v-else-if="hasSearched" class="empty-copy">尚未得到可展示的结果。</p>
    <p v-else class="empty-copy">输入一个 Locator 后点击查询，地图将只显示命中的县边界。</p>
  </section>
</template>
