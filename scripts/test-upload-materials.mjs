import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { addMaterials, materialKey, validateCatalog } from './upload-materials.mjs';

const project = fileURLToPath(new URL('../', import.meta.url));
const temporary = mkdtempSync('/tmp/material-upload-tests-');
let count = 0;
const pdf = (text) => Buffer.from(`%PDF-1.4\n${text}\n%%EOF\n`);

// Valid, uncompressed ZIP packages, sufficient to test Office format detection.
function zip(entries) {
  function crc32(bytes) {
    let value = 0xffffffff;
    for (const byte of bytes) {
      value ^= byte;
      for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
    }
    return (value ^ 0xffffffff) >>> 0;
  }
  const local = []; const central = []; let offset = 0;
  for (const [name, content] of Object.entries(entries)) {
    const nameBytes = Buffer.from(name); const bytes = Buffer.from(content); const crc = crc32(bytes);
    const header = Buffer.alloc(30); header.writeUInt32LE(0x04034b50); header.writeUInt16LE(20, 4);
    header.writeUInt32LE(crc, 14); header.writeUInt32LE(bytes.length, 18); header.writeUInt32LE(bytes.length, 22); header.writeUInt16LE(nameBytes.length, 26);
    const record = Buffer.alloc(46); record.writeUInt32LE(0x02014b50); record.writeUInt16LE(20, 4); record.writeUInt16LE(20, 6);
    record.writeUInt32LE(crc, 16); record.writeUInt32LE(bytes.length, 20); record.writeUInt32LE(bytes.length, 24); record.writeUInt16LE(nameBytes.length, 28); record.writeUInt32LE(offset, 42);
    local.push(header, nameBytes, bytes); central.push(record, nameBytes); offset += header.length + nameBytes.length + bytes.length;
  }
  const directory = Buffer.concat(central); const end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50);
  end.writeUInt16LE(Object.keys(entries).length, 8); end.writeUInt16LE(Object.keys(entries).length, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}
const office = (format, text) => zip({ '[Content_Types].xml': '<Types/>',
  [format === 'pptx' ? 'ppt/presentation.xml' : 'word/document.xml']: `<document>${text}</document>` });

function fixture() {
  const base = mkdtempSync(join(temporary, 'case-')); const root = join(base, 'repo'); const inbox = join(base, 'inbox');
  for (const path of ['scripts', 'src/content', 'assets', 'files', 'node_modules', 'dist', 'tmp']) mkdirSync(join(root, path), { recursive: true });
  mkdirSync(inbox);
  const categories = [
    { title: '學習策略', image: '/assets/example.png', description: '教材準備中。', files: [], comingSoon: true },
    { title: '生活管理', image: '/assets/example.png', description: '既有分類。', href: '/生活管理slide.html', files: ['/files/既有教材.pdf'] },
  ];
  writeFileSync(join(root, 'src/content/resource-categories.json'), JSON.stringify(categories, null, 2) + '\n');
  writeFileSync(join(root, 'assets/example.png'), 'image');
  writeFileSync(join(root, 'files/既有教材.pdf'), pdf('existing'));
  writeFileSync(join(root, '生活管理slide.html'), '<!doctype html><title>Existing authored page</title><div id="catalog-app"></div>');
  writeFileSync(join(root, '.gitignore'), 'node_modules/\ndist/\ntmp/\n');
  writeFileSync(join(root, 'dist/old.txt'), 'keep original build');
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'material-fixture', version: '1.0.0', type: 'module', scripts: { build: 'node fixture-build.mjs' } }));
  writeFileSync(join(root, 'fixture-build.mjs'), `import {mkdirSync,writeFileSync} from 'node:fs'; mkdirSync('dist',{recursive:true});writeFileSync('dist/new.txt','build ran');`);
  cpSync(join(project, 'scripts/upload-materials.mjs'), join(root, 'scripts/upload-materials.mjs'));
  cpSync(join(project, 'upload-materials'), join(root, 'upload-materials'));
  function git(...args) { return execFileSync('git', args, { cwd: root, encoding: 'utf8' }); }
  git('init', '-q'); git('add', '.');
  git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgSign=false', 'commit', '-qm', 'fixture');
  for (const [key, value] of Object.entries({ 'user.name': 'Fixture', 'user.email': 'fixture@example.invalid', 'commit.gpgSign': 'false', 'core.hooksPath': '/dev/null' })) git('config', key, value);
  return { root, inbox, git, categories };
}

function input(f, name, bytes = pdf(name)) { const path = join(f.inbox, name); writeFileSync(path, bytes); return path; }
function run(f, files, answer = '1\n', succeeds = true, commits = false) {
  const index = f.git('ls-files', '--stage', '-z');
  const result = spawnSync(join(f.root, 'upload-materials'), files, { cwd: f.root, input: answer,
    env: { ...process.env, TMPDIR: join(f.root, 'tmp') }, encoding: 'utf8', timeout: 20000, maxBuffer: 2 * 1024 * 1024 });
  assert.equal(result.status === 0, succeeds, result.stdout + '\n' + result.stderr);
  if (!commits) assert.equal(f.git('ls-files', '--stage', '-z'), index, 'Uploader must preserve the index without a successful --commit');
  return result;
}
const catalog = (f) => JSON.parse(readFileSync(join(f.root, 'src/content/resource-categories.json')));
function sources(f) {
  return JSON.stringify([readFileSync(join(f.root, 'src/content/resource-categories.json'), 'utf8'),
    readdirSync(join(f.root, 'files')).sort().map((name) => [name, readFileSync(join(f.root, 'files', name)).toString('base64')]),
    readdirSync(f.root).filter((name) => name.endsWith('.html')).sort().map((name) => [name, readFileSync(join(f.root, name), 'utf8')])]);
}
function test(name, fn) { fn(); count++; console.log('PASS ' + name); }

try {
  test('--commit commits only this upload and leaves unrelated unstaged/untracked work untouched', () => {
    const f = fixture(); const head = f.git('rev-parse', 'HEAD');
    writeFileSync(join(f.root, 'assets/example.png'), 'unrelated edit');
    writeFileSync(join(f.root, 'notes.txt'), 'unrelated untracked');
    run(f, ['--commit', input(f, '自動提交.pdf'), input(f, '自動提交.pptx', office('pptx', 'auto'))], '1\n', true, true);
    assert.notEqual(f.git('rev-parse', 'HEAD'), head);
    assert.deepEqual(f.git('diff-tree', '--no-commit-id', '--name-only', '-r', '-z', 'HEAD').split('\0').filter(Boolean).sort(),
      ['files/自動提交.pdf', 'files/自動提交.pptx', 'src/content/resource-categories.json', '學習策略slide.html'].sort());
    assert.equal(f.git('diff', '--cached', '--name-only'), '');
    assert.equal(f.git('show', 'HEAD:assets/example.png'), 'image');
    assert.equal(readFileSync(join(f.root, 'assets/example.png'), 'utf8'), 'unrelated edit');
    assert.ok(!f.git('ls-files', '--', 'notes.txt'));
  });
  test('--commit refuses pre-existing staged changes or dirty shared catalog without altering them', () => {
    for (const stage of [true, false]) {
      const f = fixture();
      if (stage) { writeFileSync(join(f.root, 'notes.txt'), 'staged'); f.git('add', 'notes.txt'); }
      else writeFileSync(join(f.root, 'src/content/resource-categories.json'), JSON.stringify(f.categories));
      const before = sources(f); const head = f.git('rev-parse', 'HEAD');
      const result = run(f, ['--commit', input(f, 'stop.pdf')], '', false);
      assert.ok(!result.stdout.includes('請選擇教材分類')); assert.equal(sources(f), before); assert.equal(f.git('rev-parse', 'HEAD'), head);
    }
  });
  test('Commit hook failure preserves successful upload/build and clears only uploader staging', () => {
    const f = fixture(); const head = f.git('rev-parse', 'HEAD');
    const hooks = join(f.root, 'hooks'); mkdirSync(hooks); f.git('config', 'core.hooksPath', hooks);
    writeFileSync(join(hooks, 'pre-commit'), '#!/bin/sh\nexit 9\n', { mode: 0o755 });
    const result = run(f, [input(f, 'hook.pdf'), '--commit'], '1\n', false);
    assert.ok(result.stderr.includes('保留教材及 HTML')); assert.equal(f.git('rev-parse', 'HEAD'), head);
    assert.equal(catalog(f)[0].files.length, 1); assert.ok(existsSync(join(f.root, 'files/hook.pdf')));
    assert.ok(existsSync(join(f.root, 'dist/new.txt')));
  });
  test('--commit clean snapshot check sees staged upload; failed validation preserves upload without committing', () => {
    for (const pass of [true, false]) {
      const f = fixture(); const pkg = JSON.parse(readFileSync(join(f.root, 'package.json')));
      pkg.scripts['check:clean'] = 'node fixture-clean.mjs';
      writeFileSync(join(f.root, 'package.json'), JSON.stringify(pkg));
      writeFileSync(join(f.root, 'fixture-clean.mjs'), `import {execFileSync} from 'node:child_process'; import {writeFileSync} from 'node:fs'; const paths=execFileSync('git',['diff','--cached','--name-only'],{encoding:'utf8'});if(!process.argv.includes('--staged')||!paths.includes('snapshot.pdf'))process.exit(8);writeFileSync('tmp/clean-ran','yes');process.exit(${pass ? 0 : 7});`);
      const head = f.git('rev-parse', 'HEAD');
      run(f, ['--commit', input(f, 'snapshot.pdf')], '1\n', pass, pass);
      assert.ok(existsSync(join(f.root, 'tmp/clean-ran'))); assert.equal(f.git('rev-parse', 'HEAD') !== head, pass);
      assert.ok(existsSync(join(f.root, 'files/snapshot.pdf')));
      assert.equal(f.git('diff', '--cached', '--name-only'), '');
    }
  });
  test('Build failure with --commit restores upload and leaves HEAD/index untouched', () => {
    const f = fixture(); const before = sources(f); const head = f.git('rev-parse', 'HEAD');
    writeFileSync(join(f.root, 'fixture-build.mjs'), 'process.exit(7);');
    run(f, ['--commit', input(f, 'failed.pdf')], '1\n', false);
    assert.equal(sources(f), before); assert.equal(f.git('rev-parse', 'HEAD'), head);
  });
  test('--commit preserves unrelated staging created during a build or failed clean validation', () => {
    for (const duringBuild of [true, false]) {
      const f = fixture(); const head = f.git('rev-parse', 'HEAD');
      writeFileSync(join(f.root, 'notes.txt'), 'someone else staged this');
      if (duringBuild) {
        writeFileSync(join(f.root, 'fixture-build.mjs'), `import {execFileSync} from 'node:child_process';execFileSync('git',['add','notes.txt']);`);
      } else {
        const pkg = JSON.parse(readFileSync(join(f.root, 'package.json')));
        pkg.scripts['check:clean'] = 'node fixture-clean.mjs';
        writeFileSync(join(f.root, 'package.json'), JSON.stringify(pkg));
        writeFileSync(join(f.root, 'fixture-clean.mjs'), `import {execFileSync} from 'node:child_process';execFileSync('git',['add','notes.txt']);process.exit(9);`);
      }
      run(f, ['--commit', input(f, 'concurrent-stage.pdf')], '1\n', false, true);
      assert.equal(f.git('rev-parse', 'HEAD'), head);
      assert.equal(f.git('diff', '--cached', '--name-only').trim(), 'notes.txt');
      assert.ok(existsSync(join(f.root, 'files/concurrent-stage.pdf')));
    }
  });
  test('Unknown options fail before menu; -- permits literal dash-prefixed filenames', () => {
    const f = fixture(); const result = run(f, ['--typo', input(f, 'option.pdf')], '', false);
    assert.ok(result.stderr.includes('未知選項')); assert.ok(!result.stdout.includes('請選擇教材分類'));
    writeFileSync(join(f.root, '-教材.pdf'), pdf('literal'));
    run(f, ['--', '-教材.pdf']); assert.ok(existsSync(join(f.root, 'files/-教材.pdf')));
  });
  test('PDF + PPTX + DOCX group together; pending category activates; HTML and build generated; originals/index preserved', () => {
    const f = fixture(); const stem = '護牙 #1 & "好"';
    const paths = [input(f, stem + '.pdf'), input(f, stem + '_可編輯版.pptx', office('pptx', 'slides')),
      input(f, stem + '.docx', office('docx', 'document'))];
    const original = paths.map((path) => readFileSync(path));
    run(f, paths);
    const [category, other] = catalog(f);
    assert.equal(category.comingSoon, undefined); assert.equal(category.href, '/學習策略slide.html'); assert.equal(category.files.length, 1);
    assert.equal(category.editableFiles[category.files[0]].length, 2);
    assert.deepEqual(other, f.categories[1]);
    const html = readFileSync(join(f.root, '學習策略slide.html'), 'utf8');
    assert.ok(html.includes('&quot;好&quot;')); assert.ok(html.includes('%23')); assert.ok(html.includes('%26'));
    assert.ok(existsSync(join(f.root, 'dist/new.txt')));
    paths.forEach((path, i) => assert.deepEqual(readFileSync(path), original[i]));
    validateCatalog(catalog(f), f.root, true);
    const editable = category.editableFiles[category.files[0]][0];
    rmSync(join(f.root, decodeURIComponent(editable.slice(1))));
    assert.throws(() => validateCatalog(catalog(f), f.root, true), /教材檔案不存在/);
  });
  test('Editable-only materials work; later PDF promotes to primary; repeated uploads before commit are allowed', () => {
    const f = fixture(); run(f, [input(f, '純編輯.pptx', office('pptx', 'first')), input(f, '另一教材.docx', office('docx', 'second'))]);
    assert.equal(catalog(f)[0].files.length, 2); assert.ok(!readFileSync(join(f.root, '學習策略slide.html'), 'utf8').includes('<iframe'));
    run(f, [input(f, '純編輯.pdf')]);
    const category = catalog(f)[0]; assert.equal(category.files.length, 2);
    assert.ok(category.files[0].endsWith('.pdf')); assert.ok(category.editableFiles[category.files[0]][0].endsWith('.pptx'));
  });
  test('Adding editable versions to an existing PDF keeps one material and preserves the authored category description', () => {
    const f = fixture(); run(f, [input(f, '既有教材_可編輯版.docx', office('docx', 'editable'))], '2\n');
    const category = catalog(f)[1]; assert.equal(category.files.length, 1); assert.equal(category.description, '既有分類。');
    assert.equal(category.editableFiles[category.files[0]].length, 1);
  });
  test('Existing name and identical content under a new name both fail before the category menu', () => {
    const f = fixture(); const before = sources(f);
    for (const path of [input(f, '既有教材.pdf'), input(f, 'duplicate.pdf', pdf('existing'))]) {
      const result = run(f, [path], '', false); assert.ok(!result.stdout.includes('請選擇教材分類'));
      assert.equal(sources(f), before);
    }
  });
  test('Case-insensitive input names and ambiguous same-format versions fail before writing', () => {
    const f = fixture(); const before = sources(f);
    for (const files of [[input(f, 'A.PDF'), input(f, 'a.pdf')], [input(f, '教材.pdf'), input(f, '教材_可編輯版.pdf')]]) {
      const result = run(f, files, '', false); assert.ok(!result.stdout.includes('請選擇教材分類')); assert.equal(sources(f), before);
    }
  });
  test('Missing, unsupported and invalid-content inputs fail without mutation', () => {
    const f = fixture(); const before = sources(f);
    for (const path of [join(f.inbox, 'missing.pdf'), input(f, 'bad.txt', 'text'), input(f, 'bad.pdf', 'text'), input(f, 'bad.docx', 'text')]) {
      run(f, [path], '', false); assert.equal(sources(f), before);
    }
  });
  test('Dirty authored HTML and occupied new routes are protected before copying files', () => {
    for (const choice of ['1\n', '2\n']) {
      const f = fixture(); const page = choice === '1\n' ? '學習策略slide.html' : '生活管理slide.html';
      writeFileSync(join(f.root, page), 'uncommitted authored changes'); const before = sources(f);
      run(f, [input(f, 'new.pdf')], choice, false); assert.equal(sources(f), before);
    }
  });
  test('Build failure restores exact source bytes, imported files, existing/new HTML and previous dist', () => {
    for (const choice of ['1\n', '2\n']) {
      const f = fixture(); const before = sources(f);
      writeFileSync(join(f.root, 'fixture-build.mjs'), `import {writeFileSync} from 'node:fs';writeFileSync('dist/old.txt','broken build');writeFileSync('dist/partial.txt','partial');process.exit(7);`);
      const result = run(f, [input(f, 'rollback.pdf')], choice, false);
      assert.ok(result.stderr.includes('已還原本次上架變更')); assert.equal(sources(f), before);
      assert.equal(readFileSync(join(f.root, 'dist/old.txt'), 'utf8'), 'keep original build'); assert.ok(!existsSync(join(f.root, 'dist/partial.txt')));
    }
  });
  test('Cancellation and invalid-menu retry leave no lock or partial uploads', () => {
    const f = fixture(); const path = input(f, 'cancel.pdf'); const before = sources(f);
    for (const answer of ['q\n', '']) { run(f, [path], answer, false); assert.equal(sources(f), before); }
    run(f, [path], '99\n1\n'); assert.equal(catalog(f)[0].files.length, 1);
  });
  test('Git merge conflicts are detected before the category menu', () => {
    const f = fixture(); const oid = f.git('rev-parse', 'HEAD:生活管理slide.html').trim();
    execFileSync('git', ['update-index', '--index-info'], { cwd: f.root, input: `0 ${'0'.repeat(40)}\t生活管理slide.html\n100644 ${oid} 1\t生活管理slide.html\n100644 ${oid} 2\t生活管理slide.html\n100644 ${oid} 3\t生活管理slide.html\n` });
    const result = run(f, [input(f, 'conflict.pdf')], '', false); assert.ok(result.stderr.includes('merge conflict')); assert.ok(!result.stdout.includes('請選擇教材分類'));
  });
  test('An existing upload lock stops a second upload before showing the category menu', () => {
    const f = fixture();
    const digest = createHash('sha256').update(realpathSync(f.root)).digest('hex').slice(0, 20);
    const lock = join(f.root, 'tmp', `cactus-material-upload-${digest}.lock`); mkdirSync(lock);
    const before = sources(f); const result = run(f, [input(f, 'locked.pdf')], '', false);
    assert.ok(result.stderr.includes('另一個上架流程')); assert.ok(!result.stdout.includes('請選擇教材分類')); assert.equal(sources(f), before);
  });
  test('Concurrently edited source is preserved with backups instead of being overwritten during rollback', () => {
    const f = fixture(); writeFileSync(join(f.root, 'fixture-build.mjs'), `import {appendFileSync} from 'node:fs';appendFileSync('src/content/resource-categories.json',' ');process.exit(8);`);
    const result = run(f, [input(f, 'concurrent.pdf')], '1\n', false);
    assert.ok(result.stderr.includes('保留現況避免覆蓋')); assert.ok(catalog(f)[0].files.length); assert.ok(existsSync(join(f.root, 'files/concurrent.pdf')));
  });
  test('Pairing ignores editable suffixes and normalizes Unicode while retaining distinct titles', () => {
    assert.equal(materialKey('課程_可編輯版.PPTX'), materialKey('課程.pdf'));
    assert.equal(materialKey('lesson-editable.docx'), materialKey('lesson.pdf'));
    const category = addMaterials({ title: '測試', files: [], description: '', comingSoon: true }, [
      { name: 'first.pdf', format: 'pdf', url: '/files/first.pdf' },
      { name: 'second.pdf', format: 'pdf', url: '/files/second.pdf' },
    ]);
    assert.equal(category.files.length, 2);
  });
  test('Multiple categories with distinct editable mappings still pass the actual resource TypeScript schema', () => {
    const f = fixture();
    run(f, [input(f, '新教材.pdf'), input(f, '新教材.docx', office('docx', 'new'))]);
    run(f, [input(f, '既有教材.pptx', office('pptx', 'existing editable'))], '2\n');
    const entry = join(f.root, 'src/content/resources.ts');
    cpSync(join(project, 'src/content/resources.ts'), entry);
    const program = ts.createProgram([entry], { strict: true, noEmit: true, skipLibCheck: true,
      resolveJsonModule: true, allowSyntheticDefaultImports: true, types: [],
      module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, target: ts.ScriptTarget.ES2022 });
    const diagnostics = ts.getPreEmitDiagnostics(program);
    assert.equal(diagnostics.length, 0, diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n'));
  });
  console.log(`Materials uploader: ${count} regression groups passed; actual CLI/menu, file copying, HTML generation, build and rollback exercised in isolated Git repositories.`);
} finally { rmSync(temporary, { recursive: true, force: true }); }
