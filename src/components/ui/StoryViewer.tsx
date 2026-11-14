import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { lockScroll } from '@/lib/scroll';
import { typograph } from '@/lib/typograph';
import styles from './StoryViewer.module.css';

const SLIDE_MS = 3200;

export interface StorySlide {
  src: string;
  text: string;
}

interface StoryViewerProps {
  title: string;
  slides: StorySlide[];
  reduced: boolean;
  onClose: () => void;
  /** С какого слайда начать */
  start?: number;
}

/** Сторис: слайды по 3,2 с, тап слева — назад, справа — вперёд, Esc закрывает */
export function StoryViewer({ title, slides, reduced, onClose, start = 0 }: StoryViewerProps) {
  const [slide, setSlide] = useState(start);
  const closeRef = useRef<HTMLButtonElement>(null);
  const last = slides.length - 1;

  useEffect(() => {
    lockScroll(true);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setSlide((s) => Math.min(last, s + 1));
      if (e.key === 'ArrowLeft') setSlide((s) => Math.max(0, s - 1));
      // Фокус остаётся внутри: единственная кнопка — «Закрыть»
      if (e.key === 'Tab') {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [onClose, last]);

  // Автоперелистывание; после последнего слайда — закрыть
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => (slide < last ? setSlide(slide + 1) : onClose()), SLIDE_MS);
    return () => clearTimeout(t);
  }, [slide, last, reduced, onClose]);

  const forward = () => (slide < last ? setSlide(slide + 1) : onClose());

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title}>
      <div className={styles.card}>
        <img key={slide} src={slides[slide].src} alt="" className={styles.photo} />
        <span aria-hidden="true" className={styles.shade} />

        <div aria-hidden="true" className={styles.bars}>
          {slides.map((_, k) => (
            <span key={k} className={styles.bar}>
              <span
                className={[
                  styles.fill,
                  k < slide && styles.full,
                  k === slide && (reduced ? styles.full : styles.run),
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            </span>
          ))}
        </div>

        <span className={styles.title}>{title}</span>
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          aria-label="Закрыть историю"
          onClick={onClose}
        >
          <Icon name="close" size={18} />
        </button>

        {/* Тап-зоны дублируют стрелки ← → на клавиатуре */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className={`${styles.zone} ${styles.back}`}
          onClick={() => setSlide(Math.max(0, slide - 1))}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className={`${styles.zone} ${styles.fwd}`}
          onClick={forward}
        />

        <p key={`t${slide}`} className={styles.text} aria-live="polite">
          {typograph(slides[slide].text)}
        </p>
        <span className={styles.hint}>
          {slide + 1} из {slides.length} · стрелки ← →
        </span>
      </div>
    </div>
  );
}
