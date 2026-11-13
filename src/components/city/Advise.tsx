import { useState, type KeyboardEvent } from 'react';
import { nbsp } from '@/lib/cities';
import { CATEGORY_LABEL, categoriesOf } from '@/lib/places';
import type { City, PlaceCategory } from '@/types/city';
import { CityMap } from './CityMap';
import { CitySection } from './CitySection';
import styles from './Advise.module.css';

/** «Советуем»: табы по категориям, нумерованный список и карта с теми же номерами */
export function Advise({ city }: { city: City }) {
  const cats = categoriesOf(city.places);
  const [tab, setTab] = useState<PlaceCategory>(cats[0]);
  const [hover, setHover] = useState<string | undefined>();
  const places = city.places.filter((p) => p.category === tab);

  // Табы: стрелки ← → по WAI-ARIA, активируются сразу
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (cats.indexOf(tab) + d + cats.length) % cats.length;
    setTab(cats[next]);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <CitySection
      id="advise"
      title="Советуем"
      aside={
        <div role="tablist" aria-label="Категории мест" className={styles.tabs}>
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              id={`advise-tab-${c}`}
              aria-selected={c === tab}
              aria-controls="advise-panel"
              tabIndex={c === tab ? 0 : -1}
              className={styles.tab}
              onClick={() => setTab(c)}
              onKeyDown={onKeyDown}
            >
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      }
    >
      <div
        id="advise-panel"
        role="tabpanel"
        aria-labelledby={`advise-tab-${tab}`}
        className={styles.layout}
      >
        <ol className={styles.list}>
          {places.map((p, i) => (
            <li
              key={p.id}
              className={`${styles.item} ${hover === p.id ? styles.hover : ''}`}
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover(undefined)}
            >
              <span aria-hidden="true" className={styles.num}>
                {i + 1}
              </span>
              <span className={styles.text}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.sub}>
                  {p.district} · {nbsp(p.duration)} · {p.price}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <CityMap
          places={places}
          active={hover}
          numbered
          label={`Схема: места категории «${CATEGORY_LABEL[tab]}» на карте`}
        />
      </div>
    </CitySection>
  );
}
