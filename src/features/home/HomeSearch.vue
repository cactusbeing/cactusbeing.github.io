<script setup lang="ts">
import SiteIcon from '../../shared/components/SiteIcon.vue';
import { useSiteSearch } from '../../shared/composables/useSiteSearch';
const { query, results } = useSiteSearch();
</script>
<template>
  <section class="home-search" aria-label="全站搜尋">
    <label for="home-search-input">在百寶袋裡找一找</label>
    <div class="search-field"><SiteIcon name="search" :size="19" /><input id="home-search-input" v-model="query" type="search" autocomplete="off" placeholder="搜尋文章、教材、遊戲與工具" /></div>
    <template v-if="query.trim()">
      <p role="status">找到 {{ results.length }} 筆結果</p>
      <ul v-if="results.length"><li v-for="item in results" :key="item.href"><a :href="item.href">{{ item.title }} <SiteIcon name="arrow" :size="15" /></a></li></ul>
      <p v-else>試試其他關鍵字，或從下方消息與分類探索。</p>
    </template>
  </section>
</template>
<style scoped>
.home-search { margin-bottom: 26px; }
label { display: block; font-size: 1rem; font-weight: 650; margin-bottom: 10px; }
.search-field { position: relative; }
.search-field > svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--color-primary); pointer-events: none; }
.home-search .search-field input { width: 100%; min-height: 50px; padding-inline: 46px 14px; font-size: .9375rem; background: var(--color-surface); border-radius: var(--radius-control); }
p { margin: 12px 0 0; font-size: .9375rem; color: var(--color-text-muted); }
ul { list-style: none; margin: 10px 0 0; padding: 0; }
li a { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; min-height: 44px; padding-block: 9px; border-bottom: 1px solid var(--color-border); }
li svg { flex-shrink: 0; }
</style>
