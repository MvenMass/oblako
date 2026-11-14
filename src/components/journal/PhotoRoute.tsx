import { useId } from 'react';
import { photoPath, type TripPhoto } from '@/lib/journal';
import type { City } from '@/types/city';
import styles from './PhotoRoute.module.css';

interface PhotoRouteProps {
  city: City;
  photos: TripPhoto[];
  urls: Record<string, string>;
}

/** «Маршрут по фото»: точки в порядке съёмки, линия перерисовывается при смене поездки */
export function PhotoRoute({ city, photos, urls }: PhotoRouteProps) {
  const id = useId();
  const { d, pts } = photoPath(city, photos);
  const label = `Схема: ${photos.length} фото в порядке съёмки — ${photos
    .map((p) => p.place.name)
    .join(' → ')}`;

  return (
    <svg role="img" aria-label={label} viewBox="0 0 640 340" className={styles.svg}>
      <defs>
        <linearGradient id={`${id}-l`} x1="0" x2="1">
          <stop offset="0" className={styles.s1} />
          <stop offset=".6" className={styles.s2} />
          <stop offset="1" className={styles.s3} />
        </linearGradient>
        {pts.map((p, i) => (
          <clipPath key={i} id={`${id}-c${i}`}>
            <circle cx={p.x} cy={p.y} r="24" />
          </clipPath>
        ))}
      </defs>
      <rect width="640" height="340" className={styles.ground} />
      <path d="M60 340 C 200 280 300 240 380 180 S 540 60 640 30" className={styles.river} />
      <path key={d} d={d} pathLength={100} className={styles.line} stroke={`url(#${id}-l)`} />
      {pts.map((p, i) => {
        const src = urls[photos[i].id];
        return (
          <g key={`${photos[i].id}-${i}`}>
            <circle cx={p.x} cy={p.y} r="29" className={styles.ring} />
            {src ? (
              <image
                href={src}
                x={p.x - 24}
                y={p.y - 24}
                width="48"
                height="48"
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${id}-c${i})`}
              />
            ) : (
              <circle cx={p.x} cy={p.y} r="24" className={styles.ph} />
            )}
            <circle cx={p.x + 18} cy={p.y - 18} r="11" className={styles.badge} />
            <text x={p.x + 18} y={p.y - 14} className={styles.num}>
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
