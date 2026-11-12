export interface NewsEntry {
  id: string; date: string; category: string; title: string; summary: string; href: string;
  hidden?: boolean; material?: { category: string; key: string };
}
export interface NoticeConfig {
  enabled: boolean; heading: string; message: string; featuredId?: string | null;
  expiresAt?: string | null; href?: string; linkLabel?: string;
}
export interface NewsData { notice: NoticeConfig; entries: NewsEntry[] }
export const newsCategories: { id: string; label: string }[];
export function taipeiDate(date?: Date): string;
export function isTeacherMaterial(name: string): boolean;
export function materialKey(name: string): string;
export function materialAnchor(name: string): string;
export function materialNewsTitle(category: string, filename: string): string;
export function liveNews(entries: NewsEntry[], categories: {title: string; files: string[]; comingSoon?: boolean}[]): NewsEntry[];
export function activeNotice(config: NoticeConfig, entries: NewsEntry[], today?: string): (NoticeConfig & { featured?: NewsEntry }) | null;
export function selectNews(entries: NewsEntry[], config: NoticeConfig, options?: { category?: string; today?: string; limit?: number }): NewsEntry[];
export function validateNewsData(data: unknown): void;
export function addMaterialNews(data: NewsData, category: {title: string; href: string; files: string[]; editableFiles?: Record<string, string | string[] | undefined>; teacherFiles?: Record<string, string | undefined>}, inputs: {name: string}[], date?: string): NewsData;
