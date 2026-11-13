import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { MONTHS_FULL, MONTHS_SHORT, monthRanges } from '@/lib/months';
import { typograph } from '@/lib/typograph';
import type { City } from '@/types/city';
import { CitySection } from './CitySection';
import styles from './SeasonsPlan.module.css';

/** «Когда ехать»: столбики средней дневной температуры, лучшие месяцы — градиентом темы */
export function Seasons({ city }: { city: City }) {
  const temps = city.climate.avgHighC;
  const max = Math.max(...temps, 1);
  const min = Math.min(...temps, 0);
  const describe = temps.map((t, i) => `${MONTHS_FULL[i]} ${t > 0 ? '+' : ''}${t}°`).join(', ');

  return (
    <section className={styles.seasons} aria-labelledby="seasons-title">
      <div className={styles.card}>
        <div className={styles.head}>
          <h2 id="seasons-title" className={styles.title}>
            Когда ехать
          </h2>
          <span className={styles.legend}>
            <i aria-hidden="true" />
            лучшие месяцы: {monthRanges(city.climate.bestMonths)} · температура днём, демо
          </span>
        </div>
        <div
          className={styles.chart}
          role="img"
          aria-label={`Средняя дневная температура по месяцам: ${describe}`}
        >
          {temps.map((t, i) => (
            <span key={i} className={styles.col}>
              <span className={styles.temp}>
                {t > 0 ? '+' : ''}
                {t}°
              </span>
              <span
                className={`${styles.bar} ${city.climate.bestMonths.includes(i + 1) ? styles.best : ''}`}
                style={{
                  height: `${Math.max(6, ((t - min) / (max - min || 1)) * 150)}px`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
              <span className={styles.month}>{MONTHS_SHORT[i]}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** «N за 3 дня»: таймлайн itinerary и ссылка в конструктор маршрута */
export function Plan({ city }: { city: City }) {
  return (
    <CitySection
      id="plan"
      className={styles.plan}
      title={
        <>
          {city.name} за&nbsp;<span className="grad">3&nbsp;дня</span>
        </>
      }
    >
      <ol className={styles.days}>
        {city.itinerary.map((day, d) => (
          <li key={d} className={styles.day}>
            <span className={styles.dayHead}>
              <span className={styles.dayNum}>{String(d + 1).padStart(2, '0')}</span>
              <span className={styles.dayLabel}>день</span>
            </span>
            <ul className={styles.stops}>
              {day.map((stop) => (
                <li key={stop}>{typograph(stop)}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <div className={styles.cta}>
        <Link to={`/route?city=${city.id}`} className={styles.ctaButton}>
          Открыть в&nbsp;конструкторе маршрута
          <Icon name="arrow-right" size={18} />
        </Link>
        <span className={styles.ctaNote}>
          Маршрут откроется в&nbsp;конструкторе, его можно менять
        </span>
      </div>
    </CitySection>
  );
}
