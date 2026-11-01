<script setup lang="ts">
import { computed, ref } from 'vue';
import MoneyImage from './MoneyImage.vue';
import { moneyHint, sumMoney } from './money';
const props = withDefaults(defineProps<{ values: number[]; target: number; locked?: boolean; payment?: boolean }>(), { locked: false, payment: false });
const emit = defineEmits<{ submit: [amount: number, pieces: number[]] }>();
const selected = ref<number[]>([]);
const total = computed(() => sumMoney(selected.value));
const hint = ref('');
function add(value: number) {
  if (props.locked) return;
  if (selected.value.length >= 100) { hint.value = '付款區放滿了，可以先拿回一些，再換成較大的面額。'; return; }
  if (total.value + value > 10000) { hint.value = '錢包最多放 10000 元。可以先拿回一些，再試一次。'; return; }
  selected.value.push(value); hint.value = '';
}
</script>
<template>
  <div class="money-wallet">
    <div class="payment-tray" aria-label="已選的金額">
      <div class="selected-money">
        <span v-if="!selected.length" class="wallet-empty">點選下方錢幣，放進這裡</span>
        <button v-for="(value, index) in selected" :key="index" type="button" class="paid-money-button" :disabled="locked" :aria-label="`拿回第 ${index + 1} ${value >= 100 ? '張' : '個'}錢幣：${value} 元`" @click="selected.splice(index, 1)"><MoneyImage :value="value" /><span>{{ value }} 元</span></button>
      </div>
      <div class="wallet-total" role="status" aria-live="polite"><span>目前金額</span><strong>{{ total }} <small>元</small></strong></div>
    </div>
    <p v-if="selected.length && !locked" class="paid-money-hint">拿出的錢會放在上面，點一下圖片就能拿回。</p>
    <p class="wallet-caption">我的練習錢包 <span>・點一下，拿一個／一張</span></p>
    <div class="wallet-money">
      <button v-for="value in values" :key="value" type="button" class="wallet-money-button" :class="{ 'is-note': value >= 100 }" :disabled="locked" :aria-label="`加入 ${value} 元`" @click="add(value)"><MoneyImage :value="value" /><span>＋{{ value }} 元</span></button>
    </div>
    <div class="wallet-controls">
      <div class="wallet-tools">
        <button class="money-secondary" type="button" :disabled="locked || !selected.length" @click="selected.pop()">拿回上一個</button>
        <button class="money-text" type="button" :disabled="locked || !selected.length" @click="selected = []; hint = ''">重新拿錢</button>
        <button class="money-text" type="button" :disabled="locked" @click="hint = `可以試試：${moneyHint(target, values)}。其他組合也可以。`">給我提示</button>
      </div>
      <button type="button" class="money-primary" :disabled="locked || !selected.length" @click="emit('submit', total, [...selected])">{{ payment ? `這是 ${total} 元，請收。` : '確認金額' }}</button>
    </div>
    <p v-if="hint" class="money-feedback" role="status">{{ hint }}</p>
  </div>
</template>
