import type { ReactElement } from 'react';

/** Контурные иконки 24×24 (stroke 2) из макетов */
export const STROKE_ICONS = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </>
  ),
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'arrow-up-right': <path d="M7 17L17 7M9 7h8v8" />,
  'chevron-left': <path d="M15 6l-6 6 6 6" />,
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  home: <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />,
  route: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" />
    </>
  ),
  bag: (
    <>
      <rect x="4" y="7" width="16" height="13" rx="3" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
} satisfies Record<string, ReactElement>;

/** Заливочные иконки 24×24 */
export const FILL_ICONS = {
  plane: (
    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
  ),
  sparkle: <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />,
} satisfies Record<string, ReactElement>;

export type IconName = keyof typeof STROKE_ICONS | keyof typeof FILL_ICONS;

export const ICON_NAMES = [...Object.keys(STROKE_ICONS), ...Object.keys(FILL_ICONS)] as IconName[];
