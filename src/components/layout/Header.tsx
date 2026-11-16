import { useCallback, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { MAIN_NAV } from '@/app/routes';
import { MobileMenu } from './MobileMenu';
import { TripChip } from './TripChip';
import styles from './Header.module.css';

interface HeaderProps {
  dark?: boolean;
}

export function Header({ dark = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    burgerRef.current?.focus();
  }, []);

  return (
    <header className={[styles.header, dark && styles.dark].filter(Boolean).join(' ')}>
      <div className={styles.bar}>
        <Link to="/" className={styles.logo} aria-label="OBLAKO — на главную">
          <Logo />
        </Link>

        <nav aria-label="Основная навигация" className={styles.nav}>
          {MAIN_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={styles.link}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.end}>
          <TripChip dark={dark} />
          <Button
            to="/profile"
            variant={dark ? 'glass' : 'dark'}
            size="sm"
            className={styles.profile}
          >
            Профиль
          </Button>
        </div>

        <button
          ref={burgerRef}
          type="button"
          className={styles.burger}
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          onClick={() => setMenuOpen(true)}
        >
          <Icon name="menu" size={18} />
        </button>
      </div>

      {menuOpen && <MobileMenu onClose={closeMenu} />}
    </header>
  );
}
