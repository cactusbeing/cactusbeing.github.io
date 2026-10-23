<script setup lang="ts">
import { ref } from 'vue';
import ArticleFeed from '../articles/ArticleFeed.vue';
import BlogLayout from '../../shared/components/BlogLayout.vue';
import BaseButton from '../../shared/components/BaseButton.vue';
import SiteIcon from '../../shared/components/SiteIcon.vue';
import { resources } from '../../content/resources';
import { siteUrl } from '../../shared/site-path';
const googleSearch = ref(false);
const googleState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle');
function enableGoogle() {
  if (googleState.value === 'loading' || googleState.value === 'ready') return;
  googleSearch.value = true;
  googleState.value = 'loading';
  const script = document.createElement('script');
  script.src = 'https://cse.google.com/cse.js?cx=7ca65734473e2a7d1';
  script.async = true;
  script.onload = () => {
    googleState.value = 'ready';
  };
  script.onerror = () => {
    googleState.value = 'error';
    googleSearch.value = false;
    script.remove();
  };
  document.head.append(script);
}
</script>
<template>
  <BlogLayout>
    <ArticleFeed home>
      <template #discovery>
        <section class="campus-invitation" aria-labelledby="campus-invitation-title">
          <div>
            <h2 id="campus-invitation-title">同一座校園，每次相遇多一點理解。</h2>
            <p>
              從進校門到放學，完成八個隨機微事件，實際找老師、回報與返回現場。二十四次選擇全數通過，才能平安放學、收下本日回饋。
            </p>
            <a href="/campus/">走進校園 RPG <SiteIcon name="arrow" :size="18" /></a>
          </div>
          <svg
            class="campus-emblem"
            width="104"
            height="104"
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path
              d="M12 64V30l28-16 28 16v34H12ZM32 64V44h16v20M20 37h6m28 0h6M20 49h6m28 0h6M40 14V4m0 0h18v10H40"
            />
            <circle cx="40" cy="30" r="5" />
          </svg>
        </section>
        <section class="home-resources" aria-labelledby="home-resources-title">
          <div class="resource-introduction">
            <div class="section-heading">
              <div>
                <h2 id="home-resources-title">站內精選教材</h2>
                <p>涵蓋實務操作與生活應用的專屬特教資源</p>
              </div>
              <a href="/教材.html">所有教材 <SiteIcon name="arrow" :size="16" /></a>
            </div>
            <img
              class="resource-decoration"
              src="/assets/decor/canva-cactus-books.png"
              width="198"
              height="100"
              alt=""
              loading="lazy"
              aria-hidden="true"
            />
          </div>
          <div class="resource-grid">
            <a
              v-for="resource in [resources[1], resources[2], resources[0]]"
              :key="resource.href"
              :href="resource.href"
              class="resource-entry"
            >
              <img :src="siteUrl(resource.image)" width="500" height="300" alt="" loading="lazy" />
              <div class="resource-heading">
                <h3>{{ resource.title }}</h3>
                <span>{{ resource.files.length }} 份 PDF</span>
              </div>
              <p>{{ resource.description }}</p>
              <span class="resource-action">查看教材 <SiteIcon name="arrow" :size="16" /></span>
            </a>
          </div>
        </section>
        <section class="home-tools" aria-labelledby="home-tools-title">
          <div class="section-heading">
            <div>
              <h2 id="home-tools-title">專業評量與記錄工具</h2>
              <p>協助教育工作者更有效率地進行行為觀察與分析</p>
            </div>
            <a href="/tool.html">工具專區 <SiteIcon name="arrow" :size="16" /></a>
          </div>
          <div class="tool-grid">
            <a href="/behavior-tool.html" class="tool-entry">
              <SiteIcon name="clock" :size="28" />
              <div>
                <h3>行為記錄工具</h3>
                <p>快速且精準地記錄與追蹤目標行為發生的頻率、時間點與前因後果。</p>
                <span>開啟工具 <SiteIcon name="arrow" :size="16" /></span>
              </div>
            </a>
            <a href="/aba-tool.html" class="tool-entry">
              <SiteIcon name="tools" :size="28" />
              <div>
                <h3>FBA 行為功能評量</h3>
                <p>系統化分析特殊需求學生行為背後的功能與目的，擬定介入策略。</p>
                <span>開啟工具 <SiteIcon name="arrow" :size="16" /></span>
              </div>
            </a>
          </div>
        </section>
      </template>
    </ArticleFeed>
    <section class="google-search" aria-labelledby="google-search-title">
      <h2 id="google-search-title">
        <img src="/assets/paper.png" width="26" height="26" alt="" />尋找特定資源？
      </h2>
      <p>也可以使用原有 Google 站內搜尋，啟用後將連線至 Google 搜尋服務。</p>
      <BaseButton v-if="!googleSearch" variant="secondary" @click="enableGoogle">{{
        googleState === 'error' ? '重新啟用 Google 站內搜尋' : '使用原有 Google 站內搜尋'
      }}</BaseButton>
      <p v-if="googleState === 'loading'" role="status">正在載入 Google 搜尋…</p>
      <p v-if="googleState === 'error'" role="status">
        Google 搜尋未能載入，請重試，或使用上方的站內搜尋。
      </p>
      <div v-if="googleSearch" class="gcse-search"></div>
    </section>
  </BlogLayout>
</template>
<style scoped>
.campus-invitation {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 24px;
  background: var(--color-primary-soft);
  border-radius: var(--radius-card);
}
.campus-invitation h2 {
  line-height: 1.65;
}
.campus-invitation p {
  color: var(--color-text-muted);
  font-size: 0.9375rem;
  line-height: 1.85;
  margin: 8px 0 12px;
}
.campus-invitation a {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  font-size: 0.9375rem;
  font-weight: 650;
}
.campus-emblem {
  flex-shrink: 0;
  color: var(--color-primary);
}
@media (max-width: 600px) {
  .campus-invitation {
    padding: 20px;
    gap: 12px;
  }
  .campus-emblem {
    width: 54px;
    height: 54px;
  }
}
.home-resources,
.home-tools {
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}
.home-tools {
  background: var(--color-primary-soft);
}
.section-heading {
  align-items: center;
  margin-bottom: 20px;
}
.resource-introduction {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.home-resources {
  background: var(--color-bg);
}
.resource-introduction .section-heading {
  flex-wrap: wrap;
  margin-bottom: 0;
}
.resource-decoration {
  width: 92px;
  height: 100px;
  object-fit: cover;
  object-position: right;
  mix-blend-mode: darken;
  pointer-events: none;
}
h2 {
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: 650;
  letter-spacing: 0;
  margin: 0 0 8px;
}
.section-heading p {
  color: var(--color-text-muted);
  font-size: 1rem;
  margin: 0;
}
.section-heading > a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  flex-shrink: 0;
  font-size: 0.875rem;
  text-decoration: none;
}
.resource-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.resource-entry {
  display: flex;
  flex-direction: column;
  color: var(--color-text);
  text-decoration: none;
  min-width: 0;
}
.resource-entry > img {
  width: 100%;
  aspect-ratio: 5 / 3;
  object-fit: cover;
  border-radius: var(--radius-card);
  margin-bottom: 16px;
}
.resource-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
h3 {
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0;
}
.resource-heading > span {
  flex-shrink: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.resource-entry p,
.tool-entry p {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  margin: 8px 0 12px;
}
.home-tools p {
  color: var(--color-text);
}
.resource-action,
.tool-entry span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  color: var(--color-primary);
  font-size: 0.875rem;
  margin-top: auto;
}
.resource-entry:hover h3,
.tool-entry:hover h3 {
  color: var(--color-primary);
}
.tool-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
.tool-entry {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  color: var(--color-text);
  text-decoration: none;
  padding-block: 8px;
}
.tool-entry > svg {
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 3px;
}
.google-search {
  margin: 20px 0 0;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}
.google-search h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
}
.google-search p {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
@media (max-width: 767px) {
  .home-resources,
  .home-tools {
    padding: 20px;
  }
  h2 {
    font-size: 1.25rem;
  }
  .resource-grid,
  .tool-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .resource-entry {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 0 16px;
  }
  .resource-entry > img {
    grid-row: 1 / 4;
    aspect-ratio: 1;
    margin: 0;
  }
  .resource-heading {
    flex-wrap: wrap;
    gap: 4px 12px;
  }
  .resource-entry p {
    grid-column: 2;
  }
  .resource-action {
    grid-column: 2;
  }
  .tool-grid {
    gap: 24px;
  }
}
@media (max-width: 374px) {
  .resource-introduction {
    grid-template-columns: minmax(0, 1fr) 64px;
    gap: 8px;
  }
  .resource-decoration {
    width: 64px;
    height: 80px;
  }
  .resource-entry {
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 0 12px;
  }
}
</style>
