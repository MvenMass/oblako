import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { formatRub, getCity } from '@/lib/cities';
import { formatTime } from '@/lib/route';
import {
  addDays,
  flightOptions,
  hotelOptions,
  transferOptions,
  tripCost,
  tripIcs,
} from '@/lib/trip';
import type { TripPlan } from '@/types/user';
import { Checklist } from './Checklist';
import { TripWeather } from './TripWeather';
import styles from './TripSummary.module.css';

const DATE = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
const fmt = (iso: string) => DATE.format(new Date(`${iso}T12:00:00`));

interface TripSummaryProps {
  plan: TripPlan;
  now: number;
  onSave: () => void;
  onStep: (step: number) => void;
  onToggleCheck: (itemId: string) => void;
}

function download(plan: TripPlan) {
  const blob = new Blob([tripIcs(plan)], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `oblako-${plan.cityId}-${plan.dateFrom}.ics`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Итог мастера: что выбрано, сколько стоит, погода, чек-лист и что дальше */
export function TripSummary({ plan, now, onSave, onStep, onToggleCheck }: TripSummaryProps) {
  const city = getCity(plan.cityId)!;
  const cost = tripCost(plan, city);
  const out = flightOptions(city, 'out').find((f) => f.id === plan.outId);
  const back = flightOptions(city, 'back').find((f) => f.id === plan.backId);
  const hotel = hotelOptions(city).find((h) => h.id === plan.hotelId);
  const transfer = transferOptions(city).find((t) => t.id === plan.transferId);
  const end = addDays(plan.dateFrom, plan.nights);
  const budget = plan.budget || cost.total;
  const over = cost.total > budget;

  const rows: [string, string | undefined, number, number][] = [
    [
      'Туда',
      out && `${fmt(plan.dateFrom)}, ${formatTime(out.dep)} · ${out.no}`,
      cost.flights / 2,
      2,
    ],
    ['Обратно', back && `${fmt(end)}, ${formatTime(back.dep)} · ${back.no}`, cost.flights / 2, 2],
    ['Отель', hotel && `${hotel.name} · ${plan.nights} ноч.`, cost.stay, 3],
    ['Трансфер', transfer && `${transfer.name}, туда и обратно`, cost.transfer, 4],
    ['В городе', 'еда, впечатления, транспорт · оценка', cost.daily, 1],
  ];

  return (
    <div className={styles.wrap}>
      <section className={styles.card} aria-labelledby="sum-title">
        <h2 id="sum-title" className={styles.h2}>
          {city.name}, {fmt(plan.dateFrom)}&nbsp;— {fmt(end)}
        </h2>
        <p className={styles.sub}>
          {plan.people} чел. · {plan.nights} ноч. · все цены демо
        </p>
        <dl className={styles.rows}>
          {rows.map(([k, v, rub, step]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>
                {v ?? (
                  <button type="button" className={styles.missing} onClick={() => onStep(step)}>
                    не выбрано — выбрать
                  </button>
                )}
              </dd>
              <dd className={styles.rub}>{rub ? formatRub(rub) : '—'}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.total} data-over={over || undefined}>
          <span>Итого</span>
          <b>{formatRub(cost.total)}</b>
          <span>
            {over
              ? `дороже бюджета на ${formatRub(cost.total - budget)}`
              : `в бюджете, запас ${formatRub(budget - cost.total)}`}
          </span>
        </div>
        <TripWeather city={city} dateFrom={plan.dateFrom} nights={plan.nights} now={now} />
      </section>

      <aside className={styles.side}>
        {plan.saved ? (
          <div className={styles.next}>
            <h3>Поездка сохранена</h3>
            <p>
              Бюджет, маршрут на&nbsp;{Math.min(plan.nights + 1, 7)} дн. и&nbsp;сборы уже настроены.
            </p>
            <div className={styles.links}>
              <Link to={`/route?city=${city.id}`}>Маршрут по&nbsp;дням</Link>
              <Link to={`/budget?city=${city.id}`}>Бюджет и&nbsp;траты</Link>
              <Link to={`/packing?city=${city.id}`}>Что взять</Link>
              <Link to={`/booking?city=${city.id}`}>Место в&nbsp;самолёте</Link>
              <Link to={`/city/${city.id}`}>О&nbsp;стране и&nbsp;городе</Link>
            </div>
            <div className={styles.export}>
              <Button variant="glass" size="sm" iconStart="calendar" onClick={() => download(plan)}>
                В&nbsp;календарь (.ics)
              </Button>
              <Button variant="glass" size="sm" iconStart="print" onClick={() => window.print()}>
                Распечатать
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.next}>
            <h3>Всё верно?</h3>
            <p>
              Сохраним поездку: бюджет получит брони, маршрут&nbsp;— дни, а&nbsp;профиль&nbsp;—
              обратный отсчёт.
            </p>
            <Button onClick={onSave}>Сохранить поездку</Button>
          </div>
        )}
        <Checklist plan={plan} now={now} onToggle={onToggleCheck} />
      </aside>
    </div>
  );
}
