import type { Profile, Session } from './types';
export const blankProfile = (): Profile => ({ className: '', name: '', studentId: '' });
export function createSession(id: number, behavior = ''): Session {
  return {
    id,
    behavior,
    profile: blankProfile(),
    status: 'idle',
    startedAt: null,
    endedAt: null,
    activeStartedAt: null,
    accumulated: 0,
    events: [],
  };
}
export function elapsed(session: Session, now: number): number {
  if (!Number.isFinite(now)) return Math.max(0, session.accumulated);
  const live =
    session.status === 'running' && session.activeStartedAt !== null
      ? Math.max(0, now - session.activeStartedAt)
      : 0;
  return Math.max(0, session.accumulated + live);
}
export function start(session: Session, profile: Profile, now: number): boolean {
  if (session.status !== 'idle' || !session.behavior.trim() || !Number.isFinite(now)) return false;
  session.behavior = session.behavior.trim();
  session.profile = { ...profile };
  session.status = 'running';
  session.startedAt = now;
  session.activeStartedAt = now;
  return true;
}
export function pause(session: Session, now: number): void {
  if (session.status !== 'running' || !Number.isFinite(now)) return;
  session.accumulated = elapsed(session, now);
  session.activeStartedAt = null;
  session.status = 'paused';
}
export function resume(session: Session, now: number): void {
  if (session.status !== 'paused' || !Number.isFinite(now)) return;
  session.activeStartedAt = now;
  session.status = 'running';
}
export function stop(session: Session, now: number): void {
  if (!Number.isFinite(now) || (session.status !== 'running' && session.status !== 'paused'))
    return;
  session.accumulated = elapsed(session, now);
  session.activeStartedAt = null;
  session.endedAt = Math.max(session.startedAt ?? now, now);
  session.status = 'stopped';
}
export function record(session: Session, now: number): 'recorded' | 'debounced' | 'inactive' {
  if (session.status !== 'running' || !Number.isFinite(now)) return 'inactive';
  const previous = session.events.at(-1);
  if (previous && now - previous.timestamp < 1000) return 'debounced';
  session.events.push({
    timestamp: Math.max(session.startedAt ?? now, now),
    elapsed: elapsed(session, now),
    note: '',
  });
  return 'recorded';
}
