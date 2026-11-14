import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCity } from '@/lib/cities';
import { companyFromPeople, DEFAULT_ANSWERS } from '@/lib/quiz';
import { useUserStore } from '@/store/user';
import type { QuizAnswers } from '@/types/user';

export type Direction = 'forward' | 'back';

/** Ответы по умолчанию: сохранённые в store, поверх — параметры формы с главной (?to, ?month, ?people) */
function initialAnswers(params: URLSearchParams, saved: QuizAnswers | null): QuizAnswers {
  const a: QuizAnswers = { ...DEFAULT_ANSWERS, ...saved, moods: [...(saved?.moods ?? [])] };
  const month = Number(params.get('month'));
  if (month >= 1 && month <= 12) a.month = month - 1;
  const people = Number(params.get('people'));
  if (people >= 1) a.company = companyFromPeople(people);
  const to = getCity(params.get('to') ?? undefined);
  if (to && !a.moods.length) a.moods = to.quiz.moods.slice(0, 2);
  return a;
}

/** Шаг подбора в URL (?step=1…5), ответы и направление анимации */
export function useQuizFlow() {
  const [params, setParams] = useSearchParams();
  const saved = useUserStore((s) => s.quiz.answers);
  const [answers, setAnswers] = useState<QuizAnswers>(() => initialAnswers(params, saved));
  const raw = Number(params.get('step'));
  const step = raw >= 1 && raw <= 5 ? raw : 1;

  // Направление: сравниваем с предыдущим шагом (паттерн «предыдущее значение в state»)
  const [prevStep, setPrevStep] = useState(step);
  const [direction, setDirection] = useState<Direction>('forward');
  if (prevStep !== step) {
    setPrevStep(step);
    setDirection(step > prevStep ? 'forward' : 'back');
  }

  const go = useCallback(
    (next: number, replace = false) => {
      setParams(
        (p) => {
          const out = new URLSearchParams(p);
          out.set('step', String(next));
          return out;
        },
        { replace },
      );
    },
    [setParams],
  );

  // Без настроения дальше первого шага не пускаем (прямая ссылка ?step=3)
  useEffect(() => {
    if (step > 1 && !answers.moods.length) go(1, true);
  }, [step, answers.moods.length, go]);

  const update = useCallback(
    (patch: Partial<QuizAnswers>) => setAnswers((a) => ({ ...a, ...patch })),
    [],
  );

  return { step, answers, update, go, direction };
}
