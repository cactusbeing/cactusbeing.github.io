<script setup lang="ts">
import { computed, ref } from 'vue';
import CookieArt from './CookieArt.vue';
import { COOKIES, FLAVORS, counts, scale, total } from './bakery';
import type { Counts, Flavor, Task } from './bakery';
const props = defineProps<{ task: Task }>();
const emit = defineEmits<{ complete: [stock: Counts]; feedback: [message: string]; sound: [kind: 'bake' | 'return' | 'retry'] }>();
const baked = ref(counts());
const feedback = ref('');
const current = computed(() => counts(...FLAVORS.map(flavor => props.task.stock![flavor] + baked.value[flavor]) as [number, number, number]));
function bake(flavor: Flavor) {
  if (total(current.value) >= 36) { feedback.value = '烤盤滿了，拿回一些新烤的餅乾。'; return; }
  baked.value[flavor]++; feedback.value = ''; emit('sound', 'bake');
}
function takeBack(flavor: Flavor) { if (baked.value[flavor] > 0) { baked.value[flavor]--; feedback.value = ''; emit('sound', 'return'); } }
function check() {
  const target = scale(props.task.recipe, props.task.boxCount);
  if (FLAVORS.some(flavor => current.value[flavor] !== target[flavor])) {
    feedback.value = '數量還不對，再看看訂單。'; emit('feedback', feedback.value); emit('sound', 'retry'); return;
  }
  emit('complete', { ...current.value });
}
</script>
<template>
  <section class="bakery-oven" aria-label="烘烤餅乾"><h2>先烤好餅乾，再裝盒</h2><div class="baking-flavors"><section v-for="flavor in FLAVORS" :key="flavor" class="baking-flavor"><div class="batch-heading"><b>{{ COOKIES[flavor].name }}</b><span aria-live="polite">{{ current[flavor] }} 片</span></div><div class="baking-cookie-tray"><CookieArt v-for="n in task.stock![flavor]" :key="`original-${n}`" :flavor="flavor" /><button v-for="n in baked[flavor]" :key="`baked-${n}`" class="packed-cookie newly-baked" type="button" :aria-label="`拿回一片新烤的${COOKIES[flavor].name}餅乾`" @click="takeBack(flavor)"><CookieArt :flavor="flavor" /></button></div><button class="bakery-secondary bake-flavor" type="button" :aria-label="`烤一片${COOKIES[flavor].name}餅乾`" @click="bake(flavor)">烤一片</button></section></div><p v-if="feedback" class="bakery-message" role="status">{{ feedback }}</p><button class="bakery-primary finish-baking" type="button" @click="check">烤好了，開始裝盒</button></section>
</template>
