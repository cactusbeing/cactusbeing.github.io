<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const status = ref<'preview' | 'loading' | 'ready' | 'unavailable'>('preview');
const counts = ref<HTMLDivElement | null>(null);
let observer: MutationObserver | undefined;
let timeout: ReturnType<typeof setTimeout> | undefined;
let script: HTMLScriptElement | undefined;

onMounted(() => {
  // Keep development, local previews and alternate deployments out of the site totals.
  if (!import.meta.env.PROD || window.location.hostname !== 'cactusbeing.github.io') return;

  status.value = 'loading';
  const updateStatus = () => {
    const values = counts.value?.querySelectorAll('[id^="busuanzi_value_"]');
    if (values?.length === 2 && [...values].every((value) => /^\d+$/.test(value.textContent ?? ''))) {
      status.value = 'ready';
      clearTimeout(timeout);
      observer?.disconnect();
    }
  };
  observer = new MutationObserver(updateStatus);
  observer.observe(counts.value!, { childList: true, subtree: true, characterData: true });

  const unavailable = () => {
    status.value = 'unavailable';
    clearTimeout(timeout);
  };
  timeout = setTimeout(unavailable, 8000);
  script = document.createElement('script');
  script.async = true;
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  script.onerror = unavailable;
  document.head.appendChild(script);
});

onUnmounted(() => {
  clearTimeout(timeout);
  observer?.disconnect();
  script?.remove();
});
</script>

<template>
  <div class="visit-stats" role="status" aria-label="網站瀏覽統計">
    <div v-show="status === 'ready'" ref="counts" class="visit-counts">
      <span>累計瀏覽 <span id="busuanzi_value_site_pv" class="visit-number"></span> 次</span>
      <span>累計訪客 <span id="busuanzi_value_site_uv" class="visit-number"></span> 人次</span>
    </div>
    <span v-if="status === 'preview'">瀏覽統計：本機與預覽環境不計數</span>
    <span v-else-if="status === 'loading'">瀏覽統計載入中…</span>
    <span v-else-if="status === 'unavailable'">暫時無法取得瀏覽統計</span>
  </div>
</template>

<style scoped>
.visit-stats {
  margin: 4px 0 12px;
  min-height: 1.8em;
  font-size: 0.76rem;
  line-height: 1.8;
  color: var(--color-text-muted);
}
.visit-counts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 20px;
}
.visit-number {
  color: var(--color-text);
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}
</style>
