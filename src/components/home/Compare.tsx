import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { SectionHead } from '@/components/ui/SectionHead';
import { getCities, getCity } from '@/lib/cities';
import { useMediaQuery } from '@/lib/motion';
import { typograph } from '@/lib/typograph';
import type { City } from '@/types/city';
import { compareRows } from './compareRows';
import styles from './Compare.module.css';

const MIN = 10;
const MAX = 90;
const clamp = (v: number) => Math.max(MIN, Math.min(MAX, v));

function Side({ city, other, align }: { city: City; other: City; align: 'start' | 'end' }) {
  return (
    <div className={`${styles.side} ${align === 'end' ? styles.end : ''}`}>
      <span className={styles.head}>
        <span className={styles.country}>{city.country}</span>
        <span className={styles.name}>{city.name}</span>
      </span>
      <dl className={styles.rows}>
        {compareRows(city, other).map((row) => (
          <div key={row.label} className={styles.row}>
            <dt className={styles.label}>{row.label}</dt>
            <dd className={styles.value}>
              {row.value}
              {row.better && <span className={styles.better}>лучше</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CitySelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className={styles.pick}>
      {label}
      <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
        {getCities().map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}

/** «Сравни города»: две половины в цветах городов, граница тянется мышью, пальцем и стрелками */
export function Compare() {
  const [aId, setA] = useState('istanbul');
  const [bId, setB] = useState('tbilisi');
  const [split, setSplit] = useState(50);
  const [dragging, setDragging] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const vertical = useMediaQuery('(max-width: 767px)');
  const a = getCity(aId)!;
  const b = getCity(bId)!;

  const moveTo = (e: PointerEvent) => {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    const ratio = vertical ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width;
    setSplit(clamp(ratio * 100));
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = { ArrowLeft: -5, ArrowUp: -5, ArrowRight: 5, ArrowDown: 5 }[e.key];
    if (step) setSplit((v) => clamp(v + step));
    else if (e.key === 'Home') setSplit(MIN);
    else if (e.key === 'End') setSplit(MAX);
    else return;
    e.preventDefault();
  };

  const vars = {
    '--split': `${split}%`,
    '--a1': a.theme.folder[0],
    '--a2': a.theme.folder[1],
    '--b1': b.theme.folder[0],
    '--b2': b.theme.folder[1],
  } as CSSProperties;

  return (
    <section className={`container ${styles.section}`} aria-labelledby="cmp-title">
      <SectionHead
        id="cmp-title"
        eyebrow="Сравнение"
        title={
          <>
            Сравни <span className="grad">города</span>
          </>
        }
        action={
          <span className={styles.picks}>
            <CitySelect label="Слева" value={aId} onChange={setA} />
            <span aria-hidden="true" className={styles.vs}>
              vs
            </span>
            <CitySelect label="Справа" value={bId} onChange={setB} />
          </span>
        }
      />

      <div
        ref={stage}
        className={[styles.stage, vertical && styles.vertical, dragging && styles.dragging]
          .filter(Boolean)
          .join(' ')}
        style={vars}
        onPointerMove={(e) => dragging && moveTo(e)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <div className={`${styles.layer} ${styles.layerB}`}>
          <Side city={b} other={a} align="end" />
        </div>
        <div className={`${styles.layer} ${styles.layerA}`}>
          <Side city={a} other={b} align="start" />
        </div>
        <div className={styles.line}>
          <button
            type="button"
            role="slider"
            aria-label="Граница сравнения"
            aria-orientation={vertical ? 'vertical' : 'horizontal'}
            aria-valuemin={MIN}
            aria-valuemax={MAX}
            aria-valuenow={Math.round(split)}
            aria-valuetext={`${a.name}: ${Math.round(split)}%`}
            className={styles.handle}
            onKeyDown={onKey}
            onPointerDown={(e) => {
              setDragging(true);
              stage.current?.setPointerCapture?.(e.pointerId);
            }}
          >
            <svg
              aria-hidden="true"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              className={styles.arrows}
            >
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <p className={styles.note}>
        {typograph(
          'Тяните ручку или используйте стрелки. Цены ориентировочные, на человека — демо; * визовые правила — демо, перед поездкой сверяйтесь с официальными источниками.',
        )}
      </p>
    </section>
  );
}
