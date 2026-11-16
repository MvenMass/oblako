import { formatRub, getCity } from '@/lib/cities';
import { photoSrcSet } from '@/lib/img';
import { formatTime } from '@/lib/route';
import { flightOptions, hotelOptions, transferOptions } from '@/lib/trip';
import type { TripPlan } from '@/types/user';
import { OptionGroup } from './OptionGroup';
import s from './Steps.module.css';

interface StepProps {
  plan: TripPlan;
  onChange: (patch: Partial<TripPlan>) => void;
}

const hours = (m: number) => `${Math.floor(m / 60)} ч${m % 60 ? ` ${m % 60} мин` : ''}`;

/** Шаг 3: перелёт туда и обратно */
export function StepFlights({ plan, onChange }: StepProps) {
  const city = getCity(plan.cityId)!;
  const group = (dir: 'out' | 'back') =>
    flightOptions(city, dir).map((f) => ({
      id: f.id,
      content: (
        <>
          <span className={s.times}>
            {formatTime(f.dep)}
            <i aria-hidden="true" />
            {formatTime((f.dep + f.minutes) % 1440)}
          </span>
          <span className={s.title}>{f.label}</span>
          <span className={s.meta}>
            {f.no} · {hours(f.minutes)}
            {f.stops ? ' · 1 пересадка' : ''}
          </span>
          <span className={s.price}>
            {formatRub(f.price * plan.people)}{' '}
            <span className={s.priceNote}>
              {plan.people > 1 ? `за ${plan.people} чел.` : 'за 1 чел.'}
            </span>
          </span>
        </>
      ),
    }));

  return (
    <div className={s.step}>
      <div>
        <h2 className={s.h2}>Билеты</h2>
        <p className={s.lead}>Рейсы и цены вымышленные&nbsp;— это демо. Время московское.</p>
      </div>
      <h3 className={s.sub}>Москва → {city.name}</h3>
      <OptionGroup
        label="Рейс туда"
        options={group('out')}
        value={plan.outId}
        onChange={(outId) => onChange({ outId })}
      />
      <h3 className={s.sub}>{city.name} → Москва</h3>
      <OptionGroup
        label="Рейс обратно"
        options={group('back')}
        value={plan.backId}
        onChange={(backId) => onChange({ backId })}
      />
    </div>
  );
}

/** Шаг 4: отель */
export function StepHotel({ plan, onChange }: StepProps) {
  const city = getCity(plan.cityId)!;
  const rooms = Math.ceil(plan.people / 2);
  return (
    <div className={s.step}>
      <div>
        <h2 className={s.h2}>Где жить</h2>
        <p className={s.lead}>
          Отели вымышленные, фото&nbsp;— виды района. {rooms > 1 ? `Номеров: ${rooms}.` : ''}
        </p>
      </div>
      <OptionGroup
        label="Отель"
        value={plan.hotelId}
        onChange={(hotelId) => onChange({ hotelId })}
        options={hotelOptions(city).map((h) => ({
          id: h.id,
          content: (
            <>
              <span className={s.hotelPhoto}>
                <img src={h.photo} srcSet={photoSrcSet(h.photo)} sizes="360px" alt="" />
              </span>
              <span className={s.badge}>
                {h.kind} · {h.rating.toFixed(1).replace('.', ',')}
              </span>
              <span className={s.title}>{h.name}</span>
              <span className={s.meta}>
                {h.district} · {h.center}
              </span>
              <span className={s.price}>
                {formatRub(h.night * plan.nights * rooms)}{' '}
                <span className={s.priceNote}>
                  за {plan.nights} ноч. · {formatRub(h.night)} за ночь
                </span>
              </span>
            </>
          ),
        }))}
      />
    </div>
  );
}

/** Шаг 5: трансфер из аэропорта */
export function StepTransfer({ plan, onChange }: StepProps) {
  const city = getCity(plan.cityId)!;
  return (
    <div className={s.step}>
      <div>
        <h2 className={s.h2}>Из&nbsp;аэропорта до&nbsp;отеля</h2>
        <p className={s.lead}>
          Цена в&nbsp;одну сторону на&nbsp;всю компанию, учтём туда и&nbsp;обратно.
        </p>
      </div>
      <OptionGroup
        label="Трансфер"
        value={plan.transferId}
        onChange={(transferId) => onChange({ transferId })}
        options={transferOptions(city).map((t) => ({
          id: t.id,
          content: (
            <>
              <span className={s.title}>{t.name}</span>
              <span className={s.meta}>
                {t.text} · ≈ {t.minutes} мин
              </span>
              <span className={s.price}>{formatRub(t.price)}</span>
            </>
          ),
        }))}
      />
    </div>
  );
}
