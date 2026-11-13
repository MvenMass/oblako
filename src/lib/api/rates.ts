import type { City } from '@/types/city';
import { fetchJson, readCache, writeCache } from './cache';

export type RateSource = 'cbr' | 'cache' | 'demo';

export interface Rate {
  code: string;
  /** Рублей за 1 единицу валюты */
  rub: number;
  /** Дата курса ЦБ (ISO) или null для демо */
  date: string | null;
  source: RateSource;
}

interface CbrResponse {
  Date: string;
  Valute: Record<string, { Nominal: number; Value: number }>;
}

interface StoredRates {
  date: string;
  rub: Record<string, number>;
}

const API = 'https://www.cbr-xml-daily.ru/daily_json.js';
const TTL = 12 * 60 * 60 * 1000;
const KEY = 'rates';

function storage(): Storage | null {
  return typeof localStorage === 'undefined' ? null : localStorage;
}

let inflight: Promise<StoredRates | null> | null = null;

/** Все курсы ЦБ: свежий кэш → сеть → null. Параллельные вызовы делят один запрос. */
async function loadRates(): Promise<StoredRates | null> {
  const store = storage();
  const fresh = store && readCache<StoredRates>(store, KEY, TTL);
  if (fresh) return fresh;

  inflight ??= fetchJson<CbrResponse>(API)
    .then((data) => {
      const rub: Record<string, number> = {};
      for (const [code, v] of Object.entries(data.Valute)) rub[code] = v.Value / v.Nominal;
      const value = { date: data.Date, rub };
      if (store) writeCache(store, KEY, value);
      return value;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/**
 * Курс валюты города. Цепочка фолбэков: ЦБ → последний сохранённый курс → demoRateRub.
 * Для RUB возвращает null — чип курса не показываем.
 */
export async function getRate(currency: City['facts']['currency']): Promise<Rate | null> {
  const code = currency.rateCode;
  if (code === 'RUB') return null;

  const live = await loadRates();
  if (live?.rub[code]) return { code, rub: live.rub[code], date: live.date, source: 'cbr' };

  const store = storage();
  const stale = store && readCache<StoredRates>(store, KEY);
  if (stale?.rub[code]) return { code, rub: stale.rub[code], date: stale.date, source: 'cache' };

  return { code, rub: currency.demoRateRub, date: null, source: 'demo' };
}

/** Подпись под курсом */
export function rateCaption(rate: Rate): string {
  if (rate.source === 'demo' || !rate.date) return 'демо-курс';
  const d = new Date(rate.date);
  const date = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  return `ЦБ РФ на ${date}`;
}

/** Только для тестов */
export function resetRatesForTests(): void {
  inflight = null;
}
