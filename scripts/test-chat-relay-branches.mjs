import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { classroomDialogues, drawingDialogue, modelDialogue, onlineDialogue } from '../src/features/chat-relay/data/scenarios/classroomDialogues.ts';
import { scenarios } from '../src/features/chat-relay/data/scenarios/index.ts';
import { baselineScenarios } from '../src/features/chat-relay/data/scenarios/baseline.ts';
import { auditDialogue } from '../src/features/chat-relay/engine/auditDialogue.ts';
import { choose, continueDialogue, createSession, graphFor, nextScenario, retryChoice } from '../src/features/chat-relay/engine/dialogue.ts';
import { defaultSettings, initialData, validSession, decodeStoredData } from '../src/features/chat-relay/services/storage.ts';
import { sceneFeedback, visibleFeedback } from '../src/features/chat-relay/feedback.ts';
const reports = [];
let transitions = 0;
for (const scenario of classroomDialogues) {
  const audit = auditDialogue(scenario);
  assert.deepEqual(audit.errors, [], scenario.title);
  const lengths = audit.paths.map(p => p.choices.length);
  for (const difficulty of [1, 2, 3]) {
    assert.deepEqual(auditDialogue(scenario, graphFor(scenario, difficulty)).errors, []);
    for (const path of audit.paths) {
      const session = createSession([scenario.id], { ...defaultSettings(), difficulty, shuffleChoices: false }, 71, 'branch-test');
      for (const choiceId of path.choices) {
        const node = graphFor(scenario, difficulty).nodes[session.nodeId];
        const choice = node.choices.find(c => c.id === choiceId);
        assert.ok(choice);
        assert.equal(choose(session, scenario, choiceId), true);
        assert.equal(validSession(session, scenarios), true, `${scenario.id}:${node.id} reaction resumes`);
        assert.equal(session.phase, 'reaction', 'NPC reaction precedes transition');
        assert.ok(choice.rationale.length > 0, 'Full feedback retained');
        const feedback = visibleFeedback(choice);
        assert.equal(feedback.text, choice.feedback.detailed ? choice.rationale : choice.feedback.brief);
        assert.equal(feedback.detailed, choice.feedbackLevel === 'try_another');
        assert.equal(continueDialogue(session, scenario), true);
        assert.equal(validSession(session, scenarios), true, `${scenario.id}:${session.nodeId} resumes`);
        transitions++;
      }
      assert.equal(session.phase, 'end');
      assert.equal(session.records[0].completed, true);
      assert.equal(session.records[0].ending, path.ending);
      assert.ok(sceneFeedback(scenario, difficulty, session.records[0].choices).length > 0);
      assert.equal(nextScenario(session), false);
      assert.equal(session.completed, true);
    }
  }
  reports.push({ id: scenario.id, title: scenario.title, nodes: audit.reachableNodes, paths: audit.paths.length, minTurns: Math.min(...lengths), maxTurns: Math.max(...lengths), errors: audit.errors, transcripts: audit.paths });
  console.log(`PASS ${scenario.title}: ${audit.paths.length} paths, ${Math.min(...lengths)}–${Math.max(...lengths)} turns, all three difficulties and save/resume phases`);
}

// Inject the exact two reported merge bugs; check every source route, not a union of known facts.
function rejects(scenario, mutation, pattern) {
  const broken = structuredClone(scenario); mutation(broken);
  const result = auditDialogue(broken);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => pattern.test(e)), JSON.stringify(result.errors));
}
rejects(drawingDialogue, s => { s.nodes.A3.choices[1].nextNodeId = 'A4-wind'; }, /wind_tree/);
rejects(modelDialogue, s => { s.nodes.C4.choices[0].nextNodeId = 'C5-dismantle'; }, /dismantle_mentioned/);
rejects(drawingDialogue, s => { s.nodes['A4-sketch'].choices[0].text = '被風吹喔，這招滿好用的耶。'; }, /wind_tree/);
rejects(modelDialogue, s => { s.nodes['C5-tired'].choices[0].text = '先別拆啦，放到旁邊。'; }, /dismantle_mentioned/);
rejects(drawingDialogue, s => { s.nodes.A2.choices[2].nextNodeId = 'A3'; }, /ended interaction/);
rejects(onlineDialogue, s => { s.nodes.start.choices[0].nextNodeId = 'missing'; }, /missing target/);
rejects(onlineDialogue, s => { s.nodes.D3.choices[0].nextNodeId = 'start'; }, /cycle/);
rejects(onlineDialogue, s => { s.nodes.orphan = { id: 'orphan', kind: 'end', ending: 'brief', closingText: '（離開。）' }; }, /unreachable/);
rejects(onlineDialogue, s => { s.nodes.start.choices[0].nextNodeId = 'D-line'; }, /line_invited/);
console.log('PASS 9 injected faults: wrong merges, unannotated future information, refusal continuation, missing target, cycle, orphan, premature LINE');

// The LINE agreement is a simulated choice, never an input or a send operation.
for (const s of classroomDialogues) for (const n of Object.values(s.nodes)) if (n.kind === 'decision') for (const c of n.choices) {
  assert.ok(!/輸入你的|填入你的|請提供.*帳號/.test(c.text + c.npcReaction.text));
  if (c.context?.endsInteraction && c.feedbackLevel !== 'try_another') assert.equal(s.nodes[c.nextNodeId].ending === 'repair', false, 'Natural endings are positive');
}
assert.ok(!onlineDialogue.nodes.start.choices.some(c => /LINE/.test(c.text)), 'Game friend and private contact are separate decisions');
assert.equal(onlineDialogue.nodes['D-line'].choices[2].nextNodeId, 'D2');
assert.ok(onlineDialogue.nodes.D2.npcText.includes('尚未提供任何帳號'));
const retry = createSession([drawingDialogue.id], defaultSettings(), 1, 'branch-test');
choose(retry, drawingDialogue, 'start-2'); retryChoice(retry); choose(retry, drawingDialogue, 'start-0');
assert.ok(sceneFeedback(drawingDialogue, 2, retry.records[0].choices).every(text => !text.includes('你覺得距離還好')));
assert.ok(modelDialogue.nodes.C4.choices[2].text.startsWith('晚點'), 'After declining model work, help is offered for later, not immediately again');
console.log('PASS private data stays simulated; positive natural endings; retried feedback excluded from summary; declined work stays paused');

// Existing 57 unrelated graphs, including their easy graphs and metadata, are untouched.
const revised = new Set(classroomDialogues.map(s => s.id));
const untouched = baselineScenarios.filter(s => !revised.has(s.id));
assert.equal(untouched.length, 57);
for (const old of untouched) assert.deepEqual(scenarios.find(s => s.id === old.id), old);
console.log('PASS all 57 unrelated scenarios remain identical');

// Old completed records use exact original graphs; updated active scenes restart without losing history.
for (const id of ['classroom-05', 'club-03', 'outing-01']) {
  const old = baselineScenarios.find(s => s.id === id);
  const archive = createSession([id], { ...defaultSettings(), difficulty: 3 }, 71, 'branch-test');
  while (archive.phase !== 'end') {
    const n = graphFor(old, 3).nodes[archive.nodeId];
    choose(archive, old, n.choices[0].id); continueDialogue(archive, old);
  }
  nextScenario(archive);
  const data = initialData(); data.records = [{ session: archive }]; data.activeSession = structuredClone(archive);
  data.histories[data.profileId] = { recentScenarioIds: [id], playCount: { [id]: 1 }, lastPlayed: { [id]: archive.createdAt } };
  const restored = decodeStoredData(JSON.stringify(data), scenarios);
  assert.deepEqual(restored.records, data.records); assert.deepEqual(restored.histories, data.histories);
  assert.equal(restored.activeSession, null);
  const forged = structuredClone(data); forged.records[0].session.records[0].choices[0].reaction += '偽造';
  assert.throws(() => decodeStoredData(JSON.stringify(forged), scenarios));
}
console.log('PASS exact previous archives preserved; incompatible sessions restart; forged text rejected');

const outputIndex = process.argv.indexOf('--output');
if (outputIndex >= 0) {
  const directory = process.argv[outputIndex + 1]; assert.ok(directory); mkdirSync(directory, { recursive: true });
  writeFileSync(`${directory}/paths.json`, JSON.stringify({ scenarios: 4, totalPaths: reports.reduce((n, r) => n + r.paths, 0), engineTransitions: transitions, reports }, null, 2) + '\n');
  writeFileSync(`${directory}/dialogues.json`, JSON.stringify(classroomDialogues, null, 2) + '\n');
}
console.log(`Branch validation: ${reports.reduce((n, r) => n + r.paths, 0)} unique paths × 3 difficulties; ${transitions} engine transitions; 0 errors.`);
