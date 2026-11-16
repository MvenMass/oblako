import { useState } from 'react';
import { Aurora } from '@/components/ui/Aurora';
import { Button } from '@/components/ui/Button';
import { getCities, getPhotoCredit } from '@/lib/cities';
import { deletePhoto } from '@/lib/photos';
import { usePageTitle } from '@/lib/usePageTitle';
import { useUserStore } from '@/store/user';
import styles from './About.module.css';

const DEMO = [
  ['Цены, бюджет и перелёты', 'ориентировочные, собраны вручную и подписаны «демо»'],
  ['Табло и рейсы', 'генерируются из списка городов; номера «OB» условные'],
  ['Бронирование и оплата', 'демонстрация: деньги не списываются, авиакомпании нет'],
  ['Имена и истории', 'плейсхолдеры вроде [Имя] — настоящих пользователей нет'],
];

const LIVE = [
  ['Погода', 'Open‑Meteo — бесплатный открытый API'],
  ['Курсы валют', 'ЦБ РФ через cbr-xml-daily.ru; без сети — сохранённый или демо-курс'],
  ['Озвучка фраз', 'встроенный в браузер Web Speech API'],
];

/** «О проекте»: что настоящее, что демо, где хранятся данные и кредиты фото */
export default function About() {
  usePageTitle('О проекте');
  const trips = useUserStore((s) => s.journal.trips);
  const reset = useUserStore((s) => s.reset);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const wipe = () => {
    trips.forEach((t) => t.photoIds.forEach((id) => void deletePhoto(id)));
    reset();
    setConfirm(false);
    setDone(true);
  };

  return (
    <div className={styles.page}>
      <Aurora grain={false} />
      <div className={`container ${styles.content}`}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>Некоммерческий портфолио-проект</p>
          <h1 className={styles.h1}>
            О&nbsp;<span className="grad">проекте</span>
          </h1>
          <p className={styles.lead}>
            OBLAKO&nbsp;— учебный сайт для планирования путешествий: 11&nbsp;направлений, подбор
            поездки, маршрут, бюджет, табло, бронирование, сборы, дневник и&nbsp;профиль. Всё
            бесплатно и&nbsp;без сервера: данные живут только в&nbsp;вашем браузере.
          </p>
        </header>

        <div className={styles.cols}>
          <section className={styles.card} aria-labelledby="demo-title">
            <h2 id="demo-title">Что здесь демо</h2>
            <dl>
              {DEMO.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className={styles.card} aria-labelledby="live-title">
            <h2 id="live-title">Что настоящее</h2>
            <dl>
              {LIVE.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className={styles.card} aria-labelledby="data-title">
            <h2 id="data-title">Ваши данные</h2>
            <p>
              Избранное, маршрут, траты, талоны и&nbsp;паспорт хранятся в&nbsp;localStorage, фото
              дневника&nbsp;— в&nbsp;IndexedDB. На&nbsp;сервер ничего не&nbsp;отправляется.
            </p>
            {confirm ? (
              <div className={styles.confirm}>
                <span>Удалить всё безвозвратно?</span>
                <Button size="sm" onClick={wipe}>
                  Да, сбросить
                </Button>
                <Button size="sm" variant="glass" onClick={() => setConfirm(false)}>
                  Отмена
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="glass" onClick={() => setConfirm(true)}>
                Сбросить мои данные
              </Button>
            )}
            <p className={styles.status} role="status">
              {done ? 'Данные сброшены' : ''}
            </p>
          </section>
        </div>

        <section className={styles.credits} aria-labelledby="credits-title">
          <h2 id="credits-title" className={styles.h2}>
            Фото
          </h2>
          <p className={styles.lead}>
            Все снимки&nbsp;— с&nbsp;Pexels по&nbsp;Pexels License. Спасибо фотографам!
          </p>
          <div className={styles.cities}>
            {getCities().map((city) => (
              <section key={city.id} aria-label={city.name}>
                <h3>{city.name}</h3>
                <ul>
                  {city.places.map((p) => {
                    const key = p.photo.replace(/^\/photos\/[^/]+\//, '').replace(/\.jpg$/, '');
                    const credit = getPhotoCredit(city.id, key);
                    return (
                      <li key={p.id}>
                        {credit ? (
                          <a href={credit.page} target="_blank" rel="noopener noreferrer">
                            {p.name}
                            <span className="visually-hidden">
                              {' '}
                              (Pexels, откроется в новой вкладке)
                            </span>
                          </a>
                        ) : (
                          p.name
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
