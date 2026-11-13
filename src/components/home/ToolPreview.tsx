import type { Tool } from '@/data/home';
import { getCity } from '@/lib/cities';
import styles from './ToolPreview.module.css';

const tbilisi = getCity('tbilisi')!.theme;
const istanbul = getCity('istanbul')!.theme;

/** Мини-иллюстрации карточек «Инструменты» (декор, по Hero.dc.html) */
export function ToolPreview({ kind }: { kind: Tool['preview'] }) {
  switch (kind) {
    case 'folders':
      return (
        <span className={styles.folders}>
          <span className={styles.f1} />
          <span className={styles.f2} />
          <span className={styles.f3} />
          <span className={styles.fTab} />
        </span>
      );
    case 'route':
      return (
        <svg className={styles.svg} width="150" height="110" viewBox="0 0 150 110">
          <defs>
            <linearGradient id="tool-route" x1="0" x2="1">
              <stop offset="0" className={styles.stopSky} />
              <stop offset="1" className={styles.stopFlamingo} />
            </linearGradient>
          </defs>
          <g transform="skewX(-14) translate(14 0)">
            <rect x="6" y="10" width="130" height="90" rx="12" className={styles.map} />
            <path
              d="M20 84 Q50 30 76 60 T128 24"
              fill="none"
              stroke="url(#tool-route)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="6 6"
            />
          </g>
          <circle cx="34" cy="84" r="7" className={styles.ink} />
          <circle cx="140" cy="24" r="7" className={styles.pink} />
        </svg>
      );
    case 'budget':
      return (
        <svg className={styles.svg} width="110" height="110" viewBox="0 0 120 120">
          <g transform="rotate(-90 60 60)" fill="none" strokeWidth="18">
            <circle cx="60" cy="60" r="44" className={styles.ringSky} strokeDasharray="104 277" />
            <circle
              cx="60"
              cy="60"
              r="44"
              className={styles.ringFlamingo}
              strokeDasharray="80 277"
              strokeDashoffset="-106"
            />
            <circle
              cx="60"
              cy="60"
              r="44"
              className={styles.ringDusk}
              strokeDasharray="52 277"
              strokeDashoffset="-188"
            />
            <circle
              cx="60"
              cy="60"
              r="44"
              className={styles.ringInk}
              strokeDasharray="33 277"
              strokeDashoffset="-242"
            />
          </g>
        </svg>
      );
    case 'board':
      return (
        <span className={styles.flaps}>
          {['I', 'S', 'T'].map((ch) => (
            <span key={ch} className={styles.flap}>
              {ch}
            </span>
          ))}
        </span>
      );
    case 'booking':
      return (
        <span className={styles.ticket}>
          <span className={styles.ticketMain} />
          <span className={styles.ticketCode} />
        </span>
      );
    case 'packing':
      return (
        <svg className={styles.svg} width="110" height="110" viewBox="0 0 110 110">
          <defs>
            <linearGradient id="tool-case" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" className={styles.stopSky} />
              <stop offset="1" className={styles.stopDusk} />
            </linearGradient>
          </defs>
          <path
            d="M40 26 V16 a6 6 0 0 1 6 -6 h18 a6 6 0 0 1 6 6 V26"
            fill="none"
            className={styles.handle}
            strokeWidth="6"
          />
          <rect x="18" y="26" width="74" height="70" rx="14" fill="url(#tool-case)" />
          <path d="M38 30 V92 M72 30 V92" className={styles.straps} strokeWidth="4" />
          <circle cx="32" cy="102" r="5" className={styles.ink} />
          <circle cx="78" cy="102" r="5" className={styles.ink} />
        </svg>
      );
    case 'journal':
      return (
        <span className={styles.polaroids}>
          <span className={`${styles.polaroid} ${styles.pLeft}`}>
            <span
              style={{
                background: `linear-gradient(160deg, ${tbilisi.folder[1]}, ${tbilisi.accent})`,
              }}
            />
          </span>
          <span className={`${styles.polaroid} ${styles.pRight}`}>
            <span
              style={{
                background: `linear-gradient(160deg, ${istanbul.folder[1]}, ${istanbul.accent})`,
              }}
            />
          </span>
        </span>
      );
    case 'profile':
      return (
        <svg className={styles.svg} width="110" height="110" viewBox="0 0 140 140">
          <g transform="rotate(-12 70 70)" opacity=".9" style={{ color: tbilisi.accent }}>
            <circle cx="70" cy="70" r="60" fill="none" stroke="currentColor" strokeWidth="5" />
            <circle cx="70" cy="70" r="50" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="70" y="64" textAnchor="middle" className={styles.stampSmall}>
              ГРУЗИЯ
            </text>
            <text x="70" y="92" textAnchor="middle" className={styles.stampBig}>
              TBS
            </text>
          </g>
        </svg>
      );
  }
}
