import manifest from '../content/image-variants.json';
import { siteUrl } from './site-path';

const images: Record<string, { src: string; width: number }[]> = manifest;

export function imageSource(original: string): string {
  const variants = images[original];
  const image = variants?.find((variant) => variant.width >= 960) || variants?.at(-1);
  return siteUrl(image?.src || original);
}

export function imageSrcset(original: string): string | undefined {
  return images[original]?.map(({ src, width }) => `${siteUrl(src)} ${width}w`).join(', ');
}
