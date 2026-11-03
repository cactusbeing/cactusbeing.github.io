import assert from 'node:assert/strict';
import { classroomScenarios } from '../src/features/chat-relay/data/scenarios/classroom.ts';
import { hallwayScenarios } from '../src/features/chat-relay/data/scenarios/hallway.ts';
import { lunchScenarios } from '../src/features/chat-relay/data/scenarios/lunch.ts';
import { playgroundScenarios } from '../src/features/chat-relay/data/scenarios/playground.ts';
import { clubScenarios } from '../src/features/chat-relay/data/scenarios/club.ts';
import { outingScenarios } from '../src/features/chat-relay/data/scenarios/outing.ts';
import { scenarios as publishedScenarios } from '../src/features/chat-relay/data/scenarios/index.ts';
import { scenes, skillTags, contentVersion } from '../src/features/chat-relay/data/manifest.ts';
import { validateScenarios } from '../src/features/chat-relay/engine/validateScenarios.ts';
import { graphFor, createSession, orderedChoices, choose, retryChoice, backOne, continueDialogue, nextScenario } from '../src/features/chat-relay/engine/dialogue.ts';
import { emptyHistory, selectScenarioPool, remember, taipeiDate, dailyIds } from '../src/features/chat-relay/engine/selector.ts';
import { hashSeed, seededRandom, shuffle } from '../src/features/chat-relay/engine/random.ts';
import { summarize } from '../src/features/chat-relay/engine/scoring.ts';
import { STORAGE_KEY, defaultSettings, initialData, validSettings, validSession, historyFor, saveData, loadData, decodeStoredData } from '../src/features/chat-relay/services/storage.ts';
import { speechAvailable, speak, stopSpeech } from '../src/features/chat-relay/services/speech.ts';

// Run with Node's native TypeScript stripping, as used by test-money.mjs.
// This is an exhaustive state-machine test, not a browser accessibility audit.
const bank = [...classroomScenarios, ...hallwayScenarios, ...lunchScenarios, ...playgroundScenarios, ...clubScenarios, ...outingScenarios];
const clone = value => structuredClone(value);
let passed = 0, failed = 0, terminalPaths = 0, decisionsPlayed = 0;
function test(name, run) {
  try { run(); passed++; console.log(`PASS ${name}`); }
  catch (error) { failed++; console.error(`FAIL ${name}\n${error.stack}`); }
}
const settings = (overrides = {}) => ({ ...defaultSettings(), ...overrides });
const select = (options = {}, history = emptyHistory(), count = 5, seed = 721, source = bank) => selectScenarioPool(settings(options), history, count, seededRandom(seed), source);
const byId = id => {
  const found = bank.find(s => s.id === id);
  assert.ok(found, `Scenario ${id} exists`);
  return found;
};
function selectedChoice(session, scenario, index = 0) {
  const n = graphFor(scenario, session.settings.difficulty).nodes[session.nodeId];
  assert.equal(n.kind, 'decision');
  return n.choices[index];
}
function answerAndContinue(session, scenario, index = 0) {
  const choice = selectedChoice(session, scenario, index);
  assert.equal(choose(session, scenario, choice.id), true);
  assert.equal(session.phase, 'reaction');
  assert.equal(session.records[session.index].choices.at(-1).reaction, choice.npcReaction.text);
  assert.equal(continueDialogue(session, scenario), true);
  return choice;
}
function completeCurrent(session, scenario) {
  let guard = 0;
  while (session.phase !== 'end') {
    assert.ok(guard++ < 6, 'Completes without a loop');
    answerAndContinue(session, scenario);
  }
}
function completedSession(ids = [bank[0].id], overrides = {}) {
  const session = createSession(ids, settings(overrides), 12345, 'A01');
  do { completeCurrent(session, byId(session.scenarioIds[session.index])); } while (nextScenario(session));
  assert.equal(session.completed, true);
  return session;
}
class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
  removeItem(key) { this.values.delete(key); }
}

test('60 authored scenarios, published entry, unique IDs, six scenes and all difficulty graphs', () => {
  assert.equal(bank.length, 60);
  assert.deepEqual(publishedScenarios.map(s => s.id), bank.map(s => s.id));
  const report = validateScenarios(bank);
  assert.deepEqual(report.errors, []);
  assert.equal(report.valid, true);
  assert.equal(report.scenarios, 60);
  assert.equal(report.decisionNodes, 300);
  assert.equal(report.choices, 900);
  assert.equal(report.terminalPaths, 6720);
  for (const scene of scenes) {
    assert.equal(report.byScene[scene.id], 10);
    for (let n = 1; n <= 10; n++) byId(`${scene.id}-${String(n).padStart(2, '0')}`);
  }
  assert.equal(new Set(bank.map(s => s.nodes[s.startNodeId].npcText)).size, 60, 'Openings are distinct');
  const responseSets = bank.map(s => s.nodes[s.startNodeId].choices.map(c => c.npcReaction.text).join('|'));
  assert.equal(new Set(responseSets).size, 60, 'The primary responses are not a repeated NPC template');
  assert.ok(bank.every(s => new Set(s.skillTags).size >= 2));
  assert.ok(bank.every(s => JSON.stringify(s.easy) !== JSON.stringify(graphFor(s, 2))), 'Lv1 is separately authored');
});

test('validator rejects broken targets, loops, empty feedback, repeated reactions and missing assets', () => {
  const damage = [
    s => { s.nodes.start.choices[0].nextNodeId = 'missing'; },
    s => { s.nodes.start.choices[0].nextNodeId = 'start'; },
    s => { s.nodes.start.choices[0].rationale = ' '; },
    s => { s.nodes.start.choices[1].npcReaction.text = s.nodes.start.choices[0].npcReaction.text; },
    s => { s.npcId = 'unknown'; },
    s => { s.easy.nodes.start.choices = [s.easy.nodes.start.choices[0]]; },
  ];
  for (const mutate of damage) {
    const scenario = clone(bank[0]); mutate(scenario);
    assert.equal(validateScenarios([scenario], 1).valid, false);
  }
});

test('every reachable choice shows its own reaction and reaches an end through the actual engine', () => {
  const endings = new Set();
  for (const scenario of bank) for (const difficulty of [1, 2, 3]) {
    const graph = graphFor(scenario, difficulty);
    const expectedDepth = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
    const initial = createSession([scenario.id], settings({ difficulty }), 44, 'A01');
    function walk(session, ancestors = [], depth = 0) {
      assert.ok(depth <= 5, `${scenario.id} has no loop`);
      const node = graph.nodes[session.nodeId];
      assert.ok(node, `${scenario.id} target exists`);
      if (node.kind === 'end') {
        assert.equal(depth, expectedDepth, `${scenario.id} Lv${difficulty} decision count`);
        assert.equal(session.phase, 'end');
        assert.equal(session.records[0].completed, true);
        assert.equal(session.records[0].ending, node.ending);
        assert.ok(node.closingText.trim());
        assert.equal(nextScenario(session), false);
        assert.equal(session.completed, true);
        endings.add(node.ending); terminalPaths++;
        return;
      }
      assert.ok(!ancestors.includes(node.id));
      assert.equal(node.choices.length, difficulty === 1 ? 2 : 3);
      assert.equal(new Set(node.choices.map(c => c.npcReaction.text)).size, node.choices.length);
      for (const choice of node.choices) {
        const attempt = clone(session);
        assert.ok(choice.text.trim() && choice.rationale.trim() && choice.npcReaction.text.trim());
        assert.equal(choose(attempt, scenario, choice.id), true);
        assert.equal(attempt.nodeId, node.id, 'Reaction is shown before moving to next decision');
        assert.equal(attempt.phase, 'reaction');
        assert.equal(attempt.selectedChoiceId, choice.id);
        const recorded = attempt.records[0].choices.at(-1);
        assert.equal(recorded.text, choice.text);
        assert.equal(recorded.reaction, choice.npcReaction.text);
        assert.deepEqual(recorded.scores, choice.scores);
        assert.equal(choose(attempt, scenario, choice.id), false, 'Double click cannot add an answer');
        assert.equal(continueDialogue(attempt, scenario), true);
        assert.equal(attempt.nodeId, choice.nextNodeId);
        decisionsPlayed++;
        walk(attempt, [...ancestors, node.id], depth + 1);
      }
    }
    walk(initial);
    if (difficulty !== 1) assert.ok(new Set(graph.nodes.start.choices.map(c => c.nextNodeId)).size >= 2, 'Actual a/b branches');
  }
  assert.equal(terminalPaths, 6720);
  assert.deepEqual([...endings].sort(), ['brief', 'extended', 'repair', 'respectful_close']);
});

test('seeded randomness and shuffled options are deterministic without mutating inputs', () => {
  const original = [1, 2, 3, 4, 5];
  assert.deepEqual(shuffle(original, seededRandom(hashSeed('same'))), shuffle(original, seededRandom(hashSeed('same'))));
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
  assert.notEqual(hashSeed('first'), hashSeed('second'));
  const scenario = bank[0], options = settings(), ids = [scenario.id];
  const session = createSession(ids, options, 71, 'A01');
  options.sceneIds.push('outing'); ids.push(bank[1].id);
  assert.deepEqual(session.settings.sceneIds, []);
  assert.deepEqual(session.scenarioIds, [scenario.id]);
  const node = scenario.nodes.start;
  assert.deepEqual(orderedChoices(session, node), orderedChoices(clone(session), node));
  assert.deepEqual(orderedChoices(session, node).map(c => c.id).sort(), node.choices.map(c => c.id).sort());
  const orders = new Set(Array.from({ length: 12 }, (_, seed) => orderedChoices({ ...session, seed }, node).map(c => c.id).join('|')));
  assert.ok(orders.size > 1, 'Option order can change across session seeds');
  session.settings.shuffleChoices = false;
  assert.deepEqual(orderedChoices(session, node), node.choices);
});

test('same settings and seed select the same five unique diverse scenarios', () => {
  const history = emptyHistory(), options = settings();
  const before = JSON.stringify({ history, options, bank });
  const first = selectScenarioPool(options, history, 5, seededRandom(999), bank);
  const again = selectScenarioPool(options, history, 5, seededRandom(999), bank);
  assert.deepEqual(first, again);
  assert.equal(first.ids.length, 5);
  assert.equal(new Set(first.ids).size, 5);
  assert.ok(new Set(first.ids.map(id => byId(id).sceneId)).size > 1);
  assert.ok(new Set(first.ids.map(id => byId(id).npcId)).size > 1);
  assert.equal(JSON.stringify({ history, options, bank }), before);
});

test('twenty consecutive three-question sessions exhaust all 60 before any repeat', () => {
  const history = emptyHistory(), played = [], sessions = [];
  for (let round = 0; round < 20; round++) {
    const recent = new Set(history.recentScenarioIds.slice(-12));
    const result = select({}, history, 3, 4200 + round);
    assert.equal(result.ids.length, 3);
    assert.equal(new Set(result.ids).size, 3);
    assert.ok(result.ids.every(id => !played.includes(id)), `Session ${round + 1} uses unplayed items first`);
    assert.ok(result.ids.every(id => !recent.has(id)));
    sessions.push(result.ids);
    for (const id of result.ids) {
      played.push(id);
      remember(history, id, new Date(Date.UTC(2026, 10, 2, 0, round)).toISOString());
    }
  }
  assert.equal(played.length, 60);
  assert.equal(new Set(played).size, 60);
  assert.ok(Object.values(history.playCount).every(n => n === 1));
  const next = select({}, history, 3, 4300);
  assert.ok(next.ids.every(id => !history.recentScenarioIds.slice(-12).includes(id)));
  if (process.argv.includes('--review')) console.log('REVIEW_SESSIONS', JSON.stringify(sessions.slice(0, 15)));
});

test('scene, skill and supported difficulty filters hold; insufficient pools never duplicate', () => {
  for (const difficulty of [1, 2, 3]) for (const scene of scenes) for (const skill of skillTags) {
    const result = select({ difficulty, sceneIds: [scene.id], skillTags: [skill] }, emptyHistory(), 10, 8);
    const expected = bank.filter(s => s.sceneId === scene.id && s.skillTags.includes(skill) && s.supportedDifficulties.includes(difficulty));
    assert.equal(result.available, expected.length);
    assert.equal(result.ids.length, expected.length);
    assert.equal(new Set(result.ids).size, result.ids.length);
    assert.ok(result.ids.every(id => expected.some(s => s.id === id)));
    if (expected.length < 10) assert.ok(result.notice.length > 0);
  }
  const changed = bank.slice(0, 3).map((s, i) => ({ ...s, supportedDifficulties: i === 0 ? [1] : [2, 3] }));
  assert.equal(select({ difficulty: 1 }, emptyHistory(), 10, 9, changed).ids.length, 1);
  assert.equal(select({ difficulty: 2 }, emptyHistory(), 10, 9, changed).ids.length, 2);
  const none = select({ sceneIds: ['outing'] }, emptyHistory(), 3, 9, classroomScenarios);
  assert.deepEqual(none.ids, []); assert.ok(none.notice);
  const limited = select({ sceneIds: ['club'] }, emptyHistory(), 15);
  assert.equal(limited.ids.length, 10); assert.ok(limited.notice.includes('10'));
});

test('recent twelve are excluded when possible and small-pool fallback starts with oldest', () => {
  const history = emptyHistory();
  for (let i = 0; i < bank.length; i++) remember(history, bank[i].id, new Date(Date.UTC(2026, 0, 1 + i)).toISOString());
  const recent = new Set(history.recentScenarioIds.slice(-12));
  assert.ok(select({}, history, 10, 33).ids.every(id => !recent.has(id)));
  const small = bank.slice(-2), smallHistory = emptyHistory();
  remember(smallHistory, small[0].id, '2026-01-01T00:00:00.000Z');
  remember(smallHistory, small[1].id, '2026-01-02T00:00:00.000Z');
  const result = select({}, smallHistory, 5, 33, small);
  assert.deepEqual(result.ids, small.map(s => s.id)); assert.ok(result.notice);
  for (let i = 0; i < 105; i++) remember(smallHistory, small[i % 2].id, new Date(Date.UTC(2026, 0, 3 + i)).toISOString());
  assert.equal(smallHistory.recentScenarioIds.length, 100);
  assert.equal(Object.values(smallHistory.playCount).reduce((a, b) => a + b, 0), 107);
});

test('Taipei midnight, daily repeat/order and bank-version seed are reproducible', () => {
  assert.equal(taipeiDate(new Date('2026-11-01T15:59:59.999Z')), '2026-11-01');
  assert.equal(taipeiDate(new Date('2026-11-01T16:00:00.000Z')), '2026-11-02');
  assert.equal(taipeiDate(new Date('2026-12-31T16:00:00.000Z')), '2027-01-01');
  const first = dailyIds('2026-11-02', contentVersion, bank);
  assert.equal(first.length, 3); assert.equal(new Set(first).size, 3);
  assert.deepEqual(first, dailyIds('2026-11-02', contentVersion, bank));
  assert.deepEqual(first, dailyIds('2026-11-02', contentVersion, [...bank].reverse()));
  assert.notDeepEqual(first, dailyIds('2026-11-03', contentVersion, bank));
  assert.notDeepEqual(first, dailyIds('2026-11-02', contentVersion + 1, bank));
  assert.equal(dailyIds('2026-11-02', contentVersion, bank.slice(0, 2)).length, 2, 'Small bank returns available items without inventing repeats');
  const storage = new MemoryStorage(), data = initialData();
  data.dailySelection['2026-11-02'] = { version: contentVersion, ids: first };
  assert.equal(saveData(data, storage), true);
  assert.deepEqual(loadData(bank, storage).data.dailySelection['2026-11-02'].ids, first);
  assert.deepEqual(loadData(bank, storage).data.records, [], 'Daily selection is separate from answer records');
});

test('choose, retry, back, branch change, continue and multi-scenario completion preserve attempts', () => {
  const scenario = byId('classroom-01');
  assert.throws(() => createSession([], settings(), 1, 'A01'));
  const session = createSession([scenario.id, 'club-08'], settings({ difficulty: 3 }), 1, 'A01');
  assert.equal(continueDialogue(session, scenario), false);
  assert.equal(nextScenario(session), false);
  assert.equal(choose(session, scenario, 'missing'), false);
  session.usedHint = true; session.usedDemo = true;
  const first = selectedChoice(session, scenario, 0);
  assert.equal(choose(session, scenario, first.id), true);
  assert.equal(session.records[0].choices[0].usedHint, true);
  assert.equal(session.records[0].choices[0].usedDemo, true);
  assert.equal(choose(session, scenario, first.id), false);
  retryChoice(session);
  assert.equal(session.phase, 'choose'); assert.equal(session.attempt, 2);
  assert.equal(session.records[0].choices[0].retried, true);
  answerAndContinue(session, scenario, 0);
  assert.equal(session.nodeId, 'a'); assert.equal(session.usedHint, false); assert.equal(session.usedDemo, false);
  answerAndContinue(session, scenario, 0);
  assert.equal(session.nodeId, 'extra');
  backOne(session); assert.equal(session.nodeId, 'a');
  backOne(session); assert.equal(session.nodeId, 'start');
  assert.ok(session.records[0].choices.every(a => a.retried), 'Backing to start retains old attempts as retried');
  answerAndContinue(session, scenario, 1); assert.equal(session.nodeId, 'b');
  completeCurrent(session, scenario);
  const oldEnding = session.records[0].ending;
  assert.ok(oldEnding);
  backOne(session); assert.equal(session.phase, 'choose'); assert.equal(session.nodeId, 'close');
  assert.equal(session.records[0].completed, false); assert.equal(session.records[0].ending, undefined);
  completeCurrent(session, scenario);
  assert.equal(nextScenario(session), true); assert.equal(session.index, 1); assert.equal(session.attempt, 1);
  completeCurrent(session, byId('club-08'));
  assert.equal(nextScenario(session), false); assert.equal(session.completed, true);
  assert.ok(session.records.every(r => r.completed));
  assert.equal(choose(session, byId('club-08'), 'close-0'), false);
});

test('only encountered, non-retried answers contribute to skills; hints are distinguishable', () => {
  const record = { scenarioId: 'test', difficulty: 2, dateISO: '2026-11-02T00:00:00Z', completed: true, choices: [
    { scores: { respond: 0 }, retried: true, usedHint: false, usedDemo: false },
    { scores: { respond: 2 }, retried: false, usedHint: false, usedDemo: false },
    { scores: { respect_boundary: 2 }, retried: false, usedHint: true, usedDemo: false },
    { scores: { respect_boundary: 0 }, retried: false, usedHint: false, usedDemo: true },
  ] };
  const report = summarize([record]);
  assert.deepEqual(report.find(r => r.skill === 'respond'), { skill: 'respond', total: 1, effective: 1, independent: 1, label: '能在此題運用' });
  assert.deepEqual(report.find(r => r.skill === 'respect_boundary'), { skill: 'respect_boundary', total: 2, effective: 1, independent: 0, label: '漸漸熟悉' });
  assert.deepEqual(report.find(r => r.skill === 'ask_question'), { skill: 'ask_question', total: 0, effective: 0, independent: 0, label: '本次未練習' });
  assert.ok(summarize([]).every(r => r.label === '本次未練習' && r.total === 0));
});

test('default-visible hints are recorded as support without extra clicks', () => {
  const scenario = bank[0];
  for (const [overrides, hint, demo] of [
    [{ difficulty: 1 }, true, false],
    [{ difficulty: 2, showHints: true }, true, false],
    [{ difficulty: 3, showHints: false }, false, false],
  ]) {
    const session = createSession([scenario.id], settings(overrides), 19, 'A01');
    assert.equal(session.usedHint, false); assert.equal(session.usedDemo, false);
    answerAndContinue(session, scenario);
    assert.equal(session.records[0].choices[0].usedHint, hint);
    assert.equal(session.records[0].choices[0].usedDemo, demo);
    const practiced = summarize(session.records).filter(r => r.total > 0);
    assert.ok(practiced.length > 0);
    assert.ok(practiced.every(r => r.independent === (hint || demo ? 0 : 1)));
  }
});

test('active session saves/resumes choose, reaction and end phases without losing the branch', () => {
  const storage = new MemoryStorage(), data = initialData(), scenario = byId('outing-10');
  const session = createSession([scenario.id], settings({ difficulty: 3 }), 32, 'A01');
  data.activeSession = session;
  assert.equal(saveData(data, storage), true);
  assert.deepEqual(loadData(bank, storage).data.activeSession, session);
  assert.equal(choose(session, scenario, selectedChoice(session, scenario, 1).id), true);
  assert.equal(saveData(data, storage), true);
  const resumed = loadData(bank, storage).data.activeSession;
  assert.equal(resumed.phase, 'reaction');
  assert.equal(resumed.selectedChoiceId, session.selectedChoiceId);
  assert.deepEqual(resumed.records, session.records);
  assert.equal(continueDialogue(resumed, scenario), true); assert.equal(resumed.nodeId, 'b');
  completeCurrent(resumed, scenario); data.activeSession = resumed;
  assert.equal(saveData(data, storage), true);
  const atEnd = loadData(bank, storage).data.activeSession;
  assert.equal(atEnd.phase, 'end'); assert.equal(atEnd.records[0].completed, true);
  assert.equal(nextScenario(atEnd), false); assert.equal(atEnd.completed, true);
});

test('storage unavailable/full/corrupt falls back while core dialogue remains playable', () => {
  const unavailable = { getItem() { throw Error('Storage denied'); }, setItem() { throw Error('Storage denied'); }, removeItem() { throw Error('Storage denied'); } };
  const full = { getItem() { return null; }, setItem() { throw Error('QuotaExceededError'); }, removeItem() {} };
  assert.ok(loadData(bank, unavailable).notice);
  assert.equal(saveData(initialData(), unavailable), false);
  assert.equal(saveData(initialData(), full), false);
  assert.doesNotThrow(() => completedSession(['club-08'], { difficulty: 1 }));
  const corrupt = new MemoryStorage(); corrupt.setItem(STORAGE_KEY, '{broken');
  const loaded = loadData(bank, corrupt);
  assert.ok(loaded.notice); assert.deepEqual(loaded.data, initialData());
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw Error('Storage disabled'); } });
    assert.ok(loadData(bank).notice, 'Disabled global localStorage falls back without a crash');
    assert.equal(saveData(initialData()), false);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor); else delete globalThis.localStorage;
  }
});

test('local state roundtrip retains history, achievements and bounded records', () => {
  const storage = new MemoryStorage(), data = initialData();
  data.profileId = 'A01'; data.lessons = [0, 2]; data.achievements = ['first-completion'];
  const history = historyFor(data); remember(history, 'classroom-01', '2026-11-02T00:00:00.000Z');
  assert.equal(historyFor(data), history);
  data.records = [{ session: completedSession(['classroom-01', 'club-08']) }];
  const decoded = decodeStoredData(JSON.stringify(data), bank);
  assert.deepEqual(decoded, data); assert.equal(validSession(decoded.records[0].session, bank), true);
  assert.equal(saveData(data, storage), true);
  assert.deepEqual(loadData(bank, storage).data, data);
  data.records = Array.from({ length: 105 }, (_, i) => ({ session: { ...clone(data.records[0].session), id: `record-${i}` } }));
  for (let day = 1; day <= 31; day++) data.dailySelection[`2026-10-${String(day).padStart(2, '0')}`] = { version: 1, ids: dailyIds('2026-10-01', 1, bank) };
  assert.equal(saveData(data, storage), true);
  assert.equal(data.records.length, 100); assert.equal(data.records[0].session.id, 'record-5');
  assert.equal(Object.keys(data.dailySelection).length, 30);
  assert.equal(data.dailySelection['2026-10-01'], undefined);
  assert.equal(loadData(bank, storage).notice, '');
});

test('profile history cannot inherit prototype values and stored state rejects reserved IDs', () => {
  for (const profileId of ['__proto__', 'constructor', 'prototype']) {
    const data = initialData(); data.profileId = profileId;
    const result = historyFor(data);
    assert.deepEqual(result.recentScenarioIds, []);
    assert.deepEqual(result.playCount, {});
    assert.notEqual(result, Object.prototype);
    assert.throws(() => decodeStoredData(JSON.stringify({ ...initialData(), profileId }), bank));
  }
  assert.equal(Object.prototype.polluted, undefined);
});

test('stored JSON rejects versions, unsafe keys, oversized UTF-8 input and malformed field types', () => {
  assert.throws(() => decodeStoredData('not json', bank));
  assert.throws(() => decodeStoredData(JSON.stringify({ ...initialData(), version: 2 }), bank));
  for (const key of ['__proto__', 'constructor', 'prototype']) {
    const text = JSON.stringify(initialData()).replace('"version":1', `"version":1,"untrusted":{"${key}":{"polluted":true}}`);
    assert.throws(() => decodeStoredData(text, bank));
  }
  assert.throws(() => decodeStoredData(' '.repeat(2 * 1024 * 1024 + 1), bank), /大小上限|2 MB/);
  assert.throws(() => decodeStoredData(JSON.stringify({ ...initialData(), payload: '繁'.repeat(710000) }), bank), /大小上限|2 MB/, 'Size limit counts UTF-8 bytes');
  const invalid = [
    d => { d.settings.difficulty = '2'; }, d => { d.settings.sessionLength = 4; },
    d => { d.settings.textSize = 99; }, d => { d.settings.readAloud = 1; },
    d => { d.settings.sceneIds = ['moon']; }, d => { d.settings.skillTags = ['diagnosis']; },
    d => { d.profileId = ['A01']; }, d => { d.histories = []; },
    d => { d.histories.A01 = { recentScenarioIds: [], playCount: { 'club-08': -1 }, lastPlayed: {} }; },
    d => { d.histories.A01 = { recentScenarioIds: [3], playCount: {}, lastPlayed: {} }; },
    d => { d.histories.A01 = { recentScenarioIds: [], playCount: {}, lastPlayed: { 'club-08': 3 } }; },
    d => { d.records = {}; }, d => { d.achievements = [3]; }, d => { d.lessons = [4]; },
    d => { d.dailySelection.badDate = { version: 1, ids: ['club-01', 'club-02', 'club-03'] }; },
    d => { d.dailySelection['2026-11-02'] = { version: '1', ids: ['club-01', 'club-02', 'club-03'] }; },
    d => { d.dailySelection['2026-11-02'] = { version: 1, ids: ['club-01', 'club-01', 'club-03'] }; },
    d => { d.activeSession = {}; },
  ];
  for (const mutate of invalid) { const data = initialData(); mutate(data); assert.throws(() => decodeStoredData(JSON.stringify(data), bank)); }
  const active = createSession(['classroom-01'], settings(), 41, 'A01');
  choose(active, bank[0], selectedChoice(active, bank[0]).id);
  for (const mutate of [
    s => { s.scenarioIds = ['missing']; }, s => { s.nodeId = 'missing'; },
    s => { s.phase = 'invalid'; }, s => { s.index = -1; }, s => { s.attempt = 0; },
    s => { s.records[0].choices[0].reaction = 'forged'; }, s => { s.records[0].choices[0].scores = { respond: 99 }; },
    s => { s.records[0].choices[0].usedHint = 'yes'; }, s => { s.records[0].dateISO = 'not a date'; },
  ]) {
    const data = initialData(); data.activeSession = clone(active); mutate(data.activeSession);
    assert.throws(() => decodeStoredData(JSON.stringify(data), bank));
  }
  const data = initialData(); data.records = [{ session: {} }];
  assert.throws(() => decodeStoredData(JSON.stringify(data), bank));
  assert.equal(validSettings(settings(), bank), true);
  assert.equal(Object.prototype.polluted, undefined);
});

test('restored sessions reject fabricated branches and inconsistent phase or completion metadata', () => {
  const scenario = bank[0];
  const fresh = () => createSession([scenario.id], settings({ difficulty: 3 }), 91, 'A01');
  const reject = session => {
    assert.equal(validSession(session, bank), false);
    assert.throws(() => decodeStoredData(JSON.stringify({ ...initialData(), activeSession: session }), bank));
  };
  const noPath = fresh(); noPath.nodeId = 'a'; reject(noPath);
  const mismatch = fresh();
  choose(mismatch, scenario, 'start-0'); mismatch.selectedChoiceId = 'start-1'; reject(mismatch);
  const routeA = fresh(); answerAndContinue(routeA, scenario, 0);
  const routeB = fresh(); answerAndContinue(routeB, scenario, 1); answerAndContinue(routeB, scenario, 0);
  routeA.records[0].choices.push(clone(routeB.records[0].choices.at(-1))); reject(routeA);
  const fakeComplete = fresh(); fakeComplete.completed = true; fakeComplete.records[0].completed = true; reject(fakeComplete);
  const noAnswers = completedSession([scenario.id], { difficulty: 3 }); noAnswers.records[0].choices = []; reject(noAnswers);
  const wrongEnding = completedSession([scenario.id], { difficulty: 3 });
  wrongEnding.records[0].ending = wrongEnding.records[0].ending === 'repair' ? 'brief' : 'repair'; reject(wrongEnding);
  const pendingAtEnd = completedSession([scenario.id], { difficulty: 3 });
  pendingAtEnd.selectedChoiceId = 'close-0'; reject(pendingAtEnd);
  const fractionalAttempt = fresh(); choose(fractionalAttempt, scenario, 'start-0');
  fractionalAttempt.records[0].choices[0].attempt = 1.5; reject(fractionalAttempt);
  const futureAnswers = createSession([scenario.id, 'club-08'], settings({ difficulty: 3 }), 91, 'A01');
  futureAnswers.records[1] = clone(completedSession(['club-08'], { difficulty: 3 }).records[0]); reject(futureAnswers);
  // Valid restored retry history remains accepted after moving from a to b.
  const revised = fresh(); answerAndContinue(revised, scenario, 0); backOne(revised);
  answerAndContinue(revised, scenario, 1);
  assert.equal(validSession(revised, bank), true);
  assert.equal(validSession(completedSession([scenario.id, 'club-08'], { difficulty: 3 }), bank), true);
});

test('speech defaults to silent, works only when invoked, prefers zh-TW and falls back without APIs', () => {
  assert.equal(defaultSettings().readAloud, false);
  assert.equal(speechAvailable(), false); assert.equal(speak('不支援時仍可讀文字'), false);
  assert.doesNotThrow(stopSpeech);
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const utteranceDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'SpeechSynthesisUtterance');
  const calls = [], voices = [
    { lang: 'en-US', localService: true }, { lang: 'zh-CN', localService: true },
    { lang: 'zh-TW', localService: false }, { lang: 'zh-TW', localService: true },
  ];
  try {
    globalThis.window = { speechSynthesis: {
      cancel() { calls.push('cancel'); }, getVoices() { return voices; }, speak(u) { calls.push(u); },
    } };
    globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    assert.equal(calls.length, 0, 'Providing the API does not trigger speech');
    assert.equal(speechAvailable(), true);
    assert.equal(speak('接住話題'), true);
    assert.equal(calls[0], 'cancel'); assert.equal(calls[1].text, '接住話題');
    assert.equal(calls[1].lang, 'zh-TW'); assert.equal(calls[1].voice, voices[3]);
    voices.pop(); assert.equal(speak('中文備援'), true); assert.equal(calls.at(-1).voice, voices[1]);
    const spokenBeforeFallback = calls.filter(c => typeof c === 'object').length;
    voices.splice(0); assert.equal(speak('沒有本機聲音'), false);
    voices.push({ lang: 'zh-TW', localService: false }); assert.equal(speak('遠端中文不能使用'), false);
    voices.push({ lang: 'en-US', localService: true }); assert.equal(speak('本機英文不能改用遠端中文'), false);
    assert.equal(calls.filter(c => typeof c === 'object').length, spokenBeforeFallback, 'No remote or null default voice is invoked');
    window.speechSynthesis.getVoices = () => { throw Error('Speech unavailable'); };
    assert.equal(speak('仍可看文字'), false);
    delete globalThis.SpeechSynthesisUtterance;
    assert.equal(speechAvailable(), false); assert.equal(speak('無語音建構子'), false);
  } finally {
    if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor); else delete globalThis.window;
    if (utteranceDescriptor) Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', utteranceDescriptor); else delete globalThis.SpeechSynthesisUtterance;
  }
});

console.log(`Chat Relay: ${passed} test groups passed; ${failed} failed; ${bank.length} authored scenarios, ${terminalPaths} complete difficulty paths and ${decisionsPlayed} choice transitions exercised.`);
if (failed) process.exitCode = 1;
