import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CategoryRing } from '@/components/budget/CategoryRing';
import { Expenses } from '@/components/budget/Expenses';
import { ExtremesTile, PlanTile, RateTile } from '@/components/budget/InfoTiles';
import { MiniRoute } from '@/components/budget/MiniRoute';
import { SpendTile } from '@/components/budget/SpendTile';
import t from '@/components/budget/Tiles.module.css';
import { useCityRate } from '@/components/city/useCityData';
import { Aurora } from '@/components/ui/Aurora';
import { Button } from '@/components/ui/Button';
import { SectionHead } from '@/components/ui/SectionHead';
import { SadCloud } from '@/pages/NotFound/SadCloud';
import { demoExpenses, planFor, totalRub } from '@/lib/budget';
import { getCity } from '@/lib/cities';
import { plural } from '@/lib/plural';
import { usePageTitle } from '@/lib/usePageTitle';
import { useUserStore } from '@/store/user';
import type { City } from '@/types/city';
import styles from './Budget.module.css';

/** Город бюджета: ?city= → сохранённый бюджет → маршрут → результат подбора */
function useBudgetCity(): City | undefined {
  const [params] = useSearchParams();
  const budget = useUserStore((s) => s.budget);
  const routeCity = useUserStore((s) => s.route?.cityId);
  const quizCity = useUserStore((s) => s.quiz.result);
  return (
    getCity(params.get('city') ?? undefined) ??
    getCity(budget?.cityId) ??
    getCity(routeCity) ??
    getCity(quizCity ?? undefined)
  );
}

function Planner({ city }: { city: City }) {
  const budget = useUserStore((s) => s.budget);
  const route = useUserStore((s) => s.route);
  const quiz = useUserStore((s) => s.quiz.answers);
  const setBudget = useUserStore((s) => s.setBudget);
  const rate = useCityRate(city);
  const routeDays = route?.cityId === city.id ? route.days.length : 0;
  const baseDays = routeDays || quiz?.days || 7;

  // Новый город — новый бюджет с планом из подбора или по данным города
  useEffect(() => {
    if (budget?.cityId !== city.id) setBudget(city.id, planFor(city, baseDays, quiz), []);
  }, [budget?.cityId, city, baseDays, quiz, setBudget]);

  if (budget?.cityId !== city.id) return null;
  const { plan, expenses } = budget;
  const days = Math.max(baseDays, ...expenses.map((e) => e.day));
  const code = city.facts.currency.rateCode;

  return (
    <section className={`container ${styles.content}`} aria-labelledby="budget-title">
      <SectionHead
        id="budget-title"
        level={1}
        eyebrow={`Бюджет поездки · ${city.name}, ${days} ${plural(days, ['день', 'дня', 'дней'])} · демо-цены`}
        title={
          <>
            Деньги <span className="grad">под&nbsp;контролем</span>
          </>
        }
        action={
          <div className={styles.actions}>
            <Button
              variant="glass"
              size="sm"
              iconStart="sparkle"
              onClick={() => setBudget(city.id, plan, demoExpenses(city, days, rate.rub))}
            >
              Заполнить примером
            </Button>
            {expenses.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setBudget(city.id, plan, [])}>
                Очистить
              </Button>
            )}
          </div>
        }
      />
      <div className={t.bento}>
        <SpendTile expenses={expenses} plan={plan} days={days} />
        <CategoryRing expenses={expenses} />
        <RateTile code={code} rub={rate.rub} caption={rate.caption} isRub={rate.isRub} />
        <PlanTile spent={totalRub(expenses)} plan={plan} />
        <MiniRoute city={city} />
        <ExtremesTile expenses={expenses} />
        <Expenses
          key={city.id}
          expenses={expenses}
          days={days}
          local={rate.isRub ? null : { code, rate: rate.rub }}
        />
      </div>
    </section>
  );
}

export default function Budget() {
  const city = useBudgetCity();
  usePageTitle(city ? `Бюджет · ${city.name}` : 'Бюджет');

  return (
    <div className={styles.page}>
      <Aurora grain={false} />
      {city ? (
        <Planner city={city} />
      ) : (
        <div className={`container ${styles.empty}`}>
          <SadCloud className={styles.cloud} />
          <h1 className={styles.emptyTitle}>
            Бюджета пока <span className="grad">нет</span>
          </h1>
          <p className={styles.emptyText}>
            Выберите направление или&nbsp;пройдите подбор&nbsp;— план посчитается по&nbsp;данным
            города.
          </p>
          <div className={styles.emptyActions}>
            <Button to="/quiz">Подобрать поездку</Button>
            <Button to="/destinations" variant="glass">
              Выбрать направление
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
