<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
const props = defineProps<{ frames: string[]; captions: [string, string]; reduced: boolean }>();
const emit = defineEmits<{ playing: [value: boolean] }>();
const frame = ref(props.reduced ? 1 : 0);
const playing = ref(!props.reduced);
let timer: ReturnType<typeof setTimeout> | undefined;
function finish() {
  playing.value = false;
  emit('playing', false);
}
function play() {
  if (timer) clearTimeout(timer);
  playing.value = !props.reduced;
  emit('playing', playing.value);
  frame.value = props.reduced ? 1 : 0;
  if (!props.reduced)
    timer = setTimeout(() => {
      frame.value = 1;
    }, 2200);
}
function entered() {
  if (frame.value !== 1 || props.reduced || !playing.value) return;
  // Start the final hold after both fade transitions actually finish.
  timer = setTimeout(finish, 2200);
}
onMounted(play);
watch(() => props.reduced, play);
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>
<template>
  <figure class="incident-film" :data-playing="playing">
    <div class="incident-screen">
      <Transition name="incident-fade" mode="out-in" @after-enter="entered">
        <img :key="frame" :src="frames[frame]" width="384" height="224" alt="" />
      </Transition>
    </div>
    <figcaption aria-live="polite">{{ reduced ? captions.join(' ') : captions[frame] }}</figcaption>
  </figure>
  <button v-if="!reduced" class="text-action incident-replay" :disabled="playing" @click="play">
    重播畫面
  </button>
</template>
