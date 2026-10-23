import { stories } from '../data/stories';
export type MapId = 'campus' | 'classroom' | 'playground' | 'office';
export const mapNames: Record<MapId, string> = {
  campus: '校園',
  classroom: '教室',
  playground: '操場',
  office: '教師辦公室',
};
export const WORLD = { width: 960, height: 640 };
export const START = { x: 480, y: 564 };
export type Position = { x: number; y: number };
export type Rect = Position & { width: number; height: number };
export type Direction = 'down' | 'left' | 'right' | 'up';
export const buildings = [
  { x: 80, y: 48, width: 238, height: 130, name: '圖書館', roof: '#af7058' },
  { x: 368, y: 40, width: 244, height: 138, name: '向陽中學', roof: '#577b71' },
  { x: 672, y: 56, width: 208, height: 122, name: '音樂教室', roof: '#a16c55' },
];
export const trees = [
  [42, 70],
  [40, 166],
  [40, 264],
  [42, 524],
  [58, 602],
  [152, 594],
  [274, 596],
  [916, 76],
  [920, 176],
  [918, 282],
  [920, 552],
  [852, 596],
  [700, 602],
  [116, 254],
  [290, 302],
  [628, 250],
  [610, 500],
  [352, 516],
  [122, 436],
];
export const solids: Rect[] = [
  ...buildings.map((b) => ({ x: b.x, y: b.y + 36, width: b.width, height: b.height - 36 })),
  ...trees.map(([x, y]) => ({ x: x - 12, y: y - 12, width: 24, height: 20 })),
  { x: 72, y: 330, width: 102, height: 66 },
  { x: 420, y: 304, width: 104, height: 44 },
  { x: 334, y: 392, width: 38, height: 62 },
  { x: 568, y: 318, width: 38, height: 58 },
  { x: 168, y: 386, width: 65, height: 13 },
  { x: 670, y: 288, width: 65, height: 13 },
  { x: 566, y: 386, width: 74, height: 40 },
];
export const landmarks = [
  {
    id: 'library',
    name: '圖書館',
    x: 302,
    y: 214,
    note: '有聲書、大字書、電子書，閱讀可以有不同的方式。',
  },
  {
    id: 'garden',
    name: '閱讀花園',
    x: 170,
    y: 506,
    note: '安靜休息的空間，讓每個人都有調整步調的選擇。',
  },
  {
    id: 'court',
    name: '友善球場',
    x: 788,
    y: 520,
    note: '活動規則、場地和器材可以一起調整，讓參與有更多可能。',
  },
];
export const classroomSolids: Rect[] = [
  { x: 100, y: 64, width: 760, height: 60 },
  ...[310, 470, 630].flatMap((x) => [268, 370, 472].map((y) => ({ x, y, width: 92, height: 42 }))),
  { x: 106, y: 202, width: 92, height: 68 },
  { x: 808, y: 310, width: 48, height: 164 },
];
export const playgroundSolids: Rect[] = [
  { x: 320, y: 82, width: 320, height: 26 },
  { x: 824, y: 140, width: 20, height: 100 },
  { x: 112, y: 140, width: 20, height: 100 },
  { x: 792, y: 450, width: 64, height: 32 },
];
export const officeSolids: Rect[] = [
  { x: 100, y: 64, width: 760, height: 60 },
  { x: 420, y: 208, width: 160, height: 64 },
  { x: 126, y: 150, width: 52, height: 180 },
  { x: 340, y: 420, width: 60, height: 30 },
  { x: 560, y: 420, width: 60, height: 30 },
];
export function mapSolids(map: MapId): Rect[] {
  if (map === 'office') return officeSolids;
  return map === 'classroom' ? classroomSolids : map === 'playground' ? playgroundSolids : solids;
}
export type Portal = Position & {
  id: string;
  map: MapId;
  to: MapId;
  arrival: Position;
  label: string;
};
export const portals: Portal[] = [
  {
    id: 'enter-office',
    map: 'campus',
    x: 392,
    y: 202,
    to: 'office',
    arrival: { x: 480, y: 532 },
    label: '進教師辦公室',
  },
  {
    id: 'leave-office',
    map: 'office',
    x: 480,
    y: 590,
    to: 'campus',
    arrival: { x: 392, y: 284 },
    label: '回校園',
  },

  {
    id: 'enter-classroom',
    map: 'campus',
    x: 490,
    y: 202,
    to: 'classroom',
    arrival: { x: 480, y: 532 },
    label: '進教室',
  },
  {
    id: 'leave-classroom',
    map: 'classroom',
    x: 480,
    y: 590,
    to: 'campus',
    arrival: { x: 490, y: 254 },
    label: '回校園',
  },
  {
    id: 'enter-playground',
    map: 'campus',
    x: 884,
    y: 466,
    to: 'playground',
    arrival: { x: 112, y: 540 },
    label: '去操場',
  },
  {
    id: 'leave-playground',
    map: 'playground',
    x: 48,
    y: 540,
    to: 'campus',
    arrival: { x: 820, y: 466 },
    label: '回校園',
  },
];
export type Destination = Position & { id: string; map: MapId; label: string };
export const adults: (Destination & { name: string })[] = [
  {
    id: 'adult-office',
    name: '林老師',
    label: '教師辦公室・林老師',
    map: 'office',
    x: 640,
    y: 260,
  },
  {
    id: 'adult-classroom',
    name: '林老師',
    label: '教室老師桌・林老師',
    map: 'classroom',
    x: 240,
    y: 168,
  },
  {
    id: 'adult-playground',
    name: '體育老師',
    label: '操場邊線・體育老師',
    map: 'playground',
    x: 268,
    y: 520,
  },
  {
    id: 'adult-campus',
    name: '陳老師',
    label: '校園值週點・陳老師',
    map: 'campus',
    x: 392,
    y: 238,
  },
];
export const arrivals: Record<MapId, Position> = {
  campus: START,
  classroom: { x: 480, y: 532 },
  playground: { x: 112, y: 540 },
  office: { x: 480, y: 532 },
};
export type NpcPosition = Position & {
  name?: string;
  id: string;
  map: MapId;
  facing: Direction;
  moving: boolean;
  waypoint: number;
};
export function createNpcs(): NpcPosition[] {
  return [...stories, ...adults].map((s) => ({
    id: s.id,
    map: s.map,
    x: s.x,
    y: s.y,
    facing: 'down',
    moving: false,
    waypoint: 0,
  }));
}
export function canStand(
  p: Position,
  map: MapId = 'campus',
  actors: Position[] = stories.filter((s) => s.map === map),
): boolean {
  if (p.x < 22 || p.y < 26 || p.x > WORLD.width - 22 || p.y > WORLD.height - 22) return false;
  if (
    mapSolids(map).some(
      (s) => p.x + 9 > s.x && p.x - 9 < s.x + s.width && p.y + 4 > s.y && p.y - 7 < s.y + s.height,
    )
  )
    return false;
  return !actors.some((s) => Math.hypot(p.x - s.x, p.y - s.y) < 23);
}
export function move(
  position: Position,
  dx: number,
  dy: number,
  seconds: number,
  map: MapId = 'campus',
  actors?: Position[],
): Position {
  const magnitude = Math.hypot(dx, dy);
  if (!magnitude) return position;
  const distance = Math.min(seconds, 0.05) * 144 * Math.min(1, magnitude);
  const next = { ...position };
  const x = position.x + (dx / magnitude) * distance;
  if (canStand({ x, y: next.y }, map, actors)) next.x = x;
  const y = position.y + (dy / magnitude) * distance;
  if (canStand({ x: next.x, y }, map, actors)) next.y = y;
  return next;
}
// Each character walks a short, safe route; close proximity holds them still for interaction.
export function stepNpcs(
  actors: NpcPosition[],
  player: Position,
  map: MapId,
  seconds: number,
  paused: boolean,
): void {
  for (const npc of actors) {
    npc.moving = false;
    if (npc.id.startsWith('adult-')) continue;
    if (paused || npc.map !== map || Math.hypot(npc.x - player.x, npc.y - player.y) < 112) continue;
    const home = stories.find((s) => s.id === npc.id)!;
    const [dx, dy] = [
      [24, 0],
      [24, 24],
      [-24, 24],
      [-24, 0],
    ][npc.waypoint];
    const target = { x: home.x + dx, y: home.y + dy };
    const vx = target.x - npc.x,
      vy = target.y - npc.y,
      distance = Math.hypot(vx, vy);
    if (distance < 1) {
      npc.waypoint = (npc.waypoint + 1) % 4;
      continue;
    }
    const speed = Math.min(distance, Math.min(seconds, 0.05) * 24);
    const next = { x: npc.x + (vx / distance) * speed, y: npc.y + (vy / distance) * speed };
    if (
      !canStand(next, map, [
        ...actors.filter((other) => other !== npc && other.map === map),
        player,
      ])
    ) {
      npc.waypoint = (npc.waypoint + 1) % 4;
      continue;
    }
    npc.facing = Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? 'left' : 'right') : vy < 0 ? 'up' : 'down';
    npc.x = next.x;
    npc.y = next.y;
    npc.moving = true;
  }
}
export function nearestNpc(
  position: Position,
  preferredId?: string | null,
  map: MapId = 'campus',
  actors: (Position & { id: string; map: MapId })[] = stories,
): string | null {
  const local = actors.filter((s) => s.map === map);
  const preferred = local.find((s) => s.id === preferredId);
  if (preferred && Math.hypot(preferred.x - position.x, preferred.y - position.y) <= 65)
    return preferred.id;
  const nearest = local
    .map((s) => ({ id: s.id, distance: Math.hypot(s.x - position.x, s.y - position.y) }))
    .sort((a, b) => a.distance - b.distance)[0];
  return nearest && nearest.distance <= 65 ? nearest.id : null;
}
export function nearbyPortal(position: Position, map: MapId): Portal | null {
  return (
    portals.find((p) => p.map === map && Math.hypot(p.x - position.x, p.y - position.y) < 28) ||
    null
  );
}
export function guideTarget(
  map: MapId,
  activeId: string | null,
  actors: NpcPosition[],
  destination?: Destination | null,
) {
  const story = stories.find((s) => s.id === activeId);
  const targetMap = destination?.map || story?.map || 'campus';
  if (map !== targetMap) {
    // Follow the map graph, rather than depending on the ordering of the portal array.
    const queue: { map: MapId; first?: Portal }[] = [{ map }];
    const visited = new Set<MapId>([map]);
    let portal: Portal | undefined;
    for (let i = 0; i < queue.length && !portal; i++) {
      for (const exit of portals.filter((p) => p.map === queue[i].map)) {
        if (visited.has(exit.to)) continue;
        const first = queue[i].first || exit;
        if (exit.to === targetMap) {
          portal = first;
          break;
        }
        visited.add(exit.to);
        queue.push({ map: exit.to, first });
      }
    }
    if (!portal) throw new Error(`No campus route from ${map} to ${targetMap}`);
    return { ...portal, label: portal.label };
  }
  const npc = actors.find((s) => s.id === activeId);
  return npc
    ? {
        ...npc,
        label: destination?.label || story?.name || adults.find((a) => a.id === npc.id)!.name,
      }
    : destination
      ? { ...destination }
      : { ...START, label: '南門・放學' };
}
function unintendedPortals(target: Position, map: MapId) {
  return portals.filter((p) => p.map === map && Math.hypot(p.x - target.x, p.y - target.y) > 1);
}
// Walking through an unrelated portal would change maps before reaching the intended destination.
export function guideSegmentClear(
  a: Position,
  b: Position,
  target: Position,
  map: MapId,
  actors: Position[] = [],
): boolean {
  const excluded = unintendedPortals(target, map);
  const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2));
  for (let i = 0; i <= steps; i++) {
    const p = { x: a.x + ((b.x - a.x) * i) / steps, y: a.y + ((b.y - a.y) * i) / steps };
    if (
      !canStand(p, map, actors) ||
      excluded.some((door) => Math.hypot(p.x - door.x, p.y - door.y) < 34)
    )
      return false;
  }
  return true;
}
// Return only walkable segments. A failed search must never become a line through a wall.
export function findGuideRoute(
  position: Position,
  target: Position,
  map: MapId,
  actors: Position[] = [],
): Position[] {
  const excluded = unintendedPortals(target, map);
  // Doors and open ground (including the dismissal gate) need a complete route to the
  // actual point. A person's body stays blocked, so their route ends within talking range.
  const exactDestination = canStand(target, map, actors);
  const safeCache = new Map<string, boolean>();
  const key = (p: Position) => `${p.x},${p.y}`;
  const safe = (p: Position) => {
    const cached = safeCache.get(key(p));
    if (cached !== undefined) return cached;
    const valid =
      !excluded.some((door) => Math.hypot(p.x - door.x, p.y - door.y) < 38) &&
      [
        [0, 0],
        [4, 0],
        [-4, 0],
        [0, 4],
        [0, -4],
      ].every(([dx, dy]) => canStand({ x: p.x + dx, y: p.y + dy }, map, actors));
    safeCache.set(key(p), valid);
    return valid;
  };
  const segmentClear = (a: Position, b: Position) => guideSegmentClear(a, b, target, map, actors);
  const base = { x: Math.round(position.x / 16) * 16, y: Math.round(position.y / 16) * 16 };
  const candidates = [-16, 0, 16]
    .flatMap((dx) => [-16, 0, 16].map((dy) => ({ x: base.x + dx, y: base.y + dy })))
    .filter(safe)
    .sort(
      (a, b) =>
        Math.hypot(a.x - position.x, a.y - position.y) -
        Math.hypot(b.x - position.x, b.y - position.y),
    );
  let connection: Position[] = [];
  let start: Position | undefined;
  for (const candidate of candidates) {
    const turns = [
      { x: position.x, y: candidate.y },
      { x: candidate.x, y: position.y },
    ];
    const turn = turns.find((t) => segmentClear(position, t) && segmentClear(t, candidate));
    if (turn) {
      start = candidate;
      connection = [turn, candidate].filter(
        (p, i, all) =>
          Math.hypot(p.x - (i ? all[i - 1].x : position.x), p.y - (i ? all[i - 1].y : position.y)) >
          1,
      );
      break;
    }
  }
  if (!start) return [];
  const queue = [start],
    parents = new Map<string, Position | null>([[key(start), null]]);
  let goal: Position | undefined;
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    if (
      Math.hypot(p.x - target.x, p.y - target.y) < (exactDestination ? 24 : 36) &&
      (!exactDestination || segmentClear(p, target))
    ) {
      goal = p;
      break;
    }
    for (const [dx, dy] of [
      [16, 0],
      [-16, 0],
      [0, 16],
      [0, -16],
    ]) {
      const next = { x: p.x + dx, y: p.y + dy };
      if (!parents.has(key(next)) && safe(next) && segmentClear(p, next)) {
        parents.set(key(next), p);
        queue.push(next);
      }
    }
  }
  if (!goal) return [];
  const route: Position[] = [];
  for (let p: Position | null = goal; p; p = parents.get(key(p)) || null) route.unshift(p);
  const corners = route.filter(
    (point, i) =>
      i > 0 &&
      (i === route.length - 1 ||
        point.x - route[i - 1].x !== route[i + 1].x - point.x ||
        point.y - route[i - 1].y !== route[i + 1].y - point.y),
  );
  const result = [...connection, ...corners];
  if (exactDestination && Math.hypot(goal.x - target.x, goal.y - target.y) > 1)
    result.push({ x: target.x, y: target.y });
  return result;
}
