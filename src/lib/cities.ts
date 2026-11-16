import type { CitiesIndex, City } from '@/types/city';
import indexJson from '@/data/cities/index.json';
import creditsJson from '@/data/photo-credits.json';

const modules = import.meta.glob<City>(['../data/cities/*.json', '!../data/cities/index.json'], {
  eager: true,
  import: 'default',
});

export const citiesIndex = indexJson as CitiesIndex;

const byId: Record<string, City> = {};
for (const city of Object.values(modules)) byId[city.id] = city;

/** Все направления в порядке index.order */
export function getCities(): City[] {
  return citiesIndex.order.map((id) => byId[id]).filter(Boolean);
}

export function getCity(id: string | undefined): City | undefined {
  return id ? byId[id] : undefined;
}

export function isHit(id: string): boolean {
  return citiesIndex.hits.includes(id);
}

export interface PhotoCredit {
  pexelsId: number;
  page: string;
  license: string;
}

const credits = creditsJson as Record<string, PhotoCredit>;

/** Кредит фото по ключу «город/место» */
export function getPhotoCredit(cityId: string, key: string): PhotoCredit | undefined {
  return credits[`${cityId}/${key}`];
}

/** Неразрывный пробел между числом и единицей: «2 ч», «23 кг», «35 000 ₽» */
export function nbsp(text: string): string {
  return text.replace(/(\d) (?=[\d\p{L}₽$€%°])/gu, '$1 ');
}

/** Рубли с разрядами: 35000 → «35 000 ₽» */
export function formatRub(value: number): string {
  const digits = String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${digits} ₽`;
}

/** Неделя на одного: перелёт + 7 дней в городе (демо) */
export const weekCost = (c: City) => c.quiz.flightRub + c.quiz.dailyRub * 7;
