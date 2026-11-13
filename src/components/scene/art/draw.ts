// Хелперы для рисования сцен строками SVG (1440×780). Цвета — только классы палитры.

/** Окно: базовый цвет + жёлтый слой, яркость которого задаёт палитра (--win) */
export function win(x: number, y: number, w = 12, h = 16): string {
  return `<rect class="f-win-base" x="${x}" y="${y}" width="${w}" height="${h}"/><rect class="f-win" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
}

/** Сетка окон */
export function windows(
  x: number,
  y: number,
  cols: number,
  rows: number,
  dx = 22,
  dy = 30,
  w = 12,
  h = 16,
): string {
  let out = '';
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) out += win(x + c * dx, y + r * dy, w, h);
  return out;
}

/** Дом: корпус, скатная крыша и окна */
export function house(
  x: number,
  y: number,
  w: number,
  h: number,
  body = 'f-city',
  roof = 'f-roof',
): string {
  const cols = Math.max(1, Math.floor((w - 16) / 22));
  const rows = Math.max(1, Math.floor((h - 30) / 32));
  const pad = (w - (cols - 1) * 22 - 12) / 2;
  return (
    `<rect class="${body}" x="${x}" y="${y}" width="${w}" height="${h}"/>` +
    `<path class="${roof}" d="M${x - 6} ${y} L${x + w / 2} ${y - 20} L${x + w + 6} ${y}Z"/>` +
    windows(x + pad, y + 16, cols, rows, 22, 32)
  );
}

/** Повторить разметку n раз с функцией от индекса */
export function repeat(n: number, fn: (i: number) => string): string {
  return Array.from({ length: n }, (_, i) => fn(i)).join('');
}
