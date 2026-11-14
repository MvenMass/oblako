import type { UserData } from '@/types/user';

export const STORE_KEY = 'oblako:v1';
export const STORE_VERSION = 2;

export function initialUserData(): UserData {
  return {
    favorites: [],
    quiz: { answers: null, result: null },
    route: null,
    routeAdded: {},
    budget: null,
    packing: null,
    booking: { seat: null, shade: false, passes: [] },
    journal: { trips: [] },
    passport: { stamps: [], achievements: [] },
    ui: { boardSound: false },
    profile: { name: '[Имя Фамилия]' },
  };
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Миграция сохранённого состояния: недостающие разделы и поля берутся из initialUserData.
 * Версия 0 — ранний формат без profile/ui и с favorites как объектом { id: true }.
 * Версия 1 — без бюджета: траты начинаются с пустого плана.
 */
export function migrateUserData(persisted: unknown, version: number): UserData {
  const base = initialUserData();
  if (!isObject(persisted)) return base;

  const data = { ...persisted };
  if (version < 1 && isObject(data.favorites)) {
    data.favorites = Object.keys(data.favorites).filter(
      (k) => (data.favorites as Record<string, unknown>)[k],
    );
  }

  if (version < 2) data.budget = null;

  const out = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(base) as (keyof UserData)[]) {
    const def = base[key];
    const value = data[key];
    if (value === undefined) continue;
    out[key] = isObject(def) && isObject(value) ? { ...def, ...value } : value;
  }
  return out as unknown as UserData;
}
