import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RouteGuide } from '@/components/route/RouteGuide';
import { RoutePlanner } from '@/components/route/RoutePlanner';
import { RoutePrint } from '@/components/route/RoutePrint';
import { Aurora } from '@/components/ui/Aurora';
import { Button } from '@/components/ui/Button';
import { SectionHead } from '@/components/ui/SectionHead';
import { SadCloud } from '@/pages/NotFound/SadCloud';
import { getCity } from '@/lib/cities';
import { plural } from '@/lib/plural';
import { defaultRoute, durationMinutes, placeById } from '@/lib/route';
import { usePageTitle } from '@/lib/usePageTitle';
import { useUserStore } from '@/store/user';
import styles from './Route.module.css';

/** Город для маршрута: ?city= → сохранённый маршрут → места «В маршрут» из галереи */
function useRouteSource() {
  const [params] = useSearchParams();
  const route = useUserStore((s) => s.route);
  const routeAdded = useUserStore((s) => s.routeAdded);
  const setRoute = useUserStore((s) => s.setRoute);
  const fromUrl = getCity(params.get('city') ?? undefined);
  const addedCity = Object.keys(routeAdded).find((id) => routeAdded[id]?.length);
  const target = fromUrl ?? getCity(route?.cityId) ?? getCity(addedCity);

  // Маршрута для этого города ещё нет — собираем из данных и отмеченных мест
  useEffect(() => {
    if (!target || route?.cityId === target.id) return;
    const days = defaultRoute(target);
    const extra = (routeAdded[target.id] ?? []).filter(
      (id) => !days.some((d) => d.stops.some((s) => s.placeId === id)),
    );
    extra.forEach((id) => {
      const p = placeById(target, id);
      if (p) days[0].stops.push({ placeId: id, minutes: durationMinutes(p.duration) });
    });
    setRoute(target.id, days);
  }, [target, route?.cityId, routeAdded, setRoute]);

  return route && target && route.cityId === target.id ? { city: target, days: route.days } : null;
}

export default function Route() {
  const source = useRouteSource();
  usePageTitle(source ? `Маршрут · ${source.city.name}` : 'Маршрут');

  if (!source) {
    return (
      <div className={styles.page}>
        <Aurora grain={false} />
        <div className={`container ${styles.empty}`}>
          <SadCloud className={styles.cloud} />
          <h1 className={styles.emptyTitle}>
            Маршрут пока <span className="grad">пуст</span>
          </h1>
          <p className={styles.emptyText}>
            Добавьте места из&nbsp;галереи города или&nbsp;пройдите подбор&nbsp;— маршрут соберётся
            сам.
          </p>
          <div className={styles.emptyActions}>
            <Button to="/quiz">Подобрать поездку</Button>
            <Button to="/destinations" variant="glass">
              Выбрать направление
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { city, days } = source;
  return (
    <div className={styles.page}>
      <Aurora grain={false} />
      <section className={`container ${styles.content}`} aria-labelledby="route-title">
        <SectionHead
          id="route-title"
          level={1}
          eyebrow="Конструктор маршрута · сохраняется автоматически"
          title={
            <>
              {city.name},{' '}
              <span className="grad">
                {days.length}&nbsp;{plural(days.length, ['день', 'дня', 'дней'])}
              </span>
            </>
          }
          action={
            <Button to={`/budget?city=${city.id}`} variant="glass" size="sm" iconEnd="arrow-right">
              Бюджет поездки
            </Button>
          }
        />
        <RouteGuide cityId={city.id} />
        <div data-print="hide">
          <RoutePlanner city={city} days={days} />
        </div>
        <RoutePrint city={city} days={days} />
      </section>
    </div>
  );
}
