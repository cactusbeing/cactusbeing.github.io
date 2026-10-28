import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, extname } from 'node:path';

// Run locally with cwebp installed. Generated files are committed, so CI needs no image encoder.
// Keep the original public assets intact for existing article URLs and downloads.
const photos = [
  'postbrain-bg', 'post-bg', 'pbs', 'tool-background', 'learn', 'about-bg',
];
const resources = ['work', 'math', 'pexels-mh-j-5720724', 'life', 'yan-krukov-8618062'];
const targets = [
  ...photos.map((name) => ({ file: `assets/img/${name}.jpg`, widths: [480, 960] })),
  { file: 'assets/img/post/融合教育.jpeg', widths: [480, 960] },
  ...resources.map((name) => ({ file: `assets/img/${name}.jpg`, widths: [240, 480, 960] })),
  { file: 'assets/img/home-bg.jpg', widths: [640, 1024, 1280, 1920] },
  { file: 'assets/decor/campus-invitation.png', widths: [800, 1024, 1568] },
  ...['cactus-tall', 'cactus-pear', 'succulent', 'books', 'leaf-spray', 'leaf-eucalyptus']
    .map((name) => ({ file: `assets/decor/banner/${name}.png`, widths: [200], lossless: true })),
  ...['canva-cactus-books', 'canva-botanical-sprig']
    .map((name) => ({ file: `assets/decor/${name}.png`, widths: [198], lossless: true })),
];
mkdirSync('assets/optimized', { recursive: true });
const manifest = {};
for (const { file, widths, lossless } of targets) {
  manifest[`/${file}`] = widths.map((width) => {
    const output = `assets/optimized/${basename(file, extname(file))}-${width}.webp`;
    execFileSync('cwebp', [
      '-quiet', ...(lossless ? ['-lossless'] : ['-q', '80', '-sharp_yuv']),
      '-m', '6', '-resize', String(width), '0', file, '-o', output,
    ]);
    return { src: `/${output}`, width };
  });
}
writeFileSync('src/content/image-variants.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Generated WebP variants for ${targets.length} original images.`);
