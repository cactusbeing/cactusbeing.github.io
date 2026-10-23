<script setup lang="ts">
import { computed } from 'vue';
import type { Session } from './domain/types';
import { chartValues } from './domain/calculations';
const props = defineProps<{ session: Session }>();
const values = computed(() => chartValues(props.session));
const maximum = computed(() => Math.max(1, ...values.value));
const points = computed(() =>
  values.value
    .map(
      (value, index) =>
        `${50 + (index / Math.max(1, values.value.length - 1)) * 500},${210 - (value / maximum.value) * 170}`,
    )
    .join(' '),
);
</script>
<template>
  <div>
    <h3>圖表</h3>
    <p class="muted">橫軸：次數；縱軸：自第一筆事件起的流逝時間（秒，扣除暫停）。</p>
    <p v-if="!values.length">尚無行為事件。</p>
    <svg
      v-else
      viewBox="0 0 600 260"
      role="img"
      :aria-label="`${values.length} 次行為事件，最末事件流逝 ${values.at(-1)?.toFixed(2)} 秒`"
    >
      <path d="M50 30V210H560" fill="none" stroke="currentColor" />
      <text x="10" y="30" font-size="12">{{ maximum.toFixed(0) }}秒</text>
      <text x="35" y="235" font-size="12">1</text>
      <text x="540" y="235" font-size="12">{{ values.length }}次</text>
      <polyline :points="points" fill="none" stroke="var(--color-primary)" stroke-width="3" />
      <circle
        v-for="(value, index) in values"
        :key="index"
        :cx="50 + (index / Math.max(1, values.length - 1)) * 500"
        :cy="210 - (value / maximum) * 170"
        r="4"
        fill="var(--color-primary)"
      />
    </svg>
  </div>
</template>
<style scoped>
svg {
  display: block;
  width: 100%;
  max-height: 300px;
}
p {
  font-size: 0.85rem;
}
</style>
