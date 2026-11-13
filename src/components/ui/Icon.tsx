import { FILL_ICONS, STROKE_ICONS, type IconName } from './icons';

interface IconProps {
  name: IconName;
  size?: number;
  /** Подпись для смысловой иконки. Без неё иконка декоративная (aria-hidden). */
  label?: string;
  className?: string;
}

export function Icon({ name, size = 20, label, className }: IconProps) {
  const isFill = name in FILL_ICONS;
  const a11y = label
    ? { role: 'img', 'aria-label': label }
    : { 'aria-hidden': true as const, focusable: 'false' as const };

  return (
    <svg
      {...a11y}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFill ? 'currentColor' : 'none'}
      stroke={isFill ? undefined : 'currentColor'}
      strokeWidth={isFill ? undefined : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isFill
        ? FILL_ICONS[name as keyof typeof FILL_ICONS]
        : STROKE_ICONS[name as keyof typeof STROKE_ICONS]}
    </svg>
  );
}
