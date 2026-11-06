import { baselineScenarios } from './baseline.ts';
import { classroomDialogues, drawingDialogue } from './classroomDialogues.ts';
const revised = new Map(classroomDialogues.map(s => [s.id, s]));
// Preserve the 57 other stories. Drawing was previously a copy draft, not a bank entry.
export const scenarios = [...baselineScenarios.map(s => revised.get(s.id) ?? s), drawingDialogue];
