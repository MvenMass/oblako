import type { KeyboardEvent } from 'react';
import { formatRub } from '@/lib/cities';
import { COMPANY_LABEL } from '@/lib/quiz';
import type { Company } from '@/types/user';
import { NextButton } from './NextButton';
import styles from './Steps.module.css';

const COMPANIES: Company[] = ['solo', 'pair', 'family', 'friends'];
const PEOPLE: Record<Company, number> = { solo: 1, pair: 2, family: 3, friends: 4 };

interface StepBudgetProps {
  budget: number;
  company: Company;
  onChange: (patch: { budget?: number; company?: Company }) => void;
  onNext: () => void;
}

/** Шаг 3: бюджет на человека (стопка талонов растёт) и компания (фигурки в иллюминаторе) */
export function StepBudget({ budget, company, onChange, onNext }: StepBudgetProps) {
  const tickets = Math.max(1, Math.round(budget / 30));
  const people = PEOPLE[company];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const d = ['ArrowRight', 'ArrowDown'].includes(e.key)
      ? 1
      : ['ArrowLeft', 'ArrowUp'].includes(e.key)
        ? -1
        : 0;
    if (!d) return;
    e.preventDefault();
    const i = (COMPANIES.indexOf(company) + d + 4) % 4;
    onChange({ company: COMPANIES[i] });
    (e.currentTarget.parentElement?.children[i] as HTMLElement | undefined)?.focus();
  };

  return (
    <div className={`${styles.step} ${styles.budget}`}>
      <div className={styles.budgetCol}>
        <label className={styles.rangeLabel} htmlFor="quiz-budget">
          Бюджет на&nbsp;человека
          <b className={styles.rangeValue}>{formatRub(budget * 1000)}</b>
        </label>
        <input
          id="quiz-budget"
          type="range"
          min={30}
          max={300}
          step={5}
          value={budget}
          aria-valuetext={`${budget} тысяч рублей`}
          className={styles.range}
          onChange={(e) => onChange({ budget: Number(e.target.value) })}
        />
        <div aria-hidden="true" className={styles.stack}>
          {Array.from({ length: tickets }, (_, k) => (
            <span
              key={k}
              className={styles.ticket}
              style={{
                bottom: k * 11,
                zIndex: k,
                transform: `rotate(${(k % 2 ? -4 : 3) * (1 - k / 14)}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className={styles.budgetCol}>
        <span id="quiz-who" className={styles.rangeLabel}>
          С кем едете
        </span>
        <div role="radiogroup" aria-labelledby="quiz-who" className={styles.company}>
          {COMPANIES.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={c === company}
              tabIndex={c === company ? 0 : -1}
              className={styles.companyBtn}
              onClick={() => onChange({ company: c })}
              onKeyDown={onKey}
            >
              {COMPANY_LABEL[c]}
            </button>
          ))}
        </div>
        <div aria-hidden="true" className={styles.porthole}>
          {Array.from({ length: people }, (_, k) => (
            <span
              key={`${company}-${k}`}
              className={`${styles.person} ${company === 'family' && k === 2 ? styles.kid : ''}`}
              style={{
                left: `calc(50% - ${people * 25}px + ${k * 50}px)`,
                animationDelay: `${k * 0.08}s`,
              }}
            />
          ))}
        </div>
        <NextButton onClick={onNext} label="Подобрать тур" />
      </div>
    </div>
  );
}
