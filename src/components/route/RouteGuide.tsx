import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import styles from './RouteGuide.module.css';

/** Подсказка над конструктором: что делать с маршрутом и куда дальше */
export function RouteGuide({ cityId }: { cityId: string }) {
  return (
    <ol className={`${styles.guide} no-print`} aria-label="Как пользоваться маршрутом">
      <li>
        <b>1</b>
        <span>
          Нажмите на&nbsp;точку в&nbsp;списке или на&nbsp;карте&nbsp;— увидите, что это, сколько
          времени займёт и&nbsp;сколько стоит.
        </span>
      </li>
      <li>
        <b>2</b>
        <span>
          Перетащите точки или&nbsp;нажмите «Оптимизировать»&nbsp;— меньше пешком и&nbsp;успеете
          до&nbsp;заката.
        </span>
      </li>
      <li>
        <b>3</b>
        <span>
          Дальше&nbsp;— <Link to={`/budget?city=${cityId}`}>бюджет</Link>,{' '}
          <Link to={`/packing?city=${cityId}`}>сборы</Link> или&nbsp;
          <button type="button" className={styles.print} onClick={() => window.print()}>
            <Icon name="print" size={14} />
            распечатать маршрут
          </button>
        </span>
      </li>
    </ol>
  );
}
