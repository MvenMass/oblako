// Подбор тура — алгоритм из docs/spec/data.md. Чистые функции, без React.
import type { City, MoodId } from '@/types/city';
import type { Company, QuizAnswers } from '@/types/user';

export const BONUS: Record<Company, string[]> = {
  solo: ['altai', 'hanoi', 'beijing'],
  pair: ['zanzibar', 'yerevan', 'tbilisi'],
  family: ['sochi', 'kaliningrad', 'kazan'],
  friends: ['istanbul', 'tbilisi', 'shanghai'],
};

export const COMPANY_LABEL: Record<Company, string> = {
  solo: 'Один',
  pair: 'Вдвоём',
  family: 'Семья',
  friends: 'Друзья',
};

const COMPANY_REASON: Record<Company, string> = {
  solo: 'Хорошо одному',
  pair: 'Для двоих',
  family: 'Удобно с детьми',
  friends: 'Весело компанией',
};

export const MONTHS_IN = [
  'в январе',
  'в феврале',
  'в марте',
  'в апреле',
  'в мае',
  'в июне',
  'в июле',
  'в августе',
  'в сентябре',
  'в октябре',
  'в ноябре',
  'в декабре',
];

export interface Match {
  city: City;
  score: number;
  /** Доля совпавших настроений 0…1 (0,5 — если настроение не выбрано) */
  mood: number;
  matchedMoods: MoodId[];
  inSeason: boolean;
  /** Стоимость на человека, ₽: перелёт + дни × день в городе */
  cost: number;
  fit: boolean;
  bonus: boolean;
}

export function scoreCity(city: City, a: QuizAnswers): Match {
  const matchedMoods = a.moods.filter((m) => city.quiz.moods.includes(m));
  const mood = a.moods.length ? matchedMoods.length / a.moods.length : 0.5;
  const inSeason = city.climate.bestMonths.includes(a.month + 1);
  const cost = city.quiz.flightRub + city.quiz.dailyRub * a.days;
  const budget = a.budget * 1000;
  const fit = cost <= budget;
  const bonus = BONUS[a.company].includes(city.id);
  const score = Math.round(
    Math.min(
      99,
      22 +
        mood * 42 +
        (inSeason ? 22 : 0) +
        (fit ? 10 : Math.max(0, 10 - (cost - budget) / 8000)) +
        (bonus ? 6 : 0) +
        (city.hit ? 2 : 0),
    ),
  );
  return { city, score, mood, matchedMoods, inSeason, cost, fit, bonus };
}

/** Все города по убыванию совпадения. При равенстве — порядок index.order, результат повторяем. */
export function rankCities(cities: City[], a: QuizAnswers): Match[] {
  return cities
    .map((c, i) => ({ m: scoreCity(c, a), i }))
    .sort((x, y) => y.m.score - x.m.score || x.i - y.i)
    .map((x) => x.m);
}

/** Причины выбора для карточки результата (до трёх) */
export function reasons(m: Match, a: QuizAnswers, moodLabel: (id: MoodId) => string): string[] {
  const out: string[] = [];
  if (m.inSeason) out.push(`Сезон ${MONTHS_IN[a.month]}`);
  if (m.matchedMoods.length) out.push(m.matchedMoods.map(moodLabel).join(' + '));
  if (m.fit) out.push('Укладываетесь в бюджет');
  if (m.bonus) out.push(COMPANY_REASON[a.company]);
  return out.slice(0, 3);
}

export interface BudgetPart {
  label: string;
  rub: number;
}

/** Бюджет результата: перелёт, жильё 45 %, еда 30 %, впечатления 25 % от дней в городе */
export function budgetSplit(city: City, days: number): BudgetPart[] {
  const stay = city.quiz.dailyRub * days;
  return [
    { label: 'Перелёт', rub: city.quiz.flightRub },
    { label: 'Жильё', rub: stay * 0.45 },
    { label: 'Еда', rub: stay * 0.3 },
    { label: 'Впечатления', rub: stay * 0.25 },
  ];
}

/**
 * На какой фазе расчёта город отсеивается: 1 — не сезон, 2 — дорого, 3 — по настроению.
 * Топ-3 не отсеиваются никогда.
 */
export function eliminationPhase(m: Match): 1 | 2 | 3 {
  return !m.inSeason ? 1 : !m.fit ? 2 : 3;
}

/** Количество людей из формы на главной → компания */
export function companyFromPeople(people: number): Company {
  if (people <= 1) return 'solo';
  if (people === 2) return 'pair';
  if (people <= 4) return 'family';
  return 'friends';
}

export const DEFAULT_ANSWERS: QuizAnswers = {
  moods: [],
  month: 4,
  days: 7,
  budget: 120,
  company: 'pair',
};
