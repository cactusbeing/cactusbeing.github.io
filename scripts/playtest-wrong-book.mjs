import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

// Uses Cogpit's shared default browser and restores all exam storage on exit.
const url = process.argv[2] ?? 'http://127.0.0.1:5173/exam/';
const evidence = process.env.EXAM_EVIDENCE ?? '/tmp/exam-wrong-book-review';
mkdirSync(evidence, { recursive: true });
function browser(...args) {
  const result = JSON.parse(execFileSync('agent-browser', ['--json', ...args], { encoding: 'utf8', timeout: 60000, maxBuffer: 16 * 1024 * 1024 }));
  if (!result.success) throw new Error(JSON.stringify(result.error));
  return result.data;
}
function evaluate(fn, ...args) { return browser('eval', `(${fn.toString()})(${args.map(value => JSON.stringify(value)).join(',')})`).result; }
function waitFor(selector) {
  evaluate(async selector => {
    for (let i = 0; i < 200; i++) {
      if (document.querySelector(selector)) return;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    throw new Error('Timed out: ' + selector);
  }, selector);
}
const settle = () => evaluate(async () => { await new Promise(resolve => setTimeout(resolve, 100)); });
function click(selector, prefix = '') {
  evaluate((selector, prefix) => {
    const button = [...document.querySelectorAll(selector)].find(item => item.textContent.trim().startsWith(prefix));
    if (!button || button.disabled) throw new Error('Missing enabled control: ' + selector + ' ' + prefix);
    button.click();
  }, selector, prefix);
  settle();
}
function input(selector, value) {
  evaluate((selector, value) => { const control = document.querySelector(selector); control.value = String(value); control.dispatchEvent(new Event('input', { bubbles: true })); }, selector, value);
  settle();
}
const content = selector => evaluate(selector => document.querySelector(selector)?.textContent, selector);
const chinese = JSON.parse(readFileSync(new URL('../assets/exams/115/chinese.json', import.meta.url))).multiple_choice_questions;
const manifest = JSON.parse(readFileSync(new URL('../assets/exams/index.json', import.meta.url))).years;
const mistakesKey = 'cactusbeing-exam-mistakes-v1';
function mistake(id, answer, subjectId = 'chinese', year = 115) {
  const subject = manifest.find(item => item.year === year).subjects.find(item => item.id === subjectId);
  return [`${year}/${subjectId}/${id}`, { year, subjectId, subjectName: subject.name, questionId: id, resolved: false, ...(answer !== undefined ? { userAnswer: answer } : {}) }];
}
function reset(entries = [], responses = {}) {
  evaluate((entries, responses) => {
    for (const key of Object.keys(localStorage)) if (key.startsWith('cactusbeing-exam-')) localStorage.removeItem(key);
    localStorage.setItem('cactusbeing-exam-mistakes-v1', JSON.stringify(Object.fromEntries(entries)));
    for (const [key, value] of Object.entries(responses)) localStorage.setItem(key, JSON.stringify(value));
  }, entries, responses);
  browser('open', url);
  waitFor('.practice-entry');
  evaluate(() => { window.confirm = () => true; });
}
function revenge() { click('.practice-entry', '錯題復仇戰'); waitFor('#revenge[aria-busy="false"]'); }
function layout() { const result = evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth })); assert.ok(result.scroll <= result.width, JSON.stringify(result)); return result; }
function captureDownloads() {
  evaluate(() => {
    window.__wrongBookDownloads = [];
    const create = URL.createObjectURL;
    URL.createObjectURL = function(blob) { const value = create.call(this, blob); window.__wrongBookBlob = blob; return value; };
    const click = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function() { if (this.download) window.__wrongBookDownloads.push(this.download); return click.call(this); };
  });
}
const report = { checks: [], layouts: [], pdf: null };
browser('open', url); waitFor('.practice-entry');
const backup = evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => key.startsWith('cactusbeing-exam-'))));
try {
  reset(); revenge();
  assert.equal(evaluate(() => document.querySelectorAll('.revenge-start').length), 1);
  assert.equal(evaluate(() => document.querySelector('.revenge-start').disabled), true);
  report.checks.push('Empty ledger keeps Start visible and disabled');

  const wrongChoice = ['A', 'B', 'C', 'D'].find(choice => choice !== chinese[0].answer);
  reset([mistake(1, wrongChoice), mistake(2, null), mistake(3), mistake(1, 'A', 'education-primary', 114), mistake(1, 'A', 'education-primary'), mistake(1, 'B', 'math')], { 'cactusbeing-exam-115-chinese-v1': { 3: 'D' } });
  revenge();
  click('.revenge-subject-dropdown summary');
  input('.revenge-subject-search input', '數學');
  assert.equal(evaluate(() => document.querySelectorAll('.revenge-subject-option').length), 1);
  click('.revenge-subject-actions button', '清除選擇');
  assert.equal(evaluate(() => document.querySelector('.revenge-start').disabled), true);
  input('.revenge-subject-search input', '');
  click('.revenge-subject-dropdown summary');
  const spacing = evaluate(() => ({ gap: document.querySelector('.revenge-actions').getBoundingClientRect().top - document.querySelector('.revenge-subject-dropdown').getBoundingClientRect().bottom }));
  assert.ok(spacing.gap >= 16, JSON.stringify(spacing));
  browser('set', 'viewport', '390', '844');
  report.layouts.push({ mode: 'zero-subjects-mobile', ...layout(), ...spacing });
  evaluate(() => document.querySelector('.revenge-subject-dropdown').scrollIntoView({ block: 'center' }));
  browser('screenshot', evidence + '/zero-subjects-mobile.png');
  click('.revenge-subject-dropdown summary'); click('.revenge-subject-actions button', '全選科目'); click('.revenge-subject-dropdown summary');
  assert.equal(evaluate(() => document.querySelector('.revenge-start').disabled), false);
  click('.revenge-book-open');
  assert.equal(evaluate(() => document.activeElement.id), 'wrong-book-title');
  assert.equal(evaluate(() => document.querySelectorAll('.book-question').length), 0);
  assert.equal(evaluate(() => [...document.querySelectorAll('.book-subject h3')].filter(h => h.textContent.includes('教育理念')).length), 2);
  evaluate(() => [...document.querySelectorAll('.book-subject')].find(group => group.querySelector('h3').textContent === '國語文能力測驗').querySelector('summary').click()); settle();
  const answers = evaluate(() => [...document.querySelectorAll('.book-question')].map(question => ({ source: question.querySelector('.book-source').textContent, answer: question.querySelector('.book-answer').textContent, labels: question.querySelector('.result-options').textContent })));
  assert.match(answers.find(item => item.source.endsWith('第 1 題')).labels, /正確答案/);
  assert.match(answers.find(item => item.source.endsWith('第 1 題')).labels, /你的選擇/);
  assert.match(answers.find(item => item.source.endsWith('第 2 題')).answer, /未作答／未提交/);
  assert.match(answers.find(item => item.source.endsWith('第 3 題')).answer, /無歷史作答紀錄/);
  report.layouts.push({ mode: 'wrong-book-mobile', ...layout() });
  evaluate(() => document.querySelector('.book-question').scrollIntoView({ block: 'start' }));
  browser('screenshot', evidence + '/wrong-book-mobile.png');
  captureDownloads();
  evaluate(() => { window.__originalBookCreateURL = URL.createObjectURL; URL.createObjectURL = () => { throw new Error('Injected export failure'); }; });
  click('.book-download'); waitFor('.book-error');
  assert.match(content('.book-error'), /PDF 產生失敗/);
  evaluate(() => { URL.createObjectURL = window.__originalBookCreateURL; });
  click('.book-download'); waitFor('.wrong-book-browser .book-message[role="status"]');
  assert.match(content('.wrong-book-browser .book-message'), /下載已開始/);
  assert.match(evaluate(() => window.__wrongBookDownloads.at(-1)), /歷史錯題本.pdf$/);
  click('.book-close'); assert.equal(evaluate(() => document.activeElement.classList.contains('revenge-book-open')), true);
  report.checks.push('Searchable multi-select, clear/all, zero-selection spacing, focus/return focus, category-safe groups, unknown vs unanswered, answer text labels, failed export retry and success announcement');

  reset(Array.from({ length: 10 }, (_, i) => mistake(i + 1, 'A'))); revenge();
  input('.revenge-count-label input', 10);
  evaluate(() => { const entries = JSON.parse(localStorage.getItem('cactusbeing-exam-mistakes-v1')); for (const item of Object.values(entries)) if (item.questionId > 3) item.resolved = true; localStorage.setItem('cactusbeing-exam-mistakes-v1', JSON.stringify(entries)); });
  click('.revenge-start'); waitFor('.battle-toolbar'); waitFor('.question-card[aria-busy="false"]');
  assert.match(content('.battle-status'), /第 1 \/ 3 題/);
  assert.match(content('.battle-status'), /改為挑戰 3 題/);
  assert.equal(evaluate(() => Boolean(document.querySelector('.wrong-book-download'))), false);
  const timedOutId = Number(content('.battle-menu-source').match(/第 (\d+) 題/)[1]);
  evaluate(async () => { window.__bookRealNow = Date.now; const now = Date.now; Date.now = () => now() + 61000; window.dispatchEvent(new Event('focus')); await new Promise(resolve => setTimeout(resolve, 150)); });
  assert.equal(evaluate(id => JSON.parse(localStorage.getItem('cactusbeing-exam-mistakes-v1'))[`115/chinese/${id}`].userAnswer, timedOutId), null);
  waitFor('.question-card[aria-busy="false"]');
  click('.battle-menu button', '提前交卷'); waitFor('.result-summary');
  assert.equal(evaluate(() => Boolean(document.querySelector('.result-actions .review-button'))), true);
  report.checks.push('10 requested questions shrinking to 3 starts immediately with notice; revenge timeout clears old A; active battle has no download toolbar, results retain download');

  // A 300-question bank exercises lazy rendering without creating 300 question DOM trees.
  reset();
  evaluate(() => {
    const questions = Array.from({ length: 300 }, (_, index) => ({ id: index + 1, question: `測試題幹 ${index + 1}`, answer: 'B', options: { A: '選項甲', B: '選項乙', C: '選項丙', D: '選項丁' }, ...(index === 0 ? { body_blocks: [], image: '/assets/exams/115/development-q14-table.png' } : {}) }));
    window.__bookFixture = { exam_metadata: { subject: '國語文能力測驗' }, multiple_choice_questions: questions };
    window.__nativeBookFetch = window.fetch;
    window.fetch = (...args) => String(args[0]).includes('/115/chinese.json') ? Promise.resolve(new Response(JSON.stringify(window.__bookFixture), { status: 200, headers: { 'Content-Type': 'application/json' } })) : window.__nativeBookFetch(...args);
    window.__fixtureBookFetch = window.fetch;
    const mistakes = Object.fromEntries(questions.map(question => [`115/chinese/${question.id}`, { year: 115, subjectId: 'chinese', subjectName: '國語文能力測驗', questionId: question.id, resolved: false, userAnswer: 'A' }]));
    localStorage.setItem('cactusbeing-exam-mistakes-v1', JSON.stringify(mistakes));
  });
  revenge(); click('.revenge-count-presets button', '20 題');
  assert.equal(evaluate(() => document.querySelector('.revenge-count-label input').value), '20');
  click('.revenge-book-open');
  assert.equal(evaluate(() => document.querySelectorAll('.book-question').length), 0);
  const expandedMs = evaluate(async () => { const start = performance.now(); document.querySelector('.book-question-list > summary').click(); await new Promise(resolve => setTimeout(resolve, 100)); return performance.now() - start; });
  assert.equal(evaluate(() => document.querySelectorAll('.book-question').length), 20);
  assert.match(content('.book-question h4'), /測試題幹 1/);
  assert.equal(evaluate(() => getComputedStyle(document.querySelector('.book-question img')).objectFit), 'contain');
  click('.book-load-more'); assert.equal(evaluate(() => document.querySelectorAll('.book-question').length), 40);
  click('.book-question-list > summary'); assert.equal(evaluate(() => document.querySelectorAll('.book-question').length), 0);
  report.checks.push(`300-question bank: no collapsed question DOM, 20 initially, 40 after More, released on collapse (first expansion ${Math.round(expandedMs)} ms including a 100 ms settle); empty body blocks use original stem; images contained`);

  // Loading/error must hide old groups, including when the previous pool is still cached.
  evaluate(() => { window.fetch = (...args) => String(args[0]).includes('/115/chinese.json') ? new Promise((resolve, reject) => { window.__rejectBookLoad = reject; }) : window.__nativeBookFetch(...args); });
  click('.revenge-start'); waitFor('#revenge[aria-busy="true"]');
  assert.equal(evaluate(() => document.querySelectorAll('.book-subject').length), 0);
  assert.equal(evaluate(() => document.querySelector('.revenge-start').disabled), true);
  evaluate(() => { window.__rejectBookLoad(new Error('Injected loading failure')); });
  waitFor('.wrong-book-browser .book-error');
  assert.equal(evaluate(() => document.querySelectorAll('.book-subject').length), 0);
  evaluate(() => { window.fetch = window.__fixtureBookFetch; });
  click('.wrong-book-browser .book-error button'); waitFor('.book-subject');
  report.checks.push('Cached groups and counts are hidden during loading/failure, retry restores fresh groups');

  const race = evaluate(async () => {
    const pause = () => new Promise(resolve => setTimeout(resolve, 40));
    let release, signal, calls = 0;
    window.fetch = async (...args) => {
      if (!String(args[0]).includes('/115/chinese.json')) return window.__nativeBookFetch(...args);
      calls++;
      const older = calls === 1;
      if (older) { signal = args[1]?.signal; await new Promise(resolve => { release = resolve; }); }
      return new Response(JSON.stringify({ ...window.__bookFixture, multiple_choice_questions: window.__bookFixture.multiple_choice_questions.slice(0, older ? 3 : 7) }), { status: 200 });
    };
    const enter = () => [...document.querySelectorAll('.practice-entry')].find(button => button.textContent.includes('錯題復仇戰')).click();
    document.querySelector('.mode-back').click(); await pause(); enter(); await pause();
    document.querySelector('.mode-back').click(); await pause(); enter();
    for (let i = 0; i < 100 && document.querySelector('#revenge')?.getAttribute('aria-busy') !== 'false'; i++) await pause();
    const before = document.querySelector('.revenge-status').textContent;
    release(); await pause(); await pause();
    return { before, after: document.querySelector('.revenge-status').textContent, aborted: signal.aborted, loading: document.querySelector('#revenge').getAttribute('aria-busy') };
  });
  assert.equal(race.aborted, true); assert.match(race.before, /7 題/); assert.equal(race.after, race.before); assert.equal(race.loading, 'false');
  report.checks.push('Delayed older response ignores abort at transport but cannot overwrite latest 7-question pool/loading state');

  // Immediate download controls in normal, random and sequential modes.
  for (const mode of ['normal', 'random', 'sequential']) {
    reset(); captureDownloads();
    click('.practice-entry', mode === 'random' ? '隨機抽題' : '歷屆試題');
    if (mode === 'random') {
      click('.subject-selection-actions button', '清除科目');
      evaluate(() => [...document.querySelectorAll('.exam-settings label')].find(label => label.textContent.trim() === '國語文能力測驗').querySelector('input').click()); settle();
      input('.random-start input', 2); click('.start-button');
    } else {
      if (mode === 'sequential') { click('.timing-trigger'); evaluate(() => [...document.querySelectorAll('.shared-timing-panel label')].find(label => label.textContent.trim() === '每題限時').querySelector('input').click()); settle(); }
      click('.subject-row', '國語文能力測驗');
    }
    waitFor('.question-card');
    const id = mode === 'random' ? Number(content('.question-source').match(/第 (\d+) 題/)[1]) : 1;
    const correct = chinese.find(item => item.id === id).answer;
    click('.question-card .choice', ['A', 'B', 'C', 'D'].find(choice => choice !== correct));
    click('.question-actions button', '送出'); waitFor('.wrong-book-download');
    assert.equal(evaluate(() => document.querySelectorAll('.view-switch [aria-pressed]').length), mode === 'sequential' ? 0 : 2);
    assert.equal(evaluate(() => document.body.textContent.includes('不用完成整份試卷') || document.body.textContent.includes('已即時收錄')), false);
    click('.wrong-book-download');
    evaluate(async () => { for (let i = 0; i < 200; i++) { if (window.__wrongBookDownloads.length) return; await new Promise(resolve => setTimeout(resolve, 50)); } throw new Error('Partial PDF never downloaded'); });
    assert.match(evaluate(() => window.__wrongBookDownloads.at(-1)), /未完成測驗錯題本.pdf$/);
    report.checks.push(`${mode}: unfinished wrong answer immediately enables PDF in range controls, no collection prompt, correct navigation controls and filename`);
  }

  // Export 120 real source questions (including math, diagrams and reading passages).
  evaluate(() => { window.confirm = () => true; });
  click('.practice-heading .back-link');
  const pdf = evaluate(async () => {
    const { downloadWrongBook, wrongBookPresentation } = await import('/src/features/exam/wrong-book-pdf.ts');
    const presentation = ['completed', 'in-progress', 'collection'].map(type => wrongBookPresentation(type, 115, '測試科目', 120, 2, 125, 100));
    const papers = await Promise.all(['chinese', 'education', 'development', 'curriculum', 'math'].map(async subjectId => {
      const data = await (await fetch(`/assets/exams/115/${subjectId}.json`)).json();
      return data.multiple_choice_questions.map(question => ({ ...question, source: { year: 115, subjectId, subjectName: subjectId, questionId: question.id }, user_answer: 'A' }));
    }));
    const questions = papers.flat().slice(0, 120);
    const proto = CanvasRenderingContext2D.prototype;
    const originalText = proto.fillText, originalImage = proto.drawImage;
    let sources = 0, pages = 0, outOfBounds = 0, liveCanvases = new Set();
    const canvasProto = HTMLCanvasElement.prototype;
    const originalBlob = canvasProto.toBlob;
    const isPdf = canvas => canvas.width === 1240 && canvas.height === 1754;
    proto.fillText = function(value, x, y) {
      if (isPdf(this.canvas)) { if (value.startsWith('來源：')) sources++; if (y > 1662 || y < 25) outOfBounds++; }
      return originalText.apply(this, arguments);
    };
    proto.drawImage = function(image, x, y, width, height) { if (isPdf(this.canvas) && (y < 140 || y + height > 1662.1)) outOfBounds++; return originalImage.apply(this, arguments); };
    canvasProto.toBlob = function() { if (isPdf(this)) { pages++; liveCanvases.add(this); } return originalBlob.apply(this, arguments); };
    let beats = 0; const heartbeat = setInterval(() => beats++, 50);
    const started = performance.now();
    try {
      await downloadWrongBook(115, '大量題目驗證', questions, {}, 0, questions.length, 240, '歷史錯題本', {}, 'collection');
      const bytes = new Uint8Array(await window.__wrongBookBlob.arrayBuffer());
      const text = new TextDecoder('latin1').decode(bytes);
      const xref = Number(text.match(/startxref\n(\d+)\n%%EOF$/)[1]);
      const lines = text.slice(xref).split('\n');
      const entries = Number(lines[1].split(' ')[1]);
      let validOffsets = lines[0] === 'xref';
      for (let id = 1; id < entries; id++) validOffsets &&= text.slice(Number(lines[2 + id].slice(0, 10))).startsWith(`${id} 0 obj`);
      return { questions: questions.length, mathQuestions: questions.filter(question => question.body_blocks?.length).length, pages, sources, outOfBounds, bytes: bytes.length, durationMs: Math.round(performance.now() - started), heartbeat: beats, releasedCanvases: [...liveCanvases].every(canvas => canvas.width === 0), validOffsets, presentation };
    } finally { clearInterval(heartbeat); proto.fillText = originalText; proto.drawImage = originalImage; canvasProto.toBlob = originalBlob; }
  });
  assert.equal(pdf.questions, 120); assert.ok(pdf.mathQuestions > 0); assert.equal(pdf.sources, 120); assert.equal(pdf.outOfBounds, 0); assert.equal(pdf.validOffsets, true); assert.equal(pdf.releasedCanvases, true); assert.ok(pdf.heartbeat > 0);
  assert.deepEqual(pdf.presentation.map(item => item.title), ['錯題本', '未完成測驗錯題本', '歷史錯題本']);
  assert.equal(new Set(pdf.presentation.map(item => item.filename)).size, 3);
  report.pdf = pdf;
  report.checks.push('120 real questions export with math/images/passages, all 120 sources present, no drawing outside content bounds, valid PDF byte offsets, reusable canvas released, all three output presentations distinct');
  browser('set', 'viewport', '1440', '1000');
  writeFileSync(evidence + '/report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  evaluate(backup => { for (const key of Object.keys(localStorage)) if (key.startsWith('cactusbeing-exam-')) localStorage.removeItem(key); for (const [key, value] of Object.entries(backup)) localStorage.setItem(key, value); }, backup);
  browser('open', url); waitFor('.practice-entry'); browser('set', 'viewport', '1440', '1000');
}
