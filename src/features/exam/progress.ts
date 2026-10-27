export type Choice = 'A' | 'B' | 'C' | 'D';
export type Subject = { id: string; name: string; count: number; data: string };
export type Year = { year: number; subjects: Subject[] };
export type Responses = Record<number, Choice>;
export type ExamHistoryEntry = {
  id: string;
  year: number;
  subjectId: string;
  subjectName: string;
  correct: number;
  total: number;
  completedAt: string | null;
};

const historyKey = 'cactusbeing-exam-history-v1';

export function responseStorageKey(year: number, subjectId: string): string {
  return `cactusbeing-exam-${year}-${subjectId}-v1`;
}

export function readResponses(year: number, subjectId: string): Responses {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(responseStorageKey(year, subjectId)) || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([id, answer]) => /^\d+$/.test(id) && ['A', 'B', 'C', 'D'].includes(String(answer)),
      ),
    ) as Responses;
  } catch {
    return {};
  }
}

export function answeredCount(year: number, subject: Subject): number {
  const responses = readResponses(year, subject.id);
  return Object.keys(responses).filter((id) => Number(id) > 0 && Number(id) <= subject.count).length;
}

export function readHistory(): ExamHistoryEntry[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(historyKey) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is ExamHistoryEntry =>
      Boolean(entry && typeof entry === 'object' && typeof entry.id === 'string' &&
        Number.isInteger(entry.year) && typeof entry.subjectId === 'string' &&
        typeof entry.subjectName === 'string' && Number.isInteger(entry.correct) &&
        Number.isInteger(entry.total) && (entry.completedAt === null || typeof entry.completedAt === 'string')),
    );
  } catch {
    return [];
  }
}

export function saveHistoryEntry(entry: Omit<ExamHistoryEntry, 'id'>): boolean {
  try {
    const history = readHistory();
    history.unshift({ ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` });
    localStorage.setItem(historyKey, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}
