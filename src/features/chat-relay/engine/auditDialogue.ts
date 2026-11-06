import type { DialogueGraph, Scenario } from '../types.ts';

export interface AuditedPath { choices: string[]; nodes: string[]; facts: string[]; ending: string; transcript: string[] }
// These are authored knowledge dependencies, not a claim of general natural-language understanding.
const knowledgeRules: [RegExp, string][] = [
  [/被風吹/, 'wind_tree'], [/先別拆/, 'dismantle_mentioned'], [/章魚/, 'octopus'],
  [/石頭/, 'stone'], [/黏三次/, 'three_attempts'], [/都快好了/, 'nearly_done'],
  [/屋頂/, 'crooked_roof'], [/LINE/, 'line_invited'], [/放大圖/, 'sand_photo_question'],
];
export function auditDialogue(scenario: Scenario, graph: DialogueGraph = scenario) {
  const errors: string[] = [], paths: AuditedPath[] = [], reached = new Set<string>();
  const fail = (route: string[], issue: string) => errors.push(`${scenario.id} [${route.join(' → ')}]: ${issue}`);
  function requireFacts(required: string[] | undefined, facts: Set<string>, route: string[], speaker: string) {
    for (const fact of required ?? []) if (!facts.has(fact)) fail(route, `${speaker} uses unestablished fact: ${fact}`);
  }
  function walk(id: string, facts: Set<string>, route: string[], choices: string[], transcript: string[]) {
    const nextRoute = [...route, id], node = graph.nodes[id];
    if (!node) { fail(nextRoute, 'missing target'); return; }
    if (route.includes(id) || route.length > 12) { fail(nextRoute, 'cycle or excessive depth'); return; }
    reached.add(id);
    if (node.id !== id) fail(nextRoute, 'node key/id mismatch');
    if (node.kind === 'end') {
      if (!node.closingText.trim()) fail(nextRoute, 'empty ending');
      paths.push({ nodes: nextRoute, choices, facts: [...facts].sort(), ending: node.ending, transcript: [...transcript, node.closingText] });
      return;
    }
    requireFacts(node.context?.requires, facts, nextRoute, 'NPC');
    const here = new Set([...facts, ...(node.context?.provides ?? [])]);
    if (node.choices.length < 2 || node.choices.length > 4) fail(nextRoute, 'choice count outside 2–4');
    if (new Set(node.choices.map(c => c.id)).size !== node.choices.length) fail(nextRoute, 'duplicate choice id');
    for (const choice of node.choices) {
      const choiceRoute = [...nextRoute, choice.id];
      requireFacts(choice.context?.requires, here, choiceRoute, 'player');
      // Independent text guards catch omitted annotations on the known high-risk references.
      for (const [pattern, fact] of knowledgeRules) if (pattern.test(choice.text)) requireFacts([fact], here, choiceRoute, 'player text');
      requireFacts(choice.context?.reactionRequires, here, choiceRoute, 'NPC reaction');
      if (!choice.rationale.trim() || !choice.feedback?.brief.trim()) fail(choiceRoute, 'missing full/brief feedback');
      if (!choice.text.trim() || !choice.npcReaction.text.trim()) fail(choiceRoute, 'empty dialogue');
      if (choice.feedback?.detailed !== (choice.feedbackLevel === 'try_another')) fail(choiceRoute, 'feedback display does not match level');
      const explicitStop = /先不聊了|也先不聊了|我先下線了|先不要靠過來|我現在想先看書|我先休息/.test(choice.npcReaction.text);
      if ((choice.context?.endsInteraction || explicitStop) && graph.nodes[choice.nextNodeId]?.kind !== 'end') fail(choiceRoute, 'NPC ended interaction but route continues');
      walk(choice.nextNodeId, new Set([...here, ...(choice.context?.provides ?? [])]), nextRoute, [...choices, choice.id], [...transcript, node.npcText, `你：${choice.text}`, `對方：${choice.npcReaction.text}`]);
    }
  }
  if (graph.nodes[graph.startNodeId]?.kind !== 'decision') errors.push(`${scenario.id}: invalid start`);
  else walk(graph.startNodeId, new Set(scenario.initialFacts ?? []), [], [], []);
  for (const id of Object.keys(graph.nodes)) if (!reached.has(id)) errors.push(`${scenario.id}: unreachable node ${id}`);
  if (!paths.length) errors.push(`${scenario.id}: no terminal path`);
  return { valid: errors.length === 0, errors: [...new Set(errors)], paths, reachableNodes: reached.size };
}
