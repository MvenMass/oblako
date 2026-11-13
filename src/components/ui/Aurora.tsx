import type { CSSProperties } from 'react';
import styles from './Aurora.module.css';

export interface AuroraBlob {
  size: number;
  color: string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  /** Сдвиг фазы анимации, с */
  delay?: number;
}

const DEFAULT_BLOBS: AuroraBlob[] = [
  { top: -200, right: -100, size: 640, color: 'var(--aurora-1)' },
  { top: 380, right: 280, size: 460, color: 'var(--aurora-2)', delay: -7 },
  { bottom: -220, left: 120, size: 560, color: 'var(--aurora-3)', delay: -13 },
];

interface AuroraProps {
  blobs?: AuroraBlob[];
  /** Зерно поверх (feTurbulence) */
  grain?: boolean;
  /** Ленты света */
  ribbons?: boolean;
  className?: string;
}

/** Фон-сияние. Декор: aria-hidden, при reduced motion неподвижен. */
export function Aurora({
  blobs = DEFAULT_BLOBS,
  grain = true,
  ribbons = false,
  className,
}: AuroraProps) {
  return (
    <div aria-hidden="true" className={[styles.aurora, className].filter(Boolean).join(' ')}>
      {blobs.map(({ size, color, delay = 0, ...pos }, i) => {
        const style: CSSProperties = {
          ...pos,
          width: size,
          height: size,
          background: color,
          animationDelay: `${delay}s`,
        };
        return <span key={i} className={styles.blob} style={style} />;
      })}

      {ribbons && (
        <svg className={styles.layer} viewBox="0 0 1440 1120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="aurora-ribbon" x1="0" x2="1">
              <stop offset="0" stopColor="white" stopOpacity="0" />
              <stop offset=".5" stopColor="white" stopOpacity=".9" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <filter id="aurora-soft">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          <path
            className={styles.ribbon}
            d="M-100 760 C 300 600, 600 980, 1000 700 S 1500 500, 1600 640"
            stroke="url(#aurora-ribbon)"
            strokeWidth="26"
            filter="url(#aurora-soft)"
          />
          <path
            className={styles.ribbon}
            d="M-100 820 C 320 680, 640 1020, 1040 760 S 1520 580, 1600 700"
            stroke="url(#aurora-ribbon)"
            strokeWidth="10"
            style={{ animationDelay: '-3s' }}
          />
        </svg>
      )}

      {grain && (
        <svg className={`${styles.layer} ${styles.grain}`}>
          <filter id="aurora-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".9"
              numOctaves={2}
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#aurora-grain)" />
        </svg>
      )}
    </div>
  );
}
