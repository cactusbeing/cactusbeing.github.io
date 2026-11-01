<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import MoneyImage from './MoneyImage.vue';
import MoneyWallet from './MoneyWallet.vue';
import TeaShop from './TeaShop.vue';
import { MONEY, denominations, moneyKind, questions, type Difficulty, type Mode, type Side } from './money';
import './money.css';
const modes: { id: Mode; title: string; hint: string }[] = [
  { id: 'learn', title: '認識錢幣', hint: '看一看正反面' },
  { id: 'identify', title: '找出錢幣', hint: '選出指定面額' },
  { id: 'make', title: '湊出金額', hint: '練習組合錢幣' },
  { id: 'shop', title: '手搖店購物', hint: '和小青一起點餐' },
  { id: 'change', title: '找零練習', hint: '算算要拿回多少' },
];
const mode = ref<Mode>('learn');
const difficulty = ref<Difficulty>('basic');
const include20 = ref(false);
const count = ref(5);
const voice = ref(false);
const voiceSupported = 'speechSynthesis' in window;
const speechError = ref('');
const settingsOpen = ref(false);
const values = computed(() => denominations(difficulty.value, include20.value));
const learnIndex = ref(0);
const side = ref<Side>('b');
const learned = computed(() => values.value[learnIndex.value] ?? 1);
const round = ref(questions('identify', 'basic', values.value, count.value));
const questionIndex = ref(0);
const solved = ref(false);
const finished = ref(false);
const feedback = ref('');
const retry = ref(false);
const replayKey = ref(0);
const heading = ref<HTMLElement>();
const prompt = ref('');
const q = computed(() => round.value[questionIndex.value]!);
const completed = ref(0);
try { const saved = Number(localStorage.getItem('money-game-completions') || 0); completed.value = Number.isSafeInteger(saved) && saved >= 0 ? saved : 0; } catch { /* Practice also works with storage disabled. */ }
function say(text: string) {
  prompt.value = text;
  if (!voice.value || !voiceSupported) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW'; utterance.rate = .82;
  const preferred = window.speechSynthesis.getVoices().find(v => v.lang === 'zh-TW');
  if (preferred) utterance.voice = preferred;
  utterance.onerror = event => { if (!['interrupted', 'canceled'].includes(event.error)) speechError.value = '這個裝置暫時無法朗讀，可以繼續看文字練習。'; };
  window.speechSynthesis.speak(utterance);
}
function toggleVoice() { voice.value = !voice.value; speechError.value = ''; if (voice.value) say(prompt.value || '一起認識新台幣。'); else window.speechSynthesis?.cancel(); }
function markComplete() { completed.value++; try { localStorage.setItem('money-game-completions', String(completed.value)); } catch { /* Storage is optional. */ } }
async function focusHeading() {
  await nextTick(); heading.value?.focus({ preventScroll: true });
  const bounds = heading.value?.getBoundingClientRect();
  if (bounds && (bounds.top < 80 || bounds.bottom > window.innerHeight - 80))
    heading.value?.scrollIntoView({ block: 'start', behavior: 'instant' });
}
function reset() {
  window.speechSynthesis?.cancel(); learnIndex.value = 0; side.value = 'b'; questionIndex.value = 0; solved.value = false; finished.value = false; feedback.value = ''; retry.value = false; replayKey.value++;
  round.value = questions(mode.value, difficulty.value, values.value, count.value);
  announce();
}
function announce() {
  if (mode.value === 'learn') say(`${learned.value} 元。${MONEY[learned.value]!.hint}`);
  else if (mode.value === 'identify') say(`請找出 ${q.value.target} 元的${moneyKind(q.value.target)}。`);
  else if (mode.value === 'make') say(`請湊出 ${q.value.target} 元。`);
  else if (mode.value === 'change') say(`商品 ${q.value.price} 元，付出 ${q.value.paid} 元。應該找回多少元？`);
}
watch([mode, difficulty, include20, count], reset);
watch([learnIndex, side], () => { if (mode.value === 'learn') say(`${learned.value} 元，${side.value === 'a' ? '正面' : '背面'}是${side.value === 'a' ? MONEY[learned.value]!.front : MONEY[learned.value]!.back}。${MONEY[learned.value]!.hint}`); });
function pick(value: number) {
  if (solved.value) return;
  if (value === q.value.target) { solved.value = true; retry.value = false; feedback.value = `找到了！這是 ${value} 元${moneyKind(value)}。`; }
  else { retry.value = true; feedback.value = `這是 ${value} 元。再找找看 ${q.value.target} 元，慢慢來。`; }
  say(feedback.value);
}
function check(amount: number) {
  if (solved.value) return;
  if (amount === q.value.target) { solved.value = true; retry.value = false; feedback.value = `做得好！${mode.value === 'change' ? '應該找回' : '你湊出了'} ${amount} 元。`; }
  else { retry.value = true; feedback.value = amount < q.value.target ? `現在有 ${amount} 元，還差 ${q.value.target - amount} 元。可以再拿一些錢。` : `現在有 ${amount} 元，多了 ${amount - q.value.target} 元。可以拿回一些錢。`; }
  say(feedback.value);
}
function nextQuestion() {
  if (!solved.value) return;
  if (questionIndex.value + 1 === count.value) { finished.value = true; markComplete(); say('完成這一回合！把學會的本領帶到生活中吧。'); }
  else { questionIndex.value++; solved.value = false; feedback.value = ''; retry.value = false; announce(); }
  focusHeading();
}
function changeMode(next: Mode) { mode.value = next; focusHeading(); }
onBeforeUnmount(() => window.speechSynthesis?.cancel());
announce();
</script>
<template>
  <div class="money-app">
    <div class="money-page-heading"><div><a class="money-back" href="/game/">← 遊戲百寶箱</a><h1>特教班互動遊戲：認識新台幣</h1><p>從一個硬幣，到自己買一杯喜歡的飲料。</p></div><div class="money-heading-note">生活數學練習<span>不限時・可以再試・慢慢學</span></div></div>
    <div class="money-toolbar">
      <div class="difficulty" role="group" aria-label="學習難度"><button type="button" :aria-pressed="difficulty === 'basic'" @click="difficulty = 'basic'"><b>簡易模式</b><span>認識硬幣</span></button><button type="button" :aria-pressed="difficulty === 'advanced'" @click="difficulty = 'advanced'"><b>進階模式</b><span>硬幣＋紙鈔</span></button></div>
      <div class="money-toolbar-actions"><button class="money-secondary" type="button" :aria-pressed="voice" :disabled="!voiceSupported" @click="toggleVoice">{{ voiceSupported ? `朗讀：${voice ? '開啟' : '關閉'}` : '此裝置不支援朗讀' }}</button><button v-if="voice" class="money-text" type="button" @click="say(prompt)">再聽一次</button><button class="money-text" type="button" :aria-expanded="settingsOpen" aria-controls="money-settings" @click="settingsOpen = !settingsOpen">練習設定 {{ settingsOpen ? '−' : '＋' }}</button></div>
    </div>
    <p class="denomination-note">{{ difficulty === 'basic' ? '用硬幣一起練習' : '加入 100、500、1000 元紙鈔' }}<span>・切換難度或練習，會重新開始這一回合。</span></p>
    <div v-if="settingsOpen" id="money-settings" class="money-settings"><label>每回合題數<select v-model.number="count"><option :value="5">5 題</option><option :value="10">10 題</option></select></label><label class="checkbox-label"><input v-model="include20" type="checkbox" />加入較少見的 20 元硬幣</label><p>購物依點餐步驟進行，不受題數限制。沒有倒數或扣分。</p></div>
    <p v-if="speechError" role="status" class="money-feedback">{{ speechError }}</p>
    <nav class="money-mode-nav" aria-label="選擇練習"><button v-for="item in modes" :key="item.id" type="button" :aria-current="mode === item.id ? 'page' : undefined" @click="changeMode(item.id)"><b>{{ item.title }}</b><span>{{ item.hint }}</span></button></nav>
    <div class="money-stage">
      <TeaShop v-if="mode === 'shop'" :key="replayKey" :values="values" @dialogue="say" @complete="markComplete" />
      <section v-else-if="mode === 'learn'" class="money-lesson" aria-label="觀察錢幣">
        <div class="exercise-heading"><h2 ref="heading" tabindex="-1">一起看看，這是多少元？</h2><span>{{ learnIndex + 1 }} / {{ values.length }}</span></div>
        <div class="learn-layout"><div class="money-display"><MoneyImage :value="learned" :side="side" large /><div class="side-toggle" role="group" aria-label="觀察正反面"><button type="button" :aria-pressed="side === 'a'" @click="side = 'a'">正面</button><button type="button" :aria-pressed="side === 'b'" @click="side = 'b'">背面</button></div></div><div class="money-description"><h3>{{ learned }} <small>元</small><span>{{ MONEY[learned]?.name }}・{{ moneyKind(learned) }}</span></h3><p>{{ MONEY[learned]?.hint }}</p><p class="money-observe">看看{{ side === 'a' ? '正面' : '背面' }}的{{ side === 'a' ? MONEY[learned]?.front : MONEY[learned]?.back }}。</p><div class="answer-actions"><button class="money-secondary" type="button" :disabled="learnIndex === 0" @click="learnIndex--">上一個</button><button class="money-primary" type="button" @click="learnIndex = (learnIndex + 1) % values.length">{{ learnIndex === values.length - 1 ? '再看一遍' : '下一個錢幣' }} →</button></div></div></div>
        <div class="learn-money-list" aria-label="選擇要觀察的面額"><button v-for="(value, index) in values" :key="value" type="button" :aria-pressed="learnIndex === index" @click="learnIndex = index"><MoneyImage :value="value" /><b>{{ value }} 元</b></button></div>
      </section>
      <section v-else-if="finished" class="money-finish"><div class="finish-check" aria-hidden="true">✓</div><h2 ref="heading" tabindex="-1">完成這一回合！</h2><p>你完成了 {{ count }} 題{{ modes.find(item => item.id === mode)?.title }}。<br />每一次練習，都多學會一點生活的本領。</p><div class="answer-actions"><button class="money-primary" type="button" @click="reset(); focusHeading()">再練習一回合</button><button class="money-secondary" type="button" @click="changeMode('shop')">去手搖店試試</button></div></section>
      <section v-else class="money-exercise">
        <div class="exercise-heading"><h2 ref="heading" tabindex="-1">{{ mode === 'identify' ? '找出指定的錢幣' : mode === 'make' ? '一起湊出這個金額' : '算算應該找回多少錢' }}</h2><span>第 {{ questionIndex + 1 }} / {{ count }} 題</span></div>
        <template v-if="mode === 'identify'"><p class="exercise-prompt">請找出 <strong>{{ q.target }} 元</strong> 的{{ moneyKind(q.target) }}。</p><p class="exercise-help">看一看圖片上的數字，再點選錢幣。</p><div class="identify-options"><button v-for="value in q.options" :key="value" type="button" :disabled="solved" :aria-label="`${value} 元${moneyKind(value)}`" @click="pick(value)"><MoneyImage :value="value" large /><b>{{ value }} 元</b></button></div></template>
        <template v-else><p v-if="mode === 'make'" class="exercise-prompt">請拿出 <strong>{{ q.target }} 元</strong>。</p><div v-else class="change-problem"><div><span>商品價格</span><strong>{{ q.price }} <small>元</small></strong></div><span aria-hidden="true">←</span><div><span>付出的錢</span><MoneyImage :value="q.paid!" /><strong>{{ q.paid }} <small>元</small></strong></div><p>應該找回多少元？請用下面的錢幣湊出來。</p></div><MoneyWallet :key="`${replayKey}-${questionIndex}`" :values="values" :target="q.target" :locked="solved" @submit="check" /></template>
        <p v-if="feedback" class="money-feedback" :class="{ retry }" role="status">{{ feedback }}</p>
        <div class="exercise-footer"><span>{{ solved ? '學會了！準備好就繼續。' : '沒有時間限制，可以慢慢想。' }}</span><button class="money-primary" type="button" :disabled="!solved" @click="nextQuestion">{{ questionIndex + 1 === count ? '完成練習' : '下一題' }} →</button></div>
      </section>
    </div>
    <footer class="money-learning-note"><p>錢幣圖片來源：<a href="https://gallery.cbc.gov.tw/child/" target="_blank" rel="noopener noreferrer">中央銀行券幣數位博物館</a>。圖片供外觀辨識，顯示大小不代表實物比例，建議搭配實物練習。</p><p>已在這個瀏覽器完成 {{ completed }} 回練習。僅儲存完成次數；不用註冊。</p></footer>
  </div>
</template>
