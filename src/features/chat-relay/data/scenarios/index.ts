import { classroomScenarios } from './classroom.ts';
import { hallwayScenarios } from './hallway.ts';
import { lunchScenarios } from './lunch.ts';
import { playgroundScenarios } from './playground.ts';
import { clubScenarios } from './club.ts';
import { outingScenarios } from './outing.ts';
export const scenarios = [...classroomScenarios, ...hallwayScenarios, ...lunchScenarios, ...playgroundScenarios, ...clubScenarios, ...outingScenarios];
