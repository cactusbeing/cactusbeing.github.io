import { assessment } from '../data/assessment';
export function summarize(selected: readonly string[]) {
  const ids = new Set(selected);
  return assessment.map((category) => ({
    id: category.id,
    title: category.title,
    options: category.options.filter((option) => ids.has(option.id)),
  }));
}
export function exportAssessment(selected: readonly string[]): string {
  return (
    '\uFEFFFBA-行為功能評量\n\n' +
    summarize(selected)
      .map((category) => {
        let previous = '';
        return (
          category.title +
          '\n' +
          (category.options.length
            ? category.options
                .map((option) => {
                  const group =
                    option.group && previous !== option.group ? `${option.group}\n` : '';
                  previous = option.group;
                  return group + `- ${option.text}`;
                })
                .join('\n')
            : '尚未選取') +
          '\n'
        );
      })
      .join('\n')
  );
}
