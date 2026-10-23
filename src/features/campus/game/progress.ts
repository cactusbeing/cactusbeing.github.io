import { stories } from '../data/stories';
import { supportDraft } from '../data/supportDraft';
import {
  adults,
  arrivals,
  canStand,
  createNpcs,
  landmarks,
  START,
  type Destination,
  type MapId,
  type Position,
} from './world';
import { choicesFor, makeSchedule, scheduledStory, type RunSlot } from './schedule';
export const SAVE_KEY = 'cactusbeing-campus-day-v3';
export type Decision = {
  storyId: string;
  step: 0 | 1 | 2;
  choice: number;
  map: MapId;
  position: Position;
};
export type Progress = {
  version: 3;
  seed: number;
  schedule: RunSlot[];
  revealed: string[];
  position: Position;
  map: MapId;
  completed: string[];
  visited: string[];
  decisions: Decision[];
  status: 'playing' | 'failed' | 'finished';
};
export function freshProgress(seed = 0): Progress {
  return {
    version: 3,
    seed: seed >>> 0,
    schedule: makeSchedule(seed),
    revealed: [],
    position: { ...START },
    map: 'campus',
    completed: [],
    visited: [],
    decisions: [],
    status: 'playing',
  };
}
export function runStories(progress: Progress) {
  return progress.schedule.map(scheduledStory);
}
export function currentSlot(progress: Progress) {
  return progress.schedule[progress.completed.length] || null;
}
export function currentStep(progress: Progress) {
  return progress.decisions.length % 3;
}
export function currentStory(progress: Progress) {
  const slot = currentSlot(progress);
  return slot ? scheduledStory(slot) : null;
}
export function revealEvent(progress: Progress): Progress {
  const slot = currentSlot(progress);
  return progress.status === 'playing' && slot && !progress.revealed.includes(slot.id)
    ? { ...progress, revealed: [...progress.revealed, slot.id] }
    : progress;
}
export function reportDestination(id: string): Destination {
  const map = supportDraft[id].destination;
  const adult = adults.find((a) => a.map === map)!;
  return { ...adult, label: `${supportDraft[id].destinationLabel}・${supportDraft[id].teacher}` };
}
export function questDestination(progress: Progress): Destination {
  const story = currentStory(progress);
  if (!story) return { id: 'gate', map: 'campus', ...START, label: '南門・放學' };
  if (currentStep(progress) === 1) return reportDestination(story.id);
  if (!progress.revealed.includes(story.id))
    return {
      id: 'prepare',
      map: story.map,
      ...arrivals[story.map],
      label: `準備${currentSlot(progress)!.period}`,
    };
  return { id: story.id, map: story.map, x: story.x, y: story.y, label: story.name };
}
export function optionFor(
  progress: Progress,
  decision: Pick<Decision, 'storyId' | 'step' | 'choice'>,
) {
  const slot = progress.schedule.find((s) => s.id === decision.storyId);
  return slot
    ? choicesFor(scheduledStory(slot), slot.variant, decision.step)[decision.choice]
    : undefined;
}
export function recordChoice(
  progress: Progress,
  storyId: string,
  step: number,
  choice: number,
): Progress {
  const story = currentStory(progress),
    slot = currentSlot(progress);
  if (
    progress.status !== 'playing' ||
    !story ||
    !slot ||
    story.id !== storyId ||
    !progress.revealed.includes(storyId) ||
    step !== currentStep(progress) ||
    !Number.isInteger(choice)
  )
    return progress;
  const target = step === 1 ? reportDestination(storyId) : story;
  if (
    progress.map !== target.map ||
    Math.hypot(progress.position.x - target.x, progress.position.y - target.y) >
      (step === 1 ? 65 : 110)
  )
    return progress;
  const option = choicesFor(story, slot.variant, step)[choice];
  if (!option) return progress;
  return {
    ...progress,
    decisions: [
      ...progress.decisions,
      {
        storyId,
        step: step as 0 | 1 | 2,
        choice,
        map: progress.map,
        position: { ...progress.position },
      },
    ],
    completed: option.correct && step === 2 ? [...progress.completed, storyId] : progress.completed,
    status: option.correct ? 'playing' : 'failed',
  };
}
export function atGate(p: Position) {
  return p.y >= 548 && p.x >= 444 && p.x <= 520;
}
export function finishDay(progress: Progress): Progress {
  return progress.status === 'playing' &&
    progress.completed.length === stories.length &&
    progress.map === 'campus' &&
    atGate(progress.position)
    ? { ...progress, status: 'finished' }
    : progress;
}
const maps: MapId[] = ['campus', 'classroom', 'playground', 'office'];
export function parseProgress(raw: string | null, fallbackSeed = 0): Progress {
  try {
    const data = JSON.parse(raw || 'null');
    if (
      !data ||
      data.version !== 3 ||
      !Number.isInteger(data.seed) ||
      data.seed < 0 ||
      data.seed > 4294967295
    )
      return freshProgress(fallbackSeed);
    let progress = freshProgress(data.seed);
    for (const decision of Array.isArray(data.decisions) ? data.decisions.slice(0, 24) : []) {
      if (
        !decision ||
        !maps.includes(decision.map) ||
        !decision.position ||
        !Number.isFinite(decision.position.x) ||
        !Number.isFinite(decision.position.y)
      )
        break;
      progress = revealEvent(progress);
      const before = progress;
      progress = { ...progress, map: decision.map, position: { ...decision.position } };
      const next = recordChoice(progress, decision.storyId, decision.step, decision.choice);
      if (next === progress) {
        progress = before;
        break;
      }
      progress = next;
      if (progress.status === 'failed') break;
    }
    const slot = currentSlot(progress);
    if (slot && Array.isArray(data.revealed) && data.revealed.includes(slot.id))
      progress = revealEvent(progress);
    const map: MapId = maps.includes(data.map) ? data.map : 'campus',
      p = data.position;
    progress.map = map;
    progress.position =
      p && Number.isFinite(p.x) && Number.isFinite(p.y) && canStand(p, map, [])
        ? { x: p.x, y: p.y }
        : { ...arrivals[map] };
    if (
      !canStand(
        progress.position,
        map,
        createNpcs().filter((n) => n.map === map),
      )
    )
      progress.position = { ...arrivals[map] };
    progress.visited = Array.isArray(data.visited)
      ? [
          ...new Set<string>(
            data.visited.filter(
              (id: unknown): id is string =>
                typeof id === 'string' && landmarks.some((l) => l.id === id),
            ),
          ),
        ]
      : [];
    if (data.status === 'finished') progress = finishDay(progress);
    return progress;
  } catch {
    return freshProgress(fallbackSeed);
  }
}
