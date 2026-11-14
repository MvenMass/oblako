import { getCities, getCity } from '@/lib/cities';
import { makeFlights, type Flight } from '@/lib/flights';
import { formatTime } from '@/lib/route';
import type { Pass } from '@/types/user';
import type { PassData } from './PassCard';

/** Рейс демо-табло в этот город — номер и выход совпадают с /board */
export function flightTo(cityId: string, nowMin: number): Flight | undefined {
  return makeFlights(getCities(), 'dep', nowMin).find((f) => f.cityId === cityId);
}

const DATE = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' });

export function passData(
  cityId: string,
  seat: string,
  passenger: string,
  nowMin: number,
  issuedAt = new Date(),
): PassData | null {
  const city = getCity(cityId);
  const f = flightTo(cityId, nowMin);
  if (!city || !f) return null;
  return {
    iata: city.iata,
    no: f.no,
    gate: f.gate,
    boarding: formatTime((f.time - 40 + 1440) % 1440),
    seat,
    date: DATE.format(issuedAt).replace('.', ''),
    passenger: passenger.toUpperCase(),
  };
}

export function passDataOf(p: Pass, passenger: string, nowMin: number): PassData | null {
  return passData(p.cityId, p.seat, passenger, nowMin, new Date(p.issuedAt));
}
