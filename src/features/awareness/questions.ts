export interface AwarenessOption {
  id: string;
  text: string;
  feedback: string;
}
export interface AwarenessQuestion {
  id: string;
  scenario: string;
  options: AwarenessOption[];
  note: string;
}
export const questions: AwarenessQuestion[] = [
  {
    id: 'participate',
    scenario: '小組活動開始了。一位同學還沒加入，你可以怎麼邀請他？',
    options: [
      {
        id: 'ask',
        text: '先問問他想怎麼參與，再一起分配工作。',
        feedback: '先聽聽對方的想法，能讓參與的方式更貼近他的需要。',
      },
      {
        id: 'decide',
        text: '直接替他選一項看起來簡單的工作。',
        feedback: '你希望讓他參與。也可以先詢問他的意願，讓他有選擇的機會。',
      },
    ],
    note: '每個人的喜好與需要不同，試著先詢問，再提供支持。',
  },
  {
    id: 'communication',
    scenario: '同學需要多一點時間表達想法。你會怎麼做？',
    options: [
      {
        id: 'wait',
        text: '留一點時間，問他希望用什麼方式表達。',
        feedback: '等待與詢問，能讓彼此更有機會理解對方。',
      },
      {
        id: 'finish',
        text: '為了幫忙，直接替他把話說完。',
        feedback: '你可能想幫忙。先確認對方是否需要協助，可以更尊重他的表達。',
      },
    ],
    note: '表達可以有不同的方式，也可以有不同的步調。',
  },
];
export interface AwarenessState {
  index: number;
  selected: string | null;
  complete: boolean;
}
export const initialAwarenessState = (): AwarenessState => ({
  index: 0,
  selected: null,
  complete: false,
});
export function selectAnswer(state: AwarenessState, id: string): AwarenessState {
  if (
    state.complete ||
    state.selected ||
    !questions[state.index]?.options.some((option) => option.id === id)
  )
    return state;
  return { ...state, selected: id };
}
export function nextQuestion(state: AwarenessState): AwarenessState {
  if (!state.selected || state.complete) return state;
  if (state.index + 1 >= questions.length) return { ...state, complete: true };
  return { index: state.index + 1, selected: null, complete: false };
}
