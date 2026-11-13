import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Pass, QuizAnswers, RouteDay, Trip, UserData } from '@/types/user';
import { initialUserData, migrateUserData, STORE_KEY, STORE_VERSION } from './initial';

interface UserActions {
  toggleFavorite: (cityId: string) => void;
  setQuiz: (answers: QuizAnswers, result: string | null) => void;
  setRoute: (cityId: string, days: RouteDay[]) => void;
  /** «В маршрут» из галереи города */
  addToRoute: (cityId: string, placeId: string) => void;
  /** Тоггл «В маршрут» в галерее города */
  toggleRoutePlace: (cityId: string, placeId: string) => void;
  setPacked: (cityId: string, itemId: string, packed: boolean) => void;
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

      setPacked: (cityId, itemId, packed) =>
        set((s) => {
          const prev = s.packing?.cityId === cityId ? s.packing.packed : {};
          return { packing: { cityId, packed: { ...prev, [itemId]: packed } } };
        }),

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
