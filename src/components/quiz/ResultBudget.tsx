import { formatRub } from '@/lib/cities';
import { budgetSplit } from '@/lib/quiz';
import type { City } from '@/types/city';
import styles from './StepResult.module.css';

const COLORS = ['var(--sky-deep)', 'var(--sky)', 'var(--flamingo)', 'var(--dusk)'];

/** Бюджет тура полосой: перелёт, жильё, еда, впечатления; остаток или превышение */
export function ResultBudget({ city, days, budget }: { city: City; days: number; budget: number }) {
  const parts = budgetSplit(city, days);
  const total = parts.reduce((s, p) => s + p.rub, 0);
  const limit = budget * 1000;
  const fit = total <= limit;

  return (
    <div className={styles.budget}>
      <div className={styles.budgetHead}>
        <span className={styles.label}>Бюджет на&nbsp;человека · демо</span>
        <b className={styles.total}>≈&nbsp;{formatRub(total)}</b>
      </div>
      <div
        className={styles.bar}
        role="img"
        aria-label={parts.map((p) => `${p.label} ${formatRub(p.rub)}`).join(', ')}
      >
        {parts.map((p, i) => (
          <span key={p.label} style={{ flexGrow: p.rub, background: COLORS[i] }} />
        ))}
      </div>
      <ul className={styles.legend}>
        {parts.map((p, i) => (
          <li key={p.label}>
            <i style={{ background: COLORS[i] }} />
            {p.label}
            <b>{formatRub(p.rub)}</b>
          </li>
        ))}
      </ul>
      <p className={fit ? styles.fit : styles.over}>
        {fit
          ? `Остаётся ≈ ${formatRub(limit - total)} на сувениры`
          : `Дороже бюджета на ${formatRub(total - limit)} — можно сократить поездку`}
      </p>
    </div>
  );
}
