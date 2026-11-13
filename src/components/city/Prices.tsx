import { useRef } from 'react';
import { formatRub } from '@/lib/cities';
import { useInView } from '@/lib/motion';
import type { City } from '@/types/city';
import { rateText, useCityRate } from './useCityData';
import styles from './Prices.module.css';

const groups = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Сравнение с Москвой: 1 — так же, 0,8 — на 20 % дешевле */
function averageRatio(rows: { city: number; moscow: number }[]): number {
  return rows.reduce((sum, r) => sum + r.city / r.moscow, 0) / rows.length;
}

/** «Цены против Москвы»: полосы растут при появлении, курс — живой ЦБ или демо */
export function Prices({ city }: { city: City }) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root);
  const rate = useCityRate(city);
  const { code } = city.facts.currency;

  const rows = city.prices.items.map((p) => ({
    name: p.item,
    local: p.local,
    city: p.local * rate.rub,
    moscow: p.moscowRub,
  }));
  const max = Math.max(...rows.map((r) => Math.max(r.city, r.moscow)));
  const ratio = averageRatio(rows);
  const diff = Math.round(Math.abs(1 - ratio) * 100);
  const verdict = diff < 3 ? 'примерно как' : `на ${diff}% ${ratio < 1 ? 'дешевле' : 'дороже'}`;

  return (
    <section className={styles.section} aria-labelledby="pr-title">
      <div ref={root} className={styles.card}>
        <div className={styles.side}>
          <h2 id="pr-title" className={styles.title}>
            Цены против <span className="grad">Москвы</span>
          </h2>
          <p className={styles.text}>
            {rate.isRub
              ? 'Цены в рублях, ориентировочные, демо.'
              : `Пересчитали по курсу: ${rateText(code, rate.rub)} (${rate.caption}). Цены ориентировочные, демо.`}
          </p>
          <div className={styles.verdict}>
            <span>В&nbsp;среднем</span>
            <b>{verdict}</b>
            <span>чем в&nbsp;Москве</span>
          </div>
          <p className={styles.legend}>
            <span>
              <i className={styles.dotCity} />
              {city.name}
            </span>
            <span>
              <i className={styles.dotMoscow} />
              Москва
            </span>
          </p>
        </div>

        <dl className={styles.rows}>
          {rows.map((r, i) => (
            <div key={r.name} className={styles.row}>
              <dt className={styles.name}>
                {r.name}
                {!rate.isRub && (
                  <span className={styles.local}>
                    {groups(r.local)}&nbsp;{code}
                  </span>
                )}
              </dt>
              <dd className={styles.bars}>
                <span className={styles.barLine}>
                  <span
                    className={styles.barCity}
                    style={{
                      transform: `scaleX(${visible ? Math.max(0.03, r.city / max) : 0})`,
                      transitionDelay: `${i * 0.1}s`,
                    }}
                  />
                  <b>{formatRub(r.city)}</b>
                </span>
                <span className={styles.barLine}>
                  <span
                    className={styles.barMoscow}
                    style={{
                      transform: `scaleX(${visible ? Math.max(0.03, r.moscow / max) : 0})`,
                      transitionDelay: `${i * 0.1 + 0.05}s`,
                    }}
                  />
                  <span className={styles.moscowValue}>{formatRub(r.moscow)}</span>
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
