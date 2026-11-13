import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import styles from './Ticket.module.css';

const TEAR_AT = 110;

/** Талон «Куда угодно»: корешок тянется вправо и отрывается (или Enter/клик) → «Начать подбор» */
export function Ticket() {
  const [dx, setDx] = useState(0);
  const [torn, setTorn] = useState(false);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const cta = useRef<HTMLAnchorElement>(null);

  // После отрыва фокус переходит на появившуюся кнопку
  useEffect(() => {
    if (torn) cta.current?.focus();
  }, [torn]);

  const onDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (torn) return;
    drag.current = { x: e.clientX, moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const d = Math.max(0, e.clientX - drag.current.x);
    if (d > 4) drag.current.moved = true;
    setDx(d);
  };
  const onUp = () => {
    if (!drag.current) return;
    if (dx > TEAR_AT) setTorn(true);
    setDx(0);
    // moved сбрасывается в onClick, который придёт следом
  };
  const onClick = () => {
    const moved = drag.current?.moved;
    drag.current = null;
    if (!moved) setTorn(true);
  };

  return (
    <section className={`container ${styles.section}`} aria-labelledby="tk-title">
      <h2 id="tk-title" className={styles.h2}>
        Куда <span className="grad">угодно</span>
      </h2>

      <div className={styles.ticket}>
        <div className={`${styles.main} ${torn ? styles.shake : ''}`}>
          <span className={styles.top}>
            <span className={styles.brand}>
              <svg aria-hidden="true" width="30" height="20" viewBox="0 0 44 30">
                <path d="M12 28h22a9 9 0 0 0 1-17.9A12 12 0 0 0 12.4 8 10 10 0 0 0 12 28z" />
              </svg>
              OBLAKO · BOARDING PASS
            </span>
            <span className={styles.flight}>РЕЙС OB&nbsp;001 · демо</span>
          </span>
          <span className={styles.route}>
            <span className={styles.city}>
              <span className={styles.small}>Москва</span>
              <b className={styles.code}>MOW</b>
            </span>
            <svg aria-hidden="true" className={styles.arc} viewBox="0 0 160 40">
              <path d="M4 30 Q80 -6 150 26" />
            </svg>
            <span className={styles.city}>
              <span className={styles.small}>Куда угодно</span>
              <b className={`${styles.code} grad`}>???</b>
            </span>
          </span>
          <span className={styles.details}>
            <span>
              Пассажир<b>Вы</b>
            </span>
            <span>
              Когда<b>Когда захотите</b>
            </span>
            <span>
              Выход<b>OBLAKO</b>
            </span>
            <span>
              Место<b>У&nbsp;окна</b>
            </span>
          </span>
        </div>

        <span aria-hidden="true" className={styles.perf} />

        <div className={styles.stubWrap}>
          {torn && (
            <Link ref={cta} to="/quiz" className={styles.cta}>
              <span className={styles.small}>Посадка открыта</span>
              <span className={styles.ctaButton}>
                Начать подбор
                <Icon name="arrow-right" size={18} />
              </span>
            </Link>
          )}
          <button
            type="button"
            className={`${styles.stub} ${torn ? styles.torn : ''}`}
            style={
              dx && !torn ? { transform: `translateX(${dx}px) rotate(${dx / 14}deg)` } : undefined
            }
            aria-label="Оторвать корешок и начать подбор"
            aria-hidden={torn || undefined}
            tabIndex={torn ? -1 : undefined}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onClick={onClick}
          >
            <span className={styles.stubLabel}>КОРЕШОК</span>
            <b className={styles.stubTitle}>Оторвите, чтобы начать</b>
            <span className={styles.pull}>
              <svg
                aria-hidden="true"
                className={styles.nudge}
                width="34"
                height="18"
                viewBox="0 0 34 18"
              >
                <path d="M2 9h28M22 2l8 7-8 7" />
              </svg>
              тяните вправо или нажмите
            </span>
            <span aria-hidden="true" className={styles.barcode} />
          </button>
        </div>
      </div>
    </section>
  );
}
