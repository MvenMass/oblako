import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GAUGES } from '@/data/home';
import { useInView, useReducedMotion } from '@/lib/motion';
import styles from './Gauges.module.css';

// Деления шкалы: 11 штук по полуокружности, каждое пятое длиннее
const TICKS = Array.from({ length: 11 }, (_, i) => {
  const a = Math.PI - (i / 10) * Math.PI;
  const major = i % 5 === 0;
  const r1 = 46;
  const r2 = major ? 38 : 42;
  return {
    d: `M${(60 + r1 * Math.cos(a)).toFixed(1)} ${(62 - r1 * Math.sin(a)).toFixed(1)} L${(60 + r2 * Math.cos(a)).toFixed(1)} ${(62 - r2 * Math.sin(a)).toFixed(1)}`,
    major,
  };
});

/** Приборы кабины: стрелка 1,8 с с пружиной, счётчик цифр через GSAP */
export function Gauges() {
  const root = useRef<HTMLUListElement>(null);
  const visible = useInView(root);
  const reduced = useReducedMotion();
  const shown = visible || reduced;

  useEffect(() => {
    const el = root.current;
    if (!el || !shown) return;
    const nums = Array.from(el.querySelectorAll<HTMLElement>('[data-value]'));
    const ctx = gsap.context(() => {
      nums.forEach((node, i) => {
        const target = Number(node.dataset.value);
        if (reduced) {
          node.textContent = String(target);
          return;
        }
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          delay: i * 0.15,
          ease: 'power2.out',
          onUpdate: () => {
            node.textContent = String(Math.round(obj.v));
          },
        });
      });
    }, el);
    return () => ctx.revert();
  }, [shown, reduced]);

  return (
    <ul ref={root} className={styles.gauges}>
      {GAUGES.map(([value, max, label], i) => (
        <li key={label} className={styles.gauge}>
          <svg
            aria-hidden="true"
            width="120"
            height="76"
            viewBox="0 0 120 76"
            className={styles.dial}
          >
            <path d="M10 62 A50 50 0 0 1 110 62" className={styles.track} />
            {TICKS.map((t) => (
              <path key={t.d} d={t.d} className={styles.tick} strokeWidth={t.major ? 2 : 1} />
            ))}
            <g
              className={styles.needle}
              style={{
                transform: `rotate(${shown ? -90 + (180 * value) / max : -90}deg)`,
                transitionDelay: `${i * 0.15}s`,
              }}
            >
              <path d="M60 62 L60 20" />
              <circle cx="60" cy="62" r="6" />
            </g>
          </svg>
          <span className={styles.text}>
            <b aria-hidden="true" className={styles.value} data-value={value}>
              {shown && reduced ? value : 0}
            </b>
            <span className="visually-hidden">{value}</span>
            <span className={styles.label}>{label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
