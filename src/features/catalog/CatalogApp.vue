<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import BlogLayout from '../../shared/components/BlogLayout.vue';
import ArticleFeed from '../articles/ArticleFeed.vue';
import BaseCard from '../../shared/components/BaseCard.vue';
import BaseButton from '../../shared/components/BaseButton.vue';
import MaterialFileIcon from './MaterialFileIcon.vue';
import { materialFiles, materialFormat, materialFormatLabel, materialTitle, resourceCountLabel, resources } from '../../content/resources';
import { sitePathname } from '../../shared/site-path';
import { imageSource, imageSrcset } from '../../shared/responsive-images';
import { materialAnchor } from '../../content/news-model.mjs';
const path = sitePathname();
const category = resources.find((resource) => resource.href === path);
const posts = path === '/post.html' || path === '/post-old.html';
const tools = path === '/tool.html';
const groups = category?.groups || [];
function groupFiles(id: string) {
  return category?.files.filter((file) => (category.fileGroups?.[file] || groups[0]?.id) === id) || [];
}
const selectedGroup = ref(groups[0]?.id || '');
const activeGroup = computed(() => groups.find((group) => group.id === selectedGroup.value));
const visibleFiles = computed(() => groups.length ? groupFiles(selectedGroup.value) : category?.files || []);
const hasTeacherAnswers = computed(() => visibleFiles.value.some((file) => category?.teacherFiles?.[file]));
function downloadLabel(primary: string, downloadFile: string) {
  if (!category) return '';
  const edition = category.teacherFiles?.[primary] && materialFormat(downloadFile) === 'PDF' ? '學生版 ' : '';
  return `下載${edition}${materialFormatLabel(downloadFile)}｜${materialTitle(category, primary)}`;
}
const openPreviews = ref(new Set<string>());
function togglePreview(file: string) {
  if (openPreviews.value.has(file)) openPreviews.value.delete(file);
  else openPreviews.value.add(file);
}
function previewId(file: string) {
  return `${materialAnchor(decodeURIComponent(file.split('/').pop()!))}-preview`;
}
function readGroupFromUrl() {
  if (!groups.length) return;
  const url = new URL(window.location.href);
  const linkedFile = category?.files.find((file) => `#${materialAnchor(decodeURIComponent(file.split('/').pop()!))}` === decodeURIComponent(url.hash));
  const id = linkedFile ? category?.fileGroups?.[linkedFile] || groups[0]?.id : url.searchParams.get('group');
  selectedGroup.value = groups.find((group) => group.id === id)?.id || groups[0]?.id || '';
}
function selectGroup(id: string) {
  if (selectedGroup.value === id) return;
  selectedGroup.value = id;
  const url = new URL(window.location.href);
  url.searchParams.set('group', id);
  url.hash = '';
  window.history.pushState({}, '', url);
}
readGroupFromUrl();
onMounted(() => {
  window.addEventListener('popstate', readGroupFromUrl);
  window.addEventListener('hashchange', readGroupFromUrl);
});
onUnmounted(() => {
  window.removeEventListener('popstate', readGroupFromUrl);
  window.removeEventListener('hashchange', readGroupFromUrl);
});
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
    ><div :class="{ 'grouped-catalog': groups.length }"><a href="/教材.html">← 所有教學資源</a>
    <h1 class="section">{{ category.title }}</h1>
    <p class="muted">{{ category.description }}</p>
    <div v-if="groups.length" class="class-picker" role="group" aria-label="選擇班別">
      <button v-for="group in groups" :key="group.id" type="button"
        :aria-pressed="selectedGroup === group.id" aria-controls="class-materials" @click="selectGroup(group.id)">
        <span class="class-picker-title">{{ group.title }}</span>
        <span class="class-picker-count">{{ groupFiles(group.id).length ? `${groupFiles(group.id).length} 份教材` : '教材準備中' }}</span>
      </button>
    </div>
    <section id="class-materials" :aria-labelledby="activeGroup ? 'class-materials-heading' : undefined">
    <h2 v-if="activeGroup" id="class-materials-heading" class="class-heading">{{ activeGroup.title }}</h2>
    <p v-if="visibleFiles.length" class="download-hint muted">點選檔案圖示下載{{ hasTeacherAnswers ? '；教師版僅含解答。' : '，PDF 可先預覽。' }}</p>
    <p v-if="activeGroup && !visibleFiles.length" class="class-empty muted" role="status">{{ activeGroup.title }}數學教材準備中，上架後會顯示在這裡。</p>
    <div v-if="!category.comingSoon" class="stack section">
      <BaseCard v-for="file in visibleFiles" :key="file" :id="materialAnchor(decodeURIComponent(file.split('/').pop()!))"
        ><div class="material-row"><div class="material-info">
        <component :is="activeGroup ? 'h3' : 'h2'" class="material-title">{{ materialTitle(category, file) }}</component>
        </div><div class="actions material-actions" role="group" :aria-label="`${materialTitle(category, file)} 預覽與下載`">
          <BaseButton v-if="materialFormat(file) === 'PDF'" class="material-preview-toggle"
            :aria-expanded="openPreviews.has(file)" :aria-controls="previewId(file)" @click="togglePreview(file)">
            {{ openPreviews.has(file) ? '收合' : '預覽' }}
            <span class="visually-hidden">{{ materialTitle(category, file) }}</span>
          </BaseButton>
          <a
            v-for="downloadFile in materialFiles(category, file)"
            :key="downloadFile"
            :href="downloadFile"
            class="material-file-download"
            :aria-label="downloadLabel(file, downloadFile)" :title="downloadLabel(file, downloadFile)"
            :download="category.materialTitles?.[file] ? `${materialTitle(category, file)}.${materialFormat(downloadFile).toLowerCase()}` : ''"
            ><MaterialFileIcon :format="materialFormat(downloadFile)" /></a
          >
          <a v-if="category.teacherFiles?.[file]"
            :href="category.teacherFiles[file]" class="material-file-download material-teacher-download"
            :aria-label="`下載教師版 PDF（僅解答）｜${materialTitle(category, file)}`"
            :title="`下載教師版 PDF（僅解答）｜${materialTitle(category, file)}`"
            :download="`${materialTitle(category, file)}_教師版.pdf`">
            <MaterialFileIcon format="PDF" /><span>教師版</span>
          </a>
        </div></div>
        <div v-if="materialFormat(file) === 'PDF'" v-show="openPreviews.has(file)"
          :id="previewId(file)" class="material-preview" role="region" :aria-label="`${materialTitle(category, file)} 預覽`">
          <a class="preview-open-link" :href="file" target="_blank" rel="noopener">在新分頁開啟 PDF<span class="visually-hidden">｜{{ materialTitle(category, file) }}</span></a>
          <iframe v-if="openPreviews.has(file)" :src="file" :title="`${materialTitle(category, file)} PDF 教材預覽`">
            您的瀏覽器不支援 PDF 預覽，請使用上方連結下載後閱讀。
          </iframe>
        </div></BaseCard
      >
    </div></section></div></template
  >
  <template v-else
    ><h1>教材資源分享</h1>
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
h2, .material-title {
  font-size: 1.3rem;
  margin-top: 0.8rem;
}
.stack {
  margin-top: 1.5rem;
}
.grouped-catalog {
  max-width: 960px;
  margin-inline: auto;
}
.class-picker {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-block: 2rem 3rem;
}
.class-picker button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  padding: 1rem 1.5rem;
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-control);
  background: var(--color-surface);
  color: var(--color-text);
  text-align: left;
}
.class-picker button:hover {
  background: var(--color-surface-muted);
}
.class-picker button[aria-pressed='true'] {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-surface);
}
.class-picker-title {
  font-weight: 650;
  font-size: 1.125rem;
}
.class-picker-count {
  font-size: 0.875rem;
}
.grouped-catalog .class-heading {
  margin: 0 0 1rem;
  font-size: 1.5rem;
}
.class-empty {
  padding: 1.5rem;
  background: var(--color-surface-muted);
  border-radius: var(--radius-control);
}
.grouped-catalog .stack {
  margin-top: 0;
}
.material-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
.material-info {
  flex: 1;
  min-width: 0;
}
.material-title {
  margin: 0;
}
.material-actions {
  flex-shrink: 0;
  max-width: 100%;
  gap: 6px;
}
.download-hint { margin: 0 0 1.25rem; font-size: .875rem; }
.material-preview-toggle { min-width: 56px; padding: 6px 8px; font-size: .875rem; white-space: nowrap; }
.material-file-download {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 44px;
  min-height: 44px;
  padding: 5px 7px;
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-control);
  background: var(--color-surface);
  color: var(--color-primary);
  text-decoration: none;
  white-space: nowrap;
}
.material-file-download:hover { background: var(--color-primary-soft); color: var(--color-primary); }
.material-file-download:active { background: var(--color-primary-soft); }
.material-teacher-download { font-size: .875rem; font-weight: 600; }
.preview-open-link { display: inline-flex; align-items: center; min-height: 44px; font-size: .875rem; }
@media (prefers-reduced-motion: no-preference) {
  .material-file-download { transition: background-color .15s ease-out; }
}
.material-preview {
  margin-top: 1.5rem;
}
.material-preview iframe {
  display: block;
  width: 100%;
  height: 600px;
  border: 1px solid var(--color-border);
}
@media (max-width: 1000px) {
  .material-row {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .material-actions {
    max-width: none;
  }
}
@media (max-width: 600px) {
  .material-preview iframe {
    height: 440px;
  }
  .class-picker {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    margin-block: 1.5rem 2rem;
  }
  .class-picker button {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }
}
</style>
