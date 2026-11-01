<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { DRINKS, TOPPINGS, SWEETNESS, ICE, changeChoices, orderPrice, type ToppingId } from './money';
import DrinkCup from './DrinkCup.vue';
import MoneyWallet from './MoneyWallet.vue';
import MoneyImage from './MoneyImage.vue';
import { siteUrl } from '../../shared/site-path';
defineProps<{ values: number[] }>();
const emit = defineEmits<{ dialogue: [text: string]; complete: [] }>();
type Phase = 'welcome' | 'drink' | 'topping' | 'sweet' | 'ice' | 'confirm' | 'pay' | 'change' | 'done';
const phase = ref<Phase>('welcome');
const drinkId = ref<string>('');
const toppings = ref<ToppingId[]>([]);
const sweetness = ref('');
const ice = ref('');
const quantity = ref(1);
const paid = ref(0);
const paidPieces = ref<number[]>([]);
const choices = ref<number[]>([]);
const feedback = ref('');
const lastReply = ref('');
const history = ref<{ who: string; text: string }[]>([]);
const heading = ref<HTMLElement>();
const drink = computed(() => DRINKS.find(d => d.id === drinkId.value));
const total = computed(() => orderPrice(drinkId.value, toppings.value, quantity.value));
const change = computed(() => paid.value - total.value);
const toppingText = computed(() => TOPPINGS.filter(t => toppings.value.includes(t.id)).map(t => t.name).join('、') || '不加料');
const steps = ['選飲料', '選加料', '選甜度', '選冰量', '確認訂單', '付款取餐'];
const step = computed(() => ({ welcome: 0, drink: 0, topping: 1, sweet: 2, ice: 3, confirm: 4, pay: 5, change: 5, done: 5 })[phase.value]);
const dialogue = computed(() => {
  switch (phase.value) {
    case 'welcome': return '歡迎光臨百寶茶舖！我是小青。今天想喝什麼呢？我們一起慢慢選。';
    case 'drink': return '請問想喝哪一種飲料？每一杯的價錢都寫在下面。';
    case 'topping': return `好的，一杯${drink.value?.name}！想加什麼料呢？可以選一種或多種，也可以不加料。`;
    case 'sweet': return `${toppingText.value === '不加料' ? '好的，不加料。' : `幫你加${toppingText.value}。`}甜度要怎麼調呢？`;
    case 'ice': return `${sweetness.value}，沒問題！請問冰塊要多少？也可以選溫熱。`;
    case 'confirm': return `幫你確認一下：${drink.value?.name}，${toppingText.value}，${sweetness.value}、${ice.value}。${quantity.value} 杯，一共 ${total.value} 元。這樣對嗎？`;
    case 'pay': return `一共 ${total.value} 元。請從錢包拿錢，再跟我說「這是幾元，請收」。可以付剛好，也可以付多一點讓我找零。`;
    case 'change': return `收到 ${paid.value} 元，飲料是 ${total.value} 元。請幫忙確認：我應該找你多少元呢？`;
    case 'done': return `這是你的${drink.value?.name}！${change.value ? `找你 ${change.value} 元，請收好。` : '金額剛剛好。'}謝謝你，祝你有美好的一天！`;
  }
});
watch(dialogue, text => emit('dialogue', text), { immediate: true });
async function focusClerk() {
  await nextTick();
  heading.value?.focus({ preventScroll: true });
  const bounds = heading.value?.getBoundingClientRect();
  if (bounds && (bounds.top < 80 || bounds.bottom > window.innerHeight - 80))
    heading.value?.scrollIntoView({ block: 'start', behavior: 'instant' });
}
async function advance(reply: string, next: Phase) {
  history.value.push({ who: '店員', text: dialogue.value }, { who: '我', text: reply });
  lastReply.value = reply; feedback.value = ''; phase.value = next;
  await focusClerk();
}
function chooseDrink(id: string) { drinkId.value = id; advance(`我想喝${drink.value!.name}。`, 'topping'); }
function toggleTopping(id: ToppingId) { toppings.value = toppings.value.includes(id) ? toppings.value.filter(t => t !== id) : [...toppings.value, id]; }
function submitPayment(amount: number, pieces: number[]) {
  if (phase.value !== 'pay') return;
  if (amount < total.value) { feedback.value = `你拿了 ${amount} 元，還差 ${total.value - amount} 元。再拿一些錢，就可以付款了。`; emit('dialogue', feedback.value); return; }
  paid.value = amount;
  paidPieces.value = [...pieces];
  if (amount === total.value) { advance(`這是 ${amount} 元，請收。`, 'done'); emit('complete'); }
  else { choices.value = changeChoices(change.value); advance(`這是 ${amount} 元，請收。`, 'change'); }
}
function checkChange(value: number) {
  if (value !== change.value) { feedback.value = `我們一起算：付 ${paid.value} 元，減掉 ${total.value} 元。可以按「給我提示」再試試。`; emit('dialogue', feedback.value); return; }
  advance(`應該找我 ${value} 元，謝謝。`, 'done'); emit('complete');
}
async function restart() {
  phase.value = 'welcome'; drinkId.value = ''; toppings.value = []; sweetness.value = ''; ice.value = ''; quantity.value = 1;
  paid.value = 0; paidPieces.value = []; feedback.value = ''; lastReply.value = ''; history.value = [];
  await focusClerk();
}
</script>
<template>
  <section class="tea-shop" aria-label="百寶茶舖模擬購物">
    <div class="shop-progress" v-if="phase !== 'welcome' && phase !== 'done'" aria-label="點餐進度">
      <ol><li v-for="(label, index) in steps" :key="label" :class="{ current: step === index, passed: step > index }" :aria-current="step === index ? 'step' : undefined"><span>{{ index + 1 }}</span><b>{{ label }}</b></li></ol>
      <p>第 {{ step + 1 }} 步，共 6 步・{{ steps[step] }}</p>
    </div>
    <div class="shop-layout" :class="{ 'shop-welcome': phase === 'welcome' }">
      <aside class="shop-scene">
        <div class="shop-sign"><span class="sign-leaf" aria-hidden="true"></span>百寶茶舖 <small>一杯一杯，慢慢來。</small></div>
        <img class="shop-art" :src="siteUrl('/assets/money/tea-shop.webp')" width="1536" height="1024" alt="穿綠色圍裙的店員小青，在明亮的手搖店櫃檯等你點餐。" />
        <div v-if="drink" class="order-slip" aria-label="目前訂單">
          <DrinkCup :color="drink.color" :toppings="toppings" :ice="ice" />
          <div><h3>{{ drink.name }}</h3><p>{{ toppingText }}<br v-if="sweetness || ice" />{{ [sweetness, ice].filter(Boolean).join('・') }}</p><span>{{ quantity }} 杯</span></div>
          <strong>{{ total }}<small> 元</small></strong>
        </div>
        <p class="shop-price-note">遊戲價目為練習情境。</p>
      </aside>
      <div class="shop-conversation">
        <p v-if="lastReply" class="player-reply"><span>我說</span>{{ lastReply }}</p>
        <div class="clerk-dialogue">
          <h2 ref="heading" tabindex="-1"><span class="clerk-dot" aria-hidden="true"></span>店員小青</h2>
          <p aria-live="polite">{{ dialogue }}</p>
        </div>
        <div class="shop-answers">
          <template v-if="phase === 'welcome'"><p class="answer-caption">按下面的句子，和店員打招呼。</p><button class="money-primary shop-greeting" type="button" @click="advance('你好，我想買一杯飲料。', 'drink')">你好，我想買一杯飲料。</button><p class="welcome-note">選飲料 → 加料 → 甜度冰量 → 付款<br />不用趕時間，也可以請老師一起陪你選。</p></template>
          <template v-else-if="phase === 'drink'"><p class="answer-caption">我想喝……</p><div class="drink-menu"><button v-for="item in DRINKS" :key="item.id" type="button" @click="chooseDrink(item.id)"><DrinkCup :color="item.color" /><span><b>{{ item.name }}</b><small>{{ item.description }}</small></span><strong>{{ item.price }}<small> 元</small></strong></button></div></template>
          <template v-else-if="phase === 'topping'"><p class="answer-caption">點一下選加料，再點一下可取消。</p><div class="topping-menu"><button v-for="item in TOPPINGS" :key="item.id" type="button" :aria-pressed="toppings.includes(item.id)" @click="toggleTopping(item.id)"><span class="topping-mark" :class="item.id" :style="{ '--topping-color': item.color }" aria-hidden="true"><i></i><i></i><i></i></span><b>{{ item.name }}</b><span>＋{{ item.price }} 元</span><small>{{ toppings.includes(item.id) ? '已選擇' : '可選擇' }}</small></button></div><div class="answer-actions"><button class="money-secondary" type="button" @click="toppings = []; advance('不用加料，謝謝。', 'sweet')">不用加料，謝謝。</button><button class="money-primary" type="button" :disabled="!toppings.length" @click="advance(`我要加${toppingText}，謝謝。`, 'sweet')">選好了，幫我加料。</button></div></template>
          <template v-else-if="phase === 'sweet'"><p class="answer-caption">我想要……</p><div class="option-menu"><button v-for="(value, index) in SWEETNESS" :key="value" type="button" @click="sweetness = value; advance(`我要${value}，謝謝。`, 'ice')"><span class="sugar-meter" aria-hidden="true"><i v-for="n in 5" :key="n" :class="{ filled: n <= 5 - index && index !== 4 }"></i></span><b>{{ value }}</b><small>{{ ['甜味最多', '少一點甜', '一半甜', '淡淡的甜', '不另外加糖'][index] }}</small></button></div></template>
          <template v-else-if="phase === 'ice'"><p class="answer-caption">我想要……</p><div class="option-menu"><button v-for="(value, index) in ICE" :key="value" type="button" @click="ice = value; advance(`我要${value}，謝謝。`, 'confirm')"><svg class="ice-symbol" :class="{ warm: index === 4 }" width="48" height="26" viewBox="0 0 48 26" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><template v-if="index < 3"><rect v-for="n in 3 - index" :key="n" :x="4 + (n - 1) * 14" y="6" width="10" height="12" rx="2" /></template><circle v-else-if="index === 3" cx="24" cy="12" r="8" /><path v-else d="M14 22c-6-5 6-10 0-18m10 18c-6-5 6-10 0-18m10 18c-6-5 6-10 0-18" stroke-linecap="round" /></svg><b>{{ value }}</b><small>{{ ['冰塊最多', '少一點冰', '一點點冰', '不放冰塊', '溫溫的'][index] }}</small></button></div></template>
          <template v-else-if="phase === 'confirm'"><div class="confirm-order"><p><span>每杯 {{ total / quantity }} 元</span><label for="tea-quantity">杯數<select id="tea-quantity" v-model.number="quantity"><option :value="1">1 杯</option><option :value="2">2 杯</option><option :value="3">3 杯</option></select></label></p><div><span>總共要付</span><strong>{{ total }} <small>元</small></strong></div></div><div class="answer-actions"><button class="money-secondary" type="button" @click="restart(); advance('我想重新選飲料。', 'drink')">我想重新選。</button><button class="money-primary" type="button" @click="advance('對，沒錯！我要付款。', 'pay')">對，沒錯！我要付款。</button></div></template>
          <template v-else-if="phase === 'pay'"><MoneyWallet :values="values" :target="total" payment @submit="submitPayment" /><p v-if="feedback" class="money-feedback retry" role="status">{{ feedback }}</p><button class="money-text" type="button" @click="advance('我想再確認訂單。', 'confirm')">再看一次訂單</button></template>
          <template v-else-if="phase === 'change'"><div class="received-money"><span>你付出的錢</span><div><MoneyImage v-for="(value, index) in paidPieces" :key="index" :value="value" /></div><b>共 {{ paid }} 元</b></div><div class="change-equation"><span>付出 <b>{{ paid }} 元</b></span><span aria-hidden="true">−</span><span>花費 <b>{{ total }} 元</b></span><span aria-hidden="true">＝</span><span>找回 <b>？元</b></span></div><p class="answer-caption">我應該拿回……</p><div class="change-choices"><button v-for="value in choices" :key="value" class="money-secondary" type="button" @click="checkChange(value)">{{ value }} 元</button></div><button class="money-text" type="button" @click="feedback = `${paid} − ${total} ＝ ${change}。應該找回 ${change} 元。`; emit('dialogue', feedback)">給我提示</button><p v-if="feedback" class="money-feedback" role="status">{{ feedback }}</p></template>
          <template v-else-if="phase === 'done'"><div class="finished-receipt"><h3>點餐完成，做得好！</h3><div class="received-money"><span>你付出的錢</span><div><MoneyImage v-for="(value, index) in paidPieces" :key="index" :value="value" /></div><b>共 {{ paid }} 元</b></div><dl><div><dt>飲料</dt><dd>{{ drink?.name }} × {{ quantity }}</dd></div><div><dt>口味</dt><dd>{{ toppingText }}・{{ sweetness }}・{{ ice }}</dd></div><div><dt>總價</dt><dd>{{ total }} 元</dd></div><div><dt>付出</dt><dd>{{ paid }} 元</dd></div><div><dt>找回</dt><dd>{{ change }} 元</dd></div></dl><p>會點餐，也會確認價錢和找零了。</p></div><button class="money-primary" type="button" @click="restart">謝謝，再見！再練習一次</button></template>
        </div>
        <details v-if="history.length" class="conversation-history"><summary>看看剛才的對話</summary><ol><li v-for="(line, index) in history" :key="index"><b>{{ line.who }}</b><span>{{ line.text }}</span></li></ol></details>
      </div>
    </div>
  </section>
</template>
