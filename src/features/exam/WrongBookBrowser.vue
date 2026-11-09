<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { siteUrl } from '../../shared/site-path';
import MathText from './MathText.vue';
import MathQuestionContent from './MathQuestionContent.vue';
import { sourceLabel } from './session';
import type { Question } from './session';
import type { Choice } from './progress';
import { mistakeAnswerLabel } from './training';
import type { WrongBookGroup } from './training';

const props = defineProps<{
  groups: WrongBookGroup[];
  loading: boolean;
  error: string;
  exporting: string | null;
  exportError: string;
  exportNotice: string;
}>();
defineEmits<{ close: []; retry: []; download: [group: WrongBookGroup] }>();
const totalQuestions = computed(() => props.groups.reduce((total, group) => total + group.questions.length, 0));
const visibleCounts = ref<Record<string, number>>({});
watch(() => [props.loading, props.error], () => { visibleCounts.value = {}; });
function toggleGroup(id: string, event: Event) {
  if ((event.target as HTMLDetailsElement).open) visibleCounts.value[id] ??= 20;
  else delete visibleCounts.value[id];
}
function loadMore(id: string) {
  visibleCounts.value[id] = (visibleCounts.value[id] ?? 0) + 20;
}

function answerLabel(question: Question) {
  return question.accepted_answers?.length ? question.accepted_answers.join(' 或 ') : question.answer;
}

function acceptedAnswers(question: Question): Choice[] {
  return question.accepted_answers?.length ? question.accepted_answers : [question.answer];
}
</script>

<template>
  <section class="wrong-book-browser" aria-labelledby="wrong-book-title">
    <header class="book-heading">
      <div>
        <h2 id="wrong-book-title" tabindex="-1">我的錯題本</h2>
        <p v-if="!loading && !error">共收錄 {{ totalQuestions }} 題待複習錯題，依科目整理。</p>
      </div>
      <button type="button" class="book-close" @click="$emit('close')">關閉錯題本</button>
    </header>

    <p v-if="loading" class="book-message" role="status">正在更新錯題本…</p>
    <div v-else-if="error" class="book-error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="$emit('retry')">重新載入</button>
    </div>
    <p v-if="exportError" class="book-error" role="alert">{{ exportError }}</p>
    <p v-if="exportNotice" class="book-message" role="status">{{ exportNotice }}</p>

    <p v-if="!loading && !error && !groups.length" class="book-empty">目前沒有待複習的錯題。作答時答錯的題目會即時收錄在這裡。</p>
    <template v-if="!loading && !error">
      <div v-for="group in groups" :key="group.id" class="book-subject">
        <div class="book-subject-heading">
          <div>
            <h3>{{ group.name }}</h3>
            <p>{{ group.questions.length }} 題待複習</p>
          </div>
          <button type="button" class="book-download" :disabled="Boolean(exporting)" @click="$emit('download', group)">
            {{ exporting === group.id ? '正在產生 PDF…' : '下載本科錯題本' }}
          </button>
        </div>
        <details class="book-question-list" :open="Boolean(visibleCounts[group.id])" @toggle="toggleGroup(group.id, $event)">
          <summary>瀏覽 {{ group.questions.length }} 題錯題</summary>
          <template v-if="visibleCounts[group.id]">
            <article v-for="{ question, userAnswer } in group.questions.slice(0, visibleCounts[group.id])" :key="`${question.source?.year}-${question.source?.subjectId}-${question.source?.questionId}`" class="book-question">
              <p class="book-source">{{ sourceLabel(question) }}</p>
              <details v-if="question.context" class="passage" open>
                <summary>閱讀文章</summary>
                <p>{{ question.context }}</p>
              </details>
              <h4 v-if="!question.body_blocks?.length">{{ question.question }}</h4>
              <MathQuestionContent v-else :blocks="question.body_blocks" />
              <figure v-if="question.image" class="question-image">
                <a :href="siteUrl(question.image)" target="_blank" rel="noopener" aria-label="放大題目附圖">
                  <img :src="siteUrl(question.image)" :alt="question.image_alt || '題目附圖'" :width="question.image_width" :height="question.image_height" loading="lazy" />
                </a>
                <figcaption>題目附圖，可點擊放大</figcaption>
              </figure>
              <details v-if="question.image_text" class="table-text">
                <summary>閱讀表格文字版</summary>
                <p>{{ question.image_text }}</p>
              </details>
              <ul class="result-options" :class="{ 'math-options': question.option_columns === 2 }">
                <li v-for="choice in (['A', 'B', 'C', 'D'] as const)" :key="choice" :class="{ 'is-correct': acceptedAnswers(question).includes(choice), 'is-wrong': userAnswer === choice && !acceptedAnswers(question).includes(choice) }">
                  <strong>{{ choice }}</strong>
                  <div class="book-option-content">
                    <MathText v-if="question.body_blocks?.length" :text="question.options[choice]" /><span v-else>{{ question.options[choice] }}</span>
                    <span v-if="acceptedAnswers(question).includes(choice) || userAnswer === choice" class="book-option-labels">
                      <span v-if="acceptedAnswers(question).includes(choice)">正確答案</span>
                      <span v-if="userAnswer === choice">你的選擇</span>
                    </span>
                  </div>
                </li>
              </ul>
              <p class="book-answer">你的作答：{{ mistakeAnswerLabel(userAnswer) }}　參考答案：{{ answerLabel(question) }}</p>
            </article>
            <button v-if="visibleCounts[group.id] < group.questions.length" type="button" class="book-load-more" @click="loadMore(group.id)">載入更多（已顯示 {{ Math.min(visibleCounts[group.id], group.questions.length) }} / {{ group.questions.length }} 題）</button>
          </template>
        </details>
      </div>
    </template>
  </section>
</template>

<style scoped>
.wrong-book-browser { margin: 24px 0 36px; padding: clamp(18px, 3vw, 28px); border-radius: 16px; background: var(--color-surface-muted); color: var(--color-text); }
.book-heading, .book-subject-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.book-heading { margin-bottom: 18px; }
.book-heading h2 { scroll-margin-top: 90px; }
.book-heading h2:focus-visible, .wrong-book-browser button:focus-visible, .book-question-list > summary:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 4px; }
.book-heading h2, .book-subject-heading h3 { margin: 0; color: var(--color-primary); }
.book-heading p, .book-subject-heading p { margin: 5px 0 0; color: var(--color-text-muted); }
.book-close, .book-download, .book-error button, .book-load-more { min-height: 44px; padding: 8px 14px; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-surface); color: var(--color-primary); font: inherit; font-weight: 700; }
.book-close:hover, .book-download:hover:not(:disabled), .book-error button:hover { border-color: var(--color-primary); background: var(--color-primary-soft); }
.book-download { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
.book-download:disabled { cursor: wait; opacity: .7; }
.book-subject { padding: 18px 0; border-top: 1px solid var(--color-border); }
.book-question-list { margin-top: 14px; }
.book-question-list > summary { width: fit-content; cursor: pointer; color: var(--color-primary); font-weight: 700; text-underline-offset: 3px; }
.book-question { padding: 22px 0; border-bottom: 1px solid var(--color-border); }
.book-question:last-child { border-bottom: 0; }
.book-source { margin: 0; color: var(--color-text-muted); font-size: .88rem; font-weight: 700; }
.book-question h4 { margin: 12px 0 18px; font-size: 1.08rem; line-height: 1.75; white-space: pre-line; }
.book-question :deep(.math-question-content) { margin: 12px 0 18px; }
.book-question .passage { padding: 14px 16px; margin: 14px 0; border-radius: 10px; background: var(--color-surface); }
.book-question .passage summary, .book-question .table-text summary { color: var(--color-primary); cursor: pointer; font-weight: 700; }
.book-question .passage p, .book-question .table-text p { margin: 10px 0 0; line-height: 1.8; white-space: pre-line; }
.book-question .question-image { margin: 14px 0; }
.book-question .question-image img { display: block; width: 100%; height: auto; max-height: min(60vh, 480px); object-fit: contain; }
.book-question .question-image figcaption { color: var(--color-text-muted); font-size: .8rem; }
.book-question .table-text { margin: 12px 0; }
.book-question .result-options { display: grid; gap: 8px; padding: 0; margin: 14px 0 0; list-style: none; }
.book-question .result-options li { display: flex; gap: 12px; padding: 10px 13px; border: 1px solid var(--color-border); border-radius: 9px; line-height: 1.65; white-space: pre-line; }
.book-question .result-options li strong { color: var(--color-primary); }
.book-question .result-options li.is-correct { border-color: var(--color-primary); background: var(--color-primary-soft); }
.book-question .result-options li.is-wrong { border-color: var(--color-danger); background: color-mix(in srgb, var(--color-danger) 9%, var(--color-surface)); }
.book-question .result-options li.is-wrong strong { color: var(--color-danger); }
.book-question .result-options.math-options { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.book-option-content { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.book-option-labels { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px; font-size: .85rem; font-weight: 700; }
.book-load-more { margin-top: 16px; width: 100%; }
.book-answer { margin: 14px 0 0; color: var(--color-danger); font-weight: 700; }
.book-message { color: var(--color-primary); }
.book-error { color: var(--color-danger); }
.book-error p { margin: 0 0 8px; }
.book-empty { padding: 18px 0; color: var(--color-primary); font-weight: 700; }
@media (max-width: 600px) {
  .book-question .result-options.math-options { grid-template-columns: 1fr; }
  .book-heading, .book-subject-heading { align-items: flex-start; }
  .book-heading { flex-direction: column; }
  .book-subject-heading { flex-direction: column; }
  .book-download { width: 100%; justify-content: center; }
}
</style>
