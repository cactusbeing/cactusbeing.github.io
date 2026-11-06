<script setup lang="ts">
import type { StickerKind } from '../types.ts';
defineProps<{kind:StickerKind}>();
</script>
<template>
  <svg class="reply-sticker" :data-sticker="kind" viewBox="0 0 80 72" fill="none" stroke="#405b44" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M20 54c-7-7-9-17-4-27l-1-12 12 5c8-3 16-3 24 0l12-5-1 12c5 10 3 21-4 27-10 9-27 9-38 0Z" :fill="kind==='comfort'?'#e9e1ee':kind==='wait'?'#e3edda':'#f5dfab'"/>
    <template v-if="kind==='cheer'"><path d="m26 36 5-4 5 4m9 0 5-4 5 4m-21 8q8 11 16 0"/><path d="m7 20-4-5m68 5 5-5M6 34H1m72 0h5" stroke="#9b7134"/><path d="m34 10 5-8 4 8" fill="#f5dfab"/></template>
    <template v-else-if="kind==='comfort'"><path d="m25 35 8 2m14 0 8-2m-21 9q7-4 14 0"/><path d="M9 47q8-11 18-2m37 2q-8-11-18-2"/><path d="m39 65-8-8c-6-8 5-13 8-6 5-7 14-1 8 6Z" fill="#dca57f"/></template>
    <template v-else-if="kind==='laugh'"><path d="m25 32 8 5-8 3m30-8-8 5 8 3M30 46q10 19 20 0Z" fill="#fffdf4"/><path d="M17 40q-8 5-7 10 7 2 8-3m46-7q8 5 7 10-7 2-8-3" fill="#b4d7df"/></template>
    <template v-else-if="kind==='wave'"><circle cx="30" cy="36" r="1.6" fill="#405b44"/><circle cx="49" cy="36" r="1.6" fill="#405b44"/><path d="M33 45q7 7 14 0m13-1q18-3 10-17m0-5 4-5m-9 3v-6"/></template>
    <template v-else><circle cx="30" cy="36" r="1.6" fill="#405b44"/><circle cx="49" cy="36" r="1.6" fill="#405b44"/><path d="M33 45q7 6 14 0m15 11 8-10m-4-5 6 5 6-8"/><path d="M6 12h16m-12 6h10" stroke="#71895f"/></template>
  </svg>
</template>
