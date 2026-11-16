import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import styles from './OptionGroup.module.css';

export interface Option {
  id: string;
  /** Содержимое карточки — оно же имя варианта для скринридера */
  content: ReactNode;
}

interface OptionGroupProps {
  label: string;
  options: Option[];
  value: string | null;
  onChange: (id: string) => void;
  columns?: 1 | 2 | 3;
}

/** Варианты-карточки как радиогруппа: стрелки двигают выбор, Enter/пробел выбирают */
export function OptionGroup({ label, options, value, onChange, columns = 3 }: OptionGroupProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = Math.max(
    0,
    options.findIndex((o) => o.id === value),
  );

  const onKey = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const d =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? -1
          : 0;
    if (!d) return;
    e.preventDefault();
    const next = (i + d + options.length) % options.length;
    onChange(options[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} className={styles.group} data-cols={columns}>
      {options.map((o, i) => (
        <button
          key={o.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={o.id === value}
          tabIndex={i === current ? 0 : -1}
          className={styles.option}
          onClick={() => onChange(o.id)}
          onKeyDown={onKey(i)}
        >
          {o.content}
          <span aria-hidden="true" className={styles.mark} />
        </button>
      ))}
    </div>
  );
}
