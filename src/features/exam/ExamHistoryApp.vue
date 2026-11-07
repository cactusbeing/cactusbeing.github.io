<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import './exam-shell.css';
import { siteUrl } from '../../shared/site-path';
import SiteIcon from '../../shared/components/SiteIcon.vue';
import { answeredCount, readHistory, readResponses, saveHistoryEntry } from './progress';
import type { Choice, ExamHistoryEntry, Subject, Year } from './progress';
import { examYearLabel, subjectCategoryLabel, subjectGroups } from './classification';
import { practiceStats } from './training';

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
const stats = computed(() => practiceStats(history.value));
const historyMode = ref('all');
const visibleHistory = computed(() => sortedHistory.value.filter(entry => historyMode.value === 'all' ||
  (historyMode.value === 'practice' ? !entry.mode : entry.mode === historyMode.value)));
function percent(value: number | null): string { return value === null ? '—' : `${Number(value.toFixed(1))}%`; }
function modeLabel(entry: ExamHistoryEntry): string {
  return entry.mode === 'revenge' ? '錯題復仇戰' : entry.mode === 'random' ? '隨機抽題' : entry.mode === 'timed' ? '限時測驗' : '歷屆練習';
}
function yearLabel(year: number): string {
  return examYearLabel(year, years.value.find((item) => item.year === year)?.sitting);
}

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

function subjectName(entry: ExamHistoryEntry): string {
  return years.value.find((year) => year.year === entry.year)?.subjects
    .find((subject) => subject.id === entry.subjectId)?.name ?? entry.subjectName;
}

async function importLegacyCompletions() {
  const known = new Set(history.value.map((entry) => `${entry.year}-${entry.subjectId}`));
  for (const { year, subject, count } of subjects.value) {
    const key = `${year}-${subject.id}`;
    if (count < subject.count || known.has(key)) continue;
    try {
      const response = await fetch(siteUrl(subject.data));
      if (!response.ok) continue;
      const data = (await response.json()) as {
        exam_metadata?: { parts?: { name: string; points: number }[] };
        multiple_choice_questions: Question[];
      };
      if (!Array.isArray(data.multiple_choice_questions)) continue;
      const answers = readResponses(year, subject.id);
      const correct = data.multiple_choice_questions.filter((question) =>
        (question.accepted_answers?.length ? question.accepted_answers : [question.answer])
          .includes(answers[question.id])).length;
      const maxScore = data.exam_metadata?.parts?.find((part) => part.name === '選擇題')?.points
        ?? subject.points ?? data.multiple_choice_questions.length * 2;
      if (saveHistoryEntry({
        year, subjectId: subject.id, subjectName: subject.name,
        correct, total: data.multiple_choice_questions.length, completedAt: null,
        score: correct / data.multiple_choice_questions.length * maxScore, maxScore,
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

onMounted(() => {
  document.body.classList.add('exam-page-shell');
  void loadHistory();
});
onBeforeUnmount(() => document.body.classList.remove('exam-page-shell'));
</script>

<template>
  <section class="history-page" aria-labelledby="history-title">
    <header class="page-heading">
      <div>
        <a class="back-link" :href="siteUrl('/exam/')">← 返回測驗題庫</a>
        <h1 id="history-title">個人練習紀錄</h1>
        <p>看見累積的進步，也找到下一次練習的方向。</p>
      </div>
    </header>
    <p v-if="loading" class="load-message" role="status">正在整理作答紀錄…</p>
    <p v-if="error" class="load-message" role="alert">{{ error }}</p>
    <template v-if="!loading && !error">
      <section class="performance-section" aria-labelledby="performance-title">
        <h2 id="performance-title">練習總覽</h2>
        <dl class="performance-overview">
          <div><dt>累積答對率</dt><dd>{{ percent(stats.accuracy) }}</dd></div>
          <div><dt>累積練習題數</dt><dd>{{ stats.total }}<small> 題</small></dd></div>
          <div><dt>完成測驗</dt><dd>{{ history.length }}<small> 次</small></dd></div>
          <div><dt>近 7 日答對率</dt><dd>{{ percent(stats.recentAccuracy) }}</dd></div>
        </dl>
        <p class="stats-note">近 7 日完成 {{ stats.recentAttempts }} 次測驗、練習 {{ stats.recentTotal }} 題。以已完成的測驗按題數加總計算，含重複練習；未提交與逾時題目列為未答對。</p>
      </section>

      <section class="history-section revenge-record" aria-labelledby="revenge-record-title">
        <div>
          <h2 id="revenge-record-title">復仇戰戰績</h2>
          <p v-if="stats.revengeAttempts">挑戰 {{ stats.revengeAttempts }} 輪 · 全對通關 {{ stats.revengeWins }} 輪 · 累計答對 {{ stats.revengeCorrect }} 題</p>
          <p v-else>把曾經失手的題目，變成下一次的得分。</p>
        </div>
        <a :href="siteUrl('/exam/#revenge')">挑戰錯題 <SiteIcon name="arrow" :size="17" /></a>
      </section>

      <section class="history-section" aria-labelledby="attempt-title">
        <div class="section-heading">
          <h2 id="attempt-title">完成紀錄</h2>
          <label class="history-filter">模式 <select v-model="historyMode"><option value="all">全部模式</option><option value="practice">歷屆練習</option><option value="timed">限時測驗</option><option value="random">隨機抽題</option><option value="revenge">錯題復仇戰</option></select></label>
        </div>
        <p v-if="!visibleHistory.length" class="empty-state">{{ history.length ? '這個模式還沒有完成紀錄。' : '還沒有完成的測驗。完成任一科後，成績會顯示在這裡。' }}</p>
        <ol v-else class="attempt-list">
          <li v-for="entry in visibleHistory" :key="entry.id" class="attempt-row">
            <div>
              <span class="attempt-year">{{ ['random', 'revenge'].includes(entry.mode ?? '') ? (entry.years ?? [entry.year]).map(yearLabel).join('、') : yearLabel(entry.year) }} · {{ modeLabel(entry) }}</span>
              <strong>{{ subjectName(entry) }}</strong>
              <small>{{ dateLabel(entry.completedAt) }}</small>
            </div>
            <span class="attempt-score">{{ entry.score ?? entry.correct * 2 }} / {{ entry.maxScore ?? entry.total * 2 }} 分 <small>答對 {{ entry.correct }} / {{ entry.total }} 題</small></span>
          </li>
        </ol>
      </section>

      <section class="history-section" aria-labelledby="accuracy-title">
        <div class="section-heading"><h2 id="accuracy-title">各科答對率</h2><span>優先顯示較需加強的科目</span></div>
        <p v-if="!stats.subjects.length" class="empty-state">完成一份試卷或一輪挑戰後，就能查看各科表現。</p>
        <ul v-else class="subject-performance">
          <li v-for="subject in stats.subjects" :key="subject.id">
            <div class="performance-heading"><h3>{{ subject.name }}</h3><strong>{{ percent(subject.correct / subject.total * 100) }}</strong></div>
            <div class="accuracy-track" aria-hidden="true"><span :style="{ width: `${subject.correct / subject.total * 100}%` }" /></div>
            <p>答對 {{ subject.correct }} / {{ subject.total }} 題<span>練習 {{ subject.attempts }} 次</span><span>最近 {{ percent(subject.latest) }}</span><span>最佳 {{ percent(subject.best) }}</span></p>
          </li>
        </ul>
        <p class="stats-note">同一科目跨年度合計，共用試卷不重複計算；抽題與復仇戰依各題原科目歸類。{{ stats.unclassified ? `有 ${stats.unclassified} 題較早的抽題紀錄未記下原科目，僅計入總覽。` : '' }}</p>
      </section>

      <h2 class="progress-overview-title">歷屆試卷進度</h2>
      <div class="summary-grid" aria-label="科目進度總覽">
        <div><strong>{{ totals.complete }}</strong><span>已完成</span></div>
        <div><strong>{{ totals.active }}</strong><span>作答中</span></div>
        <div><strong>{{ totals.fresh }}</strong><span>尚未開始</span></div>
      </div>

      <section class="history-section" aria-labelledby="progress-title">
        <div class="section-heading">
          <h2 id="progress-title">各科目前進度</h2>
          <span>{{ subjects.length }} 科</span>
        </div>
        <div v-for="year in years" :key="year.year" class="year-section">
          <h3>{{ yearLabel(year.year) }}</h3>
          <div v-for="group in subjectGroups(year)" :key="group.id" class="subject-group">
            <h4>{{ group.name }}</h4>
            <a v-for="subject in group.subjects" :key="subject.id" class="subject-row" :href="examLink(year.year, subject)">
              <span class="subject-label">
                <span class="subject-name">{{ subject.name }}</span>
                <span class="subject-category">{{ subjectCategoryLabel(subject, year) }}</span>
              </span>
              <span class="subject-meta">
                <span class="status-badge" :class="{ active: (progress[`${year.year}-${subject.id}`] ?? 0) > 0 && (progress[`${year.year}-${subject.id}`] ?? 0) < subject.count, complete: (progress[`${year.year}-${subject.id}`] ?? 0) >= subject.count }">
                  {{ statusLabel(progress[`${year.year}-${subject.id}`] ?? 0, subject.count) }}
                </span>
                <SiteIcon name="arrow" :size="17" />
              </span>
            </a>
          </div>
        </div>
      </section>
      <p class="privacy-note">作答進度與完成紀錄只保存在目前瀏覽器；清除網站資料後無法恢復。</p>
    </template>
  </section>
</template>

<style scoped>
.performance-section h2 { margin: 0 0 16px; font-size: 1.45rem; }
.performance-overview { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; margin: 0; padding: 22px 0; border-block: 1px solid var(--color-border); }
.performance-overview dt { color: var(--color-text-muted); font-size: .86rem; }
.performance-overview dd { margin: 4px 0 0; color: var(--color-primary); font-size: 1.85rem; font-weight: 800; font-variant-numeric: tabular-nums; }
.performance-overview dd small { font-size: .9rem; font-weight: 400; }
.stats-note { margin: 12px 0 0; color: var(--color-text-muted); font-size: .82rem; line-height: 1.8; }
.revenge-record { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 18px; padding: 22px; border-radius: 16px; background: #fbf4e5; }
.revenge-record h2 { margin: 0 0 4px; color: #345238; font-size: 1.3rem; }
.revenge-record p { margin: 0; color: #65533b; font-size: .9rem; }
.revenge-record a { display: inline-flex; align-items: center; gap: 14px; min-height: 44px; color: #345238; font-weight: 700; }
.subject-performance { margin: 0; padding: 0; list-style: none; }
.subject-performance li { padding: 20px 0; border-bottom: 1px solid var(--color-border); }
.performance-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 20px; }
.performance-heading h3 { margin: 0; font-size: 1rem; }
.performance-heading strong { flex-shrink: 0; color: var(--color-primary); font-size: 1.2rem; font-variant-numeric: tabular-nums; }
.accuracy-track { height: 6px; overflow: hidden; margin: 10px 0; border-radius: 4px; background: var(--color-primary-soft); }
.accuracy-track span { display: block; height: 100%; background: var(--color-primary); }
.subject-performance p { display: flex; flex-wrap: wrap; gap: 4px 20px; margin: 0; color: var(--color-text-muted); font-size: .82rem; font-variant-numeric: tabular-nums; }
.progress-overview-title { margin: 36px 0 16px; font-size: 1.45rem; }
.history-filter { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 8px; font-size: .85rem; color: var(--color-text-muted); }
.history-filter select { min-height: 44px; max-width: 100%; padding: 6px 10px; border: 1px solid var(--color-control-border); border-radius: var(--radius-control); background: var(--color-surface); color: var(--color-text); font: inherit; }
.history-filter select:focus-visible, .revenge-record a:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 3px; }
@media (max-width: 600px) { .performance-overview { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; } .section-heading { flex-wrap: wrap; } }
.history-page { max-width: 960px; margin: 0 auto 60px; }
.page-heading { margin-bottom: 28px; }
.back-link { display: inline-block; margin-bottom: 14px; color: var(--color-primary); font-size: .88rem; }
.page-heading h1 { margin: 0 0 6px; color: var(--color-primary); }
.page-heading p { margin: 0; color: var(--color-text-muted); }
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 5em), 1fr)); gap: 12px; margin-bottom: 38px; }
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
.subject-label { display: grid; gap: 3px; }
.subject-category { color: var(--color-text-muted); font-size: .78rem; }
.subject-group { margin: 16px 0 24px; }
.subject-group h4 { margin: 0 0 8px; color: var(--color-text-muted); font-size: .86rem; }
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
