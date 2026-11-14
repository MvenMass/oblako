import type { CSSProperties } from 'react';
import { itemLabel, ITEMS, LIMIT_KG, STRAP_AFTER } from '@/lib/packing';
import { ITEM_ART } from './itemArt';
import { Suitcase } from './Suitcase';
import styles from './PackScene.module.css';

export interface SceneProps {
  packed: Record<string, boolean>;
  tips: Record<string, string>;
  kg: number;
  last: string | null;
  onToggle: (id: string) => void;
}

const fmt = (n: number) => n.toFixed(1).replace('.', ',');

export function ItemArtSvg({ id }: { id: string }) {
  const a = ITEM_ART[id];
  return (
    <svg aria-hidden="true" viewBox={a.viewBox} width={a.w} height={a.h} className="packArt">
      {a.body}
    </svg>
  );
}

/** «Льняной пол» 1232×720: чемодан, ремни, бирка и 15 вещей. Полёт — по дуге: X и Y с разными кривыми. */
export function PackScene({ packed, tips, kg, last, onToggle }: SceneProps) {
  const count = ITEMS.filter((i) => packed[i.id]).length;
  const strapped = count > STRAP_AFTER;
  const heavy = kg > LIMIT_KG - 2;

  return (
    <div className={styles.floor}>
      <div className={styles.scroll}>
        <div className={styles.stage}>
          <span aria-hidden="true" className={styles.shadow} />
          <Suitcase className={styles.case} />
          <span aria-hidden="true" className={styles.strapL} data-on={strapped || undefined} />
          <span aria-hidden="true" className={styles.strapR} data-on={strapped || undefined} />
          <div className={styles.tag} data-heavy={heavy || undefined} aria-live="polite">
            <span className={styles.tagTitle}>Багаж · лимит {LIMIT_KG}&nbsp;кг</span>
            <b>{fmt(kg)}&nbsp;кг</b>
            <span>{heavy ? 'почти лимит!' : `запас ${fmt(Math.max(0, LIMIT_KG - kg))} кг`}</span>
          </div>
          {ITEMS.map((it) => {
            const on = !!packed[it.id];
            const [x, y, r] = on ? it.slot : it.floor;
            return (
              <span
                key={it.id}
                className={styles.x}
                style={
                  { '--x': `${x}px`, zIndex: last === it.id ? 25 : on ? 10 : 2 } as CSSProperties
                }
              >
                <span className={styles.y} style={{ '--y': `${y}px` } as CSSProperties}>
                  <button
                    type="button"
                    className={styles.item}
                    aria-pressed={on}
                    aria-label={itemLabel(it.name, on, tips[it.id])}
                    style={{ '--r': `${r}deg`, '--s': on ? 0.72 : 1 } as CSSProperties}
                    onClick={() => onToggle(it.id)}
                  >
                    <ItemArtSvg id={it.id} />
                    <span className={styles.name} style={{ '--nr': `${-r}deg` } as CSSProperties}>
                      {it.name}
                    </span>
                    {tips[it.id] && <span className={styles.tip}>совет</span>}
                  </button>
                </span>
              </span>
            );
          })}
          <span aria-hidden="true" className={styles.hint}>
            Нажмите на&nbsp;вещь&nbsp;— она уложится в&nbsp;чемодан. Ещё раз&nbsp;— вернётся
            на&nbsp;пол.
          </span>
        </div>
      </div>
    </div>
  );
}
