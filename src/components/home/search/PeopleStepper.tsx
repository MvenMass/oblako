import { Icon } from '@/components/ui/Icon';
import styles from './Panels.module.css';

export const MIN_PEOPLE = 1;
export const MAX_PEOPLE = 6;

interface PeopleStepperProps {
  value: number;
  onChange: (n: number) => void;
  onDone: () => void;
}

/** «Сколько»: счётчик −/+ и подсказка о составе поездки */
export function PeopleStepper({ value, onChange, onDone }: PeopleStepperProps) {
  const note =
    value === 1
      ? 'Соло-поездка'
      : value === 2
        ? 'Вдвоём'
        : value <= 4
          ? 'Семья или друзья'
          : 'Компания';
  return (
    <div className={styles.people}>
      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.step}
          aria-label="Меньше"
          disabled={value <= MIN_PEOPLE}
          onClick={() => onChange(value - 1)}
        >
          <span aria-hidden="true" className={styles.minus} />
        </button>
        <span className={styles.count} aria-live="polite">
          <b>{value}</b>
          <span>{note}</span>
        </span>
        <button
          type="button"
          className={styles.step}
          aria-label="Больше"
          disabled={value >= MAX_PEOPLE}
          onClick={() => onChange(value + 1)}
        >
          <Icon name="plus" size={18} />
        </button>
      </div>
      <button type="button" className={styles.done} onClick={onDone}>
        Готово
      </button>
    </div>
  );
}
