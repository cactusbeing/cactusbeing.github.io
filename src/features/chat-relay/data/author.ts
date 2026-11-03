import type { Scenario, SkillTag, FeedbackLevel, Ending, DecisionNode, DialogueGraph } from '../types.ts';
// Content stays authored per scenario. This helper only connects named branches and derives score metadata.
export type Line = [text: string, reaction: string, rationale: string, skill: SkillTag | SkillTag[], level?: FeedbackLevel, ending?: Ending];
export type Step = [npcText: string, choices: Line[]];
export interface StorySeed { id: string; title: string; sceneId: Scenario['sceneId']; npcId: string; topic: string; setting: string; skillTags: SkillTag[]; start: Step; a: Step; b: Step; extra: Step; close: Step; easy: [Step, Step] }
function node(id: string, step: Step, targets: string[]): DecisionNode {
 return { id, kind: 'decision', npcText: step[0], npcEmotion: id === 'close' ? 'leaving' : 'neutral', choices: step[1].map((line, i) => {
 const tags = Array.isArray(line[3]) ? line[3] : [line[3]];
 const level = line[4] ?? 'effective';
 return { id: `${id}-${i}`, text: line[0], imageCue: tags[0], npcReaction: { text: line[1], emotion: level === 'try_another' ? 'thoughtful' : id === 'close' ? 'leaving' : 'happy' }, rationale: line[2], skillTags: tags, scores: Object.fromEntries(tags.map(t => [t, level === 'effective' ? 2 : level === 'acceptable' ? 1 : 0])), feedbackLevel: level, nextNodeId: targets[i] ?? targets[0] };
 }) };
}
export function story(s: StorySeed): Scenario {
 const nodes: DialogueGraph['nodes'] = {
 start: node('start', s.start, ['a', 'b', 'a']),
 a: node('a', s.a, ['extra']), b: node('b', s.b, ['extra']),
 extra: node('extra', s.extra, ['close']), close: node('close', s.close, s.close[1].map((_, i) => `end-${i}`)),
 };
 s.close[1].forEach((line, i) => { nodes[`end-${i}`] = { id: `end-${i}`, kind: 'end', closingText: line[1], ending: line[5] ?? (line[4] === 'try_another' ? 'repair' : line[4] === 'acceptable' ? 'brief' : 'respectful_close') }; });
 const easyNodes: DialogueGraph['nodes'] = { start: node('start', s.easy[0], ['close']), close: node('close', s.easy[1], s.easy[1][1].map((_, i) => `end-${i}`)) };
 s.easy[1][1].forEach((line, i) => { easyNodes[`end-${i}`] = { id: `end-${i}`, kind: 'end', closingText: line[1], ending: line[5] ?? (line[4] === 'try_another' ? 'repair' : 'respectful_close') }; });
 return { id: s.id, title: s.title, sceneId: s.sceneId, npcId: s.npcId, topic: s.topic, setting: s.setting, skillTags: s.skillTags, supportedDifficulties: [1,2,3], contentVersion: 1, startNodeId: 'start', nodes, easy: { startNodeId: 'start', nodes: easyNodes } };
}
