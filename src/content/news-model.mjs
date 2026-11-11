export const newsCategories = [
  { id: 'all', label: '全部' }, { id: 'materials', label: '教材' },
  { id: 'games', label: '遊戲' }, { id: 'articles', label: '文章' },
  { id: 'exam', label: '教檢' }, { id: 'site', label: '其他' },
];

export function taipeiDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return ['year', 'month', 'day'].map((type) => parts.find((part) => part.type === type).value).join('-');
}

export function materialKey(name) {
  return name.split('/').pop().replace(/\.[^.]*$/, '').normalize('NFKC')
    .replace(/[\s_-]*(?:[（(]\s*)?(?:可編輯(?:版)?|editable)(?:\s*[）)])?$/iu, '')
    .trim().toLowerCase();
}
export const materialAnchor = (name) => 'material-' + materialKey(name);
export function materialNewsTitle(category, filename) {
  let name = filename.split('/').pop().normalize('NFC').replace(/\.(pdf|pptx|docx)$/i, '')
    .replace(/[\s_-]*(?:[（(]\s*)?(?:可編輯(?:版)?|editable)(?:\s*[）)])?$/iu, '').trim();
  // Preserve a more specific subject label already present in a material's filename.
  const subject = name.split(/[\s_｜|：:–—-]+/)[0];
  if (subject !== name && subject.endsWith(category)) category = subject;
  if (name.startsWith(category) && /^[\s_｜|：:–—-]+/.test(name.slice(category.length)))
    name = name.slice(category.length).replace(/^[\s_｜|：:–—-]+/, '');
  return `${category}「${name}」上架`;
}
const published = (entry, today) => !entry.hidden && entry.date <= today;

export function liveNews(entries, categories) {
  return entries.filter((entry) => !entry.material || categories.some((category) =>
    !category.comingSoon && category.title === entry.material.category && category.files.some((file) =>
      materialKey(decodeURIComponent(file.split('/').pop())) === entry.material.key)));
}

export function activeNotice(config, entries, today = taipeiDate()) {
  if (!config?.enabled || (config.expiresAt && config.expiresAt < today)) return null;
  const featured = entries.find((entry) => entry.id === config.featuredId && published(entry, today));
  return config.message?.trim() || featured ? { ...config, featured } : null;
}

export function selectNews(entries, config, { category = 'all', today = taipeiDate(), limit = Infinity } = {}) {
  const featured = activeNotice(config, entries, today)?.featured?.id;
  return entries.filter((entry) => published(entry, today) && (category === 'all' || entry.category === category))
    .sort((a, b) => Number(b.id === featured) - Number(a.id === featured) || b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
    .slice(0, limit);
}

export function validateNewsData(data) {
  const validDate = (date) => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
  const validLink = (href) => typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') &&
    !/[\\\x00-\x20]/.test(href) && !decodeURIComponent(href.split(/[?#]/)[0]).split('/').some((part) => part === '..' || part === '.');
  if (!data || !Array.isArray(data.entries) || !data.notice) throw Error('最新消息資料格式不正確。');
  const ids = new Set();
  for (const entry of data.entries) {
    if (typeof entry.id !== 'string' || !entry.id.trim() || ids.has(entry.id) || !validDate(entry.date) ||
        !newsCategories.some((category) => category.id !== 'all' && category.id === entry.category) ||
        typeof entry.title !== 'string' || !entry.title.trim() || typeof entry.summary !== 'string' || !validLink(entry.href) ||
        (entry.hidden !== undefined && typeof entry.hidden !== 'boolean') ||
        (entry.material && (entry.category !== 'materials' || !entry.material.category?.trim() || !entry.material.key?.trim())))
      throw Error(`最新消息不完整或重複：${entry.id}`);
    ids.add(entry.id);
  }
  const notice = data.notice;
  if (typeof notice.enabled !== 'boolean' || typeof notice.heading !== 'string' || !notice.heading.trim() ||
      typeof notice.message !== 'string' || (notice.expiresAt && !validDate(notice.expiresAt)) ||
      (notice.featuredId && !ids.has(notice.featuredId)) || (notice.href && !validLink(notice.href)))
    throw Error('小站公告設定不正確，請檢查消息 ID、連結與到期日。');
}

export function addMaterialNews(data, category, inputs, date = taipeiDate()) {
  const result = structuredClone(data);
  for (const key of new Set(inputs.map((input) => materialKey(input.name)))) {
    const primary = category.files.find((url) => materialKey(decodeURIComponent(url.split('/').pop())) === key);
    const href = category.href + '#' + encodeURIComponent(materialAnchor(decodeURIComponent(primary.split('/').pop())));
    const existing = result.entries.find((entry) => entry.material?.category === category.title && entry.material.key === key);
    const editable = category.editableFiles?.[primary];
    const urls = [primary, ...(Array.isArray(editable) ? editable : editable ? [editable] : [])];
    const formats = urls.map((url) => url.split('.').pop().toUpperCase()).map((format) => format === 'PDF' ? format : `可編輯 ${format}`);
    const title = materialNewsTitle(category.title, decodeURIComponent(primary.split('/').pop()));
    const id = `material:${category.title}:${key}`;
    if (existing) {
      existing.href = href;
      existing.title = title;
      if (existing.id === id) existing.summary = `${category.title}教材，提供 ${formats.join('、')} 下載。`;
      continue;
    }
    if (result.entries.some((entry) => entry.id === id)) throw Error(`最新消息 ID 衝突：${id}`);
    result.entries.unshift({ id, date, category: 'materials', title,
      summary: `${category.title}教材，提供 ${formats.join('、')} 下載。`, href, material: { category: category.title, key } });
  }
  validateNewsData(result);
  return result;
}
