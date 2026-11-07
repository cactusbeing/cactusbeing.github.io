<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import CookieArt from './CookieArt.vue';
import { COOKIES, FLAVORS, total } from './bakery';
import type { Counts, Flavor, Task } from './bakery';
import type { CookieDestination, CookieSource } from './packing';
const props = defineProps<{
  task: Task; stock: Counts; boxes: Flavor[][]; boxColor: string;
  feedback: string;
}>();
const emit = defineEmits<{
  move: [source: CookieSource, destination: CookieDestination];
  pickup: []; submit: [];
}>();
const area = ref<HTMLElement>();
const picked = ref<CookieSource | null>(null);
const drag = ref<{ source: CookieSource; x: number; y: number; startX: number; startY: number; id: number; moving: boolean } | null>(null);
const hovered = ref<string | null>(null);
let capture: HTMLElement | null = null;
let skipClickUntil = 0;
const flavors = computed(() => FLAVORS.filter(flavor => props.stock[flavor] > 0 || props.boxes.some(box => box.includes(flavor))));
function sameSource(a: CookieSource | null, b: CookieSource): boolean {
  return !!a && a.kind === b.kind && a.flavor === b.flavor &&
    (a.kind === 'tray' ? b.kind === 'tray' && a.cookieIndex === b.cookieIndex : b.kind === 'box' && a.boxIndex === b.boxIndex && a.cookieIndex === b.cookieIndex);
}
function begin(event: PointerEvent, source: CookieSource) {
  // Touch uses tap-to-place so students can scroll between the tray and boxes.
  if (event.pointerType === 'touch' || !event.isPrimary || event.button !== 0 || drag.value) return;
  drag.value = { source, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, id: event.pointerId, moving: false };
  capture = event.currentTarget as HTMLElement;
  capture.setPointerCapture(event.pointerId);
}
function targetAt(x: number, y: number): string | null {
  const element = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-bakery-target]');
  return element && area.value?.contains(element) ? element.dataset.bakeryTarget ?? null : null;
}
function move(event: PointerEvent) {
  const current = drag.value;
  if (!current || current.id !== event.pointerId) return;
  current.x = event.clientX; current.y = event.clientY;
  if (!current.moving && Math.hypot(current.x - current.startX, current.y - current.startY) >= 7) {
    current.moving = true; picked.value = null; emit('pickup');
  }
  if (current.moving) { event.preventDefault(); hovered.value = targetAt(current.x, current.y); }
}
function destination(target: string): CookieDestination | null {
  if (target === 'tray') return { kind: 'tray' };
  const match = /^box-(\d+)$/.exec(target);
  return match ? { kind: 'box', boxIndex: Number(match[1]) } : null;
}
function cancel() {
  const id = drag.value?.id;
  drag.value = null; hovered.value = null;
  if (id !== undefined && capture?.hasPointerCapture(id)) capture.releasePointerCapture(id);
  capture = null;
}
function end(event: PointerEvent) {
  const current = drag.value;
  if (!current || event.pointerId !== current.id) return;
  const target = current.moving ? targetAt(event.clientX, event.clientY) : null;
  cancel();
  if (current.moving) {
    skipClickUntil = performance.now() + 300;
    const next = target && destination(target);
    if (next) emit('move', current.source, next);
  }
}
function cookieClick(source: CookieSource) {
  if (performance.now() < skipClickUntil) return;
  if (picked.value && source.kind === 'box' && !sameSource(picked.value, source)) { placePicked({ kind: 'box', boxIndex: source.boxIndex }); return; }
  if (props.boxes.length === 1) emit('move', source, source.kind === 'tray' ? { kind: 'box', boxIndex: 0 } : { kind: 'tray' });
  else { picked.value = sameSource(picked.value, source) ? null : source; if (picked.value) emit('pickup'); }
}
function placePicked(target: CookieDestination) {
  if (performance.now() < skipClickUntil || !picked.value) return;
  emit('move', picked.value, target); picked.value = null;
}
function escapeDrag(event: KeyboardEvent) { if (event.key === 'Escape' && (drag.value || picked.value)) { event.preventDefault(); skipClickUntil = performance.now() + 300; cancel(); picked.value = null; } }
function visibilityChanged() { if (document.hidden) cancel(); }
onMounted(() => { window.addEventListener('blur', cancel); window.addEventListener('keydown', escapeDrag); document.addEventListener('visibilitychange', visibilityChanged); });
onBeforeUnmount(() => { cancel(); window.removeEventListener('blur', cancel); window.removeEventListener('keydown', escapeDrag); document.removeEventListener('visibilitychange', visibilityChanged); });
</script>
<template>
  <section ref="area" class="packing-station" :class="{ 'has-picked': picked !== null }" aria-label="拖曳分裝工作台" @pointermove="move" @pointerup="end" @pointercancel="cancel" @lostpointercapture="cancel">
    <p class="packing-instruction"><span class="desktop-drag-hint">{{ picked ? '點一個盒子放入，或放回烤盤' : '把餅乾拖進盒子；整個盒子都能放' }}</span><span class="mobile-tap-hint">{{ picked ? '已選好餅乾，點一個盒子放入' : '先點餅乾，再點盒子' }}</span></p>
    <div class="drag-workbench">
      <section class="physical-tray" data-bakery-target="tray" :class="{ 'drop-active': hovered === 'tray' }" aria-label="餅乾烤盤" @click.self="placePicked({ kind: 'tray' })">
        <div class="tray-heading"><h2>餅乾烤盤</h2><button class="bakery-text return-cookie" type="button" :aria-label="picked ? '把選取的餅乾放回烤盤' : '烤盤剩餘數量'" @click="placePicked({ kind: 'tray' })">{{ total(stock) }} 片</button></div>
        <div class="tray-batches" @click.self="placePicked({ kind: 'tray' })"><section v-for="flavor in flavors" :key="flavor" class="tray-batch"><div class="batch-heading"><b v-if="task.requestMode !== 'shape'">{{ COOKIES[flavor].name }}</b><span>{{ stock[flavor] }} 片</span></div><div class="tray-cookie-grid" @click.self="placePicked({ kind: 'tray' })"><button v-for="n in stock[flavor]" :key="n" class="tray-cookie" :class="[{ picked: sameSource(picked, { kind: 'tray', flavor, cookieIndex: n - 1 }) }, flavor]" type="button" :aria-label="`烤盤第 ${n} 片${COOKIES[flavor].shape}${task.requestMode === 'shape' ? '' : COOKIES[flavor].name}餅乾`" :aria-pressed="sameSource(picked, { kind: 'tray', flavor, cookieIndex: n - 1 })" @pointerdown="begin($event, { kind: 'tray', flavor, cookieIndex: n - 1 })" @click.stop="cookieClick({ kind: 'tray', flavor, cookieIndex: n - 1 })" @dragstart.prevent><CookieArt :flavor="flavor" /></button></div></section><span v-if="total(stock) === 0" class="tray-empty">烤盤空了</span></div>
        <button class="return-zone" type="button" data-bakery-target="tray" :class="{ 'drop-active': hovered === 'tray' }" @click="placePicked({ kind: 'tray' })"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5-6 6 6 6M3 11h11a6 6 0 0 1 6 6v2" /></svg>放回烤盤</button>
      </section>
      <section class="packing-box-area" aria-label="所有餅乾盒"><h2>我的餅乾盒</h2><div class="all-cookie-boxes" :class="{ 'single-box': boxes.length === 1 }"><section v-for="(box, boxIndex) in boxes" :key="boxIndex" class="cookie-box" :class="[boxColor, { 'drop-active': hovered === `box-${boxIndex}` }]" :data-bakery-target="`box-${boxIndex}`" :aria-label="`第 ${boxIndex + 1} 盒，有 ${box.length} 片`" @click.self="placePicked({ kind: 'box', boxIndex })"><button class="box-destination" type="button" :aria-label="`把選取的餅乾放進第 ${boxIndex + 1} 盒，目前 ${box.length} 片`" @click="placePicked({ kind: 'box', boxIndex })"><b>第 {{ boxIndex + 1 }} 盒</b><span aria-live="polite" aria-atomic="true">{{ box.length }} 片</span></button><div class="box-interior" @click.self="placePicked({ kind: 'box', boxIndex })"><button v-for="(flavor, cookieIndex) in box" :key="cookieIndex" class="packed-cookie" :class="{ picked: sameSource(picked, { kind: 'box', flavor, boxIndex, cookieIndex }) }" type="button" :aria-label="`第 ${boxIndex + 1} 盒第 ${cookieIndex + 1} 片${COOKIES[flavor].shape}餅乾，可移動或拿回`" :aria-pressed="sameSource(picked, { kind: 'box', flavor, boxIndex, cookieIndex })" @pointerdown="begin($event, { kind: 'box', flavor, boxIndex, cookieIndex })" @click.stop="cookieClick({ kind: 'box', flavor, boxIndex, cookieIndex })" @dragstart.prevent><CookieArt :flavor="flavor" /></button><button v-if="box.length === 0" class="empty-box-target" type="button" :aria-label="`放進第 ${boxIndex + 1} 盒`" @click="placePicked({ kind: 'box', boxIndex })">點這盒放入</button></div></section></div>
        <p v-if="feedback" class="bakery-message" role="status">{{ feedback }}</p>
        <button class="bakery-primary check-packing" type="button" @click="emit('submit')">{{ boxes.length > 1 ? '都裝好了，完成訂單' : '裝好了' }}</button>
      </section>
    </div>
    <p class="drag-alternative">{{ boxes.length > 1 ? '也可以先點餅乾，再點盒子。' : '也可以點餅乾裝盒，點盒內餅乾拿回。' }}</p>
    <div v-if="picked" class="selected-cookie-tools"><CookieArt :flavor="picked.flavor" /><span role="status">已選餅乾，點盒子放入</span><button v-if="picked.kind === 'box'" class="bakery-secondary" type="button" @click="placePicked({ kind: 'tray' })">放回烤盤</button><button class="bakery-text cancel-selection" type="button" @click="picked = null">取消</button></div>
    <div v-if="drag?.moving" class="dragged-cookie" :style="{ transform: `translate3d(${drag.x - 32}px, ${drag.y - 32}px, 0)` }" aria-hidden="true"><CookieArt :flavor="drag.source.flavor" /></div>
  </section>
</template>
