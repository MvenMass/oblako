import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { getCity } from '@/lib/cities';
import { daysUntil } from '@/lib/trip';
import { useUserStore } from '@/store/user';
import styles from './TripChip.module.css';

/** Чип в шапке: ближайшая поездка с обратным отсчётом — вход в сценарий с любой страницы */
export function TripChip({ dark }: { dark?: boolean }) {
  const plans = useUserStore((s) => s.plans);
  const [now] = useState(() => Date.now());
  const plan = plans.list.find((p) => p.id === plans.activeId && p.saved);
  const city = plan && getCity(plan.cityId);
  const left = plan ? daysUntil(plan.dateFrom, now) : 0;
  const active = plan && city && left >= -plan.nights;

  const text = !active
    ? 'Спланировать поездку'
    : left > 0
      ? `${city.name} · через ${left} дн.`
      : left === 0
        ? `${city.name} · вылет сегодня`
        : `${city.name} · в поездке`;

  return (
    <Link
      to={active ? `/trip?city=${plan.cityId}` : '/trip'}
      className={styles.chip}
      data-dark={dark || undefined}
      data-active={active || undefined}
    >
      <Icon name="plane" size={16} />
      <span>{text}</span>
    </Link>
  );
}
