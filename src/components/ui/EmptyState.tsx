import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title: ReactNode;
  text?: ReactNode;
  /** Одна CTA */
  action: ReactNode;
  /** Уровень заголовка: на пустой странице — h1 */
  level?: 1 | 2 | 3;
}

/** Пустое состояние: стеклянная карточка, облако и одна кнопка (states.md) */
export function EmptyState({ title, text, action, level = 2 }: EmptyStateProps) {
  const H = `h${level}` as const;
  return (
    <div className={styles.box}>
      <svg aria-hidden="true" viewBox="0 0 120 80" className={styles.cloud}>
        <ellipse cx="60" cy="72" rx="44" ry="5" className={styles.shadow} />
        <path
          className={styles.body}
          d="M30 64h62a20 20 0 0 0 2-39.9A27 27 0 0 0 42 18a22 22 0 0 0-12 46z"
        />
        <path className={styles.gloss} d="M40 30a14 14 0 0 1 16-8" />
      </svg>
      <H className={styles.title}>{title}</H>
      {text && <p className={styles.text}>{text}</p>}
      <div className={styles.action}>{action}</div>
    </div>
  );
}
