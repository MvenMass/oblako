import type { ReactNode } from 'react';
import styles from './SectionHead.module.css';

interface SectionHeadProps {
  eyebrow?: ReactNode;
  /** Акцентное слово оборачивайте в <span className="grad"> */
  title: ReactNode;
  lead?: ReactNode;
  /** Кнопки или ссылка справа от заголовка */
  action?: ReactNode;
  level?: 1 | 2 | 3;
  id?: string;
  className?: string;
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  action,
  level = 2,
  id,
  className,
}: SectionHeadProps) {
  const Heading = `h${level}` as 'h1' | 'h2' | 'h3';
  return (
    <div className={[styles.head, className].filter(Boolean).join(' ')}>
      <div className={styles.text}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <Heading id={id} className={styles[`h${level}`]}>
          {title}
        </Heading>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
