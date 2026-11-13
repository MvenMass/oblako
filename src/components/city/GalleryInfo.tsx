import { Icon } from '@/components/ui/Icon';
import { nbsp } from '@/lib/cities';
import { CATEGORY_LABEL } from '@/lib/places';
import { typograph } from '@/lib/typograph';
import { useUserStore } from '@/store/user';
import type { City, Place } from '@/types/city';
import styles from './Gallery.module.css';

interface GalleryInfoProps {
  city: City;
  place: Place;
  index: number;
  total: number;
  onStep: (d: number) => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Правая панель галереи: категория, счётчик, описание, детали и «В маршрут» */
export function GalleryInfo({ city, place, index, total, onStep }: GalleryInfoProps) {
  const added = useUserStore((s) => (s.routeAdded[city.id] ?? []).includes(place.id));
  const toggle = useUserStore((s) => s.toggleRoutePlace);

  return (
    <div className={styles.info}>
      <div aria-live="polite" className={styles.infoText}>
        <p className={styles.infoTop}>
          <span className={styles.cat}>{CATEGORY_LABEL[place.category]}</span>
          <span className={styles.count}>
            {pad(index + 1)} / {pad(total)}
          </span>
        </p>
        <h3 className={styles.infoName}>{place.name}</h3>
        <p className={styles.desc}>{typograph(place.description)}</p>
      </div>
      <dl className={styles.details}>
        <div>
          <dt>Район</dt>
          <dd>{place.district}</dd>
        </div>
        <div>
          <dt>Время</dt>
          <dd>{nbsp(place.duration)}</dd>
        </div>
        <div>
          <dt>Цена</dt>
          <dd>{place.price}</dd>
        </div>
      </dl>
      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.add} ${added ? styles.added : ''}`}
          aria-pressed={added}
          onClick={() => toggle(city.id, place.id)}
        >
          {added ? 'В маршруте ✓' : 'В маршрут'}
        </button>
        <button
          type="button"
          className={styles.prev}
          aria-label="Предыдущее место"
          onClick={() => onStep(-1)}
        >
          <Icon name="chevron-left" />
        </button>
        <button
          type="button"
          className={styles.next}
          aria-label="Следующее место"
          onClick={() => onStep(1)}
        >
          <Icon name="chevron-right" />
        </button>
      </div>
    </div>
  );
}
