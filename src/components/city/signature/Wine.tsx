import { useRef } from 'react';
import { useInView } from '@/lib/motion';
import { typograph } from '@/lib/typograph';
import styles from './Signature.module.css';

const FACTS: [string, string][] = [
  ['500+', 'местных сортов винограда'],
  ['Ртвели', 'сбор урожая в сентябре–октябре'],
  ['Кахетия', 'главный винный регион'],
];

/** Тбилиси: «Вино в квеври» — бокал наполняется, когда секция входит в экран */
export function Wine() {
  const root = useRef<HTMLElement>(null);
  const visible = useInView(root);

  return (
    <section ref={root} className={`${styles.band} ${styles.wine}`} aria-labelledby="wine-title">
      <svg
        aria-hidden="true"
        className={styles.vine}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          className={visible ? styles.draw : undefined}
          d="M-20 60 C 160 10 300 110 480 60 S 820 0 980 60 S 1300 120 1460 50"
        />
      </svg>
      <div className={styles.inner}>
        <div className={styles.text}>
          <span className={styles.eyebrow}>Главное в&nbsp;Грузии</span>
          <h2 id="wine-title" className={styles.title}>
            Вино в&nbsp;квеври
          </h2>
          <p className={styles.lead}>
            {typograph(
              'Грузинскому виноделию около 8000 лет. Вино выдерживают в глиняных кувшинах-квеври, закопанных в землю — этот способ включён в список нематериального наследия ЮНЕСКО.',
            )}
          </p>
          <dl className={styles.facts}>
            {FACTS.map(([big, small]) => (
              <div key={big}>
                <dt>{big}</dt>
                <dd>{typograph(small)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <svg
          role="img"
          aria-label="Бокал, который наполняется вином"
          viewBox="0 0 200 300"
          className={styles.glass}
        >
          <defs>
            <clipPath id="wine-bowl">
              <path d="M50 30 L150 30 C150 120 130 160 100 165 C70 160 50 120 50 30Z" />
            </clipPath>
            <linearGradient id="wine-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className={styles.wineTop} />
              <stop offset="1" className={styles.wineBottom} />
            </linearGradient>
          </defs>
          <g clipPath="url(#wine-bowl)">
            <rect
              className={`${styles.liquid} ${visible ? styles.filled : ''}`}
              x="40"
              y="72"
              width="120"
              height="100"
              fill="url(#wine-fill)"
            />
          </g>
          <path
            className={styles.bowl}
            d="M50 30 L150 30 C150 120 130 160 100 165 C70 160 50 120 50 30Z"
          />
          <path className={styles.shine} d="M68 44 C 66 90 74 126 88 146" />
          <line className={styles.stem} x1="100" y1="165" x2="100" y2="255" />
          <ellipse className={styles.stem} cx="100" cy="258" rx="42" ry="9" />
        </svg>
      </div>
    </section>
  );
}
