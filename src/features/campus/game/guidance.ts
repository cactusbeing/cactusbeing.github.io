import { findGuideRoute, guideSegmentClear, type MapId, type Position } from './world';

const distance = (a: Position, b: Position) => Math.hypot(a.x - b.x, a.y - b.y);
function project(p: Position, a: Position, b: Position) {
  const length = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  const t = length
    ? Math.max(0, Math.min(1, ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / length))
    : 0;
  return { t, distance: distance(p, { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }) };
}

export class RouteGuide {
  private key = '';
  private target: Position | null = null;
  private route: Position[] = [];
  private segment: Position = { x: 0, y: 0 };
  private plannedAt = -Infinity;
  private checkedAt = -Infinity;

  get path(): readonly Position[] {
    return this.route;
  }

  invalidate() {
    this.key = '';
  }

  private trim(position: Position, target: Position, map: MapId, actors: Position[]) {
    // Recognize progress beyond a corner even when the player misses its exact pixel.
    let previous = this.segment;
    let closest = Infinity;
    let passed = 0;
    for (let i = 0; i < this.route.length; i++) {
      const projection = project(position, previous, this.route[i]);
      if (projection.distance < closest) {
        closest = projection.distance;
        passed = projection.t > 0 && projection.distance < 12 ? i : 0;
      }
      previous = this.route[i];
    }
    if (passed && guideSegmentClear(position, this.route[passed], target, map, actors))
      this.segment = this.route.splice(0, passed).at(-1)!;
    // Keep a near corner until the shortcut to its next segment is actually walkable.
    while (
      this.route.length &&
      distance(position, this.route[0]) < 7 &&
      (this.route.length === 1 || guideSegmentClear(position, this.route[1], target, map, actors))
    )
      this.segment = this.route.shift()!;
  }

  update(
    position: Position,
    target: Position,
    map: MapId,
    key: string,
    now: number,
    actors: Position[] = [],
  ): Position {
    this.trim(position, target, map, actors);
    const changed = key !== this.key;
    const offRoute =
      this.route.length > 0 && project(position, this.segment, this.route[0]).distance > 24;
    const targetMoved = !!this.target && distance(this.target, target) > 24;
    const firstBlocked =
      this.route.length > 0 && !guideSegmentClear(position, this.route[0], target, map, actors);
    let obstructed = false;
    if (this.route.length && now - this.checkedAt > 250) {
      let previous = position;
      obstructed = this.route.some((point) => {
        const clear = guideSegmentClear(previous, point, target, map, actors);
        previous = point;
        return !clear;
      });
      this.checkedAt = now;
    }
    if (
      changed ||
      firstBlocked ||
      ((offRoute ||
        targetMoved ||
        obstructed ||
        (!this.route.length && distance(position, target) > 60)) &&
        now - this.plannedAt > 300)
    ) {
      this.key = key;
      this.target = { x: target.x, y: target.y };
      this.segment = { ...position };
      this.route = findGuideRoute(position, target, map, actors);
      this.plannedAt = now;
      this.checkedAt = now;
      this.trim(position, target, map, actors);
    }
    return this.route[0] || position;
  }
}
