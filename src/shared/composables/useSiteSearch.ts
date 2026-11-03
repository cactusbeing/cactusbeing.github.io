import { computed, ref } from 'vue';
import { articleEntries } from '../../content/article-details';
import { resources } from '../../content/resources';

export function matchesSearch(item: { title: string; keywords?: string }, query: string): boolean {
  return `${item.title} ${item.keywords ?? ''}`
    .toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
}

export function useSiteSearch() {
  const query = ref('');
  const results = computed(() =>
    [
      ...articleEntries,
      ...resources,
      { title: '遊戲百寶箱', href: '/game/' },
      { title: '社會技巧：聊天傳接球', href: '/game/chat-relay/', keywords: '社會技巧 聆聽 接話 提問 分享 感受 尊重界線 對話' },
      { title: '特教宣導：同一座校園', href: '/game/campus/', keywords: '特教宣導 RPG 校園探索' },
      { title: '生活數學：認識新台幣', href: '/game/money/', keywords: '新臺幣 錢幣 硬幣 紙鈔 生活數學 湊錢 找零 特教班 手搖店購物 珍珠 奶茶' },
      { title: 'FBA 行為功能評量', href: '/aba-tool.html' },
      { title: '行為記錄工具', href: '/behavior-tool.html' },
      { title: '教師資格考試題庫・教檢線上測驗', href: '/exam/', keywords: '特教教檢 教檢考古題' },
    ].filter((item) => matchesSearch(item, query.value)),
  );
  return { query, results };
}
