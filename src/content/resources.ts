import categories from './resource-categories.json';

export interface ResourceCategory {
  title: string;
  href?: string;
  image: string;
  description: string;
  files: string[];
  groups?: { id: string; title: string }[];
  fileGroups?: Record<string, string>;
  materialTitles?: Record<string, string | undefined>;
  editableFiles?: Record<string, string | string[] | undefined>;
  comingSoon?: boolean;
}
export const mathGameMaterialPdf = '/files/特教班數學｜認識新台幣×魔法烘焙坊.pdf';

export const resources: ResourceCategory[] = categories;

export function materialTitle(category: ResourceCategory, file: string): string {
  return category.materialTitles?.[file] || decodeURIComponent(file.split('/').pop() || file).replace(/\.(pdf|pptx|docx)$/i, '');
}

export function materialFiles(category: ResourceCategory, primary: string): string[] {
  const editable = category.editableFiles?.[primary];
  return [primary, ...(Array.isArray(editable) ? editable : editable ? [editable] : [])];
}

export function materialFormat(file: string): string {
  return file.split('.').pop()?.toUpperCase() || '';
}

export function materialFormatLabel(file: string): string {
  const format = materialFormat(file);
  return format === 'PPTX' || format === 'DOCX' ? `可編輯 ${format}` : format;
}

export function resourceCountLabel(category: ResourceCategory): string {
  return `${category.files.length} 份 ${category.files.every((file) => materialFormat(file) === 'PDF') ? 'PDF' : '教材'}`;
}
