import type { Season } from '@/data/quiz';
import styles from './Steps.module.css';

/** Погода сезона в центре кольца: снег, солнце с облаком, вращающееся солнце, дождь */
export function SeasonIcon({ season }: { season: Season }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 80" className={styles.seasonIcon}>
      {season === 'winter' && (
        <g className={styles.snow}>
          <path d="M40 10 V70 M14 25 L66 55 M14 55 L66 25" />
          <path d="M34 16 L40 22 L46 16 M34 64 L40 58 L46 64" />
        </g>
      )}
      {season === 'spring' && (
        <>
          <circle cx="50" cy="30" r="14" className={styles.sun} />
          <path
            className={styles.cloud}
            d="M18 58 h36 a10 10 0 0 0 0 -20 a14 14 0 0 0 -26 -2 a10 10 0 0 0 -10 22z"
          />
        </>
      )}
      {season === 'summer' && (
        <g className={styles.spin}>
          <circle cx="40" cy="40" r="16" className={styles.sun} />
          {Array.from({ length: 8 }, (_, i) => (
            <rect
              key={i}
              x="38"
              y="6"
              width="4"
              height="12"
              rx="2"
              className={styles.sun}
              transform={`rotate(${i * 45} 40 40)`}
            />
          ))}
        </g>
      )}
      {season === 'autumn' && (
        <>
          <path
            className={styles.cloud}
            d="M14 46 h44 a12 12 0 0 0 0 -24 a16 16 0 0 0 -30 -2 a12 12 0 0 0 -14 26z"
          />
          {[22, 36, 50].map((x, i) => (
            <path
              key={x}
              className={styles.drop}
              d={`M${x} 54 l-4 12`}
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          ))}
        </>
      )}
    </svg>
  );
}
