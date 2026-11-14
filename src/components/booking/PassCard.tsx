import type { ReactNode } from 'react';
import styles from './PassCard.module.css';

export interface PassData {
  iata: string;
  no: string;
  gate: string;
  boarding: string;
  seat: string;
  date: string;
  passenger: string;
}

/** Штрихкод-декор: полосы разной ширины */
export function Barcode({ className }: { className?: string }) {
  return <span aria-hidden="true" className={`${styles.barcode} ${className ?? ''}`} />;
}

/** Посадочный талон: шапка, маршрут, поля, линия отрыва и корешок */
export function PassCard({ data, stub }: { data: PassData; stub?: ReactNode }) {
  const fields: [string, string][] = [
    ['Рейс', data.no],
    ['Дата', data.date],
    ['Посадка', data.boarding],
    ['Выход', data.gate],
    ['Место', data.seat],
    ['Класс', 'Эконом'],
  ];
  return (
    <div className={styles.pass}>
      <div className={styles.head}>
        <span className={styles.brand}>OBLAKO</span>
        <span className={styles.kind}>ПОСАДОЧНЫЙ ТАЛОН · ДЕМО</span>
      </div>
      <div className={styles.main}>
        <div className={styles.route}>
          <b>MOW</b>
          <svg aria-hidden="true" width="90" height="24" viewBox="0 0 90 24">
            <path d="M2 12 H88" className={styles.dash} />
            <path d="M38 12 h14 M48 7 l5 5 -5 5" className={styles.arrow} />
          </svg>
          <b>{data.iata}</b>
        </div>
        <dl className={styles.fields}>
          <div className={styles.passenger}>
            <dt>Пассажир</dt>
            <dd>{data.passenger}</dd>
          </div>
          {fields.map(([k, v]) => (
            <div key={k} data-seat={k === 'Место' || undefined}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className={styles.tear} aria-hidden="true" />
      {stub ?? <PassStub data={data} />}
    </div>
  );
}

/** Корешок талона: штрихкод и рейс */
export function PassStub({ data, className }: { data: PassData; className?: string }) {
  return (
    <div className={`${styles.stub} ${className ?? ''}`}>
      <Barcode />
      <span>
        {data.no} · {data.seat} · MOW → {data.iata}
      </span>
    </div>
  );
}
