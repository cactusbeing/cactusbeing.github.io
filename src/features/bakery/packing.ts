import { FLAVORS, counts, scale } from './bakery.ts';
import type { Counts, Flavor, Task } from './bakery.ts';

export type CookieSource =
  | { kind: 'tray'; flavor: Flavor; cookieIndex?: number }
  | { kind: 'box'; flavor: Flavor; boxIndex: number; cookieIndex: number };
export type CookieDestination = { kind: 'tray' } | { kind: 'box'; boxIndex: number };
export interface PackingState { stock: Counts; boxes: Flavor[][] }

// Single-box shape practice includes spare cookies of all shapes, not an answer-shaped supply.
export function createPackingStock(task: Task): Counts {
  if (task.stock) return { ...task.stock };
  const needed = scale(task.recipe, task.boxCount);
  if (task.boxCount > 1) return needed;
  return counts(...FLAVORS.map(flavor => Math.max(6, needed[flavor] + 2)) as [number, number, number]);
}

// Validate the destination before touching the source: cancelled or invalid drops never lose cookies.
export function transferCookie(state: PackingState, source: CookieSource, destination: CookieDestination): PackingState | null {
  if (destination.kind === 'box' && (!state.boxes[destination.boxIndex] || state.boxes[destination.boxIndex].length >= 24)) return null;
  if (source.kind === 'tray') {
    if (destination.kind === 'tray' || state.stock[source.flavor] <= 0) return null;
  } else {
    if (state.boxes[source.boxIndex]?.[source.cookieIndex] !== source.flavor) return null;
    if (destination.kind === 'box' && destination.boxIndex === source.boxIndex) return null;
  }
  const stock = { ...state.stock };
  const boxes = state.boxes.map(box => [...box]);
  if (source.kind === 'tray') stock[source.flavor]--;
  else boxes[source.boxIndex].splice(source.cookieIndex, 1);
  if (destination.kind === 'tray') stock[source.flavor]++;
  else boxes[destination.boxIndex].push(source.flavor);
  return { stock, boxes };
}
