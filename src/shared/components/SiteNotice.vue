<script setup lang="ts">
import SiteIcon from './SiteIcon.vue';
import { siteUrl } from '../site-path';
</script>

<template>
  <section class="notice-card" aria-label="小站公告">
    <h2>
      <SiteIcon name="megaphone" />小站公告<span class="notice-dot" aria-hidden="true"></span>
    </h2>
    <article class="notice-entry">
      <p class="muted notice-date"><time datetime="2026-11-06">2026 / 11 / 06</time></p>
      <a class="small-link" :href="siteUrl('/exam/')"><strong>111～115 年教檢全類科上架</strong><SiteIcon name="arrow" :size="13" /></a>
      <p class="muted">新增每題限時、整卷限時與隨機抽題模式。</p>
    </article>
  </section>
</template>

<style scoped>
.notice-card {
  padding: 22px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface-muted);
  box-shadow: var(--shadow);
}
.notice-card h2 {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 17px;
  font-size: .94rem;
  letter-spacing: 0;
}
.notice-card p { font-size: .74rem; line-height: 1.95; }
.notice-dot { margin-left: auto; width: 5px; height: 5px; border-radius: 50%; background: var(--color-primary); }
.small-link { display: inline-flex; align-items: center; gap: 7px; padding-block: 7px; font-size: .75rem; text-decoration: none; }
@media (max-width: 1180px) {
  .notice-card p { font-size: 1rem; line-height: 1.8; }
  .notice-card .notice-date { font-size: .8125rem; }
  .small-link { min-height: 44px; font-size: 1rem; }
}
</style>
