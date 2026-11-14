import type { DayForecast, WeatherKind } from '@/lib/api/weather';
import styles from './WeatherWeek.module.css';

const DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const KIND: Record<WeatherKind, string> = {
  sun: 'солнечно',
  cloud: 'облачно',
  rain: 'дождь',
  snow: 'снег',
  storm: 'гроза',
};

function Glyph({ kind }: { kind: WeatherKind }) {
  const wet = kind === 'rain' || kind === 'storm' || kind === 'snow';
  return (
    <svg aria-hidden="true" width="36" height="36" viewBox="0 0 48 48" className={styles.glyph}>
      {kind === 'sun' ? (
        <>
          <circle cx="24" cy="24" r="9" className={styles.sun} />
          <path
            className={styles.rays}
            d="M24 6v5M24 37v5M6 24h5M37 24h5M11 11l3.5 3.5M33.5 33.5L37 37M11 37l3.5-3.5M33.5 14.5L37 11"
          />
        </>
      ) : (
        <>
          {kind === 'cloud' && <circle cx="20" cy="18" r="8" className={styles.sun} />}
          <path
            className={styles.cloud}
            d="M12 30h22a7 7 0 0 0 0-14 9 9 0 0 0-17 3 6 6 0 0 0-5 11z"
          />
          {wet && (
            <g className={styles.drops}>
              <path d="M17 35l-2 6" />
              <path d="M25 35l-2 6" />
              <path d="M33 35l-2 6" />
            </g>
          )}
        </>
      )}
    </svg>
  );
}

/** Погода на 7 дней; дождливый день выделен, капли падают */
export function WeatherWeek({ week, source }: { week: DayForecast[]; source: string }) {
  return (
    <div className={styles.wrap}>
      <ul className={styles.week} aria-label={`Погода на неделю, ${source}`}>
        {week.slice(0, 7).map((d) => {
          const wet = d.kind === 'rain' || d.kind === 'storm';
          const day = DAYS[new Date(`${d.date}T12:00:00`).getDay()];
          return (
            <li key={d.date} data-wet={wet || undefined}>
              <Glyph kind={d.kind} />
              <span className={styles.text}>
                <span>{day}</span>
                <b>
                  {d.maxC > 0 ? '+' : ''}
                  {d.maxC}°
                </b>
              </span>
              <span className="visually-hidden">
                {KIND[d.kind]}, ночью {d.minC}°
              </span>
            </li>
          );
        })}
      </ul>
      <span className={styles.source}>{source}</span>
    </div>
  );
}
