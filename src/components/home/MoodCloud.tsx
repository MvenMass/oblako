import { useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { SectionHead } from '@/components/ui/SectionHead';
import { MOOD_TAGS } from '@/data/home';
import { formatRub, getCity } from '@/lib/cities';
import { useMediaQuery, useReducedMotion } from '@/lib/motion';
import { plural } from '@/lib/plural';
import { typograph } from '@/lib/typograph';
import { useSphere } from './useSphere';
import styles from './MoodCloud.module.css';

/** «Облако настроений»: сфера из 22 тегов, выбранный тег выдвигает папки городов */
export function MoodCloud() {
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const phone = useMediaQuery('(max-width: 767px)');
  const sphere = useRef<HTMLDivElement>(null);
  useSphere(sphere, MOOD_TAGS.length, phone ? 140 : 230, !reduced, selected);

  const tag = selected > -1 ? MOOD_TAGS[selected] : null;
  const cities = tag ? tag[1].map((id) => getCity(id)!).filter(Boolean) : [];
  const status = tag
    ? `Слово «${tag[0]}»: ${cities.length} ${plural(cities.length, ['направление', 'направления', 'направлений'])}`
    : 'Нажмите на любое слово в облаке';

  return (
    <section className={styles.section} aria-labelledby="cloud-title">
      <span aria-hidden="true" className={styles.aurora} />
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <SectionHead
            id="cloud-title"
            eyebrow={<>Подбор по&nbsp;словам</>}
            title={
              <>
                Облако <span className="grad">настроений</span>
              </>
            }
            lead={typograph(
              'Поймайте слово, которое отзывается, — и мы покажем, куда с ним лететь. Облако крутится и слушается курсора.',
            )}
          />
          <p className={styles.status} aria-live="polite">
            {status}
          </p>
        </div>

        <div ref={sphere} role="group" aria-label="Слова-настроения" className={styles.sphere}>
          <span aria-hidden="true" className={styles.ball} />
          {MOOD_TAGS.map(([word], i) => (
            <button
              key={word}
              type="button"
              data-tag
              aria-pressed={i === selected}
              className={styles.tag}
              onClick={() => setSelected(i === selected ? -1 : i)}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <div className="container">
        <ul className={styles.hits} aria-label="Подходящие направления">
          {cities.map((city, k) => (
            <li key={`${selected}-${city.id}`} className={styles.hit}>
              <Link
                to={`/city/${city.id}`}
                className={styles.folder}
                style={
                  {
                    '--c1': city.theme.folder[0],
                    '--c2': city.theme.folder[1],
                    animationDelay: `${k * 0.08}s`,
                  } as CSSProperties
                }
              >
                <span aria-hidden="true" className={styles.tab} />
                <span className={styles.country}>{city.country}</span>
                <span className={styles.name}>{city.name}</span>
                <span className={styles.note}>
                  от&nbsp;{formatRub(city.quiz.flightRub)} перелёт · демо
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
