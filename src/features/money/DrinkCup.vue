<script setup lang="ts">
import { TOPPINGS, type ToppingId } from './money';
withDefaults(defineProps<{ color: string; toppings?: ToppingId[]; ice?: string }>(), { toppings: () => [] });
</script>
<template>
  <svg class="drink-cup" width="56" height="64" viewBox="0 0 56 64" aria-hidden="true">
    <path d="M13 17h32l-5 42H18z" fill="#fff" stroke="#75917a" stroke-width="1.8" />
    <path d="M15 23h28l-4 34H19z" :fill="color" />
    <g v-if="ice && !['去冰', '溫熱'].includes(ice)" fill="#fff" fill-opacity=".6"><rect x="20" y="26" width="8" height="8" rx="2" transform="rotate(-12 24 30)" /><rect x="31" y="30" width="7" height="7" rx="2" /></g>
    <g v-for="(id, index) in toppings" :key="id" :fill="TOPPINGS.find(t => t.id === id)?.color">
      <circle v-if="id === 'pearl'" v-for="n in 5" :key="n" :cx="21 + (n % 3) * 7" :cy="48 + Math.floor(n / 3) * 7" r="3" />
      <rect v-else v-for="n in 3" :key="`r${n}`" :x="19 + n * 4" :y="42 + index * 3" width="6" height="6" :rx="id === 'taro' ? 3 : 1" />
    </g>
    <path d="M31 19L35 3" stroke="#496e53" stroke-width="4" stroke-linecap="round" />
    <path d="M11 17h36" stroke="#496e53" stroke-width="4" stroke-linecap="round" />
    <rect x="23" y="35" width="13" height="10" rx="3" fill="#edf5eb" /><path d="M27 41c0-4 5-5 5-5 0 5-5 5-5 5z" fill="#496e53" />
  </svg>
</template>
