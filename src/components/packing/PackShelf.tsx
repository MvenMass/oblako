import type { CSSProperties } from 'react';
import { itemLabel, ITEMS, STRAP_AFTER } from '@/lib/packing';
import { ItemArtSvg, type SceneProps } from './PackScene';
import { Suitcase } from './Suitcase';
import styles from './PackShelf.module.css';

// Чемодан на сцене стоит в (336, 112), размер 560×520 — слоты пересчитываем в проценты
const pct = (x: number, y: number) => ({
  left: `${((x - 336) / 560) * 100}%`,
  top: `${((y - 112) / 520) * 100}%`,
});

/** Телефон: чемодан сверху, полка вещей с горизонтальным скроллом; вещь «прыгает» в слот */
export function PackShelf({ packed, tips, onToggle }: SceneProps) {
  const inCase = ITEMS.filter((i) => packed[i.id]);
  const onFloor = ITEMS.filter((i) => !packed[i.id]);

  return (
    <div className={styles.wrap}>
      <div className={styles.case}>
        <Suitcase className={styles.svg} />
        <span
          aria-hidden="true"
          className={styles.strap}
          data-on={inCase.length > STRAP_AFTER || undefined}
        />
        {inCase.map((it) => (
          <button
            key={it.id}
            type="button"
            className={styles.packed}
            aria-pressed="true"
            aria-label={itemLabel(it.name, true)}
            style={{ ...pct(it.slot[0], it.slot[1]), '--r': `${it.slot[2]}deg` } as CSSProperties}
            onClick={() => onToggle(it.id)}
          >
            <ItemArtSvg id={it.id} />
          </button>
        ))}
      </div>
      <div className={styles.shelf} role="group" aria-label="Полка вещей">
        {onFloor.length ? (
          onFloor.map((it) => (
            <span key={it.id} className={styles.slot}>
              <button
                type="button"
                className={styles.thing}
                aria-pressed="false"
                aria-label={itemLabel(it.name, false, tips[it.id])}
                onClick={() => onToggle(it.id)}
              >
                <span className={styles.art}>
                  <ItemArtSvg id={it.id} />
                </span>
                <span className={styles.name}>{it.name}</span>
              </button>
              {tips[it.id] && (
                <span aria-hidden="true" className={styles.tip}>
                  совет
                </span>
              )}
            </span>
          ))
        ) : (
          <p className={styles.empty}>Полка пуста&nbsp;— всё в&nbsp;чемодане</p>
        )}
      </div>
    </div>
  );
}
