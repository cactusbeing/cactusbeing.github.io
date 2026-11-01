<script setup lang="ts">
import { computed } from 'vue';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const props = defineProps<{ text: string }>();
const parts = computed(() => {
  const result: { text: string; html?: string; suffix?: string }[] = [];
  const expressions = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let start = 0;
  for (const match of props.text.matchAll(expressions)) {
    if (match.index! > start) result.push({ text: props.text.slice(start, match.index) });
    const end = match.index! + match[0].length;
    const suffix = props.text.slice(end).match(/^[，。；：、！？）》」』】〕,.;:!?)]+/)?.[0] ?? '';
    result.push({
      text: match[0],
      suffix,
      html: katex.renderToString(match[1] ?? match[2]!, {
        displayMode: Boolean(match[1]), throwOnError: false, strict: false,
        trust: false, output: 'htmlAndMathml',
      }),
    });
    start = end + suffix.length;
  }
  if (start < props.text.length) result.push({ text: props.text.slice(start) });
  return result;
});
</script>

<template>
  <span class="math-text"><template v-for="(part, index) in parts" :key="index"><span v-if="part.html" class="math-expression"><span v-html="part.html"></span>{{ part.suffix }}</span><template v-else>{{ part.text }}</template></template></span>
</template>

<style scoped>
.math-expression { display: inline-block; max-width: 100%; vertical-align: baseline; white-space: nowrap; }
.math-expression :deep(.katex) { font-size: 1.13em; }
</style>
