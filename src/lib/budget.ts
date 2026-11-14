import type { City } from '@/types/city';
import type { Expense, ExpenseCategory, QuizAnswers } from '@/types/user';

export const CATEGORIES: { id: ExpenseCategory; label: string; color: string }[] = [
  { id: 'flight', label: 'Перелёт', color: 'var(--sky)' },
  { id: 'stay', label: 'Жильё', color: 'var(--pink)' },
  { id: 'food', label: 'Еда', color: 'var(--dusk)' },
  { id: 'fun', label: 'Впечатления', color: 'var(--ink)' },
];

export const categoryLabel = (id: ExpenseCategory) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

const round = (n: number, step: number) => Math.round(n / step) * step;

/** План на поездку, ₽: бюджет из подбора, иначе перелёт + дни × день в городе */
export function planFor(city: City, days: number, quiz: QuizAnswers | null): number {
  if (quiz) return quiz.budget * 1000;
  return round(city.quiz.flightRub + city.quiz.dailyRub * days, 1000);
}

/** Уникальный id траты: время + случайный хвост */
export function newExpenseId(): string {
  return `e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function toRub(amount: number, currency: string, rate: number): number {
  return Math.round(currency === 'RUB' ? amount : amount * rate);
}

export function totalRub(expenses: Expense[]): number {
  return expenses.reduce((s, e) => s + e.rub, 0);
}

/** Доли категорий; сумма долей — 1 (или 0 без трат) */
export function byCategory(expenses: Expense[]) {
  const total = totalRub(expenses);
  return CATEGORIES.map((c) => {
    const rub = totalRub(expenses.filter((e) => e.category === c.id));
    return { ...c, rub, share: total ? rub / total : 0 };
  });
}

/** Накопленные траты к концу каждого дня */
export function cumulative(expenses: Expense[], days: number): number[] {
  let sum = 0;
  return Array.from({ length: days }, (_, i) => {
    sum += totalRub(expenses.filter((e) => e.day === i + 1));
    return sum;
  });
}

export function extremes(expenses: Expense[]): { max: Expense; min: Expense } | null {
  if (!expenses.length) return null;
  const sorted = [...expenses].sort((a, b) => a.rub - b.rub);
  return { min: sorted[0], max: sorted[sorted.length - 1] };
}

/** Проценты без дробей так, чтобы в сумме было ровно 100 */
export function percents(shares: number[]): number[] {
  const raw = shares.map((s) => s * 100);
  const out = raw.map(Math.floor);
  const left = Math.round(raw.reduce((a, b) => a + b, 0)) - out.reduce((a, b) => a + b, 0);
  raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac)
    .slice(0, left)
    .forEach(({ i }) => (out[i] += 1));
  return out;
}

/** «Заполнить примером»: демо-траты по данным города, местные — в валюте города */
export function demoExpenses(city: City, days: number, rate: number): Expense[] {
  const code = city.facts.currency.rateCode;
  const daily = city.quiz.dailyRub;
  const local = (rub: number) => Math.max(1, Math.round(rub / rate));
  const list: Omit<Expense, 'id' | 'rub'>[] = [
    { amount: city.quiz.flightRub, currency: 'RUB', category: 'flight', day: 1 },
    { amount: round(daily * days * 0.45, 100), currency: 'RUB', category: 'stay', day: 1 },
  ];
  for (let d = 1; d <= days; d++) {
    // Еда дешевле в первый и последний день, впечатления — через день
    const k = d === 1 || d === days ? 0.2 : 0.32;
    list.push({ amount: local(daily * k), currency: code, category: 'food', day: d });
    if (d % 2 === 0 || d === 1) {
      list.push({ amount: local(daily * 0.4), currency: code, category: 'fun', day: d });
    }
  }
  return list.map((e, i) => ({ ...e, id: `demo-${i}`, rub: toRub(e.amount, e.currency, rate) }));
}
