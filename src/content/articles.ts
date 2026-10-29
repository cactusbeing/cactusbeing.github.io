import { mediumArticles } from './medium-articles';

export interface Article {
  title: string;
  href: string;
  date: string;
  author: string;
  publishedAt?: string;
}
export const legacyArticles: Article[] = [
  {
    title: '如果讓佛洛姆看《直到T恤乾了為止》',
    href: '/如果讓佛洛姆看《直到T恤乾了為止》.html',
    date: '2026-10-28',
    author: '仙人掌星人',
  },
  {
    title: '是平權還是特權？是為你好，還是二次傷害？',
    href: '/是平權還是特權？是為你好，還是二次傷害？.html',
    date: '2021-06-30',
    author: '仙人掌星人',
  },
  {
    title: '有多少人覺得：理組腦、不被情緒左右、賺很多錢，三者兼具才是成功？',
    href: '/有多少人覺得：理組腦、不被情緒左右、賺很多錢，三者兼具才是成功？.html',
    date: '2021-06-23',
    author: '仙人掌星人',
  },
  {
    title: '淺談情緒行為障礙',
    href: '/淺談情緒行為障礙.html',
    date: '2021-07-11',
    author: '仙人掌星人',
  },
  {
    title: '情緒行為障礙各類型疾患&介入方法',
    href: '/情緒行為障礙各類型疾患&介入方法.html',
    date: '2021-07-11',
    author: '仙人掌星人',
  },
  {
    title: '淺談語言障礙',
    href: '/淺談語言障礙.html',
    date: '2021-07-10',
    author: '仙人掌星人',
  },
  {
    title: '融合教育是什麼？準備新制教師資格考必看！',
    href: '/融合教育是什麼？準備新制教師資格考必看！.html',
    date: '2021-07-07',
    author: '仙人掌星人',
  },
  {
    title: '家長大哉問 - 親師合作一起解決問題！',
    href: '/家長大哉問 - 親師合作一起解決問題！.html',
    date: '2021-07-07',
    author: '仙人掌星人',
  },
];

export const articles: Article[] = [...legacyArticles, ...mediumArticles].sort((a, b) =>
  (b.publishedAt || b.date).localeCompare(a.publishedAt || a.date),
);
