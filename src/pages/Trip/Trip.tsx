import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StepCity, StepDates } from '@/components/trip/StepsBasic';
import { StepFlights, StepHotel, StepTransfer } from '@/components/trip/StepsBooking';
import { TripSummary } from '@/components/trip/TripSummary';
import { Aurora } from '@/components/ui/Aurora';
import { Button } from '@/components/ui/Button';
import { applyTrip } from '@/lib/applyTrip';
import { getCity } from '@/lib/cities';
import { daysUntil, draftPlan, todayIso } from '@/lib/trip';
import { usePageTitle } from '@/lib/usePageTitle';
import { useUserStore } from '@/store/user';
import type { TripPlan } from '@/types/user';
import styles from './Trip.module.css';

const STEPS = ['Направление', 'Даты и бюджет', 'Билеты', 'Отель', 'Трансфер', 'Итог'];

/** Мастер «Моя поездка»: направление → даты → билеты → отель → трансфер → итог */
export default function Trip() {
  const [params] = useSearchParams();
  const plans = useUserStore((s) => s.plans);
  const quiz = useUserStore((s) => s.quiz);
  const upsertPlan = useUserStore((s) => s.upsertPlan);
  const [now] = useState(() => Date.now());
  const urlCity = getCity(params.get('city') ?? undefined)?.id;

  // Продолжаем активную или будущую поездку в этот город, иначе — новый черновик
  const [initial] = useState<TripPlan>(() => {
    const active = plans.list.find((p) => p.id === plans.activeId);
    if (active && (!urlCity || active.cityId === urlCity)) return active;
    const upcoming = plans.list.find(
      (p) => p.cityId === urlCity && daysUntil(p.dateFrom, now) >= 0,
    );
    return upcoming ?? draftPlan(urlCity ?? quiz.result ?? 'istanbul', quiz.answers, now);
  });
  const plan = plans.list.find((p) => p.id === initial.id) ?? initial;
  const [step, setStep] = useState(() => (plan.saved ? 5 : urlCity ? 1 : 0));
  const [visited, setVisited] = useState(step);
  const city = getCity(plan.cityId)!;
  usePageTitle(`Поездка · ${city.name}`);

  // Любая правка — сразу в store как черновик; сохранённую поездку нужно сохранить заново
  const update = (patch: Partial<TripPlan>) => upsertPlan({ ...plan, ...patch, saved: false });
  const go = (n: number) => {
    setStep(n);
    setVisited((v) => Math.max(v, n));
    document.getElementById('trip-step')?.focus();
  };
  const ready = [
    true,
    !!plan.dateFrom,
    !!(plan.outId && plan.backId),
    !!plan.hotelId,
    !!plan.transferId,
    true,
  ];

  return (
    <div className={styles.page}>
      <Aurora grain={false} />
      <div className={`container ${styles.content}`}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>Моя поездка · все цены и брони демо</p>
          <h1 className={styles.h1}>
            Поездка в&nbsp;<span className="grad">{city.name}</span>
          </h1>
        </header>

        <ol className={`${styles.steps} no-print`} aria-label="Шаги поездки">
          {STEPS.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                aria-current={i === step ? 'step' : undefined}
                data-done={(i < step && ready[i]) || undefined}
                disabled={i > visited && !plan.saved}
                onClick={() => go(i)}
              >
                <span aria-hidden="true">{i < step && ready[i] ? '✓' : i + 1}</span>
                {label}
              </button>
            </li>
          ))}
        </ol>

        <section id="trip-step" tabIndex={-1} className={styles.stage} aria-label={STEPS[step]}>
          {step === 0 && <StepCity plan={plan} onChange={update} />}
          {step === 1 && <StepDates plan={plan} onChange={update} today={todayIso(now)} />}
          {step === 2 && <StepFlights plan={plan} onChange={update} />}
          {step === 3 && <StepHotel plan={plan} onChange={update} />}
          {step === 4 && <StepTransfer plan={plan} onChange={update} />}
          {step === 5 && (
            <TripSummary
              plan={plan}
              now={now}
              onStep={go}
              onSave={() => applyTrip(plan, useUserStore.getState())}
              // Отметка в чек-листе не меняет поездку — сохранённая остаётся сохранённой
              onToggleCheck={(id) =>
                upsertPlan({ ...plan, checklist: { ...plan.checklist, [id]: !plan.checklist[id] } })
              }
            />
          )}
        </section>

        {step < 5 && (
          <div className={`${styles.nav} no-print`}>
            {step > 0 && (
              <Button variant="glass" iconStart="chevron-left" onClick={() => go(step - 1)}>
                Назад
              </Button>
            )}
            <Button iconEnd="arrow-right" onClick={() => go(step + 1)}>
              {ready[step] ? 'Дальше' : 'Пропустить'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
