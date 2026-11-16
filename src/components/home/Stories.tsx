import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import { STORIES } from '@/data/home';
import { useMediaQuery, useReducedMotion } from '@/lib/motion';
import { typograph } from '@/lib/typograph';
import { StoryViewer } from '@/components/ui/StoryViewer';
import styles from './Stories.module.css';

const N = STORIES.length;

/** Смещение карточки от центра по кругу: −3…3 */
function offset(i: number, center: number) {
  let d = i - center;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

/** «Истории путешественников»: coverflow на десктопе, лента со snap на телефоне */
export function Stories() {
  const [center, setCenter] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const phone = useMediaQuery('(max-width: 767px)');
  const cards = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => {
    setOpen((i) => {
      if (i !== null) setTimeout(() => cards.current[i]?.focus(), 0);
      return null;
    });
  }, []);

  const pick = (i: number) => (phone || i === center ? setOpen(i) : setCenter(i));

  return (
    <section className={styles.section} aria-labelledby="st-title">
      <div className="container">
        <SectionHead
          id="st-title"
          eyebrow="Сообщество"
          title={
            <>
              Истории <span className="grad">путешественников</span>
            </>
          }
          action={
            phone ? undefined : (
              <>
                <Button
                  variant="glass"
                  iconOnly
                  aria-label="Предыдущая история"
                  onClick={() => setCenter((c) => (c + N - 1) % N)}
                >
                  <Icon name="chevron-left" />
                </Button>
                <Button
                  variant="dark"
                  iconOnly
                  aria-label="Следующая история"
                  onClick={() => setCenter((c) => (c + 1) % N)}
                >
                  <Icon name="chevron-right" />
                </Button>
              </>
            )
          }
        />
      </div>

      <ul
        className={phone ? styles.strip : styles.flow}
        aria-roledescription="карусель"
        aria-label="Истории"
      >
        {STORIES.map((story, i) => {
          const d = offset(i, center);
          const a = Math.abs(d);
          const style = phone
            ? undefined
            : ({
                transform: `translateX(${d * 250}px) translateZ(${-a * 160}px) rotateY(${d === 0 ? 0 : d > 0 ? -38 : 38}deg)`,
                zIndex: 10 - a,
                opacity: a > 3 ? 0 : 1,
              } as CSSProperties);
          return (
            <li
              key={story.title}
              className={styles.item}
              style={style}
              aria-hidden={!phone && a > 3 ? true : undefined}
            >
              <button
                ref={(el) => {
                  cards.current[i] = el;
                }}
                type="button"
                className={`${styles.card} ${!phone && a ? styles.side : ''}`}
                tabIndex={!phone && a > 3 ? -1 : undefined}
                onClick={() => pick(i)}
              >
                <img
                  src={`/photos/${story.cityId}/${story.photos[0]}.jpg`}
                  alt=""
                  className={styles.photo}
                  loading="lazy"
                />
                <span aria-hidden="true" className={styles.shade} />
                <span className={styles.meta}>
                  <span className={styles.badge}>{story.badge}</span>
                  <span className={styles.title}>{typograph(story.title)}</span>
                  <span className={styles.author}>
                    <span aria-hidden="true" className={styles.avatar} />
                    [Автор]
                  </span>
                </span>
                <span className="visually-hidden">
                  {!phone && d !== 0 ? ', показать историю' : ', открыть историю'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className={`container ${styles.note}`}>
        {typograph(
          phone
            ? 'Пример раздела: здесь появятся рассказы пользователей. Нажмите на карточку, чтобы открыть историю. Фото: Pexels.'
            : 'Пример раздела: здесь появятся рассказы пользователей. Нажмите на центральную карточку, чтобы открыть историю. Фото: Pexels.',
        )}
      </p>

      {open !== null && (
        <StoryViewer
          title={STORIES[open].title}
          slides={STORIES[open].slides.map((text, k) => ({
            src: `/photos/${STORIES[open].cityId}/${STORIES[open].photos[k]}.jpg`,
            text,
          }))}
          reduced={reduced}
          onClose={close}
        />
      )}
    </section>
  );
}
