import { readResponses } from './progress.ts';
import type { Choice } from './progress';
import type { ExamHistoryEntry, QuestionOutcome, Year } from './progress';
import type { Exam, Question, QuestionSource } from './session';

const mistakeKey = 'cactusbeing-exam-mistakes-v1';
// Missing = legacy record; null = this attempt explicitly ended without an answer.
export type MistakeAnswer = Choice | null;
type Mistake = QuestionSource & { resolved: boolean; userAnswer?: MistakeAnswer };
export type WrongBookGroup = { id: string; name: string; questions: { question: Question; userAnswer?: MistakeAnswer }[] };
type Mistakes = Record<string, Mistake>;
export function sourceKey(source: QuestionSource): string {
  return `${source.year}/${source.subjectId}/${source.questionId}`;
}

// Some manifest IDs cover different shared categories or renamed subjects across years.
export function subjectGroupKey(source: Pick<QuestionSource, 'subjectId' | 'subjectName'>): string {
  return JSON.stringify([source.subjectId, source.subjectName]);
}

export function mistakeAnswerLabel(answer: MistakeAnswer | undefined): string {
  return answer === undefined ? '無歷史作答紀錄' : answer === null ? '未作答／未提交' : answer;
}

export function groupWrongQuestions(pool: Question[], answers: Record<string, MistakeAnswer>): WrongBookGroup[] {
  const groups = new Map<string, WrongBookGroup>();
  for (const question of pool) {
    const source = question.source;
    if (!source) continue;
    const id = subjectGroupKey(source);
    const group = groups.get(id) ?? { id, name: source.subjectName, questions: [] };
    group.questions.push({ question, userAnswer: answers[sourceKey(source)] });
    groups.set(id, group);
  }
  return [...groups.values()].map(group => ({ ...group,
    questions: group.questions.sort((a, b) => (b.question.source?.year ?? 0) - (a.question.source?.year ?? 0) || a.question.id - b.question.id),
  })).sort((a, b) => a.name.localeCompare(b.name, 'zh-TW'));
}

function readMistakes(): Mistakes {
  const parsed: unknown = JSON.parse(localStorage.getItem(mistakeKey) || '{}');
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('錯題紀錄格式錯誤');
  return Object.fromEntries(Object.entries(parsed).filter(([key, value]) => {
    const item = value as Partial<Mistake> | null;
    return item && Number.isInteger(item.year) && typeof item.subjectId === 'string' &&
      typeof item.subjectName === 'string' && Number.isInteger(item.questionId) &&
      typeof item.resolved === 'boolean' && (item.userAnswer === undefined || item.userAnswer === null || ['A', 'B', 'C', 'D'].includes(item.userAnswer)) &&
      key === sourceKey(item as Mistake);
  })) as Mistakes;
}

export function readMistakeAnswers(): Record<string, MistakeAnswer> {
  try {
    return Object.fromEntries(Object.entries(readMistakes()).flatMap(([key, item]) =>
      item.userAnswer !== undefined ? [[key, item.userAnswer]] : []));
  } catch { return {}; }
}

/** Keep resolved markers so old paper answers cannot resurrect defeated questions. */
export function recordOutcome(source: QuestionSource, correct: boolean, userAnswer: MistakeAnswer = null): boolean {
  try {
    const mistakes = readMistakes();
    const key = sourceKey(source);
    mistakes[key] = { ...source, resolved: correct, userAnswer };
    localStorage.setItem(mistakeKey, JSON.stringify(mistakes));
    return true;
  } catch { return false; }
}

export async function loadRevengePool(years: Year[], load: (path: string) => Promise<Exam>, signal?: AbortSignal): Promise<Question[]> {
  signal?.throwIfAborted();
  const mistakes = readMistakes();
  // Only fetch papers with saved answers or outstanding mistakes, rather than the entire bank.
  const papers = years.flatMap(({ year, sitting, subjects }) => subjects.map(subject => ({
    year, sitting, subject, responses: readResponses(year, subject.id),
  }))).filter(({ year, subject, responses }) => Object.keys(responses).length ||
    Object.values(mistakes).some(item => !item.resolved && item.year === year && item.subjectId === subject.id));
  const candidates = (await Promise.all(papers.map(async ({ year, sitting, subject, responses }) => {
    const data = await load(subject.data);
    if (!Array.isArray(data.multiple_choice_questions)) throw new Error('題庫格式錯誤');
    return data.multiple_choice_questions.flatMap(question => {
      const source = { year, ...(sitting ? { sitting } : {}), subjectId: subject.id, subjectName: subject.name, questionId: question.id };
      const key = sourceKey(source);
      const answer = responses[question.id];
      if (answer && !mistakes[key] && !(question.accepted_answers?.length ? question.accepted_answers : [question.answer]).includes(answer))
        mistakes[key] = { ...source, resolved: false };
      return [{ ...question, source }];
    });
  }))).flat();
  // A response may be submitted while bank fetches are in flight. Newer ledger entries win.
  signal?.throwIfAborted();
  const latest = { ...mistakes, ...readMistakes() };
  localStorage.setItem(mistakeKey, JSON.stringify(latest));
  return candidates.filter(question => latest[sourceKey(question.source)] && !latest[sourceKey(question.source)].resolved);
}

export function validOutcomes(entry: ExamHistoryEntry): QuestionOutcome[] {
  if (!Array.isArray(entry.outcomes) || entry.outcomes.length !== entry.total) return [];
  const valid = entry.outcomes.filter(item => item && Number.isInteger(item.year) &&
    typeof item.subjectId === 'string' && typeof item.subjectName === 'string' &&
    Number.isInteger(item.questionId) && typeof item.correct === 'boolean');
  return valid.length === entry.total && valid.filter(item => item.correct).length === entry.correct ? valid : [];
}

export function practiceStats(history: ExamHistoryEntry[], now = new Date()) {
  const bySubject = new Map<string, { id: string; name: string; correct: number; total: number; attempts: number; best: number; latest: number | null; latestAt: string }>();
  let unclassified = 0;
  for (const entry of history) {
    const outcomes = validOutcomes(entry);
    const parts = new Map<string, { name: string; correct: number; total: number }>();
    if (outcomes.length) {
      for (const outcome of outcomes) {
        const part = parts.get(outcome.subjectId) ?? { name: outcome.subjectName, correct: 0, total: 0 };
        part.total++;
        if (outcome.correct) part.correct++;
        parts.set(outcome.subjectId, part);
      }
    } else if (entry.mode !== 'random' && entry.mode !== 'revenge') {
      parts.set(entry.subjectId, { name: entry.subjectName, correct: entry.correct, total: entry.total });
    } else { unclassified += entry.total; }
    for (const [id, part] of parts) {
      if (!part.total) continue;
      const row = bySubject.get(id) ?? { id, name: part.name, correct: 0, total: 0, attempts: 0, best: 0, latest: null, latestAt: '' };
      row.correct += part.correct;
      row.total += part.total;
      row.attempts++;
      row.best = Math.max(row.best, part.correct / part.total * 100);
      if (row.latest === null || (entry.completedAt ?? '') > row.latestAt) {
        row.latest = part.correct / part.total * 100;
        row.latestAt = entry.completedAt ?? '';
        row.name = part.name;
      }
      bySubject.set(id, row);
    }
  }
  const since = new Date(now);
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - 6);
  const recent = history.filter(entry => entry.completedAt && new Date(entry.completedAt) >= since && new Date(entry.completedAt) <= now);
  const sum = (items: ExamHistoryEntry[], key: 'correct' | 'total') => items.reduce((total, entry) => total + entry[key], 0);
  const total = sum(history, 'total');
  const recentTotal = sum(recent, 'total');
  const revenge = history.filter(entry => entry.mode === 'revenge');
  return {
    total, correct: sum(history, 'correct'), accuracy: total ? sum(history, 'correct') / total * 100 : null,
    recentAttempts: recent.length, recentTotal,
    recentAccuracy: recentTotal ? sum(recent, 'correct') / recentTotal * 100 : null,
    revengeAttempts: revenge.length, revengeWins: revenge.filter(entry => entry.correct === entry.total).length,
    revengeCorrect: sum(revenge, 'correct'), unclassified,
    subjects: [...bySubject.values()].sort((a, b) => a.correct / a.total - b.correct / b.total || a.name.localeCompare(b.name, 'zh-TW')),
  };
}
