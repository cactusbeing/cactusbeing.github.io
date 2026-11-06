<script setup lang="ts">
import { siteUrl } from '../../shared/site-path';
import SiteIcon from '../../shared/components/SiteIcon.vue';
defineProps<{ count: number; loading: boolean; error: string }>();
defineEmits<{ start: []; retry: []; practice: [] }>();
</script>

<template>
  <section id="revenge" class="revenge-gate" aria-labelledby="revenge-title" :aria-busy="loading">
    <div class="revenge-art">
      <img :src="siteUrl('/assets/decor/exam-revenge.webp')" alt="Q 版鉛筆冒險者在筆記本上挑戰五隻錯題紙怪" width="1536" height="1024" decoding="async" />
    </div>
    <div class="revenge-invitation">
      <h2 id="revenge-title">錯題復仇戰</h2>
      <p class="revenge-lead">上次失手的，這次拿下。</p>
      <ul class="revenge-rules" aria-label="挑戰規則">
        <li><strong>5</strong> 題短回合</li>
        <li><strong>60</strong> 秒／題</li>
        <li>全對通關</li>
      </ul>
      <p v-if="loading" class="revenge-status" role="status">正在召集你的錯題對手…</p>
      <template v-else-if="error">
        <p class="revenge-status revenge-error" role="alert">{{ error }}</p>
        <button type="button" class="revenge-start" @click="$emit('retry')">重新載入錯題</button>
      </template>
      <template v-else-if="count">
        <p class="revenge-status">還有 <strong>{{ count }}</strong> 題等你雪恥。{{ count < 5 ? `本輪挑戰全部 ${count} 題！` : '隨機抽 5 題，準備迎戰！' }}</p>
        <button type="button" class="revenge-start" @click="$emit('start')">出發，復仇！<SiteIcon name="arrow" :size="20" /></button>
        <p class="revenge-footnote">答對解除錯題標記；答錯或逾時，留待下次再戰。</p>
      </template>
      <template v-else>
        <p class="revenge-status revenge-clear"><strong>目前沒有待復仇的錯題，你很棒！</strong><br />帶著這份好狀態，繼續練習吧。</p>
        <button type="button" class="revenge-start" @click="$emit('practice')">前往練習<SiteIcon name="arrow" :size="20" /></button>
      </template>
    </div>
  </section>
</template>

<style scoped>
.revenge-gate { display: grid; grid-template-columns: 1.05fr 1fr; overflow: hidden; margin: 0 0 36px; border-radius: 16px; background: #fbf4e5; color: #3e4c32; }
.revenge-art { min-width: 0; align-self: stretch; }
.revenge-art img { display: block; width: 100%; height: 100%; object-fit: cover; }
.revenge-invitation { align-self: center; padding: 28px 32px; }
.revenge-invitation h2 { margin: 0 0 4px; font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; color: #345238; }
.revenge-lead { margin: 0 0 20px; color: #65533b; font-weight: 700; }
.revenge-rules { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 20px; padding: 12px 0; margin: 0; border-block: 1px solid #d9c9a8; list-style: none; font-size: .9rem; }
.revenge-rules strong { font-size: 1.25rem; font-variant-numeric: tabular-nums; }
.revenge-status { margin: 18px 0; line-height: 1.8; }
.revenge-clear strong { color: #345238; }
.revenge-error { color: var(--color-danger); }
.revenge-start { display: inline-flex; justify-content: center; align-items: center; gap: 24px; min-height: 50px; padding: 12px 24px; border: 0; border-radius: 12px; background: #345238; color: #fffaf0; font: inherit; font-weight: 800; }
.revenge-start:hover { background: #263f2a; }
.revenge-start:focus-visible { outline: 3px solid #8c4b27; outline-offset: 4px; }
.revenge-footnote { margin: 12px 0 0; font-size: .8rem; color: #65533b; }
@media (max-width: 700px) {
  .revenge-gate { grid-template-columns: 1fr; }
  .revenge-art img { aspect-ratio: 3 / 2; height: auto; }
  .revenge-invitation { padding: 22px; }
  .revenge-start { width: 100%; }
}
</style>
