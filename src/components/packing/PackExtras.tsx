import type { CSSProperties } from 'react';
import styles from './PackExtras.module.css';

const COLORS = ['var(--sky)', 'var(--pink)', 'var(--dusk)', 'var(--season-sun)', 'var(--sky-deep)'];

/** Финал: конфетти и поздравление */
export function Confetti({ reduced }: { reduced: boolean }) {
  return (
    <>
      {!reduced && (
        <div aria-hidden="true" className={styles.confetti}>
          {Array.from({ length: 40 }, (_, k) => (
            <span
              key={k}
              style={
                {
                  left: `${(k * 37) % 100}%`,
                  background: COLORS[k % 5],
                  animationDelay: `${(k % 10) * 0.12}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
      <div role="status" className={styles.done}>
        Чемодан собран&nbsp;— хорошей поездки!
      </div>
    </>
  );
}
