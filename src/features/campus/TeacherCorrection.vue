<script setup lang="ts">
import { computed, ref } from 'vue';
import SiteIcon from '../../shared/components/SiteIcon.vue';
const props = defineProps<{
  teacher: string;
  statement: string;
  correction: string;
  alternative: string;
}>();
const emit = defineEmits<{ complete: [] }>();
const turn = ref(0);
function lines(text: string) {
  const parts = text.match(/[^。！？；]+[。！？；]?/gu) || [text];
  return parts
    .flatMap((part) => (part.length <= 48 ? [part] : part.match(/[^，、]+[，、]?/gu) || [part]))
    .filter(Boolean);
}
const correctionLines = computed(() => lines(props.correction));
const alternativeLines = computed(() => lines(props.alternative));
const explanationEnd = computed(() => correctionLines.value.length);
const lastTurn = computed(() => explanationEnd.value + alternativeLines.value.length);
const speech = computed(() =>
  turn.value === 0
    ? '你剛才的說法，我想和你確認幾件事。'
    : turn.value <= explanationEnd.value
      ? correctionLines.value[turn.value - 1]
      : `${turn.value === explanationEnd.value + 1 ? '你可以這樣說：「' : ''}${alternativeLines.value[turn.value - explanationEnd.value - 1]}${turn.value === lastTurn.value ? '」' : ''}`,
);
const reply = computed(() =>
  turn.value === 0
    ? '好，請老師說。'
    : turn.value < explanationEnd.value
      ? '我在聽，請繼續。'
      : turn.value === explanationEnd.value
        ? '那我下次可以怎麼說？'
        : turn.value < lastTurn.value
          ? '嗯，接著呢？'
          : '我懂了，回顧這次的選擇。',
);
function next() {
  if (turn.value >= lastTurn.value) emit('complete');
  else turn.value++;
}
</script>
<template>
  <div class="teacher-conversation">
    <p v-if="turn === 0" class="student-utterance"><span>你剛才說</span>「{{ statement }}」</p>
    <div class="teacher-turn">
      <span class="pixel-portrait teacher-portrait" style="--shirt: #69776b" aria-hidden="true"
        ><i></i
      ></span>
      <div>
        <strong>{{ teacher }}</strong>
        <p :key="turn" class="teacher-speech" aria-live="polite">{{ speech }}</p>
      </div>
    </div>
    <div class="dialogue-reply">
      <span>你</span
      ><button class="primary-action" @click="next">
        {{ reply }}<SiteIcon name="arrow" :size="18" />
      </button>
    </div>
    <p class="dialogue-note">本輪已停止；先和老師談完，再回顧這次選擇。</p>
  </div>
</template>
