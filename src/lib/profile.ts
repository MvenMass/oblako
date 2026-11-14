import { getCity } from '@/lib/cities';
import type { City } from '@/types/city';
import type { Pass, Trip } from '@/types/user';

/** Средняя скорость лайнера: 13 км в минуту */
export const KM_PER_MIN = 13;

export function initials(name: string): string {
  const parts = name.replace(/[[\]]/g, '').trim().split(/\s+/).filter(Boolean);
  return (
    parts
      .map((p) => p[0])
      .join('')
      .slice(0, 2) || '?'
  ).toUpperCase();
}

export function stampCities(stamps: string[]): City[] {
  return stamps.map((id) => getCity(id)).filter((c): c is City => !!c);
}

export function countriesOf(stamps: string[]): string[] {
  return [...new Set(stampCities(stamps).map((c) => c.country))];
}

/** Км в небе: сумма перелётов по талонам */
export function kmInSky(passes: Pass[]): number {
  return passes.reduce((s, p) => s + (getCity(p.cityId)?.facts.flightMinutes ?? 0) * KM_PER_MIN, 0);
}

export function dishesTried(trips: Trip[]): number {
  return new Set(trips.flatMap((t) => (t.dishes ?? []).map((d) => `${t.cityId}:${d}`))).size;
}

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  /** 0–1 */
  progress: number;
  got: boolean;
}

interface ProfileState {
  stamps: string[];
  passes: Pass[];
  trips: Trip[];
}

const goal = (n: number, of: number) => Math.min(1, n / of);

export function achievementsOf({ stamps, passes, trips }: ProfileState): Achievement[] {
  const countries = countriesOf(stamps).length;
  const mountains = stampCities(stamps).some((c) => c.quiz.moods.includes('mountains'));
  const dishes = dishesTried(trips);
  const list = [
    {
      id: 'first-flight',
      name: 'Первый перелёт',
      desc: 'Оформите первый талон',
      progress: goal(passes.length, 1),
    },
    {
      id: 'five-countries',
      name: '5 стран',
      desc: `Штампы пяти стран · ${countries} из 5`,
      progress: goal(countries, 5),
    },
    { id: 'mountains', name: 'Горы', desc: 'Штамп города в горах', progress: mountains ? 1 : 0 },
    {
      id: 'gourmet',
      name: 'Гурман',
      desc: `20 блюд в дневнике · ${dishes} из 20`,
      progress: goal(dishes, 20),
    },
  ];
  return list.map((a) => ({ ...a, got: a.progress >= 1 }));
}

/** Уровень путешественника: опыт за штампы, поездки и талоны */
export function levelOf({ stamps, passes, trips }: ProfileState) {
  const xp = stamps.length * 120 + trips.length * 80 + passes.length * 40;
  const level = Math.floor(xp / 300) + 1;
  return { level, xp, progress: (xp % 300) / 300, toNext: 300 - (xp % 300) };
}
