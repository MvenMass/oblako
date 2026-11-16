import { formatTime, schedule } from '@/lib/route';
import type { City } from '@/types/city';
import type { RouteDay } from '@/types/user';
import styles from './RoutePrint.module.css';

/** Версия для печати: все дни списком со временем, районом и описанием. На экране скрыта. */
export function RoutePrint({ city, days }: { city: City; days: RouteDay[] }) {
  return (
    <div className={styles.print} aria-hidden="true">
      <h2>
        Маршрут: {city.name}, {days.length} дн. · OBLAKO
      </h2>
      {days.map((d, i) => (
        <section key={i}>
          <h3>День {i + 1}</h3>
          <ol>
            {schedule(city, d).map((x) => (
              <li key={x.stop.placeId}>
                <b>
                  {formatTime(x.arrive)}–{formatTime(x.leave)} · {x.place.name}
                </b>{' '}
                ({x.place.district}, {x.place.price})
                <br />
                {x.place.description}
              </li>
            ))}
          </ol>
        </section>
      ))}
      <p>Время и расстояния примерные, цены демо.</p>
    </div>
  );
}
