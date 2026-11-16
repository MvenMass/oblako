import { useReducedMotion } from '@/lib/motion';
import styles from './DestBackdrop.module.css';

// Облако-«подушка» из макетов: эллипс и четыре круга
function Cloud({ x, y, s, delay }: { x: number; y: number; s: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className={styles.sail} style={{ animationDelay: `${delay}s` }}>
        <ellipse cx="150" cy="92" rx="138" ry="26" />
        <circle cx="88" cy="76" r="40" />
        <circle cx="150" cy="58" r="56" />
        <circle cx="214" cy="72" r="44" />
        <circle cx="256" cy="86" r="26" />
      </g>
    </g>
  );
}

const ROUTES = [
  'M-40 420 C 260 220, 520 260, 760 180 S 1240 60, 1500 140',
  'M-40 760 C 300 640, 640 700, 900 560 S 1300 420, 1500 470',
];

/** Живое небо «Направлений»: градиент, облака и пунктирные маршруты с самолётиками */
export function DestBackdrop() {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden="true" className={styles.wrap}>
      <svg className={styles.svg} viewBox="0 0 1440 1100" preserveAspectRatio="xMidYMin slice">
        <defs>
          <filter id="dest-cloud-blur" x="-40%" y="-60%" width="180%" height="220%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>
        <g className={styles.clouds} filter="url(#dest-cloud-blur)">
          <Cloud x={-60} y={110} s={1.2} delay={0} />
          <Cloud x={980} y={40} s={1.4} delay={-14} />
          <Cloud x={520} y={560} s={1.5} delay={-7} />
          <Cloud x={1160} y={660} s={1.1} delay={-22} />
          <Cloud x={60} y={860} s={1.3} delay={-30} />
        </g>
        {ROUTES.map((d, i) => (
          <g key={d}>
            <path d={d} className={styles.route} />
            {!reduced && (
              <g className={styles.plane}>
                <path d="M-9 0 L9 0 M3 -5 L9 0 L3 5" />
                <animateMotion
                  dur={`${26 + i * 8}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                  path={d}
                />
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
