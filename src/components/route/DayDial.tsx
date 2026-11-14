import { useEffect, useState } from 'react';
import { localDate } from '@/lib/cityTime';
import { formatTime, SUNRISE, SUNSET, type ScheduledStop } from '@/lib/route';
import styles from './DayDial.module.css';

const C = 120;
const R = 92;

/** Точка на кольце 24 ч: 0 — сверху, 6 — справа */
const at = (min: number, r = R) => {
  const a = (min / 1440) * Math.PI * 2 - Math.PI / 2;
  return { x: C + Math.cos(a) * r, y: C + Math.sin(a) * r };
};

function arc(from: number, to: number): string {
  const a = at(from);
  const b = at(to);
  const large = (to - from + 1440) % 1440 > 720 ? 1 : 0;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} A${R} ${R} 0 ${large} 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

const COLORS = ['var(--sky)', 'var(--flamingo)', 'var(--dusk)', 'var(--sky-deep)'];

/** Циферблат дня: сектора точек, ночь, солнце и луна, стрелка местного времени */
export function DayDial({ items, utc }: { items: ScheduledStop[]; utc: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);
  const local = localDate(utc, now);
  const nowMin = local.getUTCHours() * 60 + local.getUTCMinutes();
  // Метка «сейчас» — короткий штрих поперёк кольца, не заходит на подписи в центре
  const handIn = at(nowMin, R - 16);
  const handOut = at(nowMin, R + 14);
  const end = items.length ? items[items.length - 1].leave : 0;
  const sun = at(SUNRISE);
  const moon = at(SUNSET);
  const label = items.length
    ? `Циферблат дня: ${items.length} точек с ${formatTime(items[0].arrive)} до ${formatTime(end)}, закат в ${formatTime(SUNSET)}`
    : 'Циферблат дня: точек нет';

  return (
    <div className={styles.dial}>
      <svg role="img" aria-label={label} viewBox="0 0 240 240" className={styles.svg}>
        <circle cx={C} cy={C} r={R} className={styles.track} />
        <path d={arc(SUNSET, SUNRISE)} className={styles.night} />
        {items.map((x, i) => (
          <path
            key={x.stop.placeId}
            d={arc(x.arrive, x.leave)}
            className={styles.seg}
            style={{ stroke: COLORS[i % COLORS.length] }}
          />
        ))}
        <g className={styles.hours}>
          <text x="120" y="16">
            0
          </text>
          <text x="228" y="124">
            6
          </text>
          <text x="120" y="236">
            12
          </text>
          <text x="12" y="124">
            18
          </text>
        </g>
        <circle cx={sun.x} cy={sun.y} r="9" className={styles.sun} />
        <circle cx={moon.x} cy={moon.y} r="8" className={styles.moon} />
        <line x1={handIn.x} y1={handIn.y} x2={handOut.x} y2={handOut.y} className={styles.hand} />
        <text x="120" y="112" className={styles.small}>
          {items.length ? `с ${formatTime(items[0].arrive)} до` : 'нет точек'}
        </text>
        {items.length > 0 && (
          <text x="120" y="140" className={styles.big}>
            {formatTime(end)}
          </text>
        )}
      </svg>
      <span className={styles.note}>
        Рассвет {formatTime(SUNRISE)} · закат {formatTime(SUNSET)} · демо
      </span>
    </div>
  );
}
