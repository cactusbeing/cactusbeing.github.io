import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sampleQuestions, sourceLabel, remainingSeconds, formatCountdown } from '../src/features/exam/session.ts';

const manifest = JSON.parse(readFileSync(new URL('../assets/exams/index.json', import.meta.url)));
const pool = manifest.years.flatMap(({ year, sitting, subjects }) => subjects.flatMap(subject => {
  const exam = JSON.parse(readFileSync(new URL('..' + subject.data, import.meta.url)));
  return exam.multiple_choice_questions.map(question => ({ ...question,
    source: { year, ...(sitting ? { sitting } : {}), subjectId: subject.id, subjectName: subject.name, questionId: question.id },
  }));
}));
const before = JSON.stringify(pool);
const selected = sampleQuestions(pool, pool.length, () => 0.25);
assert.equal(selected.length, pool.length);
assert.equal(new Set(selected.map(sourceLabel)).size, pool.length, 'Each original question appears once');
assert.equal(JSON.stringify(pool), before, 'Sampling does not modify the bank');
assert.deepEqual(selected.map(q => q.id), Array.from({ length: pool.length }, (_, i) => i + 1));
const originals = new Map(pool.map(q => [sourceLabel(q), q]));
for (const question of selected) {
  const { id, ...original } = originals.get(sourceLabel(question));
  const { id: attemptId, ...sampled } = question;
  assert.deepEqual(sampled, original, 'Answers, alternate accepted answers, reading text, images and math blocks survive sampling');
}
const chinese = pool.filter(q => q.source.subjectId === 'chinese' && [114, 115].includes(q.source.year));
const filtered = sampleQuestions(chinese, 30);
assert.equal(filtered.length, 30);
assert.ok(filtered.every(q => q.source.subjectId === 'chinese' && [114, 115].includes(q.source.year)));
assert.equal(sampleQuestions([chinese[0], chinese[0]], 1).length, 1);
assert.throws(() => sampleQuestions([chinese[0], chinese[0]], 2));
for (const invalid of [0, -1, 1.5, NaN, Infinity, pool.length + 1]) assert.throws(() => sampleQuestions(pool, invalid));
assert.equal(remainingSeconds(61000, 1000), 60);
assert.equal(remainingSeconds(61000, 60999), 1);
assert.equal(remainingSeconds(61000, 61000), 0);
assert.equal(remainingSeconds(61000, 99999), 0);
assert.equal(remainingSeconds(null, 0), 0);
assert.equal(formatCountdown(60), '01:00');
assert.equal(formatCountdown(3600), '60:00');
assert.equal(formatCountdown(0), '00:00');
assert.equal(formatCountdown(-1), '00:00');
console.log(`Exam domain checks passed (${pool.length} source questions).`);

// Early papers have separate kindergarten Chinese papers and different point totals.
const { categoriesForYear, examYearLabel, subjectCategoryLabel, subjectGroups } = await import('../src/features/exam/classification.ts');
for (const [yearNumber, total] of [[108, 520], [109, 520], [110, 401]]) {
  const year = manifest.years.find(item => item.year === yearNumber);
  assert.ok(year, `Missing ${yearNumber} all-category bank`);
  assert.equal(year.subjects.length, 16);
  assert.equal(year.subjects.reduce((sum, subject) => sum + subject.count, 0), total);
  assert.equal(categoriesForYear(year).length, 5);
  for (const category of categoriesForYear(year)) {
    const subjects = subjectGroups(year, category.id).flatMap(group => group.subjects);
    assert.equal(subjects.length, category.id === 'primary' ? 5 : 4);
    assert.equal(subjects.filter(subject => subject.id.startsWith('chinese')).length, 1);
    assert.equal(subjects.find(subject => subject.id.startsWith('chinese')).id,
      category.id === 'kindergarten' ? 'chinese-kindergarten' : 'chinese');
  }
  assert.notEqual(subjectCategoryLabel(year.subjects.find(subject => subject.id === 'chinese'), year), '全類科共用');
  assert.ok(year.subjects.every(subject => subject.points === (yearNumber < 110 ? 60 : subject.id === 'math' ? 52 : 50)));
}
const latestYear = manifest.years.find(year => year.year === 115);
assert.equal(subjectCategoryLabel(latestYear.subjects.find(subject => subject.id === 'chinese'), latestYear), '全類科共用');
assert.equal(examYearLabel(108, '第二次考試'), '108 年（第二次考試）');
assert.ok(sourceLabel(pool.find(question => question.source.year === 108)).startsWith('108 年（第二次考試）｜'));
console.log('Early exams verified (48 papers, 1,441 questions, five categories, separate Chinese papers, original points and sitting labels).');

// The optional metadata must remain compatible with old browser history.
const { readHistory, readResponses, saveHistoryEntry, responseStorageKey } = await import('../src/features/exam/progress.ts');
const store = new Map();
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
  getItem: key => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, value),
} });
const oldEntry = { id: 'legacy', year: 115, subjectId: 'chinese', subjectName: '國語文能力測驗', correct: 1, total: 25, completedAt: null };
store.set('cactusbeing-exam-history-v1', JSON.stringify([oldEntry]));
assert.deepEqual(readHistory(), [oldEntry]);
assert.ok(saveHistoryEntry({ ...oldEntry, mode: 'random', years: [115, 114], maxScore: 100, score: 4 }));
assert.deepEqual(readHistory()[0].years, [115, 114]);
store.set('cactusbeing-exam-history-v1', JSON.stringify([{ ...oldEntry, years: 'broken' }, oldEntry]));
assert.deepEqual(readHistory(), [oldEntry]);
store.set(responseStorageKey(115, 'chinese'), JSON.stringify({ 1: 'A', 2: 'invalid' }));
assert.deepEqual(readResponses(115, 'chinese'), { 1: 'A' });
console.log('Exam storage checks passed (legacy history, random metadata, corrupt optional fields, practice answers).');

// Persistent mistakes preserve source identity, alternate answers and resolved markers.
const { loadRevengePool, recordOutcome, practiceStats, sourceKey } = await import('../src/features/exam/training.ts');
store.clear();
const fixtureSubject = { id: 'fixture', name: '測試科目', count: 3, data: '/fixture.json' };
const fixtureYears = [{ year: 115, subjects: [fixtureSubject] }];
const fixtureExam = { exam_metadata: { subject: fixtureSubject.name, source_page: '' }, multiple_choice_questions: [
  { id: 1, answer: 'A', question: 'one', options: {} },
  { id: 2, answer: 'B', accepted_answers: ['B', 'D'], question: 'two', options: {} },
  { id: 3, answer: 'C', question: 'three', options: {} },
] };
store.set(responseStorageKey(115, 'fixture'), JSON.stringify({ 1: 'B', 2: 'D' }));
let calls = 0;
const fixtureLoad = async path => { assert.equal(path, fixtureSubject.data); calls++; return fixtureExam; };
const revengePool = await loadRevengePool(fixtureYears, fixtureLoad);
assert.equal(calls, 1);
assert.deepEqual(revengePool.map(q => q.source.questionId), [1], 'Alternate accepted answer is not a mistake');
assert.equal(recordOutcome(revengePool[0].source, true), true);
assert.equal((await loadRevengePool(fixtureYears, fixtureLoad)).length, 0, 'Defeated mistake does not return from old paper progress');
assert.equal(readResponses(115, 'fixture')[1], 'B', 'Revenge does not overwrite original paper responses');
recordOutcome(revengePool[0].source, false);
assert.equal((await loadRevengePool(fixtureYears, fixtureLoad)).length, 1, 'A new wrong answer reactivates its mistake');
// Mid-fetch updates must not be overwritten by a stale migration snapshot.
await loadRevengePool(fixtureYears, async () => { recordOutcome(revengePool[0].source, true); return fixtureExam; });
assert.equal((await loadRevengePool(fixtureYears, fixtureLoad)).length, 0);
store.set('cactusbeing-exam-mistakes-v1', '{}');
await loadRevengePool(fixtureYears, async () => { recordOutcome(revengePool[0].source, true); return fixtureExam; });
assert.equal((await loadRevengePool(fixtureYears, fixtureLoad)).length, 0, 'Correct first observation wins over an in-flight legacy migration');
const source = { year: 114, subjectId: 'fixture', subjectName: '測試科目', questionId: 3 };
assert.notEqual(sourceKey(source), sourceKey(revengePool[0].source));
store.set('cactusbeing-exam-mistakes-v1', '{bad json');
assert.equal(recordOutcome(source, false), false, 'Storage errors are reported instead of silently resetting the ledger');
await assert.rejects(() => loadRevengePool(fixtureYears, fixtureLoad));
store.clear();
const statsHistory = [
  { ...oldEntry, correct: 8, total: 10, completedAt: '2026-11-05T10:00:00+08:00' },
  { ...oldEntry, id: 'mix', subjectId: 'random', mode: 'random', correct: 1, total: 2, completedAt: '2026-11-06T10:00:00+08:00', outcomes: [
    { year: 114, subjectId: 'chinese', subjectName: '國語文能力測驗', questionId: 1, correct: false },
    { year: 115, subjectId: 'math', subjectName: '數學能力測驗', questionId: 1, correct: true },
  ] },
  { ...oldEntry, id: 'revenge', subjectId: 'revenge', mode: 'revenge', correct: 1, total: 1, completedAt: '2026-10-01T10:00:00+08:00', outcomes: [
    { year: 115, subjectId: 'chinese', subjectName: '國語文能力測驗', questionId: 1, correct: true },
  ] },
  { ...oldEntry, id: 'old-random', subjectId: 'random', mode: 'random', correct: 1, total: 3, completedAt: null },
];
const stats = practiceStats(statsHistory, new Date('2026-11-06T12:00:00+08:00'));
assert.equal(stats.total, 16);
assert.equal(stats.correct, 11);
assert.equal(stats.accuracy, 11 / 16 * 100, 'Accuracy is weighted by questions, not an average of exam percentages');
assert.equal(stats.recentAttempts, 2);
assert.equal(stats.recentTotal, 12);
assert.equal(stats.revengeWins, 1);
assert.equal(stats.unclassified, 3, 'Old mixed papers are not falsely assigned to a subject');
assert.deepEqual(stats.subjects.map(s => [s.id, s.correct, s.total, s.attempts]), [['chinese', 9, 12, 3], ['math', 1, 1, 1]]);
assert.equal(practiceStats([]).accuracy, null, 'Empty history has no fabricated percentage');
assert.ok(saveHistoryEntry({ ...oldEntry, mode: 'revenge', outcomes: statsHistory[2].outcomes }));
assert.equal(readHistory()[0].mode, 'revenge');
console.log('Exam training checks passed (legacy migration, alternate answers, resolved mistakes, concurrency, weighted subject statistics).');
