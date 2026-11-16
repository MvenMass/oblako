import { getCity } from '@/lib/cities';
import type { City } from '@/types/city';
import type { TripPlan } from '@/types/user';

/* Всё ниже — демо: рейсы, отели и трансферы вымышленные, цены ориентировочные */

export interface FlightOption {
  id: string;
  label: string;
  no: string;
  /** Минуты от полуночи по Москве */
  dep: number;
  minutes: number;
  stops: number;
  /** ₽ на человека в одну сторону */
  price: number;
}

export interface HotelOption {
  id: string;
  name: string;
  kind: string;
  district: string;
  photo: string;
  /** ₽ за ночь за номер */
  night: number;
  center: string;
  rating: number;
}

export interface TransferOption {
  id: string;
  name: string;
  text: string;
  minutes: number;
  /** ₽ в одну сторону на всю компанию */
  price: number;
}

const round = (n: number, step = 100) => Math.round(n / step) * step;

function hash(s: string): number {
  let h = 11;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003;
  return h;
}

/** Три варианта перелёта: утренний прямой, вечерний прямой, с пересадкой */
export function flightOptions(city: City, dir: 'out' | 'back'): FlightOption[] {
  const one = city.quiz.flightRub / 2;
  const h = hash(city.id + dir);
  const base = city.facts.flightMinutes;
  return [
    {
      id: `${dir}-am`,
      label: 'Утренний, прямой',
      no: `OB ${100 + (h % 400)}`,
      dep: 7 * 60 + 40,
      minutes: base,
      stops: 0,
      price: round(one * 1.15),
    },
    {
      id: `${dir}-pm`,
      label: 'Вечерний, прямой',
      no: `OB ${500 + (h % 400)}`,
      dep: 19 * 60 + 15,
      minutes: base,
      stops: 0,
      price: round(one),
    },
    {
      id: `${dir}-hop`,
      label: 'С пересадкой',
      no: `OB ${900 + (h % 90)}`,
      dep: 11 * 60 + 5,
      minutes: base + 150,
      stops: 1,
      price: round(one * 0.78),
    },
  ];
}

/** Три вымышленных отеля: районы и фото — из данных города */
export function hotelOptions(city: City): HotelOption[] {
  const p = city.places;
  const d = city.quiz.dailyRub;
  const pick = (i: number) => p[i % p.length];
  return [
    {
      id: 'eco',
      name: `Гостевой дом «${city.name}‑центр»`,
      kind: 'Эконом',
      district: pick(1).district,
      photo: pick(1).photo,
      night: round(d * 0.35),
      center: '1,5 км до центра',
      rating: 8.4,
    },
    {
      id: 'mid',
      name: 'Отель «Панорама»',
      kind: 'Средний',
      district: pick(0).district,
      photo: pick(0).photo,
      night: round(d * 0.6),
      center: 'в центре',
      rating: 8.9,
    },
    {
      id: 'boutique',
      name: 'Бутик-отель «Облако»',
      kind: 'Бутик',
      district: pick(3).district,
      photo: pick(3).photo,
      night: round(d * 1.05),
      center: '600 м до центра',
      rating: 9.4,
    },
  ];
}

export function transferOptions(city: City): TransferOption[] {
  const d = city.quiz.dailyRub;
  return [
    {
      id: 'public',
      name: 'Общественный транспорт',
      text: 'Экспресс или автобус от аэропорта',
      minutes: 60,
      price: round(d * 0.08),
    },
    {
      id: 'taxi',
      name: 'Такси',
      text: 'По счётчику или в приложении',
      minutes: 35,
      price: round(d * 0.3),
    },
    {
      id: 'hotel',
      name: 'Трансфер от отеля',
      text: 'Водитель с табличкой в зале прилёта',
      minutes: 40,
      price: round(d * 0.45),
    },
  ];
}

export interface TripCost {
  flights: number;
  stay: number;
  transfer: number;
  /** Еда, впечатления и транспорт в городе */
  daily: number;
  total: number;
}

/** Стоимость поездки на всю компанию */
export function tripCost(plan: TripPlan, city: City): TripCost {
  const out = flightOptions(city, 'out').find((f) => f.id === plan.outId);
  const back = flightOptions(city, 'back').find((f) => f.id === plan.backId);
  const hotel = hotelOptions(city).find((h) => h.id === plan.hotelId);
  const transfer = transferOptions(city).find((t) => t.id === plan.transferId);
  const rooms = Math.ceil(plan.people / 2);
  const flights = ((out?.price ?? 0) + (back?.price ?? 0)) * plan.people;
  const stay = (hotel?.night ?? 0) * plan.nights * rooms;
  const tr = (transfer?.price ?? 0) * 2;
  const daily = round(city.quiz.dailyRub * 0.45 * (plan.nights + 1) * plan.people, 500);
  return { flights, stay, transfer: tr, daily, total: flights + stay + tr + daily };
}

const DAY = 86400000;

export const addDays = (iso: string, n: number) =>
  new Date(Date.parse(`${iso}T12:00:00Z`) + n * DAY).toISOString().slice(0, 10);

/** Сколько дней до вылета (0 — сегодня, отрицательное — уже были) */
export function daysUntil(iso: string, now: number): number {
  const today = new Date(now).toISOString().slice(0, 10);
  return Math.round((Date.parse(`${iso}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / DAY);
}

export const TRIP_DAYS = (plan: TripPlan) => plan.nights + 1;

export function newPlanId(): string {
  return `plan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Чек-лист «перед вылетом»: за сколько дней до вылета и что сделать */
export const CHECKLIST: { id: string; days: number; text: string }[] = [
  { id: 'insurance', days: 14, text: 'Оформить страховку на даты поездки' },
  { id: 'docs', days: 10, text: 'Проверить срок паспорта и визу' },
  { id: 'money', days: 5, text: 'Карта или наличные в местной валюте' },
  { id: 'weather', days: 3, text: 'Посмотреть прогноз и собрать чемодан' },
  { id: 'checkin', days: 1, text: 'Онлайн-регистрация и посадочный талон' },
];

/** Календарь .ics: вылет, обратный рейс и проживание */
export function tripIcs(plan: TripPlan): string {
  const city = getCity(plan.cityId);
  if (!city) return '';
  const out = flightOptions(city, 'out').find((f) => f.id === plan.outId);
  const back = flightOptions(city, 'back').find((f) => f.id === plan.backId);
  const hotel = hotelOptions(city).find((h) => h.id === plan.hotelId);
  const end = addDays(plan.dateFrom, plan.nights);
  const ymd = (iso: string) => iso.replace(/-/g, '');
  // Время рейсов — московское (UTC+3), в файле пишем в UTC
  const at = (iso: string, min: number) => {
    const t = Date.parse(`${iso}T00:00:00Z`) + (min - 180) * 60000;
    return new Date(t).toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  };
  const ev = (uid: string, start: string, finish: string, summary: string, allDay = false) =>
    [
      'BEGIN:VEVENT',
      `UID:${plan.id}-${uid}@oblako`,
      `DTSTAMP:${at(plan.dateFrom, 0)}`,
      allDay ? `DTSTART;VALUE=DATE:${start}` : `DTSTART:${start}`,
      allDay ? `DTEND;VALUE=DATE:${finish}` : `DTEND:${finish}`,
      `SUMMARY:${summary}`,
      'END:VEVENT',
    ].join('\r\n');
  const events = [
    out &&
      ev(
        'out',
        at(plan.dateFrom, out.dep),
        at(plan.dateFrom, out.dep + out.minutes),
        `Вылет Москва → ${city.name} (${out.no}, демо)`,
      ),
    back &&
      ev(
        'back',
        at(end, back.dep),
        at(end, back.dep + back.minutes),
        `Вылет ${city.name} → Москва (${back.no}, демо)`,
      ),
    hotel && ev('hotel', ymd(plan.dateFrom), ymd(end), `${hotel.name}, ${city.name} (демо)`, true),
  ].filter(Boolean);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OBLAKO//trip//RU',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

export const todayIso = (now = Date.now()) => new Date(now).toISOString().slice(0, 10);

/** Черновик поездки: даты через месяц, длительность и бюджет — из подбора, если он был */
export function draftPlan(
  cityId: string,
  quiz: { days: number; budget: number } | null,
  now = Date.now(),
): TripPlan {
  const people = 2;
  return {
    id: newPlanId(),
    cityId,
    dateFrom: addDays(todayIso(now), 30),
    nights: Math.max(2, Math.min(14, (quiz?.days ?? 6) - 1)),
    people,
    budget: quiz ? quiz.budget * 1000 * people : 0,
    outId: null,
    backId: null,
    hotelId: null,
    transferId: null,
    checklist: {},
    saved: false,
    createdAt: todayIso(now),
  };
}
