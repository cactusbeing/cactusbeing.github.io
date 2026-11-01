<script setup lang="ts">
import MathText from './MathText.vue';
import type { QuestionBlock } from './question-content';
import { siteUrl } from '../../shared/site-path';

defineProps<{ blocks: QuestionBlock[] }>();
function figureStyle(block: Extract<QuestionBlock, { type: 'image' }>) {
  return {
    width: 'clamp(' + (block.min_width ?? 0) + 'px, ' + (block.width_percent ?? 100) + '%, 100%)',
    '--figure-offset': (block.offset_percent ?? 0) + '%',
    marginInlineStart: block.offset_percent === undefined ? 'auto' : block.offset_percent + '%',
  };
}
</script>

<template>
  <div class="math-question-content">
    <template v-for="(block, index) in blocks" :key="index">
      <p v-if="block.type === 'text'" class="stem-text" :class="{ 'stem-inset': block.inset }"><MathText :text="block.text" /></p>
      <figure v-else-if="block.type === 'image'" class="stem-figure" :style="figureStyle(block)">
        <a :href="siteUrl(block.src)" target="_blank" rel="noopener" :aria-label="'放大查看圖表：' + block.alt">
          <img :src="siteUrl(block.src)" :alt="block.alt" :width="block.width" :height="block.height" />
        </a>
      </figure>
      <div v-else-if="block.type === 'box'" class="stem-box">
        <MathQuestionContent :blocks="block.blocks" />
      </div>
      <div v-else-if="block.type === 'columns'" class="stem-columns">
        <MathQuestionContent v-for="(column, columnIndex) in block.columns" :key="columnIndex" :blocks="column" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.math-question-content { min-width: 0; font: inherit; line-height: 1.85; color: inherit; }
.stem-text { margin: 0 0 .28em; white-space: pre-line; font-weight: 400; }
.stem-text:last-child { margin-bottom: 0; }
.stem-inset { margin: .9em 0; padding-inline-start: 1em; }
.stem-figure { max-width: calc(100% - var(--figure-offset, 0%)); margin: .65em auto .85em; }
.stem-figure img { display: block; width: 100%; height: auto; }
.stem-box { padding: .65em; margin: .6em 0; border: 1px solid var(--color-control-border, #7b8976); }
.stem-columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 1em; margin: .6em 0; }
.stem-columns .stem-text { font-size: .96em; }
</style>
