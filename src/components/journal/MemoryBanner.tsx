import { Icon } from '@/components/ui/Icon';
import { photoSrcSet } from '@/lib/img';
import { getCity } from '@/lib/cities';
import { formatTripDate, whereIn } from '@/lib/journal';
import { typograph } from '@/lib/typograph';
import type { Trip } from '@/types/user';
import styles from './MemoryBanner.module.css';

interface MemoryBannerProps {
  trip: Trip;
  /** Адреса фото для стопки: первые три */
  srcs: string[];
  onPlay: () => void;
}

/** Воспоминание сверху: «Год назад вы были в…» со стопкой полароидов */
export function MemoryBanner({ trip, srcs, onPlay }: MemoryBannerProps) {
  const city = getCity(trip.cityId);
  const n = trip.photoIds.length;
  return (
    <section className={styles.banner} aria-labelledby="memory-title">
      <div aria-hidden="true" className={styles.stack}>
        {[0, 1, 2].map((k) => (
          <span key={k} className={styles.card} data-k={k}>
            {srcs[k] && <img src={srcs[k]} srcSet={photoSrcSet(srcs[k])} sizes="130px" alt="" />}
          </span>
        ))}
      </div>
      <div className={styles.text}>
        <p className={styles.eyebrow}>Воспоминание дня</p>
        <h1 id="memory-title" className={styles.title}>
          Год назад вы были{' '}
          <span className="grad">{typograph(whereIn(trip.cityId, city?.name ?? ''))}</span>
        </h1>
        <p className={styles.note}>
          {n}&nbsp;фото из&nbsp;той поездки · {formatTripDate(trip.date)}
        </p>
      </div>
      <button type="button" className={styles.play} onClick={onPlay}>
        <Icon name="play" size={18} />
        Смотреть как сторис
      </button>
    </section>
  );
}
