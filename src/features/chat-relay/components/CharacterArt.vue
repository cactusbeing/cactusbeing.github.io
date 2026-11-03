<script setup lang="ts">
import { computed } from 'vue';
import { characters } from '../data/manifest.ts';
import type { Emotion } from '../types.ts';
const props = withDefaults(defineProps<{ npcId?: string; emotion?: Emotion; player?: boolean }>(), {
  npcId: 'xiaoyu', emotion: 'neutral', player: false,
});
const person = computed(() => props.player
  ? { color: '#cead76', hair: '#635047', style: 8 }
  : characters.find(p => p.id === props.npcId) ?? characters[0]);
</script>

<template>
  <svg viewBox="0 0 160 260" aria-hidden="true" class="character-art" :data-emotion="emotion" :data-character="player ? 'player' : npcId">
    <g stroke="#504f48" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
      <ellipse cx="80" cy="248" rx="47" ry="7" fill="#6d8064" opacity=".14" stroke="none"/>
      <!-- Back hair stays behind shoulders, neck and ears in every pose. -->
      <g data-layer="back-hair" :fill="person.hair">
        <template v-if="person.style === 1">
          <path d="M43 61Q18 56 20 82q-1 23-9 29 20 10 31-8l10-28m65-14q25-5 24 21 1 23 9 29-20 10-31-8l-11-28"/>
          <path d="M39 56Q31 17 76 16q50-2 47 43l-3 41-14 13H52L38 97Z"/>
        </template>
        <path v-else-if="person.style === 3" d="M36 57q-2-40 44-40 46 0 45 40l4 46q-4 14-25 16H54q-23-2-23-14Z"/>
        <template v-else-if="person.style === 6">
          <path d="M119 45q31 0 24 28-4 21 7 28-26 10-32-15l-10-28Z"/>
          <path d="M38 58q-3-41 40-41 48-2 47 43l-6 39H41Z"/>
        </template>
        <template v-else-if="person.style === 7">
          <path d="M111 25q12-16 25-4 13 16-2 29l-19 2Z"/>
          <path d="M37 60q-3-43 42-43 47-1 46 44l-5 36-16 17H55L38 96Z"/>
        </template>
      </g>
      <g data-layer="body">
        <path d="m51 189-5 48q8 10 23 3l10-45m5 0 10 47q17 6 23-4l-9-49" fill="#616c7a"/>
        <path d="m45 236-8 9q0 8 33 4v-11m24 0v11q32 6 31-4l-11-9" fill="#fff9ed"/>
        <path d="M48 120Q29 129 24 165l13 5 15-25m58-25q21 9 25 45l-13 5-15-25" :fill="person.color"/>
        <path d="M24 163q-10 22 4 22 9-1 10-18m96-4q10 22-4 22-9-1-10-18" fill="#f0cbb1"/>
        <path d="m49 120-6 78q37 14 73 0l-7-78-21-7H68Z" :fill="person.color"/>
        <path data-layer="neck" d="M69 104v13l10 15 12-15v-13Z" fill="#f0cbb1"/>
        <path d="m57 120 10-5 12 17-12 8Zm45 0-11-5-12 17 12 8Z" fill="#fffaf2"/>
        <path d="M80 137v54" opacity=".3"/>
        <path v-if="person.style === 2" d="m47 166 64-29m-64 42 65-29" stroke="#fffaf2" stroke-width="5"/>
        <path v-if="person.style === 7" d="m55 142 17 15-9 42m42-57-18 15 10 43" fill="none"/>
        <path v-if="person.style === 6" d="m93 158 6-8 7 8-7 8Z" fill="#fff4dc"/>
      </g>
      <g data-layer="face">
        <path d="M42 60q-11 2-10 19 1 13 12 14m74-33q11 2 10 19-1 13-12 14" fill="#f0cbb1"/>
        <path d="M40 54q0-31 40-31t40 31v27q-4 31-40 34-36-3-40-34Z" fill="#f3d1ba"/>
      </g>
      <g data-layer="front-hair" :fill="person.hair">
        <path v-if="person.style === 1" d="M38 65Q30 17 77 16q47-1 46 47l-14-8-9-20q-17 23-37 19l-5-10q-6 15-20 21Z"/>
        <path v-else-if="person.style === 3" d="M36 67Q29 15 80 17q48-1 45 49l-12-10-6-19q-23 21-50 15l-8 7-3 20-9-3Z"/>
        <path v-else-if="person.style === 6" d="M38 65Q27 15 80 17q47-2 44 47l-13-10-9-22Q79 53 49 54l-4 17Z"/>
        <path v-else-if="person.style === 7" d="M38 68Q28 16 80 17q48-1 44 49l-12-12-12-23Q80 56 49 53l-5 22Z"/>
        <path v-else d="M38 68Q22 20 68 15q55-10 55 48l-18-12-8-18q-10 18-24 20l-8-10q-9 20-27 25Z"/>
        <path v-if="person.style === 1" d="m28 76 12 3m81 0 12-3" fill="none" stroke="#d2ba82" stroke-width="4"/>
        <path v-if="person.style === 3" d="m44 46 9-5m-8 11 9-5" fill="none" stroke="#c6a6bf" stroke-width="4"/>
        <path v-if="person.style === 6" d="m121 52 8 4" fill="none" stroke="#b899b4" stroke-width="5"/>
        <path v-if="person.style === 8" d="m47 43 17-11 5 13m23-15 13 16" fill="none" stroke="#947969"/>
      </g>
      <g v-if="person.style === 4" data-layer="headphones">
        <path d="M33 66Q25 10 80 10t47 56" fill="none" stroke="#a38b4d" stroke-width="6"/>
        <rect x="28" y="62" width="12" height="27" rx="5" fill="#dfbf67"/>
        <rect x="120" y="62" width="12" height="27" rx="5" fill="#dfbf67"/>
      </g>
      <g v-if="emotion === 'happy'"><path d="m54 75 8-4 7 4m22 0 7-4 7 4m-36 15q11 14 23 0" fill="none"/></g>
      <g v-else>
        <ellipse cx="62" cy="77" rx="3" ry="4" fill="#504f48" stroke="none"/><ellipse cx="99" cy="77" rx="3" ry="4" fill="#504f48" stroke="none"/>
        <path v-if="emotion === 'sad'" d="m53 66 16-5m22 0 16 5m-38 28q11-8 23 0" fill="none"/>
        <path v-else-if="emotion === 'thoughtful'" d="m54 63 15 2m23-3 15 4m-29 27 9-2" fill="none"/>
        <path v-else-if="emotion === 'leaving'" d="m54 65 15-1m23 1 15-1m-31 26h11" fill="none"/>
        <path v-else d="m71 91q10 5 19 0" fill="none"/>
      </g>
      <g v-if="[5, 7].includes(person.style)" fill="none"><rect x="48" y="67" width="27" height="20" rx="7"/><rect x="86" y="67" width="27" height="20" rx="7"/><path d="M75 74h11m-45-2 7 2m65 0 7-2"/></g>
      <ellipse cx="49" cy="88" rx="6" ry="3" fill="#dc9f91" opacity=".45" stroke="none"/><ellipse cx="111" cy="88" rx="6" ry="3" fill="#dc9f91" opacity=".45" stroke="none"/>
    </g>
  </svg>
</template>
