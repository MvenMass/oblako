import { Link } from 'react-router-dom';
import { Globe } from '@/components/globe/Globe';
import { getCities } from '@/lib/cities';
import { HeroBackdrop } from './HeroBackdrop';
import { HeroCards } from './HeroCards';
import { SearchForm } from './SearchForm';
import styles from './Hero.module.css';

const CITIES = getCities();
const DESTINATIONS = CITIES.map((c) => c.coords);
const GLOBE_LABEL = `Точечный глобус с маршрутами из Москвы: ${CITIES.map((c) => c.name).join(', ')}. Его можно вращать мышью или пальцем.`;

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroBackdrop />

      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <Link to="/board" className={`${styles.pill} ${styles.rise}`}>
            <span className={styles.pillTag}>Новое</span>
            Табло вылетов
          </Link>
          <h1 id="hero-title" className={`${styles.title} ${styles.rise}`}>
            Путь начинается <span className="grad">в&nbsp;облаке</span>
          </h1>
          <p className={`${styles.lead} ${styles.rise}`}>
            <span className={styles.leadLong}>
              Найдите направление, соберите маршрут по&nbsp;дням, посчитайте бюджет и&nbsp;следите
              за&nbsp;рейсом&nbsp;— в&nbsp;одном месте.
            </span>
            <span className={styles.leadShort}>
              Направление, маршрут, бюджет и&nbsp;рейс&nbsp;— в&nbsp;одном месте.
            </span>
          </p>
          <div className={`${styles.formWrap} ${styles.rise}`}>
            <SearchForm />
          </div>
        </div>

        <div className={styles.visual}>
          <Globe destinations={DESTINATIONS} label={GLOBE_LABEL} className={styles.globe} />
          <div className={styles.cards}>
            <HeroCards />
          </div>
        </div>
      </div>
    </section>
  );
}
