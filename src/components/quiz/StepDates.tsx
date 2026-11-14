import type { CSSProperties, KeyboardEvent } from 'react';
import { SEASON_NOTE, seasonOf, tripNote } from '@/data/quiz';
import { MONTHS_FULL, MONTHS_SHORT } from '@/lib/months';
import { plural } from '@/lib/plural';
import { typograph } from '@/lib/typograph';
import { NextButton } from './NextButton';
import { SeasonIcon } from './SeasonIcon';
import styles from './Steps.module.css';

interface StepDatesProps {
  month: number;
  days: number;
  onChange: (patch: { month?: number; days?: number }) => void;
  onNext: () => void;
}

/** Шаг 2: кольцо месяцев (radiogroup) со стрелкой и ползунок дней с линией полёта */
export function StepDates({ month, days, onChange, onNext }: StepDatesProps) {
  const season = seasonOf(month);
  const daysWord = plural(days, ['день', 'дня', 'дней']);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const d = ['ArrowRight', 'ArrowDown'].includes(e.key)
      ? 1
      : ['ArrowLeft', 'ArrowUp'].includes(e.key)
        ? -1
        : 0;
    if (!d) return;
    e.preventDefault();
    const next = (month + d + 12) % 12;
    onChange({ month: next });
    (
      e.currentTarget.parentElement?.querySelectorAll('[role=radio]')[next] as
        HTMLElement | undefined
    )?.focus();
  };

  return (
    <div className={`${styles.step} ${styles.dates}`}>
      <div className={styles.ringWrap}>
        <div role="radiogroup" aria-label="Месяц поездки" className={styles.ring}>
          <span
            aria-hidden="true"
            className={styles.hand}
            style={{ '--a': `${month * 30}deg` } as CSSProperties}
          />
          {MONTHS_SHORT.map((m, i) => {
            const a = ((i * 30 - 90) * Math.PI) / 180;
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={i === month}
                aria-label={MONTHS_FULL[i]}
                tabIndex={i === month ? 0 : -1}
                className={styles.month}
                // Радиус кольца — CSS-переменная --r (меньше на телефоне)
                style={{
                  left: `calc(50% + ${Math.cos(a).toFixed(4)} * var(--r) - var(--m) / 2)`,
                  top: `calc(50% + ${Math.sin(a).toFixed(4)} * var(--r) - var(--m) / 2)`,
                }}
                onClick={() => onChange({ month: i })}
                onKeyDown={onKey}
              >
                {m}
              </button>
            );
          })}
          <div className={styles.ringCenter}>
            <SeasonIcon season={season} />
            <b className={styles.monthName}>
              {MONTHS_FULL[month][0].toUpperCase() + MONTHS_FULL[month].slice(1)}
            </b>
            <span className={styles.seasonNote}>{typograph(SEASON_NOTE[season])}</span>
          </div>
        </div>
      </div>

      <div className={styles.daysCol}>
        <label className={styles.rangeLabel} htmlFor="quiz-days">
          Сколько дней
          <b className={styles.rangeValue}>
            {days} {daysWord}
          </b>
        </label>
        <svg aria-hidden="true" viewBox="0 0 520 100" className={styles.flight}>
          <path className={styles.flightTrack} d="M20 70 Q260 -10 500 70" />
          <path
            className={styles.flightLine}
            d="M20 70 Q260 -10 500 70"
            pathLength={100}
            style={{ strokeDashoffset: 100 - ((days - 2) / 12) * 100 }}
          />
          {Array.from({ length: days }, (_, k) => {
            const t = (k + 1) / 15;
            return (
              <circle
                key={k}
                className={styles.dayDot}
                cx={20 + 480 * t}
                cy={70 - 160 * t * (1 - t)}
                r="5"
              />
            );
          })}
        </svg>
        <input
          id="quiz-days"
          type="range"
          min={3}
          max={14}
          value={days}
          aria-valuetext={`${days} ${daysWord}`}
          className={styles.range}
          onChange={(e) => onChange({ days: Number(e.target.value) })}
        />
        <p className={styles.hint}>{typograph(tripNote(days))}</p>
        <NextButton onClick={onNext} />
      </div>
    </div>
  );
}
