import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { photoSrcSet } from '@/lib/img';
import { Chip } from '@/components/ui/Chip';
import { useReducedMotion } from '@/lib/motion';
import { CATEGORY_LABEL, categoriesOf } from '@/lib/places';
import type { City, PlaceCategory } from '@/types/city';
import { CityMap } from './CityMap';
import { CitySection } from './CitySection';
import { GalleryInfo } from './GalleryInfo';
import styles from './Gallery.module.css';

const AUTOPLAY_MS = 5200;
const SWIPE = 50;

/** Позиция карточки в стопке относительно активной: 0, +1, +2, −1 (ушедшая), иначе дальше */
function stackClass(pos: number) {
  return (
    ({ 0: styles.p0, 1: styles.p1, 2: styles.p2, [-1]: styles.pm1 } as Record<number, string>)[
      pos
    ] ?? styles.far
  );
}

/** «Куда сходить»: стопка фото с автоплеем, фильтр категорий, панель места и мини-карта */
export function Gallery({ city }: { city: City }) {
  const reduced = useReducedMotion();
  const [cat, setCat] = useState<PlaceCategory | 'all'>('all');
  const [activeId, setActiveId] = useState(city.places[0].id);
  const [hold, setHold] = useState(false);
  const swipeX = useRef<number | null>(null);

  const list = useMemo(
    () => (cat === 'all' ? city.places : city.places.filter((p) => p.category === cat)),
    [cat, city.places],
  );
  const index = Math.max(
    0,
    list.findIndex((p) => p.id === activeId),
  );
  const place = list[index];
  const step = (d: number) => setActiveId(list[(index + d + list.length) % list.length].id);

  // Автоплей: пауза при наведении, фокусе и reduced motion
  useEffect(() => {
    if (reduced || hold || list.length < 2) return;
    const t = setTimeout(() => setActiveId(list[(index + 1) % list.length].id), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [reduced, hold, list, index]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    step(e.key === 'ArrowRight' ? 1 : -1);
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) >= SWIPE) step(dx < 0 ? 1 : -1);
  };

  const pickCategory = (c: PlaceCategory | 'all') => {
    setCat(c);
    const first = (c === 'all' ? city.places : city.places.filter((p) => p.category === c))[0];
    if (first) setActiveId(first.id);
  };

  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
  return (
    <CitySection
      id="gallery"
      title={
        <>
          Куда <span className="grad">сходить</span>
        </>
      }
      aside={
        <div className={styles.filters} role="group" aria-label="Фильтр мест">
          {(['all', ...categoriesOf(city.places)] as const).map((c) => (
            <Chip key={c} size="lg" selected={cat === c} onToggle={() => pickCategory(c)}>
              {c === 'all' ? 'Всё' : CATEGORY_LABEL[c]}
            </Chip>
          ))}
        </div>
      }
    >
      <div className={styles.layout}>
        {/* Паттерн карусели: стрелки работают в сфокусированном регионе (a11y-safari.md) */}
        <div
          className={styles.stack}
          role="region"
          aria-roledescription="карусель"
          aria-label="Фотографии мест. Стрелки ← → листают"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={(e) => (swipeX.current = e.clientX)}
          onPointerUp={onPointerUp}
          onMouseEnter={() => setHold(true)}
          onMouseLeave={() => setHold(false)}
          onFocus={() => setHold(true)}
          onBlur={() => setHold(false)}
        >
          {list.map((p, i) => {
            let pos = (i - index + list.length) % list.length;
            if (pos === list.length - 1 && list.length > 2) pos = -1;
            const active = pos === 0;
            return (
              <figure
                key={p.id}
                className={`${styles.card} ${stackClass(pos)}`}
                aria-hidden={!active || undefined}
              >
                <img
                  src={p.photo}
                  srcSet={photoSrcSet(p.photo)}
                  sizes="(max-width: 767px) 80vw, 460px"
                  alt={active ? p.name : ''}
                  draggable={false}
                  loading={Math.abs(pos) <= 1 ? 'eager' : 'lazy'}
                  className={active && !reduced ? styles.kb : undefined}
                />
                <span aria-hidden="true" className={styles.shade} />
                <span className={styles.tag}>{CATEGORY_LABEL[p.category]}</span>
                <figcaption className={styles.caption}>
                  <span className={styles.name}>{p.name}</span>
                  <span className={styles.district}>{p.district}</span>
                </figcaption>
                <span aria-hidden="true" className={styles.bar}>
                  {active && (
                    <span
                      key={p.id}
                      className={reduced ? styles.barFull : styles.barRun}
                      style={{ animationPlayState: hold ? 'paused' : 'running' }}
                    />
                  )}
                </span>
              </figure>
            );
          })}
        </div>

        <div className={styles.side}>
          <GalleryInfo city={city} place={place} index={index} total={list.length} onStep={step} />
          <CityMap
            places={city.places}
            active={place.id}
            label="Мини-карта: где находится место"
            onPick={(p) => {
              setCat('all');
              setActiveId(p.id);
            }}
          />
          <span className={styles.credit}>Фото: Pexels · цены ориентировочные, демо</span>
        </div>
      </div>
    </CitySection>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
}
