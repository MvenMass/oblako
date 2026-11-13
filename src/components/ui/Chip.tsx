import type { ReactNode } from 'react';
import styles from './Chip.module.css';

interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  /** С onToggle чип становится кнопкой-тогглом с aria-pressed, без него — бейджем */
  onToggle?: () => void;
  size?: 'md' | 'lg';
  className?: string;
}

export function Chip({ children, selected = false, onToggle, size = 'md', className }: ChipProps) {
  const cls = [styles.chip, size === 'lg' && styles.lg, selected && styles.selected, className]
    .filter(Boolean)
    .join(' ');

  if (!onToggle) return <span className={cls}>{children}</span>;

  return (
    <button type="button" className={cls} aria-pressed={selected} onClick={onToggle}>
      {children}
    </button>
  );
}
