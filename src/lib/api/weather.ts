import { fetchJson, readCache, writeCache } from './cache';

export type WeatherKind = 'sun' | 'cloud' | 'rain' | 'snow' | 'storm';

export interface CurrentWeather {
  tempC: number;
  kind: WeatherKind;
}

export interface DayForecast {
  date: string;
  maxC: number;
  minC: number;
  precipitation: number;
  kind: WeatherKind;
}

const API = 'https://api.open-meteo.com/v1/forecast';
const TTL = 30 * 60 * 1000;

/** WMO weather_code → вид иконки */
export function weatherKind(code: number): WeatherKind {
  if (code >= 95) return 'storm';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if (code >= 2) return 'cloud';
  return 'sun';
}

interface Coords {
  lat: number;
  lon: number;
}

interface CurrentResponse {
  current: { temperature_2m: number; weather_code: number };
}

interface DailyResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
    weather_code: number[];
  };
}

function storage(): Storage | null {
  return typeof sessionStorage === 'undefined' ? null : sessionStorage;
}

/** Текущая погода. null — нет связи с Open-Meteo (интерфейс показывает «—») */
export async function getCurrentWeather(
  { lat, lon }: Coords,
  signal?: AbortSignal,
): Promise<CurrentWeather | null> {
  const key = `weather:now:${lat},${lon}`;
  const store = storage();
  const cached = store && readCache<CurrentWeather>(store, key, TTL);
  if (cached) return cached;

  try {
    const url = `${API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    const { current } = await fetchJson<CurrentResponse>(url, signal);
    const value = {
      tempC: Math.round(current.temperature_2m),
      kind: weatherKind(current.weather_code),
    };
    if (store) writeCache(store, key, value);
    return value;
  } catch {
    return null;
  }
}

/** Прогноз на 7 дней — для сборов */
export async function getForecast(
  { lat, lon }: Coords,
  signal?: AbortSignal,
): Promise<DayForecast[] | null> {
  const key = `weather:week:${lat},${lon}`;
  const store = storage();
  const cached = store && readCache<DayForecast[]>(store, key, TTL);
  if (cached) return cached;

  try {
    const url =
      `${API}?latitude=${lat}&longitude=${lon}&timezone=auto` +
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code';
    const { daily } = await fetchJson<DailyResponse>(url, signal);
    const value = daily.time.map((date, i) => ({
      date,
      maxC: Math.round(daily.temperature_2m_max[i]),
      minC: Math.round(daily.temperature_2m_min[i]),
      precipitation: daily.precipitation_probability_max[i] ?? 0,
      kind: weatherKind(daily.weather_code[i]),
    }));
    if (store) writeCache(store, key, value);
    return value;
  } catch {
    return null;
  }
}
