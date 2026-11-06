import type { FeedbackLevel } from './types.ts';

export const feedbackTitles: Record<FeedbackLevel, string> = {
  effective: '接得很好！',
  acceptable: '這樣回也可以！',
  try_another: '這句可以再調整',
};

import type { Answer, Choice, Scenario } from './types.ts';
import { graphFor } from './engine/dialogue.ts';
export function visibleFeedback(choice: Choice) {
  return choice.feedback ? {
    text: choice.feedback.detailed ? choice.rationale : choice.feedback.brief,
    detailed: !!choice.feedback.detailed,
  } : { text: choice.rationale, detailed: true };
}
// Keep the full authored feedback in records; show at most three encountered skills at a scene ending.
export function sceneFeedback(scenario: Scenario, difficulty: 1 | 2 | 3, answers: Answer[]): string[] {
  const graph = graphFor(scenario, difficulty), result: string[] = [], covered = new Set<string>();
  for (const answer of [...answers].reverse()) {
    if (answer.retried) continue;
    const node = graph.nodes[answer.nodeId];
    const choice = node?.kind === 'decision' ? node.choices.find(c => c.id === answer.choiceId) : undefined;
    if (!choice || choice.skillTags.every(s => covered.has(s))) continue;
    result.unshift(choice.rationale);
    choice.skillTags.forEach(s => covered.add(s));
    if (result.length === 3) break;
  }
  return result;
}
