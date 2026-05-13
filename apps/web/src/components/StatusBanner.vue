<script setup lang="ts">
defineProps<{
  kind: 'info' | 'warning' | 'error';
  title: string;
  message: string;
}>();
</script>

<template>
  <section class="status-banner" :data-kind="kind">
    <strong>{{ title }}</strong>
    <p>{{ message }}</p>
  </section>
</template>
