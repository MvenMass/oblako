import {
  byCategory,
  cumulative,
  demoExpenses,
  extremes,
  percents,
  planFor,
  toRub,
  totalRub,
} from './budget';
import { getCity } from './cities';
import { DEFAULT_ANSWERS } from './quiz';
import type { Expense } from '@/types/user';

const city = getCity('tbilisi')!;
const e = (id: string, rub: number, day: number, category: Expense['category']): Expense => ({
  id,
  amount: rub,
  currency: 'RUB',
  rub,
  category,
  day,
});
const list = [e('a', 1000, 1, 'food'), e('b', 3000, 1, 'flight'), e('c', 500, 3, 'fun')];

describe('budget', () => {
  it('converts local currency by rate and keeps rubles as is', () => {
    expect(toRub(10, 'GEL', 31.7)).toBe(317);
    expect(toRub(250, 'RUB', 31.7)).toBe(250);
  });

  it('takes the plan from the quiz, otherwise estimates it from city data', () => {
    expect(planFor(city, 7, { ...DEFAULT_ANSWERS, budget: 150 })).toBe(150000);
    const est = planFor(city, 3, null);
    expect(est % 1000).toBe(0);
    expect(est).toBeGreaterThan(city.quiz.flightRub);
  });

  it('sums, splits by category and accumulates by day', () => {
    expect(totalRub(list)).toBe(4500);
    const cats = byCategory(list);
    expect(cats.find((c) => c.id === 'flight')?.share).toBeCloseTo(3000 / 4500);
    expect(cats.reduce((s, c) => s + c.share, 0)).toBeCloseTo(1);
    expect(cumulative(list, 3)).toEqual([4000, 4000, 4500]);
  });

  it('finds the most and the least expensive', () => {
    expect(extremes(list)).toEqual({ max: list[1], min: list[2] });
    expect(extremes([])).toBeNull();
  });

  it('rounds percents to exactly 100', () => {
    expect(percents([1 / 3, 1 / 3, 1 / 3]).reduce((a, b) => a + b)).toBe(100);
    expect(percents([0, 0])).toEqual([0, 0]);
  });

  it('builds demo expenses for every day in rubles and local currency', () => {
    const demo = demoExpenses(city, 4, 30);
    expect(new Set(demo.map((x) => x.day))).toEqual(new Set([1, 2, 3, 4]));
    expect(demo.some((x) => x.currency === city.facts.currency.rateCode)).toBe(true);
    demo.forEach((x) => expect(x.rub).toBe(toRub(x.amount, x.currency, 30)));
  });
});
