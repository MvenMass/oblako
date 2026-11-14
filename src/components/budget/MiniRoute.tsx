import { Link } from 'react-router-dom';
import { plural } from '@/lib/plural';
import { schedule } from '@/lib/route';
import { useUserStore } from '@/store/user';
import type { City } from '@/types/city';
import t from './Tiles.module.css';
import styles from './MiniRoute.module.css';

const W = 360;
const H = 150;

/** Мини-маршрут первого дня из конструктора */
export function MiniRoute({ city }: { city: City }) {
  const route = useUserStore((s) => s.route);
  const items = route?.cityId === city.id && route.days[0] ? schedule(city, route.days[0]) : [];
  const xs = city.places.map((p) => p.map.x);
  const ys = city.places.map((p) => p.map.y);
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
  const k = Math.min(
    (W - 40) / Math.max(Math.max(...xs) - x0, 1),
    (H - 40) / Math.max(Math.max(...ys) - y0, 1),
  );
  const pts = items.map((x) => ({
    x: 20 + (x.place.map.x - x0) * k,
    y: 20 + (x.place.map.y - y0) * k,
  }));
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const n = items.length;

  return (
    <div className={`${t.tile} ${t.w2} ${styles.tile}`}>
      <div className={styles.text}>
        <span className={t.label}>Маршрут первого дня</span>
        <span className={t.mid}>
          {n ? `${n} ${plural(n, ['точка', 'точки', 'точек'])}` : 'Пусто'}
        </span>
        <Link to={`/route?city=${city.id}`} className={t.link}>
          {n ? 'Открыть конструктор' : 'Собрать маршрут'}
        </Link>
      </div>
      <svg
        role="img"
        aria-label={
          n
            ? `Мини-маршрут: ${items.map((x) => x.place.name).join(' → ')}`
            : 'Маршрут ещё не собран'
        }
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        data-empty={!n || undefined}
      >
        <g className={styles.streets}>
          <path d={`M0 40 H${W}`} />
          <path d={`M0 110 H${W}`} />
          <path d={`M90 0 V${H}`} />
          <path d={`M250 0 V${H}`} />
        </g>
        <path d={d} className={styles.line} />
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="7"
            className={styles.pin}
            data-edge={i === 0 || i === n - 1 || undefined}
          />
        ))}
      </svg>
    </div>
  );
}
