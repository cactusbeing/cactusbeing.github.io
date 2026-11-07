import type { ExamCategory, Subject, Year } from './progress';

export function examYearLabel(year: number, sitting?: string): string {
  return `${year} 年${sitting ? `（${sitting}）` : ''}`;
}

export function categoriesForYear(year?: Year): ExamCategory[] {
  if (!year) return [];
  return year.categories ?? [{ id: 'special-disability', name: '特教・身心障礙組' }];
}

export function subjectCategories(subject: Subject, year: Year): string[] {
  return subject.categories ?? (subject.id === 'chinese'
    ? categoriesForYear(year).map((category) => category.id)
    : ['special-disability']);
}

export function subjectCategoryLabel(subject: Subject, year: Year): string {
  const ids = subjectCategories(subject, year);
  if (categoriesForYear(year).every((category) => ids.includes(category.id))) return '全類科共用';
  if (ids.length === 2 && ids.includes('special-disability') && ids.includes('special-gifted'))
    return '特教兩組共用';
  return categoriesForYear(year).filter((category) => ids.includes(category.id))
    .map((category) => category.name).join('、');
}

export function subjectGroups(year?: Year, category = 'all') {
  if (!year) return [];
  const subjects = year.subjects.filter((subject) =>
    category === 'all' || subjectCategories(subject, year).includes(category));
  return ([
    { id: 'common', name: '共同科目' },
    { id: 'professional', name: '專業科目' },
  ] as const).map((group) => ({
    ...group,
    subjects: subjects.filter((subject) =>
      (subject.section ?? (['chinese', 'education'].includes(subject.id) ? 'common' : 'professional')) === group.id),
  })).filter((group) => group.subjects.length > 0);
}
