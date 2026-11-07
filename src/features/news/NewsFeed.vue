<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import SiteIcon from '../../shared/components/SiteIcon.vue';
import { newsCategories, newsEntries, noticeConfig, selectNews, siteNotice } from '../../content/news';
const props = defineProps<{ home?: boolean }>();
const showSummaries = ref(false);
function readCategory() {
  const value = new URLSearchParams(location.search).get('category');
  return newsCategories.some((item) => item.id === value) ? value! : 'all';
}
const category = ref(readCategory());
const limit = ref(12);
const matching = computed(() => selectNews(newsEntries, noticeConfig, { category: category.value }));
const visible = computed(() => matching.value.slice(0, props.home ? 6 : limit.value));
const archiveHref = computed(() => category.value === 'all' ? '/news.html' : `/news.html?category=${category.value}`);
function selectCategory(id: string) {
  category.value = id; limit.value = 12;
  const url = new URL(location.href);
  if (id === 'all') url.searchParams.delete('category');
  else url.searchParams.set('category', id);
  history.pushState(null, '', url);
}
function restore() { category.value = readCategory(); limit.value = 12; }
window.addEventListener('popstate', restore);
onBeforeUnmount(() => window.removeEventListener('popstate', restore));
</script>
<template>
  <section class="news-feed" :class="{ 'is-home': home }" aria-labelledby="news-title">
    <aside v-if="siteNotice?.message" class="station-message" :aria-label="siteNotice.heading">
      <h2><SiteIcon name="megaphone" :size="18" />{{ siteNotice.heading }}</h2>
      <p>{{ siteNotice.message }}</p>
      <a v-if="siteNotice.href" :href="siteNotice.href">{{ siteNotice.linkLabel || '查看詳情' }} <SiteIcon name="arrow" :size="16" /></a>
    </aside>
    <header class="news-heading">
      <div>
        <h2 v-if="home" id="news-title">最新消息</h2>
        <h1 v-else id="news-title">最新消息</h1>
        <p v-if="!home">教材、遊戲與小站的新進展，都在這裡。</p>
      </div>
      <div v-if="home" class="news-heading-actions">
        <button :aria-pressed="showSummaries" @click="showSummaries = !showSummaries">{{ showSummaries ? '收起摘要' : '顯示摘要' }}</button>
        <a :href="archiveHref">所有消息 <SiteIcon name="arrow" :size="16" /></a>
      </div>
    </header>
    <div class="news-filters" role="group" aria-label="消息分類篩選">
      <button v-for="item in newsCategories" :key="item.id" :aria-pressed="category === item.id" @click="selectCategory(item.id)">{{ item.label }}</button>
    </div>
    <p class="news-count" :class="{ 'visually-hidden': home }" role="status">{{ matching.length ? `共 ${matching.length} 則${home && matching.length > 6 ? '，顯示最新 6 則' : ''}消息` : '這個分類目前沒有消息。' }}</p>
    <ol v-if="visible.length" class="news-list">
      <li v-for="entry in visible" :key="entry.id" :class="{ 'is-featured': entry.id === siteNotice?.featured?.id }">
        <span class="news-category">{{ newsCategories.find((item) => item.id === entry.category)?.label }}</span>
        <h3><a :href="entry.href" :title="entry.title">
          <span v-if="entry.id === siteNotice?.featured?.id" class="news-pin" title="置頂消息"><SiteIcon name="pin" :size="15" /><span class="visually-hidden">置頂消息：</span></span>
          <span class="news-title-text">{{ entry.title }}</span><SiteIcon class="news-arrow" name="arrow" :size="17" />
        </a></h3>
        <time class="news-date" :datetime="entry.date">{{ entry.date.replaceAll('-', home ? '/' : ' / ') }}</time>
        <p v-if="!home || showSummaries">{{ entry.summary }}</p>
      </li>
    </ol>
    <div v-else class="news-empty">
      <p>新功能或重要公告發布後，會顯示在這裡。</p>
      <button @click="selectCategory('all')">查看全部消息</button>
    </div>
    <button v-if="!home && matching.length > visible.length" class="news-more" @click="limit += 12">載入更多消息</button>
  </section>
</template>
<style scoped>
.news-feed { padding: 26px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-card); }
.news-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.news-heading h1, .news-heading h2 { font-size: 1.5rem; margin: 0 0 8px; font-weight: 700; }
.news-heading p { margin: 0; color: var(--color-text-muted); font-size: .9375rem; }
.news-heading-actions { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
.news-heading-actions a { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; font-size: .875rem; }
.news-heading-actions button { padding: 0; min-height: 44px; border: 0; background: transparent; color: var(--color-text-muted); font-size: .8125rem; }
.news-heading-actions button:hover { color: var(--color-primary); text-decoration: underline; }
.news-filters { display: flex; flex-wrap: wrap; gap: 4px; padding-bottom: 16px; border-bottom: 1px solid var(--color-border); }
.news-filters button { border: 0; background: transparent; color: var(--color-text-muted); border-radius: var(--radius-control); min-height: 44px; padding: 8px 12px; font-size: .875rem; }
.news-filters button:hover { background: var(--color-primary-soft); }
.news-filters button[aria-pressed='true'] { color: var(--color-surface); background: var(--color-primary); }
.news-count { margin: 14px 0 0; color: var(--color-text-muted); font-size: .8125rem; }
.news-list { list-style: none; padding: 0; margin: 0; }
.news-list li { display: grid; grid-template-columns: 4.25rem minmax(0, 1fr) auto; align-items: baseline; gap: 0 16px; padding: 22px 0; border-bottom: 1px solid var(--color-border); }
.news-list li:last-child { border-bottom: 0; padding-bottom: 6px; }
.news-category { grid-column: 1; grid-row: 1; color: var(--color-primary); font-weight: 650; font-size: .875rem; }
.news-date { grid-column: 3; grid-row: 1; text-align: right; white-space: nowrap; font-size: .75rem; color: var(--color-text-muted); font-variant-numeric: tabular-nums; }
.news-pin { display: inline-flex; align-self: center; color: var(--color-primary); flex-shrink: 0; }
.news-list h3 { grid-column: 2; grid-row: 1; min-width: 0; margin: 0; font-size: 1.0625rem; font-weight: 650; line-height: 1.65; }
.news-list h3 a { display: flex; align-items: baseline; gap: 8px; color: var(--color-text); }
.news-title-text { min-width: 0; }
.news-list h3 a:hover { color: var(--color-primary); text-decoration: underline; }
.news-list h3 svg { flex-shrink: 0; color: var(--color-primary); }
.news-list li > p { grid-column: 2 / -1; margin: 7px 0 0; color: var(--color-text-muted); font-size: .9375rem; line-height: 1.8; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.news-more { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; min-height: 48px; margin-top: 22px; padding: 8px; background: transparent; border: 1px solid var(--color-control-border); border-radius: var(--radius-control); color: var(--color-primary); font-size: .9375rem; }
.news-more:hover { background: var(--color-primary-soft); }
.news-empty { padding: 20px 0 4px; }
.news-empty p { color: var(--color-text-muted); font-size: .9375rem; margin-top: 0; }
.news-empty button { min-height: 44px; padding: 8px 14px; color: var(--color-primary); background: var(--color-primary-soft); border: 0; border-radius: var(--radius-control); }
.station-message { padding-bottom: 22px; margin-bottom: 22px; border-bottom: 1px solid var(--color-border); }
.station-message h2 { display: flex; align-items: center; gap: 8px; font-size: 1rem; margin: 0 0 8px; }
.station-message p { white-space: pre-line; margin: 0; }
.station-message a { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; }
.is-home { padding-block: 18px; }
.is-home .news-heading { margin-bottom: 8px; }
.is-home .news-heading h2 { margin: 0; }
.is-home .news-filters { padding-bottom: 10px; }
.is-home .news-list li { padding-block: 13px; }
.is-home .news-list li:last-child { padding-bottom: 2px; }
.is-home .news-list h3 { font-size: 1rem; }
.is-home .news-title-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.is-home .news-list h3 .news-arrow { display: none; }
@media (max-width: 600px) {
  .news-feed { padding: 20px; }
  .news-heading { align-items: flex-start; gap: 8px; }
  .news-heading p { font-size: .875rem; }
  .news-heading h1, .news-heading h2 { font-size: 1.375rem; }
  .news-filters { gap: 3px; }
  .news-filters button { padding-inline: 10px; }
  .news-list li { grid-template-columns: minmax(0, 1fr) auto; gap: 4px 12px; padding-block: 20px; }
  .news-category { grid-column: 1; grid-row: 1; }
  .news-date { grid-column: 2; grid-row: 1; }
  .news-list h3 { grid-column: 1 / -1; grid-row: 2; }
  .news-list li > p { grid-column: 1 / -1; }
  .is-home { padding-block: 14px; }
  .is-home .news-heading-actions { gap: 12px; }
  .is-home .news-heading-actions a { font-size: .8125rem; }
  .is-home .news-filters { flex-wrap: nowrap; overflow-x: auto; gap: 1px; scrollbar-width: thin; }
  .is-home .news-filters button { flex-shrink: 0; padding-inline: 8px; }
  .is-home .news-list li { padding-block: 11px; }
  .is-home .news-category { font-size: .75rem; }
  .is-home .news-title-text { white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .is-home .news-list li > p { margin-top: 3px; }
}
@media (prefers-reduced-motion: no-preference) {
  .news-list a { transition: color .15s ease-out; }
}
</style>
