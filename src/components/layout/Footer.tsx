import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '@/lib/motion';
import { FooterSky } from './FooterSky';
import styles from './Footer.module.css';

const COLUMNS = [
  {
    title: 'Сервис',
    links: [
      { to: '/quiz', label: 'Подбор поездки' },
      { to: '/route', label: 'Маршрут' },
      { to: '/budget', label: 'Бюджет' },
      { to: '/board', label: 'Табло' },
      { to: '/packing', label: 'Сборы' },
    ],
  },
  {
    title: 'Направления',
    links: [
      { to: '/city/istanbul', label: 'Стамбул' },
      { to: '/city/tbilisi', label: 'Тбилиси' },
      { to: '/city/yerevan', label: 'Ереван' },
      { to: '/city/sochi', label: 'Сочи' },
      { to: '/destinations', label: 'Все направления' },
    ],
  },
  {
    title: 'Проект',
    links: [
      { to: '/#how', label: 'Как работает' },
      { to: '/#faq', label: 'Вопросы' },
      { to: '/journal', label: 'Дневник' },
      { to: '/profile', label: 'Профиль' },
      { to: '/about', label: 'О проекте и фото' },
    ],
  },
];

export function Footer({ dark = false }: { dark?: boolean }) {
  const [subscribed, setSubscribed] = useState(false);
  const wordRef = useRef<HTMLDivElement>(null);
  const wordVisible = useInView(wordRef);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <footer className={[styles.footer, dark && styles.dark].filter(Boolean).join(' ')}>
      <FooterSky />

      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.subscribe}>
            <h2 className={styles.subTitle}>Письма о&nbsp;новых направлениях</h2>
            <p className={styles.subText}>
              Раз в&nbsp;месяц: новые города, сезонные подсказки и&nbsp;готовые маршруты.
            </p>
            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.field}>
                <span className="visually-hidden">Электронная почта</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.ru"
                  className={styles.input}
                  disabled={subscribed}
                />
              </label>
              <button type="submit" className={styles.submit} disabled={subscribed}>
                {subscribed ? 'Готово ✓' : 'Подписаться'}
              </button>
            </form>
            <p role="status" className={styles.status}>
              {subscribed ? 'Демо: письма не отправляются, адрес нигде не сохраняется.' : ''}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className={styles.col}>
              <h2 className={styles.colTitle}>{col.title}</h2>
              <ul className={styles.links}>
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={styles.link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div ref={wordRef} aria-hidden="true" className={styles.wordWrap}>
        <span className={[styles.word, wordVisible && styles.wordUp].filter(Boolean).join(' ')}>
          OBLAKO
        </span>
        <svg className={styles.clouds} viewBox="0 0 1440 300" preserveAspectRatio="none">
          <defs>
            <filter id="footer-cloud-blur">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          <g filter="url(#footer-cloud-blur)" className={styles.cloudFill}>
            <g className={styles.sail}>
              <ellipse cx="160" cy="300" rx="260" ry="70" />
              <ellipse cx="620" cy="310" rx="320" ry="80" />
            </g>
            <g className={styles.sail} style={{ animationDelay: '-12s' }}>
              <ellipse cx="1100" cy="300" rx="300" ry="74" />
              <ellipse cx="1420" cy="310" rx="220" ry="60" />
            </g>
          </g>
        </svg>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <span>Проект для&nbsp;портфолио · данные демонстрационные</span>
          <span>Дизайн и&nbsp;разработка&nbsp;— [Имя] · [GitHub]</span>
        </div>
      </div>
    </footer>
  );
}
