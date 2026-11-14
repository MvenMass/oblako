// Тексты и цвета подбора поездки. Источник — скрипт docs/design/Quiz.dc.html.
import type { MoodId } from '@/types/city';

/** Цвета сияния для настроения: [первое пятно, второе пятно] */
export const MOOD_COLORS: Record<MoodId, [string, string]> = {
  sea: ['#7FE0E6', '#FFD27F'],
  mountains: ['#9FE3C1', '#9BCBF2'],
  food: ['#F6A6C1', '#E9B9D6'],
  history: ['#F3D49B', '#C3B5FF'],
  city: ['#9BB4FF', '#F7A9D9'],
  exotic: ['#FFB37F', '#7FE0B0'],
};

export const DEFAULT_AURORA: [string, string] = ['#9BDDF2', '#FFB3D6'];

export const STEP_NAMES = ['Настроение', 'Даты', 'Бюджет', 'Подбор', 'Тур'];

export const STEP_TITLES: [string, string][] = [
  ['Чего', 'хочется?'],
  ['Когда и', 'надолго?'],
  ['Бюджет и', 'компания'],
  ['Подбираем', 'тур…'],
  ['Готово:', 'ваш тур'],
];

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export function seasonOf(month: number): Season {
  if (month === 11 || month <= 1) return 'winter';
  if (month <= 4) return 'spring';
  if (month <= 7) return 'summer';
  return 'autumn';
}

export const SEASON_NOTE: Record<Season, string> = {
  winter: 'Горнолыжный Сочи, зимняя Казань и тёплый Вьетнам',
  spring: 'Цветущие Ереван и Тбилиси, мягкий Стамбул',
  summer: 'Море, Алтай и долгие светлые вечера',
  autumn: 'Бархатный сезон, вино и прохладные мегаполисы',
};

export function tripNote(days: number): string {
  if (days <= 4) return 'Короткая поездка — лучше лететь недалеко: Казань, Калининград, Сочи';
  if (days >= 10) return 'Достаточно времени для дальних направлений: Вьетнам, Китай, Занзибар';
  return 'Хватит, чтобы увидеть город и съездить за его пределы на день';
}
