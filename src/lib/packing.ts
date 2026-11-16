import type { DayForecast } from '@/lib/api/weather';
import type { City } from '@/types/city';

type Pt = [x: number, y: number, rot: number];

export interface PackItem {
  id: string;
  name: string;
  /** Документы и техника — в сетку крышки, одежда — в корпус */
  zone: 'lid' | 'body';
  kg: number;
  /** Положение на полу и в чемодане, сцена 1232×720 */
  floor: Pt;
  slot: Pt;
}

export const ITEMS: PackItem[] = [
  {
    id: 'passport',
    name: 'Паспорт',
    zone: 'lid',
    kg: 0.1,
    floor: [120, 120, -8],
    slot: [420, 262, 0],
  },
  {
    id: 'insurance',
    name: 'Страховка',
    zone: 'lid',
    kg: 0,
    floor: [252, 112, 6],
    slot: [530, 258, -4],
  },
  {
    id: 'card',
    name: 'Банковская карта',
    zone: 'lid',
    kg: 0,
    floor: [112, 258, -12],
    slot: [432, 352, 8],
  },
  {
    id: 'charger',
    name: 'Зарядка',
    zone: 'lid',
    kg: 0.2,
    floor: [246, 268, 4],
    slot: [540, 356, 0],
  },
  {
    id: 'powerbank',
    name: 'Пауэрбанк',
    zone: 'lid',
    kg: 0.3,
    floor: [118, 404, 10],
    slot: [430, 452, 0],
  },
  {
    id: 'headphones',
    name: 'Наушники',
    zone: 'lid',
    kg: 0.1,
    floor: [250, 412, -6],
    slot: [538, 458, 0],
  },
  {
    id: 'toothbrush',
    name: 'Зубная щётка',
    zone: 'lid',
    kg: 0.05,
    floor: [128, 560, -24],
    slot: [486, 548, 90],
  },
  {
    id: 'cream',
    name: 'Солнцезащитный крем',
    zone: 'body',
    kg: 0.2,
    floor: [284, 566, 12],
    slot: [842, 548, 0],
  },
  {
    id: 'tees',
    name: 'Футболки ×5',
    zone: 'body',
    kg: 1,
    floor: [1000, 118, 6],
    slot: [690, 262, 0],
  },
  {
    id: 'jacket',
    name: 'Лёгкая куртка',
    zone: 'body',
    kg: 0.7,
    floor: [1140, 138, -8],
    slot: [806, 266, 0],
  },
  {
    id: 'trousers',
    name: 'Одежда, закрывающая колени',
    zone: 'body',
    kg: 0.6,
    floor: [990, 296, -4],
    slot: [690, 366, 0],
  },
  {
    id: 'scarf',
    name: 'Платок для храмов',
    zone: 'body',
    kg: 0.1,
    floor: [1142, 302, 10],
    slot: [806, 372, 0],
  },
  {
    id: 'shoes',
    name: 'Удобная обувь',
    zone: 'body',
    kg: 1.1,
    floor: [1062, 456, -6],
    slot: [746, 470, 0],
  },
  { id: 'aid', name: 'Аптечка', zone: 'body', kg: 0.3, floor: [980, 604, 8], slot: [664, 548, 0] },
  {
    id: 'umbrella',
    name: 'Компактный зонт',
    zone: 'body',
    kg: 0.4,
    floor: [1132, 600, -30],
    slot: [752, 548, 90],
  },
];

export const BASE_KG = 3.2;
export const LIMIT_KG = 23;
/** Ремни застёгиваются, когда уложено больше этого числа вещей */
export const STRAP_AFTER = 6;

/** Группы списка: что точно нужно, одежда, техника; советы погоды и обычаев — отдельно */
export type PackGroup = 'must' | 'clothes' | 'tech';

export const GROUP_OF: Record<string, PackGroup> = {
  passport: 'must',
  insurance: 'must',
  card: 'must',
  aid: 'must',
  toothbrush: 'must',
  cream: 'must',
  charger: 'tech',
  powerbank: 'tech',
  headphones: 'tech',
  tees: 'clothes',
  jacket: 'clothes',
  trousers: 'clothes',
  scarf: 'clothes',
  shoes: 'clothes',
  umbrella: 'clothes',
};

export const GROUP_LABEL: Record<PackGroup, string> = {
  must: 'Обязательно',
  clothes: 'Одежда и обувь',
  tech: 'Техника',
};

/** Своя вещь из формы: название и вес */
export interface CustomItem {
  id: string;
  name: string;
  kg: number;
}

/** Лимит багажа по тарифу */
export const LIMITS = [
  { kg: 10, label: 'Ручная кладь, 10 кг' },
  { kg: 23, label: 'Багаж, 23 кг' },
];

/** Футболок — по числу дней, но не больше недели: дальше стирка */
export const teesCount = (days: number) => Math.min(7, Math.max(2, days));

export const itemName = (it: PackItem, days: number) =>
  it.id === 'tees' ? `Футболки ×${teesCount(days)}` : it.name;

export const itemKg = (it: PackItem, days: number) =>
  it.id === 'tees' ? +(0.2 * teesCount(days)).toFixed(2) : it.kg;

export function weight(
  packed: Record<string, boolean>,
  days = 5,
  custom: CustomItem[] = [],
): number {
  const base = ITEMS.reduce((s, it) => s + (packed[it.id] ? itemKg(it, days) : 0), BASE_KG);
  return custom.reduce((s, c) => s + (packed[c.id] ? c.kg : 0), base);
}

export function newItemId(): string {
  return `own-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

// Храмы и мечети, куда нужны закрытые колени / платок
const COVER_KNEES = ['istanbul', 'zanzibar', 'tbilisi', 'yerevan', 'kazan'];
const SCARF = ['istanbul', 'zanzibar', 'tbilisi', 'kazan'];

/** Без сети — неделя по среднему климату месяца */
export function climateWeek(city: City, month: number, from?: string): DayForecast[] {
  const max = city.climate.avgHighC[month];
  const start = from ? new Date(`${from}T12:00:00Z`) : new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start.getTime() + i * 86400000);
    return {
      date: d.toISOString().slice(0, 10),
      maxC: max,
      minC: max - 8,
      precipitation: 0,
      kind: 'sun' as const,
    };
  });
}

/** Советы «что взять» по прогнозу и культуре города; причина — для подписи */
export function tipsFor(city: City, week: DayForecast[]): Record<string, string> {
  const tips: Record<string, string> = {};
  const hot = Math.max(...week.map((d) => d.maxC));
  const cold = Math.min(...week.map((d) => d.minC));
  const rainy = week.some((d) => d.precipitation >= 50 || d.kind === 'rain' || d.kind === 'storm');
  if (hot >= 20) tips.cream = `до +${hot}° — солнце активное`;
  if (cold <= 14) tips.jacket = `вечером до ${cold > 0 ? '+' : ''}${cold}°`;
  if (rainy) tips.umbrella = 'в прогнозе дождь';
  if (COVER_KNEES.includes(city.id)) tips.trousers = 'в храмах просят закрыть колени';
  if (SCARF.includes(city.id)) tips.scarf = 'пригодится в храмах и мечетях';
  return tips;
}

/** Подпись кнопки вещи: что это, совет и что сделает нажатие */
export function itemLabel(name: string, on: boolean, tip?: string) {
  // Видимый текст кнопки («название» + бейдж «совет») идёт в начале подписи — так требует WCAG 2.5.3
  const action = on ? 'в чемодане, нажмите, чтобы достать' : 'на полу, нажмите, чтобы уложить';
  return tip ? `${name} — совет: ${tip}. Сейчас ${action}` : `${name}: ${action}`;
}
