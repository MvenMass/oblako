import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PackChecklist } from '@/components/packing/PackChecklist';
import { Confetti } from '@/components/packing/PackExtras';
import { PackScene } from '@/components/packing/PackScene';
import { PackShelf } from '@/components/packing/PackShelf';
import { WeatherWeek } from '@/components/packing/WeatherWeek';
import { Aurora } from '@/components/ui/Aurora';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { getForecast } from '@/lib/api/weather';
import { getCity } from '@/lib/cities';
import { MONTHS_FULL } from '@/lib/months';
import { useMediaQuery, useReducedMotion } from '@/lib/motion';
import { climateWeek, ITEMS, tipsFor, weight } from '@/lib/packing';
import { plural } from '@/lib/plural';
import { addDays, daysUntil, todayIso } from '@/lib/trip';
import { useAsync } from '@/lib/useAsync';
import { usePageTitle } from '@/lib/usePageTitle';
import { useUserStore } from '@/store/user';
import type { City } from '@/types/city';
import styles from './Packing.module.css';

/** Город: ?city= → ближайшая поездка → маршрут → подбор; без них — пустое состояние */
function usePackingCity() {
  const [params] = useSearchParams();
  const plans = useUserStore((s) => s.plans);
  const routeCity = useUserStore((s) => s.route?.cityId);
  const quizCity = useUserStore((s) => s.quiz.result);
  const planCity = plans.list.find((p) => p.id === plans.activeId)?.cityId;
  return (
    getCity(params.get('city') ?? undefined) ??
    getCity(planCity) ??
    getCity(routeCity) ??
    getCity(quizCity ?? undefined)
  );
}

export default function Packing() {
  const city = usePackingCity();
  usePageTitle(city ? `Сборы · ${city.name}` : 'Сборы');
  if (!city) {
    return (
      <div className={styles.page}>
        <Aurora grain={false} />
        <div className={`container ${styles.content}`}>
          <EmptyState
            level={1}
            title="Сначала выберите направление"
            text="Подскажем, что взять: по погоде на даты поездки и обычаям города."
            action={<Button to="/trip">Спланировать поездку</Button>}
          />
        </div>
      </div>
    );
  }
  return <PackingView city={city} />;
}

function PackingView({ city }: { city: City }) {
  const reduced = useReducedMotion();
  const compact = useMediaQuery('(max-width: 1279px)');
  const quiz = useUserStore((s) => s.quiz.answers);
  const plans = useUserStore((s) => s.plans.list);
  const packing = useUserStore((s) => s.packing);
  const store = useUserStore();
  const [last, setLast] = useState<string | null>(null);
  const [now] = useState(() => Date.now());

  // Поездка в этот город задаёт даты и длительность; без неё — подбор или неделя с сегодня
  const plan = plans.find(
    (p) => p.cityId === city.id && p.saved && daysUntil(addDays(p.dateFrom, p.nights), now) >= 0,
  );
  const from = plan?.dateFrom ?? todayIso(now);
  const days = plan ? plan.nights + 1 : (quiz?.days ?? 7);
  const month = plan
    ? Number(plan.dateFrom.slice(5, 7)) - 1
    : (quiz?.month ?? new Date(now).getMonth());
  const soon = daysUntil(from, now) <= 9;

  const forecast = useAsync(
    (signal) => (soon ? getForecast(city.coords, signal) : Promise.resolve(null)),
    [city.id, soon],
  );
  const live =
    forecast.status === 'ready' && forecast.data
      ? forecast.data.filter((d) => d.date >= from)
      : null;
  const week = live && live.length >= 3 ? live.slice(0, 7) : climateWeek(city, month, from);
  const tips = tipsFor(city, week);

  const same = packing?.cityId === city.id ? packing : null;
  const packed = same?.packed ?? {};
  const custom = same?.custom ?? [];
  const limit = same?.limit ?? 23;
  const total = ITEMS.length + custom.length;
  const done = ITEMS.filter((i) => packed[i.id]).length + custom.filter((c) => packed[c.id]).length;
  const toggle = (id: string) => {
    setLast(id);
    store.setPacked(city.id, id, !packed[id]);
  };
  const all = (on: boolean) => {
    setLast(null);
    store.setPacking(
      city.id,
      on ? Object.fromEntries([...ITEMS, ...custom].map((i) => [i.id, true])) : {},
    );
  };
  const kg = weight(packed, days, custom);
  const sceneProps = { packed, tips, kg, last, days, limit, custom, onToggle: toggle };

  return (
    <div className={styles.page}>
      <Aurora grain={false} />
      <section className={`container ${styles.content}`} aria-labelledby="packing-title">
        <div className={styles.top}>
          <div className={styles.titles}>
            <p className={styles.eyebrow}>
              Сборы · {city.name}, {days}&nbsp;{plural(days, ['день', 'дня', 'дней'])},{' '}
              {MONTHS_FULL[month].toLowerCase()}
              {plan ? ' · по вашей поездке' : ''}
            </p>
            <h1 id="packing-title" className={styles.h1}>
              Отметьте и&nbsp;<span className="grad">соберите</span>
            </h1>
          </div>
          <div className={styles.actions}>
            <span className={styles.progress}>
              Уложено {done} из&nbsp;{total}
              <span
                role="progressbar"
                aria-label="Собрано"
                aria-valuenow={Math.round((done / total) * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                className={styles.bar}
              >
                <span style={{ transform: `scaleX(${done / total})` }} />
              </span>
            </span>
            <Button onClick={() => all(true)}>Собрать всё</Button>
            <Button variant="glass" onClick={() => all(false)}>
              Вытряхнуть
            </Button>
          </div>
        </div>

        {!plan && (
          <p className={styles.note}>
            Даты не&nbsp;выбраны&nbsp;— считаем на&nbsp;неделю с&nbsp;сегодня.{' '}
            <Link to={`/trip?city=${city.id}`}>Спланируйте поездку</Link>, и&nbsp;список подстроится
            под даты и&nbsp;погоду.
          </p>
        )}
        <WeatherWeek
          week={week}
          source={
            live && live.length >= 3
              ? plan
                ? 'прогноз Open‑Meteo на даты поездки'
                : 'прогноз Open‑Meteo'
              : 'прогноза на эти даты ещё нет — по климату месяца'
          }
        />

        <div className={styles.layout}>
          <PackChecklist
            packed={packed}
            tips={tips}
            days={days}
            custom={custom}
            limit={limit}
            onToggle={toggle}
            onAdd={(item) => store.addCustomItem(city.id, item)}
            onRemove={(id) => store.removeCustomItem(city.id, id)}
            onLimit={(l) => store.setLuggageLimit(city.id, l)}
          />
          <div className={styles.scene}>
            {compact ? <PackShelf {...sceneProps} /> : <PackScene {...sceneProps} />}
          </div>
        </div>
        {done === total && <Confetti reduced={reduced} />}
      </section>
    </div>
  );
}
