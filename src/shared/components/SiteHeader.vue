<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { navigation } from '../../content/navigation';
import { useSiteSearch } from '../composables/useSiteSearch';
import SiteBanner from './SiteBanner.vue';
import SiteIcon from './SiteIcon.vue';
import BaseModal from './BaseModal.vue';
import { sitePathname } from '../site-path';
const open = ref(false);
const searchOpen = ref(false);
const current = sitePathname();
const toggle = ref<HTMLButtonElement>();
const { query, results } = useSiteSearch();
const navIcons = ['person', 'leaf', 'person', 'book', 'folder', 'tools'] as const;
function close() {
  if (open.value) {
    open.value = false;
    toggle.value?.focus();
  }
}
function shortcut(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    searchOpen.value = !searchOpen.value;
  }
}
onMounted(() => window.addEventListener('keydown', shortcut));
onBeforeUnmount(() => window.removeEventListener('keydown', shortcut));
</script>
<template>
  <a class="skip-link" href="#main-content">跳到主要內容</a>
  <header class="site-header" @keydown.esc="close">
    <div class="container header-inner">
      <a class="brand" href="/index.html"
        ><img src="/assets/icon.png" width="35" height="35" alt="" /><span>特教百寶袋</span></a
      >
      <nav id="site-navigation" aria-label="主要導覽" :class="{ open }">
        <a
          href="/index.html"
          :aria-current="current === '/' || current === '/index.html' ? 'page' : undefined"
          ><SiteIcon name="home" :size="15" />首頁</a
        ><a
          v-for="(item, index) in navigation"
          :key="item.href"
          :href="item.href"
          :aria-current="current === item.href ? 'page' : undefined"
          @click="open = false"
          ><SiteIcon :name="navIcons[index]" :size="15" />{{ item.label }}</a
        >
      </nav>
      <div class="header-actions">
        <button class="search-toggle" aria-label="開啟全站搜尋" @click="searchOpen = true">
          <SiteIcon name="search" :size="21" /></button
        ><button
          ref="toggle"
          class="menu-toggle"
          :aria-expanded="open"
          aria-controls="site-navigation"
          @click="open = !open"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path d="M3 6h18M3 12h18M3 18h18" /></svg
          ><span>{{ open ? '關閉' : '選單' }}</span>
        </button>
      </div>
    </div>
  </header>
  <SiteBanner /><BaseModal
    :open="searchOpen"
    title="搜尋百寶袋"
    @close="
      searchOpen = false;
      query = '';
    "
    ><label for="global-search" class="visually-hidden">搜尋文章、教材與工具</label
    ><input
      id="global-search"
      v-model="query"
      name="q"
      autocomplete="off"
      type="search"
      placeholder="輸入文章、教材或工具名稱…"
    />
    <ul class="global-results">
      <li v-for="item in query.trim() ? results : []" :key="item.href">
        <a :href="item.href">{{ item.title }}<SiteIcon name="arrow" :size="14" /></a>
      </li>
    </ul>
    <p v-if="query.trim() && !results.length" role="status">沒有找到符合的資源，試試其他關鍵字。</p>
    <p v-if="!query.trim()" class="muted search-hint">
      試試「數學」、「行為」或「融合教育」。
    </p></BaseModal
  >
</template>
<style scoped>
.site-header {
  position: absolute;
  inset: 0 0 auto;
  z-index: 20;
  color: var(--color-banner-text);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 74px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--color-banner-text);
  font-size: 1.32rem;
  font-weight: 750;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}
.brand img {
  width: 35px;
  height: 35px;
  background: rgb(255 255 255 / 92%);
  border-radius: 11px;
  padding: 4px;
}
nav {
  display: flex;
  gap: 4px;
  align-items: center;
}
nav a {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 8px 11px;
  color: var(--color-banner-text);
  text-decoration: none;
  font-size: 0.85rem;
  border-radius: 10px;
}
nav a:hover,
nav a[aria-current] {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}
.header-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}
.search-toggle,
.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 44px;
  min-height: 44px;
  background: transparent;
  border: 0;
  border-radius: 10px;
  color: var(--color-banner-text);
}
.search-toggle:hover,
.menu-toggle:hover {
  background: var(--color-primary-soft);
}
.menu-toggle {
  display: none;
}
.global-results {
  padding: 0;
  list-style: none;
  max-height: 45vh;
  overflow-y: auto;
}
.global-results a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.9rem;
  text-decoration: none;
}
.search-hint {
  margin: 16px 0;
  font-size: 0.85rem;
}
.site-header :focus-visible {
  outline-color: var(--color-primary);
}
@media (max-width: 1000px) {
  nav a {
    padding-inline: 8px;
    font-size: 0.78rem;
  }
}
@media (max-width: 900px) {
  .header-inner {
    position: relative;
    min-height: 68px;
  }
  .brand {
    font-size: 1.15rem;
  }
  .brand img {
    width: 31px;
    height: 31px;
  }
  .menu-toggle {
    display: flex;
    font-size: 0.75rem;
  }
  nav {
    display: none;
    position: absolute;
    top: 67px;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    padding: 10px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    box-shadow: 0 12px 30px #26372a33;
  }
  nav.open {
    display: flex;
  }
  nav a {
    color: var(--color-text);
    padding: 11px 16px;
  }
  nav a:hover,
  nav a[aria-current] {
    background: var(--color-primary-soft);
    color: var(--color-primary);
  }
  nav a:focus-visible {
    outline-color: var(--color-primary);
  }
}
</style>
