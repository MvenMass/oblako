import type { CSSProperties, ReactNode } from 'react';
import type { TodPalette } from '@/types/city';
import styles from './SceneFrame.module.css';

/** Детерминированные звёзды для неба 1440×780 */
const STARS = (() => {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 46 }, () => ({
    cx: Math.round(rnd() * 1440),
    cy: Math.round(rnd() * 380),
    r: rnd() > 0.7 ? 1.6 : 1.1,
    delay: -(rnd() * 3).toFixed(1),
  }));
})();

/** Слой параллакса: сдвиг за мышью на depth px (8 / 18 / 30 / 56) */
export function Layer({ depth, children }: { depth: number; children: ReactNode }) {
  return (
    <g className={styles.layer} style={{ '--depth': depth } as CSSProperties}>
      {children}
    </g>
  );
}

interface SceneFrameProps {
  palettes: TodPalette[];
  tod: number;
  /** Слои города — внутри общего SVG 1440×780 */
  children: ReactNode;
}

/** Общая часть всех сцен: три неба с кроссфейдом, звёзды, облака, солнце/луна */
export function SceneFrame({ palettes, tod, children }: SceneFrameProps) {
  const p = palettes[tod];
  return (
    <div aria-hidden="true" className={styles.frame}>
      {palettes.map((pal, i) => (
        <div
          key={i}
          className={styles.sky}
          style={{ background: pal.sky, opacity: i === tod ? 1 : 0 }}
        />
      ))}
      <svg className={styles.svg} viewBox="0 0 1440 780" preserveAspectRatio="xMidYMax slice">
        <defs>
          <filter id="scene-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
          <filter id="scene-cloud" x="-30%" y="-80%" width="160%" height="260%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        <g className={styles.stars}>
          {STARS.map((s, i) => (
            <circle
              key={i}
              className={styles.star}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              style={{ animationDelay: `${s.delay}s` }}
            />
          ))}
        </g>

        <g className={styles.clouds} filter="url(#scene-cloud)">
          <g className={styles.sail}>
            <ellipse cx="260" cy="150" rx="150" ry="28" />
            <ellipse cx="300" cy="132" rx="70" ry="34" />
          </g>
          <g className={styles.sail} style={{ animationDelay: '-18s' }}>
            <ellipse cx="900" cy="110" rx="190" ry="30" />
            <ellipse cx="860" cy="92" rx="80" ry="36" />
          </g>
        </g>

        <g
          className={styles.sun}
          style={{ '--sx': `${p.sx}px`, '--sy': `${p.sy}px` } as CSSProperties}
        >
          <circle r="130" className={styles.glow} filter="url(#scene-glow)" />
          <circle r="46" className={styles.disc} />
          <g className={styles.craters}>
            <circle cx="-14" cy="-8" r="7" />
            <circle cx="12" cy="14" r="5" />
          </g>
        </g>

        {children}
      </svg>
      <div className={styles.shade} />
    </div>
  );
}
