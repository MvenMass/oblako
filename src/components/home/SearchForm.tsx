import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { getCities } from '@/lib/cities';
import { MONTHS, PEOPLE, quizUrl } from '@/lib/search';
import styles from './SearchForm.module.css';

/** Поиск поездки: куда, когда, сколько человек → подбор */
export function SearchForm() {
  const navigate = useNavigate();
  const [to, setTo] = useState('');
  const [month, setMonth] = useState('');
  const [people, setPeople] = useState('2');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(quizUrl(to, month, people));
  };

  return (
    <form className={styles.form} aria-label="Поиск поездки" onSubmit={onSubmit}>
      <p className={styles.from}>
        Вылет из&nbsp;<strong>Москвы</strong>
      </p>
      <div className={styles.fields}>
        <label className={`${styles.field} ${styles.wide}`}>
          <span className={styles.label}>Куда</span>
          <select className={styles.select} value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="">Куда угодно</option>
            {getCities().map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Когда</span>
          <select
            className={styles.select}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">Любой месяц</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={String(i + 1)}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Сколько</span>
          <select
            className={styles.select}
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          >
            {PEOPLE.map((n) => (
              <option key={n} value={String(n)}>
                {n} {n === 1 ? 'человек' : n < 5 ? 'человека' : 'человек'}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={styles.submit}>
          <Icon name="search" size={18} className={styles.submitIcon} />
          <span className={styles.submitShort}>Найти</span>
          <span className={styles.submitLong}>Найти поездку</span>
        </button>
      </div>
    </form>
  );
}
