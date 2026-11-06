import type { Choice } from './progress';
import type { QuestionBlock } from './question-content';

export type QuestionSource = { year: number; subjectId: string; subjectName: string; questionId: number };
export type Question = {
  id: number;
  answer: Choice;
  accepted_answers?: Choice[];
  question: string;
  options: Record<Choice, string>;
  context?: string;
  image?: string;
  image_width?: number;
  image_height?: number;
  image_alt?: string;
  image_text?: string;
  body_blocks?: QuestionBlock[];
  option_columns?: 1 | 2;
  source?: QuestionSource;
};
export type Exam = {
  exam_metadata: { subject: string; source_page: string; parts?: { name: string; points: number }[] };
  multiple_choice_questions: Question[];
};

export function sourceLabel(question: Pick<Question, 'source'>): string {
  const source = question.source;
  return source ? `${source.year} 年｜${source.subjectName}｜第 ${source.questionId} 題` : '';
}

/** Shuffle once, without replacement; keep source IDs distinct from attempt IDs. */
export function sampleQuestions(pool: Question[], count: number, random = Math.random): Question[] {
  const unique = [...new Map(pool.map((question) => [question.source
    ? `${question.source.year}/${question.source.subjectId}/${question.source.questionId}`
    : `question/${question.id}`, question])).values()];
  if (!Number.isInteger(count) || count < 1 || count > unique.length)
    throw new Error(`請輸入 1 至 ${unique.length} 之間的整數題數。`);
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }
  return unique.slice(0, count).map((question, index) => ({ ...question, id: index + 1 }));
}

export function remainingSeconds(deadline: number | null, now: number): number {
  return deadline === null ? 0 : Math.max(0, Math.ceil((deadline - now) / 1000));
}

export function formatCountdown(seconds: number): string {
  const value = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(value / 60).toString().padStart(2, '0')}:${(value % 60).toString().padStart(2, '0')}`;
}
