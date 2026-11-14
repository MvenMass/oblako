import type { CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { citiesIndex } from '@/lib/cities';
import { plural } from '@/lib/plural';
import { MONTHS_IN, reasons, type Match } from '@/lib/quiz';
import { typograph } from '@/lib/typograph';
import { useUserStore } from '@/store/user';
import type { MoodId } from '@/types/city';
import type { QuizAnswers } from '@/types/user';
import { ResultBudget } from './ResultBudget';
import styles from './StepResult.module.css';

const moodLabel = (id: MoodId) => citiesIndex.moods.find((m) => m.id === id)?.label ?? id;

interface StepResultProps {
  top: Match[];
  pick: number;
  answers: QuizAnswers;
  onPick: (i: number) => void;
  onEdit: () => void;
  onRestart: () => void;
}

/** Шаг 5: главный тур, бюджет, 3 дня, кнопки дальше и «ещё подходят» */
export function StepResult({ top, pick, answers, onPick, onEdit, onRestart }: StepResultProps) {
  const navigate = useNavigate();
  const setRoute = useUserStore((s) => s.setRoute);
  const match = top[pick];
  const { city } = match;
  const days = answers.days;
  const plan = [0, 1, 2]
    .slice(0, Math.min(3, days))
    .map((d) => city.places.slice(d * 2, d * 2 + 2));

  const openRoute = () => {
    setRoute(
      city.id,
      plan.map((places) => ({ stops: places.map((p) => ({ placeId: p.id, minutes: 90 })) })),
    );
    navigate('/route');
  };

  const vars = { '--c1': city.theme.folder[0], '--c2': city.theme.folder[1] } as CSSProperties;

  return (
    <div className={styles.result}>
      <div className={styles.top}>
        <article className={styles.hero} style={vars} aria-labelledby="result-city">
          <div className={styles.heroTop}>
            <span className={styles.country}>
              {city.country}
              {city.hit && <span className={styles.hit}>ХИТ</span>}
            </span>
            <span className={styles.score}>
              <svg aria-hidden="true" viewBox="0 0 64 64" className={styles.scoreRing}>
                <circle cx="32" cy="32" r="27" className={styles.scoreTrack} />
                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  className={styles.scoreValue}
                  pathLength={100}
                  style={{ strokeDashoffset: 100 - match.score }}
                />
              </svg>
              <b>{match.score}%</b>
              <span className="visually-hidden">совпадения</span>
            </span>
          </div>
          <h2 id="result-city" className={styles.city}>
            {city.name}
          </h2>
          <ul className={styles.reasons} aria-label="Почему подходит">
            {reasons(match, answers, moodLabel).map((r) => (
              <li key={r}>{typograph(r)}</li>
            ))}
          </ul>
          <p className={styles.meta}>
            {days} {plural(days, ['день', 'дня', 'дней'])} {MONTHS_IN[answers.month]} · Москва →{' '}
            {city.iata}
          </p>
        </article>
        <ResultBudget city={city} days={days} budget={answers.budget} />
      </div>

      <ol className={styles.plan} aria-label="План по дням">
        {plan.map((places, d) => (
          <li key={d} className={styles.day}>
            <span className={styles.dayNum}>День {d + 1}</span>
            {places.map((p) => (
              <span key={p.id} className={styles.stop}>
                {p.name}
              </span>
            ))}
          </li>
        ))}
        {days > 3 && (
          <li className={`${styles.day} ${styles.more}`}>
            <span className={styles.dayNum}>Дни 4–{days}</span>
            <span className={styles.stop}>
              {typograph('Свободное время, соберите в конструкторе')}
            </span>
          </li>
        )}
      </ol>

      <div className={styles.ctas}>
        <button type="button" className={styles.primary} onClick={openRoute}>
          Открыть маршрут
          <Icon name="arrow-right" size={18} />
        </button>
        <Link to={`/booking?city=${city.id}`} className={styles.secondary}>
          Билеты
        </Link>
        <Link to={`/packing?city=${city.id}`} className={styles.secondary}>
          Сборы
        </Link>
      </div>

      <section className={styles.alts} aria-labelledby="alts-title">
        <h3 id="alts-title" className={styles.altsTitle}>
          Ещё подходят
        </h3>
        <div className={styles.altList}>
          {top.map((m, i) =>
            i === pick ? null : (
              <button
                key={m.city.id}
                type="button"
                className={styles.alt}
                style={
                  {
                    '--c1': m.city.theme.folder[0],
                    '--c2': m.city.theme.folder[1],
                  } as CSSProperties
                }
                onClick={() => onPick(i)}
              >
                <span aria-hidden="true" className={styles.altTab} />
                <span className={styles.altCountry}>{m.city.country}</span>
                <b className={styles.altName}>{m.city.name}</b>
                <span className={styles.altScore}>{m.score}% совпадения</span>
              </button>
            ),
          )}
        </div>
        <div className={styles.again}>
          <button type="button" className={styles.link} onClick={onEdit}>
            Изменить ответы
          </button>
          <button type="button" className={styles.link} onClick={onRestart}>
            Пройти заново
          </button>
        </div>
      </section>
    </div>
  );
}
