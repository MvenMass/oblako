import type { Ref } from 'react';
import { photoSrcSet } from '@/lib/img';
import { Icon } from '@/components/ui/Icon';
import { getCity } from '@/lib/cities';
import { HOW_PATH, STOPS } from './howPath';
import styles from './HowScene.module.css';

const istanbul = getCity('istanbul')!;

interface HowSceneProps {
  /** Сколько остановок уже пройдено: -1…3 */
  active: number;
  pathRef: Ref<SVGPathElement>;
  trailRef: Ref<SVGPathElement>;
  planeRef: Ref<HTMLSpanElement>;
}

/** Стеклянная сцена 700×500: пунктирный путь, остановки, мини-интерфейсы и самолётик */
export function HowScene({ active, pathRef, trailRef, planeRef }: HowSceneProps) {
  const on = (i: number) => (i <= active ? styles.on : '');

  return (
    <div aria-hidden="true" className={styles.stage}>
      <svg className={styles.svg} viewBox="0 0 680 480" width="680" height="480">
        <defs>
          <linearGradient id="how-trail" x1="0" x2="1">
            <stop offset="0" className={styles.stopSky} />
            <stop offset="1" className={styles.stopFlamingo} />
          </linearGradient>
        </defs>
        <path ref={pathRef} d={HOW_PATH} className={styles.track} />
        <path ref={trailRef} d={HOW_PATH} className={styles.trail} pathLength={100} />
        {STOPS.map((s, i) => (
          <g key={s.x}>
            <circle cx={s.x} cy={s.y} r="16" className={styles.stopRing} />
            <circle cx={s.x} cy={s.y} r="7" className={`${styles.stopDot} ${on(i)}`} />
          </g>
        ))}
      </svg>

      {/* 01 — подбор */}
      <div className={`${styles.mini} ${styles.quiz} ${on(0)}`}>
        <span className={styles.miniLabel}>ПОДБОР</span>
        <span className={styles.chips}>
          <span className={styles.chipOn}>Море</span>
          <span className={styles.chipOn}>Еда</span>
          <span className={styles.chipOff}>Горы</span>
        </span>
        <span className={styles.match}>
          <svg width="44" height="44" viewBox="0 0 44 44" className={styles.ring}>
            <circle cx="22" cy="22" r="18" className={styles.ringTrack} />
            <circle cx="22" cy="22" r="18" className={styles.ringValue} pathLength={100} />
          </svg>
          <b>{istanbul.name} · 98%</b>
        </span>
      </div>

      {/* 02 — маршрут */}
      <div className={`${styles.mini} ${styles.map} ${on(1)}`}>
        <span className={styles.miniLabel}>МАРШРУТ · ДЕНЬ 1</span>
        <svg viewBox="0 0 170 90" className={styles.mapSvg}>
          <rect width="170" height="90" rx="10" className={styles.mapBg} />
          <path d="M0 60 Q60 40 170 70" className={styles.river} />
          <path d="M24 70 L60 30 L110 52 L146 22" className={styles.mapRoute} />
          <g className={styles.mapPins}>
            <circle cx="24" cy="70" r="6" />
            <circle cx="60" cy="30" r="6" />
            <circle cx="110" cy="52" r="6" />
            <circle cx="146" cy="22" r="6" />
          </g>
        </svg>
      </div>

      {/* 03 — талон */}
      <div className={`${styles.mini} ${styles.pass} ${on(2)}`}>
        <span className={styles.miniLabel}>ПОСАДОЧНЫЙ · ДЕМО</span>
        <span className={styles.passRoute}>
          <b>MOW</b>
          <Icon name="plane" size={22} className={styles.passPlane} />
          <b>{istanbul.iata}</b>
        </span>
        <span className={styles.barcode} />
      </div>

      {/* 04 — полароид */}
      <div className={`${styles.polaroid} ${on(3)}`}>
        <img
          src="/photos/istanbul/balat.jpg"
          srcSet={photoSrcSet('/photos/istanbul/balat.jpg')}
          sizes="300px"
          alt=""
          className={styles.photo}
          loading="lazy"
        />
        <span className={styles.caption}>Балат, май</span>
        <svg viewBox="0 0 60 60" width="46" height="46" className={styles.stamp}>
          <circle cx="30" cy="30" r="26" />
          <text x="30" y="35" textAnchor="middle">
            {istanbul.iata}
          </text>
        </svg>
      </div>

      <span ref={planeRef} className={styles.plane}>
        <Icon name="plane" size={40} />
      </span>
    </div>
  );
}
