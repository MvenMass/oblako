import { getForecast } from '@/lib/api/weather';
import { MONTHS_IN } from '@/lib/quiz';
import { typograph } from '@/lib/typograph';
import { addDays, daysUntil } from '@/lib/trip';
import { useAsync } from '@/lib/useAsync';
import type { City } from '@/types/city';
import styles from './TripWeather.module.css';

/** Прогноз Open-Meteo доступен примерно на 16 дней вперёд */
const FORECAST_DAYS = 15;

interface TripWeatherProps {
  city: City;
  dateFrom: string;
  nights: number;
  now: number;
}

/** Погода на даты поездки: реальный прогноз, если вылет скоро, иначе климат месяца */
export function TripWeather({ city, dateFrom, nights, now }: TripWeatherProps) {
  const soon = daysUntil(dateFrom, now) <= FORECAST_DAYS;
  const forecast = useAsync(
    (signal) => (soon ? getForecast(city.coords, signal) : Promise.resolve(null)),
    [city.id, soon],
  );
  const end = addDays(dateFrom, nights);
  const days =
    forecast.status === 'ready' && forecast.data
      ? forecast.data.filter((d) => d.date >= dateFrom && d.date <= end)
      : [];
  const month = Number(dateFrom.slice(5, 7)) - 1;
  const avg = city.climate.avgHighC[month];

  if (days.length) {
    return (
      <div className={styles.box}>
        <span className={styles.label}>Прогноз Open‑Meteo на&nbsp;даты поездки</span>
        <ul className={styles.days}>
          {days.map((d) => (
            <li key={d.date}>
              <span>
                {d.date.slice(8)}.{d.date.slice(5, 7)}
              </span>
              <b>
                {d.maxC > 0 ? '+' : ''}
                {d.maxC}°
              </b>
              <span>{d.precipitation >= 50 ? 'дождь' : 'без осадков'}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div className={styles.box}>
      <span className={styles.label}>
        Погода на&nbsp;даты{soon ? '' : ' · прогноз появится за две недели до вылета'}
      </span>
      <p className={styles.climate}>
        {typograph(MONTHS_IN[month].replace(/^в/, 'В'))} обычно до&nbsp;
        <b>
          {avg > 0 ? '+' : ''}
          {avg}°
        </b>{' '}
        днём.
      </p>
    </div>
  );
}
