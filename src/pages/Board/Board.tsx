import { useEffect, useState, type KeyboardEvent } from 'react';
import { BoardTable } from '@/components/board/BoardTable';
import { Radar } from '@/components/board/Radar';
import { Tracker } from '@/components/board/Tracker';
import { Icon } from '@/components/ui/Icon';
import { getCities } from '@/lib/cities';
import { playClick, unlockClicks } from '@/lib/clickSound';
import {
  formatClock,
  makeFlights,
  moscowMinutes,
  nextStatus,
  STATUS_LABEL,
  type BoardMode,
  type FlightStatus,
} from '@/lib/flights';
import { useReducedMotion } from '@/lib/motion';
import { usePageTitle } from '@/lib/usePageTitle';
import { useUserStore } from '@/store/user';
import styles from './Board.module.css';

const MODES: { id: BoardMode; label: string }[] = [
  { id: 'dep', label: 'Вылет' },
  { id: 'arr', label: 'Прилёт' },
];

export default function Board() {
  usePageTitle('Табло');
  const reduced = useReducedMotion();
  const sound = useUserStore((s) => s.ui.boardSound);
  const setSound = useUserStore((s) => s.setBoardSound);
  const quizCity = useUserStore((s) => s.quiz.result);
  const [now, setNow] = useState(() => Date.now());
  const [mode, setMode] = useState<BoardMode>('dep');
  const [query, setQuery] = useState('');
  const [overrides, setOverrides] = useState<Record<string, FlightStatus>>({});
  const [tracked, setTracked] = useState<string | null>(null);
  const [announce, setAnnounce] = useState('');

  const nowMin = moscowMinutes(now);
  const flights = makeFlights(getCities(), mode, nowMin).map((f) => ({
    ...f,
    status: overrides[f.id] ?? f.status,
  }));
  const track =
    flights.find((f) => f.id === tracked) ??
    flights.find((f) => f.cityId === quizCity) ??
    flights[1];
  const q = query.trim().toUpperCase();
  const shown = flights.filter((f) => !q || f.city.includes(q) || f.no.includes(q));

  // Часы раз в секунду
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Раз в ~4 с один из рейсов меняет статус
  useEffect(() => {
    const id = setInterval(() => {
      const list = makeFlights(getCities(), mode, moscowMinutes(Date.now()));
      const f = list[Math.floor(Math.random() * list.length)];
      setOverrides((o) => ({ ...o, [f.id]: nextStatus(o[f.id] ?? f.status) }));
    }, 4000);
    return () => clearInterval(id);
  }, [mode]);

  // Чтецу сообщаем только о рейсе, за которым следим
  const trackStatus = STATUS_LABEL.dep[track.status];
  useEffect(() => {
    const id = setTimeout(() => setAnnounce(`${track.no}: ${trackStatus}`));
    return () => clearTimeout(id);
  }, [track.no, trackStatus]);

  const toggleSound = () => {
    if (!sound) unlockClicks();
    setSound(!sound);
  };
  const onTick = sound ? playClick : undefined;

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = mode === 'dep' ? 1 : 0;
    setMode(MODES[next].id);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <div className={styles.page}>
      <div aria-hidden="true" className={styles.glow} />
      <section className={`container ${styles.content}`} aria-labelledby="board-title">
        <div className={styles.top}>
          <div className={styles.titles}>
            <p className={styles.eyebrow}>Табло · Москва · демо-табло</p>
            <h1 id="board-title" className={styles.h1}>
              {mode === 'dep' ? 'Вылеты' : 'Прилёты'} <span className="grad">сейчас</span>
            </h1>
          </div>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.sound}
              aria-pressed={sound}
              onClick={toggleSound}
            >
              <Icon name={sound ? 'sound-on' : 'sound-off'} size={18} />
              Звук табло
            </button>
            <span
              className={styles.clock}
              aria-label={`Московское время ${formatClock(now).slice(0, 5)}`}
            >
              {formatClock(now)}
            </span>
          </div>
        </div>

        <div className={styles.bar}>
          <div role="tablist" aria-label="Направление табло" className={styles.tabs}>
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                tabIndex={mode === m.id ? 0 : -1}
                onClick={() => setMode(m.id)}
                onKeyDown={onTabKey}
              >
                {m.label}
              </button>
            ))}
          </div>
          <label className={styles.search}>
            <Icon name="search" size={18} />
            <span className="visually-hidden">Найти рейс или город</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти рейс или город"
            />
          </label>
        </div>

        <div className={styles.grid}>
          <div className={styles.mobileRadar}>
            <Radar compact />
            <div>
              <span>Рейсов впереди</span>
              <b>{flights.filter((f) => f.status !== 'departed').length}</b>
            </div>
          </div>
          <BoardTable flights={shown} mode={mode} onTick={onTick ?? noop} />
          <div className={styles.side}>
            <Tracker flights={flights} flight={track} nowMin={nowMin} onPick={setTracked} />
            <div className={styles.radarCard}>
              <div className={styles.radarHead}>
                <h2>Небо над&nbsp;Москвой</h2>
                <span>демо</span>
              </div>
              <Radar />
            </div>
          </div>
        </div>
        <p className="visually-hidden" aria-live="polite">
          {announce}
        </p>
      </section>
      {!reduced && (
        <div aria-hidden="true" className={styles.fly}>
          <span />
          <svg width="64" height="40" viewBox="0 0 64 40">
            <path d="M2 20 L46 16 Q60 16 62 20 Q60 24 46 24 Z M30 17 L18 2 H24 L40 17 Z M30 23 L18 38 H24 L40 23 Z M6 19 L2 10 H6 L12 19 Z M6 21 L2 30 H6 L12 21 Z" />
          </svg>
        </div>
      )}
    </div>
  );
}

const noop = () => {};
