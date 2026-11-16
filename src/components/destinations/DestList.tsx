import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { formatRub, weekCost } from '@/lib/cities';
import { photoSrcSet } from '@/lib/img';
import { MONTH_LETTERS } from '@/lib/months';
import { useUserStore } from '@/store/user';
import type { City } from '@/types/city';
import styles from './DestList.module.css';

type Sort = 'price' | 'flight' | 'name';
const SORTS: { id: Sort; label: string }[] = [
  { id: 'price', label: 'Дешевле' },
  { id: 'flight', label: 'Ближе' },
  { id: 'name', label: 'По алфавиту' },
];

/** Каталог направлений списком: сортировка, «сезон сейчас», избранное и ссылки */
export function DestList({ cities }: { cities: City[] }) {
  const [sort, setSort] = useState<Sort>('price');
  const [season, setSeason] = useState(false);
  const favorites = useUserStore((s) => s.favorites);
  const toggleFavorite = useUserStore((s) => s.toggleFavorite);
  const month = new Date().getMonth() + 1;

  const list = cities
    .filter((c) => !season || c.climate.bestMonths.includes(month))
    .sort((a, b) =>
      sort === 'price'
        ? weekCost(a) - weekCost(b)
        : sort === 'flight'
          ? a.facts.flightMinutes - b.facts.flightMinutes
          : a.name.localeCompare(b.name, 'ru'),
    );

  return (
    <section className={styles.section} aria-labelledby="list-title">
      <div className={styles.head}>
        <h2 id="list-title" className={styles.h2}>
          Все направления <span className={styles.count}>{list.length}</span>
        </h2>
        <div className={styles.controls}>
          <div role="group" aria-label="Сортировка" className={styles.seg}>
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={sort === s.id}
                onClick={() => setSort(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.toggle}
            aria-pressed={season}
            onClick={() => setSeason(!season)}
          >
            Сезон сейчас
          </button>
        </div>
      </div>

      <ul className={styles.list}>
        {list.map((c) => {
          const fav = favorites.includes(c.id);
          const photo = c.places[0]?.photo;
          return (
            <li key={c.id} className={styles.row}>
              <span className={styles.thumb} aria-hidden="true">
                {photo && (
                  <img src={photo} srcSet={photoSrcSet(photo)} sizes="96px" alt="" loading="lazy" />
                )}
              </span>
              <div className={styles.main}>
                <h3>
                  <Link to={`/city/${c.id}`} className={styles.name}>
                    {c.name}
                  </Link>
                </h3>
                <span className={styles.country}>
                  {c.country} · {c.region}
                </span>
                <span className={styles.lead}>{c.lead}</span>
              </div>
              <dl className={styles.facts}>
                <div>
                  <dt>Перелёт</dt>
                  <dd>{c.facts.flight}</dd>
                </div>
                <div>
                  <dt>Виза</dt>
                  <dd>{c.facts.visa}</dd>
                </div>
                <div>
                  <dt>Неделя · демо</dt>
                  <dd>от&nbsp;{formatRub(weekCost(c))}</dd>
                </div>
              </dl>
              <span
                className={styles.months}
                role="img"
                aria-label={`Лучшие месяцы: ${c.climate.bestMonths.join(', ')}`}
              >
                {MONTH_LETTERS.map((l, i) => (
                  <i
                    key={i}
                    data-on={c.climate.bestMonths.includes(i + 1) || undefined}
                    data-now={i + 1 === month || undefined}
                  >
                    {l}
                  </i>
                ))}
              </span>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.fav}
                  aria-pressed={fav}
                  aria-label={`${c.name} в избранное`}
                  onClick={() => toggleFavorite(c.id)}
                >
                  <Icon name="heart" size={18} />
                </button>
                <Link to={`/trip?city=${c.id}`} className={styles.plan}>
                  Спланировать
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
      {!list.length && (
        <p className={styles.empty}>
          Сейчас не&nbsp;сезон ни&nbsp;для&nbsp;одного направления из&nbsp;фильтра
        </p>
      )}
    </section>
  );
}
