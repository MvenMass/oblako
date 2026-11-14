import { useId } from 'react';
import { seatInfo, windowView } from '@/lib/booking';
import styles from './WindowView.module.css';

interface WindowViewProps {
  seat: string;
  shade: boolean;
  onShade: (down: boolean) => void;
}

/** Вид из иллюминатора: рамка-«стадион», стекло с бликом, шторка; у окна в рядах 7–11 — крыло */
export function WindowView({ seat, shade, onShade }: WindowViewProps) {
  const id = useId();
  const s = seatInfo(seat);
  const view = windowView(s);

  return (
    <div className={styles.card}>
      <svg role="img" aria-label={view.aria} viewBox="0 0 240 320" className={styles.svg}>
        <defs>
          <clipPath id={`${id}-pane`}>
            <rect x="56" y="44" width="128" height="232" rx="64" />
          </clipPath>
        </defs>
        <rect width="240" height="320" rx="28" className={styles.wall} />
        <rect x="30" y="18" width="180" height="284" rx="90" className={styles.bezel} />
        <rect x="46" y="34" width="148" height="252" rx="74" className={styles.inner} />
        <g clipPath={`url(#${id}-pane)`}>
          <g className={styles.view} data-blur={!s.window || undefined}>
            <rect x="56" y="44" width="128" height="232" className={styles.sky} />
            <circle cx="160" cy="90" r="30" className={styles.sun} />
            <g className={styles.clouds}>
              <ellipse cx="80" cy="230" rx="70" ry="18" />
              <ellipse cx="190" cy="250" rx="80" ry="20" />
              <ellipse cx="130" cy="214" rx="46" ry="11" />
              <ellipse cx="260" cy="226" rx="60" ry="14" />
            </g>
            {s.wing && (
              <g className={styles.wing}>
                <path d="M30 262 L250 196 L250 214 L30 296 Z" />
                <path d="M228 202 L244 168 L252 168 L246 200 Z" />
                <path className={styles.flap} d="M120 252 L150 241 M170 234 L200 223" />
                <circle cx="236" cy="198" r="2.4" className={styles.light} />
              </g>
            )}
          </g>
          {/* Шторка опускается сверху — масштаб по вертикали, без анимации высоты */}
          <rect
            x="56"
            y="44"
            width="128"
            height="232"
            className={styles.shade}
            data-down={shade || undefined}
          />
          <rect x="56" y="44" width="128" height="232" className={styles.glass} />
        </g>
        <rect x="56" y="44" width="128" height="232" rx="64" className={styles.frame} />
      </svg>
      <div className={styles.text}>
        <span className={styles.eyebrow}>Вид из&nbsp;окна · место {seat}</span>
        <span className={styles.title}>{view.title}</span>
        <span className={styles.note}>{view.text}</span>
        <button
          type="button"
          className={styles.toggle}
          aria-pressed={shade}
          onClick={() => onShade(!shade)}
        >
          Шторка опущена
        </button>
      </div>
    </div>
  );
}
