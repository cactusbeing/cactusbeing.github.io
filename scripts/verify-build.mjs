import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import katex from 'katex';
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
  'game/money/index.html',
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

const examIndex = JSON.parse(readFileSync(built('assets/exams/index.json'), 'utf8'));
for (const file of readdirSync(built('assets/exams'), { recursive: true, encoding: 'utf8' })) {
  if (/\.pdf$/i.test(file) || file.split(/[\\/]/).some((part) => ['source', 'originals'].includes(part)))
    throw new Error(`Exam review originals must stay outside the website: ${file}`);
}
function validateMath(text) {
  const pattern = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  for (const match of text.matchAll(pattern))
    katex.renderToString(match[1] ?? match[2], { throwOnError: true, strict: false, trust: false });
  if (text.replace(pattern, '').includes('$')) throw new Error('Unclosed LaTeX expression');
}
function validateBlocks(blocks) {
  const images = [];
  for (const block of blocks) {
    if (block.type === 'text') validateMath(block.text);
    else if (block.type === 'image') {
      if (block.src.includes('/originals/')) throw new Error('Math diagram must not be a full question screenshot');
      images.push(block.src);
    } else if (block.type === 'box') images.push(...validateBlocks(block.blocks));
    else if (block.type === 'columns') block.columns.forEach((column) => images.push(...validateBlocks(column)));
    else throw new Error('Unknown exam content block');
  }
  return images;
}
let examQuestionCount = 0;
for (const year of examIndex.years) {
  const ids = new Set();
  const paths = new Set();
  const categories = new Set((year.categories ?? []).map((category) => category.id));
  for (const subject of year.subjects) {
    if (ids.has(subject.id) || paths.has(subject.data))
      throw new Error(`Duplicate exam paper: ${year.year} ${subject.id}`);
    ids.add(subject.id);
    paths.add(subject.data);
    if (subject.categories?.some((category) => !categories.has(category)))
      throw new Error(`Unknown exam category: ${year.year} ${subject.id}`);
    const data = JSON.parse(readFileSync(built(subject.data.replace(/^\//, '')), 'utf8'));
    if (data.exam_metadata.source_questions_pdf || data.exam_metadata.source_answers_pdf)
      throw new Error(`Original PDF links must not be published: ${year.year} ${subject.id}`);
    const questions = data.multiple_choice_questions;
    if (questions.length !== subject.count || questions.some((question, index) => question.id !== index + 1))
      throw new Error(`Incomplete exam questions: ${year.year} ${subject.id}`);
    for (const question of questions) {
      if (question.original_image || question.original_width || question.original_height)
        throw new Error(`Full question screenshot must not be published: ${year.year} ${subject.id} Q${question.id}`);
      const answers = question.accepted_answers ?? [question.answer];
      if (!question.question?.trim() || !answers.includes(question.answer) ||
          answers.some((answer) => !['A', 'B', 'C', 'D'].includes(answer)) ||
          ['A', 'B', 'C', 'D'].some((choice) => !question.options[choice]?.trim()))
        throw new Error(`Invalid exam content: ${year.year} ${subject.id} Q${question.id}`);
      const diagrams = question.body_blocks ? validateBlocks(question.body_blocks) : [];
      if (question.body_blocks) Object.values(question.options).forEach(validateMath);
      if (year.year === 115 && subject.id === 'math' &&
          (!question.body_blocks?.length || question.image || question.original_image ||
           (question.id <= 6 && diagrams.length)))
        throw new Error('115 math must use text, LaTeX and figure-only images');
      for (const path of [question.image, ...diagrams].filter(Boolean)) {
        if (path.includes('/originals/')) throw new Error(`Unexpected review image: ${path}`);
        if (!existsSync(built(path.replace(/^\//, ''))))
          throw new Error(`Missing exam image: ${path}`);
      }
    }
    const points = data.exam_metadata.parts.find((part) => part.name === '選擇題')?.points;
    if (subject.points !== undefined && points !== subject.points)
      throw new Error(`Inconsistent exam score: ${year.year} ${subject.id}`);
    examQuestionCount += questions.length;
  }
}
console.log(`Exams: ${examQuestionCount} questions, unique papers, categories and required diagrams verified; no original PDFs or review screenshots published.`);
