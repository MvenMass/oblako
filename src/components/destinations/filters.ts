import type { City, MoodId } from '@/types/city';

export interface DestFilter {
  id: string;
  label: string;
  test: (city: City) => boolean;
}

const mood = (id: MoodId, label: string): DestFilter => ({
  id,
  label,
  test: (c) => c.quiz.moods.includes(id),
});

/** Фильтры направлений: настроение, «на выходные» (перелёт до 3 ч) и регион */
export const FILTERS: DestFilter[] = [
  { id: 'all', label: 'Все', test: () => true },
  mood('sea', 'Море'),
  mood('mountains', 'Горы'),
  mood('city', 'Города'),
  mood('food', 'Еда'),
  mood('history', 'История'),
  mood('exotic', 'Экзотика'),
  { id: 'weekend', label: 'На выходные', test: (c) => c.facts.flightMinutes <= 180 },
  { id: 'russia', label: 'Россия', test: (c) => c.country === 'Россия' },
];

export function applyFilter(cities: City[], filterId: string): City[] {
  const f = FILTERS.find((x) => x.id === filterId) ?? FILTERS[0];
  return cities.filter(f.test);
}
