import { createApp, h, nextTick } from 'vue';
import html2canvas from 'html2canvas';
import MathQuestionContent from './MathQuestionContent.vue';
import MathText from './MathText.vue';
import type { QuestionBlock } from './question-content';

type MathQuestion = {
  id: number;
  body_blocks: QuestionBlock[];
  options: Record<string, string>;
  option_columns?: 1 | 2;
  answer: string;
  accepted_answers?: string[];
};

export async function renderMathQuestion(question: MathQuestion, answer: string, width: number) {
  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.inert = true;
  Object.assign(container.style, {
    position: 'fixed', left: '0', top: '0', zIndex: '-10000',
    width: width + 'px', padding: '0', background: '#ffffff',
    color: '#24372b', fontFamily: 'sans-serif', fontSize: '29px',
    lineHeight: '1.85', pointerEvents: 'none',
  });
  document.body.append(container);
  const app = createApp({
    render: () => h('article', { style: { padding: '12px 0 20px' } }, [
      h('p', { style: { margin: '0 0 18px', fontSize: '32px', fontWeight: '700', color: '#2f6348' } }, '第 ' + question.id + ' 題'),
      h(MathQuestionContent, { blocks: question.body_blocks }),
      h('div', { style: {
        display: 'grid', gridTemplateColumns: question.option_columns === 2 ? 'repeat(2, minmax(0, 1fr))' : '1fr',
        gap: '14px 24px', marginTop: '24px', marginBottom: '20px',
      } }, ['A', 'B', 'C', 'D'].map((choice) => h('div', {
        style: { display: 'flex', gap: '16px', alignItems: 'center', padding: '8px 0', minWidth: '0' },
      }, [
        h('strong', { style: { color: '#2f6348', flexShrink: '0' } }, choice),
        h(MathText, { text: question.options[choice] ?? '' }),
      ]))),
      h('p', { style: { margin: '12px 0 0', color: '#9b3c32', fontWeight: '700', fontSize: '28px' } },
        '你的答案：' + answer + '　參考答案：' + (question.accepted_answers ?? [question.answer]).join(' 或 ')),
    ]),
  });
  try {
    app.mount(container);
    await nextTick();
    await Promise.all(Array.from(container.querySelectorAll('img')).map((image) => image.decode()));
    await document.fonts.ready;
    return await html2canvas(container, {
      backgroundColor: '#ffffff', scale: 1.5, logging: false,
      windowWidth: 1280, scrollX: 0, scrollY: 0,
      ignoreElements: (element) => element.classList.contains('katex-mathml'),
    });
  } finally {
    app.unmount();
    container.remove();
  }
}
