import { Link } from 'react-router-dom';
import { formatRate, useCityRate } from '@/components/city/useCityData';
import { Checklist } from '@/components/trip/Checklist';
import { formatRub } from '@/lib/cities';
import { photoSrcSet } from '@/lib/img';
import { ITEMS } from '@/lib/packing';
import { MONTHS_IN } from '@/lib/quiz';
import { formatTime } from '@/lib/route';
import { addDays, daysUntil, flightOptions, hotelOptions, tripCost } from '@/lib/trip';
import { useUserStore } from '@/store/user';
import type { City } from '@/types/city';
import type { TripPlan } from '@/types/user';
import styles from './NextTrip.module.css';

const DATE = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
const fmt = (iso: string) => DATE.format(new Date(`${iso}T12:00:00`));

/** «Что нужно знать о стране»: виза, валюта по курсу ЦБ, язык, розетки, время, климат */
function CountryInfo({ city, month }: { city: City; month: number }) {
  const rate = useCityRate(city);
  const per = rate.rub < 0.1 ? 1000 : 1;
  const rows: [string, string][] = [
    ['Виза', city.facts.visa],
    [
      'Валюта',
      rate.isRub
        ? 'рубли'
        : `${city.facts.currency.name}, ${per} ${city.facts.currency.rateCode} = ${formatRate(rate.rub * per)} ₽`,
    ],
    ['Язык', `${city.facts.language} · ${city.facts.languageNote}`],
    ['Розетки', city.facts.plugs],
    ['Время', `${city.facts.timeDiff} к Москве`],
    [
      'Погода',
      `${MONTHS_IN[month]} днём до ${city.climate.avgHighC[month] > 0 ? '+' : ''}${city.climate.avgHighC[month]}°`,
    ],
  ];
  return (
    <section className={styles.country} aria-labelledby="country-title">
      <h3 id="country-title">Что нужно знать: {city.country}</h3>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Ближайшая поездка: отсчёт, рейс, отель, бюджет, сборы и чек-лист */
export function NextTrip({ plan, city, now }: { plan: TripPlan; city: City; now: number }) {
  const budget = useUserStore((s) => s.budget);
  const packing = useUserStore((s) => s.packing);
  const toggleCheck = useUserStore((s) => s.toggleCheck);
  const left = daysUntil(plan.dateFrom, now);
  const out = flightOptions(city, 'out').find((f) => f.id === plan.outId);
  const hotel = hotelOptions(city).find((h) => h.id === plan.hotelId);
  const spent = budget?.cityId === city.id ? budget.expenses.reduce((s, e) => s + e.rub, 0) : 0;
  const total = plan.budget || tripCost(plan, city).total;
  const packed =
    packing?.cityId === city.id ? Object.values(packing.packed).filter(Boolean).length : 0;
  const photo = city.places[0].photo;

  return (
    <div className={styles.wrap}>
      <section className={styles.card} aria-labelledby="next-title">
        <span className={styles.photo} aria-hidden="true">
          <img src={photo} srcSet={photoSrcSet(photo)} sizes="600px" alt="" />
        </span>
        <div className={styles.body}>
          <p className={styles.eyebrow}>Ближайшая поездка</p>
          <h2 id="next-title" className={styles.title}>
            {city.name}
          </h2>
          <p className={styles.count}>
            {left > 0 ? (
              <>
                через <b>{left}</b> дн.
              </>
            ) : left === 0 ? (
              'вылет сегодня'
            ) : (
              'вы в поездке'
            )}
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Даты</dt>
              <dd>
                {fmt(plan.dateFrom)} — {fmt(addDays(plan.dateFrom, plan.nights))}
              </dd>
            </div>
            <div>
              <dt>Рейс</dt>
              <dd>{out ? `${formatTime(out.dep)} · ${out.no}` : 'не выбран'}</dd>
            </div>
            <div>
              <dt>Отель</dt>
              <dd>{hotel?.name ?? 'не выбран'}</dd>
            </div>
            <div>
              <dt>Бюджет</dt>
              <dd>
                {formatRub(spent)} из {formatRub(total)}
              </dd>
            </div>
            <div>
              <dt>Сборы</dt>
              <dd>
                {packed} из {ITEMS.length}
              </dd>
            </div>
          </dl>
          <div className={styles.links}>
            <Link to={`/trip?city=${city.id}`}>Поездка</Link>
            <Link to={`/route?city=${city.id}`}>Маршрут</Link>
            <Link to={`/budget?city=${city.id}`}>Бюджет</Link>
            <Link to={`/packing?city=${city.id}`}>Сборы</Link>
          </div>
        </div>
      </section>
      <div className={styles.side}>
        <CountryInfo city={city} month={Number(plan.dateFrom.slice(5, 7)) - 1} />
        <Checklist plan={plan} now={now} onToggle={(id) => toggleCheck(plan.id, id)} />
      </div>
    </div>
  );
}
