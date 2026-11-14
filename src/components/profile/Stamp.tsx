import type { CSSProperties } from 'react';
import type { City } from '@/types/city';
import styles from './Passport.module.css';

const SHAPES = ['circle', 'rect', 'oval'] as const;
const INKS = [
  'var(--ink-wine)',
  'var(--ink-navy)',
  'var(--ink-rose)',
  'var(--ink-teal)',
  'var(--ink-moss)',
  'var(--ink-sky)',
];
// Позиции и наклоны на странице 380×460 — штампы ложатся «как попало»
const SPOTS: [number, number, number][] = [
  [30, 36, -12],
  [196, 26, 8],
  [50, 186, 6],
  [210, 176, -6],
  [24, 316, 10],
  [196, 316, -14],
];

interface StampProps {
  city: City;
  index: number;
  date: string;
  /** Порядок «впечатывания» на странице */
  order: number;
}

/** Штамп страны: чернила с неровным краем (feTurbulence + feDisplacementMap из Passport) */
export function Stamp({ city, index, date, order }: StampProps) {
  const shape = SHAPES[index % SHAPES.length];
  const [x, y, r] = SPOTS[order % SPOTS.length];
  return (
    <span
      className={styles.stamp}
      style={
        {
          left: x,
          top: y,
          '--r': `${r}deg`,
          '--ink': INKS[index % INKS.length],
          animationDelay: `${0.9 + order * 0.32}s`,
        } as CSSProperties
      }
    >
      <svg viewBox="0 0 140 140" width="140" height="140" aria-hidden="true">
        <g filter="url(#stamp-ink)" className={styles.inkG}>
          {shape === 'circle' && (
            <>
              <circle cx="70" cy="70" r="62" strokeWidth="4" />
              <circle cx="70" cy="70" r="52" strokeWidth="1.5" />
            </>
          )}
          {shape === 'rect' && (
            <>
              <rect x="6" y="20" width="128" height="100" rx="10" strokeWidth="4" />
              <rect x="14" y="28" width="112" height="84" rx="6" strokeWidth="1.5" />
            </>
          )}
          {shape === 'oval' && (
            <>
              <ellipse cx="70" cy="70" rx="66" ry="50" strokeWidth="4" />
              <ellipse cx="70" cy="70" rx="56" ry="40" strokeWidth="1.5" />
            </>
          )}
          <path d="M48 40 h44 M58 40 l6 -6 6 6" strokeWidth="2" />
          <text x="70" y="62" className={styles.country}>
            {city.country.toUpperCase()}
          </text>
          <text x="70" y="88" className={styles.iata}>
            {city.iata}
          </text>
          <text x="70" y="106" className={styles.date}>
            {date}
          </text>
        </g>
      </svg>
    </span>
  );
}
