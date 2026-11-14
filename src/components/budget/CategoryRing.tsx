import { formatRub } from '@/lib/cities';
import { byCategory, percents } from '@/lib/budget';
import type { Expense } from '@/types/user';
import t from './Tiles.module.css';
import styles from './CategoryRing.module.css';

const R = 48;
const LEN = 2 * Math.PI * R;

/** Кольцо категорий: перелёт, жильё, еда, впечатления */
export function CategoryRing({ expenses }: { expenses: Expense[] }) {
  const cats = byCategory(expenses);
  const pct = percents(cats.map((c) => c.share));
  const empty = !expenses.length;
  // Начало каждого сегмента — сумма долей предыдущих
  const starts = cats.map((_, i) => cats.slice(0, i).reduce((a, c) => a + c.share, 0));
  const label = empty
    ? 'Кольцо категорий: трат пока нет'
    : `Кольцо категорий: ${cats.map((c, i) => `${c.label.toLowerCase()} ${pct[i]}%`).join(', ')}`;

  return (
    <div className={`${t.tile} ${t.h2} ${styles.tile}`}>
      <span className={t.label}>На&nbsp;что уходит</span>
      <svg role="img" aria-label={label} viewBox="0 0 120 120" className={styles.ring}>
        <circle cx="60" cy="60" r={R} className={styles.track} />
        <g transform="rotate(-90 60 60)">
          {cats.map((c, i) =>
            c.share > 0 ? (
              <circle
                key={c.id}
                cx="60"
                cy="60"
                r={R}
                className={styles.seg}
                style={{ stroke: c.color }}
                strokeDasharray={`${Math.max(c.share * LEN - 2, 0)} ${LEN}`}
                strokeDashoffset={-starts[i] * LEN}
              />
            ) : null,
          )}
        </g>
        {empty && (
          <text x="60" y="65" className={styles.empty}>
            нет трат
          </text>
        )}
      </svg>
      <ul className={styles.legend}>
        {cats.map((c, i) => (
          <li key={c.id}>
            <i aria-hidden="true" style={{ background: c.color }} />
            <span>{c.label}</span>
            <b title={formatRub(c.rub)}>{pct[i]}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
