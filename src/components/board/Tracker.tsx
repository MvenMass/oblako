import { useId } from 'react';
import { formatTime } from '@/lib/route';
import { flightProgress, STATUS_LABEL, type Flight } from '@/lib/flights';
import styles from './Tracker.module.css';

interface TrackerProps {
  flights: Flight[];
  flight: Flight;
  nowMin: number;
  onPick: (id: string) => void;
}

/** Точка на кривой Безье полёта (14,96) → (150,−20) → (286,96) */
const at = (t: number) => ({
  x: (1 - t) * (1 - t) * 14 + 2 * (1 - t) * t * 150 + t * t * 286,
  y: (1 - t) * (1 - t) * 96 + 2 * (1 - t) * t * -20 + t * t * 96,
});
const ARC = 340;

/** «Слежу за рейсом»: Москва → город, прогресс по времени, выход и посадка */
export function Tracker({ flights, flight, nowMin, onPick }: TrackerProps) {
  const id = useId();
  const p = flightProgress(flight, nowMin);
  const plane = at(p);
  const arrive = (flight.time + flight.minutes) % 1440;
  const left = flight.time - 15 - nowMin;
  const city = flight.city.charAt(0) + flight.city.slice(1).toLowerCase();

  return (
    <aside className={styles.card} aria-labelledby={`${id}-t`}>
      <div className={styles.head}>
        <h2 id={`${id}-t`} className={styles.title}>
          Слежу за&nbsp;рейсом
        </h2>
        <span className={styles.badge} data-status={flight.status}>
          {STATUS_LABEL.dep[flight.status]}
        </span>
      </div>
      <label className={styles.pick}>
        <span className="visually-hidden">Рейс</span>
        <select value={flight.id} onChange={(e) => onPick(e.target.value)}>
          {flights.map((f) => (
            <option key={f.id} value={f.id}>
              {f.no} · {f.city.charAt(0) + f.city.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </label>
      <div className={styles.ends}>
        <span>
          <b>MOW</b>
          {formatTime(flight.time)}
        </span>
        <span className={styles.no}>{flight.no}</span>
        <span className={styles.to}>
          <b>{flight.iata}</b>
          {formatTime(arrive)} мск
        </span>
      </div>
      <svg
        role="img"
        aria-label={`Схема полёта Москва — ${city}: пройдено ${Math.round(p * 100)}%`}
        viewBox="0 0 300 110"
        className={styles.svg}
      >
        <defs>
          <linearGradient id={`${id}-g`} x1="0" x2="1">
            <stop offset="0" className={styles.g1} />
            <stop offset="1" className={styles.g2} />
          </linearGradient>
        </defs>
        <path d="M14 96 Q 150 -20 286 96" className={styles.track} />
        <path
          d="M14 96 Q 150 -20 286 96"
          className={styles.flown}
          stroke={`url(#${id}-g)`}
          strokeDasharray={`${p * ARC} 400`}
        />
        <g transform={`translate(${plane.x.toFixed(1)} ${plane.y.toFixed(1)})`}>
          <circle r="12" className={styles.plane} />
          <path d="M-6 0 L6 0 M2 -4 L6 0 L2 4" className={styles.arrow} />
        </g>
      </svg>
      <div className={styles.tiles}>
        <div>
          <span>Выход</span>
          <b>{flight.gate}</b>
        </div>
        <div>
          <span>До&nbsp;конца посадки</span>
          <b>{left > 0 && left < 600 ? `${left} мин` : '—'}</b>
        </div>
      </div>
    </aside>
  );
}
