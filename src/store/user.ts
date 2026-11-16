import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Expense, Pass, QuizAnswers, RouteDay, Trip, TripPlan, UserData } from '@/types/user';
import { initialUserData, migrateUserData, STORE_KEY, STORE_VERSION } from './initial';

interface UserActions {
  toggleFavorite: (cityId: string) => void;
  setQuiz: (answers: QuizAnswers, result: string | null) => void;
  setRoute: (cityId: string, days: RouteDay[]) => void;
  /** «В маршрут» из галереи города */
  addToRoute: (cityId: string, placeId: string) => void;
  /** Тоггл «В маршрут» в галерее города */
  toggleRoutePlace: (cityId: string, placeId: string) => void;
  /** Новый бюджет поездки (смена города, «Заполнить примером», «Очистить») */
  setBudget: (cityId: string, plan: number, expenses: Expense[]) => void;
  /** Создать или обновить план поездки и сделать его активным */
  upsertPlan: (plan: TripPlan) => void;
  removePlan: (id: string) => void;
  setActivePlan: (id: string | null) => void;
  toggleCheck: (planId: string, itemId: string) => void;
  addExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  setPacked: (cityId: string, itemId: string, packed: boolean) => void;
  /** «Собрать всё» / «Вытряхнуть»: весь набор сразу */
  setPacking: (cityId: string, packed: Record<string, boolean>) => void;
  setSeat: (seat: string | null) => void;
  setShade: (shade: boolean) => void;
  /** Оформленная бронь: талон в кошелёк и штамп страны в паспорт */
  completeBooking: (pass: Pass) => void;
  addTrip: (trip: Trip) => void;
  removeTrip: (tripId: string) => void;
  unlockAchievement: (id: string) => void;
  setBoardSound: (on: boolean) => void;
  setName: (name: string) => void;
  reset: () => void;
}

export type UserStore = UserData & UserActions;

const unique = (list: string[], item: string) => (list.includes(item) ? list : [...list, item]);

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialUserData(),

      toggleFavorite: (cityId) =>
        set((s) => ({
          favorites: s.favorites.includes(cityId)
            ? s.favorites.filter((id) => id !== cityId)
            : [...s.favorites, cityId],
        })),

      setQuiz: (answers, result) => set({ quiz: { answers, result } }),

      setRoute: (cityId, days) => set({ route: { cityId, days } }),

      addToRoute: (cityId, placeId) =>
        set((s) => ({
          routeAdded: { ...s.routeAdded, [cityId]: unique(s.routeAdded[cityId] ?? [], placeId) },
        })),

      toggleRoutePlace: (cityId, placeId) =>
        set((s) => {
          const list = s.routeAdded[cityId] ?? [];
          const next = list.includes(placeId)
            ? list.filter((id) => id !== placeId)
            : [...list, placeId];
          return { routeAdded: { ...s.routeAdded, [cityId]: next } };
        }),

      setBudget: (cityId, plan, expenses) => set({ budget: { cityId, plan, expenses } }),

      upsertPlan: (plan) =>
        set((s) => {
          const exists = s.plans.list.some((p) => p.id === plan.id);
          const list = exists
            ? s.plans.list.map((p) => (p.id === plan.id ? plan : p))
            : [...s.plans.list, plan];
          return { plans: { list, activeId: plan.id } };
        }),

      removePlan: (id) =>
        set((s) => ({
          plans: {
            list: s.plans.list.filter((p) => p.id !== id),
            activeId: s.plans.activeId === id ? null : s.plans.activeId,
          },
        })),

      setActivePlan: (id) => set((s) => ({ plans: { ...s.plans, activeId: id } })),

      toggleCheck: (planId, itemId) =>
        set((s) => ({
          plans: {
            ...s.plans,
            list: s.plans.list.map((p) =>
              p.id === planId
                ? { ...p, checklist: { ...p.checklist, [itemId]: !p.checklist[itemId] } }
                : p,
            ),
          },
        })),

      addExpense: (expense) =>
        set((s) =>
          s.budget ? { budget: { ...s.budget, expenses: [...s.budget.expenses, expense] } } : {},
        ),

      removeExpense: (id) =>
        set((s) =>
          s.budget
            ? { budget: { ...s.budget, expenses: s.budget.expenses.filter((e) => e.id !== id) } }
            : {},
        ),

      setPacked: (cityId, itemId, packed) =>
        set((s) => {
          const prev = s.packing?.cityId === cityId ? s.packing.packed : {};
          return { packing: { cityId, packed: { ...prev, [itemId]: packed } } };
        }),

      setPacking: (cityId, packed) => set({ packing: { cityId, packed } }),

      setSeat: (seat) => set((s) => ({ booking: { ...s.booking, seat } })),

      setShade: (shade) => set((s) => ({ booking: { ...s.booking, shade } })),

      completeBooking: (pass) =>
        set((s) => ({
          booking: { ...s.booking, passes: [...s.booking.passes, pass] },
          passport: { ...s.passport, stamps: unique(s.passport.stamps, pass.cityId) },
        })),

      addTrip: (trip) => set((s) => ({ journal: { trips: [...s.journal.trips, trip] } })),

      removeTrip: (tripId) =>
        set((s) => ({ journal: { trips: s.journal.trips.filter((t) => t.id !== tripId) } })),

      unlockAchievement: (id) =>
        set((s) => ({
          passport: { ...s.passport, achievements: unique(s.passport.achievements, id) },
        })),

      setBoardSound: (on) => set((s) => ({ ui: { ...s.ui, boardSound: on } })),

      setName: (name) => set({ profile: { name } }),

      reset: () => set(initialUserData()),
    }),
    {
      name: STORE_KEY,
      version: STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted, version) => migrateUserData(persisted, version),
      // При совпадении версий тоже достраиваем недостающие поля
      merge: (persisted, current) => ({ ...current, ...migrateUserData(persisted, STORE_VERSION) }),
    },
  ),
);
