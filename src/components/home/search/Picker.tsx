import { useEffect, useId, useRef, type ReactNode } from 'react';
import styles from './Picker.module.css';

interface PickerProps {
  label: string;
  value: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Что за панель: listbox — список, dialog — сетка/счётчик */
  kind: 'listbox' | 'dialog';
  className?: string;
  /** Широкая панель (список городов) */
  wide?: boolean;
  /** Панель прижата к правому краю поля */
  alignEnd?: boolean;
  children: (close: () => void) => ReactNode;
}

/** Поле поиска с собственной стеклянной панелью вместо системного select */
export function Picker({
  label,
  value,
  open,
  onOpenChange,
  kind,
  className,
  wide,
  alignEnd,
  children,
}: PickerProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  // Возврат фокуса по id, а не через ref: функция вызывается из панели во время рендера
  const close = () => {
    onOpenChange(false);
    document.getElementById(`${id}-trigger`)?.focus();
  };

  // Клик мимо и Esc закрывают панель
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) onOpenChange(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onOpenChange(false);
      trigger.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={root} className={`${styles.field} ${className ?? ''}`} data-open={open || undefined}>
      <button
        ref={trigger}
        id={`${id}-trigger`}
        type="button"
        className={styles.trigger}
        aria-haspopup={kind}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => onOpenChange(!open)}
      >
        <span className={styles.label} id={`${id}-label`}>
          {label}
        </span>
        <span className={styles.value}>{value}</span>
        <span aria-hidden="true" className={styles.chevron} />
      </button>
      {open && (
        <div
          id={`${id}-panel`}
          className={`${styles.panel} ${wide ? styles.wide : ''} ${alignEnd ? styles.end : ''}`}
          role={kind === 'dialog' ? 'dialog' : undefined}
          aria-labelledby={`${id}-label`}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}
