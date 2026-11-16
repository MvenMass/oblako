import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { photoSrcSet } from '@/lib/img';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Button } from '@/components/ui/Button';
import { useMediaQuery, useReducedMotion } from '@/lib/motion';
import type { TripPhoto } from '@/lib/journal';
import styles from './PhotoTable.module.css';

gsap.registerPlugin(Draggable, InertiaPlugin);

export interface TableItem {
  photo: TripPhoto;
  src?: string;
  trip: string;
}

interface PhotoTableProps {
  items: TableItem[];
  onOpen: (index: number) => void;
}

/** Стол с полароидами: тянуть с инерцией, клик — сторис, кнопки «Предыдущее/Следующее» */
export function PhotoTable({ items, onOpen }: PhotoTableProps) {
  const reduced = useReducedMotion();
  const phone = useMediaQuery('(max-width: 639px)');
  const tablet = useMediaQuery('(max-width: 1023px)');
  const cols = phone ? 2 : tablet ? 4 : 6;
  const table = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const top = useRef(10);
  const [active, setActive] = useState(0);
  const rows = Math.ceil(items.length / cols);
  // Шаг ряда и ширина карточки: на телефоне полароиды меньше
  const rowH = phone ? 220 : 290;
  const cardW = phone ? 150 : 200;
  const ids = items.map((i) => i.photo.id).join('|');

  // Каждый полароид — Draggable; инерция выключается при reduced motion
  useEffect(() => {
    const el = table.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-pola]'));
    let list: Draggable[] = [];
    try {
      list = cards.map(
        (card) =>
          Draggable.create(card, {
            type: 'x,y',
            bounds: el,
            inertia: !reduced,
            dragClickables: true,
            zIndexBoost: false,
            onPress() {
              moved.current = false;
              top.current += 1;
              card.style.zIndex = String(top.current);
            },
            onDragStart() {
              moved.current = true;
            },
          })[0],
      );
    } catch {
      // Без указателя стол остаётся рабочим с клавиатуры
    }
    return () => list.forEach((d) => d.kill());
  }, [ids, reduced, cols]);

  const focusCard = (i: number) => {
    const n = (i + items.length) % items.length;
    setActive(n);
    const card = table.current?.querySelectorAll<HTMLElement>('[data-pola]')[n];
    if (card) {
      top.current += 1;
      card.style.zIndex = String(top.current);
      card.focus();
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <Button
          variant="glass"
          size="sm"
          iconStart="chevron-left"
          onClick={() => focusCard(active - 1)}
        >
          Предыдущее фото
        </Button>
        <Button
          variant="glass"
          size="sm"
          iconEnd="chevron-right"
          onClick={() => focusCard(active + 1)}
        >
          Следующее фото
        </Button>
      </div>
      <div ref={table} className={styles.table} style={{ height: `${rows * rowH + 70}px` }}>
        {items.map((it, i) => {
          const r = ((i * 47) % 17) - 8;
          return (
            <button
              key={it.photo.id}
              type="button"
              data-pola
              className={styles.pola}
              aria-label={`${it.photo.place.name}, ${it.trip}. Открыть сторис`}
              style={
                {
                  left: `calc(${(i % cols) / Math.max(cols - 1, 1)} * (100% - ${cardW + 40}px) + ${10 + ((i * 37) % 30)}px)`,
                  top: `${30 + Math.floor(i / cols) * rowH + ((i * 53) % 50)}px`,
                  '--r': `${r}deg`,
                } as CSSProperties
              }
              onFocus={() => setActive(i)}
              onClick={() => {
                if (moved.current) {
                  moved.current = false;
                  return;
                }
                onOpen(i);
              }}
            >
              {/* Наклон — на обёртке: transform кнопки занят Draggable */}
              <span className={styles.paper}>
                <span className={styles.frame}>
                  {it.src ? (
                    <img
                      src={it.src}
                      srcSet={photoSrcSet(it.src)}
                      sizes="180px"
                      alt=""
                      loading="lazy"
                      draggable={false}
                    />
                  ) : (
                    <span className={styles.ph} />
                  )}
                </span>
                <span className={styles.caption}>{it.photo.place.name}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
