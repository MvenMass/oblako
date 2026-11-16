import { useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { formatRate, useCityRate } from '@/components/city/useCityData';
import { formatRub, getCities, getCity } from '@/lib/cities';
import { MONTHS } from '@/lib/search';
import { useInView } from '@/lib/motion';
import type { City } from '@/types/city';
import styles from './TripFacts.module.css';

const PICKS = ['istanbul', 'tbilisi', 'yerevan', 'sochi', 'hanoi'];

type Tone = 'sky' | 'pink' | 'dusk';

// Глифы внутри объёмных шариков: белые линии 24×24
const GLYPHS: Record<string, ReactNode> = {
  plane: <path d="M3 13l18-7-5 14-3-6-6-1zM13 14l8-8" />,
  passport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 16h6" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="12" cy="7" rx="7" ry="3" />
      <path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 10h18M16 14h2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </>
  ),
};

function Fact({
  icon,
  tone,
  label,
  value,
  note,
}: {
  icon: string;
  tone: Tone;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <li className={styles.fact}>
      <span aria-hidden="true" className={styles.icon} data-tone={tone}>
        <svg viewBox="0 0 24 24" width="26" height="26">
          {GLYPHS[icon]}
        </svg>
      </span>
      <span className={styles.label}>{label}</span>
      <b className={styles.value}>{value}</b>
      <span className={styles.note}>{note}</span>
    </li>
  );
}

function Facts({ city }: { city: City }) {
  const rate = useCityRate(city);
  const month = new Date().getMonth();
  const temp = city.climate.avgHighC[month];
  const week = city.quiz.flightRub + city.quiz.dailyRub * 7;
  const per = rate.rub < 0.1 ? 1000 : 1;
  return (
    <>
      <Fact icon="plane" tone="sky" label="Перелёт" value={city.facts.flight} note="из Москвы" />
      <Fact
        icon="passport"
        tone="dusk"
        label="Виза"
        value={city.facts.visa}
        note="для граждан России"
      />
      <Fact
        icon="coins"
        tone="pink"
        label="Валюта"
        value={
          rate.isRub
            ? 'Рубли'
            : `${per} ${city.facts.currency.rateCode} = ${formatRate(rate.rub * per)} ₽`
        }
        note={rate.isRub ? 'курс не нужен' : rate.caption}
      />
      <Fact
        icon="sun"
        tone="sky"
        label={`${MONTHS[month]}`}
        value={`${temp > 0 ? '+' : ''}${temp}°`}
        note="средний дневной максимум"
      />
      <Fact
        icon="wallet"
        tone="pink"
        label="Неделя на одного"
        value={`от ${formatRub(week)}`}
        note="перелёт и жизнь в городе · демо"
      />
      <Fact
        icon="clock"
        tone="dusk"
        label="Разница во времени"
        value={city.facts.timeDiff}
        note="с Москвой"
      />
    </>
  );
}

/** «Поездка в цифрах»: переключатель города и шесть фактов с объёмными иконками */
export function TripFacts() {
  const root = useRef<HTMLDivElement>(null);
  const shown = useInView(root);
  const [id, setId] = useState(PICKS[0]);
  const city = getCity(id)!;
  const cities = getCities().filter((c) => PICKS.includes(c.id));

  return (
    <div ref={root} className={styles.box} data-shown={shown || undefined}>
      <div className={styles.head}>
        <h3 className={styles.title}>
          Поездка в&nbsp;<span className="grad">цифрах</span>
        </h3>
        <div role="group" aria-label="Город" className={styles.chips}>
          {cities.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={c.id === id}
              className={styles.chip}
              onClick={() => setId(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <ul key={id} className={styles.grid} aria-live="polite">
        <Facts city={city} />
      </ul>
      <Link to={`/city/${city.id}`} className={styles.more}>
        Всё о&nbsp;направлении {city.name}
      </Link>
    </div>
  );
}
