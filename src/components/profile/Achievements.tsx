import type { CSSProperties, PointerEvent } from 'react';
import { useReducedMotion } from '@/lib/motion';
import type { Achievement } from '@/lib/profile';
import styles from './Achievements.module.css';

const ICONS = ['var(--ach-sky)', 'var(--ach-pink)', 'var(--ach-green)', 'var(--ach-gold)'];

/** Достижения — голографические карточки: наклон за курсором и перелив у полученных */
export function Achievements({ list }: { list: Achievement[] }) {
  const reduced = useReducedMotion();

  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    if (reduced) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${((0.5 - y) * 14).toFixed(1)}deg`);
    el.style.setProperty('--ry', `${((x - 0.5) * 18).toFixed(1)}deg`);
    el.style.setProperty('--px', `${Math.round(x * 100)}%`);
    el.style.setProperty('--py', `${Math.round(y * 100)}%`);
    el.dataset.over = '';
  };
  const onLeave = (e: PointerEvent<HTMLLIElement>) => {
    const el = e.currentTarget;
    ['--rx', '--ry', '--px', '--py'].forEach((k) => el.style.removeProperty(k));
    delete el.dataset.over;
  };

  return (
    <section className={styles.section} aria-labelledby="ach-title">
      <h2 id="ach-title" className={styles.h2}>
        Достижения
      </h2>
      <ul className={styles.grid}>
        {list.map((a, i) => {
          const pct = Math.round(a.progress * 100);
          return (
            <li
              key={a.id}
              className={styles.card}
              data-got={a.got || undefined}
              data-locked={(!a.got && !pct) || undefined}
              style={{ '--icon': ICONS[i % ICONS.length] } as CSSProperties}
              onPointerMove={onMove}
              onPointerLeave={onLeave}
            >
              <span
                aria-hidden="true"
                className={styles.icon}
                data-round={i % 2 === 0 || undefined}
              />
              <span className={styles.text}>
                <b>{a.name}</b>
                <span>{a.desc}</span>
              </span>
              <span
                className={styles.bar}
                role="progressbar"
                aria-label={a.name}
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ transform: `scaleX(${a.progress})` }} />
              </span>
              <span className={styles.state}>
                {a.got ? 'Получено' : pct ? `Прогресс ${pct}%` : 'Закрыто'}
              </span>
              <span aria-hidden="true" className={styles.holo} />
              <span aria-hidden="true" className={styles.glare} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
