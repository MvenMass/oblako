import { useState, type CSSProperties } from 'react';
import { typograph } from '@/lib/typograph';
import type { City } from '@/types/city';
import { CitySection } from './CitySection';
import styles from './Dishes.module.css';

/** «Попробовать»: карточки блюд переворачиваются по клику (aria-pressed) */
export function Dishes({ city }: { city: City }) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const { accent, accent2, folder } = city.theme;
  const tones = [
    [folder[1], accent],
    [accent2, folder[0]],
    [folder[1], accent2],
    [accent, folder[0]],
  ];

  const toggle = (i: number) =>
    setFlipped((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <CitySection
      id="dishes"
      title="Попробовать"
      aside={<>Нажмите на&nbsp;карточку&nbsp;— она перевернётся</>}
    >
      <div className={styles.grid}>
        {city.dishes.map((d, i) => {
          const on = flipped.has(i);
          const [t1, t2] = tones[i % tones.length];
          return (
            <button
              key={d.name}
              type="button"
              className={styles.card}
              aria-pressed={on}
              onClick={() => toggle(i)}
            >
              <span className={`${styles.flipper} ${on ? styles.flipped : ''}`}>
                <span className={`${styles.face} ${styles.front}`} aria-hidden={on || undefined}>
                  <span
                    aria-hidden="true"
                    className={styles.icon}
                    style={
                      { '--t1': t1, '--t2': t2, borderRadius: i % 2 ? 20 : '50%' } as CSSProperties
                    }
                  />
                  <span className={styles.frontText}>
                    <span className={styles.name}>{d.name}</span>
                    <span className={styles.hint}>Что это?</span>
                  </span>
                </span>
                <span className={`${styles.face} ${styles.back}`} aria-hidden={!on || undefined}>
                  <span className={styles.backName}>{d.name}</span>
                  <span className={styles.desc}>{typograph(d.text)}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </CitySection>
  );
}
