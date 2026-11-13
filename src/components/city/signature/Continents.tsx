import { useRef } from 'react';
import { useInView } from '@/lib/motion';
import { typograph } from '@/lib/typograph';
import styles from './Signature.module.css';

const STAR =
  '30,4 35.7,16.1 48.4,11.6 43.9,24.3 56,30 43.9,35.7 48.4,48.4 35.7,43.9 30,56 24.3,43.9 11.6,48.4 16.1,35.7 4,30 16.1,24.3 11.6,11.6 24.3,16.1';
const CORNERS =
  'M0 0 h10 a10 10 0 0 1 -10 10z M60 0 v10 a10 10 0 0 1 -10 -10z M0 60 v-10 a10 10 0 0 1 10 10z M60 60 h-10 a10 10 0 0 1 10 -10z';

// Три вида изникской плитки, как в CityIstanbul.dc.html; 18 плиток сеткой 6×3
const VARIANTS = [styles.tileA, styles.tileB, styles.tileC];
const TILES = Array.from({ length: 18 }, (_, i) => VARIANTS[(i * 7 + Math.floor(i / 6)) % 3]);

/** Стамбул: «Город на двух континентах» — паром по Босфору и изникские плитки */
export function Continents() {
  const root = useRef<HTMLElement>(null);
  const visible = useInView(root);

  return (
    <section
      ref={root}
      className={`${styles.band} ${styles.istanbul}`}
      aria-labelledby="continents-title"
    >
      <div className={styles.inner}>
        <div className={styles.text}>
          <span className={styles.eyebrowIst}>Главное в&nbsp;Стамбуле</span>
          <h2 id="continents-title" className={styles.title}>
            Город на&nbsp;двух континентах
          </h2>
          <p className={styles.leadIst}>
            {typograph(
              'Босфор делит Стамбул на европейскую и азиатскую части. Паром между ними — обычный городской транспорт и лучшая экскурсия по городу.',
            )}
          </p>
          <div className={styles.strait}>
            <span>ЕВРОПА</span>
            <span aria-hidden="true" className={styles.boat} />
            <span>АЗИЯ</span>
          </div>
        </div>
        <div className={styles.tiles} aria-hidden="true">
          {TILES.map((variant, i) => (
            <svg
              key={i}
              viewBox="0 0 60 60"
              className={`${styles.tile} ${variant} ${visible ? styles.tileIn : ''}`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <rect width="60" height="60" className={styles.tileBg} />
              <polygon points={STAR} className={styles.tileStar} />
              <circle cx="30" cy="30" r="8" className={styles.tileDot} />
              <path d={CORNERS} className={styles.tileCorner} />
            </svg>
          ))}
        </div>
      </div>
    </section>
  );
}
