import type { City } from '@/types/city';
import { formatRub, nbsp } from '@/lib/cities';

const MONTHS_SHORT = [
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

export interface CompareRow {
  label: string;
  value: string;
  /** Меньше — лучше: у этого города значение лучше, чем у соседа */
  better: boolean;
}

/** Строки сравнения города a с городом b */
export function compareRows(a: City, b: City): CompareRow[] {
  const lower = (x: number, y: number) => x < y;
  return [
    {
      label: 'Перелёт',
      value: `≈ ${formatRub(a.quiz.flightRub)}`,
      better: lower(a.quiz.flightRub, b.quiz.flightRub),
    },
    {
      label: 'День в городе',
      value: `≈ ${formatRub(a.quiz.dailyRub)}`,
      better: lower(a.quiz.dailyRub, b.quiz.dailyRub),
    },
    {
      label: 'В пути',
      value: nbsp(a.facts.flight),
      better: lower(a.facts.flightMinutes, b.facts.flightMinutes),
    },
    { label: 'Виза', value: a.facts.visa, better: false },
    {
      label: 'Лучшие месяцы',
      value: a.climate.bestMonths.map((m) => MONTHS_SHORT[m - 1]).join(', '),
      better: false,
    },
  ];
}
