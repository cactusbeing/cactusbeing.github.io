<script setup lang="ts">
import { ref, watch } from 'vue';
import { MONEY, moneyImage, moneyKind, type Side } from './money';
import { siteUrl } from '../../shared/site-path';
const props = withDefaults(defineProps<{ value: number; side?: Side; large?: boolean }>(), { side: 'b' });
const failed = ref(false);
watch(() => [props.value, props.side], () => { failed.value = false; });
</script>
<template>
  <span class="money-image" :class="{ note: value >= 100, large }">
    <img v-if="!failed" :src="siteUrl(moneyImage(value, side))" :alt="`${value} 元${moneyKind(value)}${side === 'a' ? '正面' : '背面'}：${side === 'a' ? MONEY[value]?.front : MONEY[value]?.back}`" @error="failed = true" />
    <span v-else class="image-fallback">{{ value }} 元<br />圖片未載入，請重新整理</span>
  </span>
</template>
<style scoped>
.money-image { display: inline-flex; align-items: center; justify-content: center; width: 94px; height: 84px; flex-shrink: 0; }
.money-image img { display: block; max-height: 100%; max-width: 100%; object-fit: contain; }
.money-image.note { width: 146px; }
.money-image.large { width: min(100%, 230px); height: 230px; }
.money-image.large.note { width: min(100%, 440px); height: 230px; }
.image-fallback { color: var(--color-text); font-size: .85rem; text-align: center; }
@media(max-width: 520px) { .money-image { width: 75px; height: 70px; } .money-image.note { width: 120px; } .money-image.large { height: 190px; } }
</style>
