import type { CSSProperties, ElementType, ReactNode } from 'react';
import styles from './Glass.module.css';

interface GlassProps {
  as?: ElementType;
  tone?: 'light' | 'dark';
  /** Радиус в px; по умолчанию — карточка 28px */
  radius?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Glass({
  as: Tag = 'div',
  tone = 'light',
  radius = 28,
  className,
  style,
  children,
}: GlassProps) {
  const cls = [styles.glass, tone === 'dark' && styles.dark, className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} style={{ borderRadius: radius, ...style }}>
      {children}
    </Tag>
  );
}
