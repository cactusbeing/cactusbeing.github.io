<script setup lang="ts">
import type { Flavor } from './bakery';
withDefaults(defineProps<{ flavor: Flavor; outline?: boolean }>(), { outline: false });
</script>
<template>
  <svg class="cookie-art" :class="[flavor, { outline }]" viewBox="0 0 80 80" aria-hidden="true">
    <rect v-if="flavor === 'chocolate'" class="cookie-body" x="12" y="12" width="56" height="56" rx="7" />
    <circle v-else-if="flavor === 'matcha'" class="cookie-body" cx="40" cy="40" r="29" />
    <path v-else class="cookie-body" d="M36 13 Q40 6 44 13 L72 61 Q76 68 68 68 H12 Q4 68 8 61 Z" />
    <g v-if="!outline" class="cookie-chips">
      <circle cx="32" cy="27" r="3.5" /><circle cx="50" cy="35" r="3" /><circle cx="27" cy="48" r="3" /><circle cx="48" cy="56" r="3.5" /><circle cx="40" cy="43" r="2" />
    </g>
  </svg>
</template>
<style scoped>
.cookie-art { width: 70px; height: 70px; flex-shrink: 0; overflow: visible; }
.cookie-body { stroke-width: 2.5; }
.chocolate .cookie-body { fill: #ab764e; stroke: #805333; }
.chocolate .cookie-chips { fill: #5b3625; }
.matcha .cookie-body { fill: #a6b971; stroke: #6d813c; }
.matcha .cookie-chips { fill: #596c32; }
.strawberry .cookie-body { fill: #edb1b3; stroke: #b76d77; }
.strawberry .cookie-chips { fill: #ab5367; }
.outline .cookie-body { fill: none; stroke: currentColor; stroke-dasharray: 4 4; opacity: .35; }
</style>
