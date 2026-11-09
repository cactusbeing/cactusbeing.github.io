import { siteUrl } from '../../shared/site-path';
import { sourceLabel } from './session';
import type { QuestionSource } from './session';
import type { QuestionBlock } from './question-content';

type Choice = 'A' | 'B' | 'C' | 'D';
type WrongQuestion = {
  id: number;
  source?: QuestionSource;
  answer: Choice;
  accepted_answers?: Choice[];
  question: string;
  options: Record<Choice, string>;
  context?: string;
  image?: string;
  image_text?: string;
  body_blocks?: QuestionBlock[];
  option_columns?: 1 | 2;
  user_answer?: string;
};

const WIDTH = 1240;
const HEIGHT = 1754;
const LEFT = 86;
const RIGHT = WIDTH - LEFT;
const BOTTOM = HEIGHT - 92;
// Leave the full 52 px first-page title below the 78 px header area.
const CONTENT_TOP = 140;
const encoder = new TextEncoder();

function ascii(value: string) {
  return encoder.encode(value);
}

// Keep encoded pages as Blob parts; avoid copying every JPEG into several large byte arrays.
async function jpeg(canvas: HTMLCanvasElement): Promise<Blob> {
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(value => value ? resolve(value) : reject(new Error('無法產生 PDF 頁面')), 'image/jpeg', 0.86),
  );
}

function makePdf(pages: Blob[]): Blob {
  const objects: Blob[] = [];
  const object = (...parts: BlobPart[]) => objects.push(new Blob(parts));
  const pageIds = pages.map((_, index) => 3 + index * 3);
  object(ascii('<< /Type /Catalog /Pages 2 0 R >>'));
  object(ascii(`<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`));
  for (let index = 0; index < pages.length; index++) {
    const pageId = pageIds[index];
    const content = ascii('q 595 0 0 842 0 0 cm /Im0 Do Q');
    object(ascii(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 ${pageId + 2} 0 R >> >> /Contents ${pageId + 1} 0 R >>`));
    object(ascii(`<< /Length ${content.length} >>\nstream\n`), content, ascii('\nendstream'));
    object(ascii(`<< /Type /XObject /Subtype /Image /Width ${WIDTH} /Height ${HEIGHT} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${pages[index].size} >>\nstream\n`), pages[index], ascii('\nendstream'));
  }
  const header = ascii('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  const parts: BlobPart[] = [header];
  const offsets = [0];
  let length = header.length;
  objects.forEach((value, index) => {
    offsets.push(length);
    const prefix = ascii(`${index + 1} 0 obj\n`);
    const suffix = ascii('\nendobj\n');
    parts.push(prefix, value, suffix);
    length += prefix.length + value.size + suffix.length;
  });
  const xref = length;
  parts.push(ascii(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`));
  offsets.slice(1).forEach(offset => parts.push(ascii(`${String(offset).padStart(10, '0')} 00000 n \n`)));
  parts.push(ascii(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`));
  return new Blob(parts, { type: 'application/pdf' });
}

export type WrongBookOutput = 'completed' | 'in-progress' | 'collection';
export function wrongBookPresentation(type: WrongBookOutput, year: number, subject: string, mistakes: number, correct: number, total: number, maxScore: number) {
  if (type === 'collection') return { title: '歷史錯題本', summary: `待複習 ${mistakes} 題`, filename: `${subject}-歷史錯題本.pdf` };
  if (type === 'in-progress') return { title: '未完成測驗錯題本', summary: `本輪尚未完成 · 已收錄 ${mistakes} 題錯題`, filename: `${year}年-${subject}-未完成測驗錯題本.pdf` };
  return { title: '錯題本', summary: `答對 ${correct} / ${total} 題 · ${Number((correct / total * maxScore).toFixed(2))} / ${maxScore} 分 · 錯題 ${mistakes} 題`, filename: `${year}年-${subject}-錯題本.pdf` };
}

export async function downloadWrongBook(
  year: number,
  subject: string,
  questions: WrongQuestion[],
  responses: Record<number, Choice>,
  correct: number,
  total: number,
  maxScore = total * 2,
  attemptLabel = `${year} 年教師資格考試`,
  unanswered: Record<number, string> = {},
  output: WrongBookOutput = 'completed',
): Promise<void> {
  if (!questions.length) return;
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('瀏覽器無法建立 PDF 畫布');
  const pages: Blob[] = [];
  const presentation = wrongBookPresentation(output, year, subject, questions.length, correct, total, maxScore);
  let y = CONTENT_TOP;
  const drawHeader = () => {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, WIDTH, 78);
    ctx.fillStyle = '#2f6348';
    ctx.font = '700 26px sans-serif';
    ctx.fillText(`${attemptLabel} · ${subject}`, LEFT, 52, RIGHT - LEFT);
    ctx.strokeStyle = '#dcebd7';
    ctx.beginPath();
    ctx.moveTo(LEFT, 66);
    ctx.lineTo(RIGHT, 66);
    ctx.stroke();
    ctx.restore();
  };
  const startPage = () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    y = CONTENT_TOP;
  };
  const nextPage = async () => {
    drawHeader();
    pages.push(await jpeg(canvas));
    startPage();
  };
  const wrappedLines = (value: string, font: string, indent = 0): string[] => {
    ctx.font = font;
    const lines: string[] = [];
    for (const paragraph of value.split('\n')) {
      let current = '';
      for (const character of paragraph) {
        if (ctx.measureText(current + character).width > RIGHT - LEFT - indent && current) {
          lines.push(current);
          current = character;
        } else current += character;
      }
      lines.push(current);
    }
    return lines;
  };
  const line = async (value: string, font: string, color: string, lineHeight: number, indent = 0) => {
    for (const text of wrappedLines(value, font, indent)) {
      if (y + lineHeight > BOTTOM) await nextPage();
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.fillText(text, LEFT + indent, y);
      y += lineHeight;
    }
  };
  try {
    startPage();
    await line(presentation.title, '700 52px sans-serif', '#244f3a', 70);
    await line(presentation.summary, '30px sans-serif', '#365344', 56);
    y += 18;
    for (const question of questions) {
      const provenance = question.source ? '來源：' + sourceLabel(question) : '';
      const provenanceHeight = provenance ? wrappedLines(provenance, '25px sans-serif').length * 42 : 0;
      if (question.body_blocks?.length) {
        const { renderMathQuestion } = await import('./math-question-pdf');
        const rendered = await renderMathQuestion(
          { ...question, body_blocks: question.body_blocks }, question.user_answer ?? responses[question.id] ?? unanswered[question.id] ?? '未提交（0 分）', RIGHT - LEFT,
        );
        const scale = Math.min((RIGHT - LEFT) / rendered.width, (BOTTOM - CONTENT_TOP - provenanceHeight) / rendered.height);
        const width = rendered.width * scale;
        const height = rendered.height * scale;
        if (y + provenanceHeight + height > BOTTOM) await nextPage();
        if (provenance) await line(provenance, '25px sans-serif', '#365344', 42);
        ctx.drawImage(rendered, LEFT, y, width, height);
        y += height + 34;
        rendered.width = rendered.height = 0;
        continue;
      }
      if (y + provenanceHeight > BOTTOM - 180) await nextPage();
      if (provenance) await line(provenance, '25px sans-serif', '#365344', 42);
      await line(`第 ${question.id} 題`, '700 32px sans-serif', '#2f6348', 53);
      if (question.context) {
        await line('閱讀文章', '700 27px sans-serif', '#365344', 46);
        await line(question.context, '25px sans-serif', '#24372b', 39);
        y += 14;
      }
      await line(question.question, '700 29px sans-serif', '#24372b', 47);
      if (question.image) {
        const image = new Image();
        image.src = siteUrl(question.image);
        await image.decode();
        const imageScale = Math.min(1, (RIGHT - LEFT) / image.naturalWidth, (BOTTOM - CONTENT_TOP) / image.naturalHeight);
        const imageWidth = image.naturalWidth * imageScale;
        const imageHeight = image.naturalHeight * imageScale;
        if (y + imageHeight > BOTTOM) await nextPage();
        ctx.drawImage(image, LEFT, y, imageWidth, imageHeight);
        y += imageHeight + 18;
      }
      if (question.image_text) await line(`附圖文字：${question.image_text}`, '24px sans-serif', '#365344', 39);
      for (const choice of ['A', 'B', 'C', 'D'] as const) {
        await line(`${choice}. ${question.options[choice]}`, '27px sans-serif', '#24372b', 43, 12);
      }
      y += 8;
      await line(`你的答案：${question.user_answer ?? responses[question.id] ?? unanswered[question.id] ?? '未提交（0 分）'}    參考答案：${(question.accepted_answers?.length ? question.accepted_answers : [question.answer]).join(' 或 ')}`, '700 28px sans-serif', '#9b3c32', 48);
      y += 34;
    }
    drawHeader();
    pages.push(await jpeg(canvas));
    const url = URL.createObjectURL(makePdf(pages));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = presentation.filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } finally {
    canvas.width = canvas.height = 0;
  }
}
