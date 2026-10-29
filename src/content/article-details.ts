import { legacyArticles } from './articles';
import { mediumArticles } from './medium-articles';
export const articleCategories = [
  { id: 'all', label: '全部文章' },
  { id: 'inclusion', label: '融合與理解' },
  { id: 'behavior', label: '情緒與行為' },
  { id: 'family', label: '親師合作' },
  { id: 'relationships', label: '心理與關係' },
] as const;
export type ArticleCategory = Exclude<(typeof articleCategories)[number]['id'], 'all'>;
const details: { category: ArticleCategory; tags: string[]; image: string; description: string }[] =
  [
    {
      category: 'relationships',
      tags: ['佛洛姆', '愛的藝術', '成熟的愛', '親密關係', '影劇解析'],
      image: '/assets/img/post-bg.jpg',
      description: '以《愛的藝術》為視角，從照顧、責任、尊重與了解，回望《直到T恤乾了為止》裡的孤獨、依附與愛。',
    },
    {
      category: 'inclusion',
      tags: ['融合教育', '平等與尊重'],
      image: '/assets/img/postbrain-bg.jpg',
      description: '積極差別待遇不是特權，可是……什麼是「合理的」積極差別待遇?',
    },
    {
      category: 'inclusion',
      tags: ['自我理解', '多元價值'],
      image: '/assets/img/post-bg.jpg',
      description: '有多少人覺得：理組腦、不被情緒左右、賺很多錢，三者兼具才是成功？',
    },
    {
      category: 'behavior',
      tags: ['情緒行為障礙', '特教知識'],
      image: '/assets/img/pbs.jpg',
      description: '淺談情緒行為障礙，從認識與理解開始。',
    },
    {
      category: 'behavior',
      tags: ['情緒行為障礙', '行為支持'],
      image: '/assets/img/tool-background.jpg',
      description: '情緒行為障礙各類型疾患與介入方法。',
    },
    {
      category: 'inclusion',
      tags: ['語言障礙', '特教知識'],
      image: '/assets/img/learn.jpg',
      description: '這篇介紹的是人數眾多卻時常被低估的障礙類別：語言障礙。',
    },
    {
      category: 'inclusion',
      tags: ['融合教育', '教師資格考'],
      image: '/assets/img/post/融合教育.jpeg',
      description: '融合教育是什麼？準備新制教師資格考必看！',
    },
    {
      category: 'family',
      tags: ['親師合作', '家庭支持'],
      image: '/assets/img/about-bg.jpg',
      description: '家長大哉問，親師合作一起解決問題！',
    },
  ];
const legacyEntries = legacyArticles.map((article, index) => {
  const detail = details[index];
  return {
    ...article,
    ...detail,
    keywords: [detail.description, ...detail.tags,
      articleCategories.find((category) => category.id === detail.category)?.label ?? ''].join(' '),
  };
});

const importedEntries = mediumArticles.map((article) => ({
  ...article,
  tags: [...article.tags] as string[],
  keywords: [article.description, ...article.tags,
    articleCategories.find((category) => category.id === article.category)?.label ?? ''].join(' '),
}));

export const articleEntries = [...legacyEntries, ...importedEntries].sort((a, b) =>
  (b.publishedAt || b.date).localeCompare(a.publishedAt || a.date),
);
