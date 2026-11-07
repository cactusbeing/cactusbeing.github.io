export type QuestionBlock =
  | { type: 'text'; text: string; inset?: boolean }
  | { type: 'image'; src: string; width: number; height: number; alt: string; width_percent?: number; min_width?: number; offset_percent?: number }
  | { type: 'table'; headers?: string[]; rows: string[][]; row_headers?: boolean; caption?: string; min_width?: number }
  | { type: 'box'; blocks: QuestionBlock[] }
  | { type: 'columns'; columns: QuestionBlock[][]; stack_on_mobile?: boolean };

export function contentImages(blocks: QuestionBlock[] = []): Extract<QuestionBlock, { type: 'image' }>[] {
  return blocks.flatMap((block) => {
    if (block.type === 'image') return [block];
    if (block.type === 'box') return contentImages(block.blocks);
    if (block.type === 'columns') return block.columns.flatMap(contentImages);
    return [];
  });
}
