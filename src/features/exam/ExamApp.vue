<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import './exam-shell.css';
import { siteUrl } from '../../shared/site-path';
import SiteIcon from '../../shared/components/SiteIcon.vue';
import { answeredCount, readResponses, responseStorageKey, saveHistoryEntry } from './progress';
import type { Choice, Subject, Year } from './progress';
import { categoriesForYear, examYearLabel, subjectCategoryLabel, subjectGroups } from './classification';
import MathText from './MathText.vue';
import MathQuestionContent from './MathQuestionContent.vue';
import { contentImages } from './question-content';
import { formatCountdown, remainingSeconds, sampleQuestions, sourceLabel } from './session';
import type { Exam, Question } from './session';
import RevengeGate from './RevengeGate.vue';
import CountdownTrack from './CountdownTrack.vue';
import ExamEntryMenu from './ExamEntryMenu.vue';
import { loadRevengePool, recordOutcome } from './training';

const manifest = ref<Year[]>([]);
const selectedYear = ref<number | null>(null);
const selectedCategory = ref('all');
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
const loadingSubjectId = ref<string | null>(null);
const error = ref('');
const practiceTitle = ref<HTMLElement | null>(null);
const subjectTitle = ref<HTMLElement | null>(null);
const resultTitle = ref<HTMLElement | null>(null);
const yearPicker = ref<HTMLDetailsElement | null>(null);
const categoryPicker = ref<HTMLDetailsElement | null>(null);
const subjectProgress = ref<Record<string, number>>({});
const mode = ref<'menu' | 'past' | 'random' | 'revenge'>('menu');
const timingPanelOpen = ref(false);
function readTimingPreferences(): { seconds?: number; minutes?: number } {
  try {
    const parsed = JSON.parse(localStorage.getItem('cactusbeing-exam-settings-v1') || '{}');
    return {
      seconds: Number.isInteger(parsed?.seconds) && parsed.seconds >= 1 && parsed.seconds <= 3600 ? parsed.seconds : undefined,
      minutes: Number.isInteger(parsed?.minutes) && parsed.minutes >= 1 && parsed.minutes <= 10080 ? parsed.minutes : undefined,
    };
  } catch { return {}; }
}
const savedTiming = readTimingPreferences();
const perQuestionEnabled = ref(false);
const perQuestionSeconds = ref(savedTiming.seconds ?? 60);
const paperEnabled = ref(false);
const paperMinutes = ref<number | null>(savedTiming.minutes ?? 25);
const paperMinutesEdited = ref(savedTiming.minutes !== undefined);
function saveTimingPreferences() {
  try {
    const saved = readTimingPreferences();
    if (Number.isInteger(perQuestionSeconds.value) && perQuestionSeconds.value >= 1 && perQuestionSeconds.value <= 3600) saved.seconds = perQuestionSeconds.value;
    if (paperMinutesEdited.value && Number.isInteger(paperMinutes.value) && paperMinutes.value! >= 1 && paperMinutes.value! <= 10080) saved.minutes = paperMinutes.value!;
    localStorage.setItem('cactusbeing-exam-settings-v1', JSON.stringify(saved));
  } catch { /* Timing remains usable without browser storage. */ }
}
watch(perQuestionSeconds, saveTimingPreferences);
function updatePaperMinutes(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  paperMinutes.value = value === '' ? null : Number(value);
  paperMinutesEdited.value = true;
  saveTimingPreferences();
}
const randomYears = ref<number[]>([]);
const randomSubjects = ref<string[]>([]);
const randomCount = ref(25);
watch(randomCount, value => { if (!paperMinutesEdited.value && Number.isInteger(value) && value > 0) paperMinutes.value = value; });
const randomAttempt = ref(false);
const revengeAttempt = ref(false);
const revengeSceneActive = computed(() => revengeAttempt.value && Boolean(selectedSubject.value));
const revengePlaying = computed(() => revengeSceneActive.value && !resultView.value && !finished.value);
watch([revengeSceneActive, revengePlaying, selectedSubject], () => {
  document.body.classList.toggle('exam-revenge-scene', revengeSceneActive.value);
  document.body.classList.toggle('exam-revenge-playing', revengePlaying.value);
  document.body.classList.toggle('exam-practicing', Boolean(selectedSubject.value));
});
const preparingQuestion = ref(false);
const preparationError = ref('');
const battleScrollAll = ref(false);
const battleReadingOverflow = ref(false);
let preparationVersion = 0;
let battleObserver: ResizeObserver | undefined;
const revengePool = ref<Question[]>([]);
const revengeLoading = ref(true);
const revengeError = ref('');
const mistakeSaveError = ref('');
let attemptStartedAt = 0;
const attemptYears = ref<number[]>([]);
const finished = ref(false);
const expired = ref<Record<number, 'question' | 'paper' | 'submitted'>>({});
const notice = ref('');
const clockNow = ref(Date.now());
const questionDeadline = ref<number | null>(null);
const paperDeadline = ref<number | null>(null);
const activeSeconds = ref(0);
const activeMinutes = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;
let attemptLoad: AbortController | undefined;
function cancelAttemptLoad() {
  if (!attemptLoad) return;
  attemptLoad.abort();
  attemptLoad = undefined;
  loading.value = false;
  loadingSubjectId.value = null;
}
function beginAttemptLoad() {
  cancelAttemptLoad();
  const request = new AbortController();
  attemptLoad = request;
  loading.value = true;
  return request;
}
function isCurrentLoad(request: AbortController) {
  return attemptLoad === request && !request.signal.aborted;
}
function finishAttemptLoad(request: AbortController) {
  if (!isCurrentLoad(request)) return;
  attemptLoad = undefined;
  loading.value = false;
  loadingSubjectId.value = null;
}
const timedAttempt = computed(() => activeSeconds.value > 0 || activeMinutes.value > 0);
const sequential = computed(() => activeSeconds.value > 0 && !finished.value);
const isolatedAttempt = computed(() => randomAttempt.value || timedAttempt.value);
const inAttempt = computed(() => Boolean(exam.value) && !finished.value);
const completedCount = computed(() => answered.value + Object.keys(expired.value).length);
const questionRemaining = computed(() => remainingSeconds(questionDeadline.value, clockNow.value));
const paperRemaining = computed(() => remainingSeconds(paperDeadline.value, clockNow.value));
const revengeUrgent = computed(() => revengeAttempt.value && sequential.value && !preparingQuestion.value && questionRemaining.value <= 15);
const revengePulse = computed(() => `${(0.65 + Math.max(0, questionRemaining.value - 1) / 14 * 1.15).toFixed(2)}s`);
const randomSubjectOptions = computed(() => {
  const options = new Map<string, { id: string; name: string; notes: string[] }>();
  for (const year of manifest.value.filter((item) => randomYears.value.includes(item.year))) {
    for (const subject of year.subjects) {
      const existing = options.get(subject.id);
      if (!existing) options.set(subject.id, { id: subject.id, name: subject.name, notes: [] });
      else if (existing.name !== subject.name) existing.notes.push(`${year.year} 年：${subject.name}`);
    }
  }
  return [...options.values()];
});
const randomPapers = computed(() => manifest.value.filter((year) => randomYears.value.includes(year.year))
  .flatMap((year) => year.subjects.filter((subject) => randomSubjects.value.includes(subject.id))
    .map((subject) => ({ year: year.year, sitting: year.sitting, subject }))));
const poolCount = computed(() => randomPapers.value.reduce((sum, paper) => sum + paper.subject.count, 0));
const settingsError = computed(() => {
  if (perQuestionEnabled.value && (!Number.isInteger(perQuestionSeconds.value) || perQuestionSeconds.value < 1 || perQuestionSeconds.value > 3600))
    return '每題秒數請輸入 1 至 3600 的整數。';
  if (paperEnabled.value && (paperMinutes.value === null || !Number.isInteger(paperMinutes.value) || paperMinutes.value < 1 || paperMinutes.value > 10080))
    return '整卷分鐘數請輸入 1 至 10080 的整數。';
  return '';
});
const timingSummary = computed(() => [
  perQuestionEnabled.value ? `每題 ${perQuestionSeconds.value} 秒` : '',
  paperEnabled.value ? `整卷 ${paperMinutes.value ?? '—'} 分鐘` : '',
].filter(Boolean).join(' · ') || '不限時');
const randomError = computed(() => {
  if (!randomYears.value.length) return '請至少選擇一個年度。';
  if (!randomPapers.value.length) return '請至少選擇一個科目。';
  if (!Number.isInteger(randomCount.value) || randomCount.value < 1 || randomCount.value > poolCount.value)
    return `題數請輸入 1 至 ${poolCount.value} 的整數。`;
  return settingsError.value;
});
function yearLabel(year: number): string {
  return examYearLabel(year, manifest.value.find((item) => item.year === year)?.sitting);
}
const attemptYearLabel = computed(() => randomAttempt.value ? attemptYears.value.map(yearLabel).join('、') : yearLabel(selectedYear.value!));
const availableYearRange = computed(() => manifest.value.length ? `${manifest.value.at(-1)!.year}～${manifest.value[0]!.year}` : '');
const currentYear = computed(() => manifest.value.find((item) => item.year === selectedYear.value));
const categories = computed(() => categoriesForYear(currentYear.value));
const selectedCategoryName = computed(() => categories.value.find((category) => category.id === selectedCategory.value)?.name ?? '全部類科');
const groupedSubjects = computed(() => subjectGroups(currentYear.value, selectedCategory.value));
const availableSubjectCount = computed(() => groupedSubjects.value.reduce((count, group) => count + group.subjects.length, 0));
const questions = computed(() => exam.value?.multiple_choice_questions ?? []);
const totalPoints = computed(() =>
  randomAttempt.value ? 100 : exam.value?.exam_metadata.parts?.find((part) => part.name === '選擇題')?.points
    ?? selectedSubject.value?.points ?? questions.value.length * 2);
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
const score = computed(() => questions.value.length ? Number((correct.value / questions.value.length * totalPoints.value).toFixed(2)) : 0);
const wrong = computed(() => completedCount.value - correct.value);
const wrongQuestions = computed(() => questions.value.filter((item) => (responses.value[item.id] || expired.value[item.id]) && !isCorrect(item, responses.value[item.id])));
const visibleQuestions = computed(() =>
  wrongOnly.value
    ? questions.value.filter((item) => (responses.value[item.id] || expired.value[item.id]) && !isCorrect(item, responses.value[item.id]))
    : questions.value,
);
const currentGroup = computed(() => {
  const items = visibleQuestions.value;
  const current = items[questionIndex.value];
  if (!current) return null;
  let start = questionIndex.value;
  let end = questionIndex.value;
  if (current.context && !sequential.value) {
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

async function refreshRevengePool(signal?: AbortSignal) {
  revengeLoading.value = true;
  revengeError.value = '';
  try {
    revengePool.value = await loadRevengePool(manifest.value, async path => {
      const response = await fetch(siteUrl(path), { signal });
      if (!response.ok) throw new Error('錯題讀取失敗');
      return await response.json() as Exam;
    });
  } catch {
    if (!signal?.aborted) revengeError.value = '錯題暫時無法載入，請重新載入；也請確認瀏覽器允許儲存網站資料。';
  } finally { revengeLoading.value = false; }
}

async function startRevenge() {
  if (loading.value || revengeLoading.value) return;
  const request = beginAttemptLoad();
  try {
    await refreshRevengePool(request.signal);
    if (!isCurrentLoad(request) || revengeError.value || !revengePool.value.length) return;
    const sampled = sampleQuestions(revengePool.value, Math.min(5, revengePool.value.length));
    exam.value = { exam_metadata: { subject: '錯題復仇戰', source_page: '' }, multiple_choice_questions: sampled };
    selectedSubject.value = { id: 'revenge', name: '錯題復仇戰', count: sampled.length, data: '', points: 100 };
    randomAttempt.value = true;
    revengeAttempt.value = true;
    attemptYears.value = [...new Set(sampled.map(question => question.source!.year))].sort((a, b) => b - a);
    startAttempt();
  } finally { finishAttemptLoad(request); }
}

function chooseMode(value: 'menu' | 'past' | 'random' | 'revenge') {
  cancelAttemptLoad();
  mode.value = value;
  error.value = '';
  timingPanelOpen.value = false;
  const url = new URL(location.href);
  url.hash = value === 'revenge' ? 'revenge' : '';
  url.searchParams.delete('subject');
  if (value === 'menu') url.searchParams.delete('mode');
  else url.searchParams.set('mode', value);
  history.replaceState(null, '', url);
}

function syncModeHash() {
  if (!selectedSubject.value && location.hash === '#revenge') chooseMode('revenge');
}

function updateBattleLayout() {
  if (!revengePlaying.value) return;
  const layout = document.querySelector<HTMLElement>('.question-set .battle-question-layout');
  const answers = layout?.querySelector<HTMLElement>('.answer-pane');
  const body = layout?.querySelector<HTMLElement>('.question-body');
  if (!layout || !answers || !body) return;
  battleScrollAll.value = answers.scrollHeight > layout.clientHeight - 120;
  battleReadingOverflow.value = !battleScrollAll.value && body.scrollHeight > body.clientHeight + 1;
}

async function prepareRevengeQuestion(initial = false, continuingDeadline?: number) {
  const version = ++preparationVersion;
  if (timer !== undefined) clearInterval(timer);
  timer = undefined;
  preparingQuestion.value = true;
  preparationError.value = '';
  questionDeadline.value = null;
  await nextTick();
  try {
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll<HTMLImageElement>('.question-set img')].map(image => image.decode()));
    if (version !== preparationVersion || !revengePlaying.value) return;
    await focusQuestion();
    // Two frames let the actual question and options paint before charging the first second.
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    if (version !== preparationVersion || !revengePlaying.value) return;
    updateBattleLayout();
    preparingQuestion.value = false;
    clockNow.value = Date.now();
    if (initial) attemptStartedAt = clockNow.value;
    questionDeadline.value = continuingDeadline ?? clockNow.value + 60_000;
    timer = setInterval(syncClock, 250);
    if (continuingDeadline !== undefined) syncClock();
  } catch {
    if (version === preparationVersion) preparationError.value = '題目附圖暫時無法載入，尚未開始計時。請重新載入題目。';
  }
}

function retryPreparedQuestion() {
  document.querySelectorAll<HTMLImageElement>('.question-set img').forEach(image => {
    const url = new URL(image.src);
    url.searchParams.set('retry', String(Date.now()));
    image.src = url.href;
  });
  void prepareRevengeQuestion();
}

function questionSource(question: Question) {
  return question.source ?? {
    year: selectedYear.value!, ...(currentYear.value?.sitting ? { sitting: currentYear.value.sitting } : {}), subjectId: selectedSubject.value!.id,
    subjectName: selectedSubject.value!.name, questionId: question.id,
  };
}

function trackOutcome(question: Question, correct: boolean) {
  if (!recordOutcome(questionSource(question), correct))
    mistakeSaveError.value = '錯題狀態無法儲存，請確認瀏覽器允許儲存網站資料。';
}

function focusPracticeSettings() {
  chooseMode('past');
  void nextTick().then(() => subjectTitle.value?.focus());
}

async function loadManifest() {
  loading.value = true;
  let linkedSubject: Subject | undefined;
  try {
    const response = await fetch(siteUrl('/assets/exams/index.json'));
    if (!response.ok) throw new Error('無法讀取題庫目錄');
    const data = (await response.json()) as { years: Year[] };
    if (!Array.isArray(data.years) || !data.years.length) throw new Error('題庫目錄沒有可用的年度');
    manifest.value = [...data.years].sort((a, b) => b.year - a.year);
    const params = new URLSearchParams(location.search);
    const linkedMode = params.get('mode');
    if (linkedMode === 'past' || linkedMode === 'random' || linkedMode === 'revenge') mode.value = linkedMode;
    const linkedYear = manifest.value.find((item) => item.year === Number(params.get('year')));
    selectedYear.value = linkedYear?.year ?? manifest.value[0].year;
    syncModeHash();
    randomYears.value = [selectedYear.value];
    randomSubjects.value = currentYear.value?.subjects.map((subject) => subject.id) ?? [];
    refreshProgress();
    void refreshRevengePool();
    linkedSubject = currentYear.value?.subjects.find((item) => item.id === params.get('subject'));
  } catch {
    error.value = '題庫載入失敗，請重新整理頁面再試一次。';
  } finally {
    loading.value = false;
  }
  if (linkedSubject && mode.value !== 'revenge') await chooseSubject(linkedSubject);
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

function closeCategoryPicker() {
  if (!categoryPicker.value) return;
  categoryPicker.value.open = false;
  categoryPicker.value.querySelector('summary')?.focus();
}

function chooseCategory(category: string) {
  selectedCategory.value = category;
  closeCategoryPicker();
}

function chooseYear(year: number) {
  if (loading.value || (inAttempt.value && timedAttempt.value)) return;
  stopTimer();
  if (categoryPicker.value) categoryPicker.value.open = false;
  selectedYear.value = year;
  selectedCategory.value = 'all';
  selectedSubject.value = null;
  exam.value = null;
  wrongOnly.value = false;
  resultView.value = false;
  error.value = '';
  refreshProgress();
}

async function chooseSubject(subject: Subject) {
  if (loading.value) return;
  if (!paperMinutesEdited.value) paperMinutes.value = subject.count;
  if (settingsError.value) return;
  const request = beginAttemptLoad();
  loadingSubjectId.value = subject.id;
  error.value = '';
  wrongOnly.value = false;
  try {
    const response = await fetch(siteUrl(subject.data), { signal: request.signal });
    if (!response.ok) throw new Error('無法讀取科目題庫');
    const data = (await response.json()) as Exam;
    if (!isCurrentLoad(request) || settingsError.value) return;
    if (!Array.isArray(data.multiple_choice_questions) || !data.multiple_choice_questions.length)
      throw new Error('科目題庫沒有題目');
    exam.value = data;
    selectedSubject.value = subject;
    randomAttempt.value = false;
    revengeAttempt.value = false;
    attemptYears.value = [selectedYear.value!];
    startAttempt();
    await nextTick();
    practiceTitle.value?.focus();
  } catch {
    if (isCurrentLoad(request)) error.value = '這科的題目暫時無法載入，請再試一次。';
  } finally {
    finishAttemptLoad(request);
  }
}

function stopTimer() {
  preparationVersion++;
  if (timer !== undefined) clearInterval(timer);
  timer = undefined;
}

function startAttempt() {
  stopTimer();
  activeSeconds.value = revengeAttempt.value ? 60 : perQuestionEnabled.value ? perQuestionSeconds.value : 0;
  activeMinutes.value = !revengeAttempt.value && paperEnabled.value ? (paperMinutes.value ?? questions.value.length) : 0;
  responses.value = isolatedAttempt.value ? {} : readResponses(selectedYear.value!, selectedSubject.value!.id);
  drafts.value = {};
  expired.value = {};
  wrongOnly.value = false;
  notice.value = '';
  exportError.value = '';
  historySaveError.value = '';
  mistakeSaveError.value = '';
  preparingQuestion.value = false;
  preparationError.value = '';
  copyNotice.value = null;
  const first = questions.value.findIndex((question) => !responses.value[question.id]);
  finished.value = first < 0;
  resultView.value = finished.value;
  questionIndex.value = first < 0 ? 0 : first;
  clockNow.value = Date.now();
  attemptStartedAt = clockNow.value;
  paperDeadline.value = activeMinutes.value ? clockNow.value + activeMinutes.value * 60_000 : null;
  questionDeadline.value = activeSeconds.value ? clockNow.value + activeSeconds.value * 1000 : null;
  if (!finished.value && revengeAttempt.value) {
    questionDeadline.value = null;
    void prepareRevengeQuestion(true);
    return;
  }
  if (!finished.value && timedAttempt.value) timer = setInterval(syncClock, 250);
}

async function startRandomExam() {
  if (randomError.value || loading.value) return;
  const request = beginAttemptLoad();
  error.value = '';
  try {
    const papers = [...randomPapers.value];
    const pool = (await Promise.all(papers.map(async ({ year, sitting, subject }) => {
      const response = await fetch(siteUrl(subject.data), { signal: request.signal });
      if (!response.ok) throw new Error('讀取失敗');
      const data = await response.json() as Exam;
      if (!Array.isArray(data.multiple_choice_questions) || !data.multiple_choice_questions.length)
        throw new Error('題庫格式錯誤');
      return data.multiple_choice_questions.map((question) => ({ ...question,
        source: { year, ...(sitting ? { sitting } : {}), subjectId: subject.id, subjectName: subject.name, questionId: question.id },
      }));
    }))).flat();
    if (!isCurrentLoad(request) || settingsError.value) return;
    const sampled = sampleQuestions(pool, randomCount.value);
    exam.value = { exam_metadata: { subject: '隨機抽題測驗', source_page: '' }, multiple_choice_questions: sampled };
    selectedSubject.value = { id: 'random', name: '隨機抽題測驗', count: sampled.length, data: '', points: 100 };
    randomAttempt.value = true;
    revengeAttempt.value = false;
    attemptYears.value = [...new Set(papers.map((paper) => paper.year))];
    startAttempt();
    await nextTick();
    practiceTitle.value?.focus();
  } catch (cause) {
    if (isCurrentLoad(request)) error.value = cause instanceof Error && cause.message.startsWith('請輸入') ? cause.message : '抽題失敗，請確認題數或稍後再試；未建立考卷。';
  } finally {
    finishAttemptLoad(request);
  }
}

async function backToSubjects() {
  if (inAttempt.value && isolatedAttempt.value && !window.confirm('返回設定會結束這次測驗，未完成的成績不會儲存。確定返回？')) return;
  stopTimer();
  selectedSubject.value = null;
  exam.value = null;
  chooseMode(revengeAttempt.value ? 'revenge' : randomAttempt.value ? 'random' : 'past');
  void refreshRevengePool();
  await nextTick();
  (subjectTitle.value ?? document.getElementById('settings-title'))?.focus();
}

async function focusQuestion() {
  await nextTick();
  if (revengeAttempt.value) {
    document.querySelector<HTMLElement>('.question-set .question-card')?.focus({ preventScroll: true });
    document.querySelectorAll<HTMLElement>('.question-body, .battle-question-layout, .answer-pane').forEach(element => { element.scrollTop = 0; });
    window.scrollTo({ top: 0, behavior: 'instant' });
    battleObserver?.disconnect();
    battleObserver = new ResizeObserver(updateBattleLayout);
    document.querySelectorAll('.question-set .question-card, .question-set .choices').forEach(element => battleObserver?.observe(element));
    updateBattleLayout();
    return;
  }
  document.getElementById(`exam-question-${visibleQuestions.value[questionIndex.value]?.id}`)?.focus();
}

async function goToQuestion(index: number) {
  if (sequential.value || index < 0 || index >= visibleQuestions.value.length) return;
  resultView.value = false;
  questionIndex.value = index;
  await focusQuestion();
}

function isSettled(question: Question) {
  return Boolean(responses.value[question.id] || expired.value[question.id]);
}

function finishAttempt(reason = '', pendingReason: 'paper' | 'submitted' = 'submitted') {
  if (finished.value || !selectedSubject.value) return;
  for (const question of questions.value) {
    if (!isSettled(question)) {
      expired.value[question.id] = pendingReason;
      trackOutcome(question, false);
    }
  }
  finished.value = true;
  stopTimer();
  questionDeadline.value = null;
  notice.value = reason;
  wrongOnly.value = false;
  historySaveError.value = saveHistoryEntry({
    year: selectedYear.value!,
    subjectId: revengeAttempt.value ? 'revenge' : randomAttempt.value ? 'random' : selectedSubject.value.id,
    subjectName: selectedSubject.value.name,
    years: randomAttempt.value ? attemptYears.value : undefined,
    mode: revengeAttempt.value ? 'revenge' : randomAttempt.value ? 'random' : timedAttempt.value ? 'timed' : undefined,
    correct: correct.value, total: questions.value.length, score: score.value, maxScore: totalPoints.value,
    completedAt: new Date().toISOString(),
    elapsedSeconds: Math.max(0, Math.round((Date.now() - attemptStartedAt) / 1000)),
    outcomes: questions.value.map(question => ({
      ...questionSource(question), correct: isCorrect(question, responses.value[question.id]),
      timedOut: expired.value[question.id] === 'question' || expired.value[question.id] === 'paper',
    })),
  }) ? '' : '這次成績無法儲存至瀏覽器，請確認瀏覽器儲存空間設定。';
  resultView.value = true;
  void nextTick().then(() => resultTitle.value?.focus());
}

function syncClock() {
  clockNow.value = Date.now();
  if (!inAttempt.value || !timedAttempt.value || preparingQuestion.value) return;
  if (paperDeadline.value !== null && clockNow.value >= paperDeadline.value) {
    finishAttempt('整卷時間到，已自動交卷。未提交的題目以 0 分計算。', 'paper');
    return;
  }
  if (revengeAttempt.value && questionDeadline.value !== null && clockNow.value >= questionDeadline.value) {
    // Already-running deadlines keep their wall-clock budget across background tabs.
    let nextDeadline = questionDeadline.value;
    while (clockNow.value >= nextDeadline && !finished.value) {
      const question = questions.value[questionIndex.value];
      expired.value[question.id] = 'question';
      trackOutcome(question, false);
      notice.value = `第 ${question.id} 題時間到，留待下次再戰。`;
      if (completedCount.value === questions.value.length) finishAttempt(notice.value);
      else { questionIndex.value++; nextDeadline += 60_000; }
    }
    if (!finished.value) void prepareRevengeQuestion(false, nextDeadline);
    return;
  }
  let advanced = false;
  while (questionDeadline.value !== null && clockNow.value >= questionDeadline.value && !finished.value) {
    const question = questions.value[questionIndex.value];
    expired.value[question.id] = 'question';
    trackOutcome(question, false);
    notice.value = `第 ${question.id} 題時間到，以 0 分計算。`;
    advanced = true;
    if (completedCount.value === questions.value.length) { finishAttempt(notice.value); break; }
    questionIndex.value++;
    questionDeadline.value += activeSeconds.value * 1000;
  }
  if (advanced && !finished.value) void focusQuestion();
}

function selectChoice(question: Question, choice: Choice) {
  syncClock();
  if (preparingQuestion.value) return;
  if (finished.value || isSettled(question) || (sequential.value && questions.value[questionIndex.value]?.id !== question.id)) return;
  drafts.value = { ...drafts.value, [question.id]: choice };
}

function submitAnswer(question: Question) {
  syncClock();
  if (preparingQuestion.value) return;
  const choice = drafts.value[question.id];
  if (finished.value || !choice || !selectedSubject.value || isSettled(question) || (sequential.value && questions.value[questionIndex.value]?.id !== question.id)) return;
  responses.value = { ...responses.value, [question.id]: choice };
  trackOutcome(question, isCorrect(question, choice));
  if (!isolatedAttempt.value) {
    try { localStorage.setItem(responseStorageKey(selectedYear.value!, selectedSubject.value.id), JSON.stringify(responses.value)); }
    catch { /* 作答可在瀏覽器停用儲存時繼續。 */ }
    refreshProgress();
  }
  if (completedCount.value === questions.value.length) { finishAttempt(); return; }
  if (sequential.value) {
    if (revengeAttempt.value) notice.value = isCorrect(question, choice) ? `擊破！第 ${question.id} 題復仇成功。` : `第 ${question.id} 題還沒拿下，結算後再一起複習。`;
    questionIndex.value++;
    if (revengeAttempt.value) { void prepareRevengeQuestion(); return; }
    questionDeadline.value = Date.now() + activeSeconds.value * 1000;
    void focusQuestion();
  }
}

function handIn() {
  syncClock();
  if (finished.value) return;
  if (completedCount.value < questions.value.length && !window.confirm('還有未提交的題目，交卷後將以 0 分計算。確定交卷？')) return;
  finishAttempt('已交卷，未提交的題目以 0 分計算。');
}

function unansweredLabel(question: Question): string {
  const reason = expired.value[question.id];
  return reason === 'question' ? '每題逾時（0 分）' : reason === 'paper' ? '整卷逾時未提交（0 分）' : '未提交（0 分）';
}

async function showResults() {
  resultView.value = true;
  await nextTick();
  resultTitle.value?.focus();
}

function focusWrongList() {
  document.querySelector<HTMLElement>('.wrong-list > h3')?.focus();
}

async function exportWrongBook() {
  if (!selectedYear.value || !selectedSubject.value || !wrongQuestions.value.length || exporting.value) return;
  exporting.value = true;
  exportError.value = '';
  try {
    const { downloadWrongBook } = await import('./wrong-book-pdf');
    await downloadWrongBook(selectedYear.value, selectedSubject.value.name, wrongQuestions.value, responses.value, correct.value, questions.value.length, totalPoints.value, randomAttempt.value ? `${attemptYearLabel.value} ${revengeAttempt.value ? '錯題復仇戰' : '隨機測驗'}` : `${yearLabel(selectedYear.value)}教師資格考試`,
      Object.fromEntries(wrongQuestions.value.filter((question) => expired.value[question.id]).map((question) => [question.id, unansweredLabel(question)])));
  } catch {
    exportError.value = 'PDF 產生失敗，請再試一次。';
  } finally {
    exporting.value = false;
  }
}

function showWrongOnly(enabled: boolean) {
  if (sequential.value) return;
  wrongOnly.value = enabled;
  void goToQuestion(0);
}

async function copyAiPrompt(question: Question) {
  const ownAnswer = expired.value[question.id] ? unansweredLabel(question) : responses.value[question.id] ?? drafts.value[question.id];
  const lines = [
    '請協助我理解以下教師資格考試題目。請先說明參考答案為何正確，再分析我的作答，並簡要說明其他選項。若題目資訊不足，請指出缺少什麼，不要猜測。',
    '',
    sourceLabel(question) || `${yearLabel(selectedYear.value!)}｜${selectedSubject.value?.name ?? ''}｜第 ${question.id} 題`,
    ...(question.context ? [`閱讀資料：\n${question.context}`, ''] : []),
    `題目：${question.question}`,
    ...(question.image_text ? [`附圖文字：${question.image_text}`] : []),
    ...(question.image ? [`原題附圖：${new URL(siteUrl(question.image), location.href).href}`] : []),
    ...contentImages(question.body_blocks).map((figure) =>
      `圖表：${new URL(siteUrl(figure.src), location.href).href}`),
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
  if (revengeAttempt.value && finished.value) { void backToSubjects(); return; }
  if (completedCount.value && !window.confirm('重新作答會清除目前這一輪的進度；已完成的歷史成績會保留。確定繼續？')) return;
  if (!isolatedAttempt.value) {
    try { localStorage.removeItem(responseStorageKey(selectedYear.value!, selectedSubject.value.id)); }
    catch { /* 仍可重新作答。 */ }
  }
  startAttempt();
  refreshProgress();
}

function beforeUnload(event: BeforeUnloadEvent) {
  if (inAttempt.value && isolatedAttempt.value) event.preventDefault();
}
onMounted(() => {
  document.body.classList.add('exam-page-shell');
  void loadManifest();
  document.addEventListener('visibilitychange', syncClock);
  window.addEventListener('focus', syncClock);
  window.addEventListener('beforeunload', beforeUnload);
  window.addEventListener('hashchange', syncModeHash);
});
onBeforeUnmount(() => {
  cancelAttemptLoad();
  stopTimer();
  document.body.classList.remove('exam-revenge-scene');
  document.body.classList.remove('exam-revenge-playing', 'exam-practicing', 'exam-page-shell');
  battleObserver?.disconnect();
  document.removeEventListener('visibilitychange', syncClock);
  window.removeEventListener('focus', syncClock);
  window.removeEventListener('beforeunload', beforeUnload);
  window.removeEventListener('hashchange', syncModeHash);
});
</script>

<template>
  <section class="exam-page" :class="{ 'revenge-active': revengeSceneActive, 'revenge-playing': revengePlaying }" :aria-labelledby="selectedSubject ? 'practice-title' : 'exam-title'">
    <div v-if="revengeSceneActive" class="revenge-backdrop" :style="{ backgroundImage: `url('${siteUrl('/assets/decor/exam-revenge-battle.webp')}')` }" aria-hidden="true" />
    <header v-if="!selectedSubject" class="page-heading">
      <div>
        <button v-if="mode !== 'menu'" type="button" class="back-link mode-back" @click="chooseMode('menu')">← 返回練習入口</button>
        <h1 id="exam-title">{{ mode === 'menu' ? '教師資格考試題庫' : mode === 'past' ? '歷屆試題' : mode === 'random' ? '隨機抽題' : '錯題復仇戰' }}</h1>
      </div>
      <nav class="page-links" aria-label="測驗頁面連結">
        <button v-if="mode === 'past' || mode === 'random'" type="button" class="timing-trigger" :aria-expanded="timingPanelOpen" aria-controls="timing-settings" @click="timingPanelOpen = !timingPanelOpen"><SiteIcon name="clock" :size="19" /><span>限時設定</span><small>{{ timingSummary }}</small></button>
        <span v-if="mode === 'revenge'" class="fixed-timing"><SiteIcon name="clock" :size="18" />每題 60 秒</span>
        <a :href="siteUrl('/exam/history/')">個人練習紀錄 <SiteIcon name="arrow" :size="16" /></a>
      </nav>
      <p class="heading-description">{{ mode === 'menu' ? `${availableYearRange} 年全類科考古題，選擇你的練習方式。` : mode === 'past' ? '選擇年度、類科與科目。' : mode === 'random' ? '自選範圍與題數。' : '從自己的錯題出發，一次拿下 5 題。' }}</p>
    </header>

    <p v-if="error" class="load-message" role="alert">{{ error }}</p>
    <p v-if="loading && !manifest.length" class="load-message" role="status">題庫載入中…</p>

    <template v-if="manifest.length">
      <ExamEntryMenu v-if="!selectedSubject && mode === 'menu'" :mistakes="revengePool.length" @choose="chooseMode" />
      <RevengeGate v-if="!selectedSubject && mode === 'revenge'" :count="revengePool.length" :loading="revengeLoading" :error="revengeError" @start="startRevenge" @retry="refreshRevengePool" @practice="focusPracticeSettings" />
      <section v-if="!selectedSubject && (mode === 'past' || mode === 'random')" v-show="timingPanelOpen" id="timing-settings" class="shared-timing-panel" aria-labelledby="timing-title">
        <h2 id="timing-title">限時設定</h2>
        <div class="timing-settings">
          <div class="timing-option">
            <label class="check-label"><input v-model="perQuestionEnabled" type="checkbox" />每題限時</label>
            <label class="number-label"><input v-model.number="perQuestionSeconds" :disabled="!perQuestionEnabled" type="number" min="1" max="3600" step="1" aria-label="每題限時秒數" /> 秒</label>
          </div>
          <div class="timing-option">
            <label class="check-label"><input v-model="paperEnabled" type="checkbox" />整卷限時</label>
            <label class="number-label"><input :value="paperMinutes ?? ''" :disabled="!paperEnabled" type="number" min="1" max="10080" step="1" aria-label="整卷限時分鐘數" @input="updatePaperMinutes" /> 分鐘</label>
          </div>
        </div>
      </section>
      <p v-if="!selectedSubject && (mode === 'past' || mode === 'random') && settingsError" class="export-error" role="alert">{{ settingsError }}</p>
      <form v-if="!selectedSubject && mode === 'random'" :inert="loading" class="exam-settings random-mode" aria-labelledby="settings-title" @submit.prevent="startRandomExam()">
        <h2 id="settings-title" class="settings-title" tabindex="-1">抽題設定</h2>
        <div v-if="mode === 'random'" class="random-footer">
          <div class="random-start">
            <label class="number-label">抽取題數 <input v-model.number="randomCount" type="number" min="1" :max="poolCount" step="1" required aria-describedby="pool-description" /></label>
            <button type="submit" class="start-button" :disabled="loading || Boolean(randomError)">{{ loading ? '正在抽題…' : '開始隨機測驗' }}</button>
          </div>
          <p id="pool-description" class="settings-note">可抽 {{ poolCount }} 題 · 不重複抽題 · 滿分 100 分，每題等權計分。每題標示原始年度、科目與題號；抽題不改動歷屆練習進度。</p>
          <p v-if="randomError && !settingsError" class="export-error" role="status">{{ randomError }}</p>
        </div>
        <div v-if="mode === 'random'" class="random-settings">
          <fieldset class="source-fieldset">
            <legend>選擇年度（可複選）</legend>
            <div class="filter-checks"><label v-for="year in manifest" :key="year.year" class="check-label"><input v-model="randomYears" type="checkbox" :value="year.year" />{{ yearLabel(year.year) }}</label></div>
          </fieldset>
          <fieldset class="subjects-fieldset">
            <legend>選擇科目（可複選）</legend>
            <div class="subject-selection-actions">
              <button type="button" @click="randomSubjects = randomSubjectOptions.map((subject) => subject.id)">全選科目</button>
              <button type="button" @click="randomSubjects = []">清除科目</button>
            </div>
            <div class="filter-checks subject-checks" tabindex="0" role="group" aria-label="科目清單，可捲動"><label v-for="subject in randomSubjectOptions" :key="subject.id" class="check-label"><input v-model="randomSubjects" type="checkbox" :value="subject.id" /><span>{{ subject.name }}<small v-for="note in subject.notes" :key="note">{{ note }}</small></span></label></div>
            <p v-if="randomSubjectOptions.length" class="settings-note">科目清單可上下捲動，已選 {{ randomSubjectOptions.filter((subject) => randomSubjects.includes(subject.id)).length }} 科。</p>
            <p v-if="!randomSubjectOptions.length">選擇年度後會顯示可用科目。</p>
          </fieldset>
        </div>
      </form>
      <template v-if="selectedSubject || mode === 'past'">
      <details v-if="!selectedSubject" ref="yearPicker" class="mobile-year-picker" @keydown.esc.prevent="closeYearPicker">
        <summary>
          <span>考試年度</span>
          <strong>{{ yearLabel(selectedYear!) }}</strong>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </summary>
        <div class="mobile-year-options" role="group" aria-label="選擇考試年度">
          <button v-for="item in manifest" :key="item.year" type="button" :aria-pressed="selectedYear === item.year" @click="chooseMobileYear(item.year)">
            <span>{{ yearLabel(item.year) }}</span>
            <span v-if="selectedYear === item.year" class="current-year-label">目前年度</span>
          </button>
        </div>
      </details>
      <div v-if="!selectedSubject" class="year-picker" role="group" aria-label="選擇考試年度">
        <button
          v-for="item in manifest"
          :key="item.year"
          type="button"
          :class="{ active: selectedYear === item.year }"
          :aria-pressed="selectedYear === item.year"
          @click="chooseYear(item.year)"
        >
          {{ yearLabel(item.year) }}
        </button>
      </div>

      <div v-if="!selectedSubject || !exam" class="subject-list">
        <details ref="categoryPicker" class="category-picker" @keydown.esc.prevent="closeCategoryPicker">
          <summary>
            <span>應試類科</span>
            <strong>{{ selectedCategoryName }}</strong>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </summary>
          <div class="category-options" role="group" aria-label="選擇應試類科">
            <button type="button" :aria-pressed="selectedCategory === 'all'" @click="chooseCategory('all')">全部類科</button>
            <button v-for="category in categories" :key="category.id" type="button" :aria-pressed="selectedCategory === category.id" @click="chooseCategory(category.id)">{{ category.name }}</button>
          </div>
        </details>
        <div class="subject-heading">
          <h2 ref="subjectTitle" tabindex="-1">{{ yearLabel(selectedYear!) }}試題</h2>
          <p>共 {{ availableSubjectCount }} 份試卷。共用科目只收錄一份，作答進度也會共用。</p>
        </div>
        <section v-for="group in groupedSubjects" :key="group.id" class="subject-group" :aria-labelledby="`subject-group-${group.id}`">
          <h3 :id="`subject-group-${group.id}`">{{ group.name }}</h3>
          <button
            v-for="subject in group.subjects"
            :key="subject.id"
            type="button"
            class="subject-row"
            :class="{ 'is-loading': loadingSubjectId === subject.id }"
            :aria-busy="loadingSubjectId === subject.id"
            :disabled="loading || Boolean(settingsError)"
            @click="chooseSubject(subject)"
          >
            <span class="subject-label">
              <span class="subject-name">{{ subject.name }}</span>
              <span v-if="currentYear" class="subject-category">{{ subjectCategoryLabel(subject, currentYear) }}</span>
            </span>
            <span class="subject-meta">
              <span class="progress-badge" :class="{ 'in-progress': progressFor(subject) > 0 && progressFor(subject) < subject.count, completed: progressFor(subject) >= subject.count }">{{ progressLabel(subject) }}</span>
              <span v-if="loadingSubjectId === subject.id" role="status">載入中…</span>
              <template v-else><span>{{ subject.count }} 題</span><SiteIcon name="arrow" :size="17" /></template>
            </span>
          </button>
        </section>
        <p class="privacy-note">作答紀錄只會儲存在目前瀏覽器，不需登入。</p>
      </div>

      <div v-else class="practice-layout" :class="{ 'showing-results': resultView, 'revenge-battle': revengeAttempt }">
        <div class="practice-main">
          <div class="practice-heading">
            <div>
              <button type="button" class="back-link" @click="backToSubjects">
                ← {{ revengePlaying ? '離開' : '返回測驗設定' }}
              </button>
              <h1 id="practice-title" ref="practiceTitle" tabindex="-1">{{ selectedSubject.name }}</h1>
              <p>{{ attemptYearLabel }} · 已完成 {{ completedCount }} / {{ questions.length }} 題 · 答對 {{ correct }} 題</p>
            </div>
            <a v-if="!randomAttempt" class="official-link" :href="exam.exam_metadata.source_page" target="_blank" rel="noopener">官方歷屆試題 <SiteIcon name="arrow" :size="16" /></a>
            <details v-if="revengePlaying" class="battle-menu">
              <summary aria-label="本輪操作"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg></summary>
              <div><p v-if="questions[questionIndex]?.source" class="battle-menu-source">{{ sourceLabel(questions[questionIndex]) }}</p><button type="button" :disabled="preparingQuestion" @click="handIn">提前交卷</button><button type="button" :disabled="preparingQuestion" @click="resetSubject">重新挑戰本輪</button></div>
            </details>
          </div>

          <div v-if="revengePlaying" class="battle-toolbar">
            <div class="battle-status"><strong>{{ preparingQuestion ? '準備題目…' : `第 ${questionIndex + 1} / ${questions.length} 題` }}</strong><span v-if="notice" role="status">{{ notice }}</span><span v-else>答對 {{ correct }} 題</span></div>
            <div class="timer-value" :class="{ urgent: revengeUrgent }" role="timer" aria-live="off"><span>剩餘</span><strong>{{ preparingQuestion ? '—' : formatCountdown(questionRemaining) }}</strong></div>
            <button v-if="currentGroup" type="button" class="copy-ai-button" :aria-label="`複製第 ${currentGroup.questions[0].id} 題問 AI 提示詞`" title="複製問 AI 提示詞" @click="copyAiPrompt(currentGroup.questions[0])"><SiteIcon name="copy" :size="18" /></button>
            <CountdownTrack :deadline="questionDeadline" :duration-seconds="activeSeconds" :urgent="revengeUrgent" :preparing="preparingQuestion" />
          </div>
          <div v-if="timedAttempt && !finished && !revengeAttempt" class="timer-bar" aria-label="測驗剩餘時間">
            <div v-if="activeSeconds" class="timer-value" :class="{ urgent: questionRemaining <= Math.min(10, activeSeconds) }" role="timer" aria-live="off"><span>本題剩餘</span><strong>{{ formatCountdown(questionRemaining) }}</strong></div>
            <div v-if="activeMinutes" class="timer-value" :class="{ urgent: paperRemaining <= 60 }" role="timer" aria-live="off"><span>整卷剩餘</span><strong>{{ formatCountdown(paperRemaining) }}</strong></div>
            <p v-if="sequential">逐題作答 · 無法跳題</p>
          </div>
          <p v-if="notice && !revengePlaying" class="exam-notice" role="status">{{ notice }}</p>
          <p v-if="mistakeSaveError" class="export-error" role="alert">{{ mistakeSaveError }}</p>
          <p v-if="preparationError" class="preparation-error" role="alert">{{ preparationError }}<button type="button" @click="retryPreparedQuestion">重新載入題目</button></p>
          <p v-if="activeSeconds && !finished && !revengeAttempt" class="timer-warning" :class="{ 'warning-visible': questionRemaining <= Math.min(10, activeSeconds) }" role="status">本題即將到時，請記得送出答案。</p>

          <section v-if="resultView" class="result-section" aria-labelledby="result-title">
            <div class="result-summary">
              <div>
                <h3 id="result-title" ref="resultTitle" tabindex="-1">{{ revengeAttempt ? (correct === questions.length ? '復仇成功，全員擊破！' : `拿下 ${correct} 題，下次再戰！`) : '測驗結果' }}</h3>
                <p>答對 {{ correct }} 題 · 答錯 {{ wrong }} 題 · 共 {{ questions.length }} 題</p>
                <p v-if="revengeAttempt" class="revenge-result-note">{{ correct === questions.length ? '這一輪的錯題都已解除標記，做得很棒！' : '答對的題目已解除錯題標記，剩下的再複習一次。' }}</p>
              </div>
              <p class="result-score"><strong>{{ score }}</strong><span>／ {{ totalPoints }} 分</span></p>
            </div>
            <div class="result-actions">
              <button v-if="wrong" type="button" class="download-button" @click="focusWrongList">查看錯題（{{ wrong }}）</button>
              <button v-if="wrong" type="button" class="review-button" :disabled="exporting" @click="exportWrongBook">
                {{ exporting ? '正在產生 PDF…' : '下載錯題本（PDF）' }}
              </button>
              <button type="button" class="review-button" @click="goToQuestion(0)">查看全部題目</button>
              <button type="button" class="review-button" @click="resetSubject">{{ revengeAttempt ? '返回復仇戰入口' : '重新作答本卷' }}</button>
              <a class="review-button history-result-link" :href="siteUrl('/exam/history/')">查看個人練習紀錄</a>
            </div>
            <p v-if="exportError" class="export-error" role="alert">{{ exportError }}</p>
            <p v-if="historySaveError" class="export-error" role="alert">{{ historySaveError }}</p>
            <div v-if="wrong" class="wrong-list">
              <h3 tabindex="-1">錯題總覽（{{ wrong }} 題）</h3>
              <article v-for="question in wrongQuestions" :key="question.id" class="question-card wrong-card">
                <div class="question-topline">
                  <span class="wrong-number">第 {{ question.id }} 題</span>
                  <button type="button" class="copy-ai-button" :aria-label="`複製第 ${question.id} 題問 AI 提示詞`" title="複製問 AI 提示詞" @click="copyAiPrompt(question)"><SiteIcon name="copy" :size="18" /></button>
                </div>
                <p v-if="question.source" class="question-source">來源：{{ sourceLabel(question) }}</p>
                <p v-if="copyNotice?.id === question.id" class="copy-notice" role="status">{{ copyNotice.message }}</p>
                <details v-if="question.context" class="passage" open>
                  <summary>閱讀文章</summary>
                  <p>{{ question.context }}</p>
                </details>
                <h4 :class="{ 'math-question-label': question.body_blocks }">{{ question.body_blocks ? `第 ${question.id} 題題目` : question.question }}</h4>
                <MathQuestionContent v-if="question.body_blocks" :blocks="question.body_blocks" />
                <figure v-if="question.image" class="question-image">
                  <a :href="siteUrl(question.image)" target="_blank" rel="noopener" aria-label="放大題目附圖">
                    <img :src="siteUrl(question.image)" :alt="question.image_alt || '題目附圖'" :width="question.image_width" :height="question.image_height" />
                  </a>
                  <figcaption>題目附圖，可點擊放大</figcaption>
                </figure>
                <details v-if="question.image_text" class="table-text" open>
                  <summary>附圖文字版</summary>
                  <p>{{ question.image_text }}</p>
                </details>
                <ul class="result-options" :class="{ 'math-options': question.option_columns === 2 }">
                  <li v-for="choice in (['A', 'B', 'C', 'D'] as const)" :key="choice" :class="{ 'is-correct': acceptedAnswers(question).includes(choice), 'is-wrong': choice === responses[question.id] && !isCorrect(question, choice) }">
                    <strong>{{ choice }}</strong><MathText v-if="question.body_blocks" :text="question.options[choice]" /><span v-else>{{ question.options[choice] }}</span>
                  </li>
                </ul>
                <p class="answer-feedback">你的答案：{{ responses[question.id] ?? unansweredLabel(question) }}　參考答案：{{ answerLabel(question) }}</p>
              </article>
            </div>
            <p v-else class="all-correct">全部答對，沒有需要複習的錯題。</p>
          </section>

          <button v-if="!resultView && finished" type="button" class="back-link result-return" @click="showResults">← 返回測驗結果</button>

          <div v-if="!resultView && !sequential && wrong > 0" class="view-switch" aria-label="題目範圍">
            <button type="button" :aria-pressed="!wrongOnly" :class="{ active: !wrongOnly }" @click="showWrongOnly(false)">全部題目</button>
            <button type="button" :aria-pressed="wrongOnly" :class="{ active: wrongOnly }" @click="showWrongOnly(true)">只看錯題（{{ wrong }}）</button>
          </div>

          <section v-if="!resultView && currentGroup" class="question-set" aria-label="本頁題目">
            <div v-if="currentGroup.questions.length > 1" class="set-heading">
              <h3>第 {{ currentGroup.questions[0].id }}～{{ currentGroup.questions[currentGroup.questions.length - 1].id }} 題</h3>
              <span>共用閱讀文章 · {{ currentGroup.questions.length }} 題</span>
            </div>
            <details v-if="currentGroup.context && !revengeAttempt" :key="currentGroup.start" class="passage" open>
              <summary>閱讀文章</summary>
              <p>{{ currentGroup.context }}</p>
            </details>
            <article v-for="(question, offset) in currentGroup.questions" :key="question.id" class="question-card" :tabindex="revengeAttempt ? -1 : undefined" :class="{ 'revenge-danger': revengeUrgent, 'battle-scroll-all': battleScrollAll, 'is-preparing': preparingQuestion }" :style="revengeUrgent ? { '--revenge-pulse': revengePulse } : undefined" :aria-busy="revengePlaying && preparingQuestion">
              <div v-if="!revengePlaying" class="question-topline">
                <span>第 {{ question.id }} 題</span>
                <span class="question-tools">
                  <span v-if="!revengePlaying">{{ currentGroup.start + offset + 1 }} / {{ visibleQuestions.length }}</span>
                  <button type="button" class="copy-ai-button" :aria-label="`複製第 ${question.id} 題問 AI 提示詞`" title="複製問 AI 提示詞" @click="copyAiPrompt(question)"><SiteIcon name="copy" :size="18" /></button>
                </span>
              </div>
              <p v-if="revengePlaying && (battleReadingOverflow || battleScrollAll)" class="battle-scroll-hint">{{ battleScrollAll ? '題目與選項可上下捲動' : '題目區可上下捲動' }}</p>
              <p v-if="copyNotice?.id === question.id" class="copy-notice" role="status">{{ copyNotice.message }}</p>
              <div class="battle-question-layout" :tabindex="revengePlaying && battleScrollAll ? 0 : undefined" :role="revengePlaying && battleScrollAll ? 'region' : undefined" :aria-label="revengePlaying && battleScrollAll ? '題目與選項，可上下捲動' : undefined">
              <div class="question-body" :tabindex="revengePlaying && battleReadingOverflow ? 0 : undefined" :role="revengePlaying && battleReadingOverflow ? 'region' : undefined" :aria-label="revengePlaying && battleReadingOverflow ? '題目與閱讀內容，可上下捲動' : undefined">
              <p v-if="question.source && !revengePlaying" class="question-source">來源：{{ sourceLabel(question) }}</p>
              <details v-if="revengeAttempt && question.context" class="passage" open>
                <summary>閱讀文章</summary>
                <p>{{ question.context }}</p>
              </details>
              <h3 :id="`exam-question-${question.id}`" tabindex="-1" :class="{ 'math-question-label': question.body_blocks }">{{ question.body_blocks ? `第 ${question.id} 題題目` : question.question }}</h3>
              <MathQuestionContent v-if="question.body_blocks" :blocks="question.body_blocks" />
              <figure v-if="question.image" class="question-image">
                <a :href="siteUrl(question.image)" target="_blank" rel="noopener" aria-label="放大題目附圖">
                  <img :src="siteUrl(question.image)" :alt="question.image_alt || '題目附圖'" :width="question.image_width" :height="question.image_height" />
                </a>
                <figcaption>題目附圖，可點擊放大</figcaption>
              </figure>
              <details v-if="question.image_text" class="table-text">
                <summary>閱讀表格文字版</summary>
                <p>{{ question.image_text }}</p>
              </details>
              </div>
              <div class="answer-pane">
              <div class="choices" :class="{ 'math-options': question.option_columns === 2 }" role="group" :aria-label="`第 ${question.id} 題選項`">
                <button
                  v-for="choice in (['A', 'B', 'C', 'D'] as const)"
                  :key="choice"
                  type="button"
                  class="choice"
                  :class="{
                    selected: drafts[question.id] === choice && !isSettled(question),
                    'is-correct': isSettled(question) && acceptedAnswers(question).includes(choice),
                    'is-wrong': responses[question.id] === choice && !isCorrect(question, choice),
                  }"
                  :aria-pressed="!expired[question.id] && (responses[question.id] || drafts[question.id]) === choice"
                  :disabled="isSettled(question) || finished || (revengePlaying && preparingQuestion)"
                  @click="selectChoice(question, choice)"
                >
                  <span class="choice-letter">{{ choice }}</span>
                  <MathText v-if="question.body_blocks" :text="question.options[choice]" />
                  <span v-else>{{ question.options[choice] }}</span>
                </button>
              </div>
              <p v-if="expired[question.id]" class="answer-feedback">{{ unansweredLabel(question) }}。參考答案是 {{ answerLabel(question) }}。</p>
              <p v-else-if="responses[question.id]" class="answer-feedback" role="status">
                {{ isCorrect(question, responses[question.id]) ? '答對了。' : `答錯了，你選 ${responses[question.id]}。` }}
                參考答案是 {{ answerLabel(question) }}。
              </p>
              </div>
              </div>
              <div class="question-actions">
                <button v-if="!sequential" type="button" class="previous-question" :disabled="currentGroup.start + offset === 0" @click="goToQuestion(currentGroup.start + offset - 1)">上一題</button>
                <span v-if="revengePlaying" class="answer-selection" role="status">{{ preparingQuestion ? '準備完成後開始計時' : drafts[question.id] ? `已選 ${drafts[question.id]}` : '選擇一個答案' }}</span>
                <button v-if="!isSettled(question) && !finished" type="button" :disabled="!drafts[question.id] || preparingQuestion" @click="submitAnswer(question)">{{ revengePlaying ? (questionIndex === questions.length - 1 ? '送出並結算' : '送出答案') : sequential ? (questionIndex === questions.length - 1 ? '送出並交卷' : '送出並進入下一題') : '送出答案' }}</button>
                <button v-else-if="!sequential && currentGroup.start + offset < visibleQuestions.length - 1" type="button" @click="goToQuestion(currentGroup.start + offset + 1)">下一題</button>
              </div>
            </article>
          </section>
        </div>

        <aside v-if="!resultView && !revengeAttempt" class="question-sidebar" aria-label="題號與進度">
          <div class="sidebar-heading">
            <h3>題目進度</h3>
            <span>{{ completedCount }} / {{ questions.length }}</span>
          </div>
          <progress :value="completedCount" :max="questions.length">{{ completedCount }} / {{ questions.length }}</progress>
          <div class="question-grid" tabindex="0" role="group" aria-label="題號清單，可捲動">
            <button
              v-for="(item, index) in visibleQuestions"
              :key="item.id"
              type="button"
              :class="{
                current: index === questionIndex,
                correct: isCorrect(item, responses[item.id]),
                wrong: isSettled(item) && !isCorrect(item, responses[item.id]),
              }"
              :aria-label="`第 ${item.id} 題${expired[item.id] ? '，' + unansweredLabel(item) : responses[item.id] ? (isCorrect(item, responses[item.id]) ? '，答對' : '，答錯') : '，尚未作答'}`"
              :aria-current="index === questionIndex ? 'step' : undefined"
              :disabled="sequential"
              @click="goToQuestion(index)"
            >{{ item.id }}</button>
          </div>
          <p v-if="sequential" class="privacy-note">每題限時已開啟，題號僅顯示進度。</p>
          <button v-if="!finished" type="button" class="hand-in-button" @click="handIn">交卷並查看成績</button>
          <button type="button" class="reset-button" @click="resetSubject">重新作答本卷</button>
          <p class="privacy-note">{{ isolatedAttempt ? '本輪進度不暫存，完成後在此瀏覽器儲存成績。' : '進度僅保存在目前瀏覽器。' }}</p>
        </aside>
      </div>
      </template>
    </template>
  </section>
</template>

<style scoped>
:global(body.exam-revenge-scene) { isolation: isolate; background: #f2e7c8; }
:global(.exam-revenge-scene .site-banner) { display: none; }
:global(.exam-revenge-scene .site-header) { position: relative; background: #fff9ec; border-bottom: 1px solid #d9c9a8; }
:global(.exam-revenge-scene .page-main) { padding-top: 28px; min-height: calc(100svh - 74px); }
:global(.exam-revenge-scene .site-footer) { background: #fff9ec; border-color: #d9c9a8; }
.revenge-backdrop { position: fixed; inset: 0; z-index: -1; background-position: center; background-size: cover; background-repeat: no-repeat; pointer-events: none; }
.exam-page.revenge-active { margin-bottom: 24px; }
.revenge-active .practice-heading { padding: 20px 24px; border-radius: 16px; background: #fff9ec; }
.practice-heading h1 { margin: 8px 0 4px; color: var(--color-primary); font-size: clamp(1.5rem, 3vw, 2rem); }
.revenge-active .timer-bar, .revenge-active .question-card, .revenge-active .question-sidebar { background: #fffdf5; border-color: #cbb990; }
.revenge-active .result-summary { background: #fff9ec; }
.revenge-active .question-sidebar { box-shadow: 0 8px 28px #51442114; }
.revenge-active .exam-notice, .revenge-active .export-error { padding: 12px 16px; border-radius: 10px; background: #fff9ec; }
@media (max-width: 600px) { .revenge-active .practice-heading { padding: 16px; } :global(.exam-revenge-scene .page-main) { padding-top: 18px; } }
.revenge-battle .question-card.revenge-danger { border: 3px solid #b13930; padding: calc(clamp(20px, 4vw, 32px) - 2px); animation: revenge-countdown var(--revenge-pulse, 1.8s) ease-in-out infinite; }
.revenge-battle .question-set .question-card { scroll-margin-block-start: 100px; }
@keyframes revenge-countdown { 0%, 100% { border-color: #b13930; box-shadow: inset 0 0 0 2px #b1393033; } 50% { border-color: #e8b4a7; box-shadow: inset 0 0 0 7px #b139301a; } }
.revenge-result-note { margin-top: 8px !important; font-size: .9rem; }
.history-result-link { display: inline-flex; align-items: center; min-height: 44px; padding: 9px 18px; border-radius: 10px; font-weight: 700; }
@media (max-width: 560px) { .revenge-battle .question-card.revenge-danger { padding: 16px; } }
@media (prefers-reduced-motion: reduce) { .revenge-battle .question-card.revenge-danger { animation: none; box-shadow: inset 0 0 0 2px #b1393033; } }
.exam-settings { --setup-gap: 24px; margin: 0 0 32px; padding: 24px; background: var(--color-surface-muted); border-radius: 16px; }
.settings-title { margin: 0 0 20px !important; }
.mode-back { min-height: 36px; margin-bottom: 8px; }
.page-links .timing-trigger { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; max-width: 100%; min-height: 48px; padding: 10px 16px; border: 1px solid var(--color-primary); border-radius: var(--radius-control); background: var(--color-primary); color: white; font: inherit; font-weight: 700; text-align: start; }
.timing-trigger > svg { flex-shrink: 0; }
.timing-trigger > span { white-space: nowrap; }
.timing-trigger small { max-width: 100%; font-size: .78rem; font-weight: 400; }
.timing-trigger:hover, .timing-trigger[aria-expanded='true'] { background: var(--color-primary-hover); }
.timing-trigger:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 4px; }
.fixed-timing { display: inline-flex; align-items: center; gap: 8px; color: var(--color-primary); font-weight: 700; }
.shared-timing-panel { padding: 20px; margin-bottom: 24px; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-surface-muted); }
.shared-timing-panel h2 { font-size: 1.05rem; margin-bottom: 12px; }
.random-mode .random-footer { margin: 0 0 24px; padding: 0 0 24px; border-top: 0; border-bottom: 1px solid var(--color-border); }
.random-mode .random-settings { margin: 0; padding: 0; border-bottom: 0; }
.exam-settings h2 { margin: 0; font-size: 1.25rem; }
.start-button, .hand-in-button { min-height: 44px; padding: 10px 16px; border: 1px solid var(--color-control-border); border-radius: var(--radius-control); background: var(--color-surface); color: var(--color-primary); font: inherit; font-weight: 700; }
.start-button, .hand-in-button { color: var(--color-surface); background: var(--color-primary); border-color: var(--color-primary); }
.start-button:hover, .hand-in-button:hover { border-color: var(--color-primary-hover); }
.timing-settings { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 32px; }
.timing-option { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 12px; }
.check-label { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; cursor: pointer; line-height: 1.6; }
.check-label input { width: 18px; height: 18px; flex-shrink: 0; accent-color: var(--color-primary); }
.timing-option > .check-label { font-weight: 700; }
.timing-option p { flex-basis: 100%; }
.timing-option p, .settings-note { color: var(--color-text-muted); font-size: .88rem; margin: 8px 0 0; }
.number-label { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 8px; min-height: 44px; }
.number-label input { width: calc(5ch + 44px); max-width: 100%; min-height: 44px; padding: 8px 12px; border: 1px solid var(--color-control-border); border-radius: 8px; background: var(--color-surface); color: var(--color-text); font: inherit; font-variant-numeric: tabular-nums; }
.exam-settings input:focus-visible, .exam-settings button:focus-visible, .hand-in-button:focus-visible, .subject-checks:focus-visible, .question-grid:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 3px; }
.random-settings { display: grid; grid-template-columns: 176px minmax(0, 1fr); gap: var(--setup-gap); padding-bottom: var(--setup-gap); margin-bottom: var(--setup-gap); border-bottom: 1px solid var(--color-border); }
.random-settings fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
.random-settings legend { margin-bottom: 12px; font-weight: 700; }
.filter-checks { display: flex; flex-wrap: wrap; gap: 4px 24px; }
.source-fieldset .filter-checks { flex-direction: column; }
.subject-checks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px 24px; max-height: 320px; overflow-y: auto; overscroll-behavior-y: contain; scrollbar-width: thin; scrollbar-color: var(--color-control-border) var(--color-surface-muted); scrollbar-gutter: stable; padding: 4px; }
.subject-checks .check-label { align-items: flex-start; padding-block: 8px; }
.subject-checks .check-label input { margin-block-start: 4px; }
.subject-checks small { display: block; margin-top: 4px; color: var(--color-text-muted); font-size: .875rem; }
.subject-selection-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.subject-selection-actions button { min-height: 44px; padding: 8px 12px; border: 1px solid var(--color-control-border); border-radius: var(--radius-control); background: var(--color-surface); color: var(--color-primary); font: inherit; font-size: .875rem; }
.random-footer { display: grid; gap: 12px; margin-top: var(--setup-gap); padding-top: var(--setup-gap); border-top: 1px solid var(--color-border); }
.random-start { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px 24px; }
.random-footer .settings-note, .random-footer .export-error { margin: 0; }
.start-button:disabled { background: var(--color-disabled-bg); color: var(--color-disabled-text); border-color: var(--color-disabled-border); cursor: not-allowed; }
.timer-bar { position: sticky; top: 12px; z-index: 2; display: flex; align-items: center; flex-wrap: wrap; gap: 12px 24px; padding: 12px 16px; margin-bottom: 20px; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-surface); }
.timer-bar p { margin: 0; color: var(--color-text-muted); font-size: .85rem; }
.timer-value { display: flex; align-items: baseline; gap: 10px; color: var(--color-primary); }
.timer-value span { font-size: .85rem; }
.timer-value strong { font-size: 1.25rem; font-variant-numeric: tabular-nums; }
.timer-value.urgent { color: var(--color-danger); }
.timer-value.urgent strong { animation: countdown-warning 1.6s ease-in-out infinite; }
@keyframes countdown-warning { 50% { color: var(--color-danger-hover); background-color: #fcf2f0; } }
@media (prefers-reduced-motion: reduce) { .timer-value.urgent strong { animation: none; } }
.timer-warning { visibility: hidden; color: var(--color-danger); font-size: .88rem; margin: 0 0 16px; }
.timer-warning.warning-visible { visibility: visible; }
.exam-notice { margin: 0 0 18px; color: var(--color-danger); font-weight: 700; }
.question-source { color: var(--color-text-muted); font-size: .86rem; margin: 8px 0 0; overflow-wrap: anywhere; }
.hand-in-button { width: 100%; margin-top: 18px; }
.question-grid button:disabled { cursor: default; opacity: 1; }
@media (max-width: 1000px) {
  .random-settings { grid-template-columns: 1fr; }
  .source-fieldset .filter-checks { flex-direction: row; }
}
@media (max-width: 760px) {
  .timing-settings { grid-template-columns: 1fr; gap: 20px; }
  .subject-checks { grid-template-columns: 1fr; max-height: 288px; }
}
@media (max-width: 600px) {
  .exam-settings { --setup-gap: 24px; padding: 20px 16px; }
  .random-start { align-items: stretch; }
  .start-button { width: 100%; }
  .timer-bar { top: 6px; gap: 8px 16px; padding: 12px; }
}


.exam-page { max-width: 1120px; margin: 0 auto 56px; }
.page-heading, .practice-heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; }
.page-heading { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 24px; margin-bottom: 32px; }
.page-heading h1 { color: var(--color-primary); margin: 0; }
.heading-description { grid-column: 1 / -1; }
.page-heading p, .practice-heading p, .subject-heading p { color: var(--color-text-muted); margin: 0; }
.page-heading a { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; font-size: .9rem; }
.page-links { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; }
.mobile-year-picker { display: none; }
.year-picker { display: flex; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid var(--color-border); margin-bottom: 30px; }
.year-picker button { flex-shrink: 0; min-height: 48px; padding: 8px 22px; border: 0; border-bottom: 3px solid transparent; background: transparent; color: var(--color-text-muted); font-weight: 700; white-space: nowrap; }
.year-picker button:hover, .year-picker button.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }
.subject-list { max-width: 860px; }
.category-picker { max-width: 420px; margin: 0 0 24px; }
.category-picker summary { display: grid; grid-template-columns: auto 1fr 20px; align-items: center; gap: 12px; min-height: 52px; padding: 10px 14px; border: 1px solid var(--color-control-border); border-radius: var(--radius-control); color: var(--color-primary); background: var(--color-surface); cursor: pointer; list-style: none; }
.category-picker summary::-webkit-details-marker { display: none; }
.category-picker summary > span { color: var(--color-text-muted); font-size: .9rem; }
.category-picker summary > strong { text-align: right; }
.category-picker[open] summary svg { transform: rotate(180deg); }
.category-options { display: grid; gap: 4px; padding: 6px; margin-top: 8px; border: 1px solid var(--color-border); border-radius: var(--radius-control); }
.category-options button { width: 100%; min-height: 48px; padding: 10px 12px; border: 0; border-radius: 8px; background: var(--color-surface); color: var(--color-primary); font: inherit; text-align: left; }
.category-options button:hover, .category-options button[aria-pressed='true'] { background: var(--color-primary-soft); }
.category-options button[aria-pressed='true'] { font-weight: 700; }
.subject-group { margin: 26px 0 30px; }
.subject-group h3 { margin: 0 0 12px; font-size: 1.05rem; color: var(--color-primary); }
.subject-label { display: grid; gap: 3px; }
.subject-category { font-size: .78rem; font-weight: 400; color: var(--color-text-muted); }
.subject-heading { margin-bottom: 18px; }
.subject-heading h2 { margin-bottom: 4px; }
.subject-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; width: 100%; min-height: 76px; padding: 16px 22px; margin-bottom: 10px; text-align: left; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 14px; color: var(--color-text); }
.subject-row:not(:disabled):hover { border-color: var(--color-primary); background: var(--color-surface-muted); }
.subject-row:disabled { background: var(--color-surface); border-color: var(--color-border); color: var(--color-text); }
.subject-row.is-loading { background: var(--color-primary-soft); border-color: var(--color-primary); cursor: progress; }
.subject-name { font-size: 1.08rem; font-weight: 700; }
.subject-meta { display: inline-flex; align-items: center; gap: 16px; white-space: nowrap; color: var(--color-primary); font-size: .9rem; }
.progress-badge { display: inline-flex; align-items: center; min-height: 30px; padding: 3px 10px; border-radius: 999px; background: var(--color-surface-muted); color: var(--color-text-muted); font-size: .78rem; font-weight: 700; }
.progress-badge.in-progress { background: #fff4df; color: #80520b; }
.progress-badge.completed { background: var(--color-primary-soft); color: var(--color-primary); }
.privacy-note { color: var(--color-text-muted); font-size: .82rem; margin-top: 18px; }
.practice-layout { display: grid; grid-template-columns: minmax(0, 1fr) 272px; gap: 32px; align-items: start; }
.practice-main { min-width: 0; }
.practice-layout.showing-results { grid-template-columns: minmax(0, 1fr); }
.showing-results .wrong-list { max-width: 860px; margin-inline: auto; }
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
.question-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: var(--color-text-muted); font-size: .86rem; font-variant-numeric: tabular-nums; }
.question-topline span:first-child { color: var(--color-primary); font-weight: 750; }
.question-tools { display: inline-flex; align-items: center; gap: 12px; }
.copy-ai-button { display: inline-grid; place-items: center; flex: 0 0 44px; width: 44px; height: 44px; padding: 0; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-surface); color: var(--color-primary); }
.copy-ai-button:hover { border-color: var(--color-primary); background: var(--color-primary-soft); }
.copy-ai-button:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
.copy-notice { margin: 6px 0 0; color: var(--color-primary); font-size: .8rem; font-weight: 700; text-align: right; }
.question-card h3[id] { scroll-margin-block-start: 48px; }
.question-card h3 { font-size: 1.18rem; line-height: 1.8; margin: 18px 0 22px; white-space: pre-line; }
.question-card .math-question-label { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.question-card .question-body > .math-question-content { margin: 18px 0 22px; font-size: 1.04rem; }
.battle-question-layout, .question-body, .answer-pane { display: contents; }
.choices.math-options, .result-options.math-options { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.math-options .choice { align-items: center; min-width: 0; }
.math-options .math-text { min-width: 0; }
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
.question-actions { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; margin-top: 28px; }
.question-actions button { min-width: 102px; min-height: 44px; padding: 8px 16px; border: 1px solid var(--color-primary); border-radius: 10px; background: var(--color-primary); color: white; }
.question-actions .previous-question { background: white; color: var(--color-primary); }
.question-actions button:disabled { background: var(--color-disabled-bg); border-color: var(--color-disabled-border); color: var(--color-disabled-text); }
.question-sidebar { position: sticky; top: 24px; border: 1px solid var(--color-border); border-radius: 14px; padding: 20px; }
.sidebar-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 6px; }
.sidebar-heading h3 { margin: 0 0 10px; font-size: 1rem; }
.sidebar-heading span { font-size: .82rem; color: var(--color-text-muted); font-variant-numeric: tabular-nums; }
progress { width: 100%; height: 8px; accent-color: var(--color-primary); }
.question-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(44px, 1fr)); gap: 8px; max-height: min(320px, 36dvh); overflow-y: auto; overscroll-behavior-y: contain; scrollbar-width: thin; scrollbar-color: var(--color-control-border) var(--color-surface); scrollbar-gutter: stable; margin-top: 16px; padding: 4px; }
.question-grid button { min-height: 44px; padding: 0; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-surface); color: var(--color-text); font-size: .85rem; font-variant-numeric: tabular-nums; }
.question-grid button.current { outline: 2px solid var(--color-primary); outline-offset: 1px; }
.question-grid button.correct { background: var(--color-primary-soft); color: var(--color-primary); border-color: var(--color-primary); }
.question-grid button.wrong { background: #fcf2f0; color: var(--color-danger); border-color: var(--color-danger); }
.reset-button { width: 100%; min-height: 44px; margin-top: 12px; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-surface); color: var(--color-primary); }
.reset-button:hover { border-color: var(--color-primary); }
.question-sidebar .privacy-note { margin-bottom: 0; }
.load-message { padding: 16px; background: var(--color-surface-muted); border-radius: 12px; }
@media (max-height: 680px) and (min-width: 801px) { .question-sidebar { position: static; } }
@media (max-width: 800px) { .practice-layout { grid-template-columns: 1fr; } .question-sidebar { position: static; } .page-heading { grid-template-columns: minmax(0, 1fr); gap: 12px; } .practice-heading { align-items: flex-start; flex-direction: column; gap: 12px; } }
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
@media (max-width: 560px) { .subject-row { padding: 14px 16px; } .subject-name { font-size: 1rem; } .question-card { padding: 18px; } .question-grid { grid-template-columns: repeat(auto-fill, minmax(44px, 1fr)); } .set-heading { display: block; } .set-heading span { display: block; margin-top: 4px; } }
@media (max-width: 560px) { .subject-row { align-items: flex-start; flex-direction: column; gap: 10px; } .subject-meta { flex-wrap: wrap; } }
@media (max-width: 560px) { .result-summary { align-items: flex-start; flex-direction: column; } .result-actions button { width: 100%; } }
@media (max-width: 480px) { .choices.math-options, .result-options.math-options { grid-template-columns: 1fr; } }

/* During the timed challenge, the viewport is the playfield; content scrolls within it. */
:global(body.exam-revenge-playing) { overflow: hidden; }
:global(.exam-revenge-playing #site-header), :global(.exam-revenge-playing #site-footer) { display: none; }
:global(.exam-revenge-playing .page-main) { width: 100%; padding: 0; min-height: 0; }
.exam-page.revenge-playing { height: 100vh; height: 100dvh; padding: max(8px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(8px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left)); margin: 0 auto; }
.revenge-playing .practice-layout { display: block; height: 100%; }
.revenge-playing .practice-main { display: flex; flex-direction: column; gap: 8px; height: 100%; position: relative; }
.revenge-playing .practice-heading { flex: 0 0 auto; flex-direction: row; align-items: center; gap: 8px; padding: 4px 10px; margin: 0; }
.revenge-playing .practice-heading > div { display: flex; align-items: center; gap: 16px; min-width: 0; }
.revenge-playing .practice-heading h1 { margin: 0; font-size: 1.12rem; }
.revenge-playing .practice-heading p { display: none; }
.revenge-playing .back-link { display: inline-flex; align-items: center; min-height: 44px; white-space: nowrap; }
.battle-menu { position: relative; flex: 0 0 auto; }
.battle-menu > summary { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 8px; color: #345238; cursor: pointer; list-style: none; }
.battle-menu > summary::-webkit-details-marker { display: none; }
.battle-menu[open] > summary { background: #efe4cd; }
.battle-menu > div { position: absolute; right: 0; top: calc(100% + 6px); z-index: 5; width: 180px; padding: 6px; border: 1px solid #cbb990; border-radius: 12px; background: #fffdf5; }
.battle-menu button { width: 100%; min-height: 44px; padding: 8px 12px; border: 0; border-radius: 8px; background: transparent; color: #345238; text-align: left; }
.battle-menu button:hover { background: #efe4cd; }
.battle-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; padding: 4px 12px 0; border-radius: 12px; background: #fffdf5; }
.battle-toolbar .timer-value strong { font-size: 1.4rem; }
.battle-toolbar .timer-value.urgent strong { animation: none; }
.battle-toolbar .revenge-time-track { flex: 0 0 calc(100% + 24px); margin: 0 -12px; border-radius: 0 0 12px 12px; }
.battle-status { display: grid; flex: 1 0 6em; min-width: 0; color: #345238; line-height: 1.5; }
.battle-status strong { font-size: .86rem; }
.battle-status > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .75rem; color: #65533b; }
.revenge-playing .question-set { display: flex; flex: 1 1 0; min-height: 0; }
.revenge-playing .question-card { display: flex; flex-direction: column; flex: 1; min-height: 0; min-width: 0; padding: 16px; }
.revenge-playing .question-card.revenge-danger { padding: 14px; }
.revenge-playing .question-topline { flex: 0 0 auto; margin-bottom: 8px; }
.revenge-playing .question-tools { gap: 0; }
.battle-scroll-hint { flex: 0 0 auto; margin: 0 0 6px; color: #65533b; font-size: .75rem; font-weight: 400; }
.battle-menu-source { margin: 6px 10px 10px; color: var(--color-text-muted); font-size: .78rem; }
.revenge-playing .copy-notice { position: absolute; top: 112px; right: 12px; z-index: 4; padding: 8px 12px; border-radius: 8px; background: #fffdf5; }
.revenge-playing .battle-question-layout { display: flex; flex-direction: column; gap: 12px; flex: 1 1 0; min-height: 0; }
.revenge-playing .question-body, .revenge-playing .answer-pane { display: block; overflow-y: auto; min-height: 0; padding: 4px; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: #ac9a74 #f4ecd9; }
.revenge-playing .question-body { flex: 0 1 auto; }
.revenge-playing .answer-pane { flex: 0 0 auto; overflow: visible; }
.revenge-playing .question-body h3 { margin: 0 0 12px; font-size: 1.05rem; line-height: 1.7; }
.revenge-playing .question-body > .math-question-content { margin: 0 0 12px; font-size: 1rem; }
.revenge-playing .question-body .passage { margin: 0 0 16px; padding: 12px; }
.revenge-playing .question-body .passage p { margin-top: 8px; }
.revenge-playing .choices { gap: 8px; }
.revenge-playing .choice { min-height: 48px; padding: 9px 12px; }
.revenge-playing .question-actions { flex: 0 0 auto; align-items: center; gap: 12px; padding-top: 12px; margin-top: 12px; border-top: 1px solid #d9c9a8; }
.revenge-playing .question-actions button { min-width: 116px; }
.answer-selection { color: #65533b; font-size: .82rem; }
.preparation-error { position: absolute; inset: 130px 16px auto; z-index: 6; padding: 16px; border: 1px solid var(--color-danger); border-radius: 12px; background: #fffdf5; color: var(--color-danger); }
.preparation-error button { display: block; min-height: 44px; margin-top: 10px; padding: 8px 16px; border: 1px solid var(--color-control-border); border-radius: 8px; background: var(--color-surface); color: var(--color-primary); }
.revenge-playing .battle-scroll-all .battle-question-layout { display: block; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: #ac9a74 #f4ecd9; }
.revenge-playing .battle-scroll-all .question-body, .revenge-playing .battle-scroll-all .answer-pane { display: block; overflow: visible; }
.revenge-playing .battle-scroll-all .answer-pane { margin-top: 12px; }
@media (max-width: 700px) {
  .revenge-playing .battle-question-layout { display: flex; flex-direction: column; gap: 8px; }
  .revenge-playing .question-body { flex: 0 1 auto; }
  .revenge-playing .answer-pane { flex: 0 0 auto; overflow: visible; }
  .revenge-playing .question-card { padding: 12px; }
  .revenge-playing .question-card.revenge-danger { padding: 10px; }
  .revenge-playing .choices { gap: 6px; }
  .revenge-playing .choice { min-height: 44px; padding: 7px 10px; line-height: 1.55; }
  .revenge-playing .question-actions { padding-top: 8px; margin-top: 8px; }
}
</style>
