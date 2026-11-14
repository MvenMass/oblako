import { useEffect, useState } from 'react';
import { formatClock, utcLabel } from '@/lib/cityTime';
import type { City } from '@/types/city';
import { rateText, useCityRate, useCityWeather } from './useCityData';
import styles from './CityHero.module.css';

/** Часы обновляются раз в секунду — отдельным компонентом, чтобы не перерисовывать сцену */
function LocalClock({ utc }: { utc: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={`${styles.chipValue} ${styles.tabular}`} aria-live="off">
      {formatClock(utc, now, true)}
    </span>
  );
}

/** Чипы «Сейчас», «Местное время», «Курс» */
export function HeroChips({ city, className }: { city: City; className?: string }) {
  const weather = useCityWeather(city);
  const rate = useCityRate(city);
  const temp =
    weather.status === 'ready'
      ? `${weather.data.tempC > 0 ? '+' : ''}${weather.data.tempC} °C`
      : weather.status === 'loading'
        ? null
        : '—';

  return (
    <div className={className ?? styles.chips}>
      <div className={styles.chip}>
        <span className={styles.chipLabel}>Сейчас</span>
        {temp === null ? (
          <span className={styles.skeleton} />
        ) : (
          <span className={styles.chipValue}>{temp}</span>
        )}
        <span className={styles.chipNote}>
          {weather.status === 'empty' ? 'нет связи с Open‑Meteo' : 'Open‑Meteo'}
        </span>
      </div>
      <div className={styles.chip}>
        <span className={styles.chipLabel}>Местное время</span>
        <LocalClock utc={city.utc} />
        <span className={styles.chipNote}>{utcLabel(city.utc)}</span>
      </div>
      {!rate.isRub && (
        <div className={styles.chip}>
          <span className={styles.chipLabel}>Курс</span>
          {rate.loading ? (
            <span className={styles.skeleton} />
          ) : (
            <span className={`${styles.chipValue} ${styles.small}`}>
              {rateText(city.facts.currency.rateCode, rate.rub)}
            </span>
          )}
          <span className={styles.chipNote}>{rate.caption}</span>
        </div>
      )}
    </div>
  );
}
