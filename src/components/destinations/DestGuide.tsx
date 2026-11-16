import { Link } from 'react-router-dom';
import { getCities } from '@/lib/cities';
import { typograph } from '@/lib/typograph';
import type { City } from '@/types/city';
import styles from './DestGuide.module.css';

const NO_VISA = /не нужна|без визы/i;

interface Group {
  title: string;
  text: string;
  pick: (c: City) => boolean;
}

const GROUPS: Group[] = [
  {
    title: 'Близко и без визы',
    text: 'До трёх часов полёта и паспорт без штампа консульства — подходит для длинных выходных.',
    pick: (c) => c.facts.flightMinutes <= 200 && NO_VISA.test(c.facts.visa),
  },
  {
    title: 'Море и солнце',
    text: 'Пляж, набережная и тёплая вода. Смотрите на сезон: у моря он короче, чем кажется.',
    pick: (c) => c.quiz.moods.includes('sea'),
  },
  {
    title: 'Горы и природа',
    text: 'Тропы, монастыри на скалах и виды сверху. Нужна удобная обувь и запас по времени.',
    pick: (c) => c.quiz.moods.includes('mountains'),
  },
  {
    title: 'Еда и история',
    text: 'Города, где гастрономия — главный музей: старые кварталы, рынки и блюда, которых нет дома.',
    pick: (c) => c.quiz.moods.includes('food') && c.quiz.moods.includes('history'),
  },
];

/** «Как выбрать направление»: короткий текст и подборки со ссылками на города */
export function DestGuide() {
  const cities = getCities();
  return (
    <section className={styles.guide} aria-labelledby="guide-title">
      <div className={styles.intro}>
        <h2 id="guide-title" className={styles.h2}>
          Как выбрать <span className="grad">направление</span>
        </h2>
        <p className={styles.lead}>
          {typograph(
            'Начните с настроения и сезона, а не с цены: билеты дешевеют и дорожают, а погода в горах или у моря решает всё. Ниже — подборки по поводу, а ещё ниже — все направления списком с перелётом, визой и примерным бюджетом недели.',
          )}
        </p>
        <Link to="/quiz" className={styles.cta}>
          Не знаете, куда? Подберём за&nbsp;5&nbsp;шагов
        </Link>
      </div>
      <ul className={styles.groups}>
        {GROUPS.map((g) => {
          const list = cities.filter(g.pick);
          return (
            <li key={g.title} className={styles.group}>
              <h3>{g.title}</h3>
              <p>{typograph(g.text)}</p>
              <span className={styles.links}>
                {list.map((c, i) => (
                  <span key={c.id}>
                    <Link to={`/city/${c.id}`}>{c.name}</Link>
                    {i < list.length - 1 && ', '}
                  </span>
                ))}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
