import Phaser from 'phaser';
import { stories } from '../data/stories';
import { addTrees, makeArt } from './art';
import { RouteGuide } from './guidance';
import { makeIncidentFrames } from './incidents';
import {
  adults,
  guideTarget,
  landmarks,
  move,
  nearestNpc,
  nearbyPortal,
  portals,
  stepNpcs,
  WORLD,
  type Direction,
  type Destination,
  type MapId,
  type NpcPosition,
  type Portal,
  type Position,
} from './world';
export type GameBridge = {
  position: Position;
  map: MapId;
  npcs: NpcPosition[];
  input: { x: number; y: number };
  paused: boolean;
  completed: string[];
  activeId: string | null;
  destination: Destination | null;
  reducedMotion: boolean;
  requestPortal: string | null;
  tick: (delta: number) => void;
  update: (
    position: Position,
    nearby: string | null,
    guide: { label: string; path: readonly Position[]; blocked: boolean },
  ) => void;
  visit: (id: string) => void;
  interact: (id: string) => void;
  travel: (portal: Portal) => void;
  transition: (label: string) => void;
  previews: (frames: Record<string, string[]>) => void;
  ready: () => void;
};
export class CampusScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private bridge: GameBridge;
  private facing: Direction = 'down';
  private elapsed = 0;
  private marker!: Phaser.GameObjects.Text;
  private routeLine!: Phaser.GameObjects.Graphics;
  private goalRing!: Phaser.GameObjects.Graphics;
  private renderedMap: MapId | null = null;
  private travelling = false;
  private npcViews: {
    npc: NpcPosition;
    sprite: Phaser.GameObjects.Sprite;
    label: Phaser.GameObjects.Text;
    badge: Phaser.GameObjects.Text;
  }[] = [];
  private guide = new RouteGuide();
  private stalled = 0;
  private onResize = () => this.resizeCamera();
  constructor(bridge: GameBridge) {
    super('campus');
    this.bridge = bridge;
  }
  create() {
    makeArt(this);
    this.bridge.previews(
      Object.fromEntries(
        stories.flatMap((story) =>
          [0, 1].map((variant) => [
            `${story.id}:${variant}`,
            makeIncidentFrames(this, story, variant),
          ]),
        ),
      ),
    );
    this.drawMap();
    this.resizeCamera();
    this.scale.on('resize', this.onResize);
    this.events.once('shutdown', () => this.scale.off('resize', this.onResize));
    this.bridge.ready();
  }
  private label(x: number, y: number, text: string, size = 12) {
    return this.add
      .text(x, y, text, {
        fontFamily: 'sans-serif',
        fontSize: `${size}px`,
        color: '#304f3b',
        backgroundColor: '#f5edcf',
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5)
      .setDepth(1000);
  }
  private drawMap() {
    this.children.removeAll(true);
    this.npcViews = [];
    this.renderedMap = this.bridge.map;
    this.guide = new RouteGuide();
    this.add.image(0, 0, `${this.bridge.map}-map`).setOrigin(0);
    this.routeLine = this.add.graphics().setDepth(3);
    this.goalRing = this.add.graphics().setDepth(4);
    if (this.bridge.map === 'campus') {
      addTrees(this);
      this.label(122, 302, '生態池', 11);
      this.label(224, 548, '閱讀花園', 11);
      this.label(480, 608, '向陽中學・南門', 11);
      this.label(866, 500, '通往操場', 11);
      this.label(490, 190, '七年三班', 11);
      this.label(392, 190, '教師辦公室', 11);
    } else
      this.label(
        480,
        150,
        this.bridge.map === 'classroom'
          ? '七年三班・教室'
          : this.bridge.map === 'office'
            ? '教師辦公室'
            : '體育課・操場',
      );
    for (const portal of portals.filter((p) => p.map === this.bridge.map)) {
      this.add
        .graphics()
        .lineStyle(2, 0x48694f)
        .strokeRoundedRect(portal.x - 22, portal.y - 12, 44, 24, 4)
        .setDepth(2);
    }
    for (const npc of this.bridge.npcs.filter((n) => n.map === this.bridge.map)) {
      const index = stories.findIndex((s) => s.id === npc.id),
        person =
          index >= 0
            ? stories[index]
            : { name: npc.name || adults.find((a) => a.id === npc.id)?.name || '陳老師' };
      const sprite = this.add
        .sprite(npc.x, npc.y, `person-${index >= 0 ? index + 1 : stories.length + 1}`, 1)
        .setOrigin(0.5, 1)
        .setScale(2)
        .setDepth(npc.y);
      sprite
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.bridge.interact(npc.id));
      const label = this.label(npc.x, npc.y + 14, person.name);
      const badge = this.add
        .text(npc.x, npc.y - 62, '!', {
          fontFamily: 'serif',
          fontSize: '18px',
          color: '#fff6d5',
          backgroundColor: '#49684b',
          padding: { x: 6, y: 0 },
        })
        .setOrigin(0.5)
        .setDepth(1000);
      this.npcViews.push({ npc, sprite, label, badge });
    }
    this.player = this.add
      .sprite(this.bridge.position.x, this.bridge.position.y, 'person-0', 1)
      .setOrigin(0.5, 1)
      .setScale(2)
      .setDepth(this.bridge.position.y);
    this.marker = this.add
      .text(0, 0, '你', {
        fontSize: '11px',
        color: '#fff8dc',
        backgroundColor: '#3b5945',
        padding: { x: 4, y: 1 },
      })
      .setOrigin(0.5)
      .setDepth(1100);
    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
    this.cameras.main.startFollow(this.player, true, 1, 1);
  }
  private resizeCamera() {
    const { width, height } = this.scale;
    this.cameras.main.setZoom(
      width < 650
        ? Math.max(0.95, width / 420)
        : Math.min(width / WORLD.width, height / WORLD.height),
    );
  }
  private drawRoute(points: readonly Position[]) {
    this.routeLine.clear();
    const path = [this.bridge.position, ...points].reverse();
    const dashes: { from: Position; to: Position }[] = [];
    let phase = 0;
    // Anchor the dash pattern at the destination, so walking doesn't make it march or flicker.
    for (let i = 1; i < path.length; i++) {
      const from = path[i - 1],
        to = path[i];
      const length = Math.hypot(to.x - from.x, to.y - from.y);
      if (length < 0.1) continue;
      let offset = 0;
      while (offset < length - 0.01) {
        const drawn = phase < 9;
        const step = Math.min(length - offset, (drawn ? 9 : 16) - phase);
        if (drawn)
          dashes.push({
            from: {
              x: from.x + ((to.x - from.x) * offset) / length,
              y: from.y + ((to.y - from.y) * offset) / length,
            },
            to: {
              x: from.x + ((to.x - from.x) * (offset + step)) / length,
              y: from.y + ((to.y - from.y) * (offset + step)) / length,
            },
          });
        offset += step;
        phase = (phase + step) % 16;
      }
    }
    for (const [width, color] of [
      [6, 0x304f3b],
      [3, 0xffe3a0],
    ]) {
      this.routeLine.lineStyle(width, color, 1);
      for (const dash of dashes)
        this.routeLine.lineBetween(dash.from.x, dash.from.y, dash.to.x, dash.to.y);
    }
  }
  private travel(portal: Portal) {
    if (this.travelling) return;
    this.travelling = true;
    this.bridge.requestPortal = null;
    this.bridge.transition(portal.label);
    const camera = this.cameras.main,
      duration = this.bridge.reducedMotion ? 1 : 180;
    camera.fadeOut(
      duration,
      37,
      55,
      43,
      (_camera: Phaser.Cameras.Scene2D.Camera, amount: number) => {
        if (amount < 1) return;
        this.bridge.travel(portal);
        this.drawMap();
        camera.fadeIn(duration, 37, 55, 43);
        this.time.delayedCall(duration + 16, () => {
          this.travelling = false;
          this.bridge.transition('');
        });
      },
    );
  }
  update(_time: number, delta: number) {
    this.elapsed += delta;
    if (!this.player) return;
    if (
      this.renderedMap !== this.bridge.map ||
      this.npcViews.some((view) => !this.bridge.npcs.includes(view.npc)) ||
      this.npcViews.length !== this.bridge.npcs.filter((n) => n.map === this.bridge.map).length
    )
      this.drawMap();
    const { input, paused, map, npcs } = this.bridge;
    if (!paused && !this.travelling) {
      stepNpcs(npcs, this.bridge.position, map, delta / 1000, false);
      const beforeMove = this.bridge.position;
      this.bridge.position = move(
        this.bridge.position,
        input.x,
        input.y,
        delta / 1000,
        map,
        npcs.filter((n) => n.map === map),
      );
      this.stalled =
        (input.x || input.y) &&
        Math.hypot(beforeMove.x - this.bridge.position.x, beforeMove.y - this.bridge.position.y) <
          0.2
          ? this.stalled + delta
          : 0;
      if (this.stalled > 400) {
        this.guide.invalidate();
        this.stalled = 0;
      }
      if (input.x || input.y)
        this.facing = input.x < 0 ? 'left' : input.x > 0 ? 'right' : input.y < 0 ? 'up' : 'down';
      if (map === 'campus')
        for (const place of landmarks)
          if (Math.hypot(place.x - this.bridge.position.x, place.y - this.bridge.position.y) < 54)
            this.bridge.visit(place.id);
      const portal = this.bridge.requestPortal
        ? portals.find(
            (p) =>
              p.id === this.bridge.requestPortal &&
              p.map === map &&
              Math.hypot(p.x - this.bridge.position.x, p.y - this.bridge.position.y) < 65,
          )
        : nearbyPortal(this.bridge.position, map);
      this.bridge.requestPortal = null;
      if (portal) this.travel(portal);
    } else stepNpcs(npcs, this.bridge.position, map, 0, true);
    const moving = !paused && !this.travelling && (input.x || input.y);
    const direction = { down: 0, left: 1, right: 2, up: 3 }[this.facing];
    const frame = moving ? [0, 1, 2, 1][Math.floor(this.elapsed / 140) % 4] : 1;
    this.player
      .setPosition(this.bridge.position.x, this.bridge.position.y)
      .setFrame(direction * 3 + frame)
      .setDepth(this.bridge.position.y);
    this.marker.setPosition(this.player.x, this.player.y - 62);
    for (const { npc, sprite, label, badge } of this.npcViews) {
      const dir = { down: 0, left: 1, right: 2, up: 3 }[npc.facing];
      sprite
        .setPosition(npc.x, npc.y)
        .setDepth(npc.y)
        .setFrame(dir * 3 + (npc.moving ? [0, 1, 2, 1][Math.floor(this.elapsed / 180) % 4] : 1));
      label.setPosition(npc.x, npc.y + 14);
      const complete = this.bridge.completed.includes(npc.id),
        active = npc.id === this.bridge.activeId;
      badge
        .setPosition(npc.x, npc.y - 62)
        .setText(complete ? '✓' : active ? '!' : '·')
        .setBackgroundColor(complete ? '#647459' : active ? '#49684b' : '#778468');
    }
    const target = guideTarget(map, this.bridge.activeId, npcs, this.bridge.destination);
    this.guide.update(
      this.bridge.position,
      target,
      map,
      `${map}:${'id' in target ? target.id : 'gate'}:${this.bridge.destination?.id || ''}`,
      this.elapsed,
      npcs.filter((n) => n.map === map),
    );
    const distance = Math.hypot(target.x - this.player.x, target.y - this.player.y);
    const visible = !paused && !this.travelling;
    this.drawRoute(this.guide.path);
    this.routeLine.setVisible(visible && this.guide.path.length > 0);
    this.goalRing.clear().setVisible(visible);
    for (const [width, color] of [
      [5, 0x304f3b],
      [2, 0xffe3a0],
    ]) {
      this.goalRing.lineStyle(width, color, 1);
      if ('to' in target) this.goalRing.strokeRoundedRect(target.x - 26, target.y - 16, 52, 32, 5);
      else this.goalRing.strokeEllipse(target.x, target.y + 1, 48, 22);
    }
    this.bridge.tick(!paused && !this.travelling ? delta : 0);
    this.bridge.update(
      { ...this.bridge.position },
      nearestNpc(this.bridge.position, this.bridge.activeId, map, npcs),
      {
        label: target.label,
        path: this.guide.path,
        blocked: !this.guide.path.length && distance > 65,
      },
    );
  }
}
export function createCampusGame(parent: HTMLElement, bridge: GameBridge) {
  return new Phaser.Game({
    type: Phaser.CANVAS,
    parent,
    backgroundColor: '#8faf76',
    pixelArt: true,
    roundPixels: true,
    scale: { mode: Phaser.Scale.RESIZE, width: parent.clientWidth, height: parent.clientHeight },
    scene: new CampusScene(bridge),
    audio: { noAudio: true },
    input: { keyboard: false },
    fps: { target: 60, forceSetTimeOut: false },
    banner: false,
  });
}
