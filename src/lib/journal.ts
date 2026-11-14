import { getCity } from '@/lib/cities';
import type { City, Place } from '@/types/city';
import type { Trip } from '@/types/user';

/** «в Тбилиси», «на Алтае» — для воспоминаний и паспорта */
const WHERE: Record<string, string> = {
  tbilisi: 'в Тбилиси',
  istanbul: 'в Стамбуле',
  kazan: 'в Казани',
  yerevan: 'в Ереване',
  sochi: 'в Сочи',
  beijing: 'в Пекине',
  shanghai: 'в Шанхае',
  hanoi: 'в Ханое',
  zanzibar: 'на Занзибаре',
  altai: 'на Алтае',
  kaliningrad: 'в Калининграде',
};

export const whereIn = (cityId: string, fallback: string) => WHERE[cityId] ?? `в ${fallback}`;

export const DEMO_TRIP_ID = 'demo-tbilisi';
const DAY = 86400000;

/** Демо-поездка из фото Тбилиси — год назад, не сохраняется в store */
export function demoTrip(now: number): Trip {
  const city = getCity('tbilisi')!;
  const date = new Date(now - 365 * DAY - 4 * DAY);
  return {
    id: DEMO_TRIP_ID,
    cityId: city.id,
    title: 'Тбилиси, осень',
    date: date.toISOString().slice(0, 10),
    photoIds: city.places.map((p) => `demo:${p.id}`),
    dishes: city.dishes.slice(0, 3).map((d) => d.name),
  };
}

/** Все поездки для дневника: пользовательские по дате + демо в конце */
export function journalTrips(trips: Trip[], now: number): Trip[] {
  return [...trips].sort((a, b) => b.date.localeCompare(a.date)).concat(demoTrip(now));
}

/** «Год назад»: поездка, ближайшая к дате ровно год назад (в пределах ±60 дней) */
export function memoryOf(trips: Trip[], now: number): { trip: Trip; days: number } | null {
  const target = now - 365 * DAY;
  let best: { trip: Trip; days: number } | null = null;
  for (const t of trips) {
    const diff = Math.round((Date.parse(t.date) - target) / DAY);
    if (Math.abs(diff) <= 60 && (!best || Math.abs(diff) < Math.abs(best.days))) {
      best = { trip: t, days: diff };
    }
  }
  return best;
}

export interface TripPhoto {
  id: string;
  /** Место города: подпись и точка на схеме. Для своих фото — по порядку съёмки. */
  place: Place;
  /** Путь к демо-фото или null — тогда берём из IndexedDB */
  demoSrc: string | null;
}

export function tripPhotos(trip: Trip): TripPhoto[] {
  const city = getCity(trip.cityId);
  if (!city?.places.length) return [];
  return trip.photoIds.map((id, i) => {
    const demoPlace = id.startsWith('demo:')
      ? city.places.find((p) => `demo:${p.id}` === id)
      : null;
    const place = demoPlace ?? city.places[i % city.places.length];
    return { id, place, demoSrc: demoPlace ? demoPlace.photo : null };
  });
}

/** Линия по точкам в порядке съёмки — сглаженная кривая в поле 640×340 */
export function photoPath(
  city: City,
  photos: TripPhoto[],
): { d: string; pts: { x: number; y: number }[] } {
  const xs = city.places.map((p) => p.map.x);
  const ys = city.places.map((p) => p.map.y);
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
  const k = Math.min(
    540 / Math.max(Math.max(...xs) - x0, 1),
    240 / Math.max(Math.max(...ys) - y0, 1),
  );
  const pts = photos.map((p) => ({
    x: 50 + (p.place.map.x - x0) * k,
    y: 50 + (p.place.map.y - y0) * k,
  }));
  const d = pts.reduce((acc, p, i) => {
    if (!i) return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    const a = pts[i - 1];
    return `${acc} Q${((a.x + p.x) / 2).toFixed(1)} ${((a.y + p.y) / 2 - 40).toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }, '');
  return { d, pts };
}

const MONTHS = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' });
export const formatTripDate = (iso: string) => MONTHS.format(new Date(`${iso}T12:00:00`));

/** Уникальный id поездки: время + случайный хвост */
export function newTripId(): string {
  return `trip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
