import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { MONEY, DRINKS, TOPPINGS, denominations, questions, orderPrice, moneyHint, changeChoices, sumMoney } from '../src/features/money/money.ts';

for (const difficulty of ['basic', 'advanced']) {
  for (const include20 of [false, true]) {
    const values = denominations(difficulty, include20);
    assert.equal(values.includes(20), include20);
    assert.equal(values.includes(1000), difficulty === 'advanced');
    for (let attempt = 0; attempt < 30; attempt++) {
      for (const mode of ['identify', 'make', 'change']) {
        const round = questions(mode, difficulty, values, 10);
        assert.equal(round.length, 10);
        if (difficulty === 'advanced' && mode === 'identify') {
          assert.deepEqual(round.slice(0, 3).map(q => q.target).sort((a, b) => a - b), [100, 500, 1000]);
          assert.ok(round.some(q => q.target < 100), 'Advanced recognition also practices coins');
        }
        for (const q of round) {
          assert.ok(q.target > 0);
          if (mode === 'identify') {
            assert.equal(q.options.filter(v => v === q.target).length, 1);
            assert.equal(new Set(q.options).size, q.options.length);
            assert.ok(q.options.every(v => values.includes(v)));
          } else {
            if (mode === 'change') assert.equal(q.paid - q.price, q.target);
            // Every exercise can be solved with the available money and within the tray limit.
            let rest = q.target, pieces = 0;
            for (const value of [...values].reverse()) { pieces += Math.floor(rest / value); rest %= value; }
            assert.equal(rest, 0); assert.ok(pieces <= 100);
            assert.ok(moneyHint(q.target, values).length > 0);
          }
        }
      }
    }
  }
}
assert.equal(orderPrice('milk', ['pearl', 'jelly', 'taro'], 1), 80);
assert.equal(orderPrice('milk', ['pearl', 'jelly', 'taro'], 3), 240);
assert.equal(orderPrice('black', [], 1), 30);
assert.equal(sumMoney([50, 10, 5]), 65);
assert.equal(sumMoney([1000, 500, 100]), 1600);
for (const drink of DRINKS) {
  for (let mask = 0; mask < 2 ** TOPPINGS.length; mask++) {
    const toppings = TOPPINGS.filter((_, i) => mask & (1 << i));
    for (const quantity of [1, 2, 3]) {
      const price = orderPrice(drink.id, toppings.map(t => t.id), quantity);
      assert.ok(Number.isInteger(price) && price > 0 && price <= 1000);
      assert.equal(price % 5, 0, 'Drink orders remain practical for coin exercises');
      for (const payment of [50, 100, 500, 1000].filter(v => v >= price)) {
        const choices = changeChoices(payment - price);
        assert.equal(choices.filter(v => v === payment - price).length, 1);
        assert.equal(new Set(choices).size, 3);
        assert.ok(choices.every(v => v >= 0 && Number.isInteger(v)));
      }
    }
  }
}
for (const value of Object.keys(MONEY)) {
  for (const side of ['a', 'b']) assert.ok(existsSync(`assets/money/${value}-${side}.png`));
}
assert.ok(existsSync('assets/money/tea-shop.webp'));
console.log('Money: denomination coverage, 3,600 exercises, all 288 drink orders, payment/change choices and 17 assets verified.');
