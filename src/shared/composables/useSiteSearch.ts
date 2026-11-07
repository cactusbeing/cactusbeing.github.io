import { computed, ref } from 'vue';
import { articleEntries } from '../../content/article-details';
import { resources } from '../../content/resources';
import { materialAnchor } from '../../content/news-model.mjs';

export function matchesSearch(item: { title: string; keywords?: string }, query: string): boolean {
  return `${item.title} ${item.keywords ?? ''}`
    .toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
}

export function useSiteSearch() {
  const query = ref('');
  const results = computed(() =>
    [
      ...articleEntries,
      ...resources.filter((resource) => !resource.comingSoon && resource.href),
      ...resources.filter((resource) => !resource.comingSoon && resource.href).flatMap((resource) => resource.files.map((file) => {
        const name = decodeURIComponent(file.split('/').pop()!);
        return { title: name.replace(/\.(pdf|pptx|docx)$/i, ''), href: `${resource.href}#${encodeURIComponent(materialAnchor(name))}`, keywords: `${resource.title} 教材` };
      })),
      { title: '最新消息', href: '/news.html', keywords: '小站公告 更新 新上架' },
      { title: '遊戲百寶箱', href: '/game/' },
      { title: '社會技巧：聊天傳接球', href: '/game/chat-relay/', keywords: '社會技巧 聆聽 接話 提問 分享 感受 尊重界線 對話' },
      { title: '特教宣導：同一座校園', href: '/game/campus/', keywords: '特教宣導 RPG 校園探索' },
      { title: '生活數學：認識新台幣', href: '/game/money/', keywords: '新臺幣 錢幣 硬幣 紙鈔 生活數學 湊錢 找零 特教班 手搖店購物 珍珠 奶茶' },
      { title: '魔法烘焙坊', href: '/game/bakery/', keywords: '餅乾 形狀 數量 分裝 四則運算 加法 減法 乘法 除法 生活數學 特教班' },
      { title: 'FBA 行為功能評量', href: '/aba-tool.html' },
      { title: '行為記錄工具', href: '/behavior-tool.html' },
      { title: '教師資格考試題庫・教檢線上測驗', href: '/exam/', keywords: '特教教檢 教檢考古題' },
    ].filter((item) => matchesSearch(item, query.value)),
  );
  return { query, results };
}
