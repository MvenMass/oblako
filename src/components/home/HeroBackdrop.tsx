import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';
import styles from './HeroBackdrop.module.css';

// Слои сдвигаются за мышью с разной силой (px при курсоре у края)
const LAYERS = [
  { x: 40, y: 28 },
  { x: -34, y: -24 },
  { x: 16, y: 10 },
];
const LERP = 0.08;

const CLOUDS = [
  { t: 'translate(-40 150) scale(1.1)', o: 0.9, delay: 0, dur: 38 },
  { t: 'translate(520 40) scale(.7)', o: 0.85, delay: -12, dur: 46 },
  { t: 'translate(1040 120) scale(1.35)', o: 0.95, delay: -20, dur: 38 },
  { t: 'translate(780 640) scale(1.6)', o: 0.9, delay: -6, dur: 52 },
  { t: 'translate(-120 760) scale(1.5)', o: 0.85, delay: -28, dur: 38 },
];

/** Фон первого экрана: сияние за курсором, облака, ленты света, зерно. Декор. */
export function HeroBackdrop() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (reduced || !el || !window.matchMedia('(pointer: fine)').matches) return;

    const layers = Array.from(el.querySelectorAll<HTMLElement>('[data-layer]'));
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;

    const tick = () => {
      pos.x += (target.x - pos.x) * LERP;
      pos.y += (target.y - pos.y) * LERP;
      layers.forEach((layer, i) => {
        const k = LAYERS[i];
        layer.style.transform = `translate3d(${(pos.x * k.x).toFixed(1)}px,${(pos.y * k.y).toFixed(1)}px,0)`;
      });
      const settled = Math.abs(target.x - pos.x) < 0.001 && Math.abs(target.y - pos.y) < 0.001;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={root} aria-hidden="true" className={styles.backdrop}>
      <div data-layer className={styles.layer}>
        <span className={`${styles.blob} ${styles.b1}`} />
        <span className={`${styles.blob} ${styles.b2}`} />
      </div>
      <div data-layer className={styles.layer}>
        <span className={`${styles.blob} ${styles.b3}`} />
        <span className={`${styles.blob} ${styles.b4}`} />
      </div>

      <svg className={styles.svg} viewBox="0 0 1440 1000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hero-ribbon" x1="0" x2="1">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset=".5" stopColor="white" stopOpacity=".95" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id="hero-soft">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <path
          className={styles.ribbon}
          d="M-100 820 C 280 640, 620 1000, 980 760 S 1480 560, 1600 700"
          stroke="url(#hero-ribbon)"
          strokeWidth="30"
          filter="url(#hero-soft)"
        />
        <path
          className={styles.ribbon}
          d="M-100 880 C 320 720, 660 1040, 1020 820 S 1500 640, 1600 760"
          stroke="url(#hero-ribbon)"
          strokeWidth="10"
          style={{ animationDelay: '-4s' }}
        />
      </svg>

      <div data-layer className={styles.layer}>
        <svg className={styles.svg} viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="hero-cloud-fill" cx="45%" cy="35%" r="70%">
              <stop offset="0" className={styles.cloudStop0} />
              <stop offset=".7" className={styles.cloudStop1} />
              <stop offset="1" className={styles.cloudStop2} />
            </radialGradient>
            <filter id="hero-cs" x="-40%" y="-60%" width="180%" height="220%">
              <feGaussianBlur stdDeviation="13" />
            </filter>
            <filter id="hero-csh" x="-50%" y="-80%" width="200%" height="260%">
              <feGaussianBlur stdDeviation="26" />
            </filter>
            <g id="hero-cloud">
              <ellipse
                cx="150"
                cy="112"
                rx="132"
                ry="18"
                className={styles.cloudShadow}
                filter="url(#hero-csh)"
              />
              <g fill="url(#hero-cloud-fill)" filter="url(#hero-cs)">
                <ellipse cx="150" cy="92" rx="138" ry="26" />
                <circle cx="88" cy="76" r="40" />
                <circle cx="150" cy="58" r="56" />
                <circle cx="214" cy="72" r="44" />
                <circle cx="256" cy="86" r="26" />
              </g>
              <ellipse
                cx="150"
                cy="100"
                rx="120"
                ry="12"
                className={styles.cloudBase}
                filter="url(#hero-cs)"
              />
            </g>
          </defs>
          {CLOUDS.map((c) => (
            <g key={c.t} transform={c.t} opacity={c.o}>
              <g
                className={styles.sail}
                style={{ animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s` }}
              >
                <use href="#hero-cloud" />
              </g>
            </g>
          ))}
        </svg>
      </div>

      <svg className={`${styles.svg} ${styles.grain}`}>
        <filter id="hero-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".9"
            numOctaves={2}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>
    </div>
  );
}
