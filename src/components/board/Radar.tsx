import styles from './Radar.module.css';

// Отметки самолётов — декор: [x, y, задержка]
const BLIPS = [
  [153, 204, 1.81],
  [98, 68, 3.7],
  [126, 210, 2.03],
  [197, 101, 0.74],
  [59, 197, 2.52],
  [161, 84, 0.38],
  [183, 47, 0.36],
  [99, 142, 2.77],
  [117, 19, 3.93],
];

/** Радар «Небо над Москвой»: конический луч и затухающие отметки */
export function Radar({ compact }: { compact?: boolean }) {
  return (
    <div className={`${styles.radar} ${compact ? styles.compact : ''}`}>
      <svg role="img" aria-label="Радар: самолёты вокруг Москвы, демо" viewBox="0 0 260 260">
        <g className={styles.grid}>
          <circle cx="130" cy="130" r="40" />
          <circle cx="130" cy="130" r="80" />
          <circle cx="130" cy="130" r="120" />
          <path d="M10 130 H250 M130 10 V250" />
        </g>
        {BLIPS.map(([x, y, d]) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="4"
            className={styles.blip}
            style={{ animationDelay: `${d}s` }}
          />
        ))}
        <circle cx="130" cy="130" r="5" className={styles.home} />
        {!compact && (
          <text x="140" y="126" className={styles.label}>
            MOW
          </text>
        )}
      </svg>
      <span aria-hidden="true" className={styles.sweep} />
    </div>
  );
}
