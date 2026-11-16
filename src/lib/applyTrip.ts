import { getCity } from '@/lib/cities';
import { defaultRoute } from '@/lib/route';
import { tripCost, TRIP_DAYS } from '@/lib/trip';
import type { UserStore } from '@/store/user';
import type { Expense, TripPlan } from '@/types/user';

const PLAN_PREFIX = 'plan-';

/** Плановые траты поездки: билеты, отель и трансфер — сразу в бюджет */
export function plannedExpenses(plan: TripPlan): Expense[] {
  const city = getCity(plan.cityId);
  if (!city) return [];
  const c = tripCost(plan, city);
  const rows: [string, number, Expense['category']][] = [
    ['flight', c.flights, 'flight'],
    ['stay', c.stay, 'stay'],
    ['transfer', c.transfer, 'fun'],
  ];
  return rows
    .filter(([, rub]) => rub > 0)
    .map(([id, rub, category]) => ({
      id: `${PLAN_PREFIX}${id}`,
      amount: rub,
      currency: 'RUB',
      rub,
      category,
      day: 1,
    }));
}

/**
 * Сохраняет поездку и связывает её с сайтом:
 * бюджет получает план и брони, маршрут — число дней поездки (свои правки не трогаем, если дни совпадают).
 */
export function applyTrip(plan: TripPlan, store: UserStore): void {
  const city = getCity(plan.cityId);
  if (!city) return;
  store.upsertPlan({ ...plan, saved: true });

  const days = Math.min(TRIP_DAYS(plan), 7);
  if (store.route?.cityId !== city.id || store.route.days.length !== days) {
    // Мест может не хватить на все дни — оставшиеся дни пустые, их заполнят в конструкторе
    const route = defaultRoute(city, days);
    while (route.length < days) route.push({ stops: [] });
    store.setRoute(city.id, route);
  }

  const own =
    store.budget?.cityId === city.id
      ? store.budget.expenses.filter((e) => !e.id.startsWith(PLAN_PREFIX))
      : [];
  const budget = plan.budget || tripCost(plan, city).total;
  store.setBudget(city.id, budget, [...plannedExpenses(plan), ...own]);
}
