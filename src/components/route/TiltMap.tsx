import type { CSSProperties } from 'react';
import { useReducedMotion } from '@/lib/motion';
import type { ScheduledStop } from '@/lib/route';
import styles from './TiltMap.module.css';

const W = 640;
const H = 520;
type Pt = { x: number; y: number };

/** Вписывает все места города в поле карты с отступом 70, сохраняя пропорции */
function fitter(area: Pt[]) {
  const xs = area.map((p) => p.x);
  const ys = area.map((p) => p.y);
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
  const w = Math.max(Math.max(...xs) - x0, 1);
  const h = Math.max(Math.max(...ys) - y0, 1);
  const k = Math.min((W - 140) / w, (H - 140) / h);
  const dx = (W - w * k) / 2;
  const dy = (H - h * k) / 2;
  return (p: Pt) => ({ x: dx + (p.x - x0) * k, y: dy + (p.y - y0) * k });
}

// Выдавленные кварталы: [x, y, w, h] — декор
const BLOCKS = [
  [60, 60, 70, 50],
  [150, 50, 90, 60],
  [270, 70, 60, 50],
  [360, 40, 80, 70],
  [470, 60, 70, 60],
  [50, 160, 80, 70],
  [170, 170, 70, 60],
  [430, 170, 90, 60],
  [540, 150, 60, 80],
  [60, 290, 90, 60],
  [190, 300, 60, 70],
  [300, 270, 80, 60],
  [480, 290, 90, 70],
  [70, 410, 80, 60],
  [210, 420, 90, 50],
  [520, 400, 70, 70],
];

/** Сглаженная линия через точки */
function smooth(points: { x: number; y: number }[]): string {
  if (!points.length) return '';
  return points.reduce((d, p, i) => {
    if (!i) return `M${p.x} ${p.y}`;
    const prev = points[i - 1];
    const mx = (prev.x + p.x) / 2;
    return `${d} C${mx} ${prev.y} ${mx} ${p.y} ${p.x} ${p.y}`;
  }, '');
}

/** Наклонная 3D-карта дня: кварталы, река, линия маршрута и вертикальные метки */
export function TiltMap({
  items,
  area,
  label,
}: {
  items: ScheduledStop[];
  area: Pt[];
  label: string;
}) {
  const reduced = useReducedMotion();
  const pos = fitter(area);
  const points = items.map((x) => pos(x.place.map));
  const d = smooth(points);

  return (
    <div className={styles.frame}>
      <div className={styles.stage}>
        <div className={styles.tilt}>
          <svg role="img" aria-label={label} viewBox={`0 0 ${W} ${H}`} className={styles.svg}>
            <rect width={W} height={H} rx="24" className={styles.ground} />
            <ellipse cx="380" cy="440" rx="150" ry="70" className={styles.park} />
            <path
              className={styles.river}
              d="M90 520 C 200 440 300 380 420 330 S 540 210 580 120 S 620 40 640 20"
            />
            {BLOCKS.map(([x, y, w, h]) => (
              <g key={`${x}-${y}`}>
                <rect x={x} y={y + 8} width={w} height={h} rx="4" className={styles.blockSide} />
                <rect x={x} y={y} width={w} height={h} rx="4" className={styles.blockTop} />
              </g>
            ))}
            <defs>
              <linearGradient id="route-line" x1="0" x2="1">
                <stop offset="0" className={styles.stop1} />
                <stop offset=".6" className={styles.stop2} />
                <stop offset="1" className={styles.stop3} />
              </linearGradient>
            </defs>
            <path d={d} className={styles.shadow} />
            <path key={d} d={d} className={styles.line} pathLength={100} />
            {!reduced && points.length > 1 && (
              <circle r="7" className={styles.runner}>
                <animateMotion dur="9s" repeatCount="indefinite" path={d} />
              </circle>
            )}
            {points.map((p, i) => (
              <ellipse key={i} cx={p.x} cy={p.y} rx="12" ry="6" className={styles.pinShadow} />
            ))}
          </svg>
          {points.map((p, i) => (
            <span
              key={items[i].stop.placeId}
              aria-hidden="true"
              className={styles.pin}
              style={{ left: p.x, top: p.y } as CSSProperties}
            >
              <span className={styles.head}>{i + 1}</span>
              <span className={styles.stem} />
            </span>
          ))}
        </div>
      </div>
      <span className={styles.badge}>3D‑вид · схема, расстояния примерные</span>
    </div>
  );
}
