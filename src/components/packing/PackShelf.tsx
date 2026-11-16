import type { CSSProperties } from 'react';
import { ITEMS, STRAP_AFTER } from '@/lib/packing';
import { ItemArtSvg, type SceneProps } from './PackScene';
import { Suitcase } from './Suitcase';
import styles from './PackShelf.module.css';

// Чемодан на сцене стоит в (336, 112), размер 560×520 — слоты пересчитываем в проценты
const pct = (x: number, y: number) => ({
  left: `${((x - 336) / 560) * 100}%`,
  top: `${((y - 112) / 520) * 100}%`,
});

const fmt = (n: number) => n.toFixed(1).replace('.', ',');

/**
 * Телефон и планшет: открытый чемодан с уложенными вещами и бирка веса.
 * Управление — списком ниже; отмеченная вещь «прыгает» в свой слот.
 */
export function PackShelf({ packed, kg, limit, custom }: SceneProps) {
  const inCase = ITEMS.filter((i) => packed[i.id]);
  const own = custom.filter((c) => packed[c.id]);
  const over = kg > limit;

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.case}>
        <Suitcase className={styles.svg} />
        <span className={styles.strap} data-on={inCase.length > STRAP_AFTER || undefined} />
        {inCase.map((it) => (
          <span
            key={it.id}
            className={styles.packed}
            style={{ ...pct(it.slot[0], it.slot[1]), '--r': `${it.slot[2]}deg` } as CSSProperties}
          >
            <ItemArtSvg id={it.id} />
          </span>
        ))}
        {own.slice(0, 4).map((c, i) => (
          <span
            key={c.id}
            className={styles.bundle}
            style={pct(640 + (i % 2) * 220, 330 + Math.floor(i / 2) * 140)}
          >
            {c.name}
          </span>
        ))}
        <span className={styles.tag} data-over={over || undefined}>
          {fmt(kg)} из {limit}&nbsp;кг
        </span>
      </div>
    </div>
  );
}
