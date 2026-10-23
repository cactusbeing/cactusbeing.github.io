<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { initialAwarenessState, selectAnswer, nextQuestion, questions } from './questions';
import BaseButton from '../../shared/components/BaseButton.vue';
import BaseCard from '../../shared/components/BaseCard.vue';
import FeedbackMessage from '../../shared/components/FeedbackMessage.vue';
const state = ref(initialAwarenessState());
const question = computed(() => questions[state.value.index]);
const feedback = computed(
  () => question.value.options.find((option) => option.id === state.value.selected)?.feedback,
);
const heading = ref<HTMLHeadingElement>();
async function advance() {
  state.value = nextQuestion(state.value);
  await nextTick();
  heading.value?.focus();
}
async function retry() {
  state.value = initialAwarenessState();
  await nextTick();
  heading.value?.focus();
}
</script>
<template>
  <a href="/特教宣導slide.html">← 特教宣導教材</a>
  <h1>換個角度，一起理解</h1>
  <FeedbackMessage
    >互動示範：此題庫用於展示互動流程，尚未經正式教材審核，請搭配原有宣導教材使用。</FeedbackMessage
  ><BaseCard class="activity"
    ><template v-if="!state.complete"
      ><span class="tag">第 {{ state.index + 1 }} 題，共 {{ questions.length }} 題</span
      ><label for="awareness-progress" class="visually-hidden">活動進度</label
      ><progress id="awareness-progress" :value="state.index" :max="questions.length"></progress>
      <h2 ref="heading" tabindex="-1">{{ question.scenario }}</h2>
      <div class="stack">
        <button
          v-for="option in question.options"
          :key="option.id"
          class="choice"
          :aria-pressed="state.selected === option.id"
          :disabled="!!state.selected"
          @click="state = selectAnswer(state, option.id)"
        >
          {{ option.text }}<span v-if="state.selected === option.id">（已選擇）</span>
        </button>
      </div>
      <FeedbackMessage v-if="feedback" kind="success"
        ><p>{{ feedback }}</p>
        <p>{{ question.note }}</p></FeedbackMessage
      ><BaseButton v-if="state.selected" class="next" @click="advance">{{
        state.index === questions.length - 1 ? '完成活動' : '下一題'
      }}</BaseButton></template
    ><template v-else
      ><span class="tag">活動完成</span>
      <h2 ref="heading" tabindex="-1">謝謝你願意多一點理解。</h2>
      <p>把詢問、等待與尊重，帶進下一次互動。</p>
      <div class="actions">
        <BaseButton @click="retry">重新作答</BaseButton
        ><BaseButton href="/特教宣導slide.html" variant="secondary">閱讀宣導教材</BaseButton>
      </div></template
    ></BaseCard
  >
</template>
<style scoped>
.activity {
  max-width: 48rem;
  margin: 1.5rem auto;
}
.activity h2 {
  font-size: 1.6rem;
  margin-block: 1.5rem;
}
.choice {
  text-align: left;
  min-height: 64px;
  padding: 1.1rem;
  border-radius: var(--radius-control);
  background: white;
  border: 1px solid var(--color-control-border);
  color: var(--color-text);
  font-size: 1.15rem;
}
.choice:hover:enabled,
.choice[aria-pressed='true'] {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
}
.choice:disabled {
  color: var(--color-text);
}
.next {
  margin-top: 1rem;
}
</style>
