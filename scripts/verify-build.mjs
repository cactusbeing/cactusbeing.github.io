import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
const outputDirectory = process.argv[2] || 'dist';
const built = (file) => resolve(outputDirectory, file);
const baseline = JSON.parse(readFileSync('docs/legacy-baseline.json', 'utf8'));
for (const { file } of baseline.pages) {
  if (!existsSync(built(file))) throw new Error(`Missing public page: ${file}`);
}
for (const { file, sha256 } of baseline.files) {
  const hash = createHash('sha256')
    .update(readFileSync(built(file)))
    .digest('hex');
  if (hash !== sha256) throw new Error(`Changed public asset: ${file}`);
}
console.log(
  `Compatibility: ${baseline.pages.length} HTML URLs and ${baseline.files.length} unchanged asset hashes verified.`,
);
const originalArticles = JSON.parse(readFileSync('docs/article-baseline.json', 'utf8'));
const plainText = (html) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
for (const [file, body] of Object.entries(originalArticles)) {
  const output = readFileSync(built(file), 'utf8');
  const actual = output.match(/<article>([\s\S]*?)<\/article>/)?.[1];
  if (!actual || plainText(actual) !== plainText(body))
    throw new Error(`Changed article output text: ${file}`);
}
console.log('Content: all 7 authored article bodies retain their text in production output.');

const pages = [
  ...baseline.pages.map((page) => page.file),
  'exam/index.html',
  'exam/history/index.html',
  'game/index.html',
  'game/campus/index.html',
  '404.html',
];
if (existsSync(built('campus/index.html')))
  throw new Error('Removed campus entry must not be emitted.');
const campusHtml = readFileSync(built('game/campus/index.html'), 'utf8');
const deploymentBase = campusHtml.match(/src="([^"]*\/)?bundles\//)?.[1] || '/';
for (const file of pages) {
  const html = readFileSync(built(file), 'utf8');
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), `https://local.test/${file}`);
    if (url.origin !== 'https://local.test' || match[1].startsWith('#')) continue;
    let path = decodeURIComponent(url.pathname);
    if (deploymentBase !== '/' && path.startsWith(deploymentBase))
      path = '/' + path.slice(deploymentBase.length);
    if (path.endsWith('/')) path += 'index.html';
    if (!existsSync(resolve(outputDirectory, '.' + path)))
      throw new Error(`Broken built reference in ${file}: ${match[1]}`);
  }
}
const outputFiles = readdirSync(outputDirectory);
for (const privatePath of ['src', 'docs', 'node_modules', 'REFACTOR_PLAN.md', '.git']) {
  if (outputFiles.includes(privatePath))
    throw new Error(`Unexpected deployment file: ${privatePath}`);
}
console.log('Pages: deep entries, local HTML references, 404 and artifact boundaries verified.');
