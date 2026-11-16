import { useRef, type KeyboardEvent } from 'react';
import { MONTHS } from '@/lib/search';
import styles from './Panels.module.css';

interface MonthGridProps {
  /** '' — любой месяц, иначе '1'…'12' */
  value: string;
  /** Лучшие месяцы выбранного города (1–12) — отмечаются точкой */
  best: number[];
  onPick: (month: string) => void;
}

const VALUES = ['', ...Array.from({ length: 12 }, (_, i) => String(i + 1))];

/** «Когда»: сетка месяцев (радиогруппа), стрелки двигают выбор, точка — сезон города */
export function MonthGrid({ value, best, onPick }: MonthGridProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = Math.max(0, VALUES.indexOf(value));

  const onKey = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = Math.min(VALUES.length - 1, Math.max(0, i + step));
    refs.current[next]?.focus();
  };

  return (
    <div className={styles.months}>
      <div role="radiogroup" aria-label="Месяц поездки" className={styles.monthGrid}>
        {VALUES.map((v, i) => {
          const on = i === current;
          const season = v !== '' && best.includes(Number(v));
          return (
            <button
              key={v || 'any'}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              // eslint-disable-next-line jsx-a11y/no-autofocus -- фокус на выбранном месяце при открытии панели
              autoFocus={on}
              className={`${styles.month} ${v === '' ? styles.anyMonth : ''}`}
              onClick={() => onPick(v)}
              onKeyDown={onKey(i)}
            >
              {v === '' ? 'Любой месяц' : MONTHS[i - 1]}
              {season && (
                <>
                  <span aria-hidden="true" className={styles.season} />
                  <span className="visually-hidden">, сезон</span>
                </>
              )}
            </button>
          );
        })}
      </div>
      {best.length > 0 && (
        <p className={styles.hint}>
          <span aria-hidden="true" className={styles.season} /> лучший сезон для&nbsp;города
        </p>
      )}
    </div>
  );
}
