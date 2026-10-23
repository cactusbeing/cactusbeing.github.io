import type { Session } from './types';
import { averageInterval } from './calculations';
export function csvCell(value: string): string {
  const safe = /^[\s\uFEFF]*[=+\-@\t\r\n]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}
export function localDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function localTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
export function exportCsv(session: Session, exportedAt = Date.now()): string {
  const rows = ['\uFEFF日期,' + localDate(exportedAt), '', '時間,姓名,學號,行為,備註'];
  for (const event of session.events) {
    rows.push(
      [
        localTime(event.timestamp),
        session.profile.name,
        session.profile.studentId,
        session.behavior,
        event.note.replace(/\r?\n/g, '\\n'),
      ]
        .map(csvCell)
        .join(','),
    );
  }
  rows.push(
    '',
    `平均每次間隔,${averageInterval(session).toFixed(2)}`,
    `總次數,${session.events.length}`,
  );
  return rows.join('\n');
}
