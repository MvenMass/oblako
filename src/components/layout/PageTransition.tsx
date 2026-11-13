import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/lib/motion';
import styles from './PageTransition.module.css';

// Клубы облаков вдоль внутреннего края: [y, выступ, радиус X, радиус Y]
const PUFFS: [number, number, number, number][] = [
  [-2, 4, 16, 10],
  [11, 14, 22, 12],
  [24, 2, 14, 9],
  [36, 18, 24, 13],
  [50, 6, 17, 11],
  [63, 16, 21, 12],
  [76, 1, 15, 10],
  [88, 12, 23, 13],
  [101, 5, 18, 10],
];

/** Пухлая стена облаков: внутренний слой с тенью и наружные клубы неровной формы */
function CloudWall({ side }: { side: 'left' | 'right' }) {
  const dir = side === 'left' ? 1 : -1;
  const edge = side === 'left' ? 100 : 0;
  return (
    <svg className={styles.svg} viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect className={styles.fill} width="100" height="100" />
      {PUFFS.map(([y, out, rx, ry], i) => (
        <ellipse
          key={`s${i}`}
          className={styles.shade}
          cx={edge + dir * (out - 6)}
          cy={y + 3}
          rx={rx}
          ry={ry}
        />
      ))}
      {PUFFS.map(([y, out, rx, ry], i) => (
        <ellipse
          key={`f${i}`}
          className={styles.fill}
          cx={edge + dir * (out - 9)}
          cy={y}
          rx={rx * 0.9}
          ry={ry * 0.9}
        />
      ))}
    </svg>
  );
}

/** Облачный переход: две стены облаков расходятся за 1,1 с при смене страницы */
export function PageTransition({ routeKey }: { routeKey: string }) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .set(root.current, { autoAlpha: 1 })
        .fromTo(
          '[data-wall="left"]',
          { xPercent: 0 },
          { xPercent: -115, duration: 1.1, ease: 'power3.inOut' },
          0,
        )
        .fromTo(
          '[data-wall="right"]',
          { xPercent: 0 },
          { xPercent: 115, duration: 1.1, ease: 'power3.inOut' },
          0,
        )
        .set(root.current, { autoAlpha: 0 });
    }, root);
    return () => ctx.revert();
  }, [routeKey, reduced]);

  if (reduced) return null;

  return (
    <div ref={root} className={styles.root} aria-hidden="true">
      <div data-wall="left" className={`${styles.wall} ${styles.left}`}>
        <CloudWall side="left" />
      </div>
      <div data-wall="right" className={`${styles.wall} ${styles.right}`}>
        <CloudWall side="right" />
      </div>
    </div>
  );
}
