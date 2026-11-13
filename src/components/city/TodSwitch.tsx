import type { KeyboardEvent } from 'react';
import type { Tod } from '@/lib/cityTime';
import styles from './CityHero.module.css';

const OPTIONS: { label: string; icon: string }[] = [
  {
    label: 'День',
    icon: 'M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8',
  },
  {
    label: 'Закат',
    icon: 'M3 17h18M6 17a6 6 0 0 1 12 0M12 4v3M4.9 8.9l1.8 1.8M19.1 8.9l-1.8 1.8M3 21h18',
  },
  { label: 'Ночь', icon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z' },
];

/** Переключатель «День / Закат / Ночь»: radiogroup со стрелками */
export function TodSwitch({ value, onChange }: { value: Tod; onChange: (t: Tod) => void }) {
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const d =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? -1
          : 0;
    if (!d) return;
    e.preventDefault();
    const next = ((value + d + 3) % 3) as Tod;
    onChange(next);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Время суток" className={styles.tod}>
      {OPTIONS.map((o, i) => (
        <button
          key={o.label}
          type="button"
          role="radio"
          aria-checked={value === i}
          tabIndex={value === i ? 0 : -1}
          className={styles.todBtn}
          onClick={() => onChange(i as Tod)}
          onKeyDown={onKeyDown}
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
            {i === 0 && <circle cx="12" cy="12" r="4.5" />}
            <path d={o.icon} />
          </svg>
          {o.label}
        </button>
      ))}
    </div>
  );
}
