import { useRef, type PointerEvent } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { PassCard, PassStub, type PassData } from './PassCard';
import styles from './PrintTerminal.module.css';

export type PrintPhase = 'idle' | 'printed' | 'torn';

interface PrintTerminalProps {
  data: PassData | null;
  phase: PrintPhase;
  onPay: () => void;
  onTear: () => void;
}

const LED: Record<PrintPhase, string> = {
  idle: 'ожидает оплату',
  printed: 'талон напечатан',
  torn: 'готово',
};

/** Терминал печати: LED-статус, кнопка оплаты, талон с голограммой; корешок улетает в кошелёк */
export function PrintTerminal({ data, phase, onPay, onTear }: PrintTerminalProps) {
  const reduced = useReducedMotion();
  const pass = useRef<HTMLDivElement>(null);
  const tiltable = phase === 'printed' && !reduced;

  // Наклон за курсором через CSS-переменные — без перерисовки React
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = pass.current;
    if (!tiltable || !el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${((x - 0.5) * 22).toFixed(1)}deg`);
    el.style.setProperty('--rx', `${((0.5 - y) * 16).toFixed(1)}deg`);
    el.style.setProperty('--px', `${Math.round(x * 100)}%`);
    el.style.setProperty('--py', `${Math.round(y * 100)}%`);
    el.dataset.over = '';
  };
  const onLeave = () => {
    const el = pass.current;
    if (!el) return;
    ['--rx', '--ry', '--px', '--py'].forEach((k) => el.style.removeProperty(k));
    delete el.dataset.over;
  };

  const label = !data
    ? 'Сначала выберите место'
    : phase === 'idle'
      ? 'Оплатить и получить талон'
      : phase === 'printed'
        ? 'Оторвать корешок в кошелёк'
        : 'Корешок в кошельке ✓';

  return (
    <div className={styles.wrap}>
      <div className={styles.terminal}>
        <div className={styles.head}>
          <span className={styles.title}>Терминал печати</span>
          <span className={styles.led} data-phase={phase} aria-live="polite">
            <i aria-hidden="true" />
            {LED[phase]}
          </span>
        </div>
        <button
          type="button"
          className={styles.pay}
          data-phase={phase}
          disabled={!data || phase === 'torn'}
          onClick={phase === 'idle' ? onPay : onTear}
        >
          {label}
        </button>
        <span aria-hidden="true" className={styles.slot} />
      </div>
      {data && phase !== 'idle' && (
        <div className={styles.paper}>
          <div
            ref={pass}
            className={styles.pass}
            data-phase={phase}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
          >
            <PassCard
              data={data}
              stub={<PassStub data={data} className={phase === 'torn' ? styles.fly : ''} />}
            />
            <span aria-hidden="true" className={styles.holo} />
            <span aria-hidden="true" className={styles.glare} />
          </div>
        </div>
      )}
    </div>
  );
}
