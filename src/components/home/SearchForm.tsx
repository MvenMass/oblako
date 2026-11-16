import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { getCity } from '@/lib/cities';
import { MONTHS, peopleText, quizUrl } from '@/lib/search';
import { CityList } from './search/CityList';
import { MonthGrid } from './search/MonthGrid';
import { PeopleStepper } from './search/PeopleStepper';
import { Picker } from './search/Picker';
import styles from './SearchForm.module.css';

type Open = 'to' | 'month' | 'people' | null;

/** Поиск поездки: куда, когда, сколько человек → подбор. Свои панели вместо системных select */
export function SearchForm() {
  const navigate = useNavigate();
  const [to, setTo] = useState('');
  const [month, setMonth] = useState('');
  const [people, setPeople] = useState(2);
  const [open, setOpen] = useState<Open>(null);
  const city = getCity(to || undefined);
  const toggle = (key: Exclude<Open, null>) => (v: boolean) => setOpen(v ? key : null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(quizUrl(to, month, String(people)));
  };

  return (
    <form className={styles.form} aria-label="Поиск поездки" onSubmit={onSubmit}>
      <p className={styles.from}>
        Вылет из&nbsp;<strong>Москвы</strong>
      </p>
      <div className={styles.fields}>
        <Picker
          label="Куда"
          value={city ? city.name : 'Куда угодно'}
          kind="listbox"
          wide
          className={styles.wide}
          open={open === 'to'}
          onOpenChange={toggle('to')}
        >
          {(close) => (
            <CityList
              value={to}
              onPick={(id) => {
                setTo(id);
                close();
              }}
            />
          )}
        </Picker>
        <Picker
          label="Когда"
          value={month ? MONTHS[Number(month) - 1] : 'Любой месяц'}
          kind="dialog"
          open={open === 'month'}
          onOpenChange={toggle('month')}
        >
          {(close) => (
            <MonthGrid
              value={month}
              best={city?.climate.bestMonths ?? []}
              onPick={(m) => {
                setMonth(m);
                close();
              }}
            />
          )}
        </Picker>
        <Picker
          label="Сколько"
          value={peopleText(people)}
          kind="dialog"
          alignEnd
          open={open === 'people'}
          onOpenChange={toggle('people')}
        >
          {(close) => <PeopleStepper value={people} onChange={setPeople} onDone={close} />}
        </Picker>
        <button type="submit" className={styles.submit}>
          <Icon name="search" size={18} className={styles.submitIcon} />
          <span className={styles.submitShort}>Найти</span>
          <span className={styles.submitLong}>Найти поездку</span>
        </button>
      </div>
    </form>
  );
}
