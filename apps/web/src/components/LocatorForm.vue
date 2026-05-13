<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  busy: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  submit: [];
}>();

function onSubmit(): void {
  emit('submit');
}
</script>

<template>
  <form class="panel card-stack" @submit.prevent="onSubmit">
    <div>
      <p class="panel-label">输入 Locator</p>
      <h2 class="panel-title">查询命中的县级边界</h2>
      <p class="panel-copy">支持 4 位、6 位及更高精度。示例：on80cb、om44le。</p>
    </div>

    <label class="locator-input-wrap">
      <span class="field-label">Locator</span>
      <input
        :value="props.modelValue"
        class="locator-input"
        type="text"
        inputmode="text"
        autocomplete="off"
        spellcheck="false"
        placeholder="例如 on80cb"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <button class="primary-button" type="submit" :disabled="props.busy">
      {{ props.busy ? '查询中…' : '开始查询' }}
    </button>
  </form>
</template>
