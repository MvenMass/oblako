import { NavLink } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { BOTTOM_NAV } from '@/app/routes';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  dark?: boolean;
}

/** Нижнее меню — видно только до 768px */
export function BottomNav({ dark = false }: BottomNavProps) {
  return (
    <nav
      aria-label="Нижнее меню"
      className={[styles.dock, dark && styles.dark].filter(Boolean).join(' ')}
    >
      {BOTTOM_NAV.map((item) =>
        item.primary ? (
          <NavLink key={item.to} to={item.to} className={styles.primary} aria-label={item.label}>
            <Icon name={item.icon} size={26} />
          </NavLink>
        ) : (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={styles.item}>
            <Icon name={item.icon} size={22} />
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ),
      )}
    </nav>
  );
}
