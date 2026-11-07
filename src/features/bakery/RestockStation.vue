<script setup lang="ts">
import { computed, ref } from 'vue';
import CookieArt from './CookieArt.vue';
import { counts, FLAVORS, total } from './bakery';
import type { Counts, Task } from './bakery';
const props = defineProps<{ task: Task }>();
const emit = defineEmits<{ complete: [stock: Counts]; feedback: [message: string]; sound: [kind: 'bake' | 'return' | 'retry'] }>();
const baked = ref(0);
const feedback = ref('');
const flavor = computed(() => FLAVORS.find(item => props.task.recipe[item] > 0)!);
const original = computed(() => total(props.task.stock!));
const current = computed(() => original.value + baked.value);
function bake() {
  if (current.value >= 30) { feedback.value = '烤盤太滿了，先拿回一些新烤的餅乾。'; return; }
  baked.value++; feedback.value = ''; emit('sound', 'bake');
}
function takeBack() { if (baked.value > 0) { baked.value--; feedback.value = ''; emit('sound', 'return'); } }
function check() {
  const target = total(props.task.recipe);
  if (current.value !== target) {
    feedback.value = current.value < target ? '還不夠，再烤一些。' : '太多了，點新烤的餅乾拿回一些。';
    emit('feedback', feedback.value); emit('sound', 'retry'); return;
  }
  const stock = counts(); stock[flavor.value] = current.value; emit('complete', stock);
}
</script>
<template>
  <section class="restock-station" aria-label="補貨烤盤">
    <div class="restock-heading"><h2>幫烤盤補貨</h2><span aria-live="polite" aria-atomic="true">現在 {{ current }} 片</span></div>
    <div class="restock-tray"><CookieArt v-for="n in original" :key="`original-${n}`" :flavor="flavor" /><button v-for="n in baked" :key="`baked-${n}`" class="packed-cookie newly-baked" type="button" :aria-label="`拿回第 ${n} 片新烤的餅乾`" @click="takeBack"><CookieArt :flavor="flavor" /></button></div>
    <p v-if="feedback" class="bakery-message" role="status">{{ feedback }}</p>
    <div class="restock-actions"><button class="bakery-secondary bake-one" type="button" @click="bake">烤一片</button><button class="bakery-primary check-restock" type="button" @click="check">烤好了</button></div>
  </section>
</template>
