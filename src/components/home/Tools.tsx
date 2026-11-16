import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import { TOOLS } from '@/data/home';
import { useReducedMotion } from '@/lib/motion';
import { typograph } from '@/lib/typograph';
import { ToolPreview } from './ToolPreview';
import styles from './Tools.module.css';

const STEP = 320;

/** «Инструменты»: лента из 8 карточек — кнопки, колесо мыши, перетаскивание и стрелки ←/→ */
export function Tools() {
  const strip = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft <= 2,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      });
    update();

    // Вертикальное колесо листает ленту вбок, пока есть куда; на краях — обычная прокрутка страницы
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const atStart = el.scrollLeft <= 2;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    // Перетаскивание мышью; после перетаскивания клик по карточке не срабатывает
    let drag: { x: number; left: number } | null = null;
    let moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: el.scrollLeft };
      moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 5) {
        moved = true;
        el.dataset.dragging = '';
      }
      el.scrollLeft = drag.left - dx;
    };
    const onUp = () => {
      drag = null;
      delete el.dataset.dragging;
    };
    const onClick = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };

    el.addEventListener('scroll', update, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClick, true);
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('click', onClick, true);
      window.removeEventListener('resize', update);
    };
  }, []);

  const scroll = (dir: 1 | -1) =>
    strip.current?.scrollBy({ left: dir * STEP, behavior: reduced ? 'auto' : 'smooth' });

  // Стрелки на карточке переводят фокус на соседнюю — лента прокручивается за фокусом
  const onCardKey = (i: number) => (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = i + (e.key === 'ArrowRight' ? 1 : -1);
    const link = strip.current?.querySelectorAll<HTMLAnchorElement>('a')[next];
    link?.focus();
    link?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  return (
    <section className={styles.section} aria-labelledby="tools-title">
      <div className="container">
        <SectionHead
          id="tools-title"
          eyebrow="Инструменты"
          title={
            <>
              Всё для&nbsp;поездки&nbsp;— <span className="grad">в&nbsp;одном облаке</span>
            </>
          }
          action={
            <>
              <Button
                variant="glass"
                iconOnly
                aria-label="Прокрутить назад"
                disabled={edges.start}
                onClick={() => scroll(-1)}
              >
                <Icon name="chevron-left" />
              </Button>
              <Button
                variant="dark"
                iconOnly
                aria-label="Прокрутить вперёд"
                disabled={edges.end}
                onClick={() => scroll(1)}
              >
                <Icon name="chevron-right" />
              </Button>
            </>
          }
        />
      </div>

      <ul ref={strip} className={styles.strip} data-lenis-prevent-wheel>
        {TOOLS.map((tool, i) => (
          <li key={tool.to} className={styles.item}>
            <Link to={tool.to} className={styles.card} draggable={false} onKeyDown={onCardKey(i)}>
              <span aria-hidden="true" className={styles.preview}>
                <span className={styles.previewInner}>
                  <ToolPreview kind={tool.preview} />
                </span>
              </span>
              <span className={styles.text}>
                <span className={styles.title}>{tool.title}</span>
                <span className={styles.desc}>{typograph(tool.text)}</span>
              </span>
              <span aria-hidden="true" className={styles.open}>
                Открыть
                <Icon name="arrow-right" size={16} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
