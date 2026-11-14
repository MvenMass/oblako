import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useReducedMotion } from '@/lib/motion';
import { plural } from '@/lib/plural';
import { eliminationPhase, MONTHS_IN, type Match } from '@/lib/quiz';
import styles from './StepCalc.module.css';

const W = 720;
const H = 464;
/** Проекция: долгота 10…125, широта −12…62 */
const project = (lat: number, lon: number) => ({
  x: ((lon - 10) / 115) * W,
  y: ((62 - lat) / 74) * H,
});
const MOSCOW = project(55.75, 37.62);
const PHASE_MS = 750;
const CHECKS = ['Направления', 'Сезон', 'Бюджет', 'Настроение'];

interface StepCalcProps {
  ranked: Match[];
  month: number;
  days: number;
  onDone: () => void;
}

/** Шаг 4: ~3 с расчёта — отсеянные города сереют, у топ-3 пульс и дуги из Москвы */
export function StepCalc({ ranked, month, days, onDone }: StepCalcProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = reduced ? 250 : PHASE_MS;
    const timers = [1, 2, 3].map((p) => setTimeout(() => setPhase(p), t * p));
    timers.push(setTimeout(onDone, t * 4 + (reduced ? 0 : 500)));
    return () => timers.forEach(clearTimeout);
  }, [reduced, onDone]);

  const ticker = [
    'Смотрим 11 направлений…',
    `Проверяем сезон ${MONTHS_IN[month]}…`,
    `Считаем бюджет на ${days} ${plural(days, ['день', 'дня', 'дней'])}…`,
    'Сверяем настроение',
  ][phase];

  return (
    <div className={styles.calc}>
      <svg
        role="img"
        aria-label="Карта направлений: идёт подбор"
        viewBox={`0 0 ${W} ${H}`}
        className={styles.map}
      >
        <rect width={W} height={H} rx="28" className={styles.bg} />
        {phase === 3 &&
          ranked.slice(0, 3).map((m) => {
            const b = project(m.city.coords.lat, m.city.coords.lon);
            return (
              <path
                key={m.city.id}
                className={styles.arc}
                d={`M${MOSCOW.x} ${MOSCOW.y} Q${(MOSCOW.x + b.x) / 2} ${Math.min(MOSCOW.y, b.y) - 60} ${b.x} ${b.y}`}
              />
            );
          })}
        <circle cx={MOSCOW.x} cy={MOSCOW.y} r="7" className={styles.home} />
        {ranked.map((m, i) => {
          const p = project(m.city.coords.lat, m.city.coords.lon);
          const gone = i > 2 && eliminationPhase(m) <= phase;
          const win = phase === 3 && i < 3;
          return (
            <g key={m.city.id} className={`${styles.mark} ${gone ? styles.gone : ''}`}>
              {win && <circle cx={p.x} cy={p.y} r="16" className={styles.pulse} />}
              <circle
                cx={p.x}
                cy={p.y}
                r="8"
                className={win ? styles.win : styles.dot}
                style={{ fill: win ? undefined : m.city.theme.accent }}
              />
              <text x={p.x} y={p.y - 14} className={styles.label}>
                {m.city.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className={styles.side}>
        <svg aria-hidden="true" viewBox="0 0 120 120" className={styles.ring}>
          <circle cx="60" cy="60" r="52" className={styles.ringTrack} />
          <circle
            cx="60"
            cy="60"
            r="52"
            className={styles.ringValue}
            pathLength={100}
            style={{ strokeDashoffset: 100 - (phase + 1) * 25 }}
          />
        </svg>
        <p role="status" className={styles.ticker}>
          {ticker}
        </p>
        <ul className={styles.checks}>
          {CHECKS.map((c, i) => (
            <li key={c} className={i <= phase ? styles.checkOn : undefined}>
              <span
                aria-hidden="true"
                className={`${styles.box} ${i < phase || phase === 3 ? styles.boxDone : ''}`}
              >
                <Icon name="check" size={14} />
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
