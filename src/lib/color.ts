type Rgb = [number, number, number];

function parse(hex: string): Rgb {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex([r, g, b]: Rgb): string {
  const c = (v: number) =>
    Math.round(Math.max(0, Math.min(255, v)))
      .toString(16)
      .padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Смешать цвет a с b в доле t (0 — a, 1 — b). Замена color-mix() для Safari 14 */
export function mix(a: string, b: string, t: number): string {
  const x = parse(a);
  const y = parse(b);
  return toHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = parse(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Относительная яркость WCAG */
function luminance(hex: string): number {
  const ch = parse(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

/** Контраст двух цветов по WCAG: 1…21 */
export function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Затемняет цвет, пока у него не будет контраста ≥ target и с белым, и с фоном.
 * Для акцентов тем: кнопки с белым текстом и акцентный текст на фоне страницы (WCAG AA).
 */
export function readable(hex: string, background: string, target = 4.6): string {
  let out = hex;
  for (let t = 0.05; t <= 0.6; t += 0.05) {
    if (contrast(out, '#ffffff') >= target && contrast(out, background) >= target) return out;
    out = mix(hex, '#000000', t);
  }
  return out;
}
