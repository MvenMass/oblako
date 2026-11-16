import { useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useMediaQuery } from '@/lib/motion';
import type { City } from '@/types/city';
import { Stamp } from './Stamp';
import styles from './Passport.module.css';

export interface StampEntry {
  city: City;
  date: string;
}

interface PassportProps {
  stamps: StampEntry[];
  name: string;
  countries: number;
}

const PER_PAGE = 6;

/** Страница с данными владельца — изнанка обложки (на телефоне — первая страница) */
function DataPage({
  name,
  countries,
  cities,
}: {
  name: string;
  countries: number;
  cities: number;
}) {
  return (
    <div className={styles.data}>
      <span className={styles.dataTitle}>Данные владельца</span>
      <div className={styles.dataRow}>
        <span aria-hidden="true" className={styles.photo}>
          [Фото]
        </span>
        <dl>
          <dt>Имя</dt>
          <dd>{name}</dd>
          <dt>Домашний аэропорт</dt>
          <dd>MOW</dd>
          <dt>Гражданство</dt>
          <dd>Облачное</dd>
        </dl>
      </div>
      <span aria-hidden="true" className={styles.mrz}>
        P&lt;OBLAKO&lt;&lt;{name.replace(/[^A-Za-zА-Яа-яЁё]+/g, '<').toUpperCase()}&lt;&lt;&lt;
        <br />
        MOW&lt;&lt;{countries}&lt;STRAN&lt;&lt;{cities}&lt;GORODOV&lt;&lt;&lt;&lt;
      </span>
    </div>
  );
}

/** 3D-паспорт: обложка открывается, страницы листаются, штампы «впечатываются» */
export function Passport({ stamps, name, countries }: PassportProps) {
  const phone = useMediaQuery('(max-width: 639px)');
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const chunks = Array.from({ length: Math.max(1, Math.ceil(stamps.length / PER_PAGE)) }, (_, i) =>
    stamps.slice(i * PER_PAGE, (i + 1) * PER_PAGE),
  );
  // На телефоне разворота нет: данные владельца — отдельная первая страница
  const pages = phone ? ['data' as const, ...chunks] : chunks;
  const current = Math.min(page, pages.length - 1);
  const shown = pages[current];
  const go = (d: number) => setPage(Math.max(0, Math.min(pages.length - 1, current + d)));

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!open || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    e.preventDefault();
    go(e.key === 'ArrowRight' ? 1 : -1);
  };

  return (
    <section className={styles.section} aria-labelledby="passport-title">
      <div className={styles.head}>
        <h2 id="passport-title" className={styles.h2}>
          Паспорт <span className="grad">путешественника</span>
        </h2>
        <Button aria-expanded={open} aria-controls="passport-book" onClick={() => setOpen(!open)}>
          {open ? 'Закрыть паспорт' : 'Открыть паспорт'}
        </Button>
      </div>

      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- стрелки листают, когда фокус на кнопках паспорта */}
      <div id="passport-book" className={styles.stage} onKeyDown={onKey}>
        <div className={styles.book} data-open={open || undefined}>
          <div className={styles.page}>
            {open &&
              (shown === 'data' ? (
                <DataPage name={name} countries={countries} cities={stamps.length} />
              ) : (
                <div key={current} className={styles.stamps}>
                  {shown.map((s, i) => (
                    <Stamp
                      key={s.city.id}
                      city={s.city}
                      date={s.date}
                      index={current * PER_PAGE + i}
                      order={i}
                    />
                  ))}
                  {!stamps.length && (
                    <p className={styles.empty}>
                      Штампы появятся после первой брони.{' '}
                      <Link to="/booking">Забронировать перелёт</Link>
                    </p>
                  )}
                </div>
              ))}
            <span className={styles.num}>Стр. {current + 1}</span>
          </div>
          <div className={styles.cover}>
            <div className={styles.front}>
              <svg aria-hidden="true" width="120" height="84" viewBox="0 0 44 30">
                <path d="M12 28h22a9 9 0 0 0 1-17.9A12 12 0 0 0 12.4 8 10 10 0 0 0 12 28z" />
                <path d="M14 22h18M16 18h14" />
              </svg>
              <b>OBLAKO</b>
              <span>Паспорт путешественника</span>
            </div>
            <div className={styles.back}>
              {open && !phone && (
                <DataPage name={name} countries={countries} cities={stamps.length} />
              )}
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className={styles.nav}>
          <Button
            variant="glass"
            size="sm"
            iconStart="chevron-left"
            disabled={current === 0}
            onClick={() => go(-1)}
          >
            Предыдущая
          </Button>
          <span aria-live="polite">
            Страница {current + 1} из&nbsp;{pages.length}
          </span>
          <Button
            variant="glass"
            size="sm"
            iconEnd="chevron-right"
            disabled={current === pages.length - 1}
            onClick={() => go(1)}
          >
            Следующая
          </Button>
        </div>
      )}

      <svg aria-hidden="true" width="0" height="0" className={styles.defs}>
        <filter id="stamp-ink">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </svg>
    </section>
  );
}
