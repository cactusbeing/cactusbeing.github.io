<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { siteUrl } from '../../shared/site-path';
import SiteIcon from '../../shared/components/SiteIcon.vue';
import { answeredCount, readHistory, readResponses, saveHistoryEntry } from './progress';
import type { Choice, ExamHistoryEntry, Subject, Year } from './progress';

type Question = { id: number; answer: Choice; accepted_answers?: Choice[] };
const years = ref<Year[]>([]);
const history = ref<ExamHistoryEntry[]>([]);
const loading = ref(true);
const error = ref('');
const progress = ref<Record<string, number>>({});
const subjects = computed(() => years.value.flatMap((year) =>
  year.subjects.map((subject) => ({ year: year.year, subject, count: progress.value[`${year.year}-${subject.id}`] ?? 0 }))));
const totals = computed(() => ({
  complete: subjects.value.filter((item) => item.count >= item.subject.count).length,
  active: subjects.value.filter((item) => item.count > 0 && item.count < item.subject.count).length,
  fresh: subjects.value.filter((item) => item.count === 0).length,
}));
const sortedHistory = computed(() => [...history.value].sort((a, b) =>
  (b.completedAt ?? '').localeCompare(a.completedAt ?? '')));

function statusLabel(count: number, total: number): string {
  if (!count) return '尚未開始';
  if (count >= total) return '已完成';
  return `作答中 ${count}/${total}`;
}

function examLink(year: number, subject: Subject): string {
  return siteUrl(`/exam/?year=${year}&subject=${encodeURIComponent(subject.id)}`);
}

function dateLabel(value: string | null): string {
  if (!value) return '舊作答（日期未記錄）';
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? '日期未記錄'
    : new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

async function importLegacyCompletions() {
  const known = new Set(history.value.map((entry) => `${entry.year}-${entry.subjectId}`));
  for (const { year, subject, count } of subjects.value) {
    const key = `${year}-${subject.id}`;
    if (count < subject.count || known.has(key)) continue;
    try {
      const response = await fetch(siteUrl(subject.data));
      if (!response.ok) continue;
      const data = (await response.json()) as { multiple_choice_questions: Question[] };
      if (!Array.isArray(data.multiple_choice_questions)) continue;
      const answers = readResponses(year, subject.id);
      const correct = data.multiple_choice_questions.filter((question) =>
        (question.accepted_answers?.length ? question.accepted_answers : [question.answer])
          .includes(answers[question.id])).length;
      if (saveHistoryEntry({
        year, subjectId: subject.id, subjectName: subject.name,
        correct, total: data.multiple_choice_questions.length, completedAt: null,
      })) known.add(key);
    } catch {
      // Current progress is still shown if an old result cannot be imported.
    }
  }
  history.value = readHistory();
}

async function loadHistory() {
  try {
    const response = await fetch(siteUrl('/assets/exams/index.json'));
    if (!response.ok) throw new Error('題庫目錄載入失敗');
    const data = (await response.json()) as { years: Year[] };
    if (!Array.isArray(data.years)) throw new Error('題庫目錄格式錯誤');
    years.value = [...data.years].sort((a, b) => b.year - a.year);
    progress.value = Object.fromEntries(years.value.flatMap((year) =>
      year.subjects.map((subject) => [`${year.year}-${subject.id}`, answeredCount(year.year, subject)])));
    history.value = readHistory();
    await importLegacyCompletions();
  } catch {
    error.value = '作答歷史暫時無法載入，請重新整理頁面再試一次。';
  } finally {
    loading.value = false;
  }
}

onMounted(loadHistory);
</script>

<template>
  <section class="history-page" aria-labelledby="history-title">
    <header class="page-heading">
      <div>
        <a class="back-link" :href="siteUrl('/exam/')">← 返回測驗題庫</a>
        <h1 id="history-title">作答歷史</h1>
        <p>查看各科目前的作答進度與每次完成測驗的成績。</p>
      </div>
    </header>
    <p v-if="loading" class="load-message" role="status">正在整理作答紀錄…</p>
    <p v-if="error" class="load-message" role="alert">{{ error }}</p>
    <template v-if="!loading && !error">
      <div class="summary-grid" aria-label="科目進度總覽">
        <div><strong>{{ totals.complete }}</strong><span>已完成</span></div>
        <div><strong>{{ totals.active }}</strong><span>作答中</span></div>
        <div><strong>{{ totals.fresh }}</strong><span>尚未開始</span></div>
      </div>

      <section class="history-section" aria-labelledby="attempt-title">
        <div class="section-heading">
          <h2 id="attempt-title">完成紀錄</h2>
          <span>{{ sortedHistory.length }} 次測驗</span>
        </div>
        <p v-if="!sortedHistory.length" class="empty-state">還沒有完成的測驗。完成任一科後，成績會顯示在這裡。</p>
        <ol v-else class="attempt-list">
          <li v-for="entry in sortedHistory" :key="entry.id" class="attempt-row">
            <div>
              <span class="attempt-year">{{ entry.year }} 年</span>
              <strong>{{ entry.subjectName }}</strong>
              <small>{{ dateLabel(entry.completedAt) }}</small>
            </div>
            <span class="attempt-score">{{ entry.correct * 2 }} / {{ entry.total * 2 }} 分 <small>答對 {{ entry.correct }} / {{ entry.total }} 題</small></span>
          </li>
        </ol>
      </section>

      <section class="history-section" aria-labelledby="progress-title">
        <div class="section-heading">
          <h2 id="progress-title">各科目前進度</h2>
          <span>{{ subjects.length }} 科</span>
        </div>
        <div v-for="year in years" :key="year.year" class="year-section">
          <h3>{{ year.year }} 年</h3>
          <a v-for="subject in year.subjects" :key="subject.id" class="subject-row" :href="examLink(year.year, subject)">
            <span class="subject-name">{{ subject.name }}</span>
            <span class="subject-meta">
              <span class="status-badge" :class="{ active: (progress[`${year.year}-${subject.id}`] ?? 0) > 0 && (progress[`${year.year}-${subject.id}`] ?? 0) < subject.count, complete: (progress[`${year.year}-${subject.id}`] ?? 0) >= subject.count }">
                {{ statusLabel(progress[`${year.year}-${subject.id}`] ?? 0, subject.count) }}
              </span>
              <SiteIcon name="arrow" :size="17" />
            </span>
          </a>
        </div>
      </section>
      <p class="privacy-note">作答進度與完成紀錄只保存在目前瀏覽器；清除網站資料後無法恢復。</p>
    </template>
  </section>
</template>

<style scoped>
.history-page { max-width: 960px; margin: 0 auto 60px; }
.page-heading { margin-bottom: 28px; }
.back-link { display: inline-block; margin-bottom: 14px; color: var(--color-primary); font-size: .88rem; }
.page-heading h1 { margin: 0 0 6px; color: var(--color-primary); }
.page-heading p { margin: 0; color: var(--color-text-muted); }
.summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 38px; }
.summary-grid > div { display: flex; flex-direction: column; gap: 3px; padding: 20px 22px; border-radius: 14px; background: var(--color-primary-soft); color: var(--color-primary); }
.summary-grid strong { font-size: 2rem; line-height: 1.1; font-variant-numeric: tabular-nums; }
.summary-grid span { font-size: .86rem; font-weight: 700; }
.history-section { margin-top: 36px; }
.section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.section-heading h2 { margin: 0; font-size: 1.45rem; }
.section-heading > span { color: var(--color-text-muted); font-size: .85rem; }
.empty-state { margin: 0; padding: 25px; border: 1px dashed var(--color-border); border-radius: 14px; color: var(--color-text-muted); }
.attempt-list { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
.attempt-row { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 16px 20px; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-surface); }
.attempt-row > div { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 12px; }
.attempt-year { color: var(--color-primary); font-size: .82rem; font-weight: 800; }
.attempt-row strong { font-size: 1rem; }
.attempt-row small { display: block; width: 100%; color: var(--color-text-muted); font-size: .78rem; }
.attempt-score { flex: 0 0 auto; color: var(--color-primary); font-weight: 800; text-align: right; font-variant-numeric: tabular-nums; }
.year-section { margin-top: 24px; }
.year-section h3 { margin: 0 0 10px; color: var(--color-primary); font-size: 1.08rem; }
.subject-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; min-height: 64px; padding: 12px 18px; margin-bottom: 8px; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-surface); color: var(--color-text); text-decoration: none; }
.subject-row:hover { border-color: var(--color-primary); background: var(--color-surface-muted); }
.subject-name { font-weight: 700; }
.subject-meta { display: inline-flex; align-items: center; gap: 10px; color: var(--color-primary); white-space: nowrap; }
.status-badge { padding: 4px 10px; border-radius: 999px; background: var(--color-surface-muted); color: var(--color-text-muted); font-size: .78rem; font-weight: 700; }
.status-badge.active { background: #fff4df; color: #80520b; }
.status-badge.complete { background: var(--color-primary-soft); color: var(--color-primary); }
.privacy-note { margin-top: 24px; color: var(--color-text-muted); font-size: .82rem; }
.load-message { padding: 16px; border-radius: 12px; background: var(--color-surface-muted); }
@media (max-width: 600px) {
  .summary-grid { gap: 8px; }
  .summary-grid > div { padding: 14px; }
  .summary-grid strong { font-size: 1.6rem; }
  .attempt-row { align-items: flex-start; flex-direction: column; gap: 8px; }
  .attempt-score { text-align: left; }
  .subject-row { align-items: flex-start; flex-direction: column; gap: 8px; }
}
</style>
