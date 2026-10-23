import Phaser from 'phaser';
import { buildings, trees, WORLD } from './world';
import { stories } from '../data/stories';

// Original pixel artwork, authored as canvas primitives and sprite pixels; no remote assets.
export function makeArt(scene: Phaser.Scene) {
  const texture = scene.textures.createCanvas('campus-map', WORLD.width, WORLD.height)!;
  const c = texture.context;
  const box = (x: number, y: number, w: number, h: number, color: string) => {
    c.fillStyle = color;
    c.fillRect(x, y, w, h);
  };
  let seed = 67;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  box(0, 0, 960, 640, '#8faf76');
  for (let y = 0; y < 640; y += 16)
    for (let x = 0; x < 960; x += 16) {
      box(x, y, 16, 16, random() > 0.6 ? '#94b67c' : '#91b078');
      if (random() > 0.35) {
        box(x + 4, y + 10, 2, 3, '#7d9f68');
        box(x + 7, y + 8, 2, 3, '#a6c18a');
      }
    }
  // Warm stone paths, tile seams, and accessible continuous connections.
  const path = (x: number, y: number, w: number, h: number) => {
    box(x - 4, y - 4, w + 8, h + 8, '#77935f');
    box(x, y, w, h, '#d9cc9f');
    for (let py = y; py < y + h; py += 16)
      for (let px = x; px < x + w; px += 32) {
        box(px + 2, py + 14, Math.min(28, x + w - px - 2), 1, '#c9bc91');
        if (random() > 0.65) box(px + 7, py + 5, 3, 2, '#e9dcaf');
      }
  };
  path(184, 194, 628, 48);
  path(452, 196, 56, 404);
  path(184, 228, 48, 300);
  path(208, 450, 584, 48);
  path(748, 228, 48, 294);
  path(232, 282, 516, 44);
  // Fence with stone posts around the school.
  for (let x = 12; x < 952; x += 24) {
    if (x > 436 && x < 520) continue;
    box(x, 14, 4, 28, '#e6dfbd');
    box(x, 582, 4, 30, '#dfd7b7');
    box(x, 24, 24, 4, '#d3c9a4');
    box(x, 592, 24, 4, '#d3c9a4');
  }
  for (const b of buildings) {
    const { x, y, width: w, height: h } = b;
    box(x + 8, y + 18, w + 7, h + 10, '#718c60');
    box(x, y + 34, w, h - 34, '#e5dbb8');
    box(x + 5, y + 40, w - 10, 8, '#f5edce');
    box(x, y + h - 12, w, 12, '#b1a98c');
    for (let wx = x + 20; wx < x + w - 30; wx += 48) {
      box(wx - 3, y + 60, 32, 38, '#b3a588');
      box(wx, y + 63, 26, 30, '#6f9896');
      box(wx + 3, y + 66, 9, 23, '#afcfbe');
      box(wx + 14, y + 66, 9, 11, '#c8dcc8');
      box(wx + 12, y + 63, 2, 30, '#e9dfbb');
      box(wx, y + 77, 26, 2, '#e9dfbb');
    }
    box(x + w / 2 - 19, y + h - 47, 38, 47, '#547b6b');
    box(x + w / 2 - 15, y + h - 43, 14, 31, '#8fb1a3');
    box(x + w / 2 + 2, y + h - 43, 13, 31, '#8fb1a3');
    box(x - 8, y + 26, w + 16, 16, '#744f41');
    for (let row = 0; row < 6; row++) {
      box(x - 4 + row * 2, y + 2 + row * 5, w + 8 - row * 4, 5, b.roof);
      for (let tx = x + (row % 2) * 12; tx < x + w; tx += 24)
        box(tx, y + 3 + row * 5, 1, 4, '#ffffff20');
    }
    box(x + w / 2 - 44, y + 36, 88, 18, '#f4ebcc');
    c.font = 'bold 12px sans-serif';
    c.textAlign = 'center';
    c.fillStyle = '#3b5844';
    c.fillText(b.name, x + w / 2, y + 49);
  }
  // A separate office door lines up with its actual portal at (392, 202).
  box(376, 132, 32, 46, '#547b6b');
  box(380, 136, 24, 36, '#b5c9b0');
  box(389, 136, 3, 36, '#547b6b');
  box(398, 154, 3, 3, '#e8d4a0');
  box(376, 174, 32, 5, '#eee2ba');
  // Clock over the main school entrance.
  box(478, 51, 24, 24, '#efe8cb');
  box(481, 54, 18, 18, '#fcf4d9');
  box(489, 56, 2, 9, '#466153');
  box(490, 63, 6, 2, '#466153');
  // Pond, stone rim, lily pads.
  box(66, 324, 114, 78, '#c8c4a3');
  box(72, 330, 102, 66, '#658f89');
  box(78, 336, 90, 54, '#7faaa1');
  for (let i = 0; i < 15; i++) box(80 + random() * 78, 340 + random() * 44, 8, 2, '#b2d0b3');
  box(92, 348, 14, 7, '#60835b');
  box(138, 376, 16, 7, '#60835b');
  box(96, 346, 4, 4, '#e9bfab');
  // Central flower bed.
  box(414, 298, 116, 56, '#b2a57f');
  box(420, 304, 104, 44, '#6b8157');
  for (let y = 312; y < 343; y += 12)
    for (let x = 428; x < 518; x += 14) {
      box(x, y, 2, 9, '#b0bd78');
      box(x - 2, y, 6, 4, random() > 0.45 ? '#efce91' : '#e9ab91');
    }
  // Raised garden planters.
  for (const [x, y] of [
    [334, 392],
    [568, 318],
  ]) {
    box(x, y, 38, 60, '#a77e57');
    box(x + 3, y + 3, 32, 50, '#5c7250');
    for (let k = 0; k < 3; k++) {
      box(x + 8, y + 7 + k * 16, 22, 9, '#9eb279');
      box(x + 14, y + 5 + k * 16, 10, 12, '#c5cc8b');
    }
  }
  // Sports court with clear lines and hoop.
  box(668, 356, 216, 174, '#b0b893');
  box(676, 364, 200, 158, '#af9e7e');
  c.strokeStyle = '#eee4c0';
  c.lineWidth = 2;
  c.strokeRect(684, 372, 184, 142);
  c.beginPath();
  c.moveTo(776, 372);
  c.lineTo(776, 514);
  c.stroke();
  c.beginPath();
  c.arc(776, 443, 26, 0, Math.PI * 2);
  c.stroke();
  c.strokeRect(684, 414, 32, 58);
  c.strokeRect(836, 414, 32, 58);
  box(862, 398, 4, 42, '#52675c');
  box(850, 392, 28, 16, '#ede7d2');
  box(858, 399, 12, 3, '#aa7057');
  // Benches and path lamps.
  for (const [x, y] of [
    [168, 376],
    [670, 278],
    [272, 526],
  ]) {
    box(x + 5, y + 9, 4, 15, '#5e6350');
    box(x + 53, y + 9, 4, 15, '#5e6350');
    box(x, y, 65, 5, '#a57650');
    box(x, y + 7, 65, 5, '#c69a68');
    box(x, y + 15, 65, 5, '#a57650');
  }
  for (const [x, y] of [
    [348, 242],
    [650, 242],
    [414, 524],
    [550, 526],
  ]) {
    box(x, y - 33, 4, 36, '#5b7058');
    box(x - 5, y - 40, 14, 12, '#f1dba0');
    box(x - 7, y - 43, 18, 4, '#4d6654');
  }
  // Small flowers distributed in planted borders.
  for (let i = 0; i < 110; i++) {
    const x = 70 + random() * 810,
      y = 544 + random() * 26;
    if (x > 420 && x < 540) continue;
    box(x, y, 2, 5, '#648653');
    box(x - 1, y - 1, 4, 3, i % 3 ? '#e7d5a3' : '#dfab9c');
  }
  // A small restroom annex; private care takes place offscreen.
  box(566, 386, 74, 40, '#e5dbb8');
  box(562, 378, 82, 12, '#577b71');
  box(594, 400, 19, 26, '#6d8e7b');
  box(573, 394, 16, 14, '#94b5ab');
  c.font = '11px sans-serif';
  c.textAlign = 'center';
  c.fillStyle = '#304f3b';
  c.fillText('洗手間', 603, 373);
  texture.refresh();
  makeRoomArt(scene);
  const treeTexture = scene.textures.createCanvas('campus-tree', 88, 104)!;
  const t = treeTexture.context;
  const r = (x: number, y: number, w: number, h: number, color: string) => {
    t.fillStyle = color;
    t.fillRect(x, y, w, h);
  };
  r(18, 86, 60, 12, '#536f4b55');
  r(38, 50, 14, 45, '#786349');
  r(43, 60, 5, 31, '#a38b61');
  r(20, 18, 48, 58, '#3c6750');
  r(8, 32, 72, 32, '#3c6750');
  r(26, 7, 36, 72, '#3c6750');
  r(17, 25, 56, 36, '#507c59');
  r(27, 14, 34, 54, '#507c59');
  r(13, 35, 63, 18, '#507c59');
  r(27, 22, 20, 20, '#70965f');
  r(21, 32, 34, 15, '#70965f');
  r(52, 38, 16, 14, '#648c58');
  r(30, 21, 9, 8, '#8cab70');
  r(25, 37, 10, 5, '#8cab70');
  r(55, 39, 5, 4, '#87a56a');
  treeTexture.refresh();
  for (const [index, color] of ['#e6bf70', ...stories.map((s) => s.color), '#69776b'].entries()) {
    const key = `person-${index}`;
    const sheet = scene.textures.createCanvas(key, 16 * 12, 26)!;
    const ctx = sheet.context;
    for (let direction = 0; direction < 4; direction++)
      for (let frame = 0; frame < 3; frame++) {
        const ox = (direction * 3 + frame) * 16;
        const rect = (x: number, y: number, w: number, h: number, fill: string) => {
          ctx.fillStyle = fill;
          ctx.fillRect(ox + x, y, w, h);
        };
        const bob = frame === 1 ? 0 : -1;
        rect(3, 23, 11, 2, '#324b3c44');
        const hair = index % 3 === 0 ? '#514234' : index % 3 === 1 ? '#393e38' : '#735244';
        rect(4, 2 + bob, 9, 9, hair);
        rect(3, 4 + bob, 11, 5, hair);
        rect(5, 6 + bob, 7, 7, '#e4b58c');
        if (direction === 3) rect(4, 4 + bob, 9, 7, hair);
        else {
          rect(direction === 1 ? 5 : direction === 2 ? 10 : 6, 8 + bob, 1, 2, '#374c3d');
          if (!direction) rect(10, 8 + bob, 1, 2, '#374c3d');
        }
        rect(4, 13 + bob, 9, 7, color);
        rect(7, 13 + bob, 2, 4, '#f6eed4');
        rect(2, 14 + bob, 2, 6, color);
        rect(13, 14 + bob, 2, 6, color);
        rect(2, 19 + bob, 2, 2, '#e4b58c');
        rect(13, 19 + bob, 2, 2, '#e4b58c');
        rect(5, 20, 3, frame === 0 ? 3 : 4, '#3e5356');
        rect(10, 20, 3, frame === 2 ? 3 : 4, '#3e5356');
        rect(4, frame === 0 ? 22 : 24, 4, 1, '#39483e');
        rect(10, frame === 2 ? 22 : 24, 4, 1, '#39483e');
        if (stories[index - 1]?.id === 'vision') {
          rect(14, 16, 1, 9, '#f4efd6');
          rect(14, 23, 1, 2, '#9a5c4b');
        }
        if (stories[index - 1]?.id === 'mobility') {
          rect(1, 20, 5, 5, '#42535a');
          rect(11, 20, 5, 5, '#42535a');
          rect(2, 21, 3, 3, '#a9b4a7');
          rect(12, 21, 3, 3, '#a9b4a7');
          rect(4, 18, 10, 3, '#5a7477');
        }
      }
    for (let frame = 0; frame < 12; frame++) sheet.add(frame, 0, frame * 16, 0, 16, 26);
    sheet.refresh();
  }
}
export function addTrees(scene: Phaser.Scene) {
  for (const [x, y] of trees)
    scene.add
      .image(x, y, 'campus-tree')
      .setOrigin(0.5, 0.9)
      .setDepth(y + 8);
}

function makeRoomArt(scene: Phaser.Scene) {
  for (const map of ['classroom', 'playground', 'office']) {
    const texture = scene.textures.createCanvas(`${map}-map`, WORLD.width, WORLD.height)!;
    const c = texture.context;
    const box = (x: number, y: number, w: number, h: number, color: string) => {
      c.fillStyle = color;
      c.fillRect(x, y, w, h);
    };
    const text = (value: string, x: number, y: number) => {
      c.font = 'bold 14px sans-serif';
      c.textAlign = 'center';
      c.fillStyle = '#304f3b';
      c.fillText(value, x, y);
    };
    if (map === 'classroom' || map === 'office') {
      box(0, 0, 960, 640, '#6b7862');
      box(28, 28, 904, 580, '#d5bd8e');
      for (let y = 28; y < 608; y += 24)
        for (let x = 28; x < 932; x += 48) {
          box(x, y, 47, 23, (x / 48 + y / 24) % 3 < 1 ? '#d7c297' : '#dcc8a2');
          box(x + 6, y + 5, 24, 1, '#c9b286');
        }
      box(28, 28, 904, 40, '#e7dec3');
      box(28, 68, 904, 8, '#bba77e');
      box(100, 64, 760, 60, '#a4825d');
      box(108, 70, 744, 44, '#436854');
      c.font = '18px sans-serif';
      c.fillStyle = '#eee8cb';
      c.textAlign = 'center';
      c.fillText(
        map === 'office' ? '教師辦公室　　如實說明・保留隱私' : '七年三班　　先詢問・再協助',
        480,
        99,
      );
      box(728, 75, 110, 57, '#f4efd9');
      box(724, 70, 118, 5, '#9c9b85');
      for (const y of [148, 270, 392]) {
        box(29, y, 14, 84, '#8c9f8c');
        box(32, y + 4, 8, 76, '#b4d0c2');
        box(916, y, 15, 84, '#8c9f8c');
        box(919, y + 4, 8, 76, '#b4d0c2');
      }
      if (map === 'office') {
        box(420, 208, 160, 64, '#9d7954');
        box(424, 212, 152, 52, '#c8a36c');
        box(440, 224, 34, 23, '#efe9cf');
        box(485, 218, 48, 31, '#65796a');
        box(489, 222, 40, 21, '#b8cdbd');
        box(126, 150, 52, 180, '#9d7954');
        for (let y = 155; y < 328; y += 30) {
          box(130, y, 44, 26, '#bd9f73');
          box(148, y + 12, 12, 3, '#5e6d55');
        }
        for (const x of [340, 560]) {
          box(x, 420, 60, 30, '#a6855b');
          box(x, 420, 60, 8, '#c4a06e');
        }
        text('林老師', 500, 192);
        text('訪談座位', 480, 474);
      } else {
        for (const x of [310, 470, 630])
          for (const y of [268, 370, 472]) {
            box(x + 6, y + 38, 86, 10, '#ad966f');
            box(x, y, 92, 42, '#9d7954');
            box(x + 3, y + 3, 86, 31, '#c8a36c');
            box(x + 14, y + 9, 23, 16, '#efe9cf');
            box(x + 17, y + 13, 17, 1, '#a3ae94');
            box(x + 60, y + 44, 23, 18, '#a6855b');
            box(x + 57, y + 45, 29, 5, '#c4a06e');
          }
        box(106, 202, 92, 68, '#9d7954');
        box(110, 206, 84, 54, '#c8a36c');
        box(122, 214, 32, 24, '#efead3');
        box(163, 211, 17, 30, '#758d78');
        box(808, 310, 48, 164, '#987654');
        for (let y = 316; y < 472; y += 31)
          for (let x = 812; x < 850; x += 9)
            box(x, y, 6, 22, ['#8ba194', '#b98d76', '#d5bd80'][(x + y) % 3]);
      }
      box(450, 600, 60, 16, '#ad936c');
      box(450, 608, 60, 8, '#e8d7b4');
      text('作業桌', 150, 187);
      text('閱讀角', 830, 496);
      text('回校園', 480, 634);
    } else {
      box(0, 0, 960, 640, '#89a970');
      for (let y = 0; y < 640; y += 16)
        for (let x = 0; x < 960; x += 16)
          if ((x * 3 + y * 7) % 13 < 5) box(x + 2, y + 6, 3, 3, '#9eb984');
      c.fillStyle = '#b98666';
      c.beginPath();
      c.roundRect(142, 140, 676, 420, 154);
      c.fill();
      c.strokeStyle = '#ecd8b5';
      c.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        c.beginPath();
        c.roundRect(154 + i * 14, 152 + i * 14, 652 - i * 28, 396 - i * 28, 142 - i * 14);
        c.stroke();
      }
      c.fillStyle = '#91ad76';
      c.beginPath();
      c.roundRect(214, 212, 532, 276, 82);
      c.fill();
      c.strokeStyle = '#eee4c0';
      c.strokeRect(300, 254, 360, 188);
      c.beginPath();
      c.arc(480, 348, 44, 0, Math.PI * 2);
      c.moveTo(480, 254);
      c.lineTo(480, 442);
      c.stroke();
      box(320, 82, 320, 26, '#779066');
      for (let i = 0; i < 3; i++) {
        box(326, 60 + i * 13, 308, 8, '#cbbd97');
        box(326, 68 + i * 13, 308, 3, '#a5997b');
      }
      for (const x of [112, 824]) {
        box(x, 140, 20, 100, '#c1b18b');
        box(x + 4, 146, 12, 86, '#ece1bc');
      }
      box(792, 450, 64, 32, '#9b805f');
      box(796, 454, 56, 23, '#bb9b72');
      for (let i = 0; i < 3; i++) {
        c.fillStyle = '#b36e47';
        c.beginPath();
        c.arc(806 + i * 16, 465, 6, 0, Math.PI * 2);
        c.fill();
      }
      box(22, 516, 132, 48, '#d9cc9f');
      box(27, 500, 5, 66, '#dfd7b7');
      text('友善操場', 480, 42);
      text('集合區', 700, 548);
      text('器材箱', 824, 504);
      text('回校園', 76, 596);
    }
    texture.refresh();
  }
}
