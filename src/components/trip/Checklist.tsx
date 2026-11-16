import { CHECKLIST, addDays, daysUntil } from '@/lib/trip';
import type { TripPlan } from '@/types/user';
import styles from './Checklist.module.css';

const DATE = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });

interface ChecklistProps {
  plan: TripPlan;
  now: number;
  onToggle: (itemId: string) => void;
}

/** Чек-лист «перед вылетом»: срок каждого пункта считается от даты вылета */
export function Checklist({ plan, now, onToggle }: ChecklistProps) {
  const done = CHECKLIST.filter((c) => plan.checklist[c.id]).length;
  return (
    <div className={styles.box}>
      <div className={styles.head}>
        <h3>Перед вылетом</h3>
        <span>
          {done} из {CHECKLIST.length}
        </span>
      </div>
      <ul className={styles.list}>
        {CHECKLIST.map((c) => {
          const due = addDays(plan.dateFrom, -c.days);
          const left = daysUntil(due, now);
          const on = !!plan.checklist[c.id];
          return (
            <li key={c.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                className={styles.item}
                onClick={() => onToggle(c.id)}
              >
                <span aria-hidden="true" className={styles.box2} />
                <span className={styles.text}>
                  {c.text}
                  <small data-late={(!on && left < 0) || undefined}>
                    до {DATE.format(new Date(`${due}T12:00:00`))}
                    {!on && left < 0 ? ' · пора' : ''}
                  </small>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
