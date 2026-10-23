import { stories, type Choice, type Story } from '../data/stories';
import { supportDraft, supportSceneDraft } from '../data/supportDraft';
export type RunSlot = { id: string; variant: 0 | 1; time: string; period: string; delay: number };
export function newRunSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] || 1;
}
export function randomStream(seed: number) {
  let n = seed >>> 0;
  return () => {
    n += 0x6d2b79f5;
    let x = n;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
export function makeSchedule(seed: number): RunSlot[] {
  const random = randomStream(seed);
  const classes = seed && random() < 0.5 ? ['hearing', 'learning'] : ['learning', 'hearing'];
  const ids = ['vision', 'mutism', ...classes, 'emotion', 'intellectual', 'mobility', 'autism'];
  const windows = [
    [445, 465],
    [470, 490],
    [500, 540],
    [555, 595],
    [605, 620],
    [725, 760],
    [790, 840],
    [905, 925],
  ];
  const periods = [
    '進校門',
    '晨間活動',
    '上午第一節',
    '上午第二節',
    '下課',
    '午餐後',
    '體育課',
    '放學前',
  ];
  return ids.map((id, i) => {
    const minute = windows[i][0] + Math.floor(random() * (windows[i][1] - windows[i][0] + 1));
    return {
      id,
      variant: seed ? (random() < 0.5 ? 0 : 1) : 0,
      time: `${Math.floor(minute / 60)
        .toString()
        .padStart(2, '0')}:${(minute % 60).toString().padStart(2, '0')}`,
      period: periods[i],
      delay: seed ? 2000 + Math.floor(random() * 4000) : 0,
    };
  });
}
export function reportChoices(id: string, variant: number): Choice[] {
  return supportDraft[id].options.map((c) => ({
    ...c,
    text: variant === 1 && c.textVariantB ? c.textVariantB : c.text,
    next: supportDraft[id].returnNarration,
  }));
}
export function choicesFor(story: Story, variant: number, step: number): Choice[] {
  if (step === 1) return reportChoices(story.id, variant);
  return step === 0 ? story.choices : story.second;
}
export function shuffledChoices(
  choices: Choice[],
  seed: number,
  id: string,
  step: number,
): Choice[] {
  if (!seed) return choices;
  const hash = [...id].reduce((sum, c) => Math.imul(sum, 31) + c.charCodeAt(0), step);
  const random = randomStream(seed ^ hash);
  const result = [...choices];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function scheduledStory(slot: RunSlot): Story {
  const base = stories.find((s) => s.id === slot.id)!,
    scene = supportSceneDraft[slot.id],
    variant = scene.variants[slot.variant];
  return {
    ...base,
    time: slot.time,
    period: slot.period,
    title: variant.title,
    intro: variant.intro,
    question: scene.actionQuestion,
    choices: scene.actionChoices,
    followup:
      'returnQuestion' in variant && variant.returnQuestion
        ? variant.returnQuestion
        : scene.returnQuestion,
    second:
      'returnChoices' in variant && variant.returnChoices
        ? variant.returnChoices
        : scene.returnChoices,
  };
}
export function returnNarration(slot: RunSlot) {
  const variant = supportSceneDraft[slot.id].variants[slot.variant];
  return 'returnNarration' in variant && variant.returnNarration
    ? variant.returnNarration
    : supportDraft[slot.id].returnNarration;
}
export function eventCaptions(slot: RunSlot): [string, string] {
  return supportSceneDraft[slot.id].variants[slot.variant].captions;
}
