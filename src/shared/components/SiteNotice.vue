<script setup lang="ts">
import SiteIcon from './SiteIcon.vue';
import { siteUrl } from '../site-path';
import { siteNotice } from '../../content/news';
</script>

<template>
  <section v-if="siteNotice" class="notice-card" :aria-label="siteNotice.heading">
    <h2>
      <SiteIcon name="megaphone" />{{ siteNotice.heading }}
    </h2>
    <p v-if="siteNotice.message" class="notice-message">{{ siteNotice.message }}</p>
    <a v-if="siteNotice.message && siteNotice.href" class="small-link" :href="siteUrl(siteNotice.href)">{{ siteNotice.linkLabel || '查看詳情' }}<SiteIcon name="arrow" :size="13" /></a>
    <article v-if="siteNotice.featured" class="notice-entry">
      <p class="muted notice-date"><time :datetime="siteNotice.featured.date">{{ siteNotice.featured.date.replaceAll('-', ' / ') }}</time></p>
      <a class="small-link" :href="siteUrl(siteNotice.featured.href)"><strong>{{ siteNotice.featured.title }}</strong><SiteIcon name="arrow" :size="13" /></a>
      <p class="muted">{{ siteNotice.featured.summary }}</p>
    </article>
    <a class="small-link" :href="siteUrl('/news.html')">所有消息<SiteIcon name="arrow" :size="13" /></a>
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
.notice-card p { font-size: .875rem; line-height: 1.85; }
.notice-message { white-space: pre-line; }
.small-link { display: inline-flex; align-items: center; gap: 7px; min-height: 44px; padding-block: 7px; font-size: .875rem; text-decoration: none; }
@media (max-width: 1180px) {
  .notice-card p { font-size: 1rem; line-height: 1.8; }
  .notice-card .notice-date { font-size: .8125rem; }
  .small-link { min-height: 44px; font-size: 1rem; }
}
</style>
