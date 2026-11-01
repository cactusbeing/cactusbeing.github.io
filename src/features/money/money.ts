export type Difficulty = 'basic' | 'advanced';
export type Mode = 'learn' | 'identify' | 'make' | 'shop' | 'change';
export type Side = 'a' | 'b';
export const MONEY: Record<number, { name: string; front: string; back: string; hint: string }> = {
  1: { name: '壹圓', front: '蔣中正側面肖像', back: '壹圓字樣與數字 1', hint: '銅色的小硬幣。五個 1 元，可以換成一個 5 元。' },
  5: { name: '伍圓', front: '蔣中正側面肖像', back: '伍圓字樣與數字 5', hint: '銀白色的硬幣。兩個 5 元，合起來是 10 元。' },
  10: { name: '拾圓', front: '孫中山肖像', back: '數字 10 與圓點', hint: '銀白色，比 5 元大。也有蔣中正肖像的 10 元版本，都可以使用。' },
  20: { name: '貳拾圓', front: '莫那・魯道肖像', back: '拼板舟與數字 20', hint: '外圈金色、內圈銀色，比較少見。兩個 10 元，合起來是 20 元。' },
  50: { name: '伍拾圓', front: '孫中山肖像', back: '數字 50 與稻穗', hint: '金色的硬幣。五個 10 元，合起來是 50 元。' },
  100: { name: '壹佰圓', front: '孫中山肖像', back: '中山樓與梅花', hint: '紅色的紙鈔。兩個 50 元，合起來是一張 100 元。' },
  500: { name: '伍佰圓', front: '打棒球的小朋友', back: '梅花鹿與大霸尖山', hint: '深咖啡色的紙鈔。五張 100 元，合起來是一張 500 元。' },
  1000: { name: '壹仟圓', front: '學習中的小朋友', back: '帝雉與玉山', hint: '藍色的紙鈔。兩張 500 元，合起來是一張 1000 元。' },
};
export function denominations(difficulty: Difficulty, include20 = false): number[] {
  return [1, 5, 10, ...(include20 ? [20] : []), 50, ...(difficulty === 'advanced' ? [100, 500, 1000] : [])];
}
export function moneyImage(value: number, side: Side = 'b'): string {
  return `/assets/money/${value}-${side}.png`;
}
export function moneyKind(value: number): string { return value >= 100 ? '紙鈔' : '硬幣'; }
export function sumMoney(values: number[]): number { return values.reduce((sum, value) => sum + value, 0); }
export function moneyHint(target: number, values: number[]): string {
  let remaining = target;
  return [...values].sort((a, b) => b - a).flatMap(value => {
    const count = Math.floor(remaining / value);
    remaining %= value;
    return count ? [`${value} 元 × ${count} ${value >= 100 ? '張' : '個'}`] : [];
  }).join('、');
}
export function shuffle<T>(values: T[]): T[] {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
export interface Question { target: number; paid?: number; price?: number; options?: number[] }
export function questions(mode: Mode, difficulty: Difficulty, values: number[], count: number): Question[] {
  const identify = difficulty === 'advanced'
    ? [...shuffle([100, 500, 1000]), ...shuffle(values.filter(value => value < 100))]
    : shuffle(values);
  return Array.from({ length: count }, (_, i) => {
    if (mode === 'identify') {
      const target = identify[i % identify.length]!;
      const options = shuffle([target, ...shuffle(values.filter(v => v !== target)).slice(0, 3)]);
      return { target, options };
    }
    if (mode === 'change') {
      const prices = difficulty === 'advanced' ? [65, 130, 560, 275, 85] : [15, 28, 35, 42, 17];
      const price = prices[i % prices.length]!;
      const paid = difficulty === 'advanced' ? [100, 500, 1000, 500, 100][i % 5]! : 50;
      return { target: paid - price, paid, price };
    }
    const targets = difficulty === 'advanced' ? [100, 500, 1000, 165, 650, 120, 550, 1050, 735, 280] : [15, 26, 35, 42, 60, 18, 55, 67, 83, 95];
    return { target: targets[i % targets.length]! };
  });
}
export const DRINKS = [
  { id: 'black', name: '古早味紅茶', price: 30, color: '#b66a28', description: '茶香清爽' },
  { id: 'green', name: '茉香綠茶', price: 30, color: '#b2be64', description: '淡淡茉莉香' },
  { id: 'oolong', name: '四季青茶', price: 35, color: '#c49a41', description: '溫和茶香' },
  { id: 'milk', name: '經典奶茶', price: 45, color: '#d1a174', description: '茶香加奶香' },
  { id: 'fresh', name: '紅茶鮮奶', price: 60, color: '#dfb78d', description: '紅茶搭配鮮奶' },
  { id: 'lemon', name: '檸檬綠茶', price: 50, color: '#c0cc71', description: '酸甜檸檬香' },
] as const;
export const TOPPINGS = [
  { id: 'pearl', name: '珍珠', price: 10, color: '#46362e' },
  { id: 'jelly', name: '粉粿', price: 10, color: '#e0b944' },
  { id: 'taro', name: '芋圓', price: 15, color: '#b79bc0' },
  { id: 'grass', name: '仙草', price: 10, color: '#4b443f' },
] as const;
export const SWEETNESS = ['正常糖', '少糖', '半糖', '微糖', '無糖'];
export const ICE = ['正常冰', '少冰', '微冰', '去冰', '溫熱'];
export type ToppingId = typeof TOPPINGS[number]['id'];
export function orderPrice(drinkId: string, toppings: ToppingId[], quantity = 1): number {
  return ((DRINKS.find(drink => drink.id === drinkId)?.price ?? 0)
    + TOPPINGS.filter(t => toppings.includes(t.id)).reduce((sum, t) => sum + t.price, 0)) * quantity;
}
export function changeChoices(change: number): number[] {
  return shuffle([change, change + 10, change >= 5 ? change - 5 : change + 5]);
}
