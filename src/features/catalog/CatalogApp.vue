<script setup lang="ts">
import BlogLayout from '../../shared/components/BlogLayout.vue';
import ArticleFeed from '../articles/ArticleFeed.vue';
import BaseCard from '../../shared/components/BaseCard.vue';
import BaseButton from '../../shared/components/BaseButton.vue';
import { materialFiles, materialFormat, materialFormatLabel, resourceCountLabel, resources } from '../../content/resources';
import { sitePathname } from '../../shared/site-path';
import { imageSource, imageSrcset } from '../../shared/responsive-images';
import { materialAnchor } from '../../content/news-model.mjs';
const path = sitePathname();
const category = resources.find((resource) => resource.href === path);
const posts = path === '/post.html' || path === '/post-old.html';
const tools = path === '/tool.html';
function filename(path: string) {
  return (
    path
      .split('/')
      .pop()
      ?.replace(/\.(pdf|pptx|docx)$/i, '') || path
  );
}
</script>
<template>
  <BlogLayout v-if="posts"><ArticleFeed /></BlogLayout>
  <template v-else-if="tools"
    ><span class="eyebrow">TOOLS FOR YOUR DAY</span>
    <h1>實用工具</h1>
    <p class="muted">協助教育工作者更有效率地進行行為觀察與分析。</p>
    <div class="grid two">
      <BaseCard href="/behavior-tool.html"
        ><span class="tag">觀察與記錄</span>
        <h2>行為記錄工具</h2>
        <p>多行為記錄、時間統計、圖表與 CSV 匯出。</p>
        <span>開啟工具 →</span></BaseCard
      ><BaseCard href="/aba-tool.html"
        ><span class="tag">理解行為</span>
        <h2>FBA-行為功能評量</h2>
        <p>整理行為、背景、前事與後果，觀察可能的行為功能。</p>
        <span>開啟工具 →</span></BaseCard
      >
    </div>
    <p class="muted section">PBS-正向行為支持計畫：建置中，敬請期待！</p></template
  >
  <template v-else-if="category"
    ><a href="/教材.html">← 所有教學資源</a>
    <h1 class="section">{{ category.title }}</h1>
    <p class="muted">{{ category.description }}</p>
    <div v-if="!category.comingSoon" class="stack section">
      <BaseCard v-for="file in category.files" :key="file" :id="materialAnchor(decodeURIComponent(file.split('/').pop()!))"
        ><span class="tag">{{ materialFiles(category, file).map(materialFormatLabel).join('・') }}</span>
        <h2>{{ decodeURIComponent(filename(file)) }}</h2>
        <div class="actions">
          <BaseButton v-if="materialFormat(file) === 'PDF'" :href="file" target="_blank" rel="noopener"
            >開啟 PDF
            <span class="visually-hidden">{{ decodeURIComponent(filename(file)) }}（新分頁）</span></BaseButton
          ><BaseButton
            v-for="downloadFile in materialFiles(category, file)"
            :key="downloadFile"
            :href="downloadFile"
            variant="secondary"
            download
            >下載{{ materialFormat(downloadFile) === 'PDF' ? ' PDF' : `可編輯 ${materialFormat(downloadFile)}` }}
            <span class="visually-hidden">{{ decodeURIComponent(filename(file)) }}</span></BaseButton
          >
        </div></BaseCard
      >
    </div></template
  >
  <template v-else
    ><span class="eyebrow">THE RESOURCE SHELF</span>
    <h1>教材資源分享</h1>
    <p class="muted">選一個主題，為下一堂課找點靈感。</p>
    <div class="grid">
      <BaseCard
        v-for="resource in resources"
        :key="resource.title"
        :href="resource.comingSoon ? undefined : resource.href"
        :aria-disabled="resource.comingSoon || undefined"
        :class="{ 'resource-unavailable': resource.comingSoon }"
        ><img
          class="resource-image"
          :src="imageSource(resource.image)"
          :srcset="imageSrcset(resource.image)"
          sizes="(max-width: 767px) calc(100vw - 80px), 400px"
          width="600"
          height="400"
          alt=""
          loading="lazy"
        /><span class="tag">{{ resource.comingSoon ? '準備中' : resourceCountLabel(resource) }}</span>
        <h2>{{ resource.title }}</h2>
        <p class="muted">{{ resource.description }}</p>
        <span>{{ resource.comingSoon ? '暫未開放' : '探索教材 →' }}</span></BaseCard
      >
    </div>
    </template
  >
</template>
<style scoped>
.resource-unavailable {
  filter: grayscale(1);
  background: var(--color-surface-muted);
}
.resource-image {
  display: block;
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
}
h2 {
  font-size: 1.3rem;
  margin-top: 0.8rem;
}
.stack {
  margin-top: 1.5rem;
}
</style>
