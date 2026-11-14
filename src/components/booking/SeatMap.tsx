import { useState, type KeyboardEvent } from 'react';
import { LETTERS, moveSeat, ROWS, seatInfo, seatLabel } from '@/lib/booking';
import styles from './SeatMap.module.css';

interface SeatMapProps {
  seat: string | null;
  onPick: (id: string) => void;
  /** Место под курсором или фокусом — для вида из окна */
  onPreview: (id: string | null) => void;
}

const ROW_LIST = Array.from({ length: ROWS }, (_, i) => i + 1);

/** Схема салона: 20 рядов кнопок с aria-pressed; стрелки ходят по местам, Enter выбирает */
export function SeatMap({ seat, onPick, onPreview }: SeatMapProps) {
  // В Tab-порядке одно место: выбранное или последнее, куда ушёл фокус
  const [focusId, setFocusId] = useState(seat ?? '7A');
  const active = focusId;

  const onKey = (id: string) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = moveSeat(id, e.key);
    if (!e.key.startsWith('Arrow')) return;
    e.preventDefault();
    if (!next) return;
    setFocusId(next);
    document.getElementById(`seat-${next}`)?.focus();
  };

  const button = (row: number, letter: string) => {
    const s = seatInfo(`${row}${letter}`);
    return (
      <button
        key={s.id}
        id={`seat-${s.id}`}
        type="button"
        className={styles.seat}
        data-extra={s.extra || undefined}
        aria-label={seatLabel(s)}
        aria-pressed={seat === s.id}
        aria-disabled={s.taken || undefined}
        tabIndex={active === s.id ? 0 : -1}
        onClick={() => !s.taken && onPick(s.id)}
        onKeyDown={onKey(s.id)}
        onFocus={() => {
          setFocusId(s.id);
          onPreview(s.id);
        }}
        onMouseEnter={() => onPreview(s.id)}
      >
        {s.taken ? '' : s.letter}
      </button>
    );
  };

  return (
    <div className={styles.cabin}>
      <div className={styles.clouds} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.scroll}>
        <div className={styles.plane}>
          <svg aria-hidden="true" viewBox="0 0 1080 440" className={styles.body}>
            <path
              className={styles.wing}
              d="M400 90 L520 -10 L600 -10 L590 90 Z M400 350 L520 450 L600 450 L590 350 Z M940 110 L1010 40 L1050 40 L1030 120 Z M940 330 L1010 400 L1050 400 L1030 320 Z"
            />
            <path
              className={styles.hull}
              d="M130 90 H960 Q1060 110 1060 220 Q1060 330 960 350 H130 Q30 330 20 220 Q30 110 130 90 Z"
            />
            <path
              className={styles.cockpit}
              d="M44 196 Q58 176 82 172 L84 196 Z M44 244 Q58 264 82 268 L84 244 Z"
            />
          </svg>
          <div
            role="group"
            aria-label="Схема салона, 20 рядов. Стрелки — по местам, Enter — выбрать"
            className={styles.rows}
            onMouseLeave={() => onPreview(null)}
          >
            {ROW_LIST.map((row) => (
              <div key={row} role="group" aria-label={`Ряд ${row}`} className={styles.row}>
                {LETTERS.slice(0, 3).map((l) => button(row, l))}
                <span className={styles.num} aria-hidden="true">
                  {row}
                </span>
                {LETTERS.slice(3).map((l) => button(row, l))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ul className={styles.legend}>
        <li>
          <i aria-hidden="true" />
          Свободно
        </li>
        <li>
          <i aria-hidden="true" data-kind="extra" />
          Больше места для&nbsp;ног
        </li>
        <li>
          <i aria-hidden="true" data-kind="taken" />
          Занято
        </li>
        <li>
          <i aria-hidden="true" data-kind="mine" />
          Ваше место
        </li>
      </ul>
    </div>
  );
}
