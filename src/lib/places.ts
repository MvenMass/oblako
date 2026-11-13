import type { Place, PlaceCategory } from '@/types/city';

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  see: 'Смотреть',
  eat: 'Есть',
  nature: 'Природа',
  evening: 'Вечером',
};

export const CATEGORY_ORDER: PlaceCategory[] = ['see', 'eat', 'nature', 'evening'];

/** Категории, в которых есть хотя бы одно место */
export function categoriesOf(places: Place[]): PlaceCategory[] {
  return CATEGORY_ORDER.filter((c) => places.some((p) => p.category === c));
}
