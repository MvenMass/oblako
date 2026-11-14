import { formatTime } from '@/lib/route';
import { STATUS_LABEL, type BoardMode, type Flight } from '@/lib/flights';
import { FlapText } from './FlapText';
import styles from './BoardTable.module.css';

interface BoardTableProps {
  flights: Flight[];
  mode: BoardMode;
  onTick: () => void;
}

/** Табло рейсов. На телефоне рейс и выход уходят под город. */
export function BoardTable({ flights, mode, onTick }: BoardTableProps) {
  const width = Math.max(9, ...flights.map((f) => f.city.length));
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className="visually-hidden">
          {mode === 'dep' ? 'Вылеты из Москвы' : 'Прилёты в Москву'}, демо-табло
        </caption>
        <thead>
          <tr>
            <th scope="col">Время</th>
            <th scope="col" className={styles.wide}>
              Рейс
            </th>
            <th scope="col">{mode === 'dep' ? 'Куда' : 'Откуда'}</th>
            <th scope="col" className={styles.wide}>
              Выход
            </th>
            <th scope="col">Статус</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((f) => (
            <tr key={f.id} data-status={f.status}>
              <td>
                <span className={styles.time}>{formatTime(f.time)}</span>
              </td>
              <td className={`${styles.wide} ${styles.no}`}>{f.no}</td>
              <td>
                <span className={styles.flapsWide}>
                  <FlapText text={f.city} size={width} onTick={onTick} />
                </span>
                <span className={styles.flapsSmall}>
                  <FlapText text={f.city} small />
                </span>
                <span className={styles.sub}>
                  {f.no} · выход {f.gate}
                </span>
              </td>
              <td className={`${styles.wide} ${styles.gate}`}>{f.gate}</td>
              <td>
                <span className={styles.status} data-status={f.status}>
                  <i aria-hidden="true" />
                  {STATUS_LABEL[mode][f.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!flights.length && <p className={styles.empty}>Таких рейсов на&nbsp;табло нет</p>}
    </div>
  );
}
