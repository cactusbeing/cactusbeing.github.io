import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { activeNotice, addMaterialNews, liveNews, materialAnchor, materialKey, materialNewsTitle, selectNews, taipeiDate, validateNewsData } from '../src/content/news-model.mjs';

const data = JSON.parse(readFileSync('src/content/updates.json', 'utf8'));
validateNewsData(data);
const notice = { enabled: true, heading: '小站公告', message: '', featuredId: 'older', expiresAt: '2026-11-08' };
const entry = (id, date, category = 'materials') => ({ id, date, category, title: id, summary: '摘要', href: '/news.html' });
const entries = [entry('older', '2026-11-01'), entry('newer', '2026-11-08'), entry('future', '2026-11-09'),
  { ...entry('hidden', '2026-11-08'), hidden: true }, entry('game', '2026-11-07', 'games')];
assert.deepEqual(selectNews(entries, notice, { today: '2026-11-08' }).map((item) => item.id), ['older', 'newer', 'game']);
assert.deepEqual(selectNews(entries, notice, { today: '2026-11-09', limit: 1 }).map((item) => item.id), ['future']);
assert.deepEqual(selectNews(entries, notice, { today: '2026-11-08', category: 'games', limit: 1 }).map((item) => item.id), ['game']);
assert.deepEqual(selectNews(entries, notice, { today: '2026-11-08', category: 'site' }), []);
assert.equal(activeNotice({ ...notice, enabled: false }, entries, '2026-11-08'), null);
assert.equal(activeNotice(notice, entries, '2026-11-09'), null);
assert.equal(activeNotice({ ...notice, featuredId: 'future' }, entries, '2026-11-08'), null);
assert.equal(activeNotice({ ...notice, featuredId: null, message: '想說的話' }, [], '2026-11-08').message, '想說的話');
assert.equal(taipeiDate(new Date('2026-11-07T16:00:00Z')), '2026-11-08');
assert.equal(taipeiDate(new Date('2026-11-07T15:59:59Z')), '2026-11-07');

for (const mutation of [
  (draft) => draft.entries.push(draft.entries[0]),
  (draft) => draft.entries[0].date = '2026-02-30',
  (draft) => draft.entries[0].href = 'javascript:alert(1)',
  (draft) => draft.entries[0].href = '//example.com',
  (draft) => draft.entries[0].href = '/%2e%2e/private',
  (draft) => draft.notice.featuredId = 'missing',
  (draft) => draft.notice.expiresAt = 'tomorrow',
]) {
  const draft = structuredClone(data); mutation(draft); assert.throws(() => validateNewsData(draft));
}
const catalog = JSON.parse(readFileSync('src/content/resource-categories.json', 'utf8'));
for (const announcement of liveNews(data.entries, catalog).filter((item) => item.material)) {
  const category = catalog.find((item) => item.title === announcement.material.category);
  const primary = category.files.find((url) => materialKey(decodeURIComponent(url.split('/').pop())) === announcement.material.key);
  assert.ok(primary, `Announcement references missing material: ${announcement.id}`);
  assert.equal(decodeURIComponent(announcement.href.split('#')[1]), materialAnchor(decodeURIComponent(primary.split('/').pop())));
  assert.equal(announcement.title, materialNewsTitle(category.title, decodeURIComponent(primary.split('/').pop())));
}
for (const [category, filename, expected] of [
  ['生活管理', '生活管理-護牙大冒險_可編輯版.pptx', '生活管理「護牙大冒險」上架'],
  ['生活管理', '生活管理_身體保健大冒險.pdf', '生活管理「身體保健大冒險」上架'],
  ['特教班數學', '特教班數學｜認識新台幣×魔法烘焙坊.pdf', '特教班數學「認識新台幣×魔法烘焙坊」上架'],
  ['英文', 'Lesson-editable.docx', '英文「Lesson」上架'],
  ['生活管理', '生活管理技巧.pdf', '生活管理「生活管理技巧」上架'],
]) assert.equal(materialNewsTitle(category, filename), expected);
const original = { notice: { enabled: false, heading: '小站公告', message: '' }, entries: [] };
const category = { title: '測試', href: '/測試slide.html', files: ['/files/課程.pdf'], editableFiles: { '/files/課程.pdf': ['/files/課程_可編輯版.pptx'] } };
const added = addMaterialNews(original, category, [{ name: '課程.pdf' }, { name: '課程_可編輯版.pptx' }], '2026-11-08');
assert.equal(added.entries.length, 1); assert.equal(original.entries.length, 0);
assert.equal(added.entries[0].title, '測試「課程」上架');
assert.ok(added.entries[0].summary.includes('可編輯 PPTX'));
const repeated = addMaterialNews(added, category, [{ name: '課程_可編輯版.pptx' }], '2026-11-09');
assert.equal(repeated.entries.length, 1); assert.equal(repeated.entries[0].date, '2026-11-08');
const legacy = structuredClone(added); legacy.entries[0].title = '舊標題';
assert.equal(addMaterialNews(legacy, category, [{ name: '課程_可編輯版.pptx' }]).entries[0].title, '測試「課程」上架');
assert.equal(liveNews(added.entries, [{ ...category, files: [] }]).length, 0, 'Removed materials no longer appear');
assert.equal(liveNews(added.entries, [{ ...category, comingSoon: true }]).length, 0, 'Retired categories no longer appear');
console.log('News: category filtering before limits, pin expiry, freeform/disabled notices, future/hidden entries, Taipei dates, invalid data, material anchors and format deduplication passed.');
