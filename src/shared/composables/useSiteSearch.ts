import { computed, ref } from 'vue';
import { articles } from '../../content/articles';
import { resources } from '../../content/resources';
export function useSiteSearch() {
  const query = ref('');
  const results = computed(() =>
    [
      ...articles,
      ...resources,
      { title: '同一座校園・特教宣導 RPG', href: '/campus/' },
      { title: 'FBA 行為功能評量', href: '/aba-tool.html' },
      { title: '行為記錄工具', href: '/behavior-tool.html' },
    ].filter((item) =>
      item.title.toLocaleLowerCase().includes(query.value.trim().toLocaleLowerCase()),
    ),
  );
  return { query, results };
}
