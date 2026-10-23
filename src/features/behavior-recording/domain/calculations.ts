import type { Session } from './types';
import { elapsed } from './session';
export function averageInterval(session: Session): number {
  if (session.events.length < 2) return 0;
  const total = session.events
    .slice(1)
    .reduce(
      (sum, event, index) => sum + Math.max(0, event.elapsed - session.events[index].elapsed),
      0,
    );
  return total / (session.events.length - 1) / 1000;
}
export function frequencyPerMinute(session: Session, now: number): number {
  const duration = elapsed(session, now);
  return duration > 0 ? (session.events.length / duration) * 60000 : 0;
}
export function formatElapsed(milliseconds: number): string {
  const seconds = Math.floor(Math.max(0, Number.isFinite(milliseconds) ? milliseconds : 0) / 1000);
  return [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}
export function chartValues(session: Session): number[] {
  const first = session.events[0]?.elapsed ?? 0;
  return session.events.map((event) => Math.max(0, event.elapsed - first) / 1000);
}
