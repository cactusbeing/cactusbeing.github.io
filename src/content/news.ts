import data from './updates.json';
import { articleEntries } from './article-details';
import { resources } from './resources';
import { activeNotice, liveNews, type NewsEntry, type NoticeConfig } from './news-model.mjs';
export { newsCategories, selectNews } from './news-model.mjs';

export const noticeConfig: NoticeConfig = data.notice;
const manual = liveNews(data.entries, resources);
export const newsEntries: NewsEntry[] = [...manual, ...articleEntries
  .filter((article) => !manual.some((entry) => entry.href === article.href))
  .map((article) => ({ id: `article:${article.href}`, date: (article.publishedAt || article.date).slice(0, 10),
    category: 'articles', title: article.title, summary: article.description, href: article.href }))];
export const siteNotice = activeNotice(noticeConfig, newsEntries);
