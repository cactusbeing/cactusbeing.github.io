import assert from 'node:assert/strict';
import { CHAPTERS, FLAVORS, RECIPES, countBox, counts, createDaily, createTask, equation, isComplete, scale, total } from '../src/features/bakery/bakery.ts';
let checked = 0;
for (const stage of [1, 2, 3]) {
  for (const { id } of CHAPTERS) {
    for (const recipe of RECIPES) {
      for (let seed = 0; seed < 30; seed++) {
        let cursor = seed + 1;
        const rng = () => ((cursor = (cursor * 1664525 + 1013904223) >>> 0) / 4294967296);
        const task = createTask(id, stage, recipe.id, rng);
        if (task.kind === 'restock') {
          const target = { ...task.recipe };
          assert.equal(isComplete(task, [], task.stock), false, 'Existing stock needs actual restocking');
          assert.equal(isComplete(task, [], target), true, 'Correct final tray succeeds');
          const flavor = FLAVORS.find(item => target[item] > 0);
          assert.equal(isComplete(task, [], { ...target, [flavor]: target[flavor] - 1 }), false, 'Underbaking fails');
          assert.equal(isComplete(task, [], { ...target, [flavor]: target[flavor] + 1 }), false, 'Overbaking fails');
          const other = FLAVORS.find(item => item !== flavor);
          assert.equal(isComplete(task, [], { ...target, [other]: 1 }), false, 'Wrong-flavor restock fails');
          assert.ok(total(target) - total(task.stock) > 0);
          if (stage === 1) { assert.equal(target.strawberry, 0); assert.ok(total(target) <= 10); }
          assert.equal(equation(task), `${total(target)} − ${total(task.stock)} = ${total(target) - total(task.stock)}`);
          checked++; continue;
        }
        const oneBox = FLAVORS.flatMap(flavor => Array(task.recipe[flavor]).fill(flavor));
        const boxes = Array.from({ length: task.boxCount }, () => [...oneBox]);
        const empty = Array.from({ length: task.boxCount }, () => []);
        const remaining = task.stock ? { ...task.stock } : null;
        if (remaining) for (const flavor of FLAVORS) remaining[flavor] = Math.max(0, remaining[flavor] - task.recipe[flavor] * task.boxCount);
        assert.ok(total(task.recipe) > 0);
        assert.ok(task.boxCount > 0 && task.boxCount <= 4);
        assert.equal(isComplete(task, empty, task.stock), false, 'Empty boxes cannot be delivered');
        assert.equal(isComplete(task, boxes, remaining), true, 'Exact recipes can be delivered');
        assert.equal(isComplete(task, boxes.slice(1), remaining), false, 'All ordered boxes are required');
        assert.equal(isComplete(task, boxes.map((box, index) => index ? box : box.slice(1)), remaining), false, 'Missing cookies fail');
        const incorrect = boxes.map(box => [...box]);
        const original = incorrect[0][0];
        incorrect[0][0] = FLAVORS.find(flavor => flavor !== original);
        assert.equal(isComplete(task, incorrect, remaining), false, 'Matching total with wrong shape fails');
        if (stage === 1) {
          assert.equal(task.recipe.strawberry, 0, 'Stage one never requires triangles');
          assert.ok(total(scale(task.recipe, task.boxCount)) <= 10, 'Stage one remains within ten');
        }
        if (task.kind === 'divide') {
          assert.equal(total(task.stock), total(task.recipe) * task.boxCount);
          const unequal = boxes.map(box => [...box]);
          unequal[0].push(unequal[1].pop());
          assert.equal(isComplete(task, unequal, counts()), false, 'All distributed but unequal fails');
          assert.equal(isComplete(task, boxes, counts(1)), false, 'Undistributed cookies fail');
        }
        if (task.kind === 'subtract') assert.equal(total(task.stock) - total(task.recipe), total(remaining));
        if (task.kind === 'bake') {
          const required = scale(task.recipe, task.boxCount);
          assert.ok(FLAVORS.some(flavor => required[flavor] > task.stock[flavor]), 'Master orders require actual baking');
          assert.ok(FLAVORS.every(flavor => task.stock[flavor] <= required[flavor]));
        }
        assert.match(equation(task), / = \d+$/);
        checked++;
      }
    }
  }
  for (let i = 0; i < 30; i++) {
    const daily = createDaily(stage);
    assert.equal(daily.length, stage === 1 ? 2 : 3);
    for (const task of daily) {
      assert.ok(task.request.trim());
      const boxes = Array.from({ length: task.boxCount }, () => FLAVORS.flatMap(flavor => Array(task.recipe[flavor]).fill(flavor)));
      const remaining = task.kind === 'restock' ? { ...task.recipe } : task.stock ? counts() : null;
      if (task.kind === 'subtract') FLAVORS.forEach(flavor => remaining[flavor] = task.stock[flavor] - task.recipe[flavor]);
      assert.equal(isComplete(task, boxes, remaining), true);
      if (stage === 1) assert.equal(task.recipe.strawberry, 0);
    }
  }
}
assert.deepEqual(countBox(['matcha', 'chocolate', 'matcha']), counts(1, 2, 0));
const birthday = createDaily(3);
assert.deepEqual(birthday.map(task => [task.boxCount, total(task.recipe)]), [[2, 3], [3, 3], [2, 3]]);
assert.deepEqual(birthday[2].stock, counts(0, 0, 6));
console.log(`Bakery: ${checked} generated orders across six chapters, three stages and seven recipes verified; wrong-shape, unequal division, stock and birthday-order checks passed.`);

// Apprentice orders vary quantities and can name only geometry, without flavor clues.
for (const stage of [1, 2, 3]) {
  for (const style of ['shape', 'flavor', 'mixed']) {
    let previous;
    let randomState = stage * 1000 + ['shape', 'flavor', 'mixed'].indexOf(style);
    const random = () => ((randomState = (randomState * 1664525 + 1013904223) >>> 0) / 4294967296);
    const seen = new Set();
    for (let i = 0; i < 100; i++) {
      const task = createTask(1, stage, 'random', random, style, previous);
      const signature = JSON.stringify(task.recipe);
      if (previous) assert.notDeepEqual(task.recipe, previous, 'Consecutive random apprentice orders change quantities/shapes');
      seen.add(signature);
      assert.ok(total(task.recipe) >= 1);
      if (stage < 3) assert.ok(total(task.recipe) <= 10);
      if (stage === 1) assert.equal(task.recipe.strawberry, 0);
      if (style === 'shape') {
        assert.equal(task.requestMode, 'shape');
        assert.doesNotMatch(task.request, /巧克力|抹茶|草莓/);
        assert.match(task.request, /正方形|圓形|三角形/);
      }
      if (style === 'flavor') {
        assert.equal(task.requestMode, 'flavor');
        assert.doesNotMatch(task.request, /正方形|圓形|三角形/);
        assert.match(task.request, /巧克力|抹茶|草莓/);
      }
      previous = task.recipe;
    }
    assert.ok(seen.size > 5, 'Random practice has varied order content');
  }
}
// Even a constant random source cannot repeat the previous order's quantities.
const constantOrder = createTask(1, 1, 'random', () => 0, 'shape');
assert.notDeepEqual(createTask(1, 1, 'random', () => 0, 'shape', constantOrder.recipe).recipe, constantOrder.recipe);
console.log('Apprentice: 900 varied orders, shape-only / flavor-only / mixed prompts and consecutive-order diversity verified.');

// Dragging moves real finite inventory between arbitrary boxes without changing shape totals.
const { createPackingStock, transferCookie } = await import('../src/features/bakery/packing.ts');
const inventory = state => {
  const result = { ...state.stock };
  state.boxes.flat().forEach(flavor => result[flavor]++);
  return result;
};
const sourceTask = createTask(4, 3, 'mixed', () => .2);
const initialState = { stock: createPackingStock(sourceTask), boxes: Array.from({ length: sourceTask.boxCount }, () => []) };
const frozenSource = JSON.stringify(initialState);
const sourceFlavor = FLAVORS.find(flavor => initialState.stock[flavor] > 0);
const placed = transferCookie(initialState, { kind: 'tray', flavor: sourceFlavor }, { kind: 'box', boxIndex: 2 });
assert.ok(placed);
assert.equal(JSON.stringify(initialState), frozenSource, 'Transfers do not mutate input state');
assert.equal(placed.boxes[2].length, 1);
assert.equal(placed.stock[sourceFlavor], initialState.stock[sourceFlavor] - 1);
const moved = transferCookie(placed, { kind: 'box', boxIndex: 2, cookieIndex: 0, flavor: sourceFlavor }, { kind: 'box', boxIndex: 0 });
assert.equal(moved.boxes[2].length, 0);
assert.equal(moved.boxes[0].length, 1);
const returned = transferCookie(moved, { kind: 'box', boxIndex: 0, cookieIndex: 0, flavor: sourceFlavor }, { kind: 'tray' });
assert.deepEqual(returned, initialState);
assert.equal(transferCookie(initialState, { kind: 'tray', flavor: sourceFlavor }, { kind: 'box', boxIndex: 99 }), null);
assert.equal(transferCookie(initialState, { kind: 'box', boxIndex: 0, cookieIndex: 0, flavor: sourceFlavor }, { kind: 'tray' }), null);
assert.equal(transferCookie(placed, { kind: 'box', boxIndex: 2, cookieIndex: 0, flavor: sourceFlavor }, { kind: 'box', boxIndex: 2 }), null);
const full = { stock: counts(1), boxes: [Array(24).fill('chocolate')] };
assert.equal(transferCookie(full, { kind: 'tray', flavor: 'chocolate' }, { kind: 'box', boxIndex: 0 }), null);
assert.equal(full.stock.chocolate, 1, 'A rejected full-box drop preserves its source');
let cursor = 3123;
const random = max => ((cursor = (cursor * 1664525 + 1013904223) >>> 0) % max);
let state = { stock: counts(12, 12, 12), boxes: [[], [], [], []] };
const originalInventory = inventory(state);
for (let i = 0; i < 1500; i++) {
  const boxIndex = random(4);
  const flavor = FLAVORS[random(3)];
  const source = random(2) || !state.boxes[boxIndex].length ? { kind: 'tray', flavor } : {
    kind: 'box', boxIndex, cookieIndex: 0, flavor: state.boxes[boxIndex][0],
  };
  const destination = random(5) === 0 ? { kind: 'tray' } : { kind: 'box', boxIndex: random(4) };
  state = transferCookie(state, source, destination) ?? state;
  assert.deepEqual(inventory(state), originalInventory);
  assert.ok(FLAVORS.every(flavor => state.stock[flavor] >= 0));
}
const apprenticeSupply = createPackingStock(createTask(1, 3, 'chocolate', () => 0, 'shape'));
assert.ok(FLAVORS.every(flavor => apprenticeSupply[flavor] > 0), 'Shape-practice supply does not reveal the requested shape');
console.log('Packing: 1,500 mixed transfers conserve each shape; arbitrary boxes, returns, invalid/stale/full drops passed.');

// Audio remains silent before interaction; muting and disposal work without losing gameplay.
const { createBakerySound } = await import('../src/features/bakery/sound.ts');
const contexts = [];
const voices = [];
class MockAudioContext {
  currentTime = 0; state = 'suspended'; destination = {};
  constructor() { contexts.push(this); }
  createGain() { return { gain: { value: 0, setValueAtTime(value) { this.value = value; }, exponentialRampToValueAtTime() {}, cancelScheduledValues() {} }, connect() {}, disconnect() {} }; }
  createOscillator() { const voice = { type: '', frequency: { setValueAtTime() {} }, connect() {}, disconnect() {}, start() { this.started = true; }, stop() { this.stopped = true; } }; voices.push(voice); return voice; }
  resume() { this.state = 'running'; return Promise.resolve(); }
  close() { this.state = 'closed'; return Promise.resolve(); }
}
globalThis.window = { AudioContext: MockAudioContext };
const audio = createBakerySound();
assert.equal(audio.supported, true);
assert.equal(contexts.length, 0);
audio.setEnabled(false); audio.play('drop'); assert.equal(contexts.length, 0);
audio.setEnabled(true);
for (const effect of ['pickup', 'drop', 'return', 'bake', 'success', 'retry']) {
  if (contexts[0]) contexts[0].currentTime++;
  const before = voices.length; audio.play(effect); assert.ok(voices.length > before);
}
assert.equal(contexts[0].state, 'running');
assert.ok(voices.every(voice => voice.started && voice.stopped));
const voiceCount = voices.length; audio.setEnabled(false); audio.play('success'); assert.equal(voices.length, voiceCount);
audio.dispose(); assert.equal(contexts[0].state, 'closed');
delete globalThis.window;
assert.equal(createBakerySound().supported, false);
console.log('Sound: gesture-lazy initialization, six synthesized effects, mute, unsupported fallback and disposal verified.');
