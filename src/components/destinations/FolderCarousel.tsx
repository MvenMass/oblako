import {
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { Folder } from '@/components/ui/Folder';
import type { City } from '@/types/city';
import { Dossier } from './Dossier';
import styles from './FolderCarousel.module.css';

const SWIPE = 50;

interface FolderCarouselProps {
  cities: City[];
  active: number;
  open: boolean;
  hits: string[];
  onActive: (i: number) => void;
  onToggle: () => void;
}

/** Веер папок: активная по центру, соседи сдвинуты, наклонены и уменьшены (Cards.dc.html) */
export function FolderCarousel({
  cities,
  active,
  open,
  hits,
  onActive,
  onToggle,
}: FolderCarouselProps) {
  const swipe = useRef<{ x: number; done: boolean } | null>(null);
  const n = cities.length;
  const go = (d: number) => n && onActive((active + d + n) % n);

  // Стрелки работают, только когда фокус внутри карусели
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
    else return;
    e.preventDefault();
  };

  const onPointerDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, done: false };
  };
  const onPointerUp = (e: PointerEvent) => {
    const s = swipe.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) >= SWIPE) {
      s.done = true;
      go(dx < 0 ? 1 : -1);
    }
  };
  // Свайп не должен засчитываться как клик по папке
  const onClickCapture = (e: MouseEvent) => {
    if (swipe.current?.done) {
      e.stopPropagation();
      e.preventDefault();
    }
    swipe.current = null;
  };

  // Паттерн карусели WAI-ARIA: регион в фокусе, стрелки работают только внутри него (a11y-safari.md)
  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
  return (
    <div
      className={styles.stage}
      role="region"
      aria-roledescription="карусель"
      aria-label="Папки направлений. Стрелки ← → переключают папки"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClickCapture={onClickCapture}
    >
      <ul className={styles.track}>
        {cities.map((city, i) => {
          const d = i - active;
          const a = Math.abs(d);
          const isActive = d === 0;
          const spread = open && !isActive ? 1.35 : 1;
          const opacity = a > 3 ? 0 : open && !isActive ? 0.35 : 1 - a * 0.2;
          const scale = isActive ? (open ? 1.08 : 1) : Math.max(0.62, 1 - a * 0.1);
          const style: CSSProperties = {
            transform: `translate(${d * 230 * spread}px, ${d * d * 20 + (isActive && open ? 30 : 0)}px) rotate(${d * 6}deg) scale(${scale})`,
            zIndex: 20 - a,
            opacity,
            pointerEvents: opacity === 0 ? 'none' : undefined,
          };
          const hit = hits.includes(city.id);
          return (
            <li
              key={city.id}
              className={styles.slot}
              style={style}
              // Боковые папки кликабельны мышью, но вне порядка табуляции и скринридера
              aria-hidden={isActive ? undefined : true}
            >
              <Folder
                className={styles.folder}
                code={city.iata}
                title={city.name}
                subtitle={city.country}
                hit={hit}
                open={isActive && open}
                hint={isActive ? (open ? 'Закрыть досье' : 'Открыть досье') : 'Выбрать'}
                onSelect={isActive ? onToggle : () => onActive(i)}
                tabIndex={isActive ? undefined : -1}
                // Досье есть только у активной папки: у боковых нет aria-expanded
                children={isActive ? open ? <Dossier city={city} /> : null : undefined}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
