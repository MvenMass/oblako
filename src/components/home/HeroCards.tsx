import { Icon } from '@/components/ui/Icon';
import { getCurrentWeather } from '@/lib/api/weather';
import { getCity, getCities, nbsp } from '@/lib/cities';
import { useAsync } from '@/lib/useAsync';
import styles from './HeroCards.module.css';

const FEATURED = 'istanbul';

/** Живая погода в городе: «—», если Open-Meteo недоступен */
export function WeatherCard({
  cityId = FEATURED,
  title = 'Погода в Стамбуле',
}: {
  cityId?: string;
  title?: string;
}) {
  const city = getCity(cityId)!;
  const weather = useAsync((signal) => getCurrentWeather(city.coords, signal), [city.id]);
  const temp =
    weather.status === 'ready'
      ? `${weather.data.tempC > 0 ? '+' : ''}${weather.data.tempC} °C`
      : '—';

  return (
    <div className={`${styles.card} ${styles.weather}`}>
      <span className={styles.meta}>{title}</span>
      <span className={styles.temp} aria-live="polite" aria-busy={weather.status === 'loading'}>
        {weather.status === 'loading' ? '…' : temp}
      </span>
      <span className={styles.meta}>
        {weather.status === 'empty' ? 'нет связи с Open‑Meteo' : 'данные Open‑Meteo'}
      </span>
    </div>
  );
}

/** Плавающие стеклянные карточки вокруг глобуса (только десктоп) */
export function HeroCards() {
  const city = getCity(FEATURED)!;
  return (
    <>
      <div className={`${styles.card} ${styles.flight}`}>
        <span aria-hidden="true" className={styles.badge}>
          <Icon name="plane" size={22} />
        </span>
        <span className={styles.flightText}>
          <span className={styles.route}>
            MOW → {city.iata}
            <span className="visually-hidden">, Москва — {city.name}</span>
          </span>
          <span className={styles.meta}>в&nbsp;пути {nbsp(city.facts.flight)} · демо</span>
        </span>
      </div>
      <WeatherCard />
      <div className={`${styles.card} ${styles.hint}`}>
        <span aria-hidden="true" className={styles.dot} />
        <span className={styles.hintText}>
          {getCities().length}&nbsp;маршрутов из&nbsp;Москвы · потяните глобус
        </span>
      </div>
    </>
  );
}
