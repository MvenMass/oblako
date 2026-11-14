import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Confetti, PackList } from '@/components/packing/PackExtras';
import { PackScene } from '@/components/packing/PackScene';
import { PackShelf } from '@/components/packing/PackShelf';
import { WeatherWeek } from '@/components/packing/WeatherWeek';
import { Aurora } from '@/components/ui/Aurora';
import { Button } from '@/components/ui/Button';
import { getForecast } from '@/lib/api/weather';
import { getCity } from '@/lib/cities';
import { MONTHS_FULL } from '@/lib/months';
import { useMediaQuery, useReducedMotion } from '@/lib/motion';
import { climateWeek, ITEMS, tipsFor, weight } from '@/lib/packing';
import { plural } from '@/lib/plural';
import { useAsync } from '@/lib/useAsync';
import { usePageTitle } from '@/lib/usePageTitle';
import { useUserStore } from '@/store/user';
import styles from './Packing.module.css';

/** Город: ?city= → маршрут → подбор → Стамбул */
function usePackingCity() {
  const [params] = useSearchParams();
  const routeCity = useUserStore((s) => s.route?.cityId);
  const quizCity = useUserStore((s) => s.quiz.result);
  return (
    getCity(params.get('city') ?? undefined) ??
    getCity(routeCity) ??
    getCity(quizCity ?? undefined) ??
    getCity('istanbul')!
  );
}

export default function Packing() {
  const city = usePackingCity();
  usePageTitle(`Сборы · ${city.name}`);
  const reduced = useReducedMotion();
  const phone = useMediaQuery('(max-width: 767px)');
  const quiz = useUserStore((s) => s.quiz.answers);
  const packing = useUserStore((s) => s.packing);
  const setPacked = useUserStore((s) => s.setPacked);
  const setPacking = useUserStore((s) => s.setPacking);
  const [last, setLast] = useState<string | null>(null);

  const forecast = useAsync((signal) => getForecast(city.coords, signal), [city.id]);
  const live = forecast.status === 'ready' && forecast.data;
  const month = quiz?.month ?? new Date().getMonth();
  const week = live || climateWeek(city, month);
  const tips = tipsFor(city, week);
  const days = quiz?.days ?? 7;

  const packed = packing?.cityId === city.id ? packing.packed : {};
  const done = ITEMS.filter((i) => packed[i.id]).length;
  const progress = Math.round((done / ITEMS.length) * 100);
  const toggle = (id: string) => {
    setLast(id);
    setPacked(city.id, id, !packed[id]);
  };
  const all = (on: boolean) => {
    setLast(null);
    setPacking(city.id, on ? Object.fromEntries(ITEMS.map((i) => [i.id, true])) : {});
  };
  const sceneProps = { packed, tips, kg: weight(packed), last, onToggle: toggle };

  return (
    <div className={styles.page}>
      <Aurora grain={false} />
      <section className={`container ${styles.content}`} aria-labelledby="packing-title">
        <div className={styles.top}>
          <div className={styles.titles}>
            <p className={styles.eyebrow}>
              Сборы · {city.name}, {days}&nbsp;{plural(days, ['день', 'дня', 'дней'])},{' '}
              {MONTHS_FULL[month].toLowerCase()}
            </p>
            <h1 id="packing-title" className={styles.h1}>
              Разложите и&nbsp;<span className="grad">соберите</span>
            </h1>
          </div>
          <div className={styles.actions}>
            <span className={styles.progress}>
              Уложено {done} из&nbsp;{ITEMS.length}
              <span
                role="progressbar"
                aria-label="Собрано"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                className={styles.bar}
              >
                <span style={{ transform: `scaleX(${done / ITEMS.length})` }} />
              </span>
            </span>
            <Button onClick={() => all(true)}>Собрать всё</Button>
            <Button variant="glass" onClick={() => all(false)}>
              Вытряхнуть
            </Button>
          </div>
        </div>

        <WeatherWeek
          week={week}
          source={live ? 'прогноз Open‑Meteo' : 'нет прогноза — по климату месяца'}
        />
        {phone ? <PackShelf {...sceneProps} /> : <PackScene {...sceneProps} />}
        <PackList packed={packed} onToggle={toggle} />
        {done === ITEMS.length && <Confetti reduced={reduced} />}
      </section>
    </div>
  );
}
