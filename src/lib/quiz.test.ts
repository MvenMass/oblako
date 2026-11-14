import { getCities, getCity } from './cities';
import {
  budgetSplit,
  companyFromPeople,
  DEFAULT_ANSWERS,
  eliminationPhase,
  rankCities,
  reasons,
  scoreCity,
} from './quiz';
import type { QuizAnswers } from '@/types/user';

const answers = (patch: Partial<QuizAnswers>): QuizAnswers => ({ ...DEFAULT_ANSWERS, ...patch });
const label = (id: string) => id;

describe('scoreCity', () => {
  it('follows the formula from data.md', () => {
    // Тбилиси: food — совпадает, сезон в мае, 25000 + 6000×7 = 67000 ≤ 120000, пара — бонус, не хит
    const m = scoreCity(
      getCity('tbilisi')!,
      answers({ moods: ['food'], month: 4, days: 7, budget: 120, company: 'pair' }),
    );
    expect(m.mood).toBe(1);
    expect(m.inSeason).toBe(true);
    expect(m.cost).toBe(67000);
    expect(m.fit).toBe(true);
    expect(m.bonus).toBe(true);
    expect(m.score).toBe(Math.round(Math.min(99, 22 + 42 + 22 + 10 + 6)));
  });

  it('caps the score at 99', () => {
    const top = rankCities(getCities(), answers({ moods: ['food'], company: 'pair' }))[0];
    expect(top.score).toBeLessThanOrEqual(99);
  });

  it('uses 0.5 for mood when nothing is chosen', () => {
    expect(scoreCity(getCity('kazan')!, answers({ moods: [] })).mood).toBe(0.5);
  });

  it('fades the budget points by 1 per 8000 ₽ over budget', () => {
    const city = getCity('zanzibar')!;
    const days = 7;
    const cost = city.quiz.flightRub + city.quiz.dailyRub * days;
    const budget = (cost - 16000) / 1000; // на 16 000 ₽ дороже → 10 − 2 = 8 баллов
    const over = scoreCity(
      city,
      answers({ moods: ['sea'], month: 0, days, budget, company: 'solo' }),
    );
    const base = 22 + 42 + (over.inSeason ? 22 : 0) + (city.hit ? 2 : 0);
    expect(over.fit).toBe(false);
    expect(over.score).toBe(Math.round(base + 8));
  });
});

describe('rankCities', () => {
  it('is repeatable and sorted', () => {
    const a = answers({
      moods: ['sea', 'exotic'],
      month: 6,
      days: 10,
      budget: 200,
      company: 'friends',
    });
    const r1 = rankCities(getCities(), a).map((m) => m.city.id);
    const r2 = rankCities(getCities(), a).map((m) => m.city.id);
    expect(r1).toEqual(r2);
    const scores = rankCities(getCities(), a).map((m) => m.score);
    expect([...scores].sort((x, y) => y - x)).toEqual(scores);
  });

  it('puts sea cities on top for a sea mood in summer', () => {
    const top3 = rankCities(getCities(), answers({ moods: ['sea'], month: 6, budget: 150 }))
      .slice(0, 3)
      .map((m) => m.city.id);
    expect(top3.every((id) => getCity(id)!.quiz.moods.includes('sea'))).toBe(true);
  });
});

describe('result details', () => {
  it('lists up to three reasons', () => {
    const a = answers({ moods: ['food'], company: 'pair' });
    const r = reasons(scoreCity(getCity('tbilisi')!, a), a, label);
    expect(r).toEqual(['Сезон в мае', 'food', 'Укладываетесь в бюджет']);
  });

  it('splits the budget 45/30/25 of the stay plus the flight', () => {
    const parts = budgetSplit(getCity('tbilisi')!, 10);
    expect(parts.map((p) => p.rub)).toEqual([25000, 27000, 18000, 15000]);
  });

  it('knows when a city drops out during the calculation', () => {
    const a = answers({ moods: ['sea'], month: 0, budget: 30 });
    expect(eliminationPhase(scoreCity(getCity('kaliningrad')!, a))).toBe(1);
  });

  it('maps people to company', () => {
    expect([1, 2, 3, 4, 5, 6].map(companyFromPeople)).toEqual([
      'solo',
      'pair',
      'family',
      'family',
      'friends',
      'friends',
    ]);
  });
});
