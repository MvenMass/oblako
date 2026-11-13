export const MONTH_LETTERS = ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'];
export const MONTHS_SHORT = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
];
export const MONTHS_FULL = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];

/** «апрель–июнь, сентябрь–октябрь» из списка месяцев 1–12 */
export function monthRanges(months: number[]): string {
  const ranges: [number, number][] = [];
  for (const m of [...months].sort((a, b) => a - b)) {
    const last = ranges[ranges.length - 1];
    if (last && m === last[1] + 1) last[1] = m;
    else ranges.push([m, m]);
  }
  return ranges
    .map(([a, b]) => (a === b ? MONTHS_FULL[a - 1] : `${MONTHS_FULL[a - 1]}–${MONTHS_FULL[b - 1]}`))
    .join(', ');
}
