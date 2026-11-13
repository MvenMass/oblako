import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PageTransition } from '@/components/layout/PageTransition';
import { useReducedMotion } from '@/lib/motion';
import { scrollToTop, useSmoothScroll } from '@/lib/scroll';
import { DARK_ROUTES } from './routes';
import styles from './Layout.module.css';

export function Layout() {
  const { pathname, hash } = useLocation();
  const reduced = useReducedMotion();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const dark = DARK_ROUTES.some((r) => pathname.startsWith(r));

  useSmoothScroll(!reduced);

  // Смена страницы: наверх и фокус на контент, чтобы скринридер начал с новой страницы
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (hash) return;
    scrollToTop();
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <div className={[styles.app, dark && styles.dark].filter(Boolean).join(' ')}>
      <a href="#main" className={styles.skip}>
        Перейти к&nbsp;содержимому
      </a>
      <Header dark={dark} />
      <main id="main" ref={mainRef} tabIndex={-1} className={styles.main}>
        <Suspense fallback={<div className={styles.fallback} />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer dark={dark} />
      <BottomNav dark={dark} />
      <PageTransition routeKey={pathname} />
    </div>
  );
}
