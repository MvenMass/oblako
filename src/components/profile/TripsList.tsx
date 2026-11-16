import { Link } from 'react-router-dom';
import { getCity } from '@/lib/cities';
import { newTripId } from '@/lib/journal';
import { addDays, daysUntil } from '@/lib/trip';
import { useUserStore } from '@/store/user';
import type { TripPlan } from '@/types/user';
import styles from './TripsList.module.css';

const DATE = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
const fmt = (iso: string) => DATE.format(new Date(`${iso}T12:00:00`));

/** Все поездки: будущие и прошедшие; прошедшую можно перенести в дневник */
export function TripsList({ plans, now }: { plans: TripPlan[]; now: number }) {
  const trips = useUserStore((s) => s.journal.trips);
  const addTrip = useUserStore((s) => s.addTrip);
  const removePlan = useUserStore((s) => s.removePlan);
  const setActive = useUserStore((s) => s.setActivePlan);
  const activeId = useUserStore((s) => s.plans.activeId);
  const sorted = [...plans].sort((a, b) => a.dateFrom.localeCompare(b.dateFrom));

  return (
    <section className={styles.section} aria-labelledby="trips-title">
      <div className={styles.head}>
        <h2 id="trips-title" className={styles.h2}>
          Мои поездки
        </h2>
        <Link to="/trip" className={styles.add}>
          + Новая поездка
        </Link>
      </div>
      <ul className={styles.list}>
        {sorted.map((p) => {
          const city = getCity(p.cityId);
          if (!city) return null;
          const past = daysUntil(addDays(p.dateFrom, p.nights), now) < 0;
          const inJournal = trips.some((t) => t.cityId === p.cityId && t.date === p.dateFrom);
          return (
            <li key={p.id} className={styles.row} data-past={past || undefined}>
              <span className={styles.name}>
                <b>{city.name}</b>
                {fmt(p.dateFrom)} · {p.nights} ноч. · {p.people} чел.
              </span>
              <span className={styles.status}>
                {!p.saved
                  ? 'черновик'
                  : past
                    ? 'прошла'
                    : p.id === activeId
                      ? 'ближайшая'
                      : 'впереди'}
              </span>
              <span className={styles.actions}>
                {!past && p.id !== activeId && p.saved && (
                  <button type="button" onClick={() => setActive(p.id)}>
                    Сделать ближайшей
                  </button>
                )}
                {past && !inJournal && (
                  <button
                    type="button"
                    onClick={() =>
                      addTrip({
                        id: newTripId(),
                        cityId: p.cityId,
                        title: city.name,
                        date: p.dateFrom,
                        photoIds: [],
                      })
                    }
                  >
                    В&nbsp;дневник
                  </button>
                )}
                <Link to={`/trip?city=${p.cityId}`} onClick={() => setActive(p.id)}>
                  Открыть
                </Link>
                <button
                  type="button"
                  aria-label={`Удалить поездку: ${city.name}, ${fmt(p.dateFrom)}`}
                  onClick={() => removePlan(p.id)}
                >
                  Удалить
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      {!plans.length && (
        <p className={styles.empty}>
          Поездок пока нет. <Link to="/trip">Спланируйте первую</Link>&nbsp;— билеты, отель
          и&nbsp;маршрут за&nbsp;несколько шагов.
        </p>
      )}
    </section>
  );
}
