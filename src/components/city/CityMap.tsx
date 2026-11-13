import type { Place } from '@/types/city';
import styles from './CityMap.module.css';

interface CityMapProps {
  places: Place[];
  /** id активного места — пульсирует */
  active?: string;
  label: string;
  /** Номера на метках (как в списке «Советуем») */
  numbered?: boolean;
  onPick?: (place: Place) => void;
}

/**
 * Схема 440×300: условные улицы и река, метки мест по place.map.
 * Метки — HTML-кнопки поверх SVG, чтобы до них можно было дойти с клавиатуры.
 */
export function CityMap({ places, active, label, numbered, onPick }: CityMapProps) {
  return (
    <div className={styles.map}>
      <svg
        role="img"
        aria-label={label}
        viewBox="0 0 440 300"
        preserveAspectRatio="xMidYMid slice"
        className={styles.svg}
      >
        <rect width="440" height="300" className={styles.ground} />
        <g className={styles.streets}>
          <path d="M0 70 H440" />
          <path d="M0 160 H440" />
          <path d="M0 240 H440" />
          <path d="M120 0 V300" />
          <path d="M300 0 V300" />
        </g>
        <path
          className={styles.river}
          d="M60 300 C 120 230 180 230 220 180 S 300 90 360 60 S 420 20 440 10"
        />
      </svg>
      {places.map((p, i) => {
        const on = p.id === active;
        const style = { left: `${(p.map.x / 440) * 100}%`, top: `${(p.map.y / 300) * 100}%` };
        const content = (
          <>
            {on && <span aria-hidden="true" className={styles.ping} />}
            {numbered && <span className={styles.num}>{i + 1}</span>}
          </>
        );
        return onPick ? (
          <button
            key={p.id}
            type="button"
            className={[styles.pin, on && styles.on, numbered && styles.numbered]
              .filter(Boolean)
              .join(' ')}
            style={style}
            aria-label={`${p.name} на карте`}
            aria-current={on || undefined}
            onClick={() => onPick(p)}
          >
            {content}
          </button>
        ) : (
          <span
            key={p.id}
            aria-hidden="true"
            className={[styles.pin, on && styles.on, numbered && styles.numbered]
              .filter(Boolean)
              .join(' ')}
            style={style}
          >
            {content}
          </span>
        );
      })}
    </div>
  );
}
