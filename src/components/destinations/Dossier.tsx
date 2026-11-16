import type { CSSProperties } from 'react';
import { photoSrcSet } from '@/lib/img';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { getCurrentWeather } from '@/lib/api/weather';
import { formatRub, nbsp } from '@/lib/cities';
import { useAsync } from '@/lib/useAsync';
import type { City } from '@/types/city';
import styles from './Dossier.module.css';

const TRIP_DAYS = 5;

/** Досье города внутри папки: факты, погода, сезон, 3 фото и ссылка на город */
export function Dossier({ city }: { city: City }) {
  const weather = useAsync((signal) => getCurrentWeather(city.coords, signal), [city.id]);
  const now =
    weather.status === 'ready'
      ? `${weather.data.tempC > 0 ? '+' : ''}${weather.data.tempC} °C`
      : weather.status === 'loading'
        ? '…'
        : '—';
  const budget = city.quiz.flightRub + city.quiz.dailyRub * TRIP_DAYS;
  const temps = city.climate.avgHighC;
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const demoVisa = city.facts.visa.includes('*');

  return (
    <div className={styles.dossier} style={{ '--accent': city.theme.accent } as CSSProperties}>
      <p className={styles.head}>
        <span>Досье</span>
        <span>{city.iata}</span>
      </p>

      <dl className={styles.facts}>
        <div>
          <dt>Перелёт</dt>
          <dd>{nbsp(city.facts.flight)}</dd>
        </div>
        <div>
          <dt>Сейчас</dt>
          <dd title={weather.status === 'empty' ? 'нет связи с Open-Meteo' : 'Open-Meteo'}>
            {now}
          </dd>
        </div>
        <div>
          <dt>Виза{demoVisa && ' · демо'}</dt>
          <dd>{city.facts.visa}</dd>
        </div>
        <div>
          <dt>Бюджет · демо</dt>
          <dd>от&nbsp;{formatRub(budget)}</dd>
        </div>
      </dl>

      <div
        className={styles.temps}
        role="img"
        aria-label={`Средняя дневная температура по месяцам, ${min}…${max} °C. Лучшие месяцы подсвечены.`}
      >
        {temps.map((t, i) => (
          <span
            key={i}
            className={city.climate.bestMonths.includes(i + 1) ? styles.best : undefined}
            style={{ height: `${28 + ((t - min) / Math.max(1, max - min)) * 72}%` }}
          />
        ))}
      </div>

      <ul className={styles.photos}>
        {city.places.slice(0, 3).map((p) => (
          <li key={p.id}>
            <img
              src={p.photo}
              srcSet={photoSrcSet(p.photo)}
              sizes="160px"
              alt={p.name}
              loading="lazy"
            />
          </li>
        ))}
      </ul>

      <Link to={`/city/${city.id}`} className={styles.open}>
        Открыть направление
        <Icon name="arrow-right" size={16} />
      </Link>
    </div>
  );
}
