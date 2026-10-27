import { computed, ref } from 'vue';
import { articles } from '../../content/articles';
import { resources } from '../../content/resources';
export function useSiteSearch() {
  const query = ref('');
  const results = computed(() =>
    [
      ...articles,
      ...resources,
      { title: '遊戲百寶箱', href: '/game/' },
      { title: '同一座校園・特教宣導 RPG', href: '/game/campus/' },
      { title: 'FBA 行為功能評量', href: '/aba-tool.html' },
      { title: '行為記錄工具', href: '/behavior-tool.html' },
      { title: '教師資格考試題庫・教檢線上測驗', href: '/exam/', keywords: '特教教檢 教檢考古題' },
    ].filter((item) =>
      `${item.title} ${'keywords' in item ? item.keywords : ''}`
        .toLocaleLowerCase().includes(query.value.trim().toLocaleLowerCase()),
    ),
  );
  return { query, results };
}
