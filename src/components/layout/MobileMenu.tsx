import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { ALL_NAV } from '@/app/routes';
import { lockScroll } from '@/lib/scroll';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled])';

/** Полноэкранное меню: фокус внутри, Esc закрывает, фокус возвращает вызывающий */
export function MobileMenu({ onClose }: MobileMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lockScroll(true);
    ref.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !ref.current) return;

      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      lockScroll(false);
    };
  }, [onClose]);

  return (
    <div ref={ref} className={styles.menu} role="dialog" aria-modal="true" aria-label="Меню">
      <div className={styles.top}>
        <Logo />
        <button type="button" className={styles.close} aria-label="Закрыть меню" onClick={onClose}>
          <Icon name="close" size={18} />
        </button>
      </div>

      <nav aria-label="Все разделы">
        <ul className={styles.list}>
          {ALL_NAV.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.to === '/'} className={styles.link} onClick={onClose}>
                {item.label}
                <Icon name="arrow-right" size={18} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
