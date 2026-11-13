import type { MoodId } from './city';

export type Company = 'solo' | 'pair' | 'family' | 'friends';

export interface QuizAnswers {
  moods: MoodId[];
  /** 0–11 */
  month: number;
  /** 3–14 */
  days: number;
  /** тыс. ₽ на человека, 30–300 */
  budget: number;
  company: Company;
}

export interface Stop {
  /** id места из city.places */
  placeId: string;
  /** Сколько минут на точке */
  minutes: number;
}

export interface RouteDay {
  stops: Stop[];
}

export interface Pass {
  id: string;
  cityId: string;
  seat: string;
  /** ISO-дата оформления */
  issuedAt: string;
}

export interface Trip {
  id: string;
  cityId: string;
  title: string;
  /** ISO-дата */
  date: string;
  /** Ключи фото в IndexedDB */
  photoIds: string[];
}

export interface UserData {
  favorites: string[];
  quiz: { answers: QuizAnswers | null; result: string | null };
  route: { cityId: string; days: RouteDay[] } | null;
  /** cityId → id мест, добавленных из галереи «В маршрут» */
  routeAdded: Record<string, string[]>;
  packing: { cityId: string; packed: Record<string, boolean> } | null;
  booking: { seat: string | null; shade: boolean; passes: Pass[] };
  journal: { trips: Trip[] };
  passport: { stamps: string[]; achievements: string[] };
  ui: { boardSound: boolean; reducedMotionOverride?: boolean };
  profile: { name: string };
}
