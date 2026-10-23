import type Phaser from 'phaser';
import { stories, type Story } from '../data/stories';
import { trees } from './world';
export const incidentCaptions: Record<string, [string, string]> = {
  vision: [
    '你走進校門，看見以安正往教室走。',
    '前方臨時放了紙箱，以安停下腳步：「前面放了什麼？」',
  ],
  mutism: [
    '教室開始收作業，小禾握著作業本。',
    '有人連問了幾次，她仍沒有說話，只把作業本拿得更緊。',
  ],
  learning: [
    '國文分組輪到子言朗讀，他反覆看著同一段資料。',
    '他停了很久，旁邊的同學開始催促：「怎麼這麼慢！」',
  ],
  emotion: ['下課走廊，兩位同學越吵越大聲。', '突然有人揮拳，同學趕緊退開。現場需要老師協助。'],
  hearing: [
    '教室即將播放影片，同學們開始移動座位。',
    '沐晴沒跟上指令，轉過頭問：「現在是先看，還是先討論？」',
  ],
  intellectual: [
    '午餐後，可欣在洗手間旁停了下來。',
    '她低聲說：「衣服……髒了。找老師。」請靠近了解，保護她的隱私。',
  ],
  mobility: [
    '體育課要集合了，阿岳沿操場步道前進。',
    '搬運推車擋住坡道，他停下來：「可以請老師來一下嗎？」',
  ],
  autism: [
    '放學前，小澄在榕樹下等候集合。',
    '廣播突然響起，人群靠近。小澄摀住耳朵，往旁邊退了一步。',
  ],
};
// Two locally rendered pixel stills per event; no external video, audio, tracking or downloads.
export function makeIncidentFrames(scene: Phaser.Scene, story: Story, variant = 0): string[] {
  const background = scene.textures.get(`${story.map}-map`).getSourceImage() as HTMLCanvasElement;
  const sheet = (index: number) =>
    scene.textures.get(`person-${index}`).getSourceImage() as HTMLCanvasElement;
  const origin = {
    x: Math.max(0, Math.min(576, story.x - 192)),
    y: Math.max(0, Math.min(416, story.y - 134)),
  };
  return [0, 1].map((frame) => {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 224;
    const c = canvas.getContext('2d')!;
    c.imageSmoothingEnabled = false;
    c.drawImage(background, origin.x, origin.y, 384, 224, 0, 0, 384, 224);
    const x = story.x - origin.x,
      y = story.y - origin.y;
    const box = (px: number, py: number, w: number, h: number, color: string) => {
      c.fillStyle = color;
      c.fillRect(Math.round(px), Math.round(py), w, h);
    };
    const person = (index: number, px: number, py: number, pose = 1) =>
      c.drawImage(
        sheet(index),
        pose * 16,
        0,
        16,
        26,
        Math.round(px - 16),
        Math.round(py - 52),
        32,
        52,
      );
    const paper = (px: number, py: number) => {
      box(px, py, 28, 18, '#fcf2d7');
      for (let line = 0; line < 3; line++) box(px + 4, py + 4 + line * 4, 18, 1, '#8a9d85');
    };
    const drawTree = (tx: number, ty: number) =>
      c.drawImage(
        scene.textures.get('campus-tree').getSourceImage() as HTMLCanvasElement,
        tx - origin.x - 44,
        ty - origin.y - 93.6,
      );
    if (story.map === 'campus') for (const [tx, ty] of trees) if (ty <= story.y) drawTree(tx, ty);
    const index = stories.findIndex((s) => s.id === story.id) + 1;
    const pose = frame && ['vision', 'hearing'].includes(story.id) ? 7 : 1;
    person(index, x + (frame && story.id === 'emotion' ? -8 : 0), y, pose);
    person(0, x - 76, y + 40);
    if (story.id === 'vision') {
      box(x + 38, y - 11, 36, 25, variant ? '#7a9b86' : '#a87951');
      box(x + 40, y - 10, 32, 7, '#c7a273');
      box(x + 54, y - 10, 4, 24, '#e1c997');
      if (frame) {
        box(x + 17, y - 30, 17, 3, '#e6b78f');
        box(x + 32, y - 29, 3, 22, '#eee4cf');
      }
    } else if (story.id === 'mutism') {
      if (variant) paper(x + 30, y - 20);
      paper(x - 12, y - 25);
      if (frame) box(x + 2, y - 25, 3, 12, '#a47d4c');
    } else if (story.id === 'learning') {
      paper(x + 28, y - 17);
      paper(x + 34, y - 9);
      if (frame) person(2, x + 92, y - 4, 4);
    } else if (story.id === 'emotion') {
      person(3, x + (frame ? 76 : 48), y + (frame ? 12 : 0), 4);
      if (frame) {
        box(x + 14, y - 30, 22, 5, '#e4b58c');
        box(x + 24, y - 42, 2, 7, '#f7e5c2');
        box(x + 32, y - 40, 2, 6, '#f7e5c2');
      }
    } else if (story.id === 'hearing') {
      person(3, x + (frame ? 104 : 56), y - 10, 7);
      box(x + 26, y - 66, 42, 22, '#faf0d3');
      box(x + 32, y - 60, 30, 2, '#697f64');
      box(x + 32, y - 54, 20, 2, '#697f64');
    } else if (story.id === 'intellectual') {
      if (variant) {
        box(x + 18, y - 20, 24, 24, '#9b846e');
        box(x + 24, y - 25, 12, 6, '#d2be98');
      }
      box(x - 13, y - 23, 27, 12, '#b4a594');
      if (frame) {
        box(x - 17, y - 29, 6, 11, '#e4b58c');
        box(x - 17, y - 34, 6, 6, '#e4b58c');
      }
    } else if (story.id === 'mobility') {
      box(x + 36, y - 18, 48, 20, variant ? '#ac895a' : '#9c8667');
      box(x + 38, y - 25, 43, 7, '#c1aa7d');
      box(x + 40, y + 2, 7, 7, '#4c5e50');
      box(x + 73, y + 2, 7, 7, '#4c5e50');
      if (frame) box(x + 13, y - 42, 6, 17, '#e4b58c');
    } else if (story.id === 'autism' && frame) {
      box(x - 12, y - 40, 6, 15, '#e4b58c');
      box(x + 8, y - 40, 6, 15, '#e4b58c');
      box(x - 28, y - 62, 2, 10, '#eee4c0');
      box(x + 26, y - 62, 2, 10, '#eee4c0');
    }
    if (story.map === 'campus') for (const [tx, ty] of trees) if (ty > story.y) drawTree(tx, ty);
    return canvas.toDataURL('image/png');
  });
}
