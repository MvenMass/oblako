import type { ReactNode } from 'react';
import styles from './CitySection.module.css';

interface CitySectionProps {
  id?: string;
  title: ReactNode;
  /** Подпись или фильтр справа от заголовка */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Секция страницы города: заголовок H2 + содержимое в контейнере 1280 */
export function CitySection({ id, title, aside, children, className }: CitySectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      className={[styles.section, className].filter(Boolean).join(' ')}
      aria-labelledby={headingId}
    >
      <div className={styles.head}>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
      {children}
    </section>
  );
}
