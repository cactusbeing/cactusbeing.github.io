<script setup lang="ts">
import { computed, ref } from 'vue';
import { assessment, type AssessmentCategory } from './data/assessment';
import { summarize, exportAssessment } from './domain/summary';
import { downloadText } from '../../shared/utils';
import BaseCard from '../../shared/components/BaseCard.vue';
import BaseButton from '../../shared/components/BaseButton.vue';
import BaseModal from '../../shared/components/BaseModal.vue';
import FeedbackMessage from '../../shared/components/FeedbackMessage.vue';
const active = ref(0);
const selected = ref<string[]>([]);
const confirmClear = ref(false);
function groups(category: AssessmentCategory) {
  return category.groups.length ? category.groups.map((group) => group.title) : [''];
}
const summary = computed(() => summarize(selected.value));
function keyTab(event: KeyboardEvent, index: number) {
  let target: number;
  if (event.key === 'ArrowRight') target = (index + 1) % assessment.length;
  else if (event.key === 'ArrowLeft') target = (index + assessment.length - 1) % assessment.length;
  else if (event.key === 'Home') target = 0;
  else if (event.key === 'End') target = assessment.length - 1;
  else return;
  event.preventDefault();
  active.value = target;
  document.getElementById(`fba-tab-${target}`)?.focus();
}
</script>
<template>
  <span class="eyebrow">OBSERVE THE CONTEXT</span>
  <h1>FBA-行為功能評量</h1>
  <p class="muted">依實際觀察勾選項目，從不同面向整理行為脈絡。</p>
  <FeedbackMessage
    >保留原有六類評量選項與分類。本工具彙整勾選內容，不自動推論診斷或評分；資料不會儲存或上傳。</FeedbackMessage
  >
  <div class="tabs" role="tablist" aria-label="評量分類">
    <button
      v-for="(item, index) in assessment"
      :id="`fba-tab-${index}`"
      :key="item.id"
      role="tab"
      :aria-selected="active === index"
      :aria-controls="`fba-panel-${index}`"
      :tabindex="active === index ? 0 : -1"
      @click="active = index"
      @keydown="keyTab($event, index)"
    >
      {{ index + 1 }}. {{ item.title }}
      <span class="count">{{ summary[index].options.length }}</span>
    </button>
  </div>
  <BaseCard
    v-for="(category, index) in assessment"
    v-show="active === index"
    :id="`fba-panel-${index}`"
    :key="category.id"
    role="tabpanel"
    :aria-labelledby="`fba-tab-${index}`"
    ><h2>{{ category.title }}</h2>
    <p class="muted">可複選。切換分類會保留已勾選項目。</p>
    <fieldset v-for="group in groups(category)" :key="group">
      <legend v-if="group">{{ group }}</legend>
      <label
        v-for="option in category.options.filter((option) => option.group === group)"
        :key="option.id"
        class="option"
        ><input :id="option.id" v-model="selected" type="checkbox" :value="option.id" /><span>{{
          option.text
        }}</span></label
      >
    </fieldset></BaseCard
  >
  <div class="actions fba-actions">
    <span role="status">已選 {{ selected.length }} 個項目</span
    ><BaseButton href="#fba-summary" variant="secondary">查看彙整結果</BaseButton
    ><BaseButton
      :disabled="!selected.length"
      @click="downloadText(exportAssessment(selected), 'FBA-行為功能評量.txt')"
      >下載彙整</BaseButton
    ><BaseButton variant="secondary" :disabled="!selected.length" @click="confirmClear = true"
      >清空選擇</BaseButton
    >
  </div>
  <section id="fba-summary" class="section">
    <h2>彙整結果</h2>
    <div class="grid two">
      <BaseCard v-for="item in summary" :key="item.id"
        ><h3>{{ item.title }}</h3>
        <p v-if="!item.options.length" class="muted">尚未選取</p>
        <template v-for="(option, index) in item.options" :key="option.id"
          ><h4
            v-if="option.group && (index === 0 || item.options[index - 1].group !== option.group)"
          >
            {{ option.group }}
          </h4>
          <p class="summary-option">{{ option.text }}</p></template
        ></BaseCard
      >
    </div>
  </section>
  <BaseModal :open="confirmClear" title="清空所有選擇？" @close="confirmClear = false"
    ><p>六個分類的勾選與彙整結果都會清空。</p>
    <template #actions
      ><BaseButton
        variant="danger"
        @click="
          selected = [];
          active = 0;
          confirmClear = false;
        "
        >確認清空</BaseButton
      ></template
    ></BaseModal
  >
</template>
<style scoped>
fieldset {
  border: 0;
  padding: 0;
  margin: 1.5rem 0;
  min-width: 0;
}
legend {
  font-weight: 700;
  margin-bottom: 0.75rem;
}
.option {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  margin: 0.5rem 0;
  cursor: pointer;
}
.option:has(input:checked) {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
}
.option input {
  margin-top: 0.25rem;
}
.fba-actions {
  padding: 1rem;
  margin-top: 1.25rem;
  background: var(--color-surface-muted);
  border-radius: var(--radius-control);
}
.count {
  display: inline-block;
  min-width: 1.4rem;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 0.75rem;
}
.summary-option {
  border-left: 2px solid var(--color-border);
  padding-left: 0.8rem;
}
.tabs button {
  font-size: 0.9rem;
}
</style>
