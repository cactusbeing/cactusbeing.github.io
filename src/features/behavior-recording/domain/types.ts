export interface Profile {
  className: string;
  name: string;
  studentId: string;
}
export interface BehaviorEvent {
  timestamp: number;
  elapsed: number;
  note: string;
}
export interface Session {
  id: number;
  behavior: string;
  profile: Profile;
  status: 'idle' | 'running' | 'paused' | 'stopped';
  startedAt: number | null;
  endedAt: number | null;
  activeStartedAt: number | null;
  accumulated: number;
  events: BehaviorEvent[];
}
