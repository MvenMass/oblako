import type { City } from '@/types/city';

/** Демо-табло: рейсы выдуманные, авиакомпания условная «OB» */
export type FlightStatus = 'scheduled' | 'checkin' | 'boarding' | 'departed' | 'delayed';
export type BoardMode = 'dep' | 'arr';

export const STATUS_ORDER: FlightStatus[] = [
  'scheduled',
  'checkin',
  'boarding',
  'departed',
  'delayed',
];

export const STATUS_LABEL: Record<BoardMode, Record<FlightStatus, string>> = {
  dep: {
    scheduled: 'По плану',
    checkin: 'Регистрация',
    boarding: 'Посадка',
    departed: 'Вылетел',
    delayed: 'Задержан',
  },
  arr: {
    scheduled: 'По плану',
    checkin: 'В полёте',
    boarding: 'Снижается',
    departed: 'Прибыл',
    delayed: 'Задержан',
  },
};

export interface Flight {
  id: string;
  cityId: string;
  /** Название города заглавными для табло */
  city: string;
  iata: string;
  no: string;
  /** Минуты от полуночи по Москве */
  time: number;
  gate: string;
  minutes: number;
  status: FlightStatus;
}

/** Стабильное число из строки — чтобы номер рейса и выход не прыгали между рендерами */
function hash(s: string): number {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003;
  return h;
}

/** Статус по времени: прошёл — вылетел, ближе 25 мин — посадка, ближе 70 — регистрация */
export function statusAt(time: number, now: number): FlightStatus {
  const d = time - now;
  if (d < -5) return 'departed';
  if (d <= 25) return 'boarding';
  if (d <= 70) return 'checkin';
  return 'scheduled';
}

/** Рейсы вокруг текущего московского времени: один каждые 35 минут, начиная за 20 мин до «сейчас» */
export function makeFlights(cities: City[], mode: BoardMode, nowMin: number): Flight[] {
  const start = Math.floor((nowMin - 20) / 5) * 5;
  return cities.map((c, i) => {
    const h = hash(c.id + mode);
    const time = (((start + i * 35) % 1440) + 1440) % 1440;
    const status = h % 7 === 0 && i > 1 ? 'delayed' : statusAt(start + i * 35, nowMin);
    return {
      id: `${mode}-${c.id}`,
      cityId: c.id,
      city: c.name.toUpperCase(),
      iata: c.iata,
      no: `OB ${100 + (h % 900)}`,
      time,
      gate: `${'ABCDE'[h % 5]}${String((h % 24) + 1).padStart(2, '0')}`,
      minutes: c.facts.flightMinutes,
      status,
    };
  });
}

export function nextStatus(s: FlightStatus): FlightStatus {
  return STATUS_ORDER[(STATUS_ORDER.indexOf(s) + 1) % STATUS_ORDER.length];
}

/** Московское время в минутах от полуночи */
export function moscowMinutes(now: number): number {
  const d = new Date(now + 3 * 3600000);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

export function formatClock(now: number): string {
  const d = new Date(now + 3 * 3600000);
  return [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}

/** Доля пути 0–1 по времени вылета и длительности */
export function flightProgress(f: Flight, nowMin: number): number {
  let d = nowMin - f.time;
  if (d < -720) d += 1440;
  return Math.min(1, Math.max(0, d / f.minutes));
}
