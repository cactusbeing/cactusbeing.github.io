<script setup lang="ts">
import type { SkillTag } from '../types.ts';
defineProps<{ kind: SkillTag | 'ball' }>();
</script>
<template><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<template v-if="kind==='listen'"><path d="M17 34c0-6-7-7-7-15a13 13 0 0 1 26 0c0 7-5 10-8 14s-2 9-7 9c-4 0-6-3-6-5"/><path d="M18 23c-6-13 13-16 11-3-1 4-8 3-7 9"/></template>
<template v-else-if="kind==='ask_question'"><path d="M16 15a9 9 0 1 1 14 8c-5 3-6 4-6 8"/><circle cx="24" cy="38" r="1"/></template>
<template v-else-if="kind==='share_related'"><path d="M8 35V20l7-7 9 8-9 10H8m32 4V20l-7-7-9 8 9 10h7M17 24h14M25 18l6 6-6 6"/></template>
<template v-else-if="kind==='empathy'"><path d="M24 38 9 24C-2 12 15 3 24 14 33 3 50 12 39 24Z"/><path d="m14 24 5 4 10-10"/></template>
<template v-else-if="kind==='respect_boundary'"><path d="M13 40V24c0-3 4-3 4 0V12c0-4 5-4 5 0v10-14c0-4 5-4 5 0v14-11c0-4 5-4 5 0v16l5-7c3-4 7-1 4 4L31 40Z"/></template>
<template v-else-if="kind==='close_conversation'"><path d="M8 10h22v29H8ZM16 24h26m-7-7 7 7-7 7"/></template>
<template v-else><path d="M39 22c0 10-11 16-21 12l-9 6 2-12C-1 12 17 1 32 9c5 3 7 7 7 13Z"/><path d="M14 20h17m-17 6h10"/></template>
</svg></template>
