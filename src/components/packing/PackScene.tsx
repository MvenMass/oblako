import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { itemLabel, itemName, ITEMS, STRAP_AFTER, type CustomItem } from '@/lib/packing';
import { ITEM_ART } from './itemArt';
import { Suitcase } from './Suitcase';
import styles from './PackScene.module.css';

export interface SceneProps {
  packed: Record<string, boolean>;
  tips: Record<string, string>;
  kg: number;
  last: string | null;
  days: number;
  limit: number;
  custom: CustomItem[];
  onToggle: (id: string) => void;
}

const BUNDLE_COLORS = ['var(--sky-light)', 'var(--over-bg)', 'var(--fit-bg)', 'var(--cloud-shade)'];
const W = 1232;
const H = 720;
// Свои вещи — свёртки поверх корпуса чемодана
const BUNDLES: [number, number, number][] = [
  [860, 452, -8],
  [640, 452, 6],
  [866, 340, 10],
  [636, 300, -6],
  [760, 380, 4],
  [700, 520, -10],
];

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
export function PackScene({ packed, tips, kg, last, days, limit, custom, onToggle }: SceneProps) {
  const count = ITEMS.filter((i) => packed[i.id]).length;
  const strapped = count > STRAP_AFTER;
  const heavy = kg > limit - 2;
  const over = kg > limit;
  const inCase = custom.filter((c) => packed[c.id]);
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Сцена 1232×720 вписывается в колонку
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = (w: number) => setScale(Math.min(1, w / W));
    fit(el.clientWidth || W);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => fit(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={styles.floor}>
      <div ref={box} className={styles.scroll} style={{ height: H * scale }}>
        <div className={styles.stage} style={{ transform: `scale(${scale})` }}>
          <span aria-hidden="true" className={styles.shadow} />
          <Suitcase className={styles.case} />
          <span aria-hidden="true" className={styles.strapL} data-on={strapped || undefined} />
          <span aria-hidden="true" className={styles.strapR} data-on={strapped || undefined} />
          <div className={styles.tag} data-heavy={heavy || undefined} aria-live="polite">
            <span className={styles.tagTitle}>Багаж · лимит {limit}&nbsp;кг</span>
            <b>{fmt(kg)}&nbsp;кг</b>
            <span>
              {over
                ? `перевес ${fmt(kg - limit)} кг`
                : heavy
                  ? 'почти лимит!'
                  : `запас ${fmt(limit - kg)} кг`}
            </span>
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
                    aria-label={itemLabel(itemName(it, days), on, tips[it.id])}
                    style={{ '--r': `${r}deg`, '--s': on ? 0.72 : 1 } as CSSProperties}
                    onClick={() => onToggle(it.id)}
                  >
                    <ItemArtSvg id={it.id} />
                    <span className={styles.name} style={{ '--nr': `${-r}deg` } as CSSProperties}>
                      {itemName(it, days)}
                    </span>
                  </button>
                  {/* Бейдж — рядом с кнопкой, а не внутри: подпись кнопки = видимый текст */}
                  {tips[it.id] && !on && (
                    <span
                      aria-hidden="true"
                      className={styles.tip}
                      style={{ left: ITEM_ART[it.id].w / 2 - 22, top: -ITEM_ART[it.id].h / 2 - 10 }}
                    >
                      совет
                    </span>
                  )}
                </span>
              </span>
            );
          })}
          {inCase.slice(0, BUNDLES.length).map((c, i) => {
            const [x, y, r] = BUNDLES[i];
            return (
              <span
                key={c.id}
                aria-hidden="true"
                className={styles.bundle}
                style={
                  {
                    left: x,
                    top: y,
                    '--r': `${r}deg`,
                    '--c': BUNDLE_COLORS[i % BUNDLE_COLORS.length],
                  } as CSSProperties
                }
              >
                {c.name}
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
