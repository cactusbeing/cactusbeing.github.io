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
      <p class="muted notice-date"><time datetime="2026-11-03">2026 / 11 / 03</time></p>
      <a class="small-link" :href="siteUrl('/exam/?year=114')"><strong>114 年教檢全類科上架</strong><SiteIcon name="arrow" :size="13" /></a>
    </article>
    <article class="notice-entry">
      <p class="muted notice-date"><time datetime="2026-11-01">2026 / 11 / 01</time></p>
      <a class="small-link" :href="siteUrl('/exam/?year=115')"><strong>115 年教檢全類科上架</strong><SiteIcon name="arrow" :size="13" /></a>
    </article>
    <p class="muted">幼兒園、特教、國小至中等學校皆可練習，其他年份陸續上架。</p>
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
.notice-entry + .notice-entry { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--color-border); }
.notice-dot { margin-left: auto; width: 5px; height: 5px; border-radius: 50%; background: var(--color-primary); }
.small-link { display: inline-flex; align-items: center; gap: 7px; padding-block: 7px; font-size: .75rem; text-decoration: none; }
@media (max-width: 1180px) {
  .notice-card p { font-size: 1rem; line-height: 1.8; }
  .notice-card .notice-date { font-size: .8125rem; }
  .small-link { min-height: 44px; font-size: 1rem; }
}
</style>
