import { siteUrl } from '../../shared/site-path';

type Choice = 'A' | 'B' | 'C' | 'D';
type WrongQuestion = {
  id: number;
  answer: Choice;
  accepted_answers?: Choice[];
  question: string;
  options: Record<Choice, string>;
  context?: string;
  image?: string;
  image_text?: string;
};

const WIDTH = 1240;
const HEIGHT = 1754;
const LEFT = 86;
const RIGHT = WIDTH - LEFT;
const BOTTOM = HEIGHT - 92;
const encoder = new TextEncoder();

function ascii(value: string): Uint8Array {
  return encoder.encode(value);
}

function concat(parts: Uint8Array[]): Uint8Array {
  const result = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

async function jpeg(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error('無法產生 PDF 頁面')), 'image/jpeg', 0.86),
  );
  return new Uint8Array(await blob.arrayBuffer());
}

function makePdf(pages: Uint8Array[]): Blob {
  const objects: Uint8Array[] = [];
  const pageIds = pages.map((_, index) => 3 + index * 3);
  objects.push(ascii('<< /Type /Catalog /Pages 2 0 R >>'));
  objects.push(ascii(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`));
  for (let index = 0; index < pages.length; index++) {
    const pageId = pageIds[index];
    const content = ascii('q 595 0 0 842 0 0 cm /Im0 Do Q');
    objects.push(ascii(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 ${pageId + 2} 0 R >> >> /Contents ${pageId + 1} 0 R >>`));
    objects.push(concat([ascii(`<< /Length ${content.length} >>\nstream\n`), content, ascii('\nendstream')]));
    objects.push(concat([ascii(`<< /Type /XObject /Subtype /Image /Width ${WIDTH} /Height ${HEIGHT} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${pages[index].length} >>\nstream\n`), pages[index], ascii('\nendstream')]));
  }
  const parts: Uint8Array[] = [ascii('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')];
  const offsets = [0];
  let length = parts[0].length;
  objects.forEach((object, index) => {
    offsets.push(length);
    const part = concat([ascii(`${index + 1} 0 obj\n`), object, ascii('\nendobj\n')]);
    parts.push(part);
    length += part.length;
  });
  const xref = length;
  parts.push(ascii(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`));
  offsets.slice(1).forEach((offset) => parts.push(ascii(`${String(offset).padStart(10, '0')} 00000 n \n`)));
  parts.push(ascii(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`));
  return new Blob(parts as BlobPart[], { type: 'application/pdf' });
}

export async function downloadWrongBook(
  year: number,
  subject: string,
  questions: WrongQuestion[],
  responses: Record<number, Choice>,
  correct: number,
  total: number,
): Promise<void> {
  if (!questions.length) return;
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('瀏覽器無法建立 PDF 畫布');
  const pages: Uint8Array[] = [];
  let y = LEFT;
  const startPage = () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#2f6348';
    ctx.font = '700 26px sans-serif';
    ctx.fillText(`${year} 年教師資格考試 · ${subject}`, LEFT, 52);
    ctx.strokeStyle = '#dcebd7';
    ctx.beginPath();
    ctx.moveTo(LEFT, 66);
    ctx.lineTo(RIGHT, 66);
    ctx.stroke();
    y = 102;
  };
  const nextPage = async () => {
    pages.push(await jpeg(canvas));
    startPage();
  };
  const line = async (value: string, font: string, color: string, lineHeight: number, indent = 0) => {
    ctx.font = font;
    ctx.fillStyle = color;
    for (const paragraph of value.split('\n')) {
      let current = '';
      for (const character of paragraph) {
        if (ctx.measureText(current + character).width > RIGHT - LEFT - indent && current) {
          if (y + lineHeight > BOTTOM) await nextPage();
          ctx.font = font;
          ctx.fillStyle = color;
          ctx.fillText(current, LEFT + indent, y);
          y += lineHeight;
          current = character;
        } else current += character;
      }
      if (y + lineHeight > BOTTOM) await nextPage();
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.fillText(current, LEFT + indent, y);
      y += lineHeight;
    }
  };
  startPage();
  await line('錯題本', '700 52px sans-serif', '#244f3a', 70);
  await line(`答對 ${correct} / ${total} 題 · ${correct * 2} / 50 分 · 錯題 ${questions.length} 題`, '30px sans-serif', '#365344', 56);
  y += 18;
  for (const question of questions) {
    if (y > BOTTOM - 180) await nextPage();
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
      const imageWidth = Math.min(550, image.naturalWidth);
      const imageHeight = image.naturalHeight * imageWidth / image.naturalWidth;
      if (y + imageHeight > BOTTOM) await nextPage();
      ctx.drawImage(image, LEFT, y, imageWidth, imageHeight);
      y += imageHeight + 18;
    }
    if (question.image_text) await line(`附圖文字：${question.image_text}`, '24px sans-serif', '#365344', 39);
    for (const choice of ['A', 'B', 'C', 'D'] as const) {
      await line(`${choice}. ${question.options[choice]}`, '27px sans-serif', '#24372b', 43, 12);
    }
    y += 8;
    await line(`你的答案：${responses[question.id]}    參考答案：${(question.accepted_answers?.length ? question.accepted_answers : [question.answer]).join(' 或 ')}`, '700 28px sans-serif', '#9b3c32', 48);
    y += 34;
  }
  pages.push(await jpeg(canvas));
  const url = URL.createObjectURL(makePdf(pages));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${year}年-${subject}-錯題本.pdf`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
