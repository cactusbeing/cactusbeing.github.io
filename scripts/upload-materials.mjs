import { createHash, randomUUID } from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import {
  appendFileSync, chmodSync, constants, copyFileSync, cpSync, existsSync,
  lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync,
  renameSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const catalogPath = 'src/content/resource-categories.json';
const formats = ['pdf', 'pptx', 'docx'];
const fold = (value) => value.normalize('NFC').toLowerCase();
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const extension = (name) => extname(name).slice(1).toLowerCase();
const fileName = (url) => decodeURIComponent(url.split('/').pop());
const companions = (category, primary) => {
  const value = category.editableFiles?.[primary];
  return Array.isArray(value) ? value : value ? [value] : [];
};
const git = (root, ...args) => execFileSync('git', args, {
  cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
});

export function siteFile(root, url) {
  if (typeof url !== 'string' || !url.startsWith('/') || url.startsWith('//') || /[?#]/.test(url))
    throw Error(`教材清單含有不合法的站內網址：${url}`);
  const path = decodeURIComponent(url.slice(1));
  if (path.includes('\\') || path.split('/').some((part) => part === '.' || part === '..'))
    throw Error(`站內網址不得包含相對路徑：${url}`);
  return join(root, path);
}

export function validateCatalog(categories, root, requirePages = false) {
  if (!Array.isArray(categories) || !categories.length) throw Error('教材分類清單格式不正確。');
  const titles = new Set();
  const routes = new Set();
  for (const category of categories) {
    if (!category.title?.trim() || /[\\/\x00-\x1f]/.test(category.title) || titles.has(fold(category.title)))
      throw Error(`分類名稱重複或不合法：${category.title}`);
    titles.add(fold(category.title));
    if (typeof category.description !== 'string' || !Array.isArray(category.files))
      throw Error(`分類資料不完整：${category.title}`);
    if (!existsSync(siteFile(root, category.image))) throw Error(`分類圖片不存在：${category.image}`);
    if (category.href) {
      const page = siteFile(root, category.href);
      if (!/^\/[^/]+\.html$/.test(category.href) || routes.has(fold(category.href)))
        throw Error(`分類網址重複或不合法：${category.href}`);
      routes.add(fold(category.href));
      if (requirePages && !existsSync(page)) throw Error(`分類 HTML 不存在：${category.href}`);
    }
    if (!category.comingSoon && (!category.href || !category.files.length))
      throw Error(`已開放分類必須有網址及教材：${category.title}`);
    if (category.comingSoon && category.files.length) throw Error(`未開放分類仍含教材：${category.title}`);
    const seen = new Set();
    for (const primary of category.files) {
      for (const url of [primary, ...companions(category, primary)]) {
        if (!url.startsWith('/files/') || !formats.includes(extension(url)) || seen.has(fold(url)))
          throw Error(`教材檔案重複或格式不支援：${url}`);
        seen.add(fold(url));
        if (!existsSync(siteFile(root, url))) throw Error(`教材檔案不存在：${url}`);
      }
      if (companions(category, primary).some((url) => extension(url) === 'pdf'))
        throw Error(`PDF 應列為主要教材：${primary}`);
    }
    for (const key of Object.keys(category.editableFiles || {})) {
      if (!category.files.includes(key)) throw Error(`可編輯版沒有對應主檔：${key}`);
    }
  }
}

export function materialKey(name) {
  return basename(name, extname(name)).normalize('NFKC')
    .replace(/[\s_-]*(?:[（(]\s*)?(?:可編輯(?:版)?|editable)(?:\s*[）)])?$/iu, '')
    .trim().toLowerCase();
}

function inspectInputs(root, args) {
  const filesDirectory = join(root, 'files');
  if (!lstatSync(filesDirectory).isDirectory() || lstatSync(filesDirectory).isSymbolicLink())
    throw Error('files 必須是專案內的一般目錄。');
  const existing = readdirSync(filesDirectory);
  const names = new Set(existing.map(fold));
  const signatures = new Map();
  for (const name of existing) {
    const path = join(filesDirectory, name);
    if (formats.includes(extension(name)) && lstatSync(path).isFile())
      signatures.set(hash(readFileSync(path)), name);
  }
  const results = [];
  const realPaths = new Set();
  for (const arg of args) {
    const source = realpathSync(resolve(arg));
    const name = basename(resolve(arg)).normalize('NFC');
    const format = extension(name);
    if (!lstatSync(source).isFile() || !formats.includes(format) || /[\\\x00-\x1f\x7f]/.test(name))
      throw Error(`僅支援一般 PDF、PPTX、DOCX 檔案：${arg}`);
    if (realPaths.has(source) || names.has(fold(name)))
      throw Error(`檔名或輸入檔案衝突，未覆蓋任何檔案：${name}`);
    const bytes = readFileSync(source);
    if (format === 'pdf' ? !bytes.subarray(0, 1024).includes(Buffer.from('%PDF-')) :
        !(bytes.subarray(0, 4).equals(Buffer.from('PK\x03\x04')) &&
          bytes.includes(Buffer.from('[Content_Types].xml')) &&
          bytes.includes(Buffer.from(format === 'pptx' ? 'ppt/presentation.xml' : 'word/document.xml'))))
      throw Error(`副檔名與檔案內容不符或檔案已損壞：${name}`);
    const digest = hash(bytes);
    if (signatures.has(digest)) throw Error(`內容重複：${name} 與 ${signatures.get(digest)} 相同。`);
    realPaths.add(source); names.add(fold(name)); signatures.set(digest, name);
    results.push({ source, name, format, digest, url: '/files/' + encodeURIComponent(name) });
  }
  return results;
}

export function addMaterials(category, inputs) {
  const result = structuredClone(category);
  const groups = new Map();
  for (const primary of category.files) {
    const key = materialKey(fileName(primary));
    if (groups.has(key)) throw Error(`現有教材名稱無法明確配對：${fileName(primary)}`);
    groups.set(key, { previous: primary, urls: [primary, ...companions(category, primary)] });
  }
  for (const input of inputs) {
    const key = materialKey(input.name);
    if (!key) throw Error(`教材名稱不可只有「可編輯版」：${input.name}`);
    const group = groups.get(key) || { urls: [] };
    if (group.urls.some((url) => extension(url) === input.format))
      throw Error(`同一教材已有 ${input.format.toUpperCase()}，無法自動決定版本：${input.name}`);
    group.urls.push(input.url); groups.set(key, group);
  }
  result.editableFiles = { ...result.editableFiles };
  for (const group of groups.values()) {
    group.urls.sort((a, b) => formats.indexOf(extension(a)) - formats.indexOf(extension(b)));
    const [primary, ...editable] = group.urls;
    if (group.previous) {
      result.files[result.files.indexOf(group.previous)] = primary;
      delete result.editableFiles[group.previous];
    } else result.files.push(primary);
    if (editable.length) result.editableFiles[primary] = editable;
  }
  if (!Object.keys(result.editableFiles).length) delete result.editableFiles;
  if (result.comingSoon) {
    const availableFormats = [...new Set(inputs.map((input) => input.format.toUpperCase()))];
    result.description = `${result.title}教學教材，提供 ${availableFormats.join('、')} 下載。`;
  }
  delete result.comingSoon;
  result.href ||= '/' + result.title + 'slide.html';
  return result;
}

const escapeHTML = (value) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

export function renderCategory(category) {
  const title = escapeHTML(category.title);
  const description = escapeHTML(category.description);
  const pdfs = category.files.filter((file) => extension(file) === 'pdf');
  const previews = pdfs.length ? `
      <details class="pdf-legacy">
        <summary>教材內嵌預覽</summary>${pdfs.map((url) => {
    const name = escapeHTML(basename(fileName(url), extname(fileName(url))));
    return `
        <h2>${name}</h2>
        <iframe loading="lazy" title="${name} PDF 教材預覽" src="${escapeHTML(url)}" width="100%" height="600" style="border: 0">
          <a href="${escapeHTML(url)}" download>下載 ${name} PDF</a>
        </iframe>`;
  }).join('')}
      </details>` : '';
  return `<!doctype html>
<!-- Generated by upload-materials. Source: src/content/resource-categories.json -->
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}｜特教百寶袋</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="https://cactusbeing.github.io/assets/icon.png" />
    <link rel="icon" href="/assets/icon.png" />
  </head>
  <body>
    <div id="site-header"></div>
    <main id="main-content" class="container page-main" tabindex="-1">
      <div id="catalog-app"></div>${previews}
    </main>
    <div id="site-footer"></div>
    <script type="module" src="/src/app/catalog.ts"></script>
  </body>
</html>
`;
}

function checkPage(root, before, after) {
  const page = siteFile(root, after.href);
  const collision = readdirSync(root).find((name) => fold(name) === fold(basename(page)));
  if (!before.href && collision) throw Error(`新分類 HTML 路徑已被占用：${collision}`);
  if (collision && collision.normalize('NFC') !== basename(page).normalize('NFC'))
    throw Error(`分類 HTML 檔名大小寫衝突：${collision}`);
  if (existsSync(page)) {
    if (!lstatSync(page).isFile()) throw Error(`HTML 路徑不是一般檔案：${page}`);
    if (!/\bid=["']catalog-app["']/.test(readFileSync(page, 'utf8')))
      throw Error(`既有 HTML 不是教材分類頁，拒絕覆蓋：${relative(root, page)}`);
    if (git(root, 'status', '--porcelain', '--', relative(root, page)).trim() &&
        readFileSync(page, 'utf8') !== renderCategory(before))
      throw Error(`分類 HTML 有未提交修改，請先處理後再上架：${relative(root, page)}`);
  }
  return page;
}

async function selectCategory(categories, controller) {
  console.log('\n請選擇教材分類：');
  categories.forEach((category, i) => console.log(`  ${i + 1}. ${category.title}${category.comingSoon ? '（選擇後將開放）' : ''}`));
  const rl = createInterface({ input: process.stdin, output: process.stdout,
    terminal: Boolean(process.stdin.isTTY), signal: controller.signal });
  rl.once('SIGINT', () => controller.abort());
  process.stdout.write(`分類編號 1–${categories.length}（q 取消）：`);
  try {
    for await (const line of rl) {
      const value = line.trim();
      if (/^q$/i.test(value)) break;
      if (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= categories.length)
        return Number(value) - 1;
      process.stdout.write('請輸入有效分類編號（q 取消）：');
    }
  } finally { rl.close(); }
  throw Object.assign(Error('已取消，未更動檔案。'), { exitCode: 130 });
}

function atomicWrite(path, bytes) {
  const temporary = join(dirname(path), '.' + basename(path) + '.' + randomUUID() + '.tmp');
  try { writeFileSync(temporary, bytes, { flag: 'wx' }); renameSync(temporary, path); }
  finally { rmSync(temporary, { force: true }); }
}

async function command(root, args, signal, log) {
  if (signal.aborted) throw Error('已取消。');
  await new Promise((ok, fail) => {
    const child = spawn('npm', args, { cwd: root, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    const cancel = () => { try { process.kill(-child.pid, 'SIGTERM'); } catch { /* Already exited. */ } };
    signal.addEventListener('abort', cancel, { once: true });
    for (const [source, target] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
      source.on('data', (bytes) => { appendFileSync(log, bytes); target.write(bytes); });
    }
    child.once('error', fail);
    child.once('close', (code) => {
      signal.removeEventListener('abort', cancel);
      if (code === 0 && !signal.aborted) ok();
      else fail(Error(signal.aborted ? '已取消建置。' : `npm ${args.join(' ')} 失敗（${code}）。`));
    });
  });
}

export async function main(args = process.argv.slice(2), root = fileURLToPath(new URL('../', import.meta.url))) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log(`用法：./upload-materials [--commit] <教材.pdf> [教材_可編輯版.pptx] [教材.docx] ...
支援 PDF、PPTX、DOCX。先檢查衝突，再選擇分類，最後自動更新檔案及 HTML 並執行 npm run build。
同名檔案（忽略 _可編輯版、-editable 後綴）合併為一份教材；不同名稱分開顯示。
可只上架 PPTX／DOCX；它們會標示「可編輯」。未開放分類會自動建立頁面並啟用。
不覆蓋同名或同內容檔案；建置失敗會還原本次來源變更與原 dist。原始教材檔案保留。
加上 --commit：建置成功後只提交本次清單、HTML 與教材；有 check:clean 時會先驗證乾淨暫存副本。
自動提交要求暫存區為空、清單及目標 HTML 沒有未提交修改；提交失敗會保留已上架檔案。
未加 --commit 不會 stage 或 commit。任何模式都不 push 或部署。可用 -- 分隔檔案參數。`);
    return;
  }
  let autoCommit = false;
  let literal = false;
  const paths = [];
  for (const arg of args) {
    if (!literal && arg === '--') literal = true;
    else if (!literal && arg === '--commit') autoCommit = true;
    else if (!literal && arg.startsWith('-')) throw Error(`未知選項：${arg}。請使用 --help 查看用法。`);
    else paths.push(arg);
  }
  args = paths;
  if (!args.length) throw Error('請提供至少一份教材。用法：./upload-materials [--commit] <教材file1> [教材file2 ...]');
  root = realpathSync(root);
  if (realpathSync(git(root, 'rev-parse', '--show-toplevel').trim()) !== root) throw Error('請在專案的 Git 根目錄使用此工具。');
  if (git(root, 'ls-files', '--unmerged', '-z')) throw Error('Repository 有尚未解決的 merge conflict，請先處理。');
  const initialHead = autoCommit ? git(root, 'rev-parse', 'HEAD').trim() : null;
  const assertCommitReady = () => {
    if (git(root, 'rev-parse', 'HEAD').trim() !== initialHead) throw Error('HEAD 已變更，停止自動提交。');
    if (git(root, 'diff', '--cached', '--name-only', '-z')) throw Error('--commit 要求暫存區為空，請先處理已暫存修改。');
  };
  if (autoCommit) {
    assertCommitReady();
    if (git(root, 'status', '--porcelain', '--', catalogPath))
      throw Error('--commit 要求教材清單沒有未提交修改，請先提交既有上架內容。');
  }
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  if (!pkg.scripts?.build) throw Error('專案未定義 npm run build。');
  if (!existsSync(join(root, 'node_modules')) && !existsSync(join(root, 'package-lock.json')))
    throw Error('缺少 package-lock.json，無法自動安裝依賴。');
  const registry = join(root, catalogPath);
  if (lstatSync(registry).isSymbolicLink()) throw Error('分類清單不可為符號連結。');
  const original = readFileSync(registry);
  const categories = JSON.parse(original);
  validateCatalog(categories, root);
  const inputs = inspectInputs(root, args);
  console.log('檔案檢查通過：');
  inputs.forEach((input) => console.log(`  ${input.name}${input.format === 'pdf' ? '' : '（可編輯）'}`));
  // Resolve same-format ambiguity before asking for a category or writing anything.
  addMaterials({ title: '檢查', description: '', files: [] }, inputs);
  const lock = join(tmpdir(), 'cactus-material-upload-' + hash(root).slice(0, 20) + '.lock');
  try { mkdirSync(lock); }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    throw Error(`另一個上架流程尚未結束。若前次已異常終止，請先確認後移除鎖：${lock}`);
  }
  writeFileSync(join(lock, 'owner.json'), JSON.stringify({ pid: process.pid, root }));
  const controller = new AbortController();
  const cancel = () => controller.abort();
  process.once('SIGINT', cancel); process.once('SIGTERM', cancel);
  let work;
  let beforePage;
  let writes = [];
  const copied = [];
  let distBackedUp = false;
  let buildStarted = false;
  let hadDist = false;
  let uploadCompleted = false;
  try {
    const index = await selectCategory(categories, controller);
    if (controller.signal.aborted) throw Error('已取消。');
    if (!readFileSync(registry).equals(original)) throw Error('選單開啟期間教材清單已變更，請重新執行。');
    const checked = inspectInputs(root, args);
    if (checked.some((input, i) => input.digest !== inputs[i].digest)) throw Error('教材檔案已變更，請重新執行。');
    if (git(root, 'ls-files', '--unmerged', '-z')) throw Error('Repository 出現 merge conflict，請先處理。');
    const selected = addMaterials(categories[index], inputs);
    const page = checkPage(root, categories[index], selected);
    if (autoCommit) {
      assertCommitReady();
      if (git(root, 'status', '--porcelain', '--', relative(root, page)))
        throw Error('--commit 要求目標分類 HTML 沒有未提交修改。');
    }
    beforePage = existsSync(page) ? readFileSync(page) : null;
    const updated = structuredClone(categories); updated[index] = selected;
    const bytes = Buffer.from(JSON.stringify(updated, null, 2) + '\n');
    const html = Buffer.from(renderCategory(selected));
    const dist = join(root, 'dist');
    if (existsSync(dist) && (!lstatSync(dist).isDirectory() || lstatSync(dist).isSymbolicLink()))
      throw Error('dist 必須是一般目錄。');
    work = mkdtempSync(join(tmpdir(), 'cactus-material-upload-'));
    writeFileSync(join(work, 'catalog.before.json'), original);
    if (beforePage) writeFileSync(join(work, 'page.before.html'), beforePage);
    writeFileSync(join(work, 'plan.json'), JSON.stringify({ category: selected.title, page,
      inputs, registry, hadPage: Boolean(beforePage) }, null, 2));
    console.log(`\n上架至「${selected.title}」，建置紀錄：${join(work, 'build.log')}`);
    for (const input of inputs) {
      const destination = siteFile(root, input.url);
      copyFileSync(input.source, destination, constants.COPYFILE_EXCL);
      const copiedDigest = hash(readFileSync(destination));
      copied.push({ path: destination, digest: copiedDigest });
      if (copiedDigest !== input.digest) throw Error(`複製期間來源已變更：${input.name}`);
      chmodSync(destination, 0o644);
    }
    writes = [{ path: registry, before: original, after: bytes }, { path: page, before: beforePage, after: html }];
    for (const write of writes) {
      const current = existsSync(write.path) ? readFileSync(write.path) : null;
      if (write.before ? !current?.equals(write.before) : current !== null) throw Error(`寫入前發現檔案衝突：${write.path}`);
      atomicWrite(write.path, write.after); write.written = true;
    }
    validateCatalog(updated, root, true);
    hadDist = existsSync(dist);
    if (hadDist) { cpSync(dist, join(work, 'dist.before'), { recursive: true }); distBackedUp = true; }
    const log = join(work, 'build.log');
    if (!existsSync(join(root, 'node_modules'))) await command(root, ['ci'], controller.signal, log);
    buildStarted = true;
    await command(root, ['run', 'build'], controller.signal, log);
    if (writes.some((write) => !readFileSync(write.path).equals(write.after))) throw Error('建置期間教材來源被其他程序修改。');
    uploadCompleted = true;
    rmSync(join(work, 'dist.before'), { recursive: true, force: true });
    let commit = null;
    if (autoCommit) {
      assertCommitReady();
      const commitPaths = [catalogPath, relative(root, page), ...copied.map((file) => relative(root, file.path))];
      let staged = false;
      try {
        staged = true;
        git(root, 'add', '--', ...commitPaths);
        const stagedFiles = git(root, 'diff', '--cached', '--name-only', '-z').split('\0').filter(Boolean).sort();
        if (JSON.stringify(stagedFiles) !== JSON.stringify([...commitPaths].sort())) throw Error('暫存區包含非本次上架檔案，停止自動提交。');
        const indexBefore = git(root, 'ls-files', '--stage', '-z');
        if (pkg.scripts['check:clean']) await command(root, ['run', 'check:clean', '--', '--staged'], controller.signal, log);
        if (controller.signal.aborted || git(root, 'rev-parse', 'HEAD').trim() !== initialHead ||
            git(root, 'ls-files', '--stage', '-z') !== indexBefore ||
            writes.some((write) => !existsSync(write.path) || !readFileSync(write.path).equals(write.after)) ||
            copied.some((file) => !existsSync(file.path) || hash(readFileSync(file.path)) !== file.digest))
          throw Error('提交前來源、HEAD 或暫存區已變更，停止自動提交。');
        console.log(git(root, 'commit', '-m', `Add ${selected.title} teaching materials`, '--only', '--', ...commitPaths).trim());
        commit = git(root, 'rev-parse', 'HEAD').trim();
      } catch (error) {
        // Git failures must not roll back an upload that has already built successfully.
        if (staged && git(root, 'rev-parse', 'HEAD').trim() === initialHead)
          git(root, 'reset', '--quiet', 'HEAD', '--', ...commitPaths);
        throw error;
      }
    }
    writeFileSync(join(work, 'result.json'), JSON.stringify({ status: 'passed', category: selected.title, href: selected.href, files: inputs.map((input) => input.url), commit }, null, 2));
    console.log(`\n上架完成：${selected.title} → ${selected.href}\n建置通過。${commit ? `已 commit：${commit}，尚未 push。` : '尚未 commit／push。'}`);
  } catch (error) {
    if (uploadCompleted) {
      console.error(`上架與建置已完成；後續提交或紀錄失敗，保留教材及 HTML，請檢查 Git 狀態。診斷紀錄：${work}`);
      throw error;
    }
    const concurrentEdits = writes.some((write) => write.written &&
      (!existsSync(write.path) || !readFileSync(write.path).equals(write.after)));
    if (concurrentEdits) {
      console.error(`偵測到其他程序修改檔案，保留現況避免覆蓋。備份與上架計畫：${work}`);
    } else {
      for (const write of writes.toReversed()) if (write.written) {
        if (write.before) atomicWrite(write.path, write.before);
        else rmSync(write.path);
      }
      for (const file of copied) if (existsSync(file.path) && hash(readFileSync(file.path)) === file.digest) rmSync(file.path);
      if (buildStarted) {
        rmSync(join(root, 'dist'), { recursive: true, force: true });
        if (hadDist && distBackedUp) cpSync(join(work, 'dist.before'), join(root, 'dist'), { recursive: true });
      }
      if (work) console.error(`已還原本次上架變更。診斷紀錄：${work}`);
    }
    throw error;
  } finally {
    process.removeListener('SIGINT', cancel); process.removeListener('SIGTERM', cancel);
    rmSync(lock, { recursive: true, force: true });
  }
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error('上架停止：' + (error.stderr?.toString().trim() || error.message));
    process.exitCode = error.exitCode || 1;
  });
}
