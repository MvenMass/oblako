/** srcset для фото из public/photos: рядом с оригиналом (760 px) лежит копия на 400 px */
export function photoSrcSet(src: string | undefined): string | undefined {
  if (!src || !src.startsWith('/photos/') || !src.endsWith('.jpg')) return undefined;
  return `${src.slice(0, -4)}-400.jpg 400w, ${src} 760w`;
}
