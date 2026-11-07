<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import CookieArt from './CookieArt.vue';
import PackingStation from './PackingStation.vue';
import { createPackingStock, transferCookie } from './packing';
import type { CookieDestination, CookieSource } from './packing';
import { createBakerySound } from './sound';
import RestockStation from './RestockStation.vue';
import BakingStation from './BakingStation.vue';
import BaseButton from '../../shared/components/BaseButton.vue';
import { mathGameMaterialPdf } from '../../content/resources';
import { siteUrl } from '../../shared/site-path';
import { CHAPTERS, FLAVORS, countBox, counts, createDaily, createTask, equation, isComplete, total } from './bakery';
import type { Chapter, Counts, Flavor, Task } from './bakery';
const storageKey = 'cactusbeing-magic-bakery-v1';
const sounds = createBakerySound();
const soundOn = ref(true);
try { soundOn.value = localStorage.getItem('cactusbeing-bakery-sound') !== 'off'; } catch { /* Default to gentle sounds when preferences cannot be read. */ }
sounds.setEnabled(soundOn.value);
const chapter = ref<Chapter>(1);
const mode = ref<'practice' | 'daily'>('practice');
const screen = ref<'entry' | 'play'>('entry');
const entryHeading = ref<HTMLElement>();
const showMath = ref(false);
const voice = ref(false);
const voiceSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
const speechStatus = ref('');
const task = ref<Task>(createTask(1, 3));
const boxes = ref<Flavor[][]>([[]]);
const stock = ref<Counts>(counts());
const feedback = ref('');
const solved = ref(false);
const baking = ref(false);
const dailyTasks = ref<Task[]>([]);
const dailyIndex = ref(0);
const dailyFinished = ref(false);
const heading = ref<HTMLElement>();
const successHeading = ref<HTMLElement>();
const completed = ref<Record<string, number>>({});
const storageStatus = ref('');
try {
  const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    for (const key of ['1', '2', '3', '4', '5', '6', 'daily']) {
      const value = (saved as Record<string, unknown>)[key];
      if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) completed.value[key] = value;
    }
  }
} catch { storageStatus.value = '目前無法讀取進度，仍可正常遊玩。'; }
const packed = computed(() => boxes.value.reduce((sum, box) => sum + box.length, 0));
const canPack = computed(() => !solved.value && !baking.value);
const totalCompleted = computed(() => Object.values(completed.value).reduce((sum, value) => sum + value, 0));

function say(text: string) {
  if (!voiceSupported) return;
  window.speechSynthesis.cancel(); speechStatus.value = '';
  const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'zh-TW'; utterance.rate = .85;
  utterance.onerror = event => { if (!['interrupted', 'canceled'].includes(event.error)) speechStatus.value = '這次朗讀沒有播放，請再試一次；也可以閱讀訂單文字。'; };
  window.speechSynthesis.speak(utterance);
}
function readOrder() { say(`${task.value.customer}說：${task.value.request}`); }
function focusTask() { nextTick(() => heading.value?.focus({ preventScroll: true })); }
function focusPacking() { nextTick(() => document.querySelector<HTMLButtonElement>('.tray-cookie')?.focus({ preventScroll: true })); }
function toggleSound() {
  soundOn.value = !soundOn.value; sounds.setEnabled(soundOn.value);
  try { localStorage.setItem('cactusbeing-bakery-sound', soundOn.value ? 'on' : 'off'); } catch { /* Playing does not require persistent preferences. */ }
  if (soundOn.value) sounds.play('drop');
}
function loadTask(next: Task) {
  window.speechSynthesis?.cancel();
  task.value = next; boxes.value = Array.from({ length: next.boxCount }, () => []);
  stock.value = createPackingStock(next);
  solved.value = false; feedback.value = ''; baking.value = next.kind === 'bake';
  if (voice.value) readOrder();
}
function startPractice(id: Chapter = chapter.value) {
  chapter.value = id; mode.value = 'practice'; dailyFinished.value = false; screen.value = 'play';
  loadTask(createTask(id, 3, 'random', Math.random, 'mixed', task.value.recipe)); focusTask();
}
function startDaily() {
  screen.value = 'play'; mode.value = 'daily'; dailyTasks.value = createDaily(3); dailyIndex.value = 0; dailyFinished.value = false;
  loadTask(dailyTasks.value[0]); focusTask();
}
function startSelected() { sounds.play('pickup'); if (mode.value === 'daily') startDaily(); else startPractice(); }
function goEntry() {
  window.speechSynthesis?.cancel(); screen.value = 'entry';
  nextTick(() => entryHeading.value?.focus({ preventScroll: true }));
}
function moveCookie(source: CookieSource, destination: CookieDestination) {
  if (!canPack.value) return;
  const next = transferCookie({ stock: stock.value, boxes: boxes.value }, source, destination);
  if (!next) return;
  stock.value = next.stock; boxes.value = next.boxes; feedback.value = '';
  sounds.play(destination.kind === 'tray' ? 'return' : 'drop');
}
function completeBaking(nextStock: Counts) {
  stock.value = nextStock; baking.value = false; feedback.value = ''; sounds.play('drop'); focusPacking();
  if (voice.value) say('餅乾烤好了，開始裝盒。');
}
function toggleVoice() { voice.value = !voice.value; if (voice.value && screen.value === 'play') readOrder(); else window.speechSynthesis?.cancel(); }
function saveCompletion(key: string) {
  completed.value[key] = (completed.value[key] ?? 0) + 1;
  try { localStorage.setItem(storageKey, JSON.stringify(completed.value)); }
  catch { storageStatus.value = '目前無法儲存進度，仍可正常遊玩。'; }
}
function submit() {
  if (!canPack.value) return;
  if (isComplete(task.value, boxes.value, stock.value)) { finishOrder(); return; }
  if (task.value.kind === 'divide') {
    feedback.value = total(stock.value) > 0 ? `烤盤還有 ${total(stock.value)} 片，請全部分完。` : '每盒要一樣多，再調整看看。';
  } else {
    const index = boxes.value.findIndex(box => FLAVORS.some(flavor => countBox(box)[flavor] !== task.value.recipe[flavor]));
    feedback.value = `第 ${index + 1} 盒的形狀或數量還不對，再看看訂單。`;
  }
  sounds.play('retry');
  if (voice.value) say(feedback.value);
}
function completeRestock(nextStock: Counts) { stock.value = nextStock; finishOrder(); }
function finishOrder() {
  if (solved.value || !isComplete(task.value, boxes.value, stock.value)) return;
  solved.value = true; feedback.value = ''; sounds.play('success');
  if (mode.value === 'practice') saveCompletion(String(chapter.value));
  if (voice.value) say('訂單完成了！');
  nextTick(() => successHeading.value?.focus({ preventScroll: true }));
}
function nextOrder() {
  if (!solved.value) return;
  if (mode.value === 'practice') startPractice();
  else if (dailyIndex.value + 1 < dailyTasks.value.length) { dailyIndex.value++; loadTask(dailyTasks.value[dailyIndex.value]); focusTask(); }
  else { dailyFinished.value = true; saveCompletion('daily'); focusTask(); }
}
const successText = computed(() => task.value.kind === 'restock'
  ? `原有 ${total(task.value.stock!)} 片，新烤 ${total(task.value.recipe) - total(task.value.stock!)} 片，現在 ${total(task.value.recipe)} 片。`
  : task.value.kind === 'divide'
  ? `每盒 ${total(task.value.recipe)} 片，一樣多！`
  : task.value.kind === 'subtract' ? `送出 ${packed.value} 片，烤盤還剩 ${stock.value ? total(stock.value) : 0} 片。`
  : `${task.value.boxCount} 盒，共 ${packed.value} 片。`);
onBeforeUnmount(() => { window.speechSynthesis?.cancel(); sounds.dispose(); });
</script>
<template>
  <div class="bakery-app">
    <div class="bakery-topline"><a v-if="screen === 'entry'" :href="siteUrl('/game/')">← 遊戲百寶箱</a><button v-else class="bakery-text return-entry" type="button" @click="goEntry">← 換練習</button><div class="bakery-top-actions"><button class="bakery-text sound-toggle" type="button" :disabled="!sounds.supported" :aria-pressed="soundOn" :aria-label="soundOn ? '關閉遊戲音效' : '開啟遊戲音效'" :title="soundOn ? '音效開啟，點擊靜音' : '音效關閉，點擊開啟'" @click="toggleSound"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" /><path v-if="soundOn" d="M17 8a7 7 0 0 1 0 8M20 5a11 11 0 0 1 0 14" /><path v-else d="m17 9 5 6m0-6-5 6" /></svg></button><button class="bakery-text voice-toggle" type="button" :aria-pressed="voice" :disabled="!voiceSupported" @click="toggleVoice">自動朗讀：{{ voice ? '開' : '關' }}</button><button class="bakery-text math-toggle" type="button" :aria-pressed="showMath" @click="showMath = !showMath">顯示算式：{{ showMath ? '開' : '關' }}</button></div></div>
    <header class="bakery-welcome"><h1>魔法烘焙坊</h1><img :src="siteUrl('/assets/bakery/magic-bakery.webp')" width="1568" height="882" alt="小小烘焙師在溫暖的烘焙坊，烤盤和玻璃罐裡擺著三種形狀的餅乾。" /></header>
    <BaseButton v-if="screen === 'entry'" :href="siteUrl(mathGameMaterialPdf)" variant="secondary" target="_blank" rel="noopener" aria-label="開啟搭配教材：認識新台幣×魔法烘焙坊 PDF（新分頁）">搭配教材（PDF）</BaseButton>
    <section v-if="screen === 'entry'" class="bakery-entry" aria-label="選擇練習內容">
      <h2 ref="entryHeading" tabindex="-1">今天要練習什麼？</h2>
      <div class="lesson-choices" role="group" aria-label="練習內容"><button v-for="item in CHAPTERS" :key="item.id" type="button" :aria-pressed="mode === 'practice' && chapter === item.id" @click="mode = 'practice'; chapter = item.id"><b>{{ item.name }}</b><span>{{ item.short }}</span></button></div>
      <button class="daily-choice" type="button" :aria-pressed="mode === 'daily'" @click="mode = 'daily'"><b>今日營業</b><span>把學到的本領，一起用在訂單裡</span></button>
      <button class="bakery-primary start-practice" type="button" @click="startSelected">開始練習 →</button>
      <p class="entry-progress">已完成 {{ totalCompleted }} 回・沒有時間限制</p>
    </section>
    <template v-else>
    <p v-if="speechStatus" class="bakery-message" role="status">{{ speechStatus }}</p>
    <section v-if="dailyFinished" class="bakery-day-finish"><div class="bakery-stamp" aria-hidden="true">完成</div><h2 ref="heading" tabindex="-1">今天的訂單都完成了！</h2><button class="bakery-primary" type="button" @click="startDaily">再營業一天</button></section>
    <template v-else>
      <section class="bakery-order" aria-label="顧客訂單"><div class="order-heading"><h2 ref="heading" tabindex="-1">{{ task.customer }}的訂單</h2><button class="bakery-text" type="button" :disabled="!voiceSupported" @click="readOrder">聽題目</button></div><p class="customer-request">{{ task.request }}</p><small v-if="mode === 'daily'" class="daily-progress">今日營業 {{ dailyIndex + 1 }} / {{ dailyTasks.length }}</small></section>
      <section v-if="solved" class="bakery-success" aria-label="訂單完成"><div class="success-heading"><div class="bakery-stamp" aria-hidden="true">完成</div><div><h2 ref="successHeading" tabindex="-1">{{ task.kind === 'restock' ? '補貨完成！' : '訂單完成！' }}</h2><p>{{ successText }}</p></div></div><div v-if="task.kind === 'restock'" class="restock-finished-tray" aria-label="補貨完成的烤盤"><template v-for="flavor in FLAVORS" :key="flavor"><CookieArt v-for="n in task.recipe[flavor]" :key="`${flavor}-${n}`" :flavor="flavor" /></template></div><div v-else class="finished-boxes"><section v-for="(box, boxIndex) in boxes" :key="boxIndex" class="cookie-box sealed sage" :aria-label="`第 ${boxIndex + 1} 盒，${box.length} 片`"><div class="box-heading"><span>第 {{ boxIndex + 1 }} 盒</span><b>{{ box.length }} 片</b></div><div class="box-interior"><CookieArt v-for="(flavor, cookieIndex) in box" :key="cookieIndex" :flavor="flavor" /></div><span class="box-ribbon">幸福出爐</span></section></div><p v-if="showMath" class="bakery-equation">{{ equation(task) }}<span v-if="task.kind === 'multiply' || task.kind === 'bake'">{{ boxes.map(box => box.length).join(' + ') }} = {{ packed }}</span></p><button class="bakery-primary next-order" type="button" @click="nextOrder">{{ mode === 'practice' ? '下一張訂單' : dailyIndex + 1 === dailyTasks.length ? '完成今日營業' : '下一個步驟' }} →</button></section>
      <RestockStation v-else-if="task.kind === 'restock'" :key="task.request" :task="task" @complete="completeRestock" @feedback="message => voice && say(message)" @sound="sounds.play" />
      <BakingStation v-else-if="baking" :key="task.request" :task="task" @complete="completeBaking" @feedback="message => voice && say(message)" @sound="sounds.play" />
      <PackingStation v-else :key="task.request" :task="task" :stock="stock" :boxes="boxes" box-color="sage" :feedback="feedback" @move="moveCookie" @pickup="sounds.play('pickup')" @submit="submit" />
    </template>
    </template>
    <p v-if="storageStatus" class="bakery-message" role="status">{{ storageStatus }}</p>
  </div>
</template>
