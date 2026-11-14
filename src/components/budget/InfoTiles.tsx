import { formatRate } from '@/components/city/useCityData';
import { formatRub } from '@/lib/cities';
import { categoryLabel, extremes } from '@/lib/budget';
import type { Expense } from '@/types/user';
import t from './Tiles.module.css';
import styles from './InfoTiles.module.css';

/** Курс ЦБ табло-флапами; для рубля — подсказка, что курс не нужен */
export function RateTile({
  code,
  rub,
  caption,
  isRub,
}: {
  code: string;
  rub: number;
  caption: string;
  isRub: boolean;
}) {
  if (isRub) {
    return (
      <div className={`${t.tile} ${t.dark}`}>
        <span className={t.label}>Валюта</span>
        <span className={t.mid}>Рубли</span>
        <span className={t.note}>курс не&nbsp;нужен&nbsp;— платите картой</span>
      </div>
    );
  }
  const per = rub < 0.1 ? 1000 : 1;
  const value = formatRate(rub * per);
  return (
    <div className={`${t.tile} ${t.dark}`}>
      <span className={t.label}>
        Курс · {per}&nbsp;{code}
      </span>
      <div className={styles.flaps} role="img" aria-label={`${per} ${code} = ${value} ₽`}>
        {value.split('').map((ch, i) =>
          ch === ',' ? (
            <span key={i} className={styles.comma}>
              ,
            </span>
          ) : (
            <span key={i} className={styles.flap}>
              {ch}
            </span>
          ),
        )}
        <span className={styles.comma}>₽</span>
      </div>
      <span className={t.note}>{caption}</span>
    </div>
  );
}

const R = 48;
const LEN = 2 * Math.PI * R;

/** Кольцо «потрачено N% плана» и остаток */
export function PlanTile({ spent, plan }: { spent: number; plan: number }) {
  const pct = plan ? Math.round((spent / plan) * 100) : 0;
  const over = spent > plan;
  return (
    <div className={`${t.tile} ${styles.plan}`}>
      <svg
        role="img"
        aria-label={`Потрачено ${pct}% плана`}
        viewBox="0 0 120 120"
        className={styles.ring}
      >
        <circle cx="60" cy="60" r={R} className={styles.track} />
        <circle
          cx="60"
          cy="60"
          r={R}
          className={styles.fill}
          data-over={over || undefined}
          strokeDasharray={`${Math.min(pct, 100) * (LEN / 100)} ${LEN}`}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="68" className={styles.pct}>
          {pct}%
        </text>
      </svg>
      <div className={styles.planText}>
        <b>{over ? 'Сверх плана' : 'Осталось'}</b>
        <span>{formatRub(Math.abs(plan - spent))}</span>
      </div>
    </div>
  );
}

function Row({ title, e }: { title: string; e: Expense }) {
  return (
    <div className={styles.row}>
      <span className={t.label}>{title}</span>
      <b className={t.mid}>{formatRub(e.rub)}</b>
      <span className={t.note}>
        {categoryLabel(e.category)} · день {e.day}
      </span>
    </div>
  );
}

/** Самая дорогая и самая дешёвая трата */
export function ExtremesTile({ expenses }: { expenses: Expense[] }) {
  const x = extremes(expenses);
  return (
    <div className={`${t.tile} ${t.w2} ${styles.extremes}`}>
      {x ? (
        <>
          <Row title="Самая дорогая" e={x.max} />
          <Row title="Самая скромная" e={x.min} />
        </>
      ) : (
        <>
          <span className={t.label}>Самая дорогая трата</span>
          <span className={t.note}>появится после первой траты</span>
        </>
      )}
    </div>
  );
}
