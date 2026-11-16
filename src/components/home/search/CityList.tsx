import { useId, useState, type KeyboardEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { getCities } from '@/lib/cities';
import { photoSrcSet } from '@/lib/img';
import styles from './Panels.module.css';

interface CityListProps {
  value: string;
  onPick: (id: string) => void;
}

const ANY = {
  id: '',
  name: 'Куда угодно',
  country: 'подберём по настроению',
  flight: '',
  photo: '',
};

/** «Куда»: поиск по городам и список с фото, перелётом и страной. Клавиатура: ↑↓, Enter */
export function CityList({ value, onPick }: CityListProps) {
  const id = useId();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const cities = getCities()
    .filter((c) => !q || `${c.name} ${c.country}`.toLowerCase().includes(q))
    .map((c) => ({
      id: c.id,
      name: c.name,
      country: c.country,
      flight: c.facts.flight,
      photo: c.places[0]?.photo ?? '',
    }));
  const options = q ? cities : [ANY, ...cities];
  const [active, setActive] = useState(() =>
    Math.max(
      0,
      options.findIndex((o) => o.id === value),
    ),
  );
  const current = Math.min(active, options.length - 1);

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const d = e.key === 'ArrowDown' ? 1 : -1;
      const next = (current + d + options.length) % options.length;
      setActive(next);
      document.getElementById(`${id}-o${next}`)?.scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'Enter' && options[current]) {
      e.preventDefault();
      onPick(options[current].id);
    }
  };

  return (
    <div className={styles.cities}>
      <input
        // Поле поиска сразу получает фокус — так работают выпадающие поиски
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls={`${id}-list`}
        aria-activedescendant={options.length ? `${id}-o${current}` : undefined}
        aria-label="Найти город или страну"
        placeholder="Город или страна"
        className={styles.search}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
        }}
        onKeyDown={onKey}
      />
      <ul id={`${id}-list`} role="listbox" aria-label="Направления" className={styles.list}>
        {options.map((o, i) => (
          // Выбор мышью; клавиатура работает через поле поиска (aria-activedescendant)
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <li
            key={o.id || 'any'}
            id={`${id}-o${i}`}
            role="option"
            aria-selected={o.id === value}
            data-active={i === current || undefined}
            className={styles.option}
            onMouseEnter={() => setActive(i)}
            onClick={() => onPick(o.id)}
          >
            <span className={styles.thumb} aria-hidden="true">
              {o.photo ? (
                <img
                  src={o.photo}
                  srcSet={photoSrcSet(o.photo)}
                  sizes="40px"
                  alt=""
                  loading="lazy"
                />
              ) : (
                <Icon name="sparkle" size={18} className={styles.any} />
              )}
            </span>
            <span className={styles.text}>
              <b>{o.name}</b>
              <span>
                {o.country}
                {o.flight && ` · ${o.flight}`}
              </span>
            </span>
            {o.id === value && <span aria-hidden="true" className={styles.check} />}
          </li>
        ))}
        {!options.length && <li className={styles.none}>Такого направления пока нет</li>}
      </ul>
    </div>
  );
}
