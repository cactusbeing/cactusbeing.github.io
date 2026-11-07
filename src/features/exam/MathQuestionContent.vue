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
      <div v-else-if="block.type === 'columns'" class="stem-columns" :class="{ 'stack-on-mobile': block.stack_on_mobile }">
        <MathQuestionContent v-for="(column, columnIndex) in block.columns" :key="columnIndex" :blocks="column" />
      </div>
      <div v-else-if="block.type === 'table'" class="stem-table-block">
        <p v-if="block.min_width" class="stem-table-hint">表格可左右滑動查看</p>
        <div class="stem-table-wrap" tabindex="0" role="region" :aria-label="block.caption || '題目表格'">
        <table class="stem-table" :style="block.min_width ? { minWidth: block.min_width + 'px' } : undefined">
          <caption v-if="block.caption">{{ block.caption }}</caption>
          <thead v-if="block.headers?.length">
            <tr><th v-for="(header, cellIndex) in block.headers" :key="cellIndex" scope="col"><MathText :text="header" /></th></tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
              <template v-for="(cell, cellIndex) in row" :key="cellIndex">
                <th v-if="block.row_headers && cellIndex === 0" scope="row"><MathText :text="cell" /></th>
                <td v-else><MathText :text="cell" /></td>
              </template>
            </tr>
          </tbody>
        </table>
        </div>
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
.stem-table-wrap { max-width: 100%; overflow-x: auto; margin: .65em 0 .85em; }
.stem-table { width: 100%; border-collapse: collapse; font: inherit; color: inherit; }
.stem-table th, .stem-table td { border: 1px solid var(--color-control-border, #7b8976); padding: .4em .55em; white-space: pre-line; vertical-align: top; }
.stem-table th { font-weight: 600; text-align: center; }
.stem-table th[scope='row'] { text-align: left; vertical-align: middle; }
.stem-table caption { text-align: left; margin-bottom: .4em; }
.stem-table-hint { display: none; }
@media (max-width: 600px) {
  .stem-columns.stack-on-mobile { grid-template-columns: minmax(0, 1fr); }
  .stem-table-hint { display: block; margin: .65em 0 0; font-size: .85rem; color: var(--color-text-muted); }
}
</style>
