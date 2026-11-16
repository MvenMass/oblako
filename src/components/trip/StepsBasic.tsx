import { Link } from 'react-router-dom';
import { formatRub, getCities, getCity } from '@/lib/cities';
import { photoSrcSet } from '@/lib/img';
import { tripCost } from '@/lib/trip';
import type { TripPlan } from '@/types/user';
import { OptionGroup } from './OptionGroup';
import s from './Steps.module.css';

interface StepProps {
  plan: TripPlan;
  onChange: (patch: Partial<TripPlan>) => void;
}

/** Шаг 1: направление */
export function StepCity({ plan, onChange }: StepProps) {
  return (
    <div className={s.step}>
      <div>
        <h2 className={s.h2}>Куда летим?</h2>
        <p className={s.lead}>
          Вылет из&nbsp;Москвы. Не&nbsp;знаете, куда? <Link to="/quiz">Пройдите подбор</Link>.
        </p>
      </div>
      <OptionGroup
        label="Направление"
        value={plan.cityId}
        onChange={(cityId) =>
          onChange({ cityId, outId: null, backId: null, hotelId: null, transferId: null })
        }
        options={getCities().map((c) => ({
          id: c.id,
          content: (
            <span className={s.city}>
              <span className={s.cityPhoto}>
                <img
                  src={c.places[0].photo}
                  srcSet={photoSrcSet(c.places[0].photo)}
                  sizes="64px"
                  alt=""
                />
              </span>
              <span className={s.title}>{c.name}</span>
              <span className={s.meta}>
                {c.country} · {c.facts.flight}
              </span>
            </span>
          ),
        }))}
      />
    </div>
  );
}

function Counter({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (n: number) => void;
}) {
  return (
    <fieldset className={s.field}>
      <legend>{label}</legend>
      <div className={s.counter}>
        <button
          type="button"
          aria-label={`${label}: меньше`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          −
        </button>
        <output aria-live="polite">
          {value} <span className={s.hint}>{unit}</span>
        </output>
        <button
          type="button"
          aria-label={`${label}: больше`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </fieldset>
  );
}

/** Шаг 2: даты, состав и бюджет */
export function StepDates({ plan, onChange, today }: StepProps & { today: string }) {
  const city = getCity(plan.cityId)!;
  // Оценка по средним вариантам: вечерний прямой, средний отель, такси
  const estimate = tripCost(
    { ...plan, outId: 'out-pm', backId: 'back-pm', hotelId: 'mid', transferId: 'taxi' },
    city,
  ).total;
  const best = city.climate.bestMonths;
  const month = Number(plan.dateFrom.slice(5, 7));

  return (
    <div className={s.step}>
      <div>
        <h2 className={s.h2}>Когда и&nbsp;сколько</h2>
        <p className={s.lead}>
          {best.includes(month)
            ? `${city.name} в этом месяце — хороший сезон.`
            : `Лучшие месяцы для ${city.name}: ${best.join(', ')}. В выбранный — можно, но погода капризнее.`}
        </p>
      </div>
      <div className={s.fields}>
        <label className={s.field}>
          <span>Дата вылета</span>
          <input
            type="date"
            value={plan.dateFrom}
            min={today}
            onChange={(e) => e.target.value && onChange({ dateFrom: e.target.value })}
          />
        </label>
        <Counter
          label="Ночей"
          value={plan.nights}
          min={2}
          max={14}
          unit="ноч."
          onChange={(nights) => onChange({ nights })}
        />
        <Counter
          label="Путешественников"
          value={plan.people}
          min={1}
          max={6}
          unit="чел."
          onChange={(people) => onChange({ people })}
        />
        <label className={s.field}>
          <span>Бюджет на всех, ₽</span>
          <input
            inputMode="numeric"
            value={plan.budget ? String(plan.budget) : ''}
            onChange={(e) => onChange({ budget: Number(e.target.value.replace(/\D/g, '')) || 0 })}
          />
          <button type="button" className={s.link} onClick={() => onChange({ budget: estimate })}>
            По расчёту ≈ {formatRub(estimate)}
          </button>
        </label>
      </div>
    </div>
  );
}
