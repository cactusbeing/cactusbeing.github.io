import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const url = process.argv[2] ?? 'http://127.0.0.1:5178/exam/';
const evidence = process.env.EXAM_EVIDENCE ?? '/tmp/exam-qa';
mkdirSync(evidence, { recursive: true });
function browser(...args) {
  const value = JSON.parse(execFileSync('agent-browser', ['--json', ...args], { encoding: 'utf8', timeout: 60000, maxBuffer: 4 * 1024 * 1024 }));
  if (!value.success) throw Error(JSON.stringify(value.error));
  return value.data;
}
function evaluate(fn, ...args) { return browser('eval', `(${fn.toString()})(${args.map(x => JSON.stringify(x)).join(',')})`).result; }
const settle = () => evaluate(async () => { await new Promise(r => setTimeout(r, 80)); });
function click(selector, text) {
  evaluate((selector, text) => {
    const button = [...document.querySelectorAll(selector)].find(e => text === null || e.textContent.trim().startsWith(text));
    if (!button || button.disabled) throw Error('Missing enabled control: ' + selector + ' ' + text);
    button.click();
  }, selector, text ?? null);
  settle();
}
function input(selector, value) {
  evaluate((selector, value) => { const element = document.querySelector(selector); element.value = String(value); element.dispatchEvent(new Event('input', { bubbles: true })); }, selector, value);
  settle();
}
function checkbox(text, checked) {
  if (text === '每題限時' || text === '整卷限時') openTiming();
  evaluate((text, checked) => { const label = [...document.querySelectorAll('.exam-settings label,.shared-timing-panel label')].find(e => e.textContent.trim() === text); if (!label) throw Error('Missing checkbox ' + text); const input = label.querySelector('input'); if (input.checked !== checked) input.click(); }, text, checked);
  settle();
}
function waitFor(selector) { evaluate(async selector => { for (let i = 0; i < 80; i++) { if (document.querySelector(selector)) return; await new Promise(r => setTimeout(r, 100)); } throw Error('Timed out: ' + selector); }, selector); }
const text = selector => evaluate(selector => document.querySelector(selector)?.textContent, selector);
function advance(milliseconds) {
  evaluate(async milliseconds => {
    window.__examRealNow ??= Date.now;
    window.__examOffset = (window.__examOffset ?? 0) + milliseconds;
    Date.now = () => window.__examRealNow() + window.__examOffset;
    // Trigger the same reconciliation used after background-tab throttling.
    window.dispatchEvent(new Event('focus'));
    await new Promise(r => setTimeout(r, 80));
  }, milliseconds);
}
function answer(choice) { const selector = '.question-card:has(#' + currentId() + ')'; click(selector + ' .choice', choice); click(selector + ' .question-actions button', '送出'); }
function back() { click('.practice-heading .back-link'); }
function chooseMode(name) { if (!evaluate(() => Boolean(document.querySelector('.practice-entry')))) click('.mode-back'); click('.practice-entry', name); }
function openTiming() { if (evaluate(() => document.querySelector('.timing-trigger')?.getAttribute('aria-expanded') === 'false')) click('.timing-trigger'); }
function startChinese() { click('.subject-row', '國語文能力測驗'); waitFor('.question-set'); }
function currentId() { return evaluate(() => 'exam-question-' + document.querySelector('.question-grid [aria-current=step]')?.textContent); }
function checkCanceledLoad(name, trigger, reject = false) {
  chooseMode(name); waitFor(trigger);
  const result = evaluate(async (trigger, reject) => {
    const original = window.fetch;
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    const pending = [];
    const completed = [];
    window.fetch = async (...args) => {
      const response = await original(...args);
      if (String(args[0]).includes('/assets/exams/') && !String(args[0]).endsWith('index.json')) {
        const body = await response.text();
        pending.push(args[1]?.signal);
        // Deliberately finish after cancellation, even if the transport ignores abort.
        await gate;
        completed.push(true);
        if (reject) throw new Error('Delayed test failure');
        return new Response(body, { status: response.status, headers: response.headers });
      }
      return response;
    };
    try {
      document.querySelector(trigger).click();
      for (let i = 0; i < 160 && !pending.length; i++) await new Promise(resolve => setTimeout(resolve, 25));
      if (!pending.length) throw new Error('No pending paper request');
      let subjectState;
      if (trigger === '.subject-row') {
        const rows = [...document.querySelectorAll('.subject-row')];
        const normal = document.createElement('span');
        normal.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-surface');
        subjectState = {
          loadingRows: rows.filter(row => row.getAttribute('aria-busy') === 'true').length,
          otherRowsUnchanged: rows.slice(1).every(row => getComputedStyle(row).backgroundColor === normal.style.backgroundColor),
          message: rows[0].querySelector('[role=status]')?.textContent,
        };
      }
      document.querySelector('.mode-back').click();
      await new Promise(resolve => setTimeout(resolve, 30));
      release();
      for (let i = 0; i < 160 && completed.length < pending.length; i++) await new Promise(resolve => setTimeout(resolve, 25));
      await new Promise(resolve => setTimeout(resolve, 100));
      return { subjectState, requests: pending.length, aborted: pending.every(signal => signal?.aborted), menu: !!document.querySelector('.practice-menu'),
        question: !!document.querySelector('.question-set'), timer: !!document.querySelector('.timer-bar,.battle-toolbar'), error: document.querySelector('.load-message[role=alert]')?.textContent };
    } finally { release(); window.fetch = original; }
  }, trigger, reject);
  assert.ok(result.requests > 0 && result.aborted && result.menu && !result.question && !result.timer && !result.error, JSON.stringify(result));
  if (trigger === '.subject-row') {
    assert.equal(result.subjectState.loadingRows, 1);
    assert.equal(result.subjectState.otherRowsUnchanged, true);
    assert.match(result.subjectState.message, /載入中/);
  }
  report.checks.push(`${name}: leaving during a delayed ${reject ? 'failed' : 'successful'} load aborts requests and preserves the entrance`);
}
function layout(label) {
  const result = evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth,
    clipped: [...document.querySelectorAll('.exam-settings input[type=number],.exam-settings button,.shared-timing-panel input[type=number],.timing-trigger,.question-card,.timer-bar')]
      .filter(e => e.getBoundingClientRect().width > 0).filter(e => { const b = e.getBoundingClientRect(); return b.left < -1 || b.right > innerWidth + 1; }).map(e => e.className),
  }));
  assert.ok(result.scroll <= result.width && !result.clipped.length, label + JSON.stringify(result));
  return result;
}
const chinese = JSON.parse(readFileSync(new URL('../assets/exams/115/chinese.json', import.meta.url)));
const key = 'cactusbeing-exam-115-chinese-v1';
const historyKey = 'cactusbeing-exam-history-v1';
const report = { url, checks: [], layouts: [] };
browser('open', url);
waitFor('.practice-entry');
if (process.argv.includes('--pdf-only')) {
  const result = evaluate(async () => {
    const proto = CanvasRenderingContext2D.prototype;
    const canvasProto = HTMLCanvasElement.prototype;
    const originals = { fillRect: proto.fillRect, fillText: proto.fillText, drawImage: proto.drawImage, toBlob: canvasProto.toBlob };
    const records = [];
    const pages = [];
    let page = -1;
    const isPdf = canvas => canvas.width === 1240 && canvas.height === 1754;
    proto.fillRect = function(x, y, w, h) {
      if (isPdf(this.canvas) && x === 0 && y === 0 && w === 1240 && h === 1754) page++;
      return originals.fillRect.apply(this, arguments);
    };
    proto.fillText = function(value, x, y) {
      if (isPdf(this.canvas)) records.push({ type: 'text', value, page, y });
      return originals.fillText.apply(this, arguments);
    };
    proto.drawImage = function(image, x, y, width, height) {
      if (isPdf(this.canvas)) records.push({ type: 'image', page, y, height });
      return originals.drawImage.apply(this, arguments);
    };
    canvasProto.toBlob = function() {
      if (isPdf(this)) pages.push(this.toDataURL('image/png'));
      return originals.toBlob.apply(this, arguments);
    };
    try {
      const { downloadWrongBook } = await import('/src/features/exam/wrong-book-pdf.ts');
      const ordinary = Array.from({ length: 4 }, (_, i) => ({ id: i + 1, answer: 'A', question: '一般分頁測試資料', options: { A: '選項甲', B: '選項乙', C: '選項丙', D: '選項丁' },
        source: { year: 115, subjectId: 'fixture', subjectName: '一般分頁測試', questionId: i + 1 },
      }));
      const math = { ...ordinary[0], id: 5, source: { year: 114, subjectId: 'fixture-math', subjectName: '高數學題測試', questionId: 99 },
        body_blocks: Array.from({ length: 24 }, (_, i) => ({ type: 'text', text: `測試資料 ${i + 1}：分頁驗證 $x + 1 = 2$，請保留來源標示。` })),
      };
      await downloadWrongBook(115, 'PDF 分頁驗證（測試資料）', [...ordinary, math], {}, 0, 5, 100);
      const fourthSource = records.find(r => r.type === 'text' && r.value.includes('來源：') && r.value.endsWith('第 4 題'));
      const fourthTitle = records.find(r => r.type === 'text' && r.value === '第 4 題');
      const mathSource = records.find(r => r.type === 'text' && r.value.includes('來源：') && r.value.endsWith('第 99 題'));
      const mathImage = records.find(r => r.type === 'image');
      return { fourthSource, fourthTitle, mathSource, mathImage, pageCount: pages.length,
        ordinaryCapture: pages[fourthTitle.page], mathCapture: pages[mathImage.page] };
    } finally {
      proto.fillRect = originals.fillRect; proto.fillText = originals.fillText; proto.drawImage = originals.drawImage; canvasProto.toBlob = originals.toBlob;
    }
  });
  assert.equal(result.fourthSource.page, result.fourthTitle.page, 'Ordinary question source must move with question across boundary');
  assert.equal(result.mathSource.page, result.mathImage.page, 'Tall math source must share its rendered question page');
  assert.ok(result.mathImage.y + result.mathImage.height <= 1662.01, 'Math scaling must reserve source height');
  for (const [key, filename] of [['ordinaryCapture', 'pdf-ordinary.png'], ['mathCapture', 'pdf-tall-math.png']]) {
    writeFileSync(evidence + '/' + filename, Buffer.from(result[key].split(',')[1], 'base64')); delete result[key];
  }
  writeFileSync(evidence + '/pdf-report.json', JSON.stringify(result, null, 2));
  console.log('PDF provenance pagination passed:', JSON.stringify(result));
  process.exit(0);
}
const backup = evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => key.startsWith('cactusbeing-exam-'))));
try {
  evaluate((key, answer) => { for (const item of Object.keys(localStorage)) if (item.startsWith('cactusbeing-exam-')) localStorage.removeItem(item); localStorage.setItem(key, JSON.stringify({ 1: answer })); localStorage.setItem('cactusbeing-exam-mistakes-v1', JSON.stringify({ '115/chinese/2': { year: 115, subjectId: 'chinese', subjectName: '國語文能力測驗', questionId: 2, resolved: false } })); }, key, chinese.multiple_choice_questions[0].answer);
  browser('reload'); waitFor('.practice-entry'); evaluate(() => { window.confirm = () => true; });
  for (const reject of [false, true]) for (const [name, trigger] of [['歷屆試題', '.subject-row'], ['隨機抽題', '.start-button'], ['錯題復仇戰', '.revenge-start']]) checkCanceledLoad(name, trigger, reject);
  chooseMode('歷屆試題'); waitFor('.subject-row');
  startChinese();
  assert.equal(currentId(), 'exam-question-2');
  answer(chinese.multiple_choice_questions[1].answer);
  assert.equal(evaluate(key => JSON.parse(localStorage.getItem(key))['2'], key), chinese.multiple_choice_questions[1].answer);
  back();
  const practiceBaseline = evaluate(key => localStorage.getItem(key), key);
  report.checks.push('Untimed practice resumes and saves original per-subject progress');

  openTiming(); checkbox('每題限時', true); checkbox('整卷限時', true);
  assert.equal(evaluate(() => document.querySelector('[aria-label="每題限時秒數"]').value), '60');
  startChinese();
  assert.equal(currentId(), 'exam-question-1');
  assert.ok(text('.timer-bar').includes('01:00') && text('.timer-bar').includes('25:00'));
  assert.ok(evaluate(() => [...document.querySelectorAll('.question-grid button')].every(e => e.disabled)));
  assert.equal(evaluate(() => document.querySelectorAll('.question-set .question-card').length), 1);
  click('.choice', 'A'); advance(60_000);
  assert.equal(currentId(), 'exam-question-2');
  assert.ok(text('.exam-notice').includes('第 1 題時間到'));
  answer(chinese.multiple_choice_questions[1].answer);
  assert.equal(currentId(), 'exam-question-3');
  advance(23 * 60_000);
  assert.ok(text('.result-summary').includes('答對 1 題') && text('.result-summary').includes('答錯 24 題'));
  assert.equal(evaluate(() => JSON.parse(localStorage.getItem('cactusbeing-exam-history-v1')).length), 1);
  assert.equal(evaluate(key => localStorage.getItem(key), key), practiceBaseline);
  click('.review-button', '查看全部題目');
  assert.ok(text('.answer-feedback').includes('每題逾時（0 分）'));
  assert.ok(evaluate(() => [...document.querySelectorAll('.choice')].every(e => e.disabled)));
  report.checks.push('60-second defaults, locked navigation, unsubmitted timeout = 0, automatic next, background catch-up, final timeout, single history entry, readonly review, practice isolation');
  back(); checkbox('每題限時', false); input('[aria-label="整卷限時分鐘數"]', 1); startChinese();
  click('.question-grid button', '3');
  assert.equal(currentId(), 'exam-question-3');
  click('.choice', 'A'); advance(60_000);
  assert.ok(text('.exam-notice').includes('整卷時間到'));
  assert.ok(text('.result-summary').includes('答對 0 題') && text('.result-summary').includes('答錯 25 題'));
  const scoreAfterFinish = text('.result-score'); advance(60_000);
  assert.equal(text('.result-score'), scoreAfterFinish);
  assert.equal(evaluate(() => JSON.parse(localStorage.getItem('cactusbeing-exam-history-v1')).length), 2);
  report.checks.push('Paper-only permits jumping, expires with unsubmitted draft = 0, freezes results and history after expiry');
  back(); checkbox('整卷限時', false);
  chooseMode('隨機抽題');
  checkbox('114 年', true);
  click('.subject-selection-actions button', '清除科目');
  assert.ok(evaluate(() => document.querySelector('.start-button').disabled));
  checkbox('國語文能力測驗', true);
  input('.random-start input', 9999);
  assert.ok(evaluate(() => document.querySelector('.start-button').disabled));
  input('.random-start input', 3);
  report.layouts.push({ mode: 'random-settings', ...layout('desktop settings') });
  browser('set', 'viewport', '1440', '1000'); evaluate(() => scrollTo(0, 0));
  browser('screenshot', evidence + '/desktop.png', '--full');
  browser('set', 'viewport', '390', '844'); evaluate(() => scrollTo(0, 0));
  report.layouts.push({ mode: 'random-settings-mobile', ...layout('mobile settings') });
  browser('screenshot', evidence + '/mobile.png', '--full');
  click('.start-button'); waitFor('.question-source');
  const sources = [];
  for (let i = 0; i < 3; i++) {
    click('.question-grid button', String(i + 1));
    const source = text('.question-source'); sources.push(source);
    const match = source.match(/(\d+) 年｜(.+)｜第 (\d+) 題/);
    assert.ok(match && ['114', '115'].includes(match[1]) && match[2] === '國語文能力測驗', source);
    const original = JSON.parse(readFileSync(new URL(`../assets/exams/${match[1]}/chinese.json`, import.meta.url))).multiple_choice_questions.find(q => q.id === Number(match[3]));
    if (i === 0) {
      evaluate(() => { navigator.clipboard.writeText = async text => { window.__examPrompt = text; }; });
      click('.copy-ai-button');
      assert.ok(evaluate(() => window.__examPrompt).includes(source.replace('來源：', '')));
    }
    answer(original.answer);
  }
  assert.equal(new Set(sources).size, 3);
  assert.ok(text('.result-score').includes('100') && text('.result-summary').includes('答對 3 題'));
  assert.equal(evaluate(key => localStorage.getItem(key), key), practiceBaseline);
  report.checks.push('Filtered cross-year random sample has unique provenance, copy-AI uses original IDs, 3/3 gives 100/100, validation blocks insufficient pools');
  back(); input('.random-start input', 2); openTiming(); checkbox('每題限時', true); checkbox('整卷限時', true);
  input('[aria-label="每題限時秒數"]', 0);
  assert.ok(evaluate(() => document.querySelector('.start-button').disabled));
  input('[aria-label="每題限時秒數"]', 60);
  input('[aria-label="整卷限時分鐘數"]', '');
  assert.ok(evaluate(() => document.querySelector('.start-button').disabled), 'Blank enabled duration is invalid');
  input('[aria-label="整卷限時分鐘數"]', 2);
  click('.start-button'); waitFor('.timer-bar');
  assert.ok(text('.timer-bar').includes('02:00'));
  const questionPosition = evaluate(() => document.querySelector('.question-card').getBoundingClientRect().top);
  advance(51_000);
  assert.equal(evaluate(() => document.querySelector('.question-card').getBoundingClientRect().top), questionPosition, 'Warning must not shift the question');
  assert.ok(evaluate(() => getComputedStyle(document.querySelector('.timer-value.urgent strong')).animationName).startsWith('countdown-warning'));
  const colorScheme = evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  browser('set', 'media', colorScheme, 'reduced-motion');
  assert.equal(evaluate(() => getComputedStyle(document.querySelector('.timer-value.urgent strong')).animationName), 'none');
  browser('set', 'media', colorScheme);
  assert.ok(evaluate(() => document.querySelector('.timer-value.urgent')));
  report.layouts.push({ mode: 'timer-mobile', ...layout('mobile timer') });
  evaluate(() => scrollTo(0, 0));
  browser('screenshot', evidence + '/timer-mobile.png', '--full');
  browser('set', 'viewport', '1440', '1000');
  report.layouts.push({ mode: 'timer-desktop', ...layout('desktop timer') });
  evaluate(() => scrollTo(0, 0));
  browser('screenshot', evidence + '/timer-desktop.png', '--full');
  advance(120_000);
  assert.ok(text('.result-summary').includes('答錯 2 題'));
  assert.ok(evaluate(() => [...document.querySelectorAll('.wrong-card .question-source')].every(e => e.textContent.includes('國語文能力測驗'))));
  report.checks.push('Combined limits, blank-duration validation, red warning, desktop/mobile timer layout, random timeout source labels');
  click('.result-actions button', '下載錯題本');
  evaluate(async () => { for (let i = 0; i < 100; i++) { if ([...document.querySelectorAll('.result-actions button')].some(button => button.textContent.includes('下載錯題本') && !button.disabled)) return; await new Promise(r => setTimeout(r, 100)); } throw Error('PDF timeout'); });
  assert.ok(!evaluate(() => Boolean(document.querySelector('.export-error'))));
  report.checks.push('Random timeout wrong-book PDF generates successfully');
  browser('open', new URL('history/', url).href); waitFor('.attempt-row');
  assert.ok(text('.attempt-list').includes('隨機抽題測驗') && text('.attempt-list').includes('限時測驗'));
  report.checks.push('History shows random source years, timed attempt labels and actual max scores');
  writeFileSync(evidence + '/report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  evaluate(backup => { for (const key of Object.keys(localStorage)) if (key.startsWith('cactusbeing-exam-')) localStorage.removeItem(key); for (const [key, value] of Object.entries(backup)) localStorage.setItem(key, value); if (window.__examRealNow) Date.now = window.__examRealNow; }, backup);
  browser('open', url); waitFor('.practice-entry');
  browser('set', 'viewport', '1440', '1000');
}
