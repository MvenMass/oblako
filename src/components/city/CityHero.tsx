import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { SceneFrame } from '@/components/scene/SceneFrame';
import { paletteVars, palettesFor } from '@/components/scene/palettes';
import { renderScene } from '@/components/scene';
import { todNow, type Tod } from '@/lib/cityTime';
import { useReducedMotion } from '@/lib/motion';
import { typograph } from '@/lib/typograph';
import { useUserStore } from '@/store/user';
import type { City } from '@/types/city';
import { HeroChips } from './HeroChips';
import { TodSwitch } from './TodSwitch';
import styles from './CityHero.module.css';

/** Первый экран города: живая сцена, штамп прибытия, заголовок, лид и чипы */
export function CityHero({ city }: { city: City }) {
  const reduced = useReducedMotion();
  const [tod, setTod] = useState<Tod>(() => todNow(city.utc));
  const palettes = palettesFor(city);
  const palette = palettes[tod];
  const hero = useRef<HTMLElement>(null);
  const fav = useUserStore((s) => s.favorites.includes(city.id));
  const toggleFav = useUserStore((s) => s.toggleFavorite);

  // Параллакс: --mx/--my от −0,5 до 0,5, слои сдвигаются сами через CSS
  useEffect(() => {
    const el = hero.current;
    if (!el || reduced || !window.matchMedia('(pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    const leave = () => {
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [reduced]);

  const vars = {
    ...paletteVars(palette),
    '--hero-ink': palette.ink,
    '--hero-sub': tod ? 'var(--white)' : city.theme.accent,
  } as CSSProperties;

  return (
    <>
      <section ref={hero} className={styles.hero} style={vars} aria-labelledby="city-title">
        <SceneFrame palettes={palettes} tod={tod}>
          {renderScene(city.id)}
        </SceneFrame>

        <div className={styles.top}>
          <span className={styles.badge}>
            {city.country} · {city.region} · <span className={styles.iata}>{city.iata}</span>
          </span>
          <TodSwitch value={tod} onChange={setTod} />
        </div>

        <svg
          aria-hidden="true"
          className={styles.stamp}
          width="150"
          height="150"
          viewBox="0 0 150 150"
        >
          <circle cx="75" cy="75" r="66" strokeWidth="4" />
          <circle cx="75" cy="75" r="56" strokeWidth="1.5" strokeDasharray="3 4" />
          <text x="75" y="56" className={styles.stampSmall}>
            ПРИБЫТИЕ
          </text>
          <text x="75" y="88" className={styles.stampBig}>
            {city.iata}
          </text>
          <text x="75" y="108" className={styles.stampSmall}>
            OBLAKO
          </text>
        </svg>

        <div className={styles.titleWrap}>
          <h1
            id="city-title"
            className={`${styles.title} ${city.name.length > 8 ? styles.long : ''}`}
            data-dark={tod ? '' : undefined}
          >
            {city.name}
          </h1>
          <p className={styles.greeting}>
            <span lang={city.greeting.lang} className={styles.native}>
              {city.greeting.native}
            </span>
            <span className={styles.translit}>
              {city.greeting.translit}&nbsp;— {city.greeting.ru}
            </span>
          </p>
        </div>

        <div className={styles.card}>
          <p className={styles.lead}>{typograph(city.lead)}</p>
          <div className={styles.actions}>
            <Link to={`/trip?city=${city.id}`} className={styles.primary}>
              Спланировать поездку
              <Icon name="arrow-right" size={18} />
            </Link>
            <button
              type="button"
              className={styles.fav}
              aria-pressed={fav}
              onClick={() => toggleFav(city.id)}
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className={fav ? styles.heartOn : styles.heart}
              >
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
              </svg>
              {fav ? 'В избранном' : 'В избранное'}
            </button>
          </div>
        </div>

        <HeroChips city={city} />
      </section>
      <HeroChips city={city} className={styles.chipsBelow} />
    </>
  );
}
