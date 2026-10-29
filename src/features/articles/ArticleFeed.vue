<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { articleCategories, articleEntries } from '../../content/article-details';
import { matchesSearch, useSiteSearch } from '../../shared/composables/useSiteSearch';
import SiteIcon from '../../shared/components/SiteIcon.vue';
import { imageSource, imageSrcset } from '../../shared/responsive-images';
const props = defineProps<{ home?: boolean }>();
const homeArticleLimit = 3;
const { query, results } = useSiteSearch();
function readCategory() {
  const value = new URLSearchParams(location.search).get('category');
  return articleCategories.some((category) => category.id === value) ? value! : 'all';
}
const category = ref(readCategory());
const tag = ref(new URLSearchParams(location.search).get('tag') || '');
const month = ref(new URLSearchParams(location.search).get('month') || '');
const filtered = computed(() =>
  articleEntries.filter(
    (article) =>
      (category.value === 'all' || article.category === category.value) &&
      (!tag.value || article.tags.includes(tag.value)) &&
      (!month.value || article.date.startsWith(month.value)) &&
      matchesSearch(article, query.value),
  ),
);
const visible = computed(() => props.home ? filtered.value.slice(0, homeArticleLimit) : filtered.value);
const archiveHref = computed(() => category.value === 'all'
  ? '/post.html'
  : `/post.html?category=${encodeURIComponent(category.value)}`);
function selectCategory(id: string) {
  category.value = id;
  tag.value = '';
  const url = new URL(location.href);
  if (id === 'all') url.searchParams.delete('category');
  else url.searchParams.set('category', id);
  url.searchParams.delete('tag');
  history.pushState(null, '', url);
}
function clearFilters() {
  query.value = '';
  category.value = 'all';
  tag.value = '';
  month.value = '';
  const url = new URL(location.href);
  for (const key of ['category', 'tag', 'month']) url.searchParams.delete(key);
  history.pushState(null, '', url);
}
function restore() {
  category.value = readCategory();
  tag.value = new URLSearchParams(location.search).get('tag') || '';
  month.value = new URLSearchParams(location.search).get('month') || '';
}
window.addEventListener('popstate', restore);
onBeforeUnmount(() => window.removeEventListener('popstate', restore));
</script>
<template>
  <div :class="{ 'home-feed': home }">
    <section class="archive-intro base-card">
      <span v-if="!home" class="eyebrow">THE ARCHIVE</span>
      <div v-if="home" class="home-section-heading">
        <h2><img src="/assets/pencil.png" width="28" height="40" alt="" />最新文章</h2>
        <a href="/post.html">查看所有文章 <SiteIcon name="arrow" :size="16" /></a>
      </div>
      <h1 v-else>文字裡的理解與陪伴</h1>
      <p class="muted">共 {{ articleEntries.length }} 篇文章，收藏教學現場的思考與靈感。</p>
      <div class="feed-search">
        <SiteIcon name="search" :size="17" /><label for="feed-search" class="visually-hidden">{{
          home ? '搜尋文章、教材與工具' : '搜尋文章'
        }}</label
        ><input
          id="feed-search"
          v-model="query"
          name="q"
          autocomplete="off"
          type="search"
          :placeholder="home ? '在百寶袋裡找一找…' : '在文章裡找一找…'"
        />
      </div>
      <div v-if="home && query.trim()" class="home-search-summary" role="status">
        站內搜尋：{{ results.length }} 筆結果（文章、教材與工具）
      </div>
      <ul v-if="home && query.trim()" class="search-results" aria-label="站內搜尋結果">
        <li v-for="item in results" :key="item.href">
          <a :href="item.href">{{ item.title }}</a>
        </li>
        <li v-if="!results.length" role="status">沒有找到符合的資源，試試其他關鍵字。</li>
      </ul>
      <div v-if="home" class="intro-links">
        <a href="/教材.html">探索教學資源 <SiteIcon name="arrow" :size="13" /></a
        ><a href="/tool.html">開啟實用工具 <SiteIcon name="arrow" :size="13" /></a>
      </div>
    </section>
    <div class="category-filters" role="group" aria-label="文章分類篩選">
      <button
        v-for="item in articleCategories"
        :key="item.id"
        :aria-pressed="category === item.id"
        @click="selectCategory(item.id)"
      >
        {{ item.label }}<span v-if="item.id === 'all'">{{ articleEntries.length }}</span>
      </button>
    </div>
    <p v-if="tag || month" class="active-filter">
      {{ tag ? `關鍵字：${tag}` : `歸檔：${month}` }}
      <a :href="home ? '/index.html' : '/post.html'">清除篩選</a>
    </p>
    <div class="post-feed">
      <template v-for="(article, index) in visible" :key="article.href">
        <article class="post-card base-card">
          <a :href="article.href" class="post-cover" tabindex="-1" aria-hidden="true"
            ><img
              :src="imageSource(article.image)"
              :srcset="imageSrcset(article.image)"
              sizes="(max-width: 767px) 480px, (max-width: 900px) 34vw, (max-width: 1180px) 30vw, 285px"
              alt=""
              width="420"
              height="320"
              :loading="index === 0 ? 'eager' : 'lazy'"
              decoding="async" /><span class="cover-shade"></span
            ><span class="cover-label">CACTUS / NOTES</span
            ><span class="cover-title">{{
              articleCategories.find((category) => category.id === article.category)?.label
            }}</span
            ><SiteIcon name="leaf" :size="32"
          /></a>
          <div class="post-body">
            <div class="post-meta">
              <a :href="`/post.html?category=${article.category}`">{{
                articleCategories.find((category) => category.id === article.category)?.label
              }}</a
              ><span aria-hidden="true">/</span
              ><time :datetime="article.publishedAt || article.date">{{ article.date.replaceAll('-', ' / ') }}</time>
            </div>
            <h2>
              <a :href="article.href">{{ article.title }}</a>
            </h2>
            <p class="post-description">{{ article.description }}</p>
            <div class="post-bottom">
              <div class="post-tags">
                <a
                  v-for="label in article.tags"
                  :key="label"
                  :href="`/post.html?tag=${encodeURIComponent(label)}`"
                  ># {{ label }}</a
                >
              </div>
              <a
                :href="article.href"
                class="read-article"
                :aria-label="
                  home
                    ? `閱讀文章 · ${article.author}：${article.title}`
                    : `閱讀文章：${article.title}`
                "
                ><span>{{ home ? `閱讀文章 · ${article.author}` : article.author }}</span
                ><SiteIcon name="arrow" :size="15"
              /></a>
            </div>
          </div>
        </article>
        <template
          v-if="home && index === 0 && !query.trim() && category === 'all' && !tag && !month"
        >
          <slot name="discovery" />
          <h2 class="more-articles-heading">更多文章</h2>
        </template>
      </template>
      <a v-if="home && filtered.length > visible.length" class="all-articles-link" :href="archiveHref">
        {{ category === 'all' ? `查看全部 ${articleEntries.length} 篇文章` : `查看此分類的 ${filtered.length} 篇文章` }}
        <SiteIcon name="arrow" :size="16" />
      </a>
      <div v-if="!visible.length" class="empty-feed base-card" role="status">
        <SiteIcon name="search" :size="28" />
        <h2>{{ home && results.length ? '沒有符合的文章' : '還沒找到這樣的文章' }}</h2>
        <p>
          {{
            home && results.length
              ? '教材與工具的搜尋結果列在上方，也可以切換文章分類。'
              : '試試其他關鍵字，或切換文章分類。'
          }}
        </p>
        <button @click="clearFilters">清除條件，查看所有文章</button>
      </div>
    </div>
    <p v-if="!home" class="feed-end"><span></span>把每一份理解，都好好收藏。<span></span></p>
  </div>
</template>
<style scoped>
.base-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow);
}
.archive-intro {
  padding: 25px;
  margin-bottom: 18px;
}
.archive-intro h1,
.archive-intro h2 {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 12px 0 7px;
  letter-spacing: 0.02em;
}
.eyebrow {
  font-size: 0.62rem;
  letter-spacing: 0.2em;
}
.archive-intro > p {
  font-size: 0.8rem;
  margin: 0 0 18px;
}
.feed-search {
  position: relative;
}
.feed-search svg {
  position: absolute;
  top: 50%;
  left: 13px;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-primary);
}
.feed-search input[type='search'] {
  background: var(--color-bg);
  border-color: var(--color-control-border);
  padding-inline-start: 44px;
  font-size: 0.8rem;
  border-radius: 10px;
}
.intro-links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 14px;
}
.intro-links a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  font-size: 0.75rem;
  padding-block: 5px;
}
.search-results {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.8rem;
}
.search-results a {
  display: block;
  padding: 8px;
}
.category-filters {
  display: flex;
  align-items: center;
  gap: 4px;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 8px;
  overflow-x: auto;
  margin-bottom: 18px;
}
.category-filters button {
  white-space: nowrap;
  flex-shrink: 0;
  border: 0;
  min-height: 44px;
  border-radius: 9px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.76rem;
  padding: 8px 13px;
}
.category-filters button span {
  font-size: 0.6rem;
  margin-left: 6px;
}
.category-filters button:hover {
  background: var(--color-accent-soft);
}
.category-filters button[aria-pressed='true'] {
  background: var(--color-primary);
  color: white;
}
.post-feed {
  display: grid;
  gap: 18px;
}
.post-card {
  display: flex;
  padding: 9px;
  gap: 20px;
  min-height: 210px;
  overflow: hidden;
}
.post-cover {
  position: relative;
  flex: 0 0 34%;
  min-width: 0;
  overflow: hidden;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 18px;
  color: white;
  text-decoration: none;
  isolation: isolate;
}
.post-cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}
.cover-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgb(30 54 42 / 28%), rgb(36 49 43 / 85%));
  z-index: -1;
}
.cover-label {
  position: absolute;
  top: 16px;
  left: 16px;
  color: #fff;
  font-size: 0.45rem;
  letter-spacing: 0.16em;
}
.cover-title {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin: 0 0 7px;
}
.post-cover svg {
  color: #e0f0e2;
}
.post-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  padding: 9px 13px 6px 0;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  flex-wrap: wrap;
}
.post-meta a {
  text-decoration: none;
}
.post-body h2 {
  font-size: 1.04rem;
  line-height: 1.7;
  margin: 8px 0 10px;
  letter-spacing: 0;
}
.post-body h2 a {
  color: var(--color-text);
  text-decoration: none;
}
.post-body h2 a:hover {
  color: var(--color-primary);
}
.post-description {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.9;
  margin: 0 0 14px;
}
.post-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.post-tags a {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-decoration: none;
}
.read-article {
  display: flex;
  min-width: 44px;
  min-height: 44px;
  justify-content: center;
  padding: 8px;
  border-radius: 10px;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-decoration: none;
}
.read-article:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}
.read-article svg {
  color: var(--color-primary);
}
.feed-end {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  color: var(--color-text-muted);
  font-size: 0.68rem;
  padding: 24px 0;
}
.feed-end > span {
  width: 27px;
  height: 1px;
  background: #b7cfbd;
}
.active-filter {
  font-size: 0.8rem;
}
.active-filter a {
  margin-left: 8px;
}
.empty-feed {
  padding: 35px 20px;
  text-align: center;
}
.empty-feed h2 {
  font-size: 1.1rem;
}
.empty-feed p {
  font-size: 0.8rem;
}
.empty-feed button {
  padding: 10px 16px;
  min-height: 44px;
  background: var(--color-primary);
  color: white;
  border: 0;
  border-radius: 10px;
}
@media (max-width: 767px) {
  .archive-intro {
    padding: 23px;
  }
  .archive-intro h1,
  .archive-intro h2 {
    font-size: 1.45rem;
    line-height: 1.65;
  }
  .post-card {
    min-height: 220px;
    gap: 14px;
  }
  .post-cover {
    flex-basis: 29%;
    padding: 10px;
  }
  .cover-label {
    font-size: 0.34rem;
    left: 9px;
  }
  .cover-title {
    font-size: 0.82rem;
  }
  .post-body {
    padding: 5px 5px 5px 0;
  }
  .post-body h2 {
    font-size: 0.95rem;
  }
  .post-description {
    font-size: 0.875rem;
  }
  .read-article > span {
    display: none;
  }
  .category-filters button {
    padding-inline: 10px;
    font-size: 0.7rem;
  }
}
</style>
<style scoped>
.home-section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: 8px;
}
.home-section-heading h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 650;
  letter-spacing: 0;
}
.home-section-heading img {
  width: 22px;
  height: 28px;
  object-fit: contain;
}
.home-section-heading a,
.home-feed .intro-links a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  font-size: 0.875rem;
}
.home-feed .archive-intro > p {
  font-size: 0.875rem;
  margin-bottom: 16px;
}
.feed-search input[type='search'] {
  font-size: 1rem;
}
.home-search-summary,
.home-feed .search-results {
  font-size: 0.875rem;
  margin-top: 16px;
}
.home-feed .search-results a {
  min-height: 44px;
  padding: 8px 0;
}
.category-filters {
  flex-wrap: wrap;
  overflow: visible;
}
.category-filters button,
.category-filters button span {
  font-size: 0.875rem;
}
.post-body h2 {
  font-size: 1.125rem;
  line-height: 1.65;
  text-wrap: pretty;
}
.post-description {
  font-size: 1rem;
  line-height: 1.85;
}
.post-meta,
.post-tags a {
  font-size: 0.8125rem;
}
.home-feed .read-article {
  font-size: 0.8125rem;
}
.post-meta time {
  font-variant-numeric: tabular-nums;
}
.more-articles-heading {
  margin: 12px 0 0;
  padding-inline: 4px;
  font-size: 1.25rem;
  font-weight: 650;
}
.all-articles-link {
  display: inline-flex;
  justify-self: center;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 18px;
  border-radius: var(--radius-control);
  background: var(--color-primary);
  color: var(--color-surface);
  font-size: 0.875rem;
  font-weight: 650;
  text-decoration: none;
}
.all-articles-link:hover {
  background: var(--color-primary-hover);
  color: var(--color-surface);
}
@media (max-width: 767px) {
  .home-section-heading h2 {
    font-size: 1.375rem;
  }
  .post-body h2 {
    font-size: 1.0625rem;
  }
  .post-description {
    font-size: 0.9375rem;
  }
  .post-meta,
  .post-tags a {
    font-size: 0.75rem;
  }
}
@media (max-width: 479px) {
  .category-filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
}
</style>
