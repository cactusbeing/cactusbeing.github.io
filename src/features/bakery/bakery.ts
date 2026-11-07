export const FLAVORS = ['chocolate', 'matcha', 'strawberry'] as const;
export type Flavor = typeof FLAVORS[number];
export type Counts = Record<Flavor, number>;
export type Stage = 1 | 2 | 3;
export type OrderStyle = 'shape' | 'flavor' | 'mixed';
export type Chapter = 1 | 2 | 3 | 4 | 5 | 6;
export type Kind = 'pack' | 'subtract' | 'multiply' | 'divide' | 'bake' | 'restock';
export const COOKIES: Record<Flavor, { name: string; shape: string; color: string }> = {
  chocolate: { name: '巧克力', shape: '正方形', color: '#875437' },
  matcha: { name: '抹茶', shape: '圓形', color: '#7a8e49' },
  strawberry: { name: '草莓', shape: '三角形', color: '#ce7e85' },
};
export const counts = (chocolate = 0, matcha = 0, strawberry = 0): Counts => ({ chocolate, matcha, strawberry });
export const total = (value: Counts): number => FLAVORS.reduce((sum, flavor) => sum + value[flavor], 0);
export const countBox = (box: Flavor[]): Counts => box.reduce((result, flavor) => { result[flavor]++; return result; }, counts());
export const scale = (value: Counts, amount: number): Counts => ({ chocolate: value.chocolate * amount, matcha: value.matcha * amount, strawberry: value.strawberry * amount });
export const describe = (value: Counts): string => FLAVORS.filter(flavor => value[flavor]).map(flavor => `${COOKIES[flavor].name} ${value[flavor]} 片`).join('、');
export const RECIPES = [
  { id: 'mixed', name: '綜合餅乾包', recipe: counts(1, 1, 1) },
  { id: 'chocolate', name: '巧克力餅乾包', recipe: counts(3) },
  { id: 'matcha', name: '抹茶餅乾包', recipe: counts(0, 3) },
  { id: 'strawberry', name: '草莓餅乾包', recipe: counts(0, 0, 3) },
  { id: 'duo', name: '雙拼餅乾包', recipe: counts(2, 2) },
  { id: 'party', name: '派對分享包', recipe: counts(3, 3, 3) },
  { id: 'surprise', name: '驚喜餅乾包', recipe: counts() },
] as const;
export type RecipeId = typeof RECIPES[number]['id'];
export const CHAPTERS: { id: Chapter; name: string; short: string; hint: string }[] = [
  { id: 1, name: '餅乾學徒', short: '形狀・數量', hint: '看訂單，挑對形狀，一片片裝進盒子。' },
  { id: 2, name: '綜合餅乾師', short: '合起來・加法', hint: '把不同口味裝在一起，數數一共有幾片。' },
  { id: 3, name: '補貨小幫手', short: '還差・減法', hint: '看看烤盤已有幾片，自己烤出缺少的數量。' },
  { id: 4, name: '團購達人', short: '多盒・乘法', hint: '先完成一盒，再用相同配方裝好每一盒。' },
  { id: 5, name: '公平分裝師', short: '平均・除法', hint: '把烤盤上的餅乾全部分完，每盒都要一樣多。' },
  { id: 6, name: '魔法烘焙大師', short: '烘烤・混合', hint: '先烤出缺少的餅乾，再依訂單完成禮盒。' },
];
export interface Task {
  kind: Kind; title: string; customer: string; request: string;
  recipe: Counts; boxCount: number; stock: Counts | null; requestMode?: 'shape' | 'flavor';
}
export function createTask(chapter: Chapter, stage: Stage, recipeId: RecipeId | 'random' = 'random', rng = Math.random, orderStyle: OrderStyle = 'mixed', previousRecipe?: Counts): Task {
  const pick = (max: number) => Math.min(max - 1, Math.floor(rng() * max));
  const flavor = FLAVORS[pick(stage === 1 ? 2 : 3)];
  const customer = ['小兔朵朵', '小熊米米', '小貓可可'][pick(3)];
  let kind: Kind = 'pack';
  const selectedRecipe = RECIPES.find(item => item.id === recipeId) ?? RECIPES[0];
  let title: string = selectedRecipe.name;
  let recipe: Counts = { ...selectedRecipe.recipe };
  const requestMode = chapter === 1 && (orderStyle === 'shape' || (orderStyle === 'mixed' && pick(2) === 0)) ? 'shape' : 'flavor';
  let boxCount = 1;
  let stock: Counts | null = null;
  let request = '';
  if (chapter === 1) {
    if (recipeId === 'random') {
      title = '形狀與數量訂單'; recipe = counts();
      const available = FLAVORS.slice(0, stage === 1 ? 2 : 3);
      const maximum = stage === 3 ? 5 : stage === 1 ? 4 : 3;
      for (const item of available) if (pick(3) > 0) recipe[item] = 1 + pick(maximum);
      if (total(recipe) === 0) recipe[available[pick(available.length)]] = 1 + pick(maximum);
      if (previousRecipe && FLAVORS.every(item => recipe[item] === previousRecipe[item])) {
        const item = available.find(item => recipe[item] > 0)!;
        recipe[item] = recipe[item] === maximum ? 1 : recipe[item] + 1;
      }
    }
    if (stage === 1 && recipe.strawberry) recipe = counts(recipe.chocolate, recipe.matcha || (recipe.chocolate ? 0 : 3));
    if (recipeId === 'surprise') recipe = counts(1 + pick(3), 1 + pick(3), stage === 1 ? 0 : 1 + pick(3));
    if (stage === 1 && recipeId === 'mixed') title = '雙味綜合餅乾包';
    request = `我要${FLAVORS.filter(item => recipe[item] > 0).map(item => `${recipe[item]} 片${COOKIES[item][requestMode === 'shape' ? 'shape' : 'name']}餅乾`).join('、')}，謝謝你！`;
  } else if (chapter === 2) {
    title = '客製綜合餅乾';
    recipe = counts(1 + pick(stage === 3 ? 5 : 3), 1 + pick(3), stage === 1 ? 0 : 1 + pick(3));
  } else if (chapter === 3) {
    kind = 'restock'; title = '補貨小幫手'; recipe = counts(); stock = counts();
    stock[flavor] = (stage === 1 ? 1 : stage === 2 ? 2 : 4) + pick(stage === 3 ? 7 : 4);
    recipe[flavor] = stock[flavor] + 2 + pick(stage === 3 ? 7 : 4);
    request = `訂單需要 ${total(recipe)} 片${COOKIES[flavor].name}餅乾，烤盤已經有 ${total(stock)} 片。還差幾片？請烤好補齊。`;
  } else if (chapter === 4) {
    kind = 'multiply'; title = '大家的團購點心'; boxCount = stage === 1 ? 2 : 3 + pick(2);
    recipe = counts(); recipe[flavor] = stage === 1 ? 2 + pick(2) : 3;
  } else if (chapter === 5) {
    kind = 'divide'; title = '一人一盒，公平分享'; boxCount = stage === 1 ? 2 : 3 + pick(2);
    recipe = counts(); recipe[flavor] = 2 + pick(stage === 3 ? 4 : 2); stock = scale(recipe, boxCount);
    request = `這裡有 ${total(stock)} 片${COOKIES[flavor].name}餅乾，請全部平均裝進 ${boxCount} 個禮盒，每盒都要一樣多喔！`;
  } else {
    kind = 'bake'; title = '魔法烘焙訂單'; boxCount = stage === 1 ? 1 : 2;
    recipe = counts(2, 1, stage === 1 ? 0 : 1); stock = counts(1, 1, stage === 1 ? 0 : 1);
    request = `我要 ${boxCount} 盒餅乾，每盒要${describe(recipe)}。烤盤上的餅乾不夠，請先烤出缺少的餅乾，再幫我裝盒。`;
  }
  if (!request) request = `我要 ${boxCount} 盒${title}，${boxCount > 1 ? '每盒' : '裡面'}要${describe(recipe)}，謝謝你！`;
  return { kind, title, customer, request, recipe, boxCount, stock, requestMode };
}
export function createDaily(stage: Stage, rng = Math.random): Task[] {
  if (stage === 1) return [createTask(1, stage, 'surprise', rng), createTask(3, stage, 'mixed', rng)];
  if (stage === 2) return [createTask(2, stage, 'mixed', rng), createTask(4, stage, 'mixed', rng), createTask(5, stage, 'mixed', rng)];
  const mixed = createTask(1, stage, 'mixed', rng);
  const chocolate = createTask(1, stage, 'chocolate', rng);
  const divide = createTask(5, stage, 'mixed', rng);
  return [
    { ...mixed, requestMode: 'flavor', customer: '小兔朵朵', title: '生日派對・綜合禮盒', kind: 'multiply', boxCount: 2, request: '生日派對需要 2 盒綜合餅乾，每盒巧克力、抹茶、草莓各 1 片。' },
    { ...chocolate, requestMode: 'flavor', customer: '小兔朵朵', title: '生日派對・巧克力禮盒', kind: 'multiply', boxCount: 3, request: '接著請幫我做 3 盒巧克力餅乾，每盒要 3 片正方形餅乾。' },
    { ...divide, customer: '小兔朵朵', title: '生日派對・草莓分享袋', recipe: counts(0, 0, 3), stock: counts(0, 0, 6), boxCount: 2, request: '最後把 6 片草莓餅乾，平均分進 2 個小袋子。每袋都要一樣多喔！' },
  ];
}
export function isComplete(task: Task, boxes: Flavor[][], stock: Counts | null): boolean {
  if (task.kind === 'restock') return stock !== null && FLAVORS.every(flavor => stock[flavor] === task.recipe[flavor]);
  if (boxes.length !== task.boxCount || boxes.some(box => FLAVORS.some(flavor => countBox(box)[flavor] !== task.recipe[flavor]))) return false;
  return task.kind !== 'divide' || (stock !== null && total(stock) === 0);
}
export function equation(task: Task): string {
  const size = total(task.recipe);
  if (task.kind === 'restock') return `${size} − ${total(task.stock!)} = ${size - total(task.stock!)}`;
  if (task.kind === 'subtract') return `${total(task.stock!)} − ${size} = ${total(task.stock!) - size}`;
  if (task.kind === 'divide') return `${size * task.boxCount} ÷ ${task.boxCount} = ${size}`;
  if (task.kind === 'multiply' || task.kind === 'bake') return `${size} × ${task.boxCount} = ${size * task.boxCount}`;
  return `${FLAVORS.filter(flavor => task.recipe[flavor]).map(flavor => task.recipe[flavor]).join(' + ')} = ${size}`;
}
