import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { photoSrcSet } from '@/lib/img';
import { CATEGORY_LABEL } from '@/lib/places';
import { typograph } from '@/lib/typograph';
import type { City, Place } from '@/types/city';
import styles from './PlaceCard.module.css';

interface PlaceCardProps {
  city: City;
  place: Place;
  /** Номер дня (с 0), в котором сейчас точка */
  day: number;
  days: number;
  onMove: (toDay: number) => void;
  onRemove: () => void;
  onClose: () => void;
}

/** Карточка точки маршрута: что это, сколько времени, сколько стоит и что с ней сделать */
export function PlaceCard({ city, place, day, days, onMove, onRemove, onClose }: PlaceCardProps) {
  const title = useRef<HTMLHeadingElement>(null);

  // Фокус на заголовок, чтобы скринридер прочитал карточку; Esc закрывает
  useEffect(() => {
    title.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [place.id, onClose]);

  return (
    <section className={styles.card} aria-labelledby="place-title">
      <div className={styles.photo}>
        <img src={place.photo} srcSet={photoSrcSet(place.photo)} sizes="420px" alt={place.name} />
        <span className={styles.tag}>{CATEGORY_LABEL[place.category]}</span>
        <button
          type="button"
          className={styles.close}
          aria-label="Закрыть карточку места"
          onClick={onClose}
        >
          <Icon name="close" size={16} />
        </button>
      </div>
      <div className={styles.body}>
        <h2 id="place-title" ref={title} tabIndex={-1} className={styles.title}>
          {place.name}
        </h2>
        <p className={styles.district}>
          {city.name} · {place.district}
        </p>
        <p className={styles.text}>{typograph(place.description)}</p>
        <dl className={styles.facts}>
          <div>
            <dt>Сколько времени</dt>
            <dd>{place.duration}</dd>
          </div>
          <div>
            <dt>Цена · демо</dt>
            <dd>{place.price}</dd>
          </div>
        </dl>
        <div className={styles.actions}>
          {days > 1 && (
            <label className={styles.move}>
              <span>Перенести в</span>
              <select value={day} onChange={(e) => onMove(Number(e.target.value))}>
                {Array.from({ length: days }, (_, i) => (
                  <option key={i} value={i}>
                    день {i + 1}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button type="button" className={styles.remove} onClick={onRemove}>
            Убрать из&nbsp;дня
          </button>
          <Link to={`/city/${city.id}#gallery`} className={styles.more}>
            О&nbsp;городе
          </Link>
        </div>
      </div>
    </section>
  );
}
