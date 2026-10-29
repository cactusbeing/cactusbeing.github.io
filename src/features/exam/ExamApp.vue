<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { siteUrl } from '../../shared/site-path';
import SiteIcon from '../../shared/components/SiteIcon.vue';
import { answeredCount, readResponses, responseStorageKey, saveHistoryEntry } from './progress';
import type { Choice, Subject, Year } from './progress';

type Question = {
  id: number;
  answer: Choice;
  accepted_answers?: Choice[];
  question: string;
  options: Record<Choice, string>;
  context?: string;
  image?: string;
  image_width?: number;
  image_height?: number;
  image_alt?: string;
  image_text?: string;
};
type Exam = {
  exam_metadata: { subject: string; source_page: string };
  multiple_choice_questions: Question[];
};

const manifest = ref<Year[]>([]);
const selectedYear = ref<number | null>(null);
const selectedSubject = ref<Subject | null>(null);
const exam = ref<Exam | null>(null);
const responses = ref<Record<number, Choice>>({});
const drafts = ref<Record<number, Choice>>({});
const questionIndex = ref(0);
const wrongOnly = ref(false);
const resultView = ref(false);
const exporting = ref(false);
const exportError = ref('');
const historySaveError = ref('');
const copyNotice = ref<{ id: number; message: string } | null>(null);
const loading = ref(true);
const error = ref('');
const practiceTitle = ref<HTMLElement | null>(null);
const subjectTitle = ref<HTMLElement | null>(null);
const resultTitle = ref<HTMLElement | null>(null);
const yearPicker = ref<HTMLDetailsElement | null>(null);
const subjectProgress = ref<Record<string, number>>({});
const currentYear = computed(() => manifest.value.find((item) => item.year === selectedYear.value));
const questions = computed(() => exam.value?.multiple_choice_questions ?? []);
function acceptedAnswers(question: Question): Choice[] {
  return question.accepted_answers?.length ? question.accepted_answers : [question.answer];
}
function isCorrect(question: Question, choice?: Choice): boolean {
  return Boolean(choice && acceptedAnswers(question).includes(choice));
}
function answerLabel(question: Question): string {
  return acceptedAnswers(question).join(' 或 ');
}
const answered = computed(() => questions.value.filter((item) => responses.value[item.id]).length);
const correct = computed(() => questions.value.filter((item) => isCorrect(item, responses.value[item.id])).length);
const wrong = computed(() => answered.value - correct.value);
const wrongQuestions = computed(() => questions.value.filter((item) => responses.value[item.id] && !isCorrect(item, responses.value[item.id])));
const visibleQuestions = computed(() =>
  wrongOnly.value
    ? questions.value.filter((item) => responses.value[item.id] && !isCorrect(item, responses.value[item.id]))
    : questions.value,
);
const currentGroup = computed(() => {
  const items = visibleQuestions.value;
  const current = items[questionIndex.value];
  if (!current) return null;
  let start = questionIndex.value;
  let end = questionIndex.value;
  if (current.context) {
    while (start > 0 && items[start - 1].context === current.context) start--;
    while (end < items.length - 1 && items[end + 1].context === current.context) end++;
  }
  return { start, end, context: current.context, questions: items.slice(start, end + 1) };
});

function refreshProgress() {
  subjectProgress.value = Object.fromEntries(
    manifest.value.flatMap((year) => year.subjects.map((subject) =>
      [`${year.year}-${subject.id}`, answeredCount(year.year, subject)])),
  );
}

function progressFor(subject: Subject): number {
  return subjectProgress.value[`${selectedYear.value}-${subject.id}`] ?? 0;
}

function progressLabel(subject: Subject): string {
  const count = progressFor(subject);
  if (!count) return '尚未開始';
  if (count >= subject.count) return '已完成';
  return `作答中 ${count}/${subject.count}`;
}

async function loadManifest() {
  loading.value = true;
  try {
    const response = await fetch(siteUrl('/assets/exams/index.json'));
    if (!response.ok) throw new Error('無法讀取題庫目錄');
    const data = (await response.json()) as { years: Year[] };
    if (!Array.isArray(data.years) || !data.years.length) throw new Error('題庫目錄沒有可用的年度');
    manifest.value = [...data.years].sort((a, b) => b.year - a.year);
    const params = new URLSearchParams(location.search);
    const linkedYear = manifest.value.find((item) => item.year === Number(params.get('year')));
    selectedYear.value = linkedYear?.year ?? manifest.value[0].year;
    refreshProgress();
    const linkedSubject = params.get('subject');
    const subject = linkedSubject && currentYear.value?.subjects.find((item) => item.id === linkedSubject);
    if (subject) await chooseSubject(subject);
  } catch {
    error.value = '題庫載入失敗，請重新整理頁面再試一次。';
  } finally {
    loading.value = false;
  }
}

function closeYearPicker() {
  if (!yearPicker.value) return;
  yearPicker.value.open = false;
  yearPicker.value.querySelector('summary')?.focus();
}

function chooseMobileYear(year: number) {
  chooseYear(year);
  closeYearPicker();
}

function chooseYear(year: number) {
  selectedYear.value = year;
  selectedSubject.value = null;
  exam.value = null;
  wrongOnly.value = false;
  resultView.value = false;
  error.value = '';
  refreshProgress();
}

async function chooseSubject(subject: Subject) {
  loading.value = true;
  error.value = '';
  wrongOnly.value = false;
  try {
    const response = await fetch(siteUrl(subject.data));
    if (!response.ok) throw new Error('無法讀取科目題庫');
    const data = (await response.json()) as Exam;
    if (!Array.isArray(data.multiple_choice_questions) || !data.multiple_choice_questions.length)
      throw new Error('科目題庫沒有題目');
    exam.value = data;
    selectedSubject.value = subject;
    responses.value = readResponses(selectedYear.value!, subject.id);
    drafts.value = {};
    const firstUnanswered = data.multiple_choice_questions.findIndex((item) => !responses.value[item.id]);
    questionIndex.value = firstUnanswered < 0 ? 0 : firstUnanswered;
    resultView.value = firstUnanswered < 0;
    await nextTick();
    practiceTitle.value?.focus();
  } catch {
    error.value = '這科的題目暫時無法載入，請再試一次。';
  } finally {
    loading.value = false;
  }
}

async function backToSubjects() {
  selectedSubject.value = null;
  exam.value = null;
  await nextTick();
  subjectTitle.value?.focus();
}

async function goToQuestion(index: number) {
  if (index < 0 || index >= visibleQuestions.value.length) return;
  resultView.value = false;
  questionIndex.value = index;
  await nextTick();
  document.getElementById(`exam-question-${visibleQuestions.value[index].id}`)?.focus();
}

function selectChoice(question: Question, choice: Choice) {
  if (responses.value[question.id]) return;
  drafts.value = { ...drafts.value, [question.id]: choice };
}

async function submitAnswer(question: Question) {
  const choice = drafts.value[question.id];
  if (!choice || !selectedSubject.value || responses.value[question.id]) return;
  responses.value = { ...responses.value, [question.id]: choice };
  try {
    localStorage.setItem(responseStorageKey(selectedYear.value!, selectedSubject.value.id), JSON.stringify(responses.value));
  } catch {
    // Practice still works when browser storage is disabled.
  }
  refreshProgress();
  if (answered.value === questions.value.length) {
    historySaveError.value = saveHistoryEntry({
      year: selectedYear.value!,
      subjectId: selectedSubject.value.id,
      subjectName: selectedSubject.value.name,
      correct: correct.value,
      total: questions.value.length,
      completedAt: new Date().toISOString(),
    }) ? '' : '這次成績無法儲存至瀏覽器，請確認瀏覽器儲存空間設定。';
    resultView.value = true;
    await nextTick();
    resultTitle.value?.focus();
  }
}

async function showResults() {
  resultView.value = true;
  await nextTick();
  resultTitle.value?.focus();
}

async function exportWrongBook() {
  if (!selectedYear.value || !selectedSubject.value || !wrongQuestions.value.length || exporting.value) return;
  exporting.value = true;
  exportError.value = '';
  try {
    const { downloadWrongBook } = await import('./wrong-book-pdf');
    await downloadWrongBook(selectedYear.value, selectedSubject.value.name, wrongQuestions.value, responses.value, correct.value, questions.value.length);
  } catch {
    exportError.value = 'PDF 產生失敗，請再試一次。';
  } finally {
    exporting.value = false;
  }
}

function showWrongOnly(enabled: boolean) {
  wrongOnly.value = enabled;
  void goToQuestion(0);
}

async function copyAiPrompt(question: Question) {
  const ownAnswer = responses.value[question.id] ?? drafts.value[question.id];
  const lines = [
    '請協助我理解以下教師資格考試題目。請先說明參考答案為何正確，再分析我的作答，並簡要說明其他選項。若題目資訊不足，請指出缺少什麼，不要猜測。',
    '',
    `${selectedYear.value} 年｜${selectedSubject.value?.name ?? ''}｜第 ${question.id} 題`,
    ...(question.context ? [`閱讀資料：\n${question.context}`, ''] : []),
    `題目：${question.question}`,
    ...(question.image_text ? [`附圖文字：${question.image_text}`] : []),
    ...(question.image ? [`原題附圖：${new URL(siteUrl(question.image), location.href).href}`] : []),
    ...(['A', 'B', 'C', 'D'] as const).map((choice) => `${choice}. ${question.options[choice]}`),
    '',
    `我的作答：${ownAnswer ?? '尚未作答'}`,
    `參考答案：${answerLabel(question)}`,
  ];
  try {
    await navigator.clipboard.writeText(lines.join('\n'));
    copyNotice.value = { id: question.id, message: '已複製問 AI 提示詞' };
  } catch {
    copyNotice.value = { id: question.id, message: '複製失敗，請檢查剪貼簿權限' };
  }
}

function resetSubject() {
  if (!selectedSubject.value) return;
  if (answered.value && !window.confirm('重新作答會清除目前這一輪的進度；已完成的歷史成績會保留。確定繼續？')) return;
  responses.value = {};
  drafts.value = {};
  questionIndex.value = 0;
  wrongOnly.value = false;
  resultView.value = false;
  exportError.value = '';
  historySaveError.value = '';
  try {
    localStorage.removeItem(responseStorageKey(selectedYear.value!, selectedSubject.value.id));
  } catch {
    // The in-memory answers were already cleared.
  }
  refreshProgress();
}

onMounted(loadManifest);
</script>

<template>
  <section class="exam-page" aria-labelledby="exam-title">
    <header class="page-heading">
      <div>
        <h1 id="exam-title">教師資格考試題庫</h1>
        <p>教檢線上測驗收錄 111 至 115 年教師資格考試選擇題與教檢考古題，包含特教教檢科目。選擇年度與科目練習，完成後查看分數與錯題。</p>
      </div>
      <nav class="page-links" aria-label="測驗頁面連結">
        <a :href="siteUrl('/exam/history/')">作答歷史 <SiteIcon name="arrow" :size="16" /></a>
      </nav>
    </header>

    <p v-if="error" class="load-message" role="alert">{{ error }}</p>
    <p v-if="loading && !manifest.length" class="load-message" role="status">題庫載入中…</p>

    <template v-if="manifest.length">
      <details ref="yearPicker" class="mobile-year-picker" @keydown.esc.prevent="closeYearPicker">
        <summary>
          <span>考試年度</span>
          <strong>{{ selectedYear }} 年</strong>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </summary>
        <div class="mobile-year-options" role="group" aria-label="選擇考試年度">
          <button v-for="item in manifest" :key="item.year" type="button" :aria-pressed="selectedYear === item.year" @click="chooseMobileYear(item.year)">
            <span>{{ item.year }} 年</span>
            <span v-if="selectedYear === item.year" class="current-year-label">目前年度</span>
          </button>
        </div>
      </details>
      <div class="year-picker" role="group" aria-label="選擇考試年度">
        <button
          v-for="item in manifest"
          :key="item.year"
          type="button"
          :class="{ active: selectedYear === item.year }"
          :aria-pressed="selectedYear === item.year"
          @click="chooseYear(item.year)"
        >
          {{ item.year }} 年
        </button>
      </div>

      <div v-if="!selectedSubject || !exam" class="subject-list">
        <div class="subject-heading">
          <h2 ref="subjectTitle" tabindex="-1">{{ selectedYear }} 年試題</h2>
          <p>共 {{ currentYear?.subjects.length }} 科，點選科目開始練習。</p>
        </div>
        <button
          v-for="subject in currentYear?.subjects"
          :key="subject.id"
          type="button"
          class="subject-row"
          :disabled="loading"
          @click="chooseSubject(subject)"
        >
          <span class="subject-name">{{ subject.name }}</span>
          <span class="subject-meta">
            <span class="progress-badge" :class="{ 'in-progress': progressFor(subject) > 0 && progressFor(subject) < subject.count, completed: progressFor(subject) >= subject.count }">{{ progressLabel(subject) }}</span>
            <span>{{ subject.count }} 題</span><SiteIcon name="arrow" :size="17" />
          </span>
        </button>
        <p class="privacy-note">作答紀錄只會儲存在目前瀏覽器，不需登入。</p>
      </div>

      <div v-else class="practice-layout">
        <div class="practice-main">
          <div class="practice-heading">
            <div>
              <button type="button" class="back-link" @click="backToSubjects">
                ← 返回科目
              </button>
              <h2 ref="practiceTitle" tabindex="-1">{{ selectedSubject.name }}</h2>
              <p>{{ selectedYear }} 年 · 已作答 {{ answered }} / {{ questions.length }} 題 · 答對 {{ correct }} 題</p>
            </div>
            <a class="official-link" :href="exam.exam_metadata.source_page" target="_blank" rel="noopener">官方歷屆試題與答案 <SiteIcon name="arrow" :size="16" /></a>
          </div>

          <section v-if="resultView" class="result-section" aria-labelledby="result-title">
            <div class="result-summary">
              <div>
                <h3 id="result-title" ref="resultTitle" tabindex="-1">測驗結果</h3>
                <p>答對 {{ correct }} 題 · 答錯 {{ wrong }} 題 · 共 {{ questions.length }} 題</p>
              </div>
              <p class="result-score"><strong>{{ correct * 2 }}</strong><span>／ 50 分</span></p>
            </div>
            <div class="result-actions">
              <button v-if="wrong" type="button" class="download-button" :disabled="exporting" @click="exportWrongBook">
                {{ exporting ? '正在產生 PDF…' : '下載錯題本（PDF）' }}
              </button>
              <button type="button" class="review-button" @click="goToQuestion(0)">查看全部題目</button>
              <button type="button" class="review-button" @click="resetSubject">重新作答此科</button>
            </div>
            <p v-if="exportError" class="export-error" role="alert">{{ exportError }}</p>
            <p v-if="historySaveError" class="export-error" role="alert">{{ historySaveError }}</p>
            <div v-if="wrong" class="wrong-list">
              <h3>錯題總覽（{{ wrong }} 題）</h3>
              <article v-for="question in wrongQuestions" :key="question.id" class="question-card wrong-card">
                <div class="question-topline">
                  <span class="wrong-number">第 {{ question.id }} 題</span>
                  <button type="button" class="copy-ai-button" :aria-label="`複製第 ${question.id} 題問 AI 提示詞`" title="複製問 AI 提示詞" @click="copyAiPrompt(question)"><SiteIcon name="copy" :size="18" /></button>
                </div>
                <p v-if="copyNotice?.id === question.id" class="copy-notice" role="status">{{ copyNotice.message }}</p>
                <details v-if="question.context" class="passage" open>
                  <summary>閱讀文章</summary>
                  <p>{{ question.context }}</p>
                </details>
                <h4>{{ question.question }}</h4>
                <figure v-if="question.image" class="question-image">
                  <a :href="siteUrl(question.image)" target="_blank" rel="noopener" aria-label="放大查看原試題附圖">
                    <img :src="siteUrl(question.image)" :alt="question.image_alt || '題目附圖'" :width="question.image_width" :height="question.image_height" />
                  </a>
                  <figcaption>原試題附圖，可點擊放大</figcaption>
                </figure>
                <details v-if="question.image_text" class="table-text" open>
                  <summary>附圖文字版</summary>
                  <p>{{ question.image_text }}</p>
                </details>
                <ul class="result-options">
                  <li v-for="choice in (['A', 'B', 'C', 'D'] as const)" :key="choice" :class="{ 'is-correct': acceptedAnswers(question).includes(choice), 'is-wrong': choice === responses[question.id] && !isCorrect(question, choice) }">
                    <strong>{{ choice }}</strong><span>{{ question.options[choice] }}</span>
                  </li>
                </ul>
                <p class="answer-feedback">你的答案：{{ responses[question.id] }}　參考答案：{{ answerLabel(question) }}</p>
              </article>
            </div>
            <p v-else class="all-correct">全部答對，沒有需要複習的錯題。</p>
          </section>

          <button v-if="!resultView && answered === questions.length" type="button" class="back-link result-return" @click="showResults">← 返回測驗結果</button>

          <div v-if="!resultView && wrong > 0" class="view-switch" aria-label="題目範圍">
            <button type="button" :aria-pressed="!wrongOnly" :class="{ active: !wrongOnly }" @click="showWrongOnly(false)">全部題目</button>
            <button type="button" :aria-pressed="wrongOnly" :class="{ active: wrongOnly }" @click="showWrongOnly(true)">只看錯題（{{ wrong }}）</button>
          </div>

          <section v-if="!resultView && currentGroup" class="question-set" aria-label="本頁題目">
            <div v-if="currentGroup.questions.length > 1" class="set-heading">
              <h3>第 {{ currentGroup.questions[0].id }}～{{ currentGroup.questions[currentGroup.questions.length - 1].id }} 題</h3>
              <span>共用閱讀文章 · {{ currentGroup.questions.length }} 題</span>
            </div>
            <details v-if="currentGroup.context" :key="currentGroup.start" class="passage" open>
              <summary>閱讀文章</summary>
              <p>{{ currentGroup.context }}</p>
            </details>
            <article v-for="(question, offset) in currentGroup.questions" :key="question.id" class="question-card">
              <div class="question-topline">
                <span>第 {{ question.id }} 題</span>
                <span class="question-tools">
                  <span>{{ currentGroup.start + offset + 1 }} / {{ visibleQuestions.length }}</span>
                  <button type="button" class="copy-ai-button" :aria-label="`複製第 ${question.id} 題問 AI 提示詞`" title="複製問 AI 提示詞" @click="copyAiPrompt(question)"><SiteIcon name="copy" :size="18" /></button>
                </span>
              </div>
              <p v-if="copyNotice?.id === question.id" class="copy-notice" role="status">{{ copyNotice.message }}</p>
              <h3 :id="`exam-question-${question.id}`" tabindex="-1">{{ question.question }}</h3>
              <figure v-if="question.image" class="question-image">
                <a :href="siteUrl(question.image)" target="_blank" rel="noopener" aria-label="放大查看原試題附圖">
                  <img :src="siteUrl(question.image)" :alt="question.image_alt || '題目附圖'" :width="question.image_width" :height="question.image_height" />
                </a>
                <figcaption>原試題附圖，可點擊放大</figcaption>
              </figure>
              <details v-if="question.image_text" class="table-text">
                <summary>閱讀表格文字版</summary>
                <p>{{ question.image_text }}</p>
              </details>
              <div class="choices" role="group" :aria-label="`第 ${question.id} 題選項`">
                <button
                  v-for="choice in (['A', 'B', 'C', 'D'] as const)"
                  :key="choice"
                  type="button"
                  class="choice"
                  :class="{
                    selected: drafts[question.id] === choice && !responses[question.id],
                    'is-correct': responses[question.id] && acceptedAnswers(question).includes(choice),
                    'is-wrong': responses[question.id] === choice && !isCorrect(question, choice),
                  }"
                  :aria-pressed="(responses[question.id] || drafts[question.id]) === choice"
                  :disabled="Boolean(responses[question.id])"
                  @click="selectChoice(question, choice)"
                >
                  <span class="choice-letter">{{ choice }}</span>
                  <span>{{ question.options[choice] }}</span>
                </button>
              </div>
              <p v-if="responses[question.id]" class="answer-feedback" role="status">
                {{ isCorrect(question, responses[question.id]) ? '答對了。' : `答錯了，你選 ${responses[question.id]}。` }}
                參考答案是 {{ answerLabel(question) }}。
              </p>
              <div class="question-actions">
                <button type="button" :disabled="currentGroup.start + offset === 0" @click="goToQuestion(currentGroup.start + offset - 1)">上一題</button>
                <button v-if="!responses[question.id]" type="button" :disabled="!drafts[question.id]" @click="submitAnswer(question)">送出答案</button>
                <button v-else-if="currentGroup.start + offset < visibleQuestions.length - 1" type="button" @click="goToQuestion(currentGroup.start + offset + 1)">下一題</button>
              </div>
            </article>
          </section>
        </div>

        <aside v-if="!resultView" class="question-sidebar" aria-label="題號與進度">
          <div class="sidebar-heading">
            <h3>題目進度</h3>
            <span>{{ answered }} / {{ questions.length }}</span>
          </div>
          <progress :value="answered" :max="questions.length">{{ answered }} / {{ questions.length }}</progress>
          <div class="question-grid">
            <button
              v-for="(item, index) in visibleQuestions"
              :key="item.id"
              type="button"
              :class="{
                current: index === questionIndex,
                correct: isCorrect(item, responses[item.id]),
                wrong: responses[item.id] && !isCorrect(item, responses[item.id]),
              }"
              :aria-label="`第 ${item.id} 題${responses[item.id] ? (isCorrect(item, responses[item.id]) ? '，答對' : '，答錯') : '，尚未作答'}`"
              :aria-current="index === questionIndex ? 'step' : undefined"
              @click="goToQuestion(index)"
            >{{ item.id }}</button>
          </div>
          <button type="button" class="reset-button" @click="resetSubject">重新作答此科</button>
          <p class="privacy-note">進度僅保存在目前瀏覽器。</p>
        </aside>
      </div>
    </template>
  </section>
</template>

<style scoped>
.exam-page { max-width: 1120px; margin: 0 auto 56px; }
.page-heading, .practice-heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; }
.page-heading { margin-bottom: 32px; }
.page-heading h1 { color: var(--color-primary); margin-bottom: 8px; }
.page-heading p, .practice-heading p, .subject-heading p { color: var(--color-text-muted); margin: 0; }
.page-heading a { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; font-size: .9rem; }
.page-links { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; }
.mobile-year-picker { display: none; }
.year-picker { display: flex; gap: 10px; border-bottom: 1px solid var(--color-border); margin-bottom: 30px; }
.year-picker button { flex-shrink: 0; min-height: 48px; padding: 8px 22px; border: 0; border-bottom: 3px solid transparent; background: transparent; color: var(--color-text-muted); font-weight: 700; white-space: nowrap; }
.year-picker button:hover, .year-picker button.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }
.subject-list { max-width: 860px; }
.subject-heading { margin-bottom: 18px; }
.subject-heading h2 { margin-bottom: 4px; }
.subject-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; width: 100%; min-height: 76px; padding: 16px 22px; margin-bottom: 10px; text-align: left; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 14px; color: var(--color-text); }
.subject-row:hover { border-color: var(--color-primary); background: var(--color-surface-muted); }
.subject-name { font-size: 1.08rem; font-weight: 700; }
.subject-meta { display: inline-flex; align-items: center; gap: 16px; white-space: nowrap; color: var(--color-primary); font-size: .9rem; }
.progress-badge { display: inline-flex; align-items: center; min-height: 30px; padding: 3px 10px; border-radius: 999px; background: var(--color-surface-muted); color: var(--color-text-muted); font-size: .78rem; font-weight: 700; }
.progress-badge.in-progress { background: #fff4df; color: #80520b; }
.progress-badge.completed { background: var(--color-primary-soft); color: var(--color-primary); }
.privacy-note { color: var(--color-text-muted); font-size: .82rem; margin-top: 18px; }
.practice-layout { display: grid; grid-template-columns: minmax(0, 1fr) 248px; gap: 32px; align-items: start; }
.practice-main { min-width: 0; }
.practice-heading { align-items: flex-start; margin-bottom: 24px; }
.practice-heading h2 { margin: 12px 0 4px; }
.back-link { padding: 0; border: 0; background: none; color: var(--color-primary); font-size: .88rem; }
.official-link { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; font-size: .86rem; }
.result-section { min-width: 0; }
.result-summary { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 24px; border-radius: 16px; background: var(--color-primary-soft); color: var(--color-primary); }
.result-summary h3 { margin: 0 0 6px; font-size: 1.45rem; }
.result-summary p { margin: 0; color: var(--color-primary); }
.result-score { white-space: nowrap; font-variant-numeric: tabular-nums; }
.result-score strong { font-size: clamp(2.3rem, 5vw, 3.4rem); line-height: 1; }
.result-score span { font-size: .95rem; font-weight: 700; }
.result-actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0 28px; }
.result-actions button { min-height: 44px; padding: 9px 18px; border-radius: 10px; font-weight: 700; }
.download-button { border: 1px solid var(--color-primary); background: var(--color-primary); color: white; }
.download-button:disabled { opacity: .65; cursor: wait; }
.review-button { border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-primary); }
.export-error { color: var(--color-danger); font-weight: 700; }
.wrong-list > h3 { margin: 0 0 16px; font-size: 1.2rem; }
.wrong-card { margin-bottom: 16px; }
.wrong-number { margin: 0; color: var(--color-primary); font-weight: 750; }
.wrong-card h4 { font-size: 1.13rem; line-height: 1.8; white-space: pre-line; margin: 16px 0 20px; }
.wrong-card .passage { margin: 16px 0 0; }
.result-options { display: grid; gap: 9px; margin: 0; padding: 0; list-style: none; }
.result-options li { display: flex; gap: 14px; padding: 11px 14px; border: 1px solid var(--color-border); border-radius: 10px; white-space: pre-line; line-height: 1.65; }
.result-options li strong { color: var(--color-primary); }
.result-options li.is-correct { background: var(--color-primary-soft); border-color: var(--color-primary); }
.result-options li.is-wrong { background: #fcf2f0; border-color: var(--color-danger); }
.result-options li.is-wrong strong { color: var(--color-danger); }
.all-correct { padding: 18px 0; color: var(--color-primary); font-weight: 700; }
.result-return { margin: 0 0 18px; }
.view-switch { display: flex; gap: 6px; margin-bottom: 18px; }
.view-switch button { min-height: 44px; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-surface); color: var(--color-text); padding: 8px 16px; }
.view-switch button.active { border-color: var(--color-primary); background: var(--color-primary-soft); color: var(--color-primary); font-weight: 700; }
.set-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; margin: 0 0 16px; }
.set-heading h3 { margin: 0; color: var(--color-primary); }
.set-heading span { color: var(--color-text-muted); font-size: .84rem; }
.question-card { padding: clamp(20px, 4vw, 32px); border: 1px solid var(--color-border); border-radius: 16px; background: var(--color-surface); }
.question-card + .question-card { margin-top: 16px; }
.question-topline { display: flex; justify-content: space-between; color: var(--color-text-muted); font-size: .86rem; font-variant-numeric: tabular-nums; }
.question-topline span:first-child { color: var(--color-primary); font-weight: 750; }
.question-tools { display: inline-flex; align-items: center; gap: 12px; }
.copy-ai-button { display: inline-grid; place-items: center; flex: 0 0 36px; width: 36px; height: 36px; padding: 0; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-surface); color: var(--color-primary); }
.copy-ai-button:hover { border-color: var(--color-primary); background: var(--color-primary-soft); }
.copy-ai-button:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
.copy-notice { margin: 6px 0 0; color: var(--color-primary); font-size: .8rem; font-weight: 700; text-align: right; }
.question-card h3 { font-size: 1.18rem; line-height: 1.8; margin: 18px 0 22px; white-space: pre-line; }
.passage { background: var(--color-surface-muted); border-radius: 12px; padding: 16px 18px; margin-top: 18px; }
.question-set > .passage { margin: 0 0 20px; }
.passage summary, .table-text summary { cursor: pointer; color: var(--color-primary); font-weight: 700; }
.passage p, .table-text p { white-space: pre-line; line-height: 1.9; margin: 12px 0 0; }
.question-image { margin: 0 0 12px; }
.question-image img { display: block; width: 100%; height: auto; }
.question-image figcaption { font-size: .78rem; color: var(--color-text-muted); }
.table-text { margin-bottom: 18px; font-size: .85rem; }
.choices { display: grid; gap: 10px; }
.choice { display: flex; align-items: flex-start; gap: 14px; width: 100%; min-height: 55px; padding: 13px 16px; text-align: left; line-height: 1.65; border: 1px solid var(--color-control-border); border-radius: 12px; background: var(--color-surface); color: var(--color-text); white-space: pre-line; }
.choice:not(:disabled):hover { border-color: var(--color-primary); background: var(--color-surface-muted); }
.choice.selected { border-color: var(--color-primary); background: var(--color-primary-soft); box-shadow: inset 0 0 0 1px var(--color-primary); }
.choice:disabled { cursor: default; opacity: 1; background: var(--color-surface); color: var(--color-text); border-color: var(--color-border); }
.choice.is-correct, .choice.is-correct:disabled { border-color: var(--color-primary); background: var(--color-primary-soft); }
.choice.is-wrong, .choice.is-wrong:disabled { border-color: var(--color-danger); background: #fcf2f0; }
.choice-letter { display: inline-grid; place-items: center; flex: 0 0 28px; height: 28px; border-radius: 8px; background: var(--color-surface-muted); color: var(--color-primary); font-size: .82rem; font-weight: 800; }
.answer-feedback { margin: 16px 0 0; font-weight: 700; color: var(--color-primary); }
.question-actions { display: flex; justify-content: space-between; gap: 12px; margin-top: 28px; }
.question-actions button { min-width: 102px; min-height: 44px; padding: 8px 16px; border: 1px solid var(--color-primary); border-radius: 10px; background: var(--color-primary); color: white; }
.question-actions button:first-child { background: white; color: var(--color-primary); }
.question-actions button:disabled { background: var(--color-disabled-bg); border-color: var(--color-disabled-border); color: var(--color-disabled-text); }
.question-sidebar { position: sticky; top: 24px; border: 1px solid var(--color-border); border-radius: 14px; padding: 20px; }
.sidebar-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 6px; }
.sidebar-heading h3 { margin: 0 0 10px; font-size: 1rem; }
.sidebar-heading span { font-size: .82rem; color: var(--color-text-muted); font-variant-numeric: tabular-nums; }
progress { width: 100%; height: 8px; accent-color: var(--color-primary); }
.question-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 7px; margin-top: 20px; }
.question-grid button { min-height: 40px; padding: 0; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-surface); color: var(--color-text); font-size: .85rem; font-variant-numeric: tabular-nums; }
.question-grid button.current { outline: 2px solid var(--color-primary); outline-offset: 1px; }
.question-grid button.correct { background: var(--color-primary-soft); color: var(--color-primary); border-color: var(--color-primary); }
.question-grid button.wrong { background: #fcf2f0; color: var(--color-danger); border-color: var(--color-danger); }
.reset-button { width: 100%; min-height: 44px; margin-top: 24px; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-surface); color: var(--color-primary); }
.reset-button:hover { border-color: var(--color-primary); }
.question-sidebar .privacy-note { margin-bottom: 0; }
.load-message { padding: 16px; background: var(--color-surface-muted); border-radius: 12px; }
@media (max-width: 800px) { .practice-layout { grid-template-columns: 1fr; } .question-sidebar { position: static; } .page-heading, .practice-heading { align-items: flex-start; flex-direction: column; gap: 12px; } }
@media (max-width: 600px) {
  .year-picker { display: none; }
  .mobile-year-picker { display: block; margin-bottom: 28px; }
  .mobile-year-picker summary { display: grid; grid-template-columns: 1fr auto 20px; align-items: center; gap: 12px; min-height: 52px; padding: 10px 14px; border: 1px solid var(--color-control-border); border-radius: var(--radius-control); color: var(--color-primary); background: var(--color-surface); cursor: pointer; list-style: none; }
  .mobile-year-picker summary::-webkit-details-marker { display: none; }
  .mobile-year-picker summary > span { color: var(--color-text-muted); font-size: .9rem; }
  .mobile-year-picker[open] summary svg { transform: rotate(180deg); }
  .mobile-year-options { display: grid; gap: 4px; padding: 6px; margin-top: 8px; border: 1px solid var(--color-border); border-radius: var(--radius-control); }
  .mobile-year-options button { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; min-height: 48px; padding: 10px 12px; border: 0; border-radius: 8px; background: var(--color-surface); color: var(--color-primary); font-weight: 700; text-align: left; }
  .mobile-year-options button:hover, .mobile-year-options button[aria-pressed='true'] { background: var(--color-primary-soft); }
  .current-year-label { font-size: .8rem; font-weight: 400; }
}
@media (max-width: 560px) { .subject-row { padding: 14px 16px; } .subject-name { font-size: 1rem; } .question-card { padding: 18px; } .question-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); } .set-heading { display: block; } .set-heading span { display: block; margin-top: 4px; } }
@media (max-width: 560px) { .subject-row { align-items: flex-start; flex-direction: column; gap: 10px; } .subject-meta { flex-wrap: wrap; } }
@media (max-width: 560px) { .result-summary { align-items: flex-start; flex-direction: column; } .result-actions button { width: 100%; } }
</style>
