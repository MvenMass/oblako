import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { NextButton } from '@/components/quiz/NextButton';
import { QuizTrack } from '@/components/quiz/QuizTrack';
import { StepBudget } from '@/components/quiz/StepBudget';
import { StepCalc } from '@/components/quiz/StepCalc';
import { StepDates } from '@/components/quiz/StepDates';
import { StepMood } from '@/components/quiz/StepMood';
import { StepResult } from '@/components/quiz/StepResult';
import { useQuizFlow } from '@/components/quiz/useQuizFlow';
import { Icon } from '@/components/ui/Icon';
import { DEFAULT_AURORA, MOOD_COLORS, STEP_TITLES } from '@/data/quiz';
import { getCities } from '@/lib/cities';
import { DEFAULT_ANSWERS, rankCities } from '@/lib/quiz';
import { usePageTitle } from '@/lib/usePageTitle';
import { useUserStore } from '@/store/user';
import styles from './Quiz.module.css';

export default function Quiz() {
  const { step, answers, update, go, direction } = useQuizFlow();
  const setQuiz = useUserStore((s) => s.setQuiz);
  const [pick, setPick] = useState(0);
  const top = useMemo(() => rankCities(getCities(), answers).slice(0, 3), [answers]);
  usePageTitle(`Подбор поездки · шаг ${step}`);

  // Результат сохраняется в store вместе с ответами
  useEffect(() => {
    if (step === 5 && top[pick]) setQuiz(answers, top[pick].city.id);
  }, [step, pick, top, answers, setQuiz]);

  // 4 → 5 без записи в истории: «назад» с результата ведёт к бюджету, а не в расчёт
  const onCalcDone = useCallback(() => go(5, true), [go]);
  const next = () => go(step + 1);
  const back = () => go(step === 5 ? 3 : step - 1);
  const restart = () => {
    update({ ...DEFAULT_ANSWERS, moods: [] });
    setPick(0);
    go(1);
  };

  const [a, b] = answers.moods.length
    ? [MOOD_COLORS[answers.moods[0]][0], MOOD_COLORS[answers.moods[answers.moods.length - 1]][1]]
    : DEFAULT_AURORA;
  const [titleA, titleB] = STEP_TITLES[step - 1];

  return (
    <div className={styles.page} style={{ '--qa': a, '--qb': b } as CSSProperties}>
      <span aria-hidden="true" className={`${styles.blob} ${styles.blobA}`} />
      <span aria-hidden="true" className={`${styles.blob} ${styles.blobB}`} />

      <section className={`container ${styles.content}`} aria-labelledby="quiz-title">
        <div className={styles.head}>
          <div className={styles.titles}>
            <p className={styles.eyebrow}>Подбор поездки · шаг {step} из&nbsp;5</p>
            <h1 id="quiz-title" className={styles.title}>
              {titleA} <span className="grad">{titleB}</span>
            </h1>
          </div>
          {step > 1 && step !== 4 && (
            <button type="button" className={styles.back} onClick={back}>
              <Icon name="chevron-left" size={18} />
              {step === 5 ? 'Изменить ответы' : 'Назад'}
            </button>
          )}
        </div>

        <QuizTrack step={step} />

        <div
          key={step}
          className={`${styles.body} ${direction === 'back' ? styles.fromLeft : styles.fromRight}`}
        >
          <div aria-hidden="true" className={styles.wave}>
            <span />
            <span />
            <span />
          </div>
          {step === 1 && (
            <StepMood moods={answers.moods} onChange={(moods) => update({ moods })} onNext={next} />
          )}
          {step === 2 && (
            <StepDates month={answers.month} days={answers.days} onChange={update} onNext={next} />
          )}
          {step === 3 && (
            <StepBudget
              budget={answers.budget}
              company={answers.company}
              onChange={update}
              onNext={next}
            />
          )}
          {step === 4 && (
            <StepCalc
              ranked={rankCities(getCities(), answers)}
              month={answers.month}
              days={answers.days}
              onDone={onCalcDone}
            />
          )}
          {step === 5 && top.length > 0 && (
            <StepResult
              top={top}
              pick={pick}
              answers={answers}
              onPick={setPick}
              onEdit={() => go(3)}
              onRestart={restart}
            />
          )}
        </div>

        {step === 5 && !answers.moods.length && (
          <NextButton onClick={() => go(1)} label="Начать подбор" />
        )}
      </section>
    </div>
  );
}
