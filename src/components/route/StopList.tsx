import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';
import { Icon } from '@/components/ui/Icon';
import { useReducedMotion } from '@/lib/motion';
import { formatTime, move, type ScheduledStop } from '@/lib/route';
import type { Stop } from '@/types/user';
import styles from './StopList.module.css';

gsap.registerPlugin(Draggable, Flip);

interface StopListProps {
  items: ScheduledStop[];
  onChange: (stops: Stop[]) => void;
  /** Открыть карточку места */
  onOpen: (placeId: string) => void;
}

const hours = (min: number) =>
  min >= 60 ? `${+(min / 60).toFixed(1)} ч`.replace('.', ',') : `${min} мин`;

/** Точки дня: перетаскивание за ручку (Draggable + Flip), Alt+↑/↓ с клавиатуры, удаление */
export function StopList({ items, onChange, onOpen }: StopListProps) {
  const reduced = useReducedMotion();
  const list = useRef<HTMLOListElement>(null);
  const flip = useRef<Flip.FlipState | null>(null);
  const [status, setStatus] = useState('');
  const stops = items.map((x) => x.stop);

  const reorder = (from: number, to: number) => {
    if (to < 0 || to >= stops.length || from === to) return;
    if (list.current) flip.current = Flip.getState(list.current.children);
    onChange(move(stops, from, to));
    setStatus(`${items[from].place.name}: теперь ${to + 1}-я из ${stops.length}`);
  };

  // После перестановки соседи плавно переезжают на новые места
  useLayoutEffect(() => {
    if (flip.current && !reduced) Flip.from(flip.current, { duration: 0.4, ease: 'power2.out' });
    flip.current = null;
  });

  // Перетаскивание по вертикали за ручку; место определяется по центру карточки
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const rows = Array.from(el.children) as HTMLElement[];
    let draggables: Draggable[] = [];
    try {
      draggables = rows.map(
        (row, i) =>
          Draggable.create(row, {
            type: 'y',
            trigger: row.querySelector<HTMLElement>('[data-handle]') ?? row,
            zIndexBoost: true,
            onDragEnd() {
              const mid = row.getBoundingClientRect().top + row.offsetHeight / 2;
              let to = i;
              rows.forEach((other, k) => {
                const r = other.getBoundingClientRect();
                if (k !== i && mid > r.top && mid < r.bottom) to = k;
              });
              gsap.set(row, { y: 0 });
              reorder(i, to);
            },
          })[0],
      );
    } catch {
      // Без поддержки указателя список остаётся рабочим с клавиатуры
    }
    return () => draggables.forEach((d) => d.kill());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const onKey = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
    e.preventDefault();
    reorder(i, i + (e.key === 'ArrowUp' ? -1 : 1));
  };

  return (
    <>
      <ol ref={list} className={styles.list} aria-label="Точки дня">
        {items.map((x, i) => (
          <li key={x.stop.placeId} className={styles.item}>
            <button
              type="button"
              data-handle
              className={styles.handle}
              aria-label={`${x.place.name}: переместить, Alt и стрелки вверх-вниз`}
              onKeyDown={onKey(i)}
            >
              <svg aria-hidden="true" width="14" height="20" viewBox="0 0 14 20">
                {[4, 10, 16].map((y) => (
                  <g key={y}>
                    <circle cx="4" cy={y} r="2" />
                    <circle cx="10" cy={y} r="2" />
                  </g>
                ))}
              </svg>
            </button>
            <span className={styles.num} aria-hidden="true">
              {i + 1}
            </span>
            <span className={styles.text}>
              <button type="button" className={styles.name} onClick={() => onOpen(x.stop.placeId)}>
                {x.place.name}
                <span className="visually-hidden">: подробнее о месте</span>
              </button>
              <span className={styles.time}>
                {formatTime(x.arrive)}–{formatTime(x.leave)} · {hours(x.stop.minutes)}
              </span>
              {x.walkNext !== null && (
                <span className={styles.walk}>
                  пешком {x.walkNext}&nbsp;мин до&nbsp;следующей · демо
                </span>
              )}
            </span>
            <button
              type="button"
              className={styles.remove}
              aria-label={`Убрать «${x.place.name}» из дня`}
              onClick={() => {
                onChange(stops.filter((_, k) => k !== i));
                setStatus(`${x.place.name} убрана из дня`);
              }}
            >
              <Icon name="close" size={14} />
            </button>
          </li>
        ))}
      </ol>
      <p className="visually-hidden" aria-live="polite">
        {status}
      </p>
    </>
  );
}
