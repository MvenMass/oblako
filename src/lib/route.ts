// Маршрут по дням: чистые функции без React. Время в пути — оценка по схеме города.
import type { City, Place } from '@/types/city';
import type { RouteDay, Stop } from '@/types/user';

/** Масштаб схемы place.map (440×300): ≈ 8 м на единицу — старый центр в 3–4 км */
const KM_PER_UNIT = 0.008;
const WALK_KMH = 5;
export const DAY_START_MIN = 10 * 60;
/** Рассвет и закат — демо: в данных городов их нет */
export const SUNRISE = 6 * 60 + 50;
export const SUNSET = 19 * 60 + 20;
const DEFAULT_STOP_MIN = 90;

/** Сколько минут на точке из строки вида «1–1,5 ч», «30 мин», «2–3 ч» */
export function durationMinutes(text: string): number {
  const nums = (text.match(/\d+(?:,\d+)?/g) ?? []).map((n) => Number(n.replace(',', '.')));
  if (!nums.length) return DEFAULT_STOP_MIN;
  const value = Math.max(...nums);
  return Math.round(/мин/.test(text) && !/ч/.test(text) ? value : value * 60);
}

export function distanceKm(a: Place, b: Place): number {
  return Math.hypot(a.map.x - b.map.x, a.map.y - b.map.y) * KM_PER_UNIT;
}

export function walkMinutes(km: number): number {
  return Math.max(3, Math.round((km / WALK_KMH) * 60));
}

export function placeById(city: City, id: string): Place | undefined {
  return city.places.find((p) => p.id === id);
}

/** Маршрут по умолчанию: места города по 2–3 в день */
export function defaultRoute(city: City, days = 3): RouteDay[] {
  const perDay = Math.max(2, Math.ceil(city.places.length / days));
  return Array.from({ length: days }, (_, d) => ({
    stops: city.places.slice(d * perDay, d * perDay + perDay).map((p) => ({
      placeId: p.id,
      minutes: durationMinutes(p.duration),
    })),
  })).filter((d) => d.stops.length);
}

export interface ScheduledStop {
  stop: Stop;
  place: Place;
  /** Минуты от полуночи */
  arrive: number;
  leave: number;
  /** Пешком до следующей точки */
  walkNext: number | null;
  kmNext: number | null;
}

/** Расписание дня: старт в 10:00, между точками — дорога пешком */
export function schedule(city: City, day: RouteDay): ScheduledStop[] {
  const out: ScheduledStop[] = [];
  let t = DAY_START_MIN;
  const places = day.stops.map((s) => placeById(city, s.placeId));
  day.stops.forEach((stop, i) => {
    const place = places[i];
    if (!place) return;
    const next = places[i + 1];
    const km = next ? distanceKm(place, next) : null;
    const walk = km === null ? null : walkMinutes(km);
    out.push({ stop, place, arrive: t, leave: t + stop.minutes, walkNext: walk, kmNext: km });
    t += stop.minutes + (walk ?? 0);
  });
  return out;
}

export function dayTotals(items: ScheduledStop[]) {
  const km = items.reduce((s, x) => s + (x.kmNext ?? 0), 0);
  const walk = items.reduce((s, x) => s + (x.walkNext ?? 0), 0);
  const end = items.length ? items[items.length - 1].leave : DAY_START_MIN;
  return { km, walk, end, count: items.length };
}

export function formatTime(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = Math.round(min % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Переставить элемент: from → to */
export function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const out = [...list];
  const [item] = out.splice(from, 1);
  out.splice(to, 0, item);
  return out;
}

/** «Оптимизировать порядок»: от первой точки к ближайшей непосещённой */
export function optimize(city: City, stops: Stop[]): Stop[] {
  if (stops.length < 3) return stops;
  const rest = [...stops.slice(1)];
  const out = [stops[0]];
  while (rest.length) {
    const last = placeById(city, out[out.length - 1].placeId);
    let best = 0;
    let bestKm = Infinity;
    rest.forEach((s, i) => {
      const p = placeById(city, s.placeId);
      const km = last && p ? distanceKm(last, p) : Infinity;
      if (km < bestKm) {
        bestKm = km;
        best = i;
      }
    });
    out.push(rest.splice(best, 1)[0]);
  }
  return out;
}
