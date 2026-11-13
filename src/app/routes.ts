import type { IconName } from '@/components/ui/icons';

export interface NavItem {
  to: string;
  label: string;
}

/** Основная навигация (шапка и бургер) — по docs/spec/pages/home.md */
export const MAIN_NAV: NavItem[] = [
  { to: '/destinations', label: 'Направления' },
  { to: '/quiz', label: 'Подбор' },
  { to: '/route', label: 'Маршрут' },
  { to: '/board', label: 'Табло' },
  { to: '/journal', label: 'Дневник' },
];

/** Все разделы — для мобильного меню */
export const ALL_NAV: NavItem[] = [
  { to: '/', label: 'Главная' },
  ...MAIN_NAV,
  { to: '/budget', label: 'Бюджет' },
  { to: '/booking', label: 'Бронирование' },
  { to: '/packing', label: 'Сборы' },
  { to: '/profile', label: 'Профиль' },
];

export interface BottomNavItem extends NavItem {
  icon: IconName;
  /** Центральная приподнятая кнопка */
  primary?: boolean;
}

/** Нижнее меню телефона — по docs/spec/pages/mobile.md */
export const BOTTOM_NAV: BottomNavItem[] = [
  { to: '/', label: 'Главная', icon: 'home' },
  { to: '/route', label: 'Маршрут', icon: 'route' },
  { to: '/quiz', label: 'Подбор', icon: 'sparkle', primary: true },
  { to: '/packing', label: 'Сборы', icon: 'bag' },
  { to: '/profile', label: 'Профиль', icon: 'user' },
];

/** Страницы с тёмной темой (нижнее меню и шапка темнеют) */
export const DARK_ROUTES = ['/board'];

export const SITE_NAME = 'OBLAKO';
