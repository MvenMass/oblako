import { useEffect, useRef, useState } from 'react';
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

/** «Инструменты»: горизонтальная лента из 8 карточек со стрелками */
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
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const scroll = (dir: 1 | -1) =>
    strip.current?.scrollBy({ left: dir * STEP, behavior: reduced ? 'auto' : 'smooth' });

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

      <ul ref={strip} className={styles.strip}>
        {TOOLS.map((tool) => (
          <li key={tool.to} className={styles.item}>
            <Link to={tool.to} className={styles.card}>
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
