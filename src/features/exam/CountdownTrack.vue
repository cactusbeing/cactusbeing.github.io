<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{ deadline: number | null; durationSeconds: number; urgent: boolean; preparing?: boolean }>();
const fill = ref<HTMLElement | null>(null);
let animation: Animation | undefined;

function sync() {
  if (!fill.value) return;
  animation?.cancel();
  if (props.preparing) { fill.value.style.transform = 'scaleX(1)'; return; }
  const remaining = Math.max(0, (props.deadline ?? Date.now()) - Date.now());
  const fraction = Math.min(1, remaining / Math.max(1, props.durationSeconds * 1000));
  fill.value.style.transform = `scaleX(${fraction})`;
  if (remaining) animation = fill.value.animate(
    [{ transform: `scaleX(${fraction})` }, { transform: 'scaleX(0)' }],
    { duration: remaining, easing: 'linear', fill: 'forwards' },
  );
}

watch(() => [props.deadline, props.durationSeconds, props.preparing], sync, { flush: 'post' });
onMounted(() => {
  sync();
  window.addEventListener('focus', sync);
  document.addEventListener('visibilitychange', sync);
});
onBeforeUnmount(() => {
  animation?.cancel();
  window.removeEventListener('focus', sync);
  document.removeEventListener('visibilitychange', sync);
});
</script>

<template>
  <div class="revenge-time-track" aria-hidden="true"><span ref="fill" :class="{ urgent }" /></div>
</template>

<style scoped>
.revenge-time-track { overflow: hidden; height: 9px; border-radius: 5px; margin: -12px 0 20px; background: #e7d9b9; }
.revenge-time-track span { display: block; width: 100%; height: 100%; background: #345238; transform-origin: left center; }
.revenge-time-track span.urgent { background: #b13930; }
</style>
