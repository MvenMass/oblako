import styles from './Stepper.module.css';

const STEPS = ['Рейс', 'Место', 'Оплата', 'Талон'];

/** Шаги бронирования; current = STEPS.length — всё пройдено */
export function Stepper({ current }: { current: number }) {
  return (
    <ol className={styles.steps} aria-label="Шаги бронирования">
      {STEPS.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'next';
        return (
          <li key={label} data-state={state} aria-current={i === current ? 'step' : undefined}>
            <span aria-hidden="true">{state === 'done' ? '✓' : i + 1}</span>
            {label}
            {state === 'done' && <span className="visually-hidden">, готово</span>}
          </li>
        );
      })}
    </ol>
  );
}
