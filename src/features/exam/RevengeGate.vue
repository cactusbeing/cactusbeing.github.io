<script setup lang="ts">
import { computed, ref } from 'vue';
import { siteUrl } from '../../shared/site-path';
import SiteIcon from '../../shared/components/SiteIcon.vue';
type RevengeSubject = { id: string; name: string; count: number };
const props = defineProps<{ count: number; totalCount: number; subjects: RevengeSubject[]; selectedSubjects: string[]; loading: boolean; error: string; questionCount: number; questionCountError: string }>();
const emit = defineEmits<{ 'update:subjects': [value: string[]]; 'update:questionCount': [value: number]; start: []; retry: []; practice: []; browse: [] }>();
const subjectSearch = ref('');
const filteredSubjects = computed(() => {
  const query = subjectSearch.value.trim().toLocaleLowerCase();
  return query ? props.subjects.filter(subject => subject.name.toLocaleLowerCase().includes(query)) : props.subjects;
});
function updateQuestionCount(event: Event) {
  emit('update:questionCount', Number((event.target as HTMLInputElement).value));
}
function toggleSubject(subjectId: string, event: Event) {
  const selected = (event.target as HTMLInputElement).checked;
  emit('update:subjects', selected
    ? [...new Set([...props.selectedSubjects, subjectId])]
    : props.selectedSubjects.filter(id => id !== subjectId));
}
function selectAllSubjects() {
  emit('update:subjects', props.subjects.map(subject => subject.id));
}
</script>

<template>
  <section id="revenge" class="revenge-gate" aria-labelledby="revenge-title" :aria-busy="props.loading">
    <div class="revenge-art">
      <img :src="siteUrl('/assets/decor/exam-revenge.webp')" alt="鉛筆冒險者在筆記本上挑戰錯題紙怪" width="1536" height="1024" decoding="async" />
    </div>
    <div class="revenge-invitation">
      <h2 id="revenge-title">錯題復仇戰</h2>
      <p class="revenge-lead">上次失手的，這次拿下。</p>
      <ul class="revenge-rules" aria-label="挑戰規則">
        <li>本輪挑戰 <strong>{{ props.count ? props.questionCount : '—' }}</strong> 題</li>
        <li><strong>60</strong> 秒／題</li>
        <li>全對通關</li>
      </ul>
      <p v-if="props.loading" class="revenge-status" role="status">正在召集你的錯題對手…</p>
      <template v-else-if="props.error">
        <p class="revenge-status revenge-error" role="alert">{{ props.error }}</p>
        <button type="button" class="revenge-retry" @click="$emit('retry')">重新載入錯題</button>
      </template>
      <template v-else-if="props.totalCount">
        <p class="revenge-status">{{ props.count ? `已選 ${props.selectedSubjects.length} 科，共 ${props.count} 題待挑戰。` : '請至少選擇一個有錯題的科目。' }}</p>
        <details class="revenge-subject-dropdown">
          <summary>
            <span>選擇科目（可複選）</span>
            <span class="revenge-subject-summary-count">{{ props.selectedSubjects.length }} / {{ props.subjects.length }} 科 · {{ props.count }} 題</span>
            <svg class="revenge-subject-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </summary>
          <div class="revenge-subject-panel">
            <label class="revenge-subject-search">搜尋科目
              <input v-model="subjectSearch" type="search" placeholder="輸入科目名稱" autocomplete="off" />
            </label>
            <div class="revenge-subject-actions">
              <button type="button" @click="selectAllSubjects">全選科目</button>
              <button type="button" @click="$emit('update:subjects', [])">清除選擇</button>
            </div>
            <div class="revenge-subject-list" role="group" aria-label="錯題科目，可捲動">
              <label v-for="subject in filteredSubjects" :key="subject.id" class="revenge-subject-option">
                <input type="checkbox" :checked="props.selectedSubjects.includes(subject.id)" @change="toggleSubject(subject.id, $event)" />
                <span>{{ subject.name }}<small>{{ subject.count }} 題</small></span>
              </label>
              <p v-if="!filteredSubjects.length" class="revenge-subject-empty">找不到符合的科目</p>
            </div>
          </div>
        </details>
        <template v-if="props.count">
          <div class="revenge-count-presets" role="group" aria-label="快速設定挑戰題數">
            <button v-for="count in [5, 10, 20]" :key="count" type="button" :disabled="count > props.count" :aria-pressed="props.questionCount === count" @click="$emit('update:questionCount', count)">{{ count }} 題</button>
          </div>
          <label class="revenge-count-label">自訂題數
            <input :value="props.questionCount" type="number" min="1" :max="props.count" step="1" :aria-invalid="Boolean(props.questionCountError)" :aria-describedby="props.questionCountError ? 'revenge-count-hint revenge-count-error' : 'revenge-count-hint'" @input="updateQuestionCount" />
            <span id="revenge-count-hint">最多 {{ props.count }} 題</span>
          </label>
          <p v-if="props.questionCountError" id="revenge-count-error" class="revenge-error count-error" role="alert">{{ props.questionCountError }}</p>
        </template>
        <p v-if="props.count" class="revenge-footnote">答對解除錯題標記；答錯或逾時，留待下次再戰。</p>
      </template>
      <template v-else>
        <p class="revenge-status revenge-clear"><strong>目前沒有待復仇的錯題，你很棒！</strong><br />帶著這份好狀態，繼續練習吧。</p>
      </template>
      <div class="revenge-actions">
        <button type="button" class="revenge-start" :disabled="props.loading || Boolean(props.error) || !props.count || Boolean(props.questionCountError)" @click="$emit('start')">出發，復仇！<SiteIcon name="arrow" :size="20" /></button>
        <button v-if="!props.loading && !props.error && !props.totalCount" type="button" class="revenge-book-button" @click="$emit('practice')">前往練習<SiteIcon name="arrow" :size="20" /></button>
        <button type="button" class="revenge-book-button revenge-book-open" @click="$emit('browse')">瀏覽錯題本 <span>{{ props.totalCount }}</span></button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.revenge-gate { display: grid; grid-template-columns: 1.05fr 1fr; overflow: hidden; margin: 0 0 36px; border-radius: 16px; background: #fbf4e5; color: #3e4c32; }
.revenge-art { min-width: 0; align-self: stretch; }
.revenge-art img { display: block; width: 100%; height: 100%; object-fit: cover; }
.revenge-invitation { align-self: center; padding: 28px 32px; }
.revenge-invitation h2 { margin: 0 0 4px; font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; color: #345238; }
.revenge-lead { margin: 0 0 20px; color: #65533b; font-weight: 700; }
.revenge-rules { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 20px; padding: 12px 0; margin: 0; border-block: 1px solid #d9c9a8; list-style: none; font-size: .9rem; }
.revenge-rules strong { font-size: 1.25rem; font-variant-numeric: tabular-nums; }
.revenge-status { margin: 18px 0; line-height: 1.8; }
.revenge-count-label { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin: 16px 0 8px; color: #3e4c32; font-weight: 700; }
.revenge-count-label input { width: 7ch; min-height: 44px; padding: 7px 10px; border: 1px solid #ad9a77; border-radius: 9px; background: #fffdf7; color: #263f2a; font: inherit; font-variant-numeric: tabular-nums; }
.revenge-count-label input:focus-visible { outline: 3px solid #345238; outline-offset: 2px; }
.revenge-count-label span { color: #65533b; font-size: .85rem; font-weight: 400; }
.count-error { margin: 4px 0 10px; }
.revenge-subject-dropdown { min-width: 0; margin: 0; }
.revenge-subject-dropdown summary { display: flex; justify-content: space-between; align-items: center; gap: 12px; min-height: 48px; padding: 10px 14px; border: 1px solid #b9a982; border-radius: 10px; background: #fffaf0; color: #345238; font-weight: 700; cursor: pointer; list-style: none; }
.revenge-subject-dropdown summary::-webkit-details-marker { display: none; }
.revenge-subject-chevron { flex: 0 0 auto; transition: transform .16s ease; }
.revenge-subject-dropdown[open] summary { border-radius: 10px 10px 0 0; }
.revenge-subject-dropdown[open] .revenge-subject-chevron { transform: rotate(180deg); }
.revenge-subject-dropdown summary:focus-visible, .revenge-subject-actions button:focus-visible, .revenge-retry:focus-visible { outline: 3px solid #345238; outline-offset: 2px; }
.revenge-subject-summary-count { color: #65533b; font-size: .82rem; font-weight: 600; text-align: right; }
.revenge-subject-panel { padding: 12px; border: 1px solid #b9a982; border-top: 0; border-radius: 0 0 10px 10px; background: #fffdf7; }
.revenge-subject-search { display: grid; gap: 6px; margin-bottom: 10px; color: #3e4c32; font-size: .85rem; font-weight: 700; }
.revenge-subject-search input { width: 100%; min-height: 44px; padding: 8px 11px; border: 1px solid #b9a982; border-radius: 8px; background: #fff; color: #263f2a; font: inherit; font-size: 1rem; font-weight: 400; }
.revenge-subject-search input:focus-visible { outline: 3px solid #345238; outline-offset: 2px; }
.revenge-subject-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.revenge-subject-actions button { min-height: 40px; padding: 7px 12px; border: 1px solid #b9a982; border-radius: 9px; background: #fffaf0; color: #345238; font: inherit; font-size: .85rem; font-weight: 700; }
.revenge-subject-actions button:hover { border-color: #345238; background: #f3ead4; }
.revenge-subject-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px 12px; max-height: 220px; overflow-y: auto; padding: 4px 8px 4px 2px; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: #ac9a74 #f4ecd9; }
.revenge-subject-empty { grid-column: 1 / -1; margin: 8px 4px; color: #65533b; font-size: .9rem; }
.revenge-subject-option { display: flex; align-items: flex-start; gap: 8px; min-width: 0; padding: 8px 4px; border-radius: 8px; color: #3e4c32; }
.revenge-subject-option:hover { background: #f3ead4; }
.revenge-subject-option input { flex: 0 0 auto; margin-top: 4px; accent-color: #345238; }
.revenge-subject-option span { min-width: 0; font-size: .9rem; }
.revenge-subject-option small { display: block; margin-top: 2px; color: #65533b; font-size: .78rem; }
.revenge-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.revenge-count-presets { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.revenge-count-presets button { min-height: 44px; padding: 8px 16px; border: 1px solid #ad9a77; border-radius: 9px; background: #fffaf0; color: #345238; font: inherit; font-weight: 700; }
.revenge-count-presets button[aria-pressed="true"] { border-color: #345238; background: #345238; color: #fffaf0; }
.revenge-count-presets button:disabled { cursor: not-allowed; opacity: .5; }
.revenge-count-presets button:focus-visible { outline: 3px solid #345238; outline-offset: 2px; }
.revenge-clear strong { color: #345238; }
.revenge-error { color: var(--color-danger); }
.revenge-start { display: inline-flex; justify-content: center; align-items: center; gap: 24px; min-height: 50px; padding: 12px 24px; border: 0; border-radius: 12px; background: #345238; color: #fffaf0; font: inherit; font-weight: 800; }
.revenge-start:hover:not(:disabled) { background: #263f2a; }
.revenge-start:disabled { cursor: not-allowed; opacity: .55; }
.revenge-book-button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 50px; padding: 10px 18px; border: 1px solid #a8946e; border-radius: 12px; background: #fffaf0; color: #345238; font: inherit; font-weight: 750; }
.revenge-book-button:hover { border-color: #345238; background: #f3ead4; }
.revenge-retry { min-height: 42px; padding: 8px 14px; border: 1px solid #a8946e; border-radius: 9px; background: #fffaf0; color: #345238; font: inherit; font-weight: 700; }
.revenge-book-button span { display: inline-grid; min-width: 24px; min-height: 24px; place-items: center; padding: 0 5px; border-radius: 999px; background: #e8ddc2; font-size: .8rem; font-variant-numeric: tabular-nums; }
.revenge-start:focus-visible { outline: 3px solid #8c4b27; outline-offset: 4px; }
.revenge-footnote { margin: 12px 0; font-size: .8rem; color: #65533b; }
@media (prefers-reduced-motion: reduce) { .revenge-subject-chevron { transition: none; } }
@media (max-width: 700px) {
  .revenge-gate { grid-template-columns: 1fr; }
  .revenge-art img { aspect-ratio: 3 / 2; height: auto; }
  .revenge-invitation { padding: 22px; }
  .revenge-subject-list { grid-template-columns: 1fr; }
  .revenge-start, .revenge-book-button { width: 100%; }
}
</style>
