import { useState, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { plural } from '@/lib/plural';
import { dayTotals, durationMinutes, optimize, schedule, SUNSET } from '@/lib/route';
import { useUserStore } from '@/store/user';
import type { City } from '@/types/city';
import type { RouteDay, Stop } from '@/types/user';
import { DayDial } from './DayDial';
import { StopList } from './StopList';
import { TiltMap } from './TiltMap';
import styles from './RoutePlanner.module.css';

/** Конструктор: табы дней, список точек, 3D-карта, циферблат и итоги. Сохраняется сразу. */
export function RoutePlanner({ city, days }: { city: City; days: RouteDay[] }) {
  const setRoute = useUserStore((s) => s.setRoute);
  const [active, setActive] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(true);
  const dayIndex = Math.min(active, days.length - 1);
  const day = days[dayIndex];
  const items = schedule(city, day);
  const totals = dayTotals(items);

  const save = (next: RouteDay[]) => setRoute(city.id, next);
  const setStops = (stops: Stop[]) => save(days.map((d, i) => (i === dayIndex ? { stops } : d)));
  const inDay = new Set(day.stops.map((s) => s.placeId));
  const suggestions = city.places.filter((p) => !inDay.has(p.id));

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (dayIndex + d + days.length) % days.length;
    setActive(next);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <div className={styles.layout}>
      <div className={styles.panel} data-open={sheetOpen || undefined}>
        <button
          type="button"
          className={styles.grip}
          aria-expanded={sheetOpen}
          aria-controls="route-panel"
          onClick={() => setSheetOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          {sheetOpen ? 'Свернуть список' : 'Показать список'}
        </button>
        <div id="route-panel" className={styles.panelBody}>
          <div role="tablist" aria-label="Дни поездки" className={styles.tabs}>
            {days.map((d, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                id={`day-tab-${i}`}
                aria-selected={i === dayIndex}
                aria-controls="day-panel"
                tabIndex={i === dayIndex ? 0 : -1}
                className={styles.tab}
                onClick={() => setActive(i)}
                onKeyDown={onTabKey}
              >
                <b>День {i + 1}</b>
                <span>
                  {d.stops.length} {plural(d.stops.length, ['точка', 'точки', 'точек'])}
                </span>
              </button>
            ))}
            <button
              type="button"
              className={styles.addDay}
              aria-label="Добавить день"
              onClick={() => {
                save([...days, { stops: [] }]);
                setActive(days.length);
              }}
            >
              <Icon name="plus" size={16} />
            </button>
          </div>

          <div
            id="day-panel"
            role="tabpanel"
            aria-labelledby={`day-tab-${dayIndex}`}
            className={styles.dayPanel}
          >
            <p className={styles.help}>
              Тяните точку за&nbsp;ручку или&nbsp;используйте Alt и&nbsp;стрелки
            </p>
            {items.length ? (
              <StopList items={items} onChange={setStops} />
            ) : (
              <p className={styles.empty}>В&nbsp;этом дне пока нет точек&nbsp;— добавьте ниже.</p>
            )}
            <div className={styles.suggest}>
              <span className={styles.suggestTitle}>Добавить в&nbsp;день</span>
              <div className={styles.chips}>
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={styles.chip}
                    onClick={() =>
                      setStops([
                        ...day.stops,
                        { placeId: p.id, minutes: durationMinutes(p.duration) },
                      ])
                    }
                  >
                    <span aria-hidden="true">+</span>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <Button
              variant="glass"
              size="sm"
              iconStart="route"
              onClick={() => setStops(optimize(city, day.stops))}
              disabled={day.stops.length < 3}
            >
              Оптимизировать порядок
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.main}>
        <TiltMap
          items={items}
          area={city.places.map((p) => p.map)}
          label={`Наклонная карта: день ${dayIndex + 1}, ${items.map((x) => x.place.name).join(' → ') || 'точек нет'}`}
        />
        <div className={styles.bottom}>
          <DayDial items={items} utc={city.utc} />
          <dl className={styles.stats}>
            <div>
              <dt>Точек</dt>
              <dd>{totals.count}</dd>
            </div>
            <div>
              <dt>Пешком</dt>
              <dd>{totals.km.toFixed(1).replace('.', ',')}&nbsp;км</dd>
            </div>
            <div>
              <dt>В&nbsp;пути</dt>
              <dd>{totals.walk}&nbsp;мин</dd>
            </div>
            <div>
              <dt>Успеете до&nbsp;заката</dt>
              <dd>{!items.length ? '—' : totals.end <= SUNSET ? 'да' : 'нет'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
