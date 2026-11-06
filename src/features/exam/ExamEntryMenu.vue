<script setup lang="ts">
import SiteIcon from '../../shared/components/SiteIcon.vue';
import { siteUrl } from '../../shared/site-path';
defineProps<{ mistakes: number }>();
defineEmits<{ choose: [mode: 'past' | 'random' | 'revenge'] }>();
</script>

<template>
  <nav class="practice-menu" aria-label="選擇練習模式">
    <button type="button" class="practice-entry" @click="$emit('choose', 'past')">
      <span class="entry-picture"><SiteIcon name="book" :size="72" /></span>
      <span class="entry-copy"><strong>歷屆試題</strong><span>依年度、類科與科目練習</span></span>
      <SiteIcon class="entry-arrow" name="arrow" :size="20" />
    </button>
    <button type="button" class="practice-entry" @click="$emit('choose', 'random')">
      <span class="entry-picture random-picture"><svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 2 4 4-4 4M18 14l4 4-4 4M2 6h2.5c2 0 3.5 1 5 3l5 6c1.5 2 3 3 5 3H22M2 18h2.5c2 0 3.5-1 5-3l5-6c1.5-2 3-3 5-3H22" /></svg></span>
      <span class="entry-copy"><strong>隨機抽題</strong><span>自選範圍與題數，自由搭配</span></span>
      <SiteIcon class="entry-arrow" name="arrow" :size="20" />
    </button>
    <button type="button" class="practice-entry revenge-entry" @click="$emit('choose', 'revenge')">
      <span class="entry-picture"><img :src="siteUrl('/assets/decor/exam-revenge.webp')" alt="" width="1024" height="683" decoding="async" /></span>
      <span class="entry-copy"><strong>錯題復仇戰</strong><span>{{ mistakes ? `${mistakes} 題待挑戰 · 每題 60 秒` : '挑戰自己的錯題 · 每題 60 秒' }}</span></span>
      <SiteIcon class="entry-arrow" name="arrow" :size="20" />
    </button>
  </nav>
</template>

<style scoped>
.practice-menu { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.practice-entry { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0 12px; overflow: hidden; padding: 0 0 22px; border: 1px solid var(--color-border); border-radius: 16px; background: var(--color-surface); color: var(--color-primary); text-align: left; }
.practice-entry:hover { border-color: var(--color-primary); background: var(--color-surface-muted); }
.practice-entry:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 4px; }
.entry-picture { position: relative; display: grid; grid-column: 1 / -1; place-items: center; overflow: hidden; height: 180px; margin-bottom: 20px; background: var(--color-primary-soft); }
.random-picture { background: #f4f7ed; }
.entry-picture img { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; object-position: center 50%; }
.entry-copy { display: grid; gap: 6px; padding-left: 22px; }
.entry-copy strong { font-size: 1.3rem; }
.entry-copy > span { font-size: .85rem; color: var(--color-text-muted); }
.entry-arrow { align-self: center; margin-right: 22px; }
@media (max-width: 700px) {
  .practice-menu { grid-template-columns: 1fr; gap: 12px; }
  .practice-entry { grid-template-columns: 88px minmax(0, 1fr) 28px; align-items: center; gap: 12px; min-height: 104px; padding: 0 10px 0 0; }
  .entry-picture { grid-column: auto; align-self: stretch; height: 100%; min-height: 104px; margin: 0; }
  .entry-picture svg { width: 46px; height: 46px; }
  .entry-picture img { object-position: 30% 50%; }
  .entry-copy { gap: 4px; padding: 12px 0; }
  .entry-copy strong { font-size: 1.12rem; }
  .entry-copy > span { font-size: .8rem; }
  .entry-arrow { margin: 0; }
}
</style>
