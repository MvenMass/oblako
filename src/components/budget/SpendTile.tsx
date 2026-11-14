import { formatRub } from '@/lib/cities';
import { cumulative, totalRub } from '@/lib/budget';
import type { Expense } from '@/types/user';
import t from './Tiles.module.css';
import styles from './SpendTile.module.css';

const W = 560;
const H = 240;

/** Потрачено и линия накопленных трат по дням; пунктир — план */
export function SpendTile({
  expenses,
  plan,
  days,
}: {
  expenses: Expense[];
  plan: number;
  days: number;
}) {
  const total = totalRub(expenses);
  const sums = cumulative(expenses, days);
  const pct = plan ? Math.round((total / plan) * 100) : 0;
  const top = Math.max(plan, total, 1) * 1.08;
  const x = (i: number) => (days > 1 ? (i / (days - 1)) * (W - 16) + 8 : W / 2);
  const y = (v: number) => H - 14 - (v / top) * (H - 28);
  const pts = sums.map((v, i) => ({ x: x(i), y: y(v) }));
  const line = pts.reduce((d, p, i) => {
    if (!i) return `M${p.x} ${p.y}`;
    const mx = (pts[i - 1].x + p.x) / 2;
    return `${d} C${mx} ${pts[i - 1].y} ${mx} ${p.y} ${p.x} ${p.y}`;
  }, '');
  const last = pts[pts.length - 1];
  const label = `Накопленные траты по дням: ${sums
    .map((v, i) => `день ${i + 1} — ${formatRub(v)}`)
    .join(', ')}; план ${formatRub(plan)}`;

  return (
    <div className={`${t.tile} ${t.w2} ${t.h2} ${styles.tile}`}>
      <div className={t.head}>
        <div className={styles.sum}>
          <span className={t.label}>Потрачено из&nbsp;{formatRub(plan)}</span>
          <span className={t.big} aria-live="polite">
            {formatRub(total)}
          </span>
        </div>
        <span className={t.badge} data-over={pct > 100 || undefined}>
          {pct}% плана
        </span>
      </div>
      <svg role="img" aria-label={label} viewBox={`0 0 ${W} ${H}`} className={t.svg}>
        <defs>
          <linearGradient id="spend-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className={styles.areaTop} />
            <stop offset="1" className={styles.areaBottom} />
          </linearGradient>
          <linearGradient id="spend-line" x1="0" x2="1">
            <stop offset="0" className={styles.l1} />
            <stop offset=".6" className={styles.l2} />
            <stop offset="1" className={styles.l3} />
          </linearGradient>
        </defs>
        <g className={styles.grid}>
          {[0.25, 0.5, 0.75].map((k) => (
            <line key={k} x1="0" x2={W} y1={H * k} y2={H * k} />
          ))}
        </g>
        <line x1="0" x2={W} y1={y(plan)} y2={y(plan)} className={styles.plan} />
        <text x={W - 4} y={y(plan) - 8} className={styles.planText}>
          план
        </text>
        {total > 0 && (
          <>
            <path d={`${line} L${last.x} ${H} L${pts[0].x} ${H} Z`} className={styles.area} />
            <path key={line} d={line} pathLength={100} className={styles.line} />
            <circle cx={last.x} cy={last.y} r="8" className={styles.dot} />
          </>
        )}
      </svg>
      <div className={styles.days} aria-hidden="true">
        {sums.map((_, i) => (
          <span key={i}>{days > 8 ? i + 1 : `День ${i + 1}`}</span>
        ))}
      </div>
    </div>
  );
}
