import type { CSSProperties } from 'react';
import { ITEMS } from '@/lib/packing';
import styles from './PackExtras.module.css';

/** Доступный режим «Списком»: те же вещи чекбоксами */
export function PackList({
  packed,
  onToggle,
}: {
  packed: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const done = ITEMS.filter((i) => packed[i.id]).length;
  return (
    <details className={styles.list}>
      <summary>
        Списком
        <span>
          {done}/{ITEMS.length}
        </span>
      </summary>
      <div className={styles.grid}>
        {ITEMS.map((it) => (
          <button
            key={it.id}
            type="button"
            role="checkbox"
            aria-checked={!!packed[it.id]}
            className={styles.check}
            onClick={() => onToggle(it.id)}
          >
            <span aria-hidden="true" className={styles.box}>
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path d="M5 12l5 5 9-10" />
              </svg>
            </span>
            {it.name}
          </button>
        ))}
      </div>
    </details>
  );
}

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
